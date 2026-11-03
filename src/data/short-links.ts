// Tracked links: mella7.me/qr/<name> (for printed QR codes) and
// mella7.me/go/<name> (for links you paste into applications, emails, slides).
//
// Every name is counted in Umami, whether or not it is listed here. Names not
// listed below simply land on the homepage. List a name only when you want
// it to open a specific page - and you can change that page later without
// reprinting the QR code.
//
// Paths are written without the language prefix: "/talks/x" becomes
// "/en/talks/x", "/de/talks/x" or "/fr/talks/x" depending on the visitor.
// Names may use lowercase letters, digits and hyphens (max 40 characters).

export const shortLinkTargets: Record<string, string> = {
  containerdays: "/talks/containerdays-2026-ebpf",
  "cloud-identity-summit": "/talks/cloud-identity-summit-2026-cicd",
  projects: "/projects",
};
