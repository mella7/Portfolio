import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

// Redirects "/" and any un-prefixed path to a locale-prefixed one,
// e.g. "/" -> "/en", "/blog" -> "/en/blog" (or /de, /fr based on the
// visitor's Accept-Language header). Files, /_next and /admin are
// excluded via the matcher below.

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (header.includes(locale)) return locale;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  // Italian is visible in the switcher but not live yet - send /it to the default locale.
  const cleanedPath = pathname.replace(/^\/it(?=\/|$)/, "");

  const locale = detectLocale(request);
  const target = `/${locale}${cleanedPath === "/" ? "" : cleanedPath}`;
  return NextResponse.redirect(new URL(target, request.url));
}

export const config = {
  // Skip Next internals, the Decap admin panel, API routes, and any file with an extension.
  matcher: ["/((?!_next|admin|api|.*\\..*).*)"],
};
