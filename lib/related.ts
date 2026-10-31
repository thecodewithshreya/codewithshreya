import type { ArticleSummary } from "@/lib/dynamic-content";

// Article category → the static quiz that practises the same subject.
const quizForCategory: Record<string, string> = {
  "Data Structures": "data-structures-fundamentals",
  Algorithms: "graph-algorithms",
  "Operating Systems": "operating-systems-basics",
  DBMS: "dbms-essentials",
  "Computer Networks": "computer-networks-basics",
  DotNet: "csharp-interview-basics",
};

export function getRelatedQuizSlug(category: string) {
  return quizForCategory[category] ?? null;
}

// Published articles from the same category first, then the rest in list order.
// Placeholders (slug: null) and the current article are left out.
export function getRelatedArticles(
  all: ArticleSummary[],
  current: { slug: string; category: string },
  limit = 3,
) {
  const candidates = all.filter(
    (article, index): article is ArticleSummary & { slug: string } =>
      Boolean(article.slug) &&
      article.slug !== current.slug &&
      all.findIndex((other) => other.slug === article.slug) === index,
  );
  const sameCategory = candidates.filter((article) => article.category === current.category);
  const others = candidates.filter((article) => article.category !== current.category);

  return [...sameCategory, ...others].slice(0, limit);
}
