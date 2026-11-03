"use client";

import { track } from "@/lib/track";
import { useEffect } from "react";

// One click listener for the whole site, so individual links don't need
// tracking attributes. Records what visitors do, not who they are:
//
//   resume-download   { lang }            a resume PDF was opened
//   pdf-open          { file }            any other PDF (slides etc.)
//   email-click                           a mailto: link
//   linkedin-click    { page }            your LinkedIn profile
//   github-click      { page }            your GitHub (or a repo)
//   outbound-click    { host, page }      any other external site
//
// Plus, from their own components:
//   contact-form-sent                     contact-form.tsx
//   terminal-command  { command }         terminal.tsx (known commands only,
//                                         never free text a visitor typed)

function handle(event: MouseEvent) {
  const target = event.target as Element | null;
  const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!link) return;

  const raw = link.getAttribute("href") ?? "";
  if (raw.startsWith("mailto:")) return track("email-click");

  let url: URL;
  try {
    url = new URL(link.href);
  } catch {
    return;
  }
  const page = window.location.pathname;

  if (url.pathname.toLowerCase().endsWith(".pdf")) {
    const lang = url.pathname.match(/_(EN|DE|FR)\.pdf$/i)?.[1];
    if (url.pathname.startsWith("/resume/")) {
      return track("resume-download", { lang: lang?.toLowerCase() ?? "unknown" });
    }
    return track("pdf-open", { file: url.pathname });
  }

  if (url.host === window.location.host) return;

  const host = url.hostname.replace(/^www\./, "");
  if (host.endsWith("linkedin.com")) return track("linkedin-click", { page });
  if (host === "github.com") return track("github-click", { page });
  track("outbound-click", { host, page });
}

export function AnalyticsEvents() {
  useEffect(() => {
    // capture: runs before Next's <Link> handles the click.
    // auxclick: middle-click "open in new tab" counts too.
    document.addEventListener("click", handle, { capture: true });
    document.addEventListener("auxclick", handle, { capture: true });
    return () => {
      document.removeEventListener("click", handle, { capture: true });
      document.removeEventListener("auxclick", handle, { capture: true });
    };
  }, []);

  return null;
}
