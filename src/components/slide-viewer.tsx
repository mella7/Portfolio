"use client";

import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// A live, in-page slide deck viewer.
//
// Slides are pre-rendered from the PDF into WebP images (see the README), which
// matters for two reasons:
//   1. A 56-slide deck that is 18 MB as a PDF is about 2.7 MB as WebP, and only
//      the slide being viewed is fetched, so the page stays fast.
//   2. It renders identically everywhere. Embedding a PDF in an <iframe> hands
//      the visitor whatever viewer their browser ships, which on mobile is
//      often a download prompt rather than a viewer.
export function SlideViewer({
  slideCount,
  basePath,
  title,
  downloadUrl,
  labels,
}: {
  slideCount: number;
  /** Directory holding 01.webp, 02.webp, ... e.g. "/talks/slides/my-talk" */
  basePath: string;
  title: string;
  downloadUrl?: string;
  labels: { of: string; previous: string; next: string; fullscreen: string };
}) {
  const [current, setCurrent] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (delta: number) => {
      setCurrent((prev) => Math.min(slideCount, Math.max(1, prev + delta)));
    },
    [slideCount]
  );

  // Arrow keys drive the deck, but only once the viewer has focus, so they
  // don't hijack normal page scrolling for someone just reading past it.
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setCurrent(1);
    } else if (e.key === "End") {
      e.preventDefault();
      setCurrent(slideCount);
    }
  }

  async function toggleFullscreen() {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await containerRef.current.requestFullscreen();
    }
  }

  // Warm the next slide in the background so clicking through feels instant.
  useEffect(() => {
    if (current >= slideCount) return;
    const img = new window.Image();
    img.src = `${basePath}/${String(current + 1).padStart(2, "0")}.webp`;
  }, [current, slideCount, basePath]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label={title}
      className={cn(
        "group relative w-full rounded-md border border-border bg-black overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isFullscreen && "flex items-center justify-center rounded-none border-0"
      )}
    >
      <div className={cn("relative aspect-video w-full", isFullscreen && "max-h-screen")}>
        <Image
          key={current}
          src={`${basePath}/${pad(current)}.webp`}
          alt={`${title} - slide ${current}`}
          fill
          // The first slide is worth loading eagerly; the rest are fetched
          // as the visitor reaches them.
          priority={current === 1}
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-contain"
        />

      </div>

      {/* Previous / next, hidden until hover or keyboard focus */}
      <button
        type="button"
        onClick={() => go(-1)}
        disabled={current === 1}
        aria-label={labels.previous}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 focus-visible:opacity-100 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        disabled={current === slideCount}
        aria-label={labels.next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 focus-visible:opacity-100 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
      >
        <ChevronRightIcon className="size-5" />
      </button>

      {/* Counter and fullscreen */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <span className="rounded bg-black/60 px-2 py-1 text-xs font-medium text-white tabular-nums">
          {current} {labels.of} {slideCount}
        </span>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={labels.fullscreen}
          className="rounded bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
        >
          {isFullscreen ? (
            <MinimizeIcon className="size-3.5" />
          ) : (
            <MaximizeIcon className="size-3.5" />
          )}
        </button>
      </div>

      {/* Scrub bar: thin, unobtrusive, shows position at a glance */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20">
        <div
          className="h-full bg-white/80 transition-all duration-200"
          style={{ width: `${(current / slideCount) * 100}%` }}
        />
      </div>
    </div>
  );
}
