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

// A value pasted with quotes or spaces around it still works.
const envValue = (name) => (process.env[name] || "").trim().replace(/^(["'])(.*)\1$/, "$2").trim();

/**
 * Why Telegram is not set up correctly, in plain words, or null when the two
 * variables look right. Never includes the token itself.
 */
export function telegramProblem() {
  const token = envValue("TELEGRAM_BOT_TOKEN");
  const chat = envValue("TELEGRAM_CHAT_ID");
  if (!token && !chat) return "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are not set.";
  if (!token) return "TELEGRAM_BOT_TOKEN is not set.";
  if (!/^\d+:[\w-]{20,}$/.test(token)) {
    return "TELEGRAM_BOT_TOKEN does not look like a bot token. It should look like 123456789:AAE..., copied from @BotFather.";
  }
  if (!chat) return "TELEGRAM_CHAT_ID is not set. Send /start to your bot, then run npm run telegram to find it.";
  if (!/^-?\d+$/.test(chat)) {
    return "TELEGRAM_CHAT_ID must be a number such as 123456789 (a group starts with -100). A @username does not work.";
  }
  if (chat === token.split(":")[0]) {
    return "TELEGRAM_CHAT_ID is the bot's own id (the number before the colon in the token). It has to be your own chat id: send /start to the bot, then run npm run telegram.";
  }
  return null;
}

export function telegramConfig() {
  if (telegramProblem()) return null;
  return {
    token: envValue("TELEGRAM_BOT_TOKEN"),
    chat: envValue("TELEGRAM_CHAT_ID"),
    api: (process.env.TELEGRAM_API_BASE || "https://api.telegram.org").replace(/\/+$/, ""),
  };
}

// What to do about the replies Telegram gives most often.
function hintFor(status, description) {
  const d = description.toLowerCase();
  if (status === 401) return "The bot token is wrong or was revoked. Copy it again from @BotFather.";
  if (d.includes("chat not found")) return "Telegram does not know this chat id. Send /start to your bot, then run npm run telegram for the right id.";
  if (d.includes("can't initiate")) return "Open your bot in Telegram and press Start once. Bots cannot write first.";
  if (d.includes("blocked by the user")) return "You blocked the bot. Open it in Telegram and press Restart.";
  if (d.includes("bots can't send messages to bots")) return "TELEGRAM_CHAT_ID belongs to a bot. Use your own chat id.";
  if (status === 429) return "Too many messages at once. Telegram will accept them again shortly.";
  return "";
}

let lastResult = null;
/** The outcome of the last message this process tried to send. */
export const lastTelegramResult = () => lastResult;

/**
 * Sends one message. Returns what Telegram answered:
 * { ok, at, status, description, hint }.
 */
export async function sendTelegram(config, text) {
  const result = { ok: false, at: new Date().toISOString(), status: 0, description: "", hint: "" };
  try {
    const response = await fetch(`${config.api}/bot${config.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: config.chat, text: text.slice(0, 4000), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = await response.json().catch(() => ({}));
    result.status = response.status;
    result.ok = response.ok && body.ok !== false;
    result.description = String(body.description || (result.ok ? "Delivered" : `HTTP ${response.status}`)).slice(0, 200);
  } catch (error) {
    result.description = `Could not reach Telegram (${error.name}).`;
  }
  if (!result.ok) {
    result.hint = hintFor(result.status, result.description);
    console.error(`telegram: not delivered (HTTP ${result.status}): ${result.description}${result.hint ? ` - ${result.hint}` : ""}`);
  }
  lastResult = result;
  return result;
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
    `Country: ${countryName(hit.country)}${hit.ip ? ` · IP ${hit.ip}` : ""}`,
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
  if (!config) {
    if (process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_CHAT_ID) console.error(`telegram: off. ${telegramProblem()}`);
    return null;
  }
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
        if ((await sendTelegram(config, helloText(settings))).ok) {
          state.lastReport = now;
          save();
        }
      } else if (now - state.lastReport >= settings.everyDays * DAY) {
        const summary = summarise(loadHits(now - settings.everyDays * DAY), Math.max(1, Math.ceil(settings.everyDays)));
        if ((await sendTelegram(config, reportText(settings.site, summary, settings.everyDays))).ok) {
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
