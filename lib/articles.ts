const articleLoaders = {
  "time-and-space-complexity": () =>
    import("@/content/blog/time-and-space-complexity.mdx"),
};

export type ArticleSlug = keyof typeof articleLoaders;

export function hasArticle(slug: string): slug is ArticleSlug {
  return slug in articleLoaders;
}

export async function loadArticle(slug: ArticleSlug) {
  return articleLoaders[slug]();
}
