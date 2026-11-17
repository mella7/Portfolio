// The globe on /travel: a dithered, draggable planet with the visited
// countries lit in the accent colour. No libraries: the sphere is ray-cast
// per pixel on a small canvas and scaled up with crisp pixels.
//
// How it works
//   1. Country outlines (a compact GeoJSON-like file) are painted once into
//      two flat maps: all land, and visited land.
//   2. Every frame, each pixel inside the disc is turned into a point on the
//      sphere, rotated back to longitude/latitude, and looked up in the maps.
//   3. A 4x4 Bayer pattern and a light direction decide which pixels are lit,
//      which gives the same dot-matrix shading as the avatar.

import { $, $$, clamp, reduceMotion, root, ui } from "./util.js";

const MAP_W = 1024;
const MAP_H = 512;
const CELL = 3; // screen pixels per globe pixel
const DEG = Math.PI / 180;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const LIGHT = normalize([-0.45, 0.55, 0.7]);
const SPIN = 7; // degrees per second when idle

// Places too small to appear in the outline data.
const EXTRA_POINTS = { "Hong Kong": [114.17, 22.32], "Vatican City": [12.45, 41.9] };

function normalize([x, y, z]) {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

function hexToRgb(value) {
  const hex = value.trim().replace("#", "");
  const full = hex.length === 3 ? hex.replace(/./g, "$&$&") : hex;
  const n = parseInt(full, 16);
  return Number.isNaN(n) ? [128, 128, 128] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const mix = (a, b, t) => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));

/** Paint a set of countries, white on black, into an equirectangular map. */
function paintMap(countries) {
  const canvas = document.createElement("canvas");
  canvas.width = MAP_W;
  canvas.height = MAP_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#fff";
  for (const country of countries) {
    for (const ring of country.rings) {
      // A ring that crosses the date line is drawn twice, shifted by a full turn.
      let crosses = false;
      for (let i = 2; i < ring.length; i += 2) if (Math.abs(ring[i] - ring[i - 2]) > 180) crosses = true;
      for (const shift of crosses ? [0, -360] : [0]) {
        ctx.beginPath();
        for (let i = 0; i < ring.length; i += 2) {
          let lon = ring[i];
          if (crosses && lon < 0) lon += 360;
          const x = ((lon + shift + 180) / 360) * MAP_W;
          const y = ((90 - ring[i + 1]) / 180) * MAP_H;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  const pixels = ctx.getImageData(0, 0, MAP_W, MAP_H).data;
  const mask = new Uint8Array(MAP_W * MAP_H);
  for (let i = 0; i < mask.length; i++) mask[i] = pixels[i * 4] > 127 ? 1 : 0;
  return mask;
}

function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
    const xi = ring[i], yi = ring[i + 1], xj = ring[j], yj = ring[j + 1];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export async function initGlobe() {
  const wrap = $("[data-globe]");
  if (!wrap) return;
  const canvas = $("canvas", wrap);
  const tooltip = $("[data-globe-tip]", wrap);
  const ctx = canvas.getContext("2d");
  const visitedNames = JSON.parse(wrap.dataset.visited);
  const visitedSet = new Set(visitedNames);
  // Country names in the page's language, keyed by the English name.
  let localName = {};
  try {
    localName = JSON.parse(wrap.dataset.names || "{}");
  } catch {
    /* English names it is */
  }

  let world;
  try {
    const response = await fetch(wrap.dataset.world);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    world = await response.json();
  } catch {
    wrap.classList.add("is-failed");
    return;
  }

  // Bounding boxes speed up the "which country is under the pointer" test.
  for (const country of world) {
    let minX = 180, maxX = -180, minY = 90, maxY = -90, best = 0;
    for (const ring of country.rings) {
      for (let i = 0; i < ring.length; i += 2) {
        minX = Math.min(minX, ring[i]); maxX = Math.max(maxX, ring[i]);
        minY = Math.min(minY, ring[i + 1]); maxY = Math.max(maxY, ring[i + 1]);
      }
      if (ring.length > best) {
        best = ring.length;
        let sx = 0, sy = 0;
        for (let i = 0; i < ring.length; i += 2) { sx += ring[i]; sy += ring[i + 1]; }
        country.centre = [sx / (ring.length / 2), sy / (ring.length / 2)];
      }
    }
    country.box = [minX, minY, maxX, maxY];
  }
  const byName = new Map(world.map((country) => [country.name, country]));
  const land = paintMap(world);
  const visited = paintMap(world.filter((country) => visitedSet.has(country.name)));
  const extra = visitedNames.filter((name) => EXTRA_POINTS[name]).map((name) => ({ name, at: EXTRA_POINTS[name] }));

  // View: the longitude and latitude at the centre of the disc.
  let lon = 12;
  let lat = 32;
  let goal = null; // { lon, lat } while flying to a country
  let dragging = false;
  let size = 0;
  let image = null;
  let colours = readColours();
  let last = performance.now();
  let visible = true;

  function readColours() {
    const style = getComputedStyle(root);
    const get = (name) => hexToRgb(style.getPropertyValue(name));
    const bg = get("--bg");
    const accent = get("--a");
    const muted = get("--muted");
    return {
      seaDark: bg,
      seaLight: mix(bg, muted, 0.22),
      landDark: mix(bg, muted, 0.35),
      landLight: mix(bg, muted, 0.95),
      visitDark: mix(accent, bg, 0.45),
      visitLight: accent,
      grid: mix(bg, muted, 0.4),
    };
  }

  function resize() {
    const box = Math.floor(Math.min(wrap.clientWidth, window.innerHeight * 0.72, 640));
    size = Math.max(60, Math.floor(box / CELL));
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size * CELL}px`;
    canvas.style.height = `${size * CELL}px`;
    image = ctx.createImageData(size, size);
  }

  /** Longitude/latitude under a canvas pixel, or null outside the disc. */
  function unproject(px, py) {
    const r = size / 2;
    const x = (px + 0.5 - r) / (r - 1);
    const y = (r - (py + 0.5)) / (r - 1);
    const d = x * x + y * y;
    if (d > 1) return null;
    const z = Math.sqrt(1 - d);
    // Undo the tilt (rotation about the x axis), then the spin.
    const sinT = Math.sin(lat * DEG), cosT = Math.cos(lat * DEG);
    const y2 = y * cosT + z * sinT;
    const z2 = -y * sinT + z * cosT;
    return { lon: lon + Math.atan2(x, z2) / DEG, lat: Math.asin(clamp(y2, -1, 1)) / DEG, x, y, z };
  }

  function render() {
    const data = image.data;
    const c = colours;
    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const o = (py * size + px) * 4;
        const point = unproject(px, py);
        if (!point) {
          data[o + 3] = 0;
          continue;
        }
        let pLon = ((point.lon + 180) % 360 + 360) % 360;
        const mx = Math.min(MAP_W - 1, Math.floor((pLon / 360) * MAP_W));
        const my = Math.min(MAP_H - 1, Math.floor(((90 - point.lat) / 180) * MAP_H));
        const index = my * MAP_W + mx;

        const lightness = clamp(0.25 + 0.85 * (point.x * LIGHT[0] + point.y * LIGHT[1] + point.z * LIGHT[2]), 0, 1);
        const lit = lightness * 16 > BAYER[(py & 3) * 4 + (px & 3)] + 0.5;

        let colour;
        if (visited[index]) colour = lit ? c.visitLight : c.visitDark;
        else if (land[index]) colour = lit ? c.landLight : c.landDark;
        else {
          // Sea: a faint grid every 20 degrees, otherwise dark with a sparse sparkle.
          const onGrid = Math.abs(((point.lon % 20) + 20) % 20 - 10) > 9.55 || Math.abs(((point.lat % 20) + 20) % 20 - 10) > 9.55;
          colour = onGrid && ((px + py) & 1) ? c.grid : lit && BAYER[(py & 3) * 4 + (px & 3)] === 0 ? c.seaLight : c.seaDark;
        }
        data[o] = colour[0];
        data[o + 1] = colour[1];
        data[o + 2] = colour[2];
        data[o + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);

    // Markers for visited places that are too small to have an outline.
    ctx.fillStyle = `rgb(${c.visitLight.join(",")})`;
    for (const place of extra) {
      const at = project(place.at[0], place.at[1]);
      if (at) ctx.fillRect(Math.round(at[0]) - 1, Math.round(at[1]) - 1, 3, 3);
    }
  }

  /** Canvas position of a longitude/latitude, or null on the far side. */
  function project(pLon, pLat) {
    const l = (pLon - lon) * DEG;
    const p = pLat * DEG;
    const x = Math.cos(p) * Math.sin(l);
    const y0 = Math.sin(p);
    const z0 = Math.cos(p) * Math.cos(l);
    const sinT = Math.sin(lat * DEG), cosT = Math.cos(lat * DEG);
    const y = y0 * cosT - z0 * sinT;
    const z = y0 * sinT + z0 * cosT;
    if (z < 0) return null;
    const r = size / 2;
    return [r + x * (r - 1), r - y * (r - 1)];
  }

  function countryAt(pLon, pLat) {
    const l = ((pLon + 180) % 360 + 360) % 360 - 180;
    for (const place of extra) if (Math.hypot(place.at[0] - l, place.at[1] - pLat) < 1.2) return place.name;
    for (const country of world) {
      const [minX, minY, maxX, maxY] = country.box;
      if (l < minX || l > maxX || pLat < minY || pLat > maxY) continue;
      if (country.rings.some((ring) => pointInRing(l, pLat, ring))) return country.name;
    }
    return null;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    if (goal) {
      const dLon = ((goal.lon - lon + 540) % 360) - 180; // shortest way round
      lon += dLon * Math.min(1, dt * 4);
      lat += (goal.lat - lat) * Math.min(1, dt * 4);
      if (Math.abs(dLon) < 0.2 && Math.abs(goal.lat - lat) < 0.2) goal = null;
    } else if (!dragging && !reduceMotion) {
      lon += SPIN * dt;
    }
    render();
  }

  // ---- interaction: drag to turn, hover for the country name ----
  let startX = 0, startY = 0, startLon = 0, startLat = 0;
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    goal = null;
    startX = event.clientX; startY = event.clientY; startLon = lon; startLat = lat;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-dragging");
  });
  canvas.addEventListener("pointermove", (event) => {
    if (dragging) {
      const scale = 110 / (size * CELL);
      lon = startLon - (event.clientX - startX) * scale;
      lat = clamp(startLat + (event.clientY - startY) * scale, -70, 70);
      tooltip.hidden = true;
      return;
    }
    const box = canvas.getBoundingClientRect();
    const point = unproject(((event.clientX - box.left) / box.width) * size, ((event.clientY - box.top) / box.height) * size);
    const name = point && countryAt(point.lon, point.lat);
    if (!name) {
      tooltip.hidden = true;
      return;
    }
    const label = localName[name] ?? name;
    tooltip.textContent = visitedSet.has(name) ? `${label} · ${ui("visited")}` : label;
    tooltip.classList.toggle("is-visited", visitedSet.has(name));
    tooltip.hidden = false;
    const wrapBox = wrap.getBoundingClientRect();
    tooltip.style.left = `${event.clientX - wrapBox.left + 14}px`;
    tooltip.style.top = `${event.clientY - wrapBox.top + 14}px`;
  });
  const release = () => {
    dragging = false;
    canvas.classList.remove("is-dragging");
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("pointerleave", () => (tooltip.hidden = true));

  // Keyboard: arrow keys turn the globe.
  canvas.addEventListener("keydown", (event) => {
    const step = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, 8], ArrowDown: [0, -8] }[event.key];
    if (!step) return;
    event.preventDefault();
    goal = { lon: (goal?.lon ?? lon) + step[0], lat: clamp((goal?.lat ?? lat) + step[1], -70, 70) };
  });

  // The country buttons under the globe fly to that country.
  for (const button of $$("[data-country]")) {
    button.addEventListener("click", () => {
      const name = button.dataset.country;
      const centre = EXTRA_POINTS[name] ?? byName.get(name)?.centre;
      if (!centre) return;
      goal = { lon: centre[0], lat: clamp(centre[1], -70, 70) };
      for (const other of $$("[data-country]")) other.classList.toggle("is-active", other === button);
      canvas.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  }

  document.addEventListener("appearance:change", () => (colours = readColours()));
  document.addEventListener("visibilitychange", () => (visible = !document.hidden));
  window.addEventListener("resize", resize);

  resize();
  wrap.classList.add("is-ready");
  requestAnimationFrame(frame);
}
