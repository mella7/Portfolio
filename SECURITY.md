# Security

## Reporting a problem

If you find a security issue in this site or its code, please e-mail
**med.ali@mella7.me** instead of opening a public issue. I will reply as soon
as I can and credit you if you would like.

## How the site is built to stay safe

- **No dependencies in the site.** The build and the site use Node's standard
  library only. The only package is `@netlify/blobs` (Netlify's own), used by
  the Netlify functions to store statistics; it never reaches the browser.
- **No third-party requests.** Fonts, scripts and images are served from the
  site itself. There are no cookies, no CDNs and no third-party analytics;
  statistics are collected by the project's own server (see below).
- **Strict Content-Security-Policy.** `default-src 'self'`, no inline scripts,
  no inline styles, no `eval`. The policy ships both as a `<meta>` tag and in
  `dist/_headers`. `npm run check` fails the build if a page gains an inline
  script, an inline event handler or a `style` attribute.
- **Escaping by default.** Pages are rendered with the `html` tagged template
  in `src/lib/html.mjs`, which escapes every interpolated value. Raw markup
  must be opted into with `raw()`.
- **The terminal prints text only.** Visitor input is written with text
  nodes and is never parsed as HTML.
- **Blog posts are escaped too.** The Markdown renderer does not pass raw
  HTML through and only allows `http(s)`, `mailto` and site-relative links.
- **Links to other sites** open with `rel="noopener noreferrer"`.
- **The contact form** posts to the same origin, has a honeypot field and
  length limits, and stores nothing in the browser.
- **Response headers** (`dist/_headers`): CSP with `frame-ancestors 'none'`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS.

## The statistics (`server/server.mjs` and `netlify/functions/`)

Both versions share `server/core.mjs` and follow the same rules:

- **IP addresses are kept for a limited time.** Each visit stores the IP
  address for 30 days (`STATS_IP_DAYS`); after that it is removed from the
  stored visits, on Netlify by the hourly `report` function and on the Node
  server by an hourly clean-up. The daily visitor id is a hash with a salt
  that is replaced every day; on Netlify old salts are deleted after two days.
  No cookies. `/privacy/` tells visitors all of this.
- **Telegram messages** carry the same details as the dashboard, including
  the IP address. The bot token is never logged; Telegram's error text is.
- **Input is untrusted.** Request bodies are capped at 4 KB, every field is
  type-checked, length-limited and stripped of control characters, and only
  simple keys are accepted.
- **The dashboard is locked.** `/api/stats` needs `STATS_TOKEN` as a Bearer
  token, compared in constant time, with a limit on failed attempts. Without
  a token the dashboard is disabled. The dashboard writes all values with
  `textContent`, because they come from visitors' browsers.
- **Secrets stay out of the code.** The passkey and the Telegram bot token
  are read from the environment or a git-ignored `.env` file, and are never
  logged. If a token is ever pasted somewhere public, revoke it with
  @BotFather and create a new one.
- **The hidden terminal command is a shortcut, not a lock.** The word ships
  in the page; access still requires the passkey, which the server checks.
- **Cross-origin posts** are refused unless the origin is the same host or
  listed in `ALLOWED_ORIGINS`.
- **Rate limits** per visitor, request timeouts, and file access confined to
  the site folder.
- **Data files** are created with owner-only permissions. Keep `DATA_DIR`
  out of the repository (`.gitignore` covers the defaults) and use a long
  random `STATS_TOKEN` over HTTPS only.

## Before you publish a fork

- Do not commit `.env` files, tokens or keys (`.gitignore` already excludes them).
- Check `public/` for anything personal you do not want public, including
  EXIF data in photos. `scripts/images.py` strips metadata from the images it builds.
