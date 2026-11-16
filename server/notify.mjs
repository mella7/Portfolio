// Telegram updates about the statistics.
//
//   - A summary every REPORT_EVERY_DAYS days (default 15).
//   - An alert when visitors suddenly rise: at least SPIKE_MIN_VISITORS in the
//     last hour AND at least SPIKE_FACTOR times the usual hourly number over
//     the previous seven days. At most one alert per SPIKE_COOLDOWN_HOURS.
//
// Needs TELEGRAM_BOT_TOKEN (from @BotFather) and TELEGRAM_CHAT_ID (run
// `npm run telegram` to find it). Without both, nothing is sent.
//
// Messages are plain text built from counts and labels; the bot token is
// never logged.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { summarise } from "./stats.mjs";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

const number = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export function telegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN || "";
  const chat = process.env.TELEGRAM_CHAT_ID || "";
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

/** Visitors in the last hour against the usual hourly number. */
export function spikeCheck(hits, now, { minVisitors, factor }) {
  const lastHour = hits.filter((hit) => hit.type === "view" && now - Date.parse(hit.ts) <= HOUR);
  const current = new Set(lastHour.map((hit) => hit.id)).size;
  // Usual level: distinct visitor-hours over the seven days before that hour.
  const earlier = new Set();
  for (const hit of hits) {
    const age = now - Date.parse(hit.ts);
    if (hit.type === "view" && age > HOUR && age <= 7 * DAY + HOUR) earlier.add(`${hit.id}|${hit.ts.slice(0, 13)}`);
  }
  const usual = earlier.size / (7 * 24);
  return { spike: current >= minVisitors && current >= factor * Math.max(usual, 1), current, usual, lastHour };
}

/**
 * @param {object} options
 * @param {(sinceMs: number) => object[]} options.loadHits
 * @param {string} options.dataDir  where the "last sent" times are kept
 * @param {string} options.site     name shown in the messages
 */
export function startNotifier({ loadHits, dataDir, site }) {
  const config = telegramConfig();
  if (!config) return false;

  const everyDays = number("REPORT_EVERY_DAYS", 15);
  const minVisitors = number("SPIKE_MIN_VISITORS", 25);
  const factor = number("SPIKE_FACTOR", 3);
  const cooldown = number("SPIKE_COOLDOWN_HOURS", 6) * HOUR;
  const stateFile = join(dataDir, "notify.json");

  let state = { lastReport: 0, lastSpike: 0 };
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
        const ok = await sendTelegram(config, `${site}: statistics are connected. You will get a summary every ${everyDays} days and an alert when visitors spike.`);
        if (ok) {
          state.lastReport = now;
          save();
        }
      } else if (now - state.lastReport >= everyDays * DAY) {
        const summary = summarise(loadHits(now - everyDays * DAY), Math.max(1, Math.ceil(everyDays)));
        if (await sendTelegram(config, reportText(site, summary, everyDays))) {
          state.lastReport = now;
          save();
        }
      }

      if (now - state.lastSpike >= cooldown) {
        const result = spikeCheck(loadHits(now - 7 * DAY - HOUR), now, { minVisitors, factor });
        if (result.spike) {
          const hour = summarise(result.lastHour, 1);
          const text = [
            `${site}: visitor spike`,
            "",
            `${result.current} visitors in the last hour (usual: about ${result.usual.toFixed(1)} per hour).`,
            "",
            "Pages", list(hour.tables.pages),
            "Where they came from", list(hour.tables.referrers),
            "Countries", list(hour.tables.countries),
          ].join("\n");
          if (await sendTelegram(config, text)) {
            state.lastSpike = now;
            save();
          }
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
  return true;
}
