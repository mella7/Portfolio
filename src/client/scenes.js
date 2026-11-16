// The two scroll-driven scenes on the homepage.
//
//   Highlights: the section is taller than the screen and its content is
//   pinned (CSS sticky). Progress through the section picks which step shows.
//
//   Projects: the section is as tall as the card track is wide. Progress
//   through it moves the track sideways.
//
// With reduced motion both fall back to ordinary layouts.

import { $, $$, clamp, finePointer, onScrollFrame, reduceMotion, root } from "./util.js";

function initHighlights() {
  const section = $("#highlights");
  if (!section) return null;
  const steps = $$(".step", section);
  const photos = $$(".stage__item", section);
  const ticks = $$(".rail__tick", section);
  const fill = $("#rail-fill");
  const caption = $("#stage-cap");
  const places = caption.dataset.places.split("|");
  let active = -1;

  const show = (index) => {
    if (index === active) return;
    active = index;
    steps.forEach((el, i) => {
      el.classList.toggle("is-on", i === index);
      el.classList.toggle("is-past", i < index);
    });
    photos.forEach((el, i) => {
      el.classList.toggle("is-on", i === index);
      el.classList.toggle("is-past", i < index);
    });
    ticks.forEach((el, i) => el.classList.toggle("is-on", i <= index));
    caption.textContent = places[index];
  };

  return () => {
    const box = section.getBoundingClientRect();
    const progress = clamp(-box.top / (box.height - window.innerHeight), 0, 1);
    fill.style.transform = `scaleY(${progress})`;
    show(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
  };
}

function initProjects() {
  const section = $("#projects");
  if (!section) return null;
  const track = $("#hz-track");
  const bar = $("#hz-bar");
  const counter = $("#hz-n");
  const cards = $$(".pc:not(.pc--end)", track);
  let distance = 0;

  const measure = () => {
    const native = reduceMotion || !finePointer || window.innerWidth < 820;
    section.classList.toggle("is-native", native);
    if (native) {
      distance = 0;
      section.style.height = "";
      track.style.transform = "";
      return;
    }
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    section.style.height = `${window.innerHeight + distance}px`;
  };
  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);

  return () => {
    if (!distance) return;
    const box = section.getBoundingClientRect();
    const progress = clamp(-box.top / (box.height - window.innerHeight), 0, 1);
    track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
    bar.style.transform = `scaleX(${progress})`;

    const middle = window.innerWidth / 2;
    let nearest = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const gap = Math.abs(rect.left + rect.width / 2 - middle);
      if (gap < best) {
        best = gap;
        nearest = i;
      }
    });
    counter.textContent = String(nearest + 1).padStart(2, "0");
  };
}

export function initScenes() {
  if (reduceMotion) {
    root.classList.add("no-scenes");
    initProjects(); // still switches the row to its swipeable layout
    return;
  }
  const updates = [initHighlights(), initProjects()].filter(Boolean);
  if (updates.length) onScrollFrame(() => updates.forEach((update) => update()));
}
