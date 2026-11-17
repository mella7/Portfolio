// Languages. The build renders every page once per language:
//   English  /            (the default, no prefix)
//   French   /fr/
//   German   /de/
//
// setLang() switches what the views see. `C` (content), `lang` and `t()` are
// live bindings, so a view that imports them always reads the current
// language while that language is being rendered.

import * as EN from "../data/content.mjs";
import { SITE } from "../data/site.mjs";
import FR from "./content.fr.mjs";
import DE from "./content.de.mjs";
import { UI } from "./ui.mjs";

export const LANGS = [
  { code: "en", short: "EN", label: "English", locale: "en-GB" },
  { code: "fr", short: "FR", label: "Français", locale: "fr-FR" },
  { code: "de", short: "DE", label: "Deutsch", locale: "de-DE" },
];

// ------------------------------------------------------------ merging

const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);
const keyOf = (item) => item?.slug ?? item?.file ?? item?.short;

/**
 * Lays a translation over the English original. Arrays are matched by
 * position, or by slug / file / short name when the translation is an object.
 * A plain string in place of an object (moments: { file: "caption" }) sets
 * that item's caption.
 */
function merge(base, over) {
  if (over === undefined) return base;
  if (Array.isArray(base)) {
    if (Array.isArray(over)) return base.map((item, i) => merge(item, over[i]));
    if (isObject(over)) {
      return base.map((item) => {
        const patch = over[keyOf(item)];
        if (typeof patch === "string") return { ...item, caption: patch };
        return merge(item, patch);
      });
    }
    return over;
  }
  if (isObject(base) && isObject(over)) {
    const out = { ...base };
    for (const [k, v] of Object.entries(over)) out[k] = merge(base[k], v);
    return out;
  }
  return over;
}

const english = {
  ...EN,
  intro: { ...EN.intro, afterName: EN.intro.paragraphs[0].replace(/^I'm /, "") },
  site: {
    description: SITE.description,
    jobTitle: SITE.author.jobTitle,
    location: { ...SITE.location },
    now: { ...SITE.now },
  },
};

const CONTENT = { en: english, fr: merge(english, FR), de: merge(english, DE) };

// ------------------------------------------------------- live bindings

export let lang = "en";
export let C = CONTENT.en;
export let locale = "en-GB";

export function setLang(code) {
  if (!CONTENT[code]) throw new Error(`Unknown language "${code}"`);
  lang = code;
  C = CONTENT[code];
  locale = LANGS.find((l) => l.code === code).locale;
}

/** "/fr" for French, "" for English. */
export const prefixFor = (code) => (code === "en" ? "" : `/${code}`);
export const prefix = () => prefixFor(lang);

/**
 * Interface text by dotted key: t("pages.talks.title"). Function values are
 * called with the extra arguments. Falls back to English, then to the key.
 */
export function t(key, ...args) {
  const find = (table) => key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), table);
  let value = find(UI[lang]);
  if (value === undefined) value = find(UI.en);
  if (value === undefined) throw new Error(`Missing interface text "${key}"`);
  return typeof value === "function" ? value(...args) : value;
}

export const uiClient = () => UI[lang].client;

// ----------------------------------------------------------- dates

const MONTHS_LONG = { year: "numeric", month: "long", day: "numeric" };
/** "15 June 2026" / "15 juin 2026" / "15. Juni 2026" from "2026-06-15". */
export const longDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, MONTHS_LONG);
export const shortDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });

// --------------------------------------------------------- countries
// The globe and the travel list use the English names from world.json. Their
// names in the current language come from the browser-independent ICU data
// in Node, by way of the ISO code.

const englishRegions = new Intl.DisplayNames(["en"], { type: "region" });
const CODES = new Map();
for (let a = 65; a <= 90; a++) {
  for (let b = 65; b <= 90; b++) {
    const code = String.fromCharCode(a, b);
    try {
      const name = englishRegions.of(code);
      if (name && name !== code && !CODES.has(name)) CODES.set(name, code);
    } catch {
      /* not a region */
    }
  }
}
// Names in world.json / the visited list that differ from the ICU English name.
const ALIASES = {
  "Czech Republic": "CZ", "Vatican City": "VA", "Hong Kong": "HK", Turkey: "TR", "United States of America": "US",
  "Dem. Rep. Congo": "CD", Congo: "CG", "Central African Rep.": "CF", "S. Sudan": "SS", "Bosnia and Herz.": "BA",
  "Dominican Rep.": "DO", "Eq. Guinea": "GQ", "N. Cyprus": null, "Solomon Is.": "SB", "Falkland Is.": "FK",
  "Fr. S. Antarctic Lands": "TF", "W. Sahara": "EH", "Côte d'Ivoire": "CI", eSwatini: "SZ", Macedonia: "MK",
  "North Macedonia": "MK", Somaliland: null, Kosovo: "XK", "Timor-Leste": "TL", Myanmar: "MM", Palestine: "PS",
};

const regionNames = {};
/** A country's name in the current language, from its English name. */
export function countryName(englishName) {
  const code = englishName in ALIASES ? ALIASES[englishName] : CODES.get(englishName);
  if (!code || lang === "en") return englishName;
  regionNames[lang] ??= new Intl.DisplayNames([lang], { type: "region" });
  try {
    return regionNames[lang].of(code) || englishName;
  } catch {
    return englishName;
  }
}

/** English name -> name in the current language, for every name given. */
export const countryNames = (names) => Object.fromEntries(names.map((n) => [n, countryName(n)]).filter(([a, b]) => a !== b));
