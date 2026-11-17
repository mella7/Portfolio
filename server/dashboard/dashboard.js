// Dashboard for the visitor statistics.
//
// The token is sent as a Bearer header to /api/stats and kept in
// sessionStorage, so it is gone when the tab closes. Everything shown comes
// from visitors' browsers, so it is written with textContent only.

const $ = (id) => document.getElementById(id);
const login = $("login");
const report = $("report");
const controls = $("controls");
const status = $("status");
const KEY = "stats-token";

const TABLES = [
  ["pages", "Pages"],
  ["siteLanguages", "Site language read"],
  ["referrers", "Where visitors came from"],
  ["sources", "Campaign or source tag"],
  ["countries", "Countries"],
  ["ips", "IP addresses (page views)"],
  ["devices", "Devices"],
  ["browsers", "Browsers"],
  ["systems", "Operating systems"],
  ["languages", "Languages"],
  ["timezones", "Time zones"],
  ["screens", "Screen widths"],
  ["sections", "Homepage sections reached"],
  ["downloads", "Downloads"],
  ["outbound", "Links clicked to other sites"],
  ["terminal", "Terminal commands"],
  ["qrCodes", "QR codes scanned"],
  ["appearance", "Theme and mode changes"],
  ["events", "All events"],
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// "https://medium.com/@me/post" reads better as "medium.com/@me/post".
const shortUrl = (value) => String(value).replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function ago(iso) {
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (!Number.isFinite(minutes)) return "";
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 48 * 60) return `${Math.round(minutes / 60)} h ago`;
  return `${Math.round(minutes / 1440)} days ago`;
}

function renderTelegram(tg) {
  const state = $("tg-state");
  const detail = $("tg-detail");
  if (!tg) {
    state.textContent = "No status from the server.";
    state.className = "tg__state";
    detail.textContent = "";
    return;
  }
  const plan = `Summary every ${tg.everyDays} days${tg.newVisitors ? ", plus a message for each new visitor" : ""}.`;
  if (tg.problem) {
    state.textContent = "Not set up correctly";
    state.className = "tg__state is-bad";
    detail.textContent = tg.problem;
  } else if (tg.last && !tg.last.ok) {
    state.textContent = `Last message was not delivered (${ago(tg.last.at)})`;
    state.className = "tg__state is-bad";
    detail.textContent = `Telegram said: ${tg.last.description}. ${tg.last.hint || ""}`;
  } else if (tg.last) {
    state.textContent = `Working. Last message delivered ${ago(tg.last.at)}.`;
    state.className = "tg__state is-ok";
    detail.textContent = plan;
  } else {
    state.textContent = "Set up, nothing sent yet";
    state.className = "tg__state";
    detail.textContent = `${plan} Use the button to check the connection now.`;
  }
}

const duration = (seconds) => (seconds >= 60 ? `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s` : `${Math.round(seconds)}s`);

function render(data) {
  const t = data.totals;
  const tiles = [
    [t.visitors, "Visitors (daily unique)"],
    [t.views, "Page views"],
    [t.qrScans, "QR scans"],
    [t.resumeDownloads, "Resume downloads"],
    [t.messages, "Contact messages"],
    [t.medianSeconds ? duration(t.medianSeconds) : "-", "Median time on a page"],
  ];
  $("tiles").replaceChildren(
    ...tiles.map(([value, label]) => {
      const tile = el("div", "tile");
      tile.append(el("b", "", String(value)), el("span", "", label));
      return tile;
    }),
  );

  const peak = Math.max(1, ...data.perDay.map((d) => d.views + d.qr));
  $("chart").replaceChildren(
    ...data.perDay.map((d) => {
      const bar = el("div", "bar");
      bar.title = `${d.day}: ${d.views} views, ${d.visitors} visitors, ${d.qr} QR scans`;
      const qr = el("i", "qr");
      qr.style.height = `${(d.qr / peak) * 100}%`;
      const views = el("i");
      views.style.height = `${(d.views / peak) * 100}%`;
      bar.append(qr, views);
      return bar;
    }),
  );

  $("tables").replaceChildren(
    ...TABLES.map(([key, title]) => {
      const panel = el("div", "panel");
      panel.append(el("h2", "", title));
      const rows = data.tables[key] || [];
      if (!rows.length) {
        panel.append(el("p", "empty", "Nothing yet."));
        return panel;
      }
      const max = rows[0].count;
      const list = el("ul", "rows");
      for (const row of rows) {
        const item = el("li");
        const fill = el("i");
        fill.style.width = `${(row.count / max) * 100}%`;
        const label = key === "outbound" ? shortUrl(row.label) : String(row.label);
        item.append(fill, el("span", key === "ips" ? "mono" : "", label), el("b", "", String(row.count)));
        item.title = `${row.label}: ${row.count}`;
        list.append(item);
      }
      panel.append(list);
      return panel;
    }),
  );

  const body = $("recent").tBodies[0];
  body.replaceChildren(
    ...data.recent.map((r) => {
      const row = el("tr");
      const when = new Date(r.ts);
      for (const value of [
        when.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }),
        r.path,
        r.ip || "-",
        r.country || "-",
        `${r.device} · ${r.os}`,
        r.browser,
        r.lang || "-",
        r.src || r.ref || "direct",
      ]) {
        const cell = el("td", "", value);
        cell.title = value;
        row.append(cell);
      }
      return row;
    }),
  );
}

async function load(token) {
  status.textContent = "Loading...";
  let response;
  try {
    response = await fetch(`/api/stats?days=${encodeURIComponent($("days").value)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    status.textContent = "Could not reach the server.";
    return false;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    status.textContent = data.error || `Error ${response.status}`;
    return false;
  }
  status.textContent = "";
  render(data);
  renderTelegram(data.telegram);
  login.hidden = true;
  report.hidden = false;
  controls.hidden = false;
  return true;
}

function saved() {
  try {
    return sessionStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

login.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = $("token").value.trim();
  if (await load(token)) {
    try {
      sessionStorage.setItem(KEY, token);
    } catch {
      /* the token just will not be remembered */
    }
    $("token").value = "";
  }
});
$("refresh").addEventListener("click", () => load(saved()));
$("tg-test").addEventListener("click", async () => {
  const out = $("tg-result");
  const button = $("tg-test");
  button.disabled = true;
  out.className = "tg__result";
  out.textContent = "Sending...";
  try {
    const response = await fetch("/api/stats", {
      method: "POST",
      headers: { Authorization: `Bearer ${saved()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "telegram-test" }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Error ${response.status}`);
    out.className = `tg__result ${result.ok ? "is-ok" : "is-bad"}`;
    out.textContent = result.ok
      ? "Delivered. Check Telegram."
      : `Not delivered: ${result.description}. ${result.hint || ""}`;
  } catch (error) {
    out.className = "tg__result is-bad";
    out.textContent = error.message;
  } finally {
    button.disabled = false;
    load(saved());
  }
});
$("days").addEventListener("change", () => load(saved()));
$("logout").addEventListener("click", () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to remove */
  }
  report.hidden = true;
  controls.hidden = true;
  login.hidden = false;
});

if (saved()) load(saved());
