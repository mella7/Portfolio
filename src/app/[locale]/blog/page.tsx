import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/lib/blog";
import type { Locale } from "@/i18n/config";
import { getUI } from "@/i18n/ui";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const t = getUI(params.locale);
  return { title: t.blog.title, description: t.blog.blurb };
}

export default function BlogPage({ params }: { params: { locale: Locale } }) {
  const t = getUI(params.locale);
  // Show posts written for this locale; posts with no `lang` show everywhere.
  const posts = getBlogPosts().filter(
    (post) => !post.metadata.lang || post.metadata.lang === params.locale
  );

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          {t.blog.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.blog.blurb}</p>
      </BlurFade>

      {posts.length === 0 && (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-muted-foreground">{t.blog.empty}</p>
        </BlurFade>
      )}

      <div className="flex flex-col">
        {posts.map((post, id) => (
          <BlurFade key={post.slug} delay={BLUR_FADE_DELAY * 2 + id * 0.05}>
            <Link
              className="flex flex-col space-y-1 mb-6 group"
              href={post.metadata.externalUrl ?? `/${params.locale}/blog/${post.slug}`}
              target={post.metadata.externalUrl ? "_blank" : undefined}
              rel={post.metadata.externalUrl ? "noopener noreferrer" : undefined}
            >
              <p className="inline-flex items-center gap-1.5 tracking-tight font-medium group-hover:underline underline-offset-4">
                {post.metadata.title}
                {post.metadata.externalUrl && (
                  <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
                )}
              </p>
              <p className="text-sm text-muted-foreground">{post.metadata.summary}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(post.metadata.publishedAt)}</span>
                <span aria-hidden>·</span>
                <span>
                  {post.readingTime} {t.blog.readingTime}
                </span>
                {post.metadata.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>
    </main>
  );
}
