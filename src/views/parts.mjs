// Small building blocks shared by every page.

import { readFileSync } from "node:fs";
import { html, raw, safeUrl, isExternal } from "../lib/html.mjs";

const images = JSON.parse(readFileSync(new URL("../data/images.json", import.meta.url), "utf8"));

// Set once by the build. "" for a site at the domain root, "/repo" for a
// project page such as GitHub Pages.
let base = "";
export const setBase = (value) => (base = value.replace(/\/+$/, ""));

/** Prefix a site path with the base path. External URLs pass through. */
export const u = (path) => (String(path).startsWith("/") ? base + path : path);

/** Attributes for a link: new tab and no opener for anything off-site. */
export function linkAttrs(href) {
  const url = safeUrl(u(href));
  return isExternal(url)
    ? html`href="${url}" target="_blank" rel="noopener noreferrer"`
    : html`href="${url}"`;
}

const ICONS = {
  arrow: '<path d="M7 17 17 7M9 7h8v8"/>',
  download: '<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/>',
  back: '<path d="M19 12H5m0 0 6-6m-6 6 6 6"/>',
  mail: '<path d="M4 6h16v12H4zM4 7l8 6 8-6"/>',
  terminal: '<path d="m5 8 4 4-4 4M12 16h7"/>',
  walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="m13 8-3 3 1 4-2 5M11 11l4 2 1 3M13 15l3 5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
};

export const icon = (name, cls = "") =>
  html`<svg class="icon ${cls}" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true">${raw(ICONS[name])}</svg>`;

/** A framed button. `href` makes it a link, otherwise it is a <button>. */
export function button({ label, href, iconName, variant = "", download, attrs = "", type = "button" }) {
  const body = html`${iconName ? icon(iconName) : ""}<span>${label}</span>`;
  const cls = `btn ${variant}`.trim();
  if (href) {
    return html`<a class="${cls}" ${linkAttrs(href)}${download ? raw(" download") : ""} ${raw(attrs)}>${body}</a>`;
  }
  return html`<button class="${cls}" type="${type}" ${raw(attrs)}>${body}</button>`;
}

/** Metadata for "<group>/<name>" from src/data/images.json (built by scripts/images.py). */
export function photoMeta(key) {
  const meta = images[key];
  if (!meta) throw new Error(`No image "${key}" in src/data/images.json. Run: python3 scripts/images.py`);
  const url = (w, ext) => u(`/${key}-${w}.${ext}`);
  const srcset = (ext) => meta.widths.map((w) => `${url(w, ext)} ${w}w`).join(", ");
  const largest = meta.widths[meta.widths.length - 1];
  return {
    w: meta.w,
    h: meta.h,
    avif: srcset("avif"),
    webp: srcset("webp"),
    src: url(Math.min(960, largest), "webp"),
    full: url(largest, "webp"),
    small: url(meta.widths[0], "webp"),
  };
}

/** Responsive <picture>: AVIF first, WebP fallback, sized to avoid layout shift. */
export function picture(key, { alt, sizes = "100vw", cls = "", eager = false } = {}) {
  const p = photoMeta(key);
  return html`<picture>
    <source type="image/avif" srcset="${p.avif}" sizes="${sizes}">
    <source type="image/webp" srcset="${p.webp}" sizes="${sizes}">
    <img class="${cls}" src="${p.src}" alt="${alt}" width="${p.w}" height="${p.h}" sizes="${sizes}" loading="${eager ? "eager" : "lazy"}" decoding="async">
  </picture>`;
}

export const tags = (items) =>
  items?.length ? html`<ul class="tags">${items.map((t) => html`<li class="tag">${t}</li>`)}</ul>` : "";

/** Section heading with a number and an optional side note or link. */
export function sectionHead({ index, label, title, side }) {
  return html`<header class="shead reveal">
    <div>
      <p class="eyebrow"><span class="eyebrow__n">${index}</span> ${label}</p>
      <h2 class="shead__title" data-scramble>${title}</h2>
    </div>
    ${side ?? ""}
  </header>`;
}

export const moreLink = (label, href) =>
  html`<a class="more" ${linkAttrs(href)}>${label} ${icon("arrow")}</a>`;
