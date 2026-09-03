import { getBlogPosts, getPost } from "@/lib/blog";
import type { Locale } from "@/i18n/config";
import { getUI } from "@/i18n/ui";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  // External posts live on another platform, so no page here.
  return getBlogPosts()
    .filter((post) => !post.metadata.externalUrl)
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      type: "article",
      publishedTime: post.metadata.publishedAt,
      ...(post.metadata.image ? { images: [{ url: post.metadata.image }] } : {}),
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const t = getUI(params.locale);
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-6">
      <Link
        href={`/${params.locale}/blog`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← {t.blog.back}
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tighter">{post.metadata.title}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>

      <article
        className="prose dark:prose-invert max-w-full text-pretty font-sans text-sm"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </main>
  );
}
