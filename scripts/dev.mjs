#!/usr/bin/env node
// Local preview: builds the site, serves dist/ on http://localhost:4321 and
// rebuilds when anything in src/ or public/ changes. No dependencies.
//
//   node scripts/dev.mjs            build, serve, watch
//   node scripts/dev.mjs --no-watch build once and serve
//   PORT=8080 node scripts/dev.mjs

import { spawnSync } from "node:child_process";
import { createReadStream, existsSync, statSync, watch } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = Number(process.env.PORT) || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

function build() {
  const result = spawnSync(process.execPath, [join(ROOT, "scripts", "build.mjs")], { stdio: "inherit" });
  return result.status === 0;
}

function resolveFile(urlPath) {
  // Resolve inside dist/ only: reject anything that climbs out of it.
  const safe = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  let file = join(DIST, safe);
  if (file !== DIST && !file.startsWith(DIST + sep)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  return existsSync(file) ? file : null;
}

if (!build()) process.exit(1);

createServer((request, response) => {
  let file = null;
  try {
    file = resolveFile(request.url ?? "/");
  } catch {
    file = null;
  }
  // The form endpoint only exists on the real host; answer it locally so the
  // form can be tried out.
  if (request.method === "POST") {
    response.writeHead(200, { "Content-Type": "text/plain" }).end("ok (dev server: nothing was sent)");
    return;
  }
  const status = file ? 200 : 404;
  const target = file ?? join(DIST, "404.html");
  response.writeHead(status, {
    "Content-Type": TYPES[extname(target)] ?? "application/octet-stream",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(target).pipe(response);
}).listen(PORT, "127.0.0.1", () => console.log(`Serving http://localhost:${PORT}`));

if (!process.argv.includes("--no-watch")) {
  let timer = null;
  for (const dir of ["src", "public"]) {
    watch(join(ROOT, dir), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(build, 150);
    });
  }
}
