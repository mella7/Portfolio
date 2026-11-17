# mella7.me

The personal portfolio of Mohamed Ali Mellah: a bento-grid homepage, an
interactive terminal, talks with a slide viewer, projects, certifications,
photos and a blog.

The site itself has **zero dependencies**. A small Node script turns the data
in `src/data/` into plain HTML, CSS and JavaScript. There is no framework and
no bundler. The visitor statistics run next to it: on Netlify as four small
functions (`netlify/`), or anywhere else as one Node server (`server/`). The
Netlify functions use one package, `@netlify/blobs`, to store the data;
Netlify installs it during the build.

## Quick start

You need Node 20 or newer.

```bash
npm run dev      # build, serve http://localhost:4321, rebuild on change
npm run build    # build into dist/
npm run check    # build, then check links, assets and the CSP rules
npm start        # build, then run the site with visitor statistics on :8080
```

## What is on the site

Every page exists in English (`/`), French (`/fr/`) and German (`/de/`). The
bar at the top links all pages and switches the language; see "Languages"
below.

| Page | Path | Notes |
| --- | --- | --- |
| Home | `/` | Opening animation, bento grid, photo strip, terminal, pinned highlights, horizontal projects, experience, skills, kind words, contact form |
| Projects | `/projects/` | Every project with its cover diagram and links |
| Talks | `/talks/`, `/talks/<slug>/` | Slide viewer (arrow keys, swipe, fullscreen) and PDF download |
| Certifications | `/certifications/` | |
| Moments | `/moments/` | Photo gallery with a lightbox |
| Blog | `/blog/`, `/blog/<id>/` | Markdown posts, RSS at `/rss.xml` |
| Travel | `/travel/` | A dithered globe you can drag, with visited countries lit |
| QR landing | `/qr`, `/qr/<name>` | Counts the scan, then always goes to the homepage |
| Privacy | `/privacy/` | What the statistics record |
| Statistics | `/stats` | Dashboard, unlocked with the `STATS_TOKEN` passkey |

## Project layout

```
scripts/
  build.mjs      builds the site into dist/
  dev.mjs        local preview server with rebuild on change
  check.mjs      checks links, assets and the CSP rules in dist/
  images.py      builds responsive photos and slides (optional, needs Pillow)
  walker.py      builds the walking-avatar sprite sheets (optional, needs Pillow)
netlify/
  functions/     hit.mjs (/api/hit), qr.mjs (/qr), stats-api.mjs (/api/stats),
                 report.mjs (runs hourly: Telegram summary, tidying up)
  lib/           stats-store.mjs: the statistics kept in Netlify Blobs
server/
  core.mjs       what a hit is and how input is cleaned (shared with netlify/)
  server.mjs     serves dist/, collects statistics, counts QR scans
  stats.mjs      turns stored hits into the dashboard numbers
  notify.mjs     Telegram summaries and new-visitor messages
  env.mjs        reads settings from .env
  dashboard/     the /stats page
src/
  data/          site.mjs (settings) and content.mjs (everything the site says)
  i18n/          the languages: interface text (ui.mjs) and the French and
                 German content (content.fr.mjs, content.de.mjs)
  content/blog/  blog posts in Markdown (<id>.md, <id>.fr.md, <id>.de.md)
  views/         page templates: layout, home, the other pages, cover diagrams
  lib/           html escaping, Markdown renderer, card-frame generator
  styles/        CSS, concatenated in the order listed in build.mjs
  client/        browser scripts, one ES module per feature
public/          copied to dist/ as is: photos, slides, fonts, resume files
media/           original photos, the input of scripts/images.py (not served)
```

## Editing the content

Almost everything is in two files:

- `src/data/site.mjs`: name, links, e-mail, resume files, the "Now" card,
  accent colours, visited countries.
- `src/data/content.mjs`: intro text, highlights, projects, talks,
  experience, education, skills, certifications, photos, testimonials.

When you change a text there, change it in the French and German files too
(next section). Anything you leave out of a translation shows in English.

### Languages

| What | English | French and German |
| --- | --- | --- |
| About me: intro, projects, talks, jobs... | `src/data/content.mjs` | `src/i18n/content.fr.mjs`, `content.de.mjs` |
| Buttons, headings, page texts, privacy page | `src/i18n/ui.mjs` (`en`) | same file (`fr`, `de`) |
| Blog posts | `src/content/blog/<id>.md` | `<id>.fr.md`, `<id>.de.md` |

- The translation files only hold the text that changes. Lists are matched by
  position (experience, education...) or by slug, file or short name
  (projects, talks, photos), so a new project needs an entry in all three
  files only for its description.
- A blog post without a `.fr.md` / `.de.md` shows the English text on the
  French and German pages, with a short "written in English" note.
- Talk titles, testimonials and the terminal stay in English on purpose.
- The resume button in the top bar offers the resume in the page's language.
- `src/i18n/index.mjs` lists the languages. To add one, add it to `LANGS`,
  add its block to `ui.mjs` and a `content.<code>.mjs`.

### Resume files

Replace the PDFs in `public/resume/`. The file names are set in `SITE.resume`.

### A new project

Add an entry to `projects` in `content.mjs`. For the cover, either draw a
diagram in `src/views/covers.mjs` and use `cover: { art: "<name>" }`, or add
a screenshot to `media/projects/`, run `python3 scripts/images.py projects`
and use `cover: { image: "projects/<name>" }`.

### A new talk

1. Put the PDF at `public/talks/slides/<slug>.pdf`.
2. Run `python3 scripts/images.py slides`. It renders every slide as AVIF and
   WebP into `public/talks/slides/<slug>/`. Note how many slides it wrote.
3. Add the talk to `talks` in `content.mjs` and its abstract to
   `src/data/talk-abstracts.json`.

### A new photo

Put the original in `media/moments/`, run `python3 scripts/images.py moments`,
then add it to `moments` in `content.mjs`. The script strips EXIF and GPS data.

### A new blog post

Add a Markdown file to `src/content/blog/`:

```markdown
---
title: "Post title"
pubDate: 2026-12-01
description: "One sentence for the list and for search engines."
---

Text of the post.
```

The built-in renderer supports headings, paragraphs, bold, italic, inline
code, links, images, fenced code blocks, lists, quotes and rules. Raw HTML is
escaped on purpose.

For the French and German versions, add `<id>.fr.md` and `<id>.de.md` with
their own `title`, `description` and text; the date, link and categories come
from the English file.

### The terminal

Commands live in `src/client/terminal.js` in the `COMMANDS` object. The data
they print is generated by `scripts/build.mjs` (`termData`), so it follows
`content.mjs` automatically.

## Appearance

- **Light and dark**: the sun/moon button in the bottom-right corner, or
  `mode light` in the terminal. Dark is the default; the choice is remembered.
  Colours for both modes are tokens at the top of `src/styles/base.css`
  (`MODES` in `site.mjs` feeds the card frames).
- **Accent colour**: every visit opens on a random colour and moves to the
  next one every 45 seconds (`theme.cycleSeconds` in `site.mjs`; `0` stops
  it). Picking a colour in the Theme card, or `theme blue` in the terminal,
  pins it. The rainbow swatch, or `theme auto`, starts the rotation again.

## Walking avatar

A small character walks along the bottom of the window. Now and then it
waves, jumps, does a backflip, breakdances, moonwalks or sits down to
meditate. Click it for a trick, or type `avatar backflip` in the terminal.
The walk button in the bottom-right corner hides it.

The sprite sheets are `public/avatar-walk-<theme>.webp`, built by
`python3 scripts/walker.py` from `media/avatar/walk-atlas.webp`. That source
render comes from the astro-bento-portfolio template, so the walker's hair
and glasses are the template character's, recoloured to match the seated
avatar. To make it you: render the same five clips (walk, idle, sit, wave,
sit-down) from your own model in the same grid, replace the file and run the
script again. Frame layout: `SITE.companion` in `site.mjs`.

## Visitor statistics

The site sends anonymous page views and events to `/api/hit`. Two things can
answer there, and they record exactly the same data:

- **On Netlify** (how mella7.me runs): the functions in `netlify/functions/`.
  The data lives in Netlify Blobs (store `stats`), nothing to set up.
- **Anywhere else**: `server/server.mjs`, which also serves the site and keeps
  its data in plain files.

### On Netlify

Set these in Netlify under Project configuration > Environment variables, then
trigger a new deploy (functions only see variables from the deploy onwards):

| Variable | Meaning |
| --- | --- |
| `STATS_TOKEN` | The passkey for `/stats`. `npm run passkey` makes a strong one. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Telegram messages (see below) |

Build settings stay as they are: build command `npm run build`, publish
directory `dist`, functions directory `netlify/functions`.

### Locally or in a container

```bash
cp .env.example .env     # then fill it in; .env is never committed
npm run passkey          # prints a strong random passkey for STATS_TOKEN
npm start
# site       http://localhost:8080
# dashboard  http://localhost:8080/stats   (asks for the passkey)
```

### Opening the dashboard

- Go to `https://mella7.me/stats` and enter the passkey (the value of
  `STATS_TOKEN`), or
- open the terminal on the site (Ctrl+K), type the hidden word (`iamroot`
  by default, `statsCommand` in `site.mjs`) and then the passkey. It is typed
  masked, checked by the server and never printed or kept in the history.

The hidden word is only a shortcut, not protection: it ships inside the page.
The passkey is the protection. It exists only on the server as `STATS_TOKEN`.

After changing `STATS_TOKEN` (or any variable) in Netlify, trigger a new
deploy: functions only see the values from the deploy they belong to.

### Telegram updates

You get two kinds of messages:

- **A new visitor**: the first page view of each visitor on a given day,
  with the page, where they came from (including which QR code), country,
  device, language and time. `NOTIFY_NEW_VISITORS=0` turns these off.
- **A summary every 15 days** (`REPORT_EVERY_DAYS`). The first one is a short
  "statistics are connected" message, sent within the hour after the first
  deploy with Telegram set up; the clock starts then.

Your own visits: open the site once with `?notrack` at the end of the address
(`https://mella7.me/?notrack`) on each browser and phone you use. That browser
is then never counted or announced. `?track` undoes it.

Setting up the bot:

1. Create a bot with @BotFather and put its token in `.env` as
   `TELEGRAM_BOT_TOKEN`.
2. Open the bot in Telegram and send it `/start`.
3. `npm run telegram` prints your chat id. Put it in `.env` as
   `TELEGRAM_CHAT_ID`.
4. `npm run telegram` again sends a test message. Copy both values into
   Netlify (or restart the server).

**When no messages arrive**, open `/stats`. The Telegram panel at the top
shows what is wrong in plain words: a variable that is missing or malformed,
or Telegram's own answer to the last message (for example "chat not found"
or "bot can't initiate conversation"), with what to do about it. "Send a test
message" tries again right away. The same lines appear in the Netlify
function log (Logs > Functions > hit or report) as `telegram: not delivered`.
The usual causes:

- you never pressed Start in the chat with the bot,
- `TELEGRAM_CHAT_ID` is the bot's id (the number before the colon in the
  token) instead of your own chat id,
- the variables were changed in Netlify without a new deploy.

**What you get**: visitors per day, page views, where visitors came from
(referring site and `?utm_source=` / `?ref=` tags), country, device, browser,
operating system, language, time zone, screen width, time on page, which
homepage sections were reached, resume downloads, links clicked to other
sites, terminal commands used, contact messages and QR scans.

**IP addresses** are stored with each visit and shown in the dashboard (a
table of addresses and a column in the latest visits) and in the new-visitor
messages. They are removed from the stored visits after 30 days
(`STATS_IP_DAYS`). An IP address is personal data under the GDPR, so the
privacy page says this, names the legal basis and offers deletion; keep it
accurate if you change what is collected. There are no cookies. A visitor is
counted once per day through a hash of IP + browser + a random salt that is
thrown away every day. Visitors who send "Do Not Track" or Global Privacy
Control are not recorded, and known bots are skipped.

**Country** is only available when something in front of the server adds it:
Cloudflare (`CF-IPCountry`), Vercel or Netlify headers are read automatically.

| Variable | Meaning | Default |
| --- | --- | --- |
| `STATS_TOKEN` | Password for `/stats`. Unset means the dashboard is off. | unset |
| `PORT`, `HOST` | Where to listen | `8080`, `0.0.0.0` |
| `DATA_DIR` | Folder for `hits-YYYY-MM.jsonl` | `server/data` |
| `TRUST_PROXY` | Set to `1` behind a reverse proxy or CDN | off |
| `ALLOWED_ORIGINS` | Other origins allowed to send hits, comma-separated | same host only |
| `QR_TARGET` | Where `/qr` redirects | `/` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Telegram updates | off |
| `REPORT_EVERY_DAYS` | Days between summaries | `15` |
| `NOTIFY_NEW_VISITORS` | `0` stops the per-visitor messages | on |
| `NOTIFY_TIMEZONE` | Time zone for the times in messages | `Europe/Berlin` |
| `STATS_IP_DAYS` | Days IP addresses are kept | `30` |
| `STATS_KEEP_DAYS` | Netlify only: days of hits to keep | `400` |

### QR codes

Point a QR code at `https://mella7.me/qr`. Every scan is counted and the
visitor lands on the homepage (as `/?ref=qr-<name>`, so the new-visitor
message says which code they scanned). Use a name to tell codes apart:
`https://mella7.me/qr/business-card`, `https://mella7.me/qr/poster-hamburg`.
The dashboard lists scans per name.

### On a host without functions

Cloudflare Pages or GitHub Pages cannot run either version. Run the server
somewhere else (a small container is enough), then:

1. In `src/data/site.mjs` set `analytics.endpoint` to its full address, for
   example `https://stats.mella7.me/api/hit`. The build adds that origin to
   the Content-Security-Policy.
2. Start the server with `ALLOWED_ORIGINS=https://mella7.me`.

`/qr` then works as a static page that reports the scan and redirects. Set
`analytics.endpoint` to `""` to switch statistics off completely.

## Deploying

The site is the `dist/` folder. Any static host works.

- **Container (site and statistics together)**: `docker build -t portfolio .`
  then run it with `STATS_TOKEN` set and a volume on `/data`; see the
  comments in the `Dockerfile`. Put a TLS proxy in front and set
  `TRUST_PROXY=1`.
- **Netlify** (site and statistics): build command `npm run build`, publish
  directory `dist`, functions directory `netlify/functions`, and the variables
  from "On Netlify" above. The contact form uses Netlify Forms
  (`public/__forms.html` registers it); turn on form detection in the Netlify
  dashboard.
- **Cloudflare Pages**: build command `node scripts/build.mjs`, output `dist`.
  `dist/_headers` is read automatically. Point `contactFormAction` in
  `site.mjs` at your own form endpoint on the same origin.
- **GitHub Pages**: for a project page served from a sub-path, build with
  `BASE_PATH=/<repo> node scripts/build.mjs`. GitHub Pages cannot set response
  headers, so only the `<meta>` Content-Security-Policy applies there, and the
  contact form needs an endpoint of its own.

## Security

See [SECURITY.md](SECURITY.md). In short: no dependencies, no third-party
requests, a strict Content-Security-Policy with no inline scripts or styles,
escaping by default, a check script that keeps it that way, and a statistics
server that validates everything it receives.

## Accessibility and motion

All motion is switched off for visitors who ask their system to reduce
motion: the opening animation, scroll effects, marquees and the wandering
avatar. The site also works without JavaScript; the terminal, lightbox and
scroll scenes fall back to plain content.

## Licence and credits

Code: [MIT](LICENSE). Photos, slides, resume files, the avatar and the text
are not covered by that licence; replace them if you fork the project.

The card frames, the bento layout and the walking-avatar source render are
adapted from the astro-bento-portfolio template by Gianmarco Cavallo (MIT). See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
