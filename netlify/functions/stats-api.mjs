// GET /api/stats?days=30: the numbers behind the /stats dashboard.
// Locked with STATS_TOKEN, sent as "Authorization: Bearer <token>".

import { createHash, timingSafeEqual } from "node:crypto";

import { summarise } from "../../server/stats.mjs";
import { DAY, json, limiter, loadHits, statsStore } from "../lib/stats-store.mjs";

const allowTry = limiter(10);

function authorised(request, token) {
  const given = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  // Compare digests so the comparison takes the same time for any input.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(token).digest();
  return timingSafeEqual(a, b);
}

export default async (request, context) => {
  if (request.method !== "GET") return json(405, { error: "Method not allowed." });
  const token = (process.env.STATS_TOKEN || "").trim();
  if (!token) return json(503, { error: "Statistics are disabled: set STATS_TOKEN to enable them." });
  if (!allowTry(context.ip || "")) return json(429, { error: "Too many attempts. Wait a minute." });
  if (!authorised(request, token)) return json(401, { error: "Wrong token." });

  const days = Math.min(365, Math.max(1, Number(new URL(request.url).searchParams.get("days")) || 30));
  try {
    return json(200, summarise(await loadHits(statsStore(), Date.now() - days * DAY), days));
  } catch (error) {
    console.error("stats:", error.message);
    return json(500, { error: "Could not read the statistics. Check the function log on Netlify." });
  }
};

export const config = { path: "/api/stats" };
