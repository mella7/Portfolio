import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { SlideViewer } from "@/components/slide-viewer";
import { getResume } from "@/data";
import { locales, type Locale } from "@/i18n/config";
import { getUI } from "@/i18n/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, DownloadIcon, FileTextIcon, PlayIcon } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export const dynamicParams = false;

export function generateStaticParams() {
  // One page per talk, per locale.
  return locales.flatMap((locale) =>
    getResume(locale).talks.map((talk) => ({ locale, slug: talk.slug }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Metadata {
  const talk = getResume(params.locale).talks.find(
    (item) => item.slug === params.slug
  );
  if (!talk) return {};
  return {
    title: `${talk.talkTitle} | ${talk.event}`,
    description: talk.abstract ?? talk.description,
  };
}

export default function TalkPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const data = getResume(params.locale);
  const t = getUI(params.locale);
  const talk = data.talks.find((item) => item.slug === params.slug);

  if (!talk) notFound();

  // Self-hosted decks download; external ones (Speaker Deck) open in place.
  const isLocalPdf = talk.slidesUrl?.startsWith("/");

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Link
          href={`/${params.locale}/talks`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" />
          {t.talks.back}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{talk.event}</span>
          <span aria-hidden>·</span>
          <span>{talk.location}</span>
          <span aria-hidden>·</span>
          <span>{talk.date}</span>
          {talk.upcoming && (
            <Badge variant="secondary">{t.talks.upcoming}</Badge>
          )}
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {talk.talkTitle}
        </h1>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        {/* A blank line ("\n\n") in the abstract starts a new paragraph. */}
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          {(talk.abstract ?? talk.description).split(/\n\s*\n/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </BlurFade>

      {/* Actions */}
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {talk.slidesUrl && (
            <Link
              href={talk.slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              {isLocalPdf ? (
                <DownloadIcon className="size-3.5" />
              ) : (
                <FileTextIcon className="size-3.5" />
              )}
              {t.talks.slides}
            </Link>
          )}
          {talk.videoUrl && (
            <Link
              href={talk.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              <PlayIcon className="size-3.5" />
              {t.talks.recording}
            </Link>
          )}
          {talk.href && (
            <Link
              href={talk.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              {talk.event} ↗
            </Link>
          )}
        </div>
      </BlurFade>

      {/* Slide deck, live */}
      {talk.slidesDir && talk.slideCount ? (
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <section>
            <h2 className="text-lg font-semibold tracking-tight mb-3">
              {t.talks.slides}
            </h2>
            <SlideViewer
              slideCount={talk.slideCount}
              basePath={talk.slidesDir}
              title={talk.talkTitle}
              labels={{
                of: t.talks.of,
                previous: t.talks.previous,
                next: t.talks.next,
                fullscreen: t.talks.fullscreen,
              }}
            />
            {talk.slidesUrl && (
              <p className="mt-2 text-xs text-muted-foreground">
                <Link
                  href={talk.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {t.talks.downloadDeck}
                </Link>
              </p>
            )}
          </section>
        </BlurFade>
      ) : (
        talk.slidesEmbed && (
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <section>
              <h2 className="text-lg font-semibold tracking-tight mb-3">
                {t.talks.slides}
              </h2>
              <div className="relative w-full overflow-hidden rounded-md border border-border aspect-video">
                <iframe
                  src={talk.slidesEmbed}
                  title={`${talk.talkTitle} slides`}
                  loading="lazy"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </section>
          </BlurFade>
        )
      )}

      {/* Venue */}
      {talk.venue && (
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <section>
            <h2 className="text-lg font-semibold tracking-tight mb-3">
              {t.talks.venue}
            </h2>
            <p className="text-sm font-medium">{talk.venue.name}</p>
            {talk.venue.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {talk.venue.description}
              </p>
            )}
            <div className="mt-3 h-56 w-full overflow-hidden rounded-md border border-border">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  talk.venue.address
                )}&output=embed`}
                title={talk.venue.name}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </section>
        </BlurFade>
      )}
    </main>
  );
}
