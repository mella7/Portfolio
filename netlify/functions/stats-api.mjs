// /api/stats: the numbers behind the /stats dashboard.
//
//   GET  /api/stats?days=30                     the summary, plus Telegram status
//   POST /api/stats  {"action":"telegram-test"}  sends a test message to Telegram
//
// Locked with STATS_TOKEN, sent as "Authorization: Bearer <token>".

import { createHash, timingSafeEqual } from "node:crypto";

import { telegramConfig, telegramProblem } from "../../server/notify.mjs";
import { summarise } from "../../server/stats.mjs";
import { DAY, json, limiter, loadHits, statsStore, telegram, telegramStatus } from "../lib/stats-store.mjs";

const allowTry = limiter(10);

function authorised(request, token) {
  // Pasted passkeys often carry a space or line break; ignore those.
  const given = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  // Compare digests so the comparison takes the same time for any input.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(token).digest();
  return timingSafeEqual(a, b);
}

export default async (request, context) => {
  if (request.method !== "GET" && request.method !== "POST") return json(405, { error: "Method not allowed." });
  const token = (process.env.STATS_TOKEN || "").trim();
  if (!token) return json(503, { error: "Statistics are disabled: set STATS_TOKEN to enable them." });
  if (!allowTry(context.ip || "")) return json(429, { error: "Too many attempts. Wait a minute." });
  if (!authorised(request, token)) return json(401, { error: "Wrong token." });

  const store = statsStore();

  if (request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    if (body.action !== "telegram-test") return json(400, { error: "Unknown action." });
    const config = telegramConfig();
    if (!config) return json(200, { ok: false, description: telegramProblem(), hint: "Fix the variable in Netlify, then redeploy." });
    return json(200, await telegram(store, config, "Test message from mella7.me/stats. Telegram works."));
  }

  const days = Math.min(365, Math.max(1, Number(new URL(request.url).searchParams.get("days")) || 30));
  try {
    const [hits, status] = await Promise.all([loadHits(store, Date.now() - days * DAY), telegramStatus(store)]);
    return json(200, { ...summarise(hits, days), telegram: status });
  } catch (error) {
    console.error("stats:", error.message);
    return json(500, { error: "Could not read the statistics. Check the function log on Netlify." });
  }
};

export const config = { path: "/api/stats" };
