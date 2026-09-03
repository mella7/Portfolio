import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { getResume } from "@/data";
import type { Locale } from "@/i18n/config";
import { getUI } from "@/i18n/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const t = getUI(params.locale);
  return { title: t.projectsPage.title, description: t.projectsPage.blurb };
}

export default function ProjectsPage({ params }: { params: { locale: Locale } }) {
  const data = getResume(params.locale);
  const t = getUI(params.locale);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Link
          href={`/${params.locale}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" />
          {t.projectsPage.back}
        </Link>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mt-4">
          {t.projectsPage.title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">{t.projectsPage.blurb}</p>
      </BlurFade>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.projects.map((project, id) => (
          <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 2 + id * 0.05}>
            <ProjectCard
              href={project.href}
              title={project.title}
              description={project.description}
              dates={project.dates}
              tags={project.technologies}
              image={project.image}
              video={project.video}
              links={project.links}
            />
          </BlurFade>
        ))}
      </div>
    </main>
  );
}
