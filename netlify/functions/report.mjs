// Runs every hour on Netlify (scheduled functions only run on the published
// production deploy).
//
//   - Moves the hits that arrived since the last run into the per-day files.
//   - The first run sends a "connected" message on Telegram and starts the clock.
//   - After that, a summary every REPORT_EVERY_DAYS days (default 15).
//   - Deletes salts and "seen" markers older than yesterday, and hits older
//     than STATS_KEEP_DAYS (default 400).
//   - Removes IP addresses from hits older than STATS_IP_DAYS (default 30).

import { summarise } from "../../server/stats.mjs";
import { helloText, notifySettings, reportText, telegramConfig, telegramProblem } from "../../server/notify.mjs";
import { DAY, compactHits, dayOf, loadHits, statsStore, telegram } from "../lib/stats-store.mjs";

async function cleanUp(store) {
  const yesterday = dayOf(Date.now() - DAY);
  const keepDays = Number(process.env.STATS_KEEP_DAYS) > 0 ? Number(process.env.STATS_KEEP_DAYS) : 400;
  const oldestHits = dayOf(Date.now() - keepDays * DAY);
  const rules = [
    ["salt/", (day) => day < yesterday],
    ["seen/", (day) => day < yesterday],
    ["hits/", (day) => day < oldestHits],
  ];
  for (const [prefix, tooOld] of rules) {
    const { blobs } = await store.list({ prefix });
    const old = blobs.filter((blob) => tooOld(blob.key.slice(prefix.length, prefix.length + 10)));
    for (let i = 0; i < old.length; i += 20) await Promise.all(old.slice(i, i + 20).map((blob) => store.delete(blob.key)));
  }

  // IP addresses are only kept for a limited time.
  const ipDays = Number(process.env.STATS_IP_DAYS) > 0 ? Number(process.env.STATS_IP_DAYS) : 30;
  const lastIpDay = dayOf(Date.now() - ipDays * DAY);
  const { blobs } = await store.list({ prefix: "hits/" });
  for (const blob of blobs) {
    if (blob.key.slice(5, 15) >= lastIpDay) continue;
    const text = await store.get(blob.key, { type: "text" });
    if (!text || !text.includes('"ip":')) continue;
    const scrubbed = text
      .split("\n")
      .map((line) => {
        if (!line.includes('"ip":')) return line;
        try {
          const { ip, ...rest } = JSON.parse(line);
          return JSON.stringify(rest);
        } catch {
          return "";
        }
      })
      .join("\n");
    await store.set(blob.key, scrubbed);
  }
}

export default async () => {
  const store = statsStore();
  try {
    await compactHits(store);
  } catch (error) {
    console.error("report: could not merge new hits:", error.message);
  }
  try {
    await cleanUp(store);
  } catch (error) {
    console.error("report: clean-up failed:", error.message);
  }

  const config = telegramConfig();
  if (!config) {
    const problem = telegramProblem();
    if (problem && problem !== "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are not set.") console.error(`telegram: off. ${problem}`);
    return new Response(`Telegram is not set up: ${problem}`);
  }
  const settings = notifySettings();
  const now = Date.now();
  const state = (await store.get("state/notify", { type: "json" })) || { lastReport: 0 };

  if (!state.lastReport) {
    const result = await telegram(store, config, helloText(settings));
    if (result.ok) await store.setJSON("state/notify", { lastReport: now });
    return new Response(result.ok ? "Hello sent." : `Hello not delivered: ${result.description}`);
  }
  if (now - state.lastReport >= settings.everyDays * DAY) {
    const summary = summarise(await loadHits(store, now - settings.everyDays * DAY), Math.max(1, Math.ceil(settings.everyDays)));
    const result = await telegram(store, config, reportText(settings.site, summary, settings.everyDays));
    if (result.ok) await store.setJSON("state/notify", { lastReport: now });
    return new Response(result.ok ? "Summary sent." : `Summary not delivered: ${result.description}`);
  }
  return new Response("Nothing due.");
};

export const config = { schedule: "@hourly" };
