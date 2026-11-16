// Tiny HTML templating with escaping on by default.
//
//   html`<p>${userText}</p>`      -> userText is escaped
//   html`<ul>${items.map(...)}</ul>` -> arrays of html`` results are joined
//   raw(trustedMarkup)            -> opt out, only for markup this repo generates
//
// Every value interpolated into a template is escaped unless it is itself the
// result of html`` or raw(). That makes "forgot to escape" impossible by
// construction, which is the property the pages rely on.

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ESC[c]);

class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** Mark a string as already-safe HTML. Use only for markup generated in this repo. */
export const raw = (value) => new SafeHtml(String(value));

function render(value) {
  if (value == null || value === false || value === true) return "";
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join("");
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

/** JSON for a <script type="application/json"> block: "<" can never close the tag. */
export const jsonForScript = (data) =>
  raw(
    JSON.stringify(data)
      .replace(/</g, "\\u003c")
      .replace(/[\u2028\u2029]/g, (ch) => (ch === "\u2028" ? "\\u2028" : "\\u2029")),
  );

/** Only http(s), mailto and same-site paths are allowed as link targets. */
export function safeUrl(url) {
  const value = String(url ?? "").trim();
  if (/^(https?:\/\/|mailto:|\/|#|\.\/|\.\.\/)/i.test(value)) return value;
  return "#";
}

export const isExternal = (url) => /^https?:\/\//i.test(String(url));
