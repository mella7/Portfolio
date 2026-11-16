// The avatar in the intro card: a 24-frame turntable in a 6x4 sprite sheet.
// It spins once on load, then turns to face the pointer (or follows the
// scroll position on touch screens).

import { $, clamp, finePointer, reduceMotion } from "./util.js";

export const FRAMES = 24;
const COLS = 6;

/** background-position for one frame of a 6x4 turntable sheet. */
export function framePosition(frame) {
  const f = ((Math.round(frame) % FRAMES) + FRAMES) % FRAMES;
  return `${(f % COLS) * 20}% ${Math.floor(f / COLS) * 33.3333}%`;
}

export function initAvatar() {
  const avatar = $("#avatar");
  if (!avatar || reduceMotion) return;

  let current = 0;
  let target = 0;
  let raf = 0;

  const step = () => {
    const delta = target - current;
    if (Math.abs(delta) < 0.05) {
      current = target;
      avatar.style.backgroundPosition = framePosition(current);
      raf = 0;
      return;
    }
    current += delta * 0.14;
    avatar.style.backgroundPosition = framePosition(current);
    raf = requestAnimationFrame(step);
  };
  const aim = (frame) => {
    target = frame;
    if (!raf) raf = requestAnimationFrame(step);
  };
  const spin = () => {
    current = target - FRAMES;
    aim(target);
  };

  spin();
  avatar.addEventListener("click", spin);

  if (finePointer) {
    window.addEventListener(
      "pointermove",
      (event) => {
        const box = avatar.getBoundingClientRect();
        if (box.bottom < 0) return;
        const offset = (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2);
        aim(clamp(offset * 4, -4, 4));
      },
      { passive: true },
    );
  } else {
    window.addEventListener("scroll", () => window.scrollY < 700 && aim(window.scrollY / 45), { passive: true });
  }
}
