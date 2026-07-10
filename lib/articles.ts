const articleLoaders = {
  "time-and-space-complexity": () =>
    import("@/content/blog/time-and-space-complexity.mdx"),
  "sql-joins-without-confusion": () =>
    import("@/content/blog/sql-joins-without-confusion.mdx"),
  "dotnet-localization-globalization": () =>
    import("@/content/blog/dotnet-localization-globalization.mdx"),
  "debug-api-502-after-deployment": () =>
    import("@/content/blog/debug-api-502-after-deployment.mdx"),
  "what-happens-when-you-enter-a-url": () =>
    import("@/content/blog/what-happens-when-you-enter-a-url.mdx"),
};

export type ArticleSlug = keyof typeof articleLoaders;

export function hasArticle(slug: string): slug is ArticleSlug {
  return slug in articleLoaders;
}

export async function loadArticle(slug: ArticleSlug) {
  return articleLoaders[slug]();
}
