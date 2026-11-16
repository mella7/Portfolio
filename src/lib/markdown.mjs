// A small, safe Markdown renderer for the blog. No dependencies.
//
// Supported: front matter, headings (#..####), paragraphs, **bold**, *italic*,
// `code`, [links](url), ![images](url), fenced code blocks, ordered and
// unordered lists, > blockquotes and --- rules. Raw HTML in a post is escaped,
// never passed through, and link targets are limited to http(s), mailto and
// site paths. If a post needs more than this, swap in a full parser here.

import { escapeHtml, safeUrl, isExternal } from "./html.mjs";

/** Split "---\nkey: value\n---\nbody" into { data, body }. */
export function parseFrontMatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) return { data: {}, body: source };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!pair) continue;
    let value = pair[2].trim();
    if (/^\[.*\]$/.test(value)) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }
    data[pair[1]] = value;
  }
  return { data, body: match[2] };
}

function inline(text) {
  // Pull code spans out first so nothing inside them is formatted.
  const codes = [];
  let out = text.replace(/`([^`]+)`/g, (_, code) => {
    codes.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  out = escapeHtml(out);
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) => {
    return `<img src="${escapeHtml(safeUrl(unescape(url)))}" alt="${alt}" loading="lazy" decoding="async">`;
  });
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    const href = safeUrl(unescape(url));
    const ext = isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${escapeHtml(href)}"${ext}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
}

// inline() escapes first, so URLs captured from the escaped text are turned
// back before they are validated and escaped again.
const unescape = (value) =>
  value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

export function renderMarkdown(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  const isBlockStart = (line) =>
    /^(#{1,4}\s|```|>\s?|[-*]\s|\d+\.\s|---+\s*$)/.test(line);

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = /^```([\w-]*)\s*$/.exec(line);
    if (fence) {
      const code = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) code.push(lines[i++]);
      i++;
      const lang = fence[1] ? ` data-lang="${escapeHtml(fence[1])}"` : "";
      out.push(`<pre${lang}><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length + 1; // the post title is the page's h1
      out.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`);
      continue;
    }

    const bullet = /^[-*]\s+/;
    const numbered = /^\d+\.\s+/;
    if (bullet.test(line) || numbered.test(line)) {
      const marker = bullet.test(line) ? bullet : numbered;
      const tag = marker === bullet ? "ul" : "ol";
      const items = [];
      while (i < lines.length && (marker.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        if (marker.test(lines[i])) items.push(lines[i].replace(marker, ""));
        else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      out.push(`<${tag}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`);
      continue;
    }

    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) paragraph.push(lines[i++].trim());
    // A line that looks like a block but matched no rule above is plain text.
    if (!paragraph.length) paragraph.push(lines[i++].trim());
    out.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return out.join("\n");
}

export const readingMinutes = (text) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
