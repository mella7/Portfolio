"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { Icons } from "@/components/icons";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Sticky top navigation.
//
// Two visual states:
//   - `overlay` (homepage, when a hero image sits behind it): transparent with
//     light text, so the photo reads through. Turns solid once you scroll.
//   - default (every other page): solid from the start.
//
// The bar is deliberately plain - the interactive terminal on the homepage is
// the memorable element, and a loud header would fight it for attention.
export function SiteHeader({
  locale,
  labels,
  social,
  name,
  avatarUrl,
  overlay = false,
}: {
  locale: Locale;
  labels: {
    home: string;
    projects: string;
    blog: string;
    talks: string;
    certifications: string;
  };
  social: { github: string; linkedin: string };
  name: string;
  avatarUrl: string;
  /** True when the homepage has a hero image for the bar to sit over. */
  overlay?: boolean;
}) {
  const pathname = usePathname() ?? "";
  // The transparent treatment only applies on the homepage, where the hero
  // image lives. Every other route gets the solid bar immediately.
  const onHome = pathname === `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Only the overlay variant needs scroll tracking.
  useEffect(() => {
    if (!overlay || !onHome) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay, onHome]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: `/${locale}`, label: labels.home, exact: true },
    { href: `/${locale}/projects`, label: labels.projects },
    { href: `/${locale}/talks`, label: labels.talks },
    { href: `/${locale}/blog`, label: labels.blog },
    { href: `/${locale}/certifications`, label: labels.certifications },
  ];

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  // Transparent only while sitting over the hero and not yet scrolled.
  const floating = overlay && onHome && !scrolled && !menuOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        floating
          ? "bg-transparent text-white"
          : "bg-background/85 backdrop-blur-md border-b border-border text-foreground"
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Identity */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Image
            src={avatarUrl}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          <span className="font-semibold tracking-tight">{name}</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-opacity hover:opacity-100 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive(link.href, link.exact)
                  ? "font-medium underline underline-offset-8 decoration-2 opacity-100"
                  : "opacity-70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        {/* LanguageSwitcher and ModeToggle set their own text colours, which
            would render near-black over a dark hero photo. While floating,
            force everything inside to inherit the header's white. */}
        <div
          className={cn(
            "flex items-center gap-1",
            floating && "[&_a]:!text-white [&_button]:!text-white [&_svg]:!text-white"
          )}
        >
          <Link
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden sm:inline-flex p-2 rounded-md hover:bg-foreground/10 transition-colors"
          >
            <Icons.github className="size-4" />
          </Link>
          <Link
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hidden sm:inline-flex p-2 rounded-md hover:bg-foreground/10 transition-colors"
          >
            <Icons.linkedin className="size-4" />
          </Link>

          <LanguageSwitcher currentLocale={locale} />
          <ModeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="md:hidden p-2 rounded-md hover:bg-foreground/10 transition-colors"
          >
            {menuOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 pb-3 pt-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-accent",
                isActive(link.href, link.exact)
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
