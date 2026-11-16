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
  ["referrers", "Where visitors came from"],
  ["sources", "Campaign or source tag"],
  ["countries", "Countries"],
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
        item.append(fill, el("span", "", String(row.label)), el("b", "", String(row.count)));
        item.title = String(row.label);
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
        r.country || "-",
        `${r.device} · ${r.os}`,
        r.browser,
        r.src || r.ref || "direct",
      ]) {
        row.append(el("td", "", value));
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
  const token = $("token").value;
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
