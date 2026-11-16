// Small motion effects used on every page: scroll progress, reveal on
// scroll, heading "decode", count-up numbers, pointer spotlight and tilt on
// cards, magnetic buttons, the experience timeline, and the section nav.

import { $, $$, clamp, finePointer, onScrollFrame, reduceMotion } from "./util.js";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&/<>";

/** Replace the text with random glyphs, then settle left to right. */
function scramble(element) {
  const text = element.textContent;
  if (!text.trim() || element.dataset.scrambled) return;
  element.dataset.scrambled = "1";
  element.setAttribute("aria-label", text);
  const duration = Math.min(900, 300 + text.length * 14);
  const start = performance.now();

  const frame = (now) => {
    const progress = clamp((now - start) / duration, 0, 1);
    const settled = Math.floor(progress * text.length);
    const pending = document.createElement("span");
    pending.className = "scr";
    pending.setAttribute("aria-hidden", "true");
    pending.textContent = Array.from(text.slice(settled), (ch) =>
      ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    ).join("");
    element.replaceChildren(text.slice(0, settled), pending);
    if (progress < 1) requestAnimationFrame(frame);
    else element.textContent = text;
  };
  requestAnimationFrame(frame);
}

function countUp(element) {
  const end = Number(element.dataset.count);
  const start = performance.now();
  const frame = (now) => {
    const progress = clamp((now - start) / 1100, 0, 1);
    element.textContent = String(Math.round(end * (1 - (1 - progress) ** 3)));
    if (progress < 1) requestAnimationFrame(frame);
  };
  element.textContent = "0";
  requestAnimationFrame(frame);
}

function initReveal() {
  const items = $$(".reveal");
  const headings = $$("[data-scramble]");
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        el.classList.add("is-in");
        if (el.matches("[data-scramble]")) scramble(el);
        $$("[data-scramble]", el).forEach(scramble);
        $$("[data-count]", el).forEach(countUp);
        observer.unobserve(el);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  for (const el of items) {
    // Siblings arrive one after another.
    const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 6) * 70}ms`);
    observer.observe(el);
  }
  for (const el of headings) if (!el.closest(".reveal")) observer.observe(el);

  // Safety net: anything already on screen must never stay hidden.
  window.setTimeout(() => {
    for (const el of $$(".reveal:not(.is-in)")) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
    }
  }, 1600);
}

function initPointerEffects() {
  if (!finePointer || reduceMotion) return;

  // Spotlight: the glow inside a card follows the pointer.
  for (const card of $$(".card")) {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - box.left}px`);
      card.style.setProperty("--my", `${event.clientY - box.top}px`);
    });
  }

  // Tilt: cards lean a few degrees toward the pointer.
  for (const card of $$("[data-tilt]")) {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.classList.add("is-tilting");
      card.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }

  // Magnetic buttons: the solid buttons drift slightly toward the pointer.
  for (const button of $$(".btn--solid")) {
    button.addEventListener("pointermove", (event) => {
      const box = button.getBoundingClientRect();
      const x = (event.clientX - (box.left + box.width / 2)) * 0.18;
      const y = (event.clientY - (box.top + box.height / 2)) * 0.25;
      button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  }
}

function initScrollState() {
  const bar = $("#progress");
  const nav = $("#snav");
  const bento = $(".bento");
  const sections = $$("[data-section]");
  const links = nav ? $$("a", nav) : [];
  const timeline = $(".xp");

  onScrollFrame(() => {
    const viewport = window.innerHeight;
    const max = document.documentElement.scrollHeight - viewport;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

    if (nav && bento) {
      nav.classList.toggle("is-on", window.scrollY > bento.offsetHeight - viewport * 0.5);
      let current = "main";
      for (const section of sections) if (section.getBoundingClientRect().top < viewport * 0.5) current = section.id;
      for (const link of links) link.classList.toggle("is-current", link.getAttribute("href") === `#${current}`);
    }

    if (timeline) {
      const box = timeline.getBoundingClientRect();
      timeline.style.setProperty("--p", clamp((viewport * 0.6 - box.top) / box.height, 0, 1).toFixed(3));
    }
  });
}

function initCopy() {
  for (const button of $$("[data-copy]")) {
    const label = $("span", button) ?? button;
    const original = label.textContent;
    button.addEventListener("click", async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        ok = true;
      } catch {
        ok = false;
      }
      label.textContent = ok ? "Copied" : "Select the address to copy";
      window.setTimeout(() => (label.textContent = original), 1800);
    });
  }
}

export function initMotion() {
  initScrollState();
  initReveal();
  initPointerEffects();
  initCopy();
}
