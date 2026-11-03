import { AnalyticsEvents } from "@/components/analytics-events";
import Script from "next/script";

// Visitor analytics (Umami).
//
// Set NEXT_PUBLIC_UMAMI_WEBSITE_ID (and optionally NEXT_PUBLIC_UMAMI_SRC if you
// self-host) in your Netlify environment variables. With nothing set, this
// renders nothing at all, so local development stays clean and no tracking
// script ships until you deliberately turn it on.
//
// NEXT_PUBLIC_UMAMI_DOMAINS limits tracking to your real domain, so Netlify
// deploy previews and localhost don't pollute the numbers. Defaults to
// mella7.me and www.mella7.me.
//
// Umami and Plausible are both cookie-free and do not collect personal data,
// which means no cookie banner is required under GDPR. That matters if your
// visitors are in the EU. Google Analytics does require a banner.
//
// Also see:
//   src/components/analytics-events.tsx  clicks on resume, LinkedIn, GitHub...
//   src/lib/short-links.ts               /qr and /go tracked links
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const src =
    process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";
  const domains =
    process.env.NEXT_PUBLIC_UMAMI_DOMAINS ?? "mella7.me,www.mella7.me";

  if (!websiteId) return null;

  return (
    <>
      <Script
        src={src}
        data-website-id={websiteId}
        data-domains={domains}
        strategy="afterInteractive"
        defer
      />
      <AnalyticsEvents />
    </>
  );
}
