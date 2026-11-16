// Runs every hour on Netlify (scheduled functions only run on the published
// production deploy).
//
//   - Moves the hits that arrived since the last run into the per-day files.
//   - The first run sends a "connected" message on Telegram and starts the clock.
//   - After that, a summary every REPORT_EVERY_DAYS days (default 15).
//   - Deletes salts and "seen" markers older than yesterday, and hits older
//     than STATS_KEEP_DAYS (default 400).

import { summarise } from "../../server/stats.mjs";
import { helloText, notifySettings, reportText, sendTelegram, telegramConfig } from "../../server/notify.mjs";
import { DAY, compactHits, dayOf, loadHits, statsStore } from "../lib/stats-store.mjs";

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
  if (!config) return new Response("Telegram is not set up.");
  const settings = notifySettings();
  const now = Date.now();
  const state = (await store.get("state/notify", { type: "json" })) || { lastReport: 0 };

  if (!state.lastReport) {
    if (await sendTelegram(config, helloText(settings))) await store.setJSON("state/notify", { lastReport: now });
    return new Response("Hello sent.");
  }
  if (now - state.lastReport >= settings.everyDays * DAY) {
    const summary = summarise(await loadHits(store, now - settings.everyDays * DAY), Math.max(1, Math.ceil(settings.everyDays)));
    if (await sendTelegram(config, reportText(settings.site, summary, settings.everyDays))) {
      await store.setJSON("state/notify", { lastReport: now });
    }
    return new Response("Summary sent.");
  }
  return new Response("Nothing due.");
};

export const config = { schedule: "@hourly" };
