import type { FeedArticle } from "@/lib/dynamic-content";
import { categoryLabel, plainTitle } from "@/lib/title";

const siteUrl = "https://codewithshreya.com";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRssFeed(articles: FeedArticle[]) {
  const items = articles
    .map((article) => {
      const url = `${siteUrl}/blog/${encodeURIComponent(article.slug)}`;
      return [
        "    <item>",
        `      <title>${escapeXml(plainTitle(article.title))}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(article.excerpt)}</description>`,
        `      <category>${escapeXml(categoryLabel(article.category))}</category>`,
        article.publishedAt ? `      <pubDate>${article.publishedAt.toUTCString()}</pubDate>` : null,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CodeWithShreya</title>
    <link>${siteUrl}/blog</link>
    <description>Computer science and programming articles from CodeWithShreya.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
