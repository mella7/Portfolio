"use client";

import { buttonVariants } from "@/components/ui/button";
import { resumeLinks } from "@/data/shared";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";

// The resume download row: English / Deutsch / Français.
//
// NOTE: these are deliberately plain <a> elements with CSS transitions rather
// than framer-motion `motion.a`. Motion components that wrap an anchor with an
// SVG child can trip React hydration ("Expected server HTML to contain a
// matching <svg> in <a>"), especially when a browser extension touches the
// DOM before hydration. CSS handles this animation just as smoothly with no
// JS and no hydration risk.
export function LanguageResumeButtons({
  labels,
  currentLocale,
}: {
  labels: { en: string; de: string; fr: string };
  currentLocale: Locale;
}) {
  const available: { code: Locale; label: string }[] = [
    { code: "en", label: labels.en },
    { code: "de", label: labels.de },
    { code: "fr", label: labels.fr },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {available.map(({ code, label }) => (
        <a
          key={code}
          href={resumeLinks[code]}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({
              variant: code === currentLocale ? "default" : "outline",
              size: "sm",
            }),
            "gap-1.5 transition-transform duration-200 ease-out",
            "hover:scale-105 hover:-translate-y-0.5 active:scale-95"
          )}
        >
          <DownloadIcon className="size-3.5" />
          {label}
        </a>
      ))}
    </div>
  );
}
