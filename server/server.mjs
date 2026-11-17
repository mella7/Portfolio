#!/usr/bin/env node
// Site server with built-in, privacy-friendly visitor statistics.
// No dependencies: Node 20+ only.
//
// It does four things:
//   1. Serves the built site from dist/ with the security headers.
//   2. POST /api/hit      collects page views and events sent by the site.
//   3. GET  /qr[/<code>]  counts a QR-code scan, then redirects to the homepage.
//   4. GET  /stats        a dashboard, unlocked with STATS_TOKEN.
//
// What is stored per hit: time, page, referring site, country (only if a
// proxy supplies it), device type, browser, OS, language, time zone, screen
// width bucket and an anonymous visitor id. The id is a hash of IP address +
// browser + a random salt that is replaced every day, so visits cannot be
// linked across days and the IP address is never written to disk. No cookies.
//
// Configuration (environment variables):
//   PORT             port to listen on                       (default 8080)
//   HOST             address to bind                         (default 0.0.0.0)
//   SITE_DIR         folder with the built site              (default ../dist)
//   DATA_DIR         where hits are stored                   (default ./data)
//   STATS_TOKEN      password for /stats. Unset = dashboard disabled.
//   ALLOWED_ORIGINS  comma-separated origins allowed to POST /api/hit from
//                    another host, e.g. https://mella7.me    (default: same host only)
//   TRUST_PROXY      "1" when behind a reverse proxy or CDN that sets
//                    X-Forwarded-For                         (default off)
//   QR_TARGET        where /qr redirects                     (default /)
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID   send updates to Telegram (see notify.mjs)
//
// On Netlify the same work is done by netlify/functions/ instead.
//
// All of these can also be put in a .env file in the project root.

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { appendFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { BOT, MAX_BODY, describeAgent, firstLanguage, parseHit, qrCode, qrHit, qrRedirect } from "./core.mjs";
import { loadEnv } from "./env.mjs";
import { lastTelegramResult, notifySettings, sendTelegram, startNotifier, telegramConfig, telegramProblem } from "./notify.mjs";
import { summarise } from "./stats.mjs";

loadEnv(); // settings from .env, if present

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";
const SITE_DIR = resolve(process.env.SITE_DIR || join(HERE, "..", "dist"));
const DATA_DIR = resolve(process.env.DATA_DIR || join(HERE, "data"));
const STATS_TOKEN = process.env.STATS_TOKEN || "";
const ALLOWED_ORIGINS = new Set((process.env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim().replace(/\/+$/, "")).filter(Boolean));
const TRUST_PROXY = process.env.TRUST_PROXY === "1";
const QR_TARGET = process.env.QR_TARGET || "/";
const HITS_PER_MINUTE = 120;
const AUTH_TRIES_PER_MINUTE = 10;

mkdirSync(DATA_DIR, { recursive: true });

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".pdf": "application/pdf",
};

// The same policy the build writes into the pages; the dashboard uses it too.
const CSP = [
  "default-src 'self'", "script-src 'self'", "style-src 'self'", "img-src 'self' data:", "font-src 'self'",
  "connect-src 'self'", "form-action 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = {
  "Content-Security-Policy": CSP,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

// ------------------------------------------------------------ visitor id

// A random salt per UTC day. It lives in DATA_DIR so a restart during the day
// keeps counting the same visitors once, and is overwritten at midnight.
const saltFile = join(DATA_DIR, "salt.json");
let salt = { day: "", value: "" };
function dailySalt() {
  const day = new Date().toISOString().slice(0, 10);
  if (salt.day === day) return salt.value;
  try {
    const saved = JSON.parse(readFileSync(saltFile, "utf8"));
    if (saved.day === day && typeof saved.value === "string") return (salt = saved).value;
  } catch {
    /* no salt yet */
  }
  salt = { day, value: randomBytes(32).toString("hex") };
  writeFileSync(saltFile, JSON.stringify(salt), { mode: 0o600 });
  return salt.value;
}

function clientIp(request) {
  if (TRUST_PROXY) {
    const forwarded = request.headers["cf-connecting-ip"] || String(request.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (forwarded) return String(forwarded);
  }
  return request.socket.remoteAddress || "";
}

const visitorId = (request) =>
  createHash("sha256").update(`${dailySalt()}|${clientIp(request)}|${request.headers["user-agent"] || ""}`).digest("hex").slice(0, 16);

// ------------------------------------------------------- request details

// Country only if something in front of this server already worked it out.
function country(request) {
  const direct = request.headers["cf-ipcountry"] || request.headers["x-vercel-ip-country"] || request.headers["x-country-code"];
  if (direct && /^[A-Za-z]{2}$/.test(String(direct))) return String(direct).toUpperCase();
  const netlify = request.headers["x-nf-geo"];
  if (netlify) {
    try {
      const code = JSON.parse(Buffer.from(String(netlify), "base64").toString("utf8"))?.country?.code;
      if (/^[A-Za-z]{2}$/.test(code)) return code.toUpperCase();
    } catch {
      /* ignore a malformed header */
    }
  }
  return "";
}

// ----------------------------------------------------------------- storage

let writing = Promise.resolve();
function store(record) {
  const file = join(DATA_DIR, `hits-${record.ts.slice(0, 7)}.jsonl`);
  writing = writing.then(() => appendFile(file, JSON.stringify(record) + "\n", { mode: 0o600 })).catch((error) => {
    console.error("could not store hit:", error.message);
  });
}

// IP addresses are kept for STATS_IP_DAYS days (default 30), then removed
// from the stored hits. Runs at start and every hour.
const IP_DAYS = Number(process.env.STATS_IP_DAYS) > 0 ? Number(process.env.STATS_IP_DAYS) : 30;
async function scrubOldIps() {
  const cutoff = new Date(Date.now() - IP_DAYS * 86_400_000).toISOString();
  await writing; // let pending writes finish first
  for (const name of readdirSync(DATA_DIR)) {
    if (!/^hits-\d{4}-\d{2}\.jsonl$/.test(name) || name.slice(5, 12) > cutoff.slice(0, 7)) continue;
    const file = join(DATA_DIR, name);
    const text = readFileSync(file, "utf8");
    if (!text.includes('"ip":')) continue;
    let changed = false;
    const lines = text.split("\n").map((line) => {
      if (!line.includes('"ip":')) return line;
      try {
        const hit = JSON.parse(line);
        if (hit.ts >= cutoff) return line;
        delete hit.ip;
        changed = true;
        return JSON.stringify(hit);
      } catch {
        return line;
      }
    });
    if (changed) writeFileSync(file, lines.join("\n"), { mode: 0o600 });
  }
}

function loadHits(sinceMs) {
  const hits = [];
  const firstMonth = new Date(sinceMs).toISOString().slice(0, 7);
  for (const name of readdirSync(DATA_DIR).sort()) {
    const match = /^hits-(\d{4}-\d{2})\.jsonl$/.exec(name);
    if (!match || match[1] < firstMonth) continue;
    for (const line of readFileSync(join(DATA_DIR, name), "utf8").split("\n")) {
      if (!line) continue;
      try {
        const hit = JSON.parse(line);
        if (Date.parse(hit.ts) >= sinceMs) hits.push(hit);
      } catch {
        /* skip a damaged line */
      }
    }
  }
  return hits;
}

// ---------------------------------------------------------- rate limiting

function limiter(limit) {
  const counts = new Map();
  setInterval(() => counts.clear(), 60_000).unref();
  return (key) => {
    const used = (counts.get(key) || 0) + 1;
    counts.set(key, used);
    return used <= limit;
  };
}
const allowHit = limiter(HITS_PER_MINUTE);
const allowAuthTry = limiter(AUTH_TRIES_PER_MINUTE);

// -------------------------------------------------------------- recording

let notifier = null; // set when the server starts, if Telegram is configured

function record(request, fields) {
  const ua = String(request.headers["user-agent"] || "");
  if (!ua || BOT.test(ua)) return;
  const id = visitorId(request);
  if (!allowHit(id)) return;
  const hit = {
    ts: new Date().toISOString(),
    id,
    ip: clientIp(request).replace(/^::ffff:/, "").slice(0, 45),
    country: country(request),
    ...describeAgent(ua),
    lang: firstLanguage(request.headers["accept-language"]),
    ...fields,
  };
  store(hit);
  notifier?.visitor(hit);
}

function readBody(request) {
  return new Promise((resolveBody, reject) => {
    let size = 0;
    const chunks = [];
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error("too large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function originAllowed(request) {
  const origin = String(request.headers.origin || "").replace(/\/+$/, "");
  if (!origin) return true; // same-origin navigations and beacons may omit it
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}

function corsHeaders(request) {
  const origin = String(request.headers.origin || "").replace(/\/+$/, "");
  return ALLOWED_ORIGINS.has(origin)
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" }
    : {};
}

async function handleHit(request, response) {
  if (!originAllowed(request)) return send(response, 403, "forbidden");
  let payload;
  try {
    payload = JSON.parse(await readBody(request));
  } catch {
    return send(response, 400, "bad request", corsHeaders(request));
  }
  const fields = parseHit(payload);
  if (fields) record(request, fields);
  response.writeHead(204, { ...corsHeaders(request), "Cache-Control": "no-store" }).end();
}

// The QR-code link: count the scan on the server, then always go home.
function handleQr(request, response, url) {
  const code = qrCode(url);
  record(request, qrHit(code));
  response.writeHead(302, { Location: qrRedirect(QR_TARGET, code), "Cache-Control": "no-store", ...SECURITY_HEADERS }).end();
}

// --------------------------------------------------------------- dashboard

function authorised(request) {
  if (!STATS_TOKEN) return false;
  const given = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  // Compare digests so the comparison takes the same time for any input.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(STATS_TOKEN).digest();
  return timingSafeEqual(a, b);
}

async function handleStats(request, response, url) {
  if (!STATS_TOKEN) return json(response, 503, { error: "Statistics are disabled: set STATS_TOKEN to enable them." });
  if (!allowAuthTry(clientIp(request))) return json(response, 429, { error: "Too many attempts. Wait a minute." });
  if (!authorised(request)) return json(response, 401, { error: "Wrong token." });

  if (request.method === "POST") {
    const body = await readBody(request).catch(() => "");
    let action = "";
    try {
      action = JSON.parse(body).action;
    } catch {
      /* not JSON */
    }
    if (action !== "telegram-test") return json(response, 400, { error: "Unknown action." });
    const config = telegramConfig();
    if (!config) return json(response, 200, { ok: false, description: telegramProblem(), hint: "Fix the variable, then restart the server." });
    return json(response, 200, await sendTelegram(config, "Test message from your statistics dashboard. Telegram works."));
  }

  const days = Math.min(365, Math.max(1, Number(url.searchParams.get("days")) || 30));
  const settings = notifySettings();
  json(response, 200, {
    ...summarise(loadHits(Date.now() - days * 86_400_000), days),
    telegram: { problem: telegramProblem(), last: lastTelegramResult(), newVisitors: settings.newVisitors, everyDays: settings.everyDays, lastSummary: null },
  });
}

// ------------------------------------------------------------ static files

function fileFor(root, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decoded.includes("\0")) return null;
  let file = join(root, normalize(decoded));
  if (file !== root && !file.startsWith(root + sep)) return null; // never leave the folder
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

function serveFile(response, file, status = 200) {
  const immutable = /[/\\](assets|fonts)[/\\]/.test(file);
  response.writeHead(status, {
    "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
    "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "public, max-age=300",
    ...SECURITY_HEADERS,
  });
  createReadStream(file).pipe(response);
}

const send = (response, status, text, headers = {}) =>
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", ...SECURITY_HEADERS, ...headers }).end(text);
const json = (response, status, data) =>
  response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store", ...SECURITY_HEADERS }).end(JSON.stringify(data));

// ------------------------------------------------------------------ router

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", "http://localhost");
    const path = url.pathname;

    if (path === "/api/hit") {
      if (request.method === "OPTIONS") return response.writeHead(204, corsHeaders(request)).end();
      if (request.method === "POST") return await handleHit(request, response);
      return send(response, 405, "method not allowed");
    }
    if (path === "/api/stats") {
      if (!["GET", "POST"].includes(request.method)) return send(response, 405, "method not allowed");
      return await handleStats(request, response, url);
    }
    if (request.method !== "GET" && request.method !== "HEAD") return send(response, 405, "method not allowed");

    if (path === "/qr" || path.startsWith("/qr/")) return handleQr(request, response, url);
    if (path === "/stats" || path === "/stats/") return serveFile(response, join(HERE, "dashboard", "index.html"));
    if (path.startsWith("/stats/")) {
      const asset = fileFor(join(HERE, "dashboard"), path.slice("/stats".length));
      return asset ? serveFile(response, asset) : send(response, 404, "not found");
    }

    const file = fileFor(SITE_DIR, path);
    if (file) return serveFile(response, file);
    // The "not found" page in the language of the address, English otherwise.
    const langDir = /^\/(fr|de)(\/|$)/.exec(path)?.[1] ?? "";
    const localNotFound = join(SITE_DIR, langDir, "404.html");
    const notFound = existsSync(localNotFound) ? localNotFound : join(SITE_DIR, "404.html");
    return existsSync(notFound) ? serveFile(response, notFound, 404) : send(response, 404, "not found");
  } catch (error) {
    console.error("request failed:", error.message);
    if (!response.headersSent) send(response, 500, "server error");
    else response.end();
  }
});

server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.listen(PORT, HOST, () => {
  console.log(`Site:  http://localhost:${PORT}   (serving ${SITE_DIR})`);
  console.log(STATS_TOKEN ? `Stats: http://localhost:${PORT}/stats` : "Stats: disabled (set STATS_TOKEN to enable the dashboard)");
  if (STATS_TOKEN && STATS_TOKEN.length < 16) console.warn("Warning: STATS_TOKEN is short. Use at least 16 characters (npm run passkey).");
  notifier = startNotifier({ loadHits, dataDir: DATA_DIR });
  const scrub = () => scrubOldIps().catch((error) => console.error("ip clean-up:", error.message));
  scrub();
  setInterval(scrub, 3_600_000).unref();
  console.log(
    notifier
      ? `Telegram: summary every ${notifier.settings.everyDays} days${notifier.settings.newVisitors ? ", plus a message per new visitor" : ""}`
      : "Telegram: off (set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)",
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => writing.finally(() => process.exit(0)));
  });
}
