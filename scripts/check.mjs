#!/usr/bin/env node
// Checks the built site in dist/. Run after a build (npm run check).
//
//   1. Every local link, image, script and stylesheet points at a file that exists.
//   2. No page contains an inline <script>, an inline event handler or a
//      style attribute, so the strict Content-Security-Policy keeps holding.
//   3. Every link that opens a new tab has rel="noopener".

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const BASE = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");
const problems = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

function exists(urlPath) {
  let path = urlPath.split("#")[0].split("?")[0];
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length);
  if (!path) return true;
  const file = join(DIST, decodeURIComponent(path));
  return existsSync(file) && (statSync(file).isFile() || existsSync(join(file, "index.html")));
}

const pages = walk(DIST).filter((file) => file.endsWith(".html"));

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const name = file.slice(DIST.length);

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|#|data:)/.test(url)) continue;
    if (!exists(url)) problems.push(`${name}: missing ${url}`);
  }
  for (const match of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const part of match[1].split(",")) {
      const url = part.trim().split(/\s+/)[0];
      if (url && !exists(url)) problems.push(`${name}: missing ${url}`);
    }
  }

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const isData = /type="application\/(ld\+)?json"/.test(match[1]);
    if (!isData && match[2].trim()) problems.push(`${name}: inline <script>`);
  }
  if (/<[^>]+\son[a-z]+\s*=/i.test(html)) problems.push(`${name}: inline event handler`);
  if (/<[^>]+\sstyle\s*=/i.test(html)) problems.push(`${name}: style attribute (blocked by the CSP)`);
  if (/<style\b/i.test(html)) problems.push(`${name}: inline <style>`);

  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(match[0])) problems.push(`${name}: target="_blank" without rel="noopener"`);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n` + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`Checked ${pages.length} pages: links, assets and CSP rules are all fine.`);
