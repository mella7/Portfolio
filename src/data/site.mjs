// Site-wide settings. Edit this file and src/data/content.mjs to change what
// the site says; the pages are generated from them.

export const DOMAIN = "mella7.me";

export const SITE = {
  url: `https://${DOMAIN}`,
  title: "Mohamed Ali Mellah",
  description:
    "Mohamed Ali Mellah builds Kubernetes platforms and secures them: operators in Go, GitOps delivery, cloud identity and eBPF runtime detection. CKA, CKAD, RHCSA.",
  author: {
    fullName: "Mohamed Ali Mellah",
    firstName: "Mohamed Ali",
    handle: "mella7",
    jobTitle: "Cloud-Native & Kubernetes Engineer",
    tagline: "DevSecOps practitioner",
  },
  location: {
    label: "Munich, Germany",
    country: "Germany",
    timezone: "Europe/Berlin",
    note: "Open to relocation",
  },
  links: {
    email: "med.ali@mella7.me",
    github: "https://github.com/mella7",
    linkedin: "https://www.linkedin.com/in/MellahMedAli/",
    medium: "https://medium.com/@mellahmohamedali",
    repo: "https://github.com/mella7/Portfolio",
  },
  resume: [
    { lang: "en", label: "English", file: "/resume/Resume_Mohamed_Ali_Mellah_EN.pdf" },
    { lang: "de", label: "Deutsch", file: "/resume/Resume_Mohamed_Ali_Mellah_DE.pdf" },
    { lang: "fr", label: "Français", file: "/resume/Resume_Mohamed_Ali_Mellah_FR.pdf" },
  ],
  // "Now" card on the homepage. Update the date when you change the text.
  now: {
    date: "2026-11-16",
    text: "I'm looking for a DevSecOps / Cloud Engineering position.",
  },
  // The contact form posts to this path. On Netlify it is handled by Netlify
  // Forms (see public/__forms.html). For another host, point it at any endpoint
  // that accepts a urlencoded POST on the same origin.
  contactFormAction: "/__forms.html",
  // Accent colour: each visit starts on a random colour and moves to the
  // next one every `cycleSeconds`. A visitor who picks a colour keeps it.
  // Set cycleSeconds to 0 to stop the rotation.
  theme: { cycleSeconds: 45 },
  // A hidden terminal command. Typing it asks for the statistics passkey and,
  // if it is right, opens the dashboard. Change the word to your own. The word
  // is not a secret (it ships in the page); the passkey is, and it only ever
  // lives on the server as STATS_TOKEN.
  statsCommand: "iamroot",
  // Visitor statistics. The site sends anonymous page views and events to
  // this URL (see server/server.mjs and README "Visitor statistics").
  //   "/api/hit"                      the site is served by server/server.mjs
  //   "https://stats.example.com/api/hit"   the server runs on another host
  //   ""                              statistics off
  analytics: { endpoint: "/api/hit" },
  // The walking avatar. The sheets are built by scripts/walker.py, one per
  // accent colour: public/avatar-walk-<theme>.webp. Set to null to remove it.
  companion: {
    cell: [80, 130], // size of one frame in pixels
    cols: 13,
    rows: 4,
    clips: {
      walk: { offset: 0, frames: 12, fps: 14 },
      idle: { offset: 12, frames: 8, fps: 8 },
      sit: { offset: 20, frames: 8, fps: 6 },
      wave: { offset: 28, frames: 16, fps: 13 },
      sitDown: { offset: 44, frames: 8, fps: 11 },
    },
  },
  visitedCountries: [
    "Tunisia", "Germany", "China", "Hong Kong", "Turkey", "France", "Switzerland", "Austria", "Hungary",
    "Slovakia", "Italy", "Czech Republic", "Poland", "Netherlands", "Belgium", "Luxembourg", "Vatican City",
  ],
};

// Accent colours. For each: the accent, a light tint for text on dark
// surfaces, the text colour that reads on top of the accent, and a deeper
// accent used in light mode so it stays readable on a pale background.
// The avatar has one sprite sheet per theme.
export const THEMES = [
  { id: "red", accent: "#e63946", soft: "#f3a3aa", on: "#ffffff", light: "#cf2436" },
  { id: "yellow", accent: "#ffeb3b", soft: "#fff59d", on: "#111111", light: "#9a7400" },
  { id: "green", accent: "#66bb6a", soft: "#a5d6a7", on: "#111111", light: "#2a7d3f" },
  { id: "blue", accent: "#2196f3", soft: "#90caf9", on: "#ffffff", light: "#1565c0" },
  { id: "purple", accent: "#b04fd0", soft: "#ce93d8", on: "#ffffff", light: "#8a2fad" },
];

// Surface colours for the two modes. The card frames are generated from these.
export const MODES = {
  dark: { bg: "#0b0b0b", card: "#171717", line: "#383838" },
  light: { bg: "#f4f1ed", card: "#ffffff", line: "#d2ccc5" },
};
