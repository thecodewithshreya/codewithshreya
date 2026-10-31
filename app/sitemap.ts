import type { MetadataRoute } from "next";
import { articles } from "@/lib/data";
import { getDynamicSitemapEntries } from "@/lib/dynamic-content";
import { staticQuizzes } from "@/lib/quizzes";

const baseUrl = "https://codewithshreya.com";

// Regenerate hourly so articles and quizzes added from the admin page are picked up.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const dynamicEntries = await getDynamicSitemapEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compiler`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quizzes`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pyq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter((article) => article.slug)
    .map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const quizRoutes: MetadataRoute.Sitemap = staticQuizzes.map((quiz) => ({
    url: `${baseUrl}/quizzes/${quiz.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const dynamicArticleRoutes: MetadataRoute.Sitemap = dynamicEntries.articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const dynamicQuizRoutes: MetadataRoute.Sitemap = dynamicEntries.quizzes.map((quiz) => ({
    url: `${baseUrl}/quizzes/${quiz.slug}`,
    lastModified: quiz.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...dynamicArticleRoutes,
    ...quizRoutes,
    ...dynamicQuizRoutes,
  ];
}
