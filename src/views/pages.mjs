// Every page other than the homepage.

import { html, raw } from "../lib/html.mjs";
import { SITE } from "../data/site.mjs";
import * as C from "../data/content.mjs";
import { u, icon, button, picture, photoMeta, tags, linkAttrs } from "./parts.mjs";
import { projectCover } from "./home.mjs";

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
      eyebrow: "Projects",
      title: "Things I built to understand how they work.",
      lead: "Operators, container networking and provisioning tools, plus earlier security projects. Each one links to its code.",
      actions: button({ label: "All repositories", href: SITE.links.github, iconName: "arrow" }),
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
              ${button({ label: "View the code", href: p.repo, iconName: "arrow", variant: "btn--solid btn--sm" })}
              ${p.demo ? button({ label: "Watch the demo", href: p.demo, iconName: "arrow", variant: "btn--sm" }) : ""}
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
      eyebrow: "Talks",
      title: "Conference talks, with every slide.",
      lead: "Both decks are readable here in the browser and downloadable as PDF.",
    })}
    <div class="tlist">
      ${C.talks.map(
        (t) => html`<a class="card tcard reveal" href="${u(`/talks/${t.slug}/`)}" data-tilt>
          <div class="tcard__cover">
            <picture>
              <source type="image/avif" srcset="${slideSrc(t, 1, 960, "avif")}">
              <img src="${slideSrc(t, 1, 960, "webp")}" alt="First slide of ${t.shortTitle}" width="960" height="540" loading="lazy" decoding="async">
            </picture>
          </div>
          <div class="tcard__body">
            <p class="eyebrow">${t.date} · ${t.location}</p>
            <h2 class="tcard__title">${t.title}</h2>
            <p>${t.description}</p>
            ${tags(t.tags)}
            <p class="more">${t.event} · ${t.slideCount} slides ${icon("arrow")}</p>
          </div>
        </a>`,
      )}
    </div>`);
}

export function talkPage(t) {
  const SIZES = "(min-width: 1024px) 1000px, 100vw";
  const srcset = (ext) => `${slideSrc(t, 1, 960, ext)} 960w, ${slideSrc(t, 1, 1600, ext)} 1600w`;
  return page(html`
    <p class="crumb"><a href="${u("/talks/")}">${icon("back")} All talks</a></p>
    ${pageHead({ eyebrow: html`${t.event} · ${t.date} · ${t.location}`, title: t.title, lead: t.description })}
    ${tags(t.tags)}

    <div class="card viewer" data-slide-viewer data-dir="${u(t.slidesDir)}" data-count="${t.slideCount}" data-title="${t.shortTitle}">
      <div class="viewer__stage" tabindex="0" role="region" aria-roledescription="slide viewer" aria-label="Slides: ${t.shortTitle}. Use the arrow keys to move between slides.">
        <picture>
          <source data-avif type="image/avif" srcset="${srcset("avif")}" sizes="${SIZES}">
          <source data-webp type="image/webp" srcset="${srcset("webp")}" sizes="${SIZES}">
          <img data-img src="${slideSrc(t, 1, 1600, "webp")}" alt="${t.shortTitle}, slide 1 of ${t.slideCount}" width="1600" height="900" sizes="${SIZES}" fetchpriority="high" decoding="async">
        </picture>
        <button class="viewer__zone viewer__zone--prev" type="button" data-prev tabindex="-1" aria-hidden="true"></button>
        <button class="viewer__zone viewer__zone--next" type="button" data-next tabindex="-1" aria-hidden="true"></button>
      </div>
      <div class="viewer__bar">
        <div class="viewer__nav">
          <button class="btn btn--sm" type="button" data-prev aria-label="Previous slide">←</button>
          <button class="btn btn--sm" type="button" data-next aria-label="Next slide">→</button>
          <span class="viewer__count" data-counter aria-live="polite">1 / ${t.slideCount}</span>
        </div>
        <div class="viewer__nav">
          <button class="btn btn--sm" type="button" data-fullscreen>Fullscreen</button>
          ${button({ label: "PDF", href: t.pdf, iconName: "download", variant: "btn--solid btn--sm", download: true })}
        </div>
      </div>
      <input class="viewer__range" id="slide-range-${t.slug}" type="range" min="1" max="${t.slideCount}" value="1" data-range aria-label="Jump to slide">
    </div>

    <div class="prose">
      <h2>Abstract</h2>
      ${t.abstract.split(/\n\n+/).map((para) => html`<p>${para}</p>`)}
      ${t.venue ? html`<h2>Venue</h2><p><b>${t.venue.name}</b>, ${t.venue.address}. ${t.venue.note ?? ""}</p>` : ""}
      <div class="btns">
        ${t.eventUrl ? button({ label: t.event, href: t.eventUrl, iconName: "arrow", variant: "btn--sm" }) : ""}
        ${button({ label: "Invite me to speak", href: "/#contact", iconName: "mail", variant: "btn--sm" })}
      </div>
    </div>`);
}

// ---------------------------------------------------------- certifications

export function certificationsPage() {
  const status = { passed: "Passed", "in-progress": "In progress", goal: "Next goal" };
  return page(html`
    ${pageHead({
      eyebrow: "Certifications",
      title: "Eight passed, the CKS in progress.",
      lead: "Kubernetes, Linux, cloud, networking and offensive security.",
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
      eyebrow: "Moments",
      title: "On stage, on the podium and in between.",
      lead: "Photos from talks, competitions and university. Select one to enlarge it.",
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
    <dialog class="lightbox" id="lightbox" aria-label="Photo">
      <button class="lightbox__close btn btn--sm" type="button" data-close>Close</button>
      <button class="lightbox__nav lightbox__nav--prev btn btn--sm" type="button" data-prev aria-label="Previous photo">←</button>
      <figure><img id="lightbox-img" alt=""><figcaption id="lightbox-cap"></figcaption></figure>
      <button class="lightbox__nav lightbox__nav--next btn btn--sm" type="button" data-next aria-label="Next photo">→</button>
    </dialog>`);
}

// -------------------------------------------------------------------- blog

const fmtDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export function blogPage(posts) {
  return page(html`
    ${pageHead({ eyebrow: "Blog", title: "Notes on Kubernetes security and platforms.", lead: "Short posts, plus links to longer articles on Medium." })}
    <ul class="blist">
      ${posts.map(
        (post) => html`<li class="reveal">
          <a class="card bcard" href="${u(`/blog/${post.id}/`)}">
            <p class="eyebrow">${fmtDate(post.date)} · ${post.minutes} min read</p>
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
    <p class="crumb"><a href="${u("/blog/")}">${icon("back")} All posts</a></p>
    ${pageHead({ eyebrow: html`${fmtDate(post.date)} · ${post.minutes} min read`, title: post.title, lead: post.description })}
    ${tags(post.categories)}
    <article class="prose">
      ${raw(post.html)}
      ${post.link ? html`<div class="btns">${button({ label: "Read on Medium", href: post.link, iconName: "arrow", variant: "btn--solid btn--sm" })}</div>` : ""}
    </article>`,
    "page--narrow",
  );
}

// ------------------------------------------------------------------ travel

export function travelPage(worldUrl) {
  return page(
    html`
    ${pageHead({
      eyebrow: "Travel",
      title: `${SITE.visitedCountries.length} countries so far.`,
      lead: "Conferences, competitions and exchange semesters took me further than I planned. Drag the globe to turn it, or pick a country.",
    })}
    <div class="globe" data-globe data-world="${worldUrl}" data-visited="${JSON.stringify(SITE.visitedCountries)}">
      <canvas class="globe__canvas" tabindex="0" role="img" aria-label="A globe with the countries I have visited highlighted. Drag it or use the arrow keys to turn it."></canvas>
      <p class="globe__tip" data-globe-tip hidden></p>
      <p class="globe__failed dim">The globe could not load. The countries are listed below.</p>
    </div>
    <ol class="countries">
      ${SITE.visitedCountries.map(
        (name, i) => html`<li><button class="country" type="button" data-country="${name}"><span class="mono dim">${String(i + 1).padStart(2, "0")}</span>${name}</button></li>`,
      )}
    </ol>`,
  );
}

// ----------------------------------------------------------------- privacy

export function privacyPage() {
  const on = Boolean(SITE.analytics?.endpoint);
  return page(
    html`
    ${pageHead({ eyebrow: "Privacy", title: "What this site knows about your visit.", lead: "Short version: no cookies, no advertising, nothing sold or shared." })}
    <div class="prose">
      <h2>Visitor statistics</h2>
      ${on
        ? html`<p>I run my own small statistics service to see which pages are read and where visitors come from. For each page view it stores: the time, the page, the site that linked here, the country (when available), device type, browser, operating system, language, time zone and a rough screen width. It also counts a few actions: downloads, links clicked, terminal commands (the command name only), homepage sections reached and time on the page.</p>
        <p>To count a visitor once per day, the server makes an anonymous id from your IP address, your browser and a random value that is replaced every day. The IP address itself is never stored, and visits on different days cannot be linked. No cookies are set and nothing is saved on your device for this.</p>
        <p>When someone visits for the first time that day, I get a short message on Telegram with the same details: the page, the referring site, country, device, browser, language and time. It never contains an IP address or anything that identifies you. Every 15 days I also get a summary of the numbers.</p>
        <p>If your browser sends "Do Not Track" or Global Privacy Control, nothing is recorded. You can also open any page with <code>?notrack</code> at the end of the address: this browser is then never counted (the choice is kept in local storage; <code>?track</code> undoes it).</p>`
        : html`<p>This site does not collect visitor statistics.</p>`}
      <h2>Saved on your device</h2>
      <p>Your choice of colour theme, light or dark mode and whether the walking avatar is shown are kept in your browser's local storage so they survive a reload. They never leave your device.</p>
      <h2>Contact form</h2>
      <p>What you write in the form (name, e-mail address, message) is sent to me so I can reply. It is not used for anything else.</p>
      <h2>Other sites</h2>
      <p>Fonts, scripts and images are served from this site. Links to GitHub, LinkedIn or Medium take you to those sites, which have their own policies.</p>
      <h2>Questions</h2>
      <p>Write to <a href="mailto:${SITE.links.email}">${SITE.links.email}</a>.</p>
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
      <h1 class="phead__title">Error from server (NotFound): this page does not exist.</h1>
      <p class="phead__lead mono">kubectl get page --ignore-not-found returned nothing.</p>
      <div class="btns">
        ${button({ label: "Back home", href: "/", iconName: "back", variant: "btn--solid" })}
        ${button({ label: "Open the terminal", iconName: "terminal", attrs: 'data-term="ls"' })}
      </div>
    </div>`,
    "page--narrow",
  );
}
