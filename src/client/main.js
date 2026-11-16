// Entry point. Each module looks for its own markup and does nothing when it
// is not on the page, so every page can load the same script.

import { initTheme } from "./theme.js";
import { initIntro } from "./intro.js";
import { initClock } from "./clock.js";
import { initAvatar } from "./avatar.js";
import { initMotion } from "./motion.js";
import { initScenes } from "./scenes.js";
import { initTerminal } from "./terminal.js";
import { initForm } from "./form.js";
import { initSlideViewers } from "./slides.js";
import { initLightbox } from "./lightbox.js";
import { initCompanion } from "./companion.js";
import { initGlobe } from "./globe.js";
import { initAnalytics } from "./analytics.js";

const steps = [
  initTheme,
  initIntro,
  initTerminal, // moves the terminal into its section before layout is measured
  initScenes,
  initMotion,
  initClock,
  initAvatar,
  initForm,
  initSlideViewers,
  initLightbox,
  initCompanion,
  initGlobe,
  initAnalytics,
];

// One broken feature must not take the rest of the page down with it.
for (const step of steps) {
  try {
    step();
  } catch (error) {
    console.error(`[site] ${step.name} failed`, error);
  }
}
