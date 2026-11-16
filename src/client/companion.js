// The walking avatar: a small character that strolls along the bottom of the
// window and, every so often, does something silly.
//
// The sprite sheet (public/avatar-walk-<theme>.webp, built by
// scripts/walker.py) holds five clips: walk, idle, sit, wave and sit-down.
// Jump, backflip, breakdance and moonwalk are those frames plus transforms.
//
// Click the avatar for a trick, or use the terminal: avatar <trick>.
// It is hidden on small screens and with reduced motion, pauses when the tab
// is in the background, and the walk button in the dock switches it off.

import { $, clamp, reduceMotion, store } from "./util.js";

const WALK_SPEED = 62; // px per second
const EDGE = 16;
const RIGHT_MARGIN = 190; // keep clear of the dock buttons
const TRICKS = ["wave", "jump", "backflip", "breakdance", "moonwalk", "sit"];

export const trickNames = () => TRICKS.slice();

export function initCompanion() {
  const el = $("#companion");
  const toggle = $("#companion-toggle");
  if (!el || !toggle) return;
  if (reduceMotion || !el.dataset.sprite) {
    toggle.hidden = true;
    return;
  }

  const sprite = JSON.parse(el.dataset.sprite);
  const [W, H] = sprite.cell;
  const clips = sprite.clips;
  el.style.width = `${W}px`;
  el.style.height = `${H}px`;
  el.style.backgroundSize = `${sprite.cols * W}px ${sprite.rows * H}px`;

  let enabled = store.get("companion") !== "off";
  let raf = 0;
  let last = 0;

  // Where it is and what it is doing.
  let x = EDGE;
  let target = x;
  let facing = 1;
  let action = "idle";
  let actionTime = 0; // seconds spent in the current action
  let actionLength = 1.2;
  let queued = null; // a trick asked for by a click or the terminal

  const maxX = () => Math.max(EDGE, window.innerWidth - W - RIGHT_MARGIN);

  function drawFrame(clipName, index) {
    const clip = clips[clipName];
    const cell = clip.offset + clamp(index, 0, clip.frames - 1);
    el.style.backgroundPosition = `${-(cell % sprite.cols) * W}px ${-Math.floor(cell / sprite.cols) * H}px`;
  }
  const loopFrame = (clipName, time) => Math.floor(time * clips[clipName].fps) % clips[clipName].frames;
  const clipSeconds = (clipName) => clips[clipName].frames / clips[clipName].fps;

  function start(name) {
    action = name;
    actionTime = 0;
    if (name === "walk") {
      target = EDGE + Math.random() * (maxX() - EDGE);
      if (Math.abs(target - x) < 80) target = x > maxX() / 2 ? EDGE : maxX();
      facing = target > x ? 1 : -1;
      actionLength = Infinity;
    } else if (name === "moonwalk") {
      target = clamp(x + (x > maxX() / 2 ? -1 : 1) * 220, EDGE, maxX());
      facing = target > x ? -1 : 1; // faces away from where it is going
      actionLength = Infinity;
    } else {
      actionLength =
        {
          idle: 1.2 + Math.random() * 2,
          wave: clipSeconds("wave") * 2,
          jump: 0.7,
          backflip: 0.95,
          breakdance: 2.4,
          sit: clipSeconds("sitDown") * 2 + 3,
        }[name] ?? 1;
    }
  }

  function next() {
    if (queued) {
      const trick = queued;
      queued = null;
      return start(trick);
    }
    if (action === "walk") return start(Math.random() < 0.75 ? TRICKS[Math.floor(Math.random() * TRICKS.length)] : "idle");
    if (action === "idle") return start("walk");
    return start("idle");
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    actionTime += dt;
    const t = actionLength === Infinity ? 0 : clamp(actionTime / actionLength, 0, 1);

    let lift = 0; // px above the floor
    let rotate = 0; // degrees
    let squash = 1; // horizontal scale, used to fake a spin

    switch (action) {
      case "walk":
      case "moonwalk": {
        const speed = action === "walk" ? WALK_SPEED : WALK_SPEED * 0.6;
        const step = Math.sign(target - x) * speed * dt;
        x = Math.abs(target - x) <= Math.abs(step) ? target : x + step;
        const frame = loopFrame("walk", actionTime);
        drawFrame("walk", action === "walk" ? frame : clips.walk.frames - 1 - frame);
        if (x === target || queued) next();
        break;
      }
      case "wave":
        drawFrame("wave", loopFrame("wave", actionTime));
        break;
      case "jump":
        drawFrame("idle", 0);
        lift = Math.sin(t * Math.PI) * 74;
        break;
      case "backflip":
        drawFrame("idle", 0);
        lift = Math.sin(t * Math.PI) * 118;
        rotate = -360 * t * facing;
        break;
      case "breakdance": {
        // Up onto the head, spin, and back down.
        const up = clamp(t / 0.15, 0, 1);
        const down = clamp((1 - t) / 0.15, 0, 1);
        drawFrame("idle", 0);
        rotate = 180 * Math.min(up, down);
        squash = Math.cos(actionTime * 14);
        lift = Math.abs(Math.sin(actionTime * 10)) * 5;
        break;
      }
      case "sit": {
        const fold = clipSeconds("sitDown");
        if (actionTime < fold) {
          drawFrame("sitDown", Math.floor(actionTime * clips.sitDown.fps));
        } else if (actionTime > actionLength - fold) {
          drawFrame("sitDown", clips.sitDown.frames - 1 - Math.floor((actionTime - (actionLength - fold)) * clips.sitDown.fps));
        } else {
          drawFrame("sit", loopFrame("sit", actionTime));
          lift = 10 + Math.sin(actionTime * 3) * 5; // meditating: it levitates
        }
        break;
      }
      default:
        drawFrame("idle", loopFrame("idle", actionTime));
    }

    if (actionLength !== Infinity && actionTime >= actionLength) next();
    else if (queued && action === "idle") next();

    x = clamp(x, 0, maxX());
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${(-lift).toFixed(1)}px, 0) rotate(${rotate.toFixed(1)}deg) scaleX(${(facing * squash).toFixed(3)})`;
  }

  function apply() {
    toggle.setAttribute("aria-pressed", String(enabled));
    el.classList.toggle("is-on", enabled);
    cancelAnimationFrame(raf);
    if (enabled && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }

  function perform(name) {
    if (!enabled) return false;
    const trick = TRICKS.includes(name) ? name : TRICKS[Math.floor(Math.random() * TRICKS.length)];
    queued = trick;
    return true;
  }

  el.addEventListener("click", () => {
    perform();
    document.dispatchEvent(new CustomEvent("track", { detail: { name: "avatar", data: { via: "click" } } }));
  });
  document.addEventListener("companion:do", (event) => perform(event.detail));
  toggle.addEventListener("click", () => {
    enabled = !enabled;
    store.set("companion", enabled ? "on" : "off");
    apply();
  });
  document.addEventListener("visibilitychange", apply);
  window.addEventListener("resize", () => {
    target = clamp(target, 0, maxX());
  });

  start("wave"); // says hello first
  apply();
}
