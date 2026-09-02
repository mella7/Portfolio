import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResume } from "@/data";
import type { Locale } from "@/i18n/config";
import { getUI } from "@/i18n/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { FileTextIcon, PlayIcon } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const t = getUI(params.locale);
  return { title: t.talks.title, description: t.talks.blurb };
}

export default function TalksPage({ params }: { params: { locale: Locale } }) {
  const data = getResume(params.locale);
  const t = getUI(params.locale);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          {t.talks.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.talks.blurb}</p>
      </BlurFade>

      <div className="flex flex-col gap-6">
        {data.talks.map((talk, id) => (
          <BlurFade key={talk.talkTitle} delay={BLUR_FADE_DELAY * 2 + id * 0.05}>
            <Card className="border hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm font-medium text-muted-foreground">
                    {talk.event} · {talk.location} · {talk.date}
                  </p>
                  {talk.upcoming && <Badge variant="secondary">{t.talks.upcoming}</Badge>}
                </div>
                <CardTitle className="text-lg leading-snug">
                  <Link
                    href={`/${params.locale}/talks/${talk.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    &ldquo;{talk.talkTitle}&rdquo;
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>{talk.description}</p>
                {/* Inline slide deck, when one is embedded. 16:9 box so it
                    scales cleanly on mobile. */}
                {talk.slidesEmbed && (
                  <div className="relative w-full overflow-hidden rounded-md border border-border aspect-video">
                    <iframe
                      src={talk.slidesEmbed}
                      title={`${talk.talkTitle} - slides`}
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    href={`/${params.locale}/talks/${talk.slug}`}
                    className="inline-flex items-center gap-1.5 font-medium text-foreground underline underline-offset-4"
                  >
                    {t.talks.details}
                  </Link>
                  {talk.slidesUrl && (
                    <Link
                      href={talk.slidesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-foreground underline underline-offset-4"
                    >
                      <FileTextIcon className="size-3.5" />
                      {t.talks.slides}
                    </Link>
                  )}
                  {talk.videoUrl && (
                    <Link
                      href={talk.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-foreground underline underline-offset-4"
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
                      className="inline-block text-foreground underline underline-offset-4"
                    >
                      {talk.event} ↗
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </main>
  );
}
