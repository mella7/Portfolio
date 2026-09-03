import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getResume } from "@/data";
import type { Locale } from "@/i18n/config";
import { getUI } from "@/i18n/ui";
import type { Metadata } from "next";
import Image from "next/image";

const BLUR_FADE_DELAY = 0.04;

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const t = getUI(params.locale);
  return { title: t.certs.title, description: t.certs.blurb };
}

export default function CertificationsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const data = getResume(params.locale);
  const t = getUI(params.locale);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          {t.certs.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.certs.blurb}</p>
      </BlurFade>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.certifications.map((cert, id) => (
          <BlurFade key={cert.name} delay={BLUR_FADE_DELAY * 2 + id * 0.05}>
            <Card className="h-full border hover:shadow-lg transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-4">
                <Image
                  src={cert.logo}
                  alt={cert.name}
                  width={56}
                  height={56}
                  className={`rounded shrink-0 ${cert.inProgress ? "opacity-50" : ""}`}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-snug">{cert.name}</p>
                  {cert.inProgress && (
                    <Badge variant="outline" className="text-xs">
                      {t.certs.inProgress}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <p className="text-sm text-muted-foreground italic">
          {data.certificationsFootnote}
        </p>
      </BlurFade>
    </main>
  );
}
