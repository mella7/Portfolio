// The /qr page on a static host: report the scan, then go to the homepage.
// (When the site runs behind server/server.mjs, the server counts the scan
// and redirects before this page is ever served.)
(function () {
  var root = document.documentElement;
  var endpoint = root.dataset.analytics;
  var home = (root.dataset.base || "") + "/";
  var code = (new URLSearchParams(location.search).get("c") || "qr").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40) || "qr";
  var optedOut = navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  try {
    if (endpoint && !optedOut && navigator.sendBeacon) {
      var body = JSON.stringify({ t: "event", n: "qr-scan", p: "/qr", s: "qr", d: { code: code } });
      navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }));
    }
  } catch (e) {
    /* go home regardless */
  }
  location.replace(home);
})();
