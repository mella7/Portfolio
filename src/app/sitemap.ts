import { locales } from "@/i18n/config";
import { getAllSlugs } from "@/lib/blog";
import type { MetadataRoute } from "next";

const SITE_URL = "https://mella7.me";
const staticPaths = ["", "/projects", "/blog", "/talks", "/certifications"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "/blog" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }

    for (const slug of getAllSlugs()) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
