// Photo lightbox on the moments page, built on <dialog> so focus trapping
// and Escape come from the browser. Without JavaScript the links simply
// open the full-size photo.

import { $, $$ } from "./util.js";

export function initLightbox() {
  const gallery = $("[data-gallery]");
  const dialog = $("#lightbox");
  if (!gallery || !dialog || typeof dialog.showModal !== "function") return;

  const links = $$("a[data-full]", gallery);
  const img = $("#lightbox-img");
  const caption = $("#lightbox-cap");
  let index = 0;

  function show(i) {
    index = (i + links.length) % links.length;
    const link = links[index];
    img.src = link.dataset.full;
    img.alt = link.dataset.caption;
    caption.textContent = `${link.dataset.caption}  (${index + 1} / ${links.length})`;
  }

  links.forEach((link, i) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  $("[data-close]", dialog).addEventListener("click", () => dialog.close());
  $("[data-prev]", dialog).addEventListener("click", () => show(index - 1));
  $("[data-next]", dialog).addEventListener("click", () => show(index + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close(); // click on the backdrop
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    else if (event.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", () => links[index]?.focus());
}
