"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { languageOptions, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Site-wide language switcher used in the dock. Swaps the locale prefix of
// the current path so the visitor stays on the same page.
export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname() ?? `/${currentLocale}`;

  function pathFor(locale: string): string {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return (
    <div className="flex items-center gap-0.5">
      {languageOptions.map((option) => {
        const isActive = option.code === currentLocale;
        return (
          <Tooltip key={option.code}>
            <TooltipTrigger asChild>
              <Link
                href={pathFor(option.code)}
                className={cn(
                  "px-1.5 py-1 text-xs font-medium rounded transition-colors hover:bg-accent",
                  isActive
                    ? "text-foreground underline underline-offset-4"
                    : "text-muted-foreground"
                )}
              >
                {option.label}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.name}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
