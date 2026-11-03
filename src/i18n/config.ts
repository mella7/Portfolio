export const locales = ["en", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Every language shown in the switcher.
// To add a language later: add its code to `locales` above, create
// src/data/<code>.tsx, add a UI block in src/i18n/ui.ts, and list it here.
export const languageOptions = [
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
] as const;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Picks /de or /fr from the browser's Accept-Language header, else /en.
// Shared by the locale middleware and the /qr and /go tracking links.
export function detectLocale(acceptLanguage: string | null): Locale {
  const header = acceptLanguage?.toLowerCase() ?? "";
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (header.includes(locale)) return locale;
  }
  return defaultLocale;
}
