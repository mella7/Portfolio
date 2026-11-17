// The shell around every page: <head>, site chrome, terminal, footer.

import { html, raw, jsonForScript } from "../lib/html.mjs";
import { SITE, THEMES } from "../data/site.mjs";
import { C, LANGS, lang, prefixFor, t, uiClient } from "../i18n/index.mjs";
import { u, file, icon, button, linkAttrs } from "./parts.mjs";

// One policy, used both as a <meta> tag (works on any static host) and in the
// response headers written to dist/_headers. No inline scripts or styles are
// used anywhere, so nothing needs 'unsafe-inline'.
// If statistics are sent to another host, that one origin is allowed too.
const analyticsEndpoint = SITE.analytics?.endpoint ?? "";
const analyticsOrigin = /^https?:\/\//.test(analyticsEndpoint) ? ` ${new URL(analyticsEndpoint).origin}` : "";

export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${analyticsOrigin}`,
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

// The pages in the top bar, in order.
const NAV = [
  { href: "/", key: "home" },
  { href: "/projects/", key: "projects" },
  { href: "/talks/", key: "talks" },
  { href: "/blog/", key: "blog" },
  { href: "/certifications/", key: "certs" },
  { href: "/moments/", key: "moments" },
  { href: "/travel/", key: "travel" },
];

/** The resume in the page's language, English when there is none. */
export const resumeFor = (code) => SITE.resume.find((r) => r.lang === code) ?? SITE.resume[0];

function terminal() {
  return html`<div class="term" id="term" hidden>
    <div class="term__bar">
      <i></i><i></i><i></i>
      <span class="term__title" id="term-title">visitor@mella7.me: ~</span>
      <button type="button" class="term__toggle" id="term-toggle">${t("term.drop")}</button>
    </div>
    <div class="term__main">
      <div class="term__body" id="term-body" role="log" aria-live="polite">
        <div id="term-out"></div>
        <label class="term__row">
          <span class="term__prompt" id="term-prompt">visitor@mella7:~$</span>
          <input id="term-input" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" enterkeyhint="send" aria-label="${t("term.input")}">
        </label>
      </div>
      <aside class="term__side" aria-label="${t("term.side")}">
        <h3>${t("term.start")}</h3>
        ${["whoami", "ls", "cat about.md", "help"].map(chip)}
        <h3>${t("term.cluster")}</h3>
        ${["kubectl get pods", "kubectl get certs", "kubectl get pods -n hire-me", "tetra getevents"].map(chip)}
        <h3>${t("term.site")}</h3>
        ${["open talks", "theme blue", "resume", "neofetch"].map(chip)}
      </aside>
    </div>
  </div>`;
}

const chip = (cmd) => html`<button class="term__chip" type="button" data-run="${cmd}">${cmd}</button>`;

/**
 * @param {object} page
 * @param {string} page.title        <title> and og:title
 * @param {string} page.description  meta description
 * @param {string} page.path         site path without the language, e.g. "/talks/"
 * @param {object} page.body         html`` result
 * @param {object} page.assets       { css, js } URLs from the build
 * @param {object} page.termData     data for the terminal
 * @param {boolean} [page.home]      homepage: plays the intro animation
 * @param {object} [page.jsonLd]     schema.org data
 */
export function layout({ title, description, path, body, assets, termData, home = false, jsonLd, image, alternates = true }) {
  const fullTitle = home ? `${SITE.title} · ${C.site.jobTitle}` : `${title} · ${SITE.title}`;
  const pageUrl = (code) => SITE.url + file(prefixFor(code) + path);
  const canonical = pageUrl(lang);
  const ogImage = SITE.url + file(image ?? "/og-image.png");
  const ogLocale = LANGS.find((l) => l.code === lang).locale.replace("-", "_");

  return html`<!doctype html>
<html lang="${lang}" data-theme="red" data-themes="${THEMES.map((th) => th.id).join(" ")}" data-cycle="${SITE.theme?.cycleSeconds ?? 0}" data-mode="dark" data-base="${file("/").replace(/\/$/, "")}" data-analytics="${analyticsUrl()}"${home ? raw(' data-home="1"') : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
<meta name="author" content="${SITE.author.fullName}">
<meta name="theme-color" content="#0b0b0b">
<meta name="color-scheme" content="dark light">
<link rel="canonical" href="${canonical}">
${alternates
  ? html`${LANGS.map((l) => html`<link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code)}">
`)}<link rel="alternate" hreflang="x-default" href="${pageUrl("en")}">`
  : ""}
<meta property="og:type" content="website">
<meta property="og:locale" content="${ogLocale}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${file("/favicon.ico")}" sizes="48x48">
<link rel="icon" href="${file("/favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${file("/apple-touch-icon.png")}">
<link rel="manifest" href="${file("/site.webmanifest")}">
<link rel="alternate" type="application/rss+xml" title="${SITE.title} blog" href="${file("/rss.xml")}">
<link rel="preload" href="${file("/fonts/CabinetGrotesk-Variable.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${file("/fonts/Satoshi-Variable.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assets.css}">
<script src="${assets.boot}"></script>
<script type="module" src="${assets.js}"></script>
${jsonLd ? html`<script type="application/ld+json">${jsonForScript(jsonLd)}</script>` : ""}
</head>
<body class="${home ? "is-home" : "is-page"}">
<a class="skip" href="#main">${t("skip")}</a>
<div class="progress" id="progress" aria-hidden="true"></div>

${home ? bootOverlay() : ""}
${topBar(path)}

${body}

<footer class="footer">
  <div class="wrap footer__in">
    <p class="footer__love">${t("footer.madeWith")} <span class="heart" role="img" aria-label="${t("footer.love")}">${icon("heart")}</span> ${t("footer.by")} ${SITE.author.fullName} · ${C.site.location.label} · © ${new Date().getFullYear()}</p>
    <p>
      <a ${linkAttrs(SITE.links.repo)}>${t("footer.source")}</a>
      <span aria-hidden="true"> · </span>
      <a ${linkAttrs("/rss.xml")}>RSS</a>
      <span aria-hidden="true"> · </span>
      ${t("footer.noCookies")} <a ${linkAttrs("/privacy/")}>${t("footer.privacy")}</a>
    </p>
  </div>
</footer>

<div class="term-dock" id="term-dock">${terminal()}</div>
<script type="application/json" id="term-data">${jsonForScript(termData)}</script>
<script type="application/json" id="ui-text">${jsonForScript(uiClient())}</script>

<div class="companion" id="companion" title="${t("dock.companion")}"${companionSprite()}></div>
<div class="dock" role="group" aria-label="${t("dock.label")}">
  <button class="dock__btn" id="mode-toggle" type="button" title="${t("dock.mode")}">${icon("sun", "icon--sun")}${icon("moon", "icon--moon")}<span class="sr">${t("dock.mode")}</span></button>
  <button class="dock__btn" id="companion-toggle" type="button" aria-pressed="true" title="${t("dock.avatar")}">${icon("walk")}<span class="sr">${t("dock.avatar")}</span></button>
  <button class="dock__btn dock__btn--wide" id="term-fab" type="button" title="${t("dock.terminal")}">${icon("terminal")}<kbd>Ctrl+K</kbd><span class="sr">${t("dock.terminalShort")}</span></button>
</div>
</body>
</html>
`;
}

/** Where the statistics are sent: a site path gets the base path, a full URL stays as is. */
export const analyticsUrl = () => (analyticsEndpoint.startsWith("/") ? u(analyticsEndpoint) : analyticsEndpoint);

// Frame layout of the walking avatar's sprite sheet (SITE.companion).
function companionSprite() {
  if (!SITE.companion) return "";
  return html` data-sprite="${JSON.stringify(SITE.companion)}"`;
}

// The bar at the top of every page: all pages, the language and the resume.
// It stays at the top while reading; on the way down it slides away and
// comes back as soon as the visitor scrolls up (motion.js).
function topBar(path) {
  const current = (href) => (href === "/" ? path === "/" : path.startsWith(href));
  return html`<header class="topbar" id="topbar">
    <div class="wrap topbar__in">
      <a class="logo" href="${u("/")}" aria-label="${t("nav.home")}">mella7<i>.</i></a>
      <nav class="topnav" aria-label="${t("nav.label")}">
        ${NAV.map(
          (item) => html`<a href="${u(item.href)}"${current(item.href) ? raw(' aria-current="page"') : ""}>${t(`nav.${item.key}`)}</a>`,
        )}
      </nav>
      <div class="topbar__end">
        <nav class="langs" aria-label="${t("nav.language")}">
          ${LANGS.map(
            (l) => html`<a href="${file(prefixFor(l.code) + path)}" hreflang="${l.code}" lang="${l.code}" title="${l.label}" data-lang="${l.code}"${l.code === lang ? raw(' aria-current="true"') : ""}>${l.short}</a>`,
          )}
        </nav>
        ${button({ label: t("nav.resume"), href: resumeFor(lang).file, iconName: "download", variant: "btn--solid btn--sm", download: true })}
      </div>
    </div>
  </header>`;
}

// Opening animation, homepage only. boot.js decides whether it plays (first
// visit in this tab, motion allowed); without JavaScript it never shows.
function bootOverlay() {
  return html`<div class="boot" id="boot" aria-hidden="true">
    <div class="boot__shutters">${Array.from({ length: 8 }, () => html`<i></i>`)}</div>
    <canvas class="boot__canvas" id="boot-canvas"></canvas>
    <div class="boot__screen">
      <pre class="boot__log" id="boot-log"></pre>
      <div class="boot__bar"><i id="boot-bar"></i></div>
      <p class="boot__skip">${t("bootSkip")}</p>
    </div>
  </div>`;
}
