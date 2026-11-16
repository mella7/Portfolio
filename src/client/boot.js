// Runs before the page paints (a classic script in <head>), so the saved
// theme and the opening animation never flash. Keep it tiny.
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // Accent colour: the one the visitor picked, otherwise a random one so the
  // site does not always open in the same colour.
  var themes = (root.dataset.themes || "red").split(" ");
  var picked = null;
  try {
    picked = localStorage.getItem("theme");
  } catch (e) {
    /* storage can be blocked; a random colour is fine */
  }
  root.dataset.theme = themes.indexOf(picked) > -1 ? picked : themes[Math.floor(Math.random() * themes.length)];

  // Light or dark: the saved choice, otherwise dark (the default look).
  try {
    var mode = localStorage.getItem("mode");
    if (mode === "light" || mode === "dark") root.dataset.mode = mode;
  } catch (e) {
    /* keep the default */
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) root.classList.add("reduce");

  // Opening animation: homepage only, once per tab, never with reduced motion
  // or when the visitor arrived at a specific section.
  var seen = false;
  try {
    seen = sessionStorage.getItem("booted") === "1";
  } catch (e) {
    seen = false;
  }
  if (root.dataset.home && !reduce && !seen && !location.hash) {
    root.classList.add("booting");
    // If the main script never arrives, do not leave the page covered.
    window.setTimeout(function () {
      if (!root.classList.contains("boot-started")) root.classList.remove("booting");
    }, 4000);
  }
})();
