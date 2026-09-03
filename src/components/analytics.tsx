import Script from "next/script";

// Visitor analytics.
//
// Set NEXT_PUBLIC_UMAMI_WEBSITE_ID (and optionally NEXT_PUBLIC_UMAMI_SRC if you
// self-host) in your Netlify environment variables. With nothing set, this
// renders nothing at all, so local development stays clean and no tracking
// script ships until you deliberately turn it on.
//
// Umami and Plausible are both cookie-free and do not collect personal data,
// which means no cookie banner is required under GDPR. That matters if your
// visitors are in the EU. Google Analytics does require a banner.
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const src =
    process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";

  if (!websiteId) return null;

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      strategy="afterInteractive"
      defer
    />
  );
}
