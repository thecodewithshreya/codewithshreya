const articleLoaders = {
  "time-and-space-complexity": () =>
    import("@/content/blog/time-and-space-complexity.mdx"),
  "sql-joins-without-confusion": () =>
    import("@/content/blog/sql-joins-without-confusion.mdx"),
  "dotnet-localization-globalization": () =>
    import("@/content/blog/dotnet-localization-globalization.mdx"),
};

export type ArticleSlug = keyof typeof articleLoaders;

export function hasArticle(slug: string): slug is ArticleSlug {
  return slug in articleLoaders;
}

export async function loadArticle(slug: ArticleSlug) {
  return articleLoaders[slug]();
}
