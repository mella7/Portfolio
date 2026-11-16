// Accent colour and light/dark mode. The colours live in CSS under
// [data-theme] and [data-mode]; this switches the attributes, remembers the
// visitor's choice, and announces changes so canvases can redraw.
//
// Colour rotation: unless the visitor has picked a colour, the site opens on
// a random one (boot.js) and moves to the next every SITE.theme.cycleSeconds.
// Picking a colour stops the rotation; "auto" starts it again.

import { $, $$, reduceMotion, root, store } from "./util.js";

const themes = (root.dataset.themes || "red").split(" ");
const cycleSeconds = Number(root.dataset.cycle) || 0;
let timer = 0;

export const themeNames = () => themes.slice();
const isAuto = () => !themes.includes(store.get("theme"));

function apply(name) {
  root.dataset.theme = name;
  syncSwatches();
  document.dispatchEvent(new CustomEvent("appearance:change"));
}

function syncSwatches() {
  const auto = isAuto();
  for (const button of $$("[data-theme-set]")) {
    const value = button.dataset.themeSet;
    button.setAttribute("aria-pressed", String(value === "auto" ? auto : !auto && value === root.dataset.theme));
    button.classList.toggle("is-current", value === root.dataset.theme);
  }
}

function startCycle() {
  window.clearInterval(timer);
  if (!cycleSeconds || reduceMotion || !isAuto()) return;
  timer = window.setInterval(() => {
    if (document.hidden) return; // do not change colours nobody is looking at
    apply(themes[(themes.indexOf(root.dataset.theme) + 1) % themes.length]);
  }, cycleSeconds * 1000);
}

/** A colour name pins that colour; "auto" goes back to rotating. */
export function setTheme(name) {
  if (name === "auto") {
    store.remove("theme");
    apply(themes[(themes.indexOf(root.dataset.theme) + 1) % themes.length]);
  } else if (themes.includes(name)) {
    store.set("theme", name);
    apply(name);
  } else {
    return false;
  }
  startCycle();
  document.dispatchEvent(new CustomEvent("track", { detail: { name: "appearance", data: { value: name } } }));
  return true;
}

/** "light" or "dark". Returns false for anything else. */
export function setMode(mode) {
  if (mode !== "light" && mode !== "dark") return false;
  root.dataset.mode = mode;
  store.set("mode", mode);
  document.dispatchEvent(new CustomEvent("appearance:change"));
  document.dispatchEvent(new CustomEvent("track", { detail: { name: "appearance", data: { value: mode } } }));
  return true;
}
export const currentMode = () => (root.dataset.mode === "light" ? "light" : "dark");

export function initTheme() {
  $("#mode-toggle")?.addEventListener("click", () => setMode(currentMode() === "light" ? "dark" : "light"));
  for (const button of $$("[data-theme-set]")) {
    button.addEventListener("click", () => setTheme(button.dataset.themeSet));
  }
  syncSwatches();
  startCycle();
}
