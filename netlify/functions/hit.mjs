// POST /api/hit: page views and events sent by src/client/analytics.js.
// The Netlify version of the same route in server/server.mjs.

import { MAX_BODY, parseHit } from "../../server/core.mjs";
import { corsHeaders, originAllowed, recordHit, text } from "../lib/stats-store.mjs";

export default async (request, context) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return text(405, "method not allowed");
  if (!originAllowed(request)) return text(403, "forbidden");

  const body = await request.text();
  if (body.length > MAX_BODY) return text(413, "too large", corsHeaders(request));
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return text(400, "bad request", corsHeaders(request));
  }

  const fields = parseHit(payload);
  if (fields) {
    try {
      await recordHit(request, context, fields);
    } catch (error) {
      console.error("hit:", error.message); // statistics must never break the page
    }
  }
  return new Response(null, { status: 204, headers: { ...corsHeaders(request), "Cache-Control": "no-store" } });
};

export const config = { path: "/api/hit" };
