# mella7.me - Portfolio

Personal portfolio of **Mohamed Ali Mellah** - Cloud-Native & Kubernetes Engineer · DevSecOps Practitioner.

Built with Next.js 14 (App Router), Tailwind CSS, shadcn/ui and framer-motion. Deployed on Netlify. Blog managed with Decap CMS.

## Features

- **Trilingual site** - full content in English (`/en`), German (`/de`) and French (`/fr`), with a language switcher in the dock.
- **Resume downloads** - EN/DE/FR buttons that open the PDF in a new tab with a smooth hover/tap animation.
- **Blog with browser-based admin** - write and edit posts at `/admin` (Decap CMS), no code, no manual deploy. Supports drafts, scheduled posts, tags, per-language filtering and automatic reading-time estimates.
- **Talks page** - international speaking engagements (`/en/talks`), with optional slide decks (self-hosted PDF or embedded player) and recording links per talk.
- **Certifications page** - full certification grid with in-progress badges (`/en/certifications`).
- **Projects page** - homepage shows a 4-project preview with a "view all" link through to `/en/projects`, which lists every project.
- **Working contact form** - name/email/message form (Formspree-backed, no server code) plus a live embedded map and a direct mailto link.
- **Seamless photo slideshow** - the strip loops with no jump/blank-frame, fixed slide sizing so it doesn't jitter, and fades out at both edges.
- **Interactive terminal** on the homepage - visitors explore the CV by typing real commands (`whoami`, `skills`, `projects`, `talks`, `certs`, `contact`, `resume`, `neofetch`, plus `kubectl`/`sudo` easter eggs). Supports tab-completion and arrow-key history. All output is generated from `src/data/*.tsx`, so it stays in sync automatically - edit your CV data and the terminal updates itself.
- Awards timeline, testimonials, dark mode, `sitemap.xml` + `robots.txt` for SEO.

### Editing the terminal

Commands live in `src/components/terminal.tsx` in the `commands` object. To add one:

```ts
mycommand: {
  desc: "shows up in `help`",
  run: () => ["line one", "line two"],
},
```

Terminal UI text (banner, hint, error message) is translated in `src/i18n/ui.ts` under `terminal`.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000  (redirects to /en)
```

Requires Node.js >= 18.17. The first page load needs internet access (Google Fonts).

To use the blog admin locally (no auth needed):

```bash
# terminal 1
npx decap-server
# terminal 2
npm run dev
# open http://localhost:3000/admin
```

## Deploy on Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site -> Import an existing project -> GitHub -> pick the repo.**
3. Netlify auto-detects Next.js - no build settings needed. Deploy.
4. Point your domain (mella7.me) at the site as before.

Every push to `main` (including blog edits made through `/admin`) triggers an automatic rebuild.

## Blog admin setup (one-time)

The admin panel (`/admin`) uses Decap CMS with the **GitHub backend** - you log in with your own GitHub account. (The old Netlify Identity flow is deprecated, so don't use it.)

1. **`public/admin/config.yml`** - change `repo: mella7/Portfolio` to your real `username/repo`.
2. **GitHub** -> Settings -> Developer settings -> OAuth Apps -> *New OAuth App*:
   - Application name: anything (e.g. "mella7.me CMS")
   - Homepage URL: `https://mella7.me`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Save, then copy the **Client ID** and generate a **Client Secret**.
3. **Netlify** -> your site -> *Site configuration -> Access & security -> OAuth* -> **Install provider** -> GitHub -> paste Client ID + Secret.
4. Open `https://mella7.me/admin`, click *Login with GitHub*, authorize - done.

### How editing works

You write posts in a rich-text editor in the browser. The admin uses **editorial workflow**, so posts move through *Draft -> In review -> Ready* columns. Saving a draft commits to a side branch (nothing goes live); hitting **Publish** merges to `main`, Netlify sees the commit and rebuilds automatically. Your post is live in ~1-2 minutes. You never touch code or run a deploy yourself.

Writing features available in the editor:

| Feature | How |
|---|---|
| Save without publishing | Save as **Draft** - stays on a side branch |
| Hide a published post | Toggle the **Draft** switch on the post |
| Schedule a post | Set **Publish Date** in the future - it appears after the next rebuild on/after that date |
| Tags | **Tags** list field, shown as chips on the blog index |
| Images | Drag and drop into the body, or set a **Cover Image** |
| Code blocks | Fenced markdown code blocks get syntax highlighting automatically |
| Reading time | Calculated automatically from word count - nothing to fill in |
| Language | The **Language** field decides which of `/en`, `/de`, `/fr` the post shows on |

### Linking out to articles hosted elsewhere

Set `externalUrl` in a post's frontmatter (or the **External URL** field in the admin) and the blog index links straight out to the original, with an external-link icon. No page is generated on this site, so the canonical version stays on Medium and you avoid duplicate content. `content/blog/kubernetes-devsecops-platform-aws.md` is a working example.

### Visitor analytics

`src/components/analytics.tsx` is wired up for [Umami](https://umami.is), which is cookie-free and collects no personal data, so **no cookie banner is required under GDPR**. It renders nothing until you configure it, so local development stays clean.

To turn it on: create a free account at umami.is, add `mella7.me` as a website, then set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in Netlify under Site configuration > Environment variables. If you self-host Umami instead, also set `NEXT_PUBLIC_UMAMI_SRC` to your script URL.

Netlify Analytics is another option: server-side, nothing to install, no script in the page, but it costs about 9 USD a month per site.

### Writing posts without the admin panel

If you would rather write in your own editor, just add a markdown file to `content/blog/` and push. Frontmatter:

```markdown
---
title: "Detecting Container Escapes with eBPF"
publishedAt: "2026-08-12"
summary: "How Falco turns kernel-level signals into actionable runtime alerts."
lang: "en"
tags: ["kubernetes", "security", "falco"]
draft: false
---

Your content here.
```

Drafts are visible when running `npm run dev`, and hidden in the production build.

## Editing site content

| What | Where |
|---|---|
| English content (bio, jobs, projects...) | `src/data/en.tsx` |
| German content | `src/data/de.tsx` |
| French content | `src/data/fr.tsx` |
| UI strings (nav, headings, buttons) | `src/i18n/ui.ts` |
| Photos, testimonials, resume PDF paths | `src/data/shared.ts` |
| Blog posts | `/admin` in the browser, or `content/blog/*.md` |

Keep the three data files structurally identical when editing - only the text differs.

### Top navigation bar

`src/components/site-header.tsx` is a sticky top bar: avatar and name on the left, page links and controls on the right, hamburger menu under 768px.

It has two visual states. On every page except the homepage it is solid from the start. On the homepage, **if you set a hero image**, the bar renders transparent over the photo and turns solid once you scroll past it.

To add the hero photo (a conference stage shot works well):

1. Put a wide image in `public/` - e.g. `public/hero.jpg`. Aim for roughly 2000x800 and compress it.
2. Set `heroImage: "/hero.jpg"` in `src/data/en.tsx`, `de.tsx` and `fr.tsx`.

Leave `heroImage` out and the homepage just starts with the solid bar - nothing breaks.

The old floating bottom dock still exists at `src/components/navbar.tsx` but is no longer rendered. To go back to it, swap `<SiteHeader .../>` for `<Navbar .../>` in `src/app/[locale]/layout.tsx`. Running both is not recommended - two navigations for five pages is clutter.

### Talk pages and slide decks

Every talk gets its own page at `/en/talks/<slug>`, built from the `talks` array in `src/data/{en,de,fr}.tsx`. The page shows the full abstract, the slide deck inline, links to the deck and recording, and a map of the venue.

**Slides play live on the page.** Instead of embedding the PDF, each page is pre-rendered to a WebP image and shown in a real slide viewer: arrow keys, click-through, fullscreen, slide counter, and a progress bar. Only the slide being viewed is fetched.

To add a deck, run the converter and paste the two values it prints:

```bash
python3 scripts/convert-slides.py ~/Downloads/my-deck.pdf my-talk-slug
```

```ts
slidesDir:  "/talks/slides/my-talk-slug",
slideCount: 56,
slidesUrl:  "/talks/slides/my-talk-slug.pdf",
```

The ContainerDays deck is already wired up this way: 18 MB as a PDF, 2.7 MB as images, about 50 KB to open the page. See `public/talks/slides/README.md` for the reasoning and requirements.

### Talk fields

Each entry in the `talks` array of `src/data/{en,de,fr}.tsx` accepts three optional fields:

| Field | What it does |
|---|---|
| `slidesUrl` | Link to the deck. Either a self-hosted file (`/talks/slides/deck.pdf`) or an external URL. |
| `slidesEmbed` | Embed `src` URL - renders the deck inline in a 16:9 player. |
| `videoUrl` | Link to the talk recording. |

| `slug` | URL segment for the talk's page. Required. |
| `abstract` | Long-form description shown on the talk page. Falls back to `description`. |
| `venue` | `{ name, description, address }`. The address drives the embedded map. |

**Speaker Deck instead:** set `slidesUrl` to the page URL and `slidesEmbed` to the player URL. External links cannot render in the PDF viewer, so `slidesEmbed` is what gives you the inline deck in that case.

### Adding a language later

1. Add the code (e.g. `"it"`) to `locales` **and** `languageOptions` in `src/i18n/config.ts`.
2. Create `src/data/it.tsx` (copy `en.tsx`, translate) and register it in `src/data/index.ts`.
3. Add an `it` block in `src/i18n/ui.ts`.

## TODO (things only you can fill in)

- [ ] `public/admin/config.yml` - set your real `repo:` and do the OAuth setup above.

- [ ] Add your ContainerDays slide deck to `public/talks/slides/` and set `slidesUrl` on that talk.
- [ ] Turn on analytics: set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in Netlify.
- [ ] Add the official Cloud Identity Summit event URL in `src/data/{en,de,fr}.tsx` -> `talks`.

## Docker / Kubernetes

The `Dockerfile` and `kubernetes-manifest/` folder are an independent deployment path (not used by Netlify) - kept as a demonstration of containerized deployment.
