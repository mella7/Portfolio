// Visitor statistics, client side. Sends small, anonymous messages to the
// endpoint in SITE.analytics.endpoint (server/server.mjs). No cookies, no
// storage, no fingerprinting: the server derives a visitor id that changes
// every day and never stores the IP address.
//
// Nothing is sent when the visitor has "Do Not Track" or Global Privacy
// Control switched on, or when no endpoint is configured.
//
// Other scripts report events without importing this file:
//   document.dispatchEvent(new CustomEvent("track", { detail: { name, data } }))

import { $$, root } from "./util.js";

const endpoint = root.dataset.analytics || "";
const optedOut = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
const enabled = Boolean(endpoint) && !optedOut;

// Ties the events of one page load together. Not stored anywhere.
const viewId = Math.random().toString(36).slice(2, 12);
const path = location.pathname.replace(/index\.html$/, "");

function post(payload) {
  if (!enabled) return;
  const body = JSON.stringify({ ...payload, p: path, v: viewId });
  try {
    // text/plain keeps this a "simple" request, so it also works cross-origin.
    if (navigator.sendBeacon?.(endpoint, new Blob([body], { type: "text/plain" }))) return;
    fetch(endpoint, { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
  } catch {
    /* statistics must never break the page */
  }
}

export function track(name, data = {}) {
  post({ t: "event", n: name, d: data });
}

function referrerHost() {
  try {
    const url = new URL(document.referrer);
    return url.host === location.host ? "" : url.host;
  } catch {
    return "";
  }
}

function screenBucket() {
  const width = window.innerWidth;
  return width < 480 ? "<480" : width < 768 ? "480-767" : width < 1024 ? "768-1023" : width < 1440 ? "1024-1439" : "1440+";
}

export function initAnalytics() {
  if (!enabled) return;

  const params = new URLSearchParams(location.search);
  let timeZone = "";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    timeZone = "";
  }
  post({
    t: "view",
    r: referrerHost(),
    s: params.get("utm_source") || params.get("ref") || params.get("src") || "",
    z: timeZone,
    w: screenBucket(),
  });

  document.addEventListener("track", (event) => {
    const { name, data } = event.detail || {};
    if (typeof name === "string") track(name, data);
  });

  // Downloads and links to other sites.
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    if (link.hasAttribute("download")) {
      track("download", { file: link.getAttribute("href").split("/").pop() });
    } else if (link.host && link.host !== location.host && /^https?:$/.test(link.protocol)) {
      track("outbound", { url: link.host + link.pathname.replace(/\/$/, "") });
    }
  });

  // Which homepage sections were actually reached.
  if ("IntersectionObserver" in window) {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          track("section", { id: entry.target.id });
          seen.unobserve(entry.target);
        }
      },
      { threshold: 0.25 },
    );
    for (const section of $$("[data-section]")) seen.observe(section);
  }

  // Time on the page and how far down it was read, sent when the tab is left.
  const started = performance.now();
  let deepest = 0;
  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) deepest = Math.max(deepest, Math.round((window.scrollY / max) * 100));
    },
    { passive: true },
  );
  let left = false;
  const leave = () => {
    if (left) return;
    left = true;
    track("leave", { seconds: Math.round((performance.now() - started) / 1000), depth: deepest });
  };
  window.addEventListener("pagehide", leave);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && leave());
}
