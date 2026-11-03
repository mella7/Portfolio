import { NextRequest, NextResponse } from "next/server";
import { detectLocale, locales } from "@/i18n/config";

// Redirects "/" and any un-prefixed path to a locale-prefixed one,
// e.g. "/" -> "/en", "/blog" -> "/en/blog" (or /de, /fr based on the
// visitor's Accept-Language header). Files, /_next, /admin, /api and the
// /qr and /go tracking links are excluded via the matcher below.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  // Italian is visible in the switcher but not live yet - send /it to the default locale.
  const cleanedPath = pathname.replace(/^\/it(?=\/|$)/, "");

  const locale = detectLocale(request.headers.get("accept-language"));
  const target = `/${locale}${cleanedPath === "/" ? "" : cleanedPath}`;
  // Keep the query string, so ?utm_source=... survives the locale redirect.
  const url = new URL(target, request.url);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the Decap admin panel, API routes, tracking links
  // (/qr, /go) and any file with an extension.
  matcher: ["/((?!_next|admin|api|qr|go|.*\\..*).*)"],
};
