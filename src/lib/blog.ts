import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Posts live in content/blog as .md (created by Decap CMS at /admin) or .mdx.
// Frontmatter fields match public/admin/config.yml.

export type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  lang?: string;
  image?: string;
  tags?: string[];
  draft?: boolean;
  /**
   * Set this when the article actually lives somewhere else (Medium, dev.to).
   * The blog index links straight out to it and no local page is generated,
   * so the canonical version stays on the original platform.
   */
  externalUrl?: string;
};

export type Post = {
  slug: string;
  metadata: PostMetadata;
  source: string;
  /** Estimated reading time in minutes (min 1). */
  readingTime: number;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function getPostFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => [".md", ".mdx"].includes(path.extname(file)));
}

export async function markdownToHTML(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: { light: "min-light", dark: "min-dark" },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

/** ~200 words per minute, rounded up, never below 1. */
function estimateReadingTime(source: string): number {
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Slugs that have a page on this site. External posts are excluded. */
export function getAllSlugs(): string[] {
  return getBlogPosts()
    .filter((post) => !post.metadata.externalUrl)
    .map((post) => post.slug);
}

export function getBlogPosts(): Post[] {
  const posts = getPostFiles().map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug: path.basename(file, path.extname(file)),
      metadata: data as PostMetadata,
      source: content,
      readingTime: estimateReadingTime(content),
    };
  });
  return posts
    .filter((post) => {
      // Drafts are visible while developing, hidden on the live site - so you
      // can save half-finished posts in the CMS without publishing them.
      if (post.metadata.draft && process.env.NODE_ENV === "production") {
        return false;
      }
      // Scheduled posts: anything dated in the future stays hidden until then
      // (a rebuild after that date makes it appear).
      return new Date(post.metadata.publishedAt).getTime() <= Date.now();
    })
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    );
}

export async function getPost(
  slug: string
): Promise<(Post & { html: string }) | null> {
  const post = getBlogPosts().find((p) => p.slug === slug);
  if (!post) return null;
  const html = await markdownToHTML(post.source);
  return { ...post, html };
}
