// Slide viewer on the talk pages. Slides are pre-rendered images
// (NN-960.avif|webp and NN-1600.avif|webp). Arrow keys, swipe, the buttons
// and the slider move between slides; F toggles fullscreen.

import { $, $$, clamp } from "./util.js";

export function initSlideViewers() {
  for (const viewer of $$("[data-slide-viewer]")) setup(viewer);
}

function setup(viewer) {
  const dir = viewer.dataset.dir;
  const count = Number(viewer.dataset.count);
  const title = viewer.dataset.title ?? "";
  const stage = $(".viewer__stage", viewer);
  const img = $("[data-img]", viewer);
  const avif = $("[data-avif]", viewer);
  const webp = $("[data-webp]", viewer);
  const counter = $("[data-counter]", viewer);
  const range = $("[data-range]", viewer);
  let current = 1;

  const file = (n, width, ext) => `${dir}/${String(n).padStart(2, "0")}-${width}.${ext}`;
  const srcset = (n, ext) => `${file(n, 960, ext)} 960w, ${file(n, 1600, ext)} 1600w`;

  // Preload neighbours in the same format and width the browser chose.
  const preload = (n) => {
    if (n < 1 || n > count) return;
    const chosen = img.currentSrc || "";
    const ext = chosen.endsWith(".avif") ? "avif" : "webp";
    const width = chosen.includes("-960.") ? 960 : 1600;
    new Image().src = file(n, width, ext);
  };

  function show(n) {
    const next = clamp(n, 1, count);
    if (next === current) return;
    current = next;
    avif.srcset = srcset(current, "avif");
    webp.srcset = srcset(current, "webp");
    img.src = file(current, 1600, "webp");
    img.alt = `${title}, slide ${current} of ${count}`;
    img.classList.remove("is-swapping");
    void img.offsetWidth; // restart the swap animation
    img.classList.add("is-swapping");
    counter.textContent = `${current} / ${count}`;
    range.value = String(current);
    preload(current + 1);
    preload(current - 1);
  }

  for (const button of $$("[data-prev]", viewer)) button.addEventListener("click", () => show(current - 1));
  for (const button of $$("[data-next]", viewer)) button.addEventListener("click", () => show(current + 1));
  range.addEventListener("input", () => show(Number(range.value)));

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else stage.requestFullscreen?.().catch(() => {});
  };
  $("[data-fullscreen]", viewer)?.addEventListener("click", toggleFullscreen);

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === "Home") show(1);
    else if (event.key === "End") show(count);
    else if (event.key.toLowerCase() === "f") toggleFullscreen();
  });

  let startX = 0;
  stage.addEventListener("touchstart", (event) => (startX = event.touches[0].clientX), { passive: true });
  stage.addEventListener("touchend", (event) => {
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
  });

  preload(2);
}
