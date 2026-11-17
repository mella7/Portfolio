// Turns the stored hits into the numbers the dashboard shows.
// Pure functions: no I/O, so they are easy to test.

const TOP = 15;

function top(counts, limit = TOP) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

const bump = (map, key, by = 1) => {
  if (key) map.set(key, (map.get(key) || 0) + by);
};

/**
 * @param {object[]} hits  records written by server.mjs
 * @param {number} days    length of the period, for the per-day series
 */
export function summarise(hits, days) {
  const tables = Object.fromEntries(
    ["pages", "referrers", "sources", "countries", "devices", "browsers", "systems", "languages", "timezones", "screens",
     "events", "downloads", "outbound", "terminal", "sections", "qrCodes", "appearance", "ips", "siteLanguages"].map((name) => [name, new Map()]),
  );
  const perDay = new Map();
  const dayOf = (hit) => hit.ts.slice(0, 10);
  const visitorsByDay = new Map();
  const seconds = [];
  const recent = [];

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    perDay.set(day, { day, visitors: 0, views: 0, qr: 0 });
  }

  let views = 0;
  let qrScans = 0;
  let resumeDownloads = 0;
  let messages = 0;

  for (const hit of hits) {
    const day = dayOf(hit);
    const slot = perDay.get(day);
    if (!visitorsByDay.has(day)) visitorsByDay.set(day, new Set());
    visitorsByDay.get(day).add(hit.id);

    if (hit.type === "view") {
      views++;
      if (slot) slot.views++;
      bump(tables.pages, hit.path);
      bump(tables.referrers, hit.ref || "Direct or unknown");
      bump(tables.sources, hit.src);
      bump(tables.countries, hit.country || "Unknown");
      bump(tables.devices, hit.device);
      bump(tables.browsers, hit.browser);
      bump(tables.systems, hit.os);
      bump(tables.languages, hit.lang);
      bump(tables.timezones, hit.tz);
      bump(tables.screens, hit.screen);
      bump(tables.ips, hit.ip);
      bump(tables.siteLanguages, /^\/fr(\/|$)/.test(hit.path) ? "French" : /^\/de(\/|$)/.test(hit.path) ? "German" : "English");
      recent.push({
        ts: hit.ts, path: hit.path, ip: hit.ip || "", country: hit.country || "", device: hit.device, browser: hit.browser,
        os: hit.os, lang: hit.lang || "", ref: hit.ref || "", src: hit.src || "",
      });
      continue;
    }

    const data = hit.data || {};
    bump(tables.events, hit.name);
    switch (hit.name) {
      case "qr-scan":
        qrScans++;
        if (slot) slot.qr++;
        bump(tables.qrCodes, data.code || "qr");
        bump(tables.countries, hit.country || "Unknown");
        break;
      case "download":
        bump(tables.downloads, data.file);
        if (/resume/i.test(data.file || "")) resumeDownloads++;
        break;
      case "outbound":
        bump(tables.outbound, data.url);
        break;
      case "terminal":
        bump(tables.terminal, data.cmd);
        break;
      case "section":
        bump(tables.sections, data.id);
        break;
      case "appearance":
        bump(tables.appearance, data.value);
        break;
      case "contact":
        messages++;
        break;
      case "leave": {
        const s = Number(data.seconds);
        if (s > 0 && s < 3600) seconds.push(s);
        break;
      }
      default:
    }
  }

  let visitors = 0;
  for (const [day, ids] of visitorsByDay) {
    visitors += ids.size;
    const slot = perDay.get(day);
    if (slot) slot.visitors = ids.size;
  }
  seconds.sort((a, b) => a - b);

  return {
    generatedAt: new Date().toISOString(),
    days,
    totals: {
      visitors, // unique per day, added up: the id changes daily by design
      views,
      qrScans,
      resumeDownloads,
      messages,
      medianSeconds: seconds.length ? seconds[Math.floor(seconds.length / 2)] : 0,
    },
    perDay: [...perDay.values()],
    tables: Object.fromEntries(Object.entries(tables).map(([name, map]) => [name, top(map)])),
    recent: recent.slice(-100).reverse(),
  };
}
