// The homepage: bento grid first, then the scrolling sections.

import { html, raw } from "../lib/html.mjs";
import { SITE, THEMES } from "../data/site.mjs";
import * as C from "../data/content.mjs";
import { u, icon, button, picture, photoMeta, tags, sectionHead, moreLink, linkAttrs } from "./parts.mjs";
import { coverArt } from "./covers.mjs";

const resumeEn = SITE.resume[0];

// ------------------------------------------------------------------ bento

function introCard() {
  const [before, accent, after] = C.intro.headline;
  return html`<section class="card card--intro">
    <div class="intro__text">
      <p class="card__label mono">whoami</p>
      <h1 class="intro__title">${before}<em>${accent}</em>${after}</h1>
      <p>Hi, I'm <b>${SITE.author.fullName}</b>, ${C.intro.paragraphs[0].replace(/^I'm /, "")}</p>
      <p>${C.intro.paragraphs[1]}</p>
      <div class="btns">
        ${button({ label: "Download resume", href: resumeEn.file, iconName: "download", variant: "btn--solid", download: true })}
        ${button({ label: "GitHub", href: SITE.links.github, iconName: "arrow", variant: "btn--sm" })}
        ${button({ label: "LinkedIn", href: SITE.links.linkedin, iconName: "arrow", variant: "btn--sm" })}
        ${button({ label: "Terminal", iconName: "terminal", variant: "btn--sm", attrs: 'data-term="neofetch"' })}
      </div>
    </div>
    <div class="intro__avatar">
      <div class="avatar" id="avatar" role="img" aria-label="3D avatar of ${SITE.author.firstName}, floating cross-legged. It turns to follow the pointer."></div>
    </div>
  </section>`;
}

const stackCard = () => html`<section class="card card--stack">
  <h2 class="card__title">Stack &amp; tools</h2>
  <dl class="stack">
    ${C.stack.map(
      (g) => html`<div><dt>${g.group}</dt><dd>${g.items.map((item) => html`<span>${item}</span>`)}</dd></div>`,
    )}
  </dl>
</section>`;

const contactCard = () => html`<section class="card card--contact">
  <h2 class="card__title">Hiring for a platform or security role?</h2>
  <h3>Contact</h3>
  <a class="plain" href="mailto:${SITE.links.email}">${SITE.links.email}</a>
  <a class="plain" href="#contact">Or use the form below ↓</a>
  <p class="dim">${SITE.location.label} · ${SITE.location.note}</p>
  <h3>Find me on</h3>
  <p class="row">
    <a class="plain" ${linkAttrs(SITE.links.linkedin)}>LinkedIn</a>
    <a class="plain" ${linkAttrs(SITE.links.github)}>GitHub</a>
    <a class="plain" ${linkAttrs(SITE.links.medium)}>Medium</a>
  </p>
  <h3>Resume (PDF)</h3>
  <p class="row row--btns">
    ${SITE.resume.map((r) =>
      button({ label: r.lang.toUpperCase(), href: r.file, iconName: "download", variant: "btn--sm", download: true, attrs: `title="Download the resume in ${r.label}"` }),
    )}
  </p>
</section>`;

const timeCard = () => html`<section class="card card--time">
  <p class="card__label">My time · ${SITE.location.country}</p>
  <p class="clock" id="clock" data-tz="${SITE.location.timezone}"><span>--</span><i>:</i><span>--</span></p>
  <p class="dim small" id="clock-diff">${SITE.location.timezone}</p>
</section>`;

function marqueeCard({ title, href, rows, size }) {
  const row = (srcs, reverse) =>
    html`<div class="mq${reverse ? " mq--rev" : ""}">${[...srcs, ...srcs].map(
      (src) => html`<img src="${u(src)}" alt="" width="${size[0]}" height="${size[1]}" loading="lazy" decoding="async">`,
    )}</div>`;
  return html`<a class="card card--mq card--link" href="${u(href)}" aria-label="${title}">
    <span class="mq__title">${title}</span>
    ${row(rows[0], false)}${row(rows[1], true)}
    <span class="card__arrow">${icon("arrow")}</span>
  </a>`;
}

const slideThumb = (talk, n) => `/thumbs/slide-${talk.slug}-${String(n).padStart(2, "0")}.webp`;

function talksCard() {
  const [a, b] = C.talks;
  return marqueeCard({
    title: "Talks",
    href: "/talks/",
    size: [68, 38],
    rows: [
      [...a.thumbs.slice(0, 4).map((n) => slideThumb(a, n)), ...b.thumbs.slice(0, 4).map((n) => slideThumb(b, n))],
      [...b.thumbs.slice(4).map((n) => slideThumb(b, n)), ...a.thumbs.slice(4).map((n) => slideThumb(a, n))],
    ],
  });
}

function momentsCard() {
  const thumbs = C.moments.map((m) => `/thumbs/moment-${m.file}.webp`);
  return marqueeCard({ title: "Moments", href: "/moments/", size: [38, 38], rows: [thumbs.slice(0, 8), thumbs.slice(8, 16)] });
}

const nowCard = () => html`<section class="card card--sm card--now">
  <div class="now__top">
    <h2 class="card__title card__title--sm">Now</h2>
    <span class="now__date"><time datetime="${SITE.now.date}">${new Date(`${SITE.now.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time><span class="pulse"></span></span>
  </div>
  <p>${SITE.now.text}</p>
</section>`;

const linkCard = ({ title, href, sub, extra }) => html`<a class="card card--sm card--link" href="${u(href)}">
  <span class="card__dots"></span>
  ${extra ?? ""}
  <h2 class="card__title">${title}${sub ? html`<small>${sub}</small>` : ""}</h2>
  <span class="card__arrow">${icon("arrow")}</span>
</a>`;

const certsCard = () =>
  linkCard({
    title: "Certs",
    href: "/certifications/",
    extra: html`<span class="badges" aria-hidden="true">${C.certifications
      .filter((c) => ["CKA", "CKAD", "RHCSA", "eJPT"].includes(c.short))
      .map((c) => html`<img src="${u(c.logo)}" alt="" width="30" height="30" loading="lazy">`)}</span>`,
  });

const themeCard = () => html`<section class="card card--sm card--theme">
  <h2 class="card__title card__title--sm">Theme</h2>
  <div class="swatches" role="group" aria-label="Accent colour">
    <button class="swatch swatch--auto" type="button" data-theme-set="auto" aria-pressed="true" title="Rotate through the colours"><span class="sr">Rotate through the colours</span></button>
    ${THEMES.map(
      (t) => html`<button class="swatch swatch--${t.id}" type="button" data-theme-set="${t.id}" aria-pressed="false" title="${t.id}"><span class="sr">${t.id} theme</span></button>`,
    )}
  </div>
</section>`;

const bento = () => html`<main class="bento" id="main">
  ${introCard()}
  ${stackCard()}
  ${contactCard()}
  ${timeCard()}
  ${talksCard()}
  ${nowCard()}
  ${linkCard({ title: "Projects", href: "/projects/" })}
  ${certsCard()}
  ${linkCard({ title: "Blog", href: "/blog/" })}
  ${momentsCard()}
  ${themeCard()}
  ${linkCard({ title: "Countries I visited", href: "/travel/", sub: `${SITE.visitedCountries.length} so far` })}
</main>`;

// ------------------------------------------------- photo slideshow (strip)
// The same continuous strip as the previous portfolio: 300x220 photos that
// scroll sideways, fade out at the edges and pause under the pointer.

function slideshow() {
  const photos = C.moments.filter((m) => m.w > m.h).slice(0, 12);
  const slide = (m, hidden) => {
    const p = photoMeta(`moments/${m.file}`);
    return html`<a class="slide" href="${u("/moments/")}"${hidden ? raw(' aria-hidden="true" tabindex="-1"') : ""}>
      <img src="${p.small}" alt="${hidden ? "" : m.caption}" width="300" height="220" loading="lazy" decoding="async">
    </a>`;
  };
  return html`<section class="slideshow" aria-label="Photo slideshow" data-count="${photos.length}">
    <div class="slideshow__track slideshow__track--${photos.length}">
      ${photos.map((m) => slide(m, false))}${photos.map((m) => slide(m, true))}
    </div>
  </section>`;
}

const figures = () => html`<section class="figures">
  <div class="wrap figures__grid">
    ${C.figures.map(
      (f) => html`<div class="fig reveal">
        <p class="fig__n">${f.prefix ? html`<small>${f.prefix}</small>` : ""}<span data-count="${f.value}">${f.value}</span>${f.suffix ? html`<sup>${f.suffix}</sup>` : ""}</p>
        <p class="fig__l">${f.label}</p>
      </div>`,
    )}
  </div>
</section>`;

// --------------------------------------------------------------- sections

const terminalSection = () => html`<section class="section wrap" id="terminal" data-section="Terminal">
  ${sectionHead({
    index: "01",
    label: "Terminal",
    title: "Explore the CV like a cluster.",
    side: html`<p class="shead__note">A small shell with a file system, <span class="mono">kubectl</span>, a live eBPF event stream and tab completion. Press <kbd>Ctrl+K</kbd> on any page to drop it down from the top.</p>`,
  })}
  <div class="term-slot reveal" id="term-slot">
    <noscript><p class="dim">The terminal needs JavaScript. Everything it shows is also on this page.</p></noscript>
  </div>
</section>`;

function highlightsSection() {
  return html`<section class="pin" id="highlights" data-section="Highlights">
    <div class="pin__in">
      <div class="wrap">
        <p class="eyebrow pin__eyebrow"><span class="eyebrow__n">02</span> Highlights</p>
        <div class="pin__grid">
          <div class="rail" aria-hidden="true"><i id="rail-fill"></i>${C.highlights.map((_, i) => html`<b class="rail__tick rail__tick--${i}"></b>`)}</div>
          <ol class="steps">
            ${C.highlights.map(
              (h, i) => html`<li class="step${i === 0 ? " is-on" : ""}">
                <span class="step__mark" aria-hidden="true">${h.mark}</span>
                <p class="eyebrow">${h.meta}</p>
                <h3 class="step__title"><a href="${u(h.href)}">${h.title}</a></h3>
                <p class="step__text">${h.text}</p>
                ${tags(h.tags)}
                <a class="more" href="${u(h.href)}">${h.cta} ${icon("arrow")}</a>
              </li>`,
            )}
          </ol>
          <div class="stage">
            ${C.highlights.map(
              (h, i) => html`<a class="stage__item${i === 0 ? " is-on" : ""}" href="${u(h.href)}" tabindex="-1" aria-hidden="true">
                ${picture(h.photo, { alt: "", sizes: "(min-width: 820px) 560px, 100vw", eager: i === 0 })}
              </a>`,
            )}
            <span class="stage__cap" id="stage-cap" data-places="${C.highlights.map((h) => h.place).join("|")}">${C.highlights[0].place}</span>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

export function projectCover(project, sizes = "400px") {
  if (project.cover.art) return coverArt(project.cover.art);
  return picture(project.cover.image, { alt: `${project.name} screenshot`, sizes });
}

function projectsSection() {
  const total = String(C.projects.length).padStart(2, "0");
  return html`<section class="hz" id="projects" data-section="Projects">
    <div class="hz__in">
      <div class="wrap hz__head">
        <div>
          <p class="eyebrow"><span class="eyebrow__n">03</span> Projects</p>
          <h2 class="shead__title" data-scramble>Built from scratch to understand it.</h2>
        </div>
        <p class="hz__count"><b id="hz-n">01</b> / ${total}</p>
      </div>
      <div class="hz__scroller">
        <div class="hz__track" id="hz-track">
          ${C.projects.map(
            (p) => html`<article class="pc">
              <a class="pc__cover" href="${u(`/projects/#${p.slug}`)}" tabindex="-1" aria-hidden="true">
                ${projectCover(p)}
                <span class="pc__year">${p.year}</span>
              </a>
              <div class="pc__body">
                <h3 class="pc__title"><a href="${u(`/projects/#${p.slug}`)}">${p.name}</a></h3>
                <p>${p.description}</p>
                ${tags(p.stack.slice(0, 3))}
                <p class="pc__links">
                  <a class="more" ${linkAttrs(p.repo)}>Code ${icon("arrow")}</a>
                  ${p.demo ? html`<a class="more" ${linkAttrs(p.demo)}>Demo ${icon("arrow")}</a>` : ""}
                </p>
              </div>
            </article>`,
          )}
          <a class="pc pc--end" href="${u("/projects/")}">
            <p class="eyebrow">That's all ${C.projects.length}</p>
            <h3 class="pc__title">All projects ${icon("arrow")}</h3>
            <p>With full descriptions and stacks.</p>
          </a>
        </div>
      </div>
      <div class="wrap"><div class="hz__bar"><i id="hz-bar"></i></div></div>
    </div>
  </section>`;
}

function experienceSection() {
  return html`<section class="section wrap" id="experience" data-section="Experience">
    ${sectionHead({
      index: "04",
      label: "Experience",
      title: "Where I've worked.",
      side: html`<div class="shead__actions">${SITE.resume.map((r) =>
        button({ label: `Resume ${r.lang.toUpperCase()}`, href: r.file, iconName: "download", variant: r.lang === "en" ? "btn--solid btn--sm" : "btn--sm", download: true }),
      )}</div>`,
    })}
    <ol class="xp">
      ${C.experience.map(
        (job) => html`<li class="xp__item reveal">
          <p class="xp__when">${job.start} - ${job.end}${job.location ? html`<span>${job.location}</span>` : ""}</p>
          <div>
            <h3 class="xp__title">${job.title} <span>· ${job.company}</span></h3>
            <ul class="xp__points">${job.points.slice(0, 2).map((p) => html`<li>${p}</li>`)}</ul>
            ${job.points.length > 2
              ? html`<details class="xp__more"><summary>${job.points.length - 2} more</summary><ul class="xp__points">${job.points.slice(2).map((p) => html`<li>${p}</li>`)}</ul></details>`
              : ""}
          </div>
        </li>`,
      )}
    </ol>
    <div class="edu">
      <div class="reveal">
        <h3 class="edu__h">Education</h3>
        <ul class="edu__list">${C.education.map((e) => html`<li><b>${e.degree}</b><span>${e.school}</span><span class="mono">${e.period}</span></li>`)}</ul>
      </div>
      <div class="reveal">
        <h3 class="edu__h">Languages</h3>
        <ul class="edu__list edu__list--inline">${C.languages.map((l) => html`<li><b>${l.name}</b><span>${l.level}</span></li>`)}</ul>
        <h3 class="edu__h">Awards</h3>
        <ul class="edu__list">${C.awards.map((a) => html`<li><span class="mono">${a.period}</span><span>${a.title}</span></li>`)}</ul>
      </div>
    </div>
  </section>`;
}

function skillsSection() {
  return html`<section class="section wrap" id="skills" data-section="Skills">
    ${sectionHead({ index: "05", label: "Skills and certifications", title: "The stack, and the proof.", side: moreLink("All certifications", "/certifications/") })}
    <div class="pillars">
      ${C.pillars.map(
        (p) => html`<article class="card pillar reveal" data-tilt>
          <p class="mono dim">${p.command}</p>
          <h3>${p.title}</h3>
          <p>${p.text}</p>
        </article>`,
      )}
    </div>
    <div class="sk">
      <dl class="sk__groups">
        ${C.stack.map(
          (g) => html`<div class="sk__row reveal"><dt>${g.group}</dt><dd>${g.items.map((item) => html`<span>${item}</span>`)}</dd></div>`,
        )}
      </dl>
      <ul class="certgrid">
        ${C.certifications
          .filter((c) => c.status !== "goal")
          .map(
            (c) => html`<li class="cert reveal${c.status !== "passed" ? " cert--next" : ""}">
              <img src="${u(c.logo)}" alt="" width="56" height="56" loading="lazy" decoding="async">
              <span>${c.short}</span>
              ${c.status !== "passed" ? html`<small>In progress</small>` : ""}
            </li>`,
          )}
      </ul>
    </div>
  </section>`;
}

// Kind words reuse the slideshow strip, as on the previous portfolio.
function wordsSection() {
  const card = (t, hidden) => html`<figure class="quote"${hidden ? raw(' aria-hidden="true"') : ""}>
    <img src="${u(t.photo)}" alt="" width="56" height="56" loading="lazy" decoding="async">
    <blockquote>${t.quote}</blockquote>
    <figcaption>${t.name}</figcaption>
  </figure>`;
  return html`<section class="section" id="words" data-section="Kind words">
    <div class="wrap">${sectionHead({ index: "06", label: "Kind words", title: "From people I've worked with." })}</div>
    <div class="slideshow slideshow--quotes">
      <div class="slideshow__track slideshow__track--${C.testimonials.length}">
        ${C.testimonials.map((t) => card(t, false))}${C.testimonials.map((t) => card(t, true))}
      </div>
    </div>
  </section>`;
}

function contactSection() {
  return html`<section class="section contact" id="contact" data-section="Contact">
    <div class="wrap">
      <p class="eyebrow reveal"><span class="eyebrow__n">07</span> Get in touch</p>
      <h2 class="contact__big reveal"><span>Let's talk.</span></h2>
      <div class="contact__grid">
        <div class="card contact__form reveal">
          <h3 class="card__title">Send me anything</h3>
          <p class="dim">A job, a talk invitation, a question about Kubernetes, or just hello. It lands in my inbox.</p>
          <form class="form" name="contact" method="POST" action="${u(SITE.contactFormAction)}" data-contact-form data-email="${SITE.links.email}">
            <input type="hidden" name="form-name" value="contact">
            <p class="form__trap" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
            <div class="form__two">
              <label class="field"><span>Name</span><input id="cf-name" name="name" required maxlength="120" autocomplete="name" placeholder="Your name"></label>
              <label class="field"><span>Email</span><input id="cf-email" name="email" type="email" required maxlength="200" autocomplete="email" placeholder="you@company.com"></label>
            </div>
            <label class="field"><span>Message</span><textarea id="cf-message" name="message" required maxlength="4000" rows="5" placeholder="What would you like to talk about?"></textarea></label>
            <div class="form__foot">
              ${button({ label: "Send message", iconName: "mail", variant: "btn--solid", type: "submit" })}
              <p class="form__status" data-status role="status" aria-live="polite"></p>
            </div>
          </form>
        </div>
        <div class="contact__side reveal">
          <h3>Or directly</h3>
          <p><a class="contact__mail" href="mailto:${SITE.links.email}" id="mail">${SITE.links.email}</a></p>
          <p class="row row--btns">
            ${button({ label: "Copy email", attrs: `data-copy="${SITE.links.email}"`, variant: "btn--sm" })}
            ${button({ label: "LinkedIn", href: SITE.links.linkedin, iconName: "arrow", variant: "btn--sm" })}
            ${button({ label: "GitHub", href: SITE.links.github, iconName: "arrow", variant: "btn--sm" })}
          </p>
          <h3>Resume</h3>
          <p class="row row--btns">
            ${SITE.resume.map((r) =>
              button({ label: r.label, href: r.file, iconName: "download", variant: r.lang === "en" ? "btn--solid btn--sm" : "btn--sm", download: true }),
            )}
          </p>
          <p class="dim small">${SITE.location.label}. ${SITE.location.note}.</p>
        </div>
      </div>
    </div>
  </section>`;
}

const sectionNav = () => html`<nav class="snav" id="snav" aria-label="Sections">
  <a href="#main"><span>00</span>Home</a>
  <a href="#terminal"><span>01</span>Terminal</a>
  <a href="#highlights"><span>02</span>Highlights</a>
  <a href="#projects"><span>03</span>Projects</a>
  <a href="#experience"><span>04</span>Experience</a>
  <a href="#skills"><span>05</span>Skills</a>
  <a href="#words"><span>06</span>Words</a>
  <a href="#contact"><span>07</span>Contact</a>
</nav>`;

export function homePage() {
  return html`
  <a class="notice" href="#contact"><span class="pulse"></span><span>${C.intro.notice}</span><b>Go to the form ↓</b></a>
  ${sectionNav()}
  ${bento()}
  ${slideshow()}
  ${figures()}
  ${terminalSection()}
  ${highlightsSection()}
  ${projectsSection()}
  ${experienceSection()}
  ${skillsSection()}
  ${wordsSection()}
  ${contactSection()}`;
}

export const homeJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.author.fullName,
  url: SITE.url,
  jobTitle: SITE.author.jobTitle,
  email: `mailto:${SITE.links.email}`,
  sameAs: [SITE.links.github, SITE.links.linkedin, SITE.links.medium],
  address: { "@type": "PostalAddress", addressCountry: "DE", addressLocality: "Munich" },
});
