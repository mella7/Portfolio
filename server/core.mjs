// What a hit looks like and how visitor input is cleaned. Shared by the Node
// server (server.mjs) and the Netlify functions (netlify/functions/), so both
// record exactly the same fields. No I/O here.

export const MAX_BODY = 4096;

export const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp\/|curl|wget|python|httpclient|headless|go-http|monitor|lighthouse|pingdom|uptime/i;

export function describeAgent(ua) {
  const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|iphone|android/i.test(ua) ? "mobile" : "desktop";
  const browser =
    /edg\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /firefox\//i.test(ua) ? "Firefox" :
    /samsungbrowser/i.test(ua) ? "Samsung Internet" : /chrome\//i.test(ua) ? "Chrome" : /safari\//i.test(ua) ? "Safari" : "Other";
  const os =
    /windows/i.test(ua) ? "Windows" : /iphone|ipad|ios/i.test(ua) ? "iOS" : /android/i.test(ua) ? "Android" :
    /mac os x|macintosh/i.test(ua) ? "macOS" : /cros/i.test(ua) ? "ChromeOS" : /linux/i.test(ua) ? "Linux" : "Other";
  return { device, browser, os };
}

/** Keep a visitor-supplied value short, single-line and printable. */
export const clean = (value, max = 120) =>
  typeof value === "string" || typeof value === "number"
    ? String(value).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max)
    : "";

/** First language from an Accept-Language header, e.g. "de-DE". */
export const firstLanguage = (header) => clean(String(header || "").split(",")[0].split(";")[0], 12);

/**
 * Turns the JSON the browser sent (src/client/analytics.js) into the fields
 * that are stored. Returns null when there is nothing worth keeping.
 */
export function parseHit(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const path = clean(payload.p, 200);
  if (!path.startsWith("/")) return null;
  const type = payload.t === "event" ? "event" : "view";
  const data = {};
  if (payload.d && typeof payload.d === "object") {
    for (const [key, value] of Object.entries(payload.d).slice(0, 8)) {
      const k = clean(key, 24);
      const v = clean(value, 160);
      if (/^[a-z][a-z0-9_]*$/i.test(k) && v) data[k] = v;
    }
  }
  return {
    type,
    path,
    name: type === "event" ? clean(payload.n, 40) : "",
    ref: clean(payload.r, 120),
    src: clean(payload.s, 60),
    tz: clean(payload.z, 40),
    screen: clean(payload.w, 12),
    view: clean(payload.v, 16),
    data,
  };
}

/** The name of a QR code from /qr/<name> or /qr?c=<name>. */
export function qrCode(url) {
  const raw = url.pathname.split("/")[2] || url.searchParams.get("c") || "qr";
  return clean(raw, 40).toLowerCase().replace(/[^a-z0-9-]/g, "") || "qr";
}

/** The hit stored for a QR scan. */
export const qrHit = (code) => ({
  type: "event", path: "/qr", name: "qr-scan", ref: "", src: "qr", tz: "", screen: "", view: "", data: { code },
});

/**
 * Where a QR scan goes next. The tag ?ref=qr-<name> rides along so the
 * homepage view that follows shows up as "came from QR code <name>".
 */
export function qrRedirect(target, code) {
  // Only a path on this site: "/x" is fine, "//evil.com" or "/\evil.com" is not.
  const base = /^\/(?![/\\])/.test(target || "") ? target : "/";
  return `${base}${base.includes("?") ? "&" : "?"}ref=qr-${code}`;
}
