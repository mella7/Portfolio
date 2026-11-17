// Visitor statistics on Netlify: the same records server.mjs writes, kept in
// Netlify Blobs (store "stats") instead of files.
//
//   raw/<time>-<random>    one hit, as it arrives (one key per hit, so
//                          visitors arriving together never overwrite each other)
//   hits/YYYY-MM-DD        one JSON line per hit: report.mjs moves the raw
//                          hits in here every hour
//   salt/YYYY-MM-DD        that day's random salt for the visitor ids
//   seen/YYYY-MM-DD/<id>   visitors already announced on Telegram that day
//   state/notify           when the last Telegram summary went out
//   state/telegram         what Telegram answered the last time
//
// Salts and "seen" markers are deleted after two days by report.mjs. IP
// addresses are kept with each hit for STATS_IP_DAYS days (default 30), then
// report.mjs removes them from the stored hits.

import { createHash, randomBytes } from "node:crypto";

import { getStore } from "@netlify/blobs";

import { BOT, clean, describeAgent, firstLanguage } from "../../server/core.mjs";
import {
  newVisitorText, notifySettings, sendTelegram, telegramConfig, telegramProblem,
} from "../../server/notify.mjs";

export const DAY = 86_400_000;
export const dayOf = (ms = Date.now()) => new Date(ms).toISOString().slice(0, 10);
export const statsStore = () => getStore({ name: "stats", consistency: "strong" });

// ----------------------------------------------------------- responses

const CSP = [
  "default-src 'self'", "script-src 'self'", "style-src 'self'", "img-src 'self' data:", "font-src 'self'",
  "connect-src 'self'", "form-action 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'",
].join("; ");

export const SECURITY_HEADERS = {
  "Content-Security-Policy": CSP,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store",
};

export const text = (status, body, headers = {}) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", ...SECURITY_HEADERS, ...headers } });
export const json = (status, data) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...SECURITY_HEADERS } });

// --------------------------------------------------------- rate limits

/** Per function instance, which is enough to stop one noisy client. */
export function limiter(perMinute) {
  let window = 0;
  let counts = new Map();
  return (key) => {
    const now = Math.floor(Date.now() / 60_000);
    if (now !== window) {
      window = now;
      counts = new Map();
    }
    const used = (counts.get(key) || 0) + 1;
    counts.set(key, used);
    return used <= perMinute;
  };
}
const allowHit = limiter(120);

// -------------------------------------------------------------- origins

const allowedOrigins = () =>
  new Set((process.env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim().replace(/\/+$/, "")).filter(Boolean));

export function originAllowed(request) {
  const origin = (request.headers.get("origin") || "").replace(/\/+$/, "");
  if (!origin) return true; // same-origin beacons may omit it
  if (allowedOrigins().has(origin)) return true;
  try {
    const host = new URL(origin).host;
    return host === new URL(request.url).host || host === request.headers.get("host");
  } catch {
    return false;
  }
}

export function corsHeaders(request) {
  const origin = (request.headers.get("origin") || "").replace(/\/+$/, "");
  return allowedOrigins().has(origin)
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" }
    : {};
}

// ---------------------------------------------------------- visitor id

let salt = { day: "", value: "" };
async function dailySalt(store) {
  const day = dayOf();
  if (salt.day === day) return salt.value;
  const key = `salt/${day}`;
  // The first instance of the day creates it; every other one reads that one.
  await store.setJSON(key, { value: randomBytes(32).toString("hex") }, { onlyIfNew: true });
  const saved = await store.get(key, { type: "json" });
  if (typeof saved?.value !== "string") throw new Error("salt missing");
  salt = { day, value: saved.value };
  return salt.value;
}

// ------------------------------------------------------------- storage

/** Stores one hit under its own key. */
export const storeHit = (store, hit) => store.setJSON(`raw/${Date.now()}-${randomBytes(4).toString("hex")}`, hit);

async function getAll(store, keys, type) {
  const out = [];
  for (let i = 0; i < keys.length; i += 16) {
    out.push(...(await Promise.all(keys.slice(i, i + 16).map((key) => store.get(key, { type })))));
  }
  return out;
}

const parseLines = (body) =>
  (body || "").split("\n").flatMap((line) => {
    if (!line) return [];
    try {
      return [JSON.parse(line)];
    } catch {
      return []; // skip a damaged line
    }
  });

/** Every hit since the given time, oldest first. */
export async function loadHits(store, sinceMs) {
  const days = [];
  for (let t = sinceMs; dayOf(t) <= dayOf(); t += DAY) days.push(dayOf(t));
  const hits = (await getAll(store, days.map((day) => `hits/${day}`), "text")).flatMap(parseLines);
  const { blobs } = await store.list({ prefix: "raw/" });
  hits.push(...(await getAll(store, blobs.map((blob) => blob.key), "json")).filter(Boolean));
  return hits.filter((hit) => typeof hit?.ts === "string" && Date.parse(hit.ts) >= sinceMs).sort((a, b) => a.ts.localeCompare(b.ts));
}

/**
 * Moves the raw hits into the per-day files. Only report.mjs calls this, once
 * an hour, so nothing else ever writes those files.
 */
export async function compactHits(store) {
  const { blobs } = await store.list({ prefix: "raw/" });
  if (!blobs.length) return 0;
  const raw = await getAll(store, blobs.map((blob) => blob.key), "json");
  const byDay = new Map();
  for (const hit of raw) {
    if (typeof hit?.ts !== "string") continue;
    const day = hit.ts.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(JSON.stringify(hit));
  }
  for (const [day, lines] of byDay) {
    const current = (await store.get(`hits/${day}`, { type: "text" })) || "";
    // A run that stopped half-way may have merged some of these already.
    const have = new Set(current.split("\n"));
    const added = lines.filter((line) => !have.has(line)).sort();
    if (added.length) await store.set(`hits/${day}`, current + added.join("\n") + "\n");
  }
  for (let i = 0; i < blobs.length; i += 20) await Promise.all(blobs.slice(i, i + 20).map((blob) => store.delete(blob.key)));
  return blobs.length;
}

// ------------------------------------------------------------ recording

/**
 * Stores one hit and, for the first page view of a new visitor, sends the
 * Telegram message.
 * @param {Request} request
 * @param {import("@netlify/functions").Context} context
 * @param {object} fields  from parseHit() or qrHit()
 */
export async function recordHit(request, context, fields) {
  const ua = request.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua)) return;
  const store = statsStore();
  const id = createHash("sha256").update(`${await dailySalt(store)}|${context.ip || ""}|${ua}`).digest("hex").slice(0, 16);
  if (!allowHit(id)) return;
  const code = context.geo?.country?.code;
  const hit = {
    ts: new Date().toISOString(),
    id,
    ip: clean(context.ip || "", 45),
    country: /^[A-Za-z]{2}$/.test(code || "") ? code.toUpperCase() : "",
    ...describeAgent(ua),
    lang: firstLanguage(request.headers.get("accept-language")),
    ...fields,
  };
  await storeHit(store, hit);
  await announce(store, hit);
}

async function announce(store, hit) {
  if (hit.type !== "view") return;
  const settings = notifySettings();
  const config = telegramConfig();
  if (!settings.newVisitors || !config) return;
  const day = hit.ts.slice(0, 10);
  const { modified } = await store.setJSON(`seen/${day}/${hit.id}`, 1, { onlyIfNew: true });
  if (!modified) return; // already announced today
  let nth = 0;
  try {
    nth = (await store.list({ prefix: `seen/${day}/` })).blobs.length;
  } catch {
    /* the count is a nice-to-have */
  }
  await telegram(store, config, newVisitorText(settings, hit, nth));
}

// ------------------------------------------------------------- telegram

/** Sends a message and keeps Telegram's answer for the dashboard. */
export async function telegram(store, config, text) {
  const result = await sendTelegram(config, text);
  try {
    await store.setJSON("state/telegram", result);
  } catch {
    /* the status is a nice-to-have */
  }
  return result;
}

/** What the dashboard shows about Telegram. */
export async function telegramStatus(store) {
  const settings = notifySettings();
  const [last, notify] = await Promise.all([
    store.get("state/telegram", { type: "json" }).catch(() => null),
    store.get("state/notify", { type: "json" }).catch(() => null),
  ]);
  return {
    problem: telegramProblem(),
    last: last || null,
    newVisitors: settings.newVisitors,
    everyDays: settings.everyDays,
    lastSummary: notify?.lastReport ? new Date(notify.lastReport).toISOString() : null,
  };
}
