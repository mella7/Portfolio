import type { Locale } from "@/i18n/config";
import { de } from "./de";
import { en } from "./en";
import { fr } from "./fr";
import type { ResumeData } from "./types";

const dataByLocale: Record<Locale, ResumeData> = { en, de, fr };

export function getResume(locale: Locale): ResumeData {
  return dataByLocale[locale];
}

export { gallery, resumeLinks, testimonials } from "./shared";
export type { ResumeData } from "./types";
