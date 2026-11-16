// The shell around every page: <head>, site chrome, terminal, footer.

import { html, raw, jsonForScript } from "../lib/html.mjs";
import { SITE, THEMES } from "../data/site.mjs";
import { u, icon, button, linkAttrs } from "./parts.mjs";

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

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects/", label: "Projects" },
  { href: "/talks/", label: "Talks" },
  { href: "/certifications/", label: "Certs" },
  { href: "/moments/", label: "Moments" },
  { href: "/blog/", label: "Blog" },
];

function terminal() {
  return html`<div class="term" id="term" hidden>
    <div class="term__bar">
      <i></i><i></i><i></i>
      <span class="term__title" id="term-title">visitor@mella7.me: ~</span>
      <button type="button" class="term__toggle" id="term-toggle">Ctrl+K drop down</button>
    </div>
    <div class="term__main">
      <div class="term__body" id="term-body" role="log" aria-live="polite">
        <div id="term-out"></div>
        <label class="term__row">
          <span class="term__prompt" id="term-prompt">visitor@mella7:~$</span>
          <input id="term-input" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" enterkeyhint="send" aria-label="Terminal input">
        </label>
      </div>
      <aside class="term__side" aria-label="Commands to try">
        <h3>Start here</h3>
        ${["whoami", "ls", "cat about.md", "help"].map(chip)}
        <h3>Cluster</h3>
        ${["kubectl get pods", "kubectl get certs", "kubectl get pods -n hire-me", "tetra getevents"].map(chip)}
        <h3>Site</h3>
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
 * @param {string} page.path         site path, e.g. "/talks/"
 * @param {object} page.body         html`` result
 * @param {object} page.assets       { css, js } URLs from the build
 * @param {object} page.termData     data for the terminal
 * @param {boolean} [page.home]      homepage: no top bar, plays the intro
 * @param {object} [page.jsonLd]     schema.org data
 */
export function layout({ title, description, path, body, assets, termData, home = false, jsonLd, image }) {
  const fullTitle = home ? `${SITE.title} · ${SITE.author.jobTitle}` : `${title} · ${SITE.title}`;
  const canonical = SITE.url + path;
  const ogImage = SITE.url + (image ?? "/og-image.png");

  return html`<!doctype html>
<html lang="en" data-theme="red" data-themes="${THEMES.map((t) => t.id).join(" ")}" data-cycle="${SITE.theme?.cycleSeconds ?? 0}" data-mode="dark" data-base="${u("/").replace(/\/$/, "")}" data-analytics="${analyticsUrl()}"${home ? raw(' data-home="1"') : ""}>
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
<meta property="og:type" content="website">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${u("/favicon.ico")}" sizes="48x48">
<link rel="icon" href="${u("/favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${u("/apple-touch-icon.png")}">
<link rel="manifest" href="${u("/site.webmanifest")}">
<link rel="alternate" type="application/rss+xml" title="${SITE.title} blog" href="${u("/rss.xml")}">
<link rel="preload" href="${u("/fonts/CabinetGrotesk-Variable.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${u("/fonts/Satoshi-Variable.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assets.css}">
<script src="${assets.boot}"></script>
<script type="module" src="${assets.js}"></script>
${jsonLd ? html`<script type="application/ld+json">${jsonForScript(jsonLd)}</script>` : ""}
</head>
<body class="${home ? "is-home" : "is-page"}">
<a class="skip" href="#main">Skip to content</a>
<div class="progress" id="progress" aria-hidden="true"></div>

${home ? bootOverlay() : topBar(path)}

${body}

<footer class="footer">
  <div class="wrap footer__in">
    <p class="footer__love">Made with <span class="heart" role="img" aria-label="love">${icon("heart")}</span> by ${SITE.author.fullName} · ${SITE.location.label} · © ${new Date().getFullYear()}</p>
    <p>
      <a ${linkAttrs(SITE.links.repo)}>Source on GitHub</a>
      <span aria-hidden="true"> · </span>
      <a ${linkAttrs("/rss.xml")}>RSS</a>
      <span aria-hidden="true"> · </span>
      No cookies. <a ${linkAttrs("/privacy/")}>Privacy</a>
    </p>
  </div>
</footer>

<div class="term-dock" id="term-dock">${terminal()}</div>
<script type="application/json" id="term-data">${jsonForScript(termData)}</script>

<div class="companion" id="companion" title="Click me"${companionSprite()}></div>
<div class="dock" role="group" aria-label="Site controls">
  <button class="dock__btn" id="mode-toggle" type="button" title="Switch between light and dark">${icon("sun", "icon--sun")}${icon("moon", "icon--moon")}<span class="sr">Switch between light and dark</span></button>
  <button class="dock__btn" id="companion-toggle" type="button" aria-pressed="true" title="Show or hide the walking avatar">${icon("walk")}<span class="sr">Show or hide the walking avatar</span></button>
  <button class="dock__btn dock__btn--wide" id="term-fab" type="button" title="Open the terminal (Ctrl+K)">${icon("terminal")}<kbd>Ctrl+K</kbd><span class="sr">Open the terminal</span></button>
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

function topBar(path) {
  return html`<header class="topbar">
    <div class="wrap topbar__in">
      <a class="logo" href="${u("/")}" aria-label="Home">mella7<i>.</i></a>
      <nav class="topnav" aria-label="Pages">
        ${NAV.map(
          (item) =>
            html`<a href="${u(item.href)}"${item.href !== "/" && path.startsWith(item.href) ? raw(' aria-current="page"') : ""}>${item.label}</a>`,
        )}
      </nav>
      ${button({ label: "Resume", href: SITE.resume[0].file, iconName: "download", variant: "btn--solid btn--sm", download: true })}
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
      <p class="boot__skip">Click or press any key to skip</p>
    </div>
  </div>`;
}
