// "My time" card: the time where I am, and how far that is from the visitor.

import { $ } from "./util.js";

export function initClock() {
  const clock = $("#clock");
  if (!clock) return;
  const diff = $("#clock-diff");
  const timeZone = clock.dataset.tz;
  const [hours, , minutes] = clock.children;
  const format = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });

  function tick() {
    const now = new Date();
    const parts = Object.fromEntries(format.formatToParts(now).map((p) => [p.type, p.value]));
    hours.textContent = parts.hour;
    minutes.textContent = parts.minute;

    // Offset between the two zones, from the same instant rendered in each.
    const there = new Date(now.toLocaleString("en-US", { timeZone }));
    const here = new Date(now.toLocaleString("en-US"));
    const delta = Math.round((there - here) / 36e5);
    diff.textContent = delta === 0 ? "Same time as you" : `${Math.abs(delta)}h ${delta > 0 ? "ahead of" : "behind"} you`;
  }

  try {
    tick();
    setInterval(tick, 20_000);
  } catch {
    /* unknown time zone in an old browser: leave the placeholder */
  }
}
