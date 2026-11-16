// Opening animation on the homepage.
//
//   1. Loose pixels fly in and assemble the "mella7." wordmark (the same
//      dot-matrix look as the dithered avatar), while a short deployment log
//      types underneath.
//   2. The pixels burst outwards and eight shutters lift, one after another,
//      to reveal the bento grid, whose cards then arrive.
//
// boot.js decides whether it plays (first visit in a tab, motion allowed).
// A click or any key skips straight to the reveal.

import { $, clamp, root } from "./util.js";

const WORD = "mella7.";
const LOG = [
  [["", "$ kubectl apply -f mella7.yaml"]],
  [["", "deployment.apps/platforms "], ["ok", "configured"]],
  [["", "deployment.apps/security "], ["ok", "configured"]],
  [["", "pod/mohamed-ali-0  1/1  "], ["ok", "Running"]],
];
const ASSEMBLE = 1150; // ms for the pixels to settle
const HOLD = 420;
const BURST = 380;
const SHUTTER = 900; // ms until the last shutter is gone

const easeOut = (t) => 1 - (1 - t) ** 3;

/** Sample the wordmark into a list of pixel targets, centred in the canvas. */
function wordTargets(width, height) {
  const size = clamp(width * 0.17, 56, 190);
  const step = size > 120 ? 6 : 4;
  const off = document.createElement("canvas");
  off.width = Math.ceil(size * 4.6);
  off.height = Math.ceil(size * 1.4);
  const ctx = off.getContext("2d", { willReadFrequently: true });
  ctx.font = `800 ${size}px "Cabinet Grotesk", "Arial Narrow", Arial, sans-serif`;
  ctx.textBaseline = "middle";
  const textWidth = ctx.measureText(WORD).width;
  const accentFrom = ctx.measureText(WORD.slice(0, -2)).width; // the "7." is accent-coloured
  ctx.fillStyle = "#fff";
  ctx.fillText(WORD, 0, off.height / 2);

  const data = ctx.getImageData(0, 0, off.width, off.height).data;
  const left = (width - textWidth) / 2;
  const top = height * 0.42 - off.height / 2;
  const targets = [];
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < Math.min(off.width, textWidth + step); x += step) {
      if (data[(y * off.width + x) * 4 + 3] > 128) {
        targets.push({ x: left + x, y: top + y, accent: x >= accentFrom });
      }
    }
  }
  return { targets, step };
}

export function initIntro() {
  const boot = $("#boot");
  if (!boot || !root.classList.contains("booting")) return;
  root.classList.add("boot-started");

  const canvas = $("#boot-canvas");
  const log = $("#boot-log");
  const bar = $("#boot-bar");
  const ctx = canvas.getContext("2d");
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);

  const accent = getComputedStyle(root).getPropertyValue("--a-base").trim() || "#e63946";
  let particles = [];
  let dot = 4;
  let startedAt = 0;
  let burstAt = 0;
  let raf = 0;
  let finished = false;
  const timers = [];

  function build() {
    const { targets, step } = wordTargets(width, height);
    dot = step - 1;
    const centreX = width / 2;
    const centreY = height * 0.42;
    particles = targets.map((target) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.max(width, height) * (0.45 + Math.random() * 0.5);
      return {
        tx: target.x,
        ty: target.y,
        sx: centreX + Math.cos(angle) * distance,
        sy: centreY + Math.sin(angle) * distance,
        // Left-to-right wave, with a little randomness so it shimmers.
        delay: ((target.x - (centreX - width * 0.4)) / (width * 0.8)) * 0.45 + Math.random() * 0.18,
        vx: (target.x - centreX) * (2.2 + Math.random() * 2),
        vy: (target.y - centreY) * (3 + Math.random() * 3) - 60,
        accent: target.accent,
      };
    });
  }

  function draw(now) {
    raf = requestAnimationFrame(draw);
    const elapsed = now - startedAt;
    ctx.clearRect(0, 0, width, height);
    const bursting = burstAt > 0;
    const burst = bursting ? (now - burstAt) / BURST : 0;
    ctx.globalAlpha = bursting ? clamp(1 - burst, 0, 1) : 1;

    for (const p of particles) {
      let x;
      let y;
      if (bursting) {
        x = p.tx + p.vx * burst * 0.6;
        y = p.ty + p.vy * burst * 0.6;
      } else {
        const t = easeOut(clamp((elapsed / ASSEMBLE - p.delay) / (1 - 0.63), 0, 1));
        x = p.sx + (p.tx - p.sx) * t;
        y = p.sy + (p.ty - p.sy) * t;
      }
      ctx.fillStyle = p.accent ? accent : "#f7f7f7";
      ctx.fillRect(Math.round(x), Math.round(y), dot, dot);
    }
    if (bursting && burst >= 1) cancelAnimationFrame(raf);
  }

  function open() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    window.removeEventListener("keydown", open);
    try {
      sessionStorage.setItem("booted", "1");
    } catch {
      /* it will simply play again next time */
    }
    burstAt = performance.now();
    boot.classList.add("is-open");
    root.classList.add("boot-reveal"); // cards start arriving behind the shutters
    window.setTimeout(() => {
      cancelAnimationFrame(raf);
      root.classList.remove("booting", "boot-reveal", "boot-started");
    }, SHUTTER);
  }

  function play() {
    if (finished) return;
    build();
    startedAt = performance.now();
    raf = requestAnimationFrame(draw);

    LOG.forEach((parts, index) => {
      timers.push(
        window.setTimeout(() => {
          for (const [cls, text] of parts) {
            const span = document.createElement("span");
            if (cls) span.className = cls;
            span.textContent = text;
            log.append(span);
          }
          log.append("\n");
          bar.style.transform = `scaleX(${(index + 1) / LOG.length})`;
        }, 250 + index * ((ASSEMBLE - 150) / LOG.length)),
      );
    });
    timers.push(window.setTimeout(open, ASSEMBLE + HOLD));
  }

  boot.addEventListener("click", open);
  window.addEventListener("keydown", open);

  // Wait briefly for the display font so the wordmark is drawn in it.
  const fontReady = document.fonts?.load ? document.fonts.load('800 100px "Cabinet Grotesk"') : Promise.resolve();
  Promise.race([fontReady, new Promise((resolve) => window.setTimeout(resolve, 500))]).then(play, play);
}
