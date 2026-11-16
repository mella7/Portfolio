// Shared helpers for the client scripts.

export const root = document.documentElement;
export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = window.matchMedia("(pointer: fine)").matches;
export const base = root.dataset.base || "";

export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Run `fn` at most once per animation frame while the page scrolls or resizes. */
export function onScrollFrame(fn) {
  let queued = false;
  const run = () => {
    queued = false;
    fn();
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  window.addEventListener("load", queue);
  queue();
}

/** localStorage that never throws (private mode, blocked storage). */
export const store = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* not saved; nothing depends on it */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* nothing to remove */
    }
  },
};
