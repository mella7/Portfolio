// Telegram updates about the statistics.
//
//   - A summary every REPORT_EVERY_DAYS days (default 15).
//   - A short message for every new visitor: the first page view of a
//     visitor on a given day. NOTIFY_NEW_VISITORS=0 switches these off.
//
// Needs TELEGRAM_BOT_TOKEN (from @BotFather) and TELEGRAM_CHAT_ID (run
// `npm run telegram` to find it). Without both, nothing is sent.
//
// Used by the Node server (startNotifier below) and by the Netlify functions
// (netlify/functions/hit.mjs and report.mjs). Messages are plain text built
// from counts and labels; the bot token is never logged.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { summarise } from "./stats.mjs";

const DAY = 86_400_000;

const number = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const notifySettings = () => ({
  everyDays: number("REPORT_EVERY_DAYS", 15),
  newVisitors: process.env.NOTIFY_NEW_VISITORS !== "0",
  timeZone: process.env.NOTIFY_TIMEZONE || "Europe/Berlin",
  site: process.env.SITE_NAME || "mella7.me",
});

export function telegramConfig() {
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chat = (process.env.TELEGRAM_CHAT_ID || "").trim();
  if (!/^\d+:[\w-]{20,}$/.test(token) || !/^-?\d+$/.test(chat)) return null;
  return { token, chat, api: (process.env.TELEGRAM_API_BASE || "https://api.telegram.org").replace(/\/+$/, "") };
}

export async function sendTelegram(config, text) {
  try {
    const response = await fetch(`${config.api}/bot${config.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: config.chat, text: text.slice(0, 4000), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) console.error(`telegram: message refused (HTTP ${response.status})`);
    return response.ok;
  } catch (error) {
    console.error(`telegram: could not send (${error.name})`);
    return false;
  }
}

const list = (rows, limit = 5) =>
  rows.length ? rows.slice(0, limit).map((row) => `  ${row.label}: ${row.count}`).join("\n") : "  nothing yet";

export function reportText(site, summary, days) {
  const t = summary.totals;
  return [
    `${site} · last ${Math.round(days)} days`,
    "",
    `Visitors (daily unique): ${t.visitors}`,
    `Page views: ${t.views}`,
    `QR scans: ${t.qrScans}`,
    `Resume downloads: ${t.resumeDownloads}`,
    `Contact messages: ${t.messages}`,
    "",
    "Top pages", list(summary.tables.pages),
    "Where they came from", list(summary.tables.referrers),
    "Countries", list(summary.tables.countries),
    ...(summary.tables.qrCodes.length ? ["QR codes", list(summary.tables.qrCodes)] : []),
  ].join("\n");
}

export const helloText = ({ site, everyDays, newVisitors }) =>
  `${site}: statistics are connected. You will get a summary every ${everyDays} days` +
  (newVisitors ? " and a message for each new visitor." : ".");

let regionNames = null;
function countryName(code) {
  if (!code) return "unknown";
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return `${regionNames.of(code)} (${code})`;
  } catch {
    return code;
  }
}

const ordinal = (n) => {
  const tens = n % 100;
  const suffix = tens >= 11 && tens <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th";
  return `${n}${suffix}`;
};

/**
 * The message for a new visitor.
 * @param {object} hit      the stored page view
 * @param {number} [nth]    how many visitors so far today, this one included
 */
export function newVisitorText({ site, timeZone }, hit, nth) {
  let when = hit.ts;
  try {
    when = new Intl.DateTimeFormat("en-GB", {
      timeZone, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    }).format(new Date(hit.ts));
  } catch {
    /* keep the ISO time */
  }
  const qr = /^qr-/.test(hit.src || "") ? hit.src.slice(3) : "";
  return [
    `New visitor on ${site}${nth ? ` (${ordinal(nth)} today)` : ""}`,
    "",
    `Page: ${hit.path}`,
    qr ? `Came from: QR code "${qr}"` : `Came from: ${hit.ref || "direct or unknown"}`,
    ...(hit.src && !qr ? [`Tag: ${hit.src}`] : []),
    `Country: ${countryName(hit.country)}`,
    `Device: ${hit.device}, ${hit.browser} on ${hit.os}`,
    `Language: ${hit.lang || "unknown"}${hit.tz ? `, time zone ${hit.tz}` : ""}`,
    `Time: ${when}`,
  ].join("\n");
}

/**
 * Telegram updates for the Node server. Returns null when Telegram is not
 * set up, otherwise an object whose visitor() is called for every page view.
 *
 * @param {object} options
 * @param {(sinceMs: number) => object[]} options.loadHits
 * @param {string} options.dataDir  where the "last sent" time is kept
 */
export function startNotifier({ loadHits, dataDir }) {
  const config = telegramConfig();
  if (!config) return null;
  const settings = notifySettings();
  const stateFile = join(dataDir, "notify.json");

  let state = { lastReport: 0 };
  try {
    if (existsSync(stateFile)) state = { ...state, ...JSON.parse(readFileSync(stateFile, "utf8")) };
  } catch {
    /* start fresh */
  }
  const save = () => writeFileSync(stateFile, JSON.stringify(state), { mode: 0o600 });

  let busy = false;
  async function check() {
    if (busy) return;
    busy = true;
    try {
      const now = Date.now();
      if (!state.lastReport) {
        // First run: say hello and start the clock.
        if (await sendTelegram(config, helloText(settings))) {
          state.lastReport = now;
          save();
        }
      } else if (now - state.lastReport >= settings.everyDays * DAY) {
        const summary = summarise(loadHits(now - settings.everyDays * DAY), Math.max(1, Math.ceil(settings.everyDays)));
        if (await sendTelegram(config, reportText(settings.site, summary, settings.everyDays))) {
          state.lastReport = now;
          save();
        }
      }
    } catch (error) {
      console.error("notifier:", error.message);
    } finally {
      busy = false;
    }
  }

  setTimeout(check, 5_000).unref();
  setInterval(check, number("NOTIFY_CHECK_SECONDS", 600) * 1000).unref();

  // Visitors already seen today. The visitor id changes every day, so the
  // set is emptied at midnight UTC. After a restart, someone who was already
  // here today may be announced a second time.
  let seenDay = "";
  let seen = new Set();
  return {
    settings,
    visitor(hit) {
      if (!settings.newVisitors || hit.type !== "view") return;
      const day = hit.ts.slice(0, 10);
      if (day !== seenDay) {
        seenDay = day;
        seen = new Set();
      }
      if (seen.has(hit.id)) return;
      seen.add(hit.id);
      sendTelegram(config, newVisitorText(settings, hit, seen.size));
    },
  };
}
