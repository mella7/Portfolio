import { NextRequest, NextResponse } from "next/server";
import { shortLinkTargets } from "@/data/short-links";
import { detectLocale } from "@/i18n/config";

// Shared handler for the /qr/<name> and /go/<name> tracking links.
//
// 1. Records the open in Umami as a server-side event ("qr-scan" or
//    "link-open"), so it is counted even if the visitor blocks the tracking
//    script or closes the page before it loads.
// 2. Redirects to the right language version of the target page with UTM
//    tags, so the visit itself also shows up under Umami's UTM / campaign
//    report and you can follow what that visitor did next.
//
// No IP address, cookie or identifier is stored or sent anywhere. Country and
// city come from the host's geo header (Netlify), and only the names are
// passed on, the same level of detail Umami's own script records.

type Kind = "qr" | "go";

const NAME_RE = /^[a-z0-9-]{1,40}$/;

// Link-preview fetchers and crawlers, so a chat app unfurling the link
// does not count as a person opening it. "bot" already covers LinkedInBot,
// Slackbot, TelegramBot and Discordbot. LinkedIn's in-app browser
// ("LinkedInApp") is a real person and is deliberately not matched.
const BOT_RE =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp\/|curl|wget|python|httpclient|headless|go-http/i;

function cleanName(raw: string[] | undefined, kind: Kind): string {
  const joined = (raw ?? []).join("-").toLowerCase();
  if (!joined) return kind === "qr" ? "qr" : "link";
  return NAME_RE.test(joined) ? joined : "other";
}

function geo(request: NextRequest): { country?: string; city?: string } {
  // Netlify: base64-encoded JSON, e.g. {"city":"Zurich","country":{"code":"CH",...}}
  const nf = request.headers.get("x-nf-geo");
  if (nf) {
    try {
      const parsed = JSON.parse(Buffer.from(nf, "base64").toString("utf8"));
      return { country: parsed?.country?.code, city: parsed?.city };
    } catch {
      /* fall through */
    }
  }
  // Vercel or Cloudflare, in case the site moves.
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country") ??
    undefined;
  const city = request.headers.get("x-vercel-ip-city") ?? undefined;
  return {
    country: country ?? undefined,
    city: city ? decodeURIComponent(city) : undefined,
  };
}

function device(userAgent: string): string {
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

async function recordInUmami(
  request: NextRequest,
  kind: Kind,
  name: string,
  userAgent: string
) {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return;

  const scriptSrc =
    process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";
  const endpoint = new URL("/api/send", scriptSrc).toString();

  const { country, city } = geo(request);
  const data: Record<string, string> = { name, device: device(userAgent) };
  if (country) data.country = country;
  if (city) data.city = city;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    await fetch(endpoint, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent || "Mozilla/5.0 (mella7.me server)",
      },
      body: JSON.stringify({
        type: "event",
        payload: {
          website: websiteId,
          hostname: request.nextUrl.hostname,
          url: `/${kind}/${name}`,
          language: request.headers.get("accept-language")?.split(",")[0],
          name: kind === "qr" ? "qr-scan" : "link-open",
          data,
        },
      }),
    });
  } catch {
    // Analytics must never break the redirect.
  } finally {
    clearTimeout(timer);
  }
}

export async function handleShortLink(
  request: NextRequest,
  kind: Kind,
  rawName: string[] | undefined
) {
  const name = cleanName(rawName, kind);
  const userAgent = request.headers.get("user-agent") ?? "";
  const locale = detectLocale(request.headers.get("accept-language"));

  const configured = shortLinkTargets[name];
  // Only same-site paths, never "//evil.com" or "https://...".
  const path =
    configured && configured.startsWith("/") && !configured.startsWith("//")
      ? configured
      : "/";

  const target = new URL(`/${locale}${path === "/" ? "" : path}`, request.url);
  target.searchParams.set("utm_source", kind === "qr" ? "qr" : name);
  target.searchParams.set("utm_medium", kind === "qr" ? "qr" : "link");
  target.searchParams.set("utm_campaign", name);

  // HEAD requests come from link checkers, not people.
  if (request.method === "GET" && !BOT_RE.test(userAgent)) {
    await recordInUmami(request, kind, name, userAgent);
  }

  const response = NextResponse.redirect(target, 302);
  // Never cached, so every scan reaches the server and gets counted.
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
