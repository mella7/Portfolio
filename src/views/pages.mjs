// Every page other than the homepage.

import { html, raw } from "../lib/html.mjs";
import { SITE } from "../data/site.mjs";
import { C, countryName, countryNames, lang, longDate, t } from "../i18n/index.mjs";
import { u, icon, button, picture, photoMeta, tags, linkAttrs } from "./parts.mjs";
import { projectCover } from "./home.mjs";

/** A short note shown on French and German pages whose material is English. */
const englishNote = (key) => {
  const text = t(key);
  return text ? html`<p class="lang-note">${text}</p>` : "";
};

const pageHead = ({ eyebrow, title, lead, actions }) => html`<header class="phead">
  <p class="eyebrow">${eyebrow}</p>
  <h1 class="phead__title" data-scramble>${title}</h1>
  ${lead ? html`<p class="phead__lead">${lead}</p>` : ""}
  ${actions ? html`<div class="btns">${actions}</div>` : ""}
</header>`;

const page = (inner, cls = "") => html`<main class="page wrap ${cls}" id="main">${inner}</main>`;

// ---------------------------------------------------------------- projects

export function projectsPage() {
  return page(html`
    ${pageHead({
      eyebrow: t("pages.projects.eyebrow"),
      title: t("pages.projects.title"),
      lead: t("pages.projects.lead"),
      actions: button({ label: t("pages.projects.allRepos"), href: SITE.links.github, iconName: "arrow" }),
    })}
    <div class="plist">
      ${C.projects.map(
        (p) => html`<article class="card pcard reveal" id="${p.slug}" data-tilt>
          <a class="pcard__cover" ${linkAttrs(p.repo)} tabindex="-1" aria-hidden="true">${projectCover(p, "(min-width: 820px) 520px, 100vw")}</a>
          <div class="pcard__body">
            <p class="eyebrow">${p.year}${p.highlight ? html` · ${p.highlight}` : ""}</p>
            <h2 class="pcard__title">${p.name}</h2>
            <p>${p.description}</p>
            ${tags(p.stack)}
            <div class="btns">
              ${button({ label: t("pages.projects.viewCode"), href: p.repo, iconName: "arrow", variant: "btn--solid btn--sm" })}
              ${p.demo ? button({ label: t("pages.projects.watchDemo"), href: p.demo, iconName: "arrow", variant: "btn--sm" }) : ""}
            </div>
          </div>
        </article>`,
      )}
    </div>`);
}

// ------------------------------------------------------------------- talks

const slideSrc = (talk, n, w, ext) => u(`${talk.slidesDir}/${String(n).padStart(2, "0")}-${w}.${ext}`);

export function talksPage() {
  return page(html`
    ${pageHead({
      eyebrow: t("pages.talks.eyebrow"),
      title: t("pages.talks.title"),
      lead: t("pages.talks.lead"),
    })}
    ${englishNote("pages.talks.englishNote")}
    <div class="tlist">
      ${C.talks.map(
        (talk) => html`<a class="card tcard reveal" href="${u(`/talks/${talk.slug}/`)}" data-tilt>
          <div class="tcard__cover">
            <picture>
              <source type="image/avif" srcset="${slideSrc(talk, 1, 960, "avif")}">
              <img src="${slideSrc(talk, 1, 960, "webp")}" alt="${t("pages.talks.firstSlide", talk.shortTitle)}" width="960" height="540" loading="lazy" decoding="async">
            </picture>
          </div>
          <div class="tcard__body">
            <p class="eyebrow">${talk.date} · ${talk.location}</p>
            <h2 class="tcard__title">${talk.title}</h2>
            <p>${talk.description}</p>
            ${tags(talk.tags)}
            <p class="more">${talk.event} · ${t("pages.talks.slides", talk.slideCount)} ${icon("arrow")}</p>
          </div>
        </a>`,
      )}
    </div>`);
}

export function talkPage(talk) {
  const SIZES = "(min-width: 1024px) 1000px, 100vw";
  const srcset = (ext) => `${slideSrc(talk, 1, 960, ext)} 960w, ${slideSrc(talk, 1, 1600, ext)} 1600w`;
  return page(html`
    <p class="crumb"><a href="${u("/talks/")}">${icon("back")} ${t("pages.talks.all")}</a></p>
    ${pageHead({ eyebrow: html`${talk.event} · ${talk.date} · ${talk.location}`, title: talk.title, lead: talk.description })}
    ${tags(talk.tags)}
    ${englishNote("pages.talks.englishNote")}

    <div class="card viewer" data-slide-viewer data-dir="${u(talk.slidesDir)}" data-count="${talk.slideCount}" data-title="${talk.shortTitle}">
      <div class="viewer__stage" tabindex="0" role="region" aria-roledescription="slide viewer" aria-label="${t("pages.talks.viewer", talk.shortTitle)}">
        <picture>
          <source data-avif type="image/avif" srcset="${srcset("avif")}" sizes="${SIZES}">
          <source data-webp type="image/webp" srcset="${srcset("webp")}" sizes="${SIZES}">
          <img data-img src="${slideSrc(talk, 1, 1600, "webp")}" alt="${t("pages.talks.slideOf", talk.shortTitle, 1, talk.slideCount)}" width="1600" height="900" sizes="${SIZES}" fetchpriority="high" decoding="async">
        </picture>
        <button class="viewer__zone viewer__zone--prev" type="button" data-prev tabindex="-1" aria-hidden="true"></button>
        <button class="viewer__zone viewer__zone--next" type="button" data-next tabindex="-1" aria-hidden="true"></button>
      </div>
      <div class="viewer__bar">
        <div class="viewer__nav">
          <button class="btn btn--sm" type="button" data-prev aria-label="${t("pages.talks.prev")}">←</button>
          <button class="btn btn--sm" type="button" data-next aria-label="${t("pages.talks.next")}">→</button>
          <span class="viewer__count" data-counter aria-live="polite">1 / ${talk.slideCount}</span>
        </div>
        <div class="viewer__nav">
          <button class="btn btn--sm" type="button" data-fullscreen>${t("pages.talks.fullscreen")}</button>
          ${button({ label: "PDF", href: talk.pdf, iconName: "download", variant: "btn--solid btn--sm", download: true })}
        </div>
      </div>
      <input class="viewer__range" id="slide-range-${talk.slug}" type="range" min="1" max="${talk.slideCount}" value="1" data-range aria-label="${t("pages.talks.jump")}">
    </div>

    <div class="prose">
      <h2>${t("pages.talks.abstract")}</h2>
      ${talk.abstract.split(/\n\n+/).map((para) => html`<p>${para}</p>`)}
      ${talk.venue ? html`<h2>${t("pages.talks.venue")}</h2><p><b>${talk.venue.name}</b>, ${talk.venue.address}. ${talk.venue.note ?? ""}</p>` : ""}
      <div class="btns">
        ${talk.eventUrl ? button({ label: talk.event, href: talk.eventUrl, iconName: "arrow", variant: "btn--sm" }) : ""}
        ${button({ label: t("pages.talks.invite"), href: "/#contact", iconName: "mail", variant: "btn--sm" })}
      </div>
    </div>`);
}

// ---------------------------------------------------------- certifications

export function certificationsPage() {
  const status = t("pages.certs.status");
  return page(html`
    ${pageHead({
      eyebrow: t("pages.certs.eyebrow"),
      title: t("pages.certs.title"),
      lead: t("pages.certs.lead"),
    })}
    <ul class="clist">
      ${C.certifications.map(
        (c) => html`<li class="card ccard ccard--${c.status} reveal" data-tilt>
          <img src="${u(c.logo)}" alt="" width="96" height="96" loading="lazy" decoding="async">
          <div>
            <p class="eyebrow">${c.issuer}</p>
            <h2 class="ccard__title">${c.name}</h2>
            <p class="ccard__status">${status[c.status]}</p>
          </div>
        </li>`,
      )}
    </ul>`);
}

// ----------------------------------------------------------------- moments

export function momentsPage() {
  let huaweiMarked = false;
  return page(html`
    ${pageHead({
      eyebrow: t("pages.moments.eyebrow"),
      title: t("pages.moments.title"),
      lead: t("pages.moments.lead"),
    })}
    <ul class="gallery" data-gallery>
      ${C.moments.map((m) => {
        const p = photoMeta(`moments/${m.file}`);
        const anchor = !huaweiMarked && m.file.startsWith("huawei-global");
        if (anchor) huaweiMarked = true;
        return html`<li class="gallery__item reveal"${anchor ? raw(' id="huawei"') : ""}>
          <a href="${p.full}" data-full="${p.full}" data-caption="${m.caption}">
            ${picture(`moments/${m.file}`, { alt: m.caption, sizes: "(min-width: 900px) 33vw, (min-width: 560px) 50vw, 100vw" })}
            <span class="gallery__cap">${m.caption}</span>
          </a>
        </li>`;
      })}
    </ul>
    <dialog class="lightbox" id="lightbox" aria-label="${t("pages.moments.dialog")}">
      <button class="lightbox__close btn btn--sm" type="button" data-close>${t("pages.moments.close")}</button>
      <button class="lightbox__nav lightbox__nav--prev btn btn--sm" type="button" data-prev aria-label="${t("pages.moments.prev")}">←</button>
      <figure><img id="lightbox-img" alt=""><figcaption id="lightbox-cap"></figcaption></figure>
      <button class="lightbox__nav lightbox__nav--next btn btn--sm" type="button" data-next aria-label="${t("pages.moments.next")}">→</button>
    </dialog>`);
}

// -------------------------------------------------------------------- blog

export function blogPage(posts) {
  const untranslated = posts.some((post) => post.lang !== lang);
  return page(html`
    ${pageHead({ eyebrow: t("pages.blog.eyebrow"), title: t("pages.blog.title"), lead: t("pages.blog.lead") })}
    ${untranslated ? englishNote("pages.blog.englishNote") : ""}
    <ul class="blist">
      ${posts.map(
        (post) => html`<li class="reveal">
          <a class="card bcard" href="${u(`/blog/${post.id}/`)}">
            <p class="eyebrow">${longDate(post.date)} · ${t("pages.blog.minutes", post.minutes)}</p>
            <h2 class="bcard__title">${post.title}</h2>
            <p>${post.description}</p>
            <span class="card__arrow">${icon("arrow")}</span>
          </a>
        </li>`,
      )}
    </ul>`);
}

export function postPage(post) {
  return page(
    html`
    <p class="crumb"><a href="${u("/blog/")}">${icon("back")} ${t("pages.blog.all")}</a></p>
    ${pageHead({ eyebrow: html`${longDate(post.date)} · ${t("pages.blog.minutes", post.minutes)}`, title: post.title, lead: post.description })}
    ${tags(post.categories)}
    ${post.lang !== lang ? englishNote("pages.blog.englishNote") : ""}
    <article class="prose"${post.lang !== lang ? raw(` lang="${post.lang}"`) : ""}>
      ${raw(post.html)}
      ${post.link ? html`<div class="btns">${button({ label: t("pages.blog.medium"), href: post.link, iconName: "arrow", variant: "btn--solid btn--sm" })}</div>` : ""}
    </article>`,
    "page--narrow",
  );
}

// ------------------------------------------------------------------ travel

/**
 * @param {string} worldUrl      the country outlines for the globe
 * @param {string[]} worldNames  the English country names in those outlines
 */
export function travelPage(worldUrl, worldNames = []) {
  return page(
    html`
    ${pageHead({
      eyebrow: t("pages.travel.eyebrow"),
      title: t("pages.travel.title", SITE.visitedCountries.length),
      lead: t("pages.travel.lead"),
    })}
    <div class="globe" data-globe data-world="${worldUrl}" data-visited="${JSON.stringify(SITE.visitedCountries)}" data-names="${JSON.stringify(countryNames(worldNames))}">
      <canvas class="globe__canvas" tabindex="0" role="img" aria-label="${t("pages.travel.globe")}"></canvas>
      <p class="globe__tip" data-globe-tip hidden></p>
      <p class="globe__failed dim">${t("pages.travel.failed")}</p>
    </div>
    <ol class="countries">
      ${SITE.visitedCountries.map(
        (name, i) => html`<li><button class="country" type="button" data-country="${name}"><span class="mono dim">${String(i + 1).padStart(2, "0")}</span>${countryName(name)}</button></li>`,
      )}
    </ol>`,
  );
}

// ----------------------------------------------------------------- privacy

export function privacyPage() {
  const on = Boolean(SITE.analytics?.endpoint);
  const P = (key) => t(`pages.privacy.${key}`);
  return page(
    html`
    ${pageHead({ eyebrow: P("eyebrow"), title: P("title"), lead: P("lead") })}
    <div class="prose">
      <h2>${P("statsTitle")}</h2>
      ${on ? P("statsHtml").map((para) => html`<p>${raw(para)}</p>`) : html`<p>${P("statsOff")}</p>`}
      <h2>${P("deviceTitle")}</h2>
      <p>${P("deviceText")}</p>
      <h2>${P("formTitle")}</h2>
      <p>${P("formText")}</p>
      <h2>${P("otherTitle")}</h2>
      <p>${P("otherText")}</p>
      <h2>${P("questionsTitle")}</h2>
      <p>${P("writeTo")} <a href="mailto:${SITE.links.email}">${SITE.links.email}</a>.</p>
    </div>`,
    "page--narrow",
  );
}

// --------------------------------------------------------------------- 404

export function notFoundPage() {
  return page(
    html`
    <div class="nf">
      <p class="nf__code" aria-hidden="true">404</p>
      <h1 class="phead__title">${t("pages.notFound.title")}</h1>
      <p class="phead__lead mono">${t("pages.notFound.lead")}</p>
      <div class="btns">
        ${button({ label: t("pages.notFound.back"), href: "/", iconName: "back", variant: "btn--solid" })}
        ${button({ label: t("pages.notFound.terminal"), iconName: "terminal", attrs: 'data-term="ls"' })}
      </div>
    </div>`,
    "page--narrow",
  );
}
