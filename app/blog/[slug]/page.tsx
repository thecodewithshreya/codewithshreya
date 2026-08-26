import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { hasArticle, loadArticle } from "@/lib/articles";
import { articles } from "@/lib/data";
import { BlogEngagement } from "@/components/blog-engagement";
import { ReadingProgress } from "@/components/motion/reading-progress";
import { DynamicArticleContent } from "@/components/dynamic-article-content";
import { getDynamicArticleBySlug, type ArticleSummary } from "@/lib/dynamic-content";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles
    .filter((article) => article.slug)
    .map((article) => ({ slug: article.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article =
    articles.find((item) => item.slug === slug) ??
    (await getDynamicArticleBySlug(slug));

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (article && hasArticle(slug)) {
    const { default: ArticleContent } = await loadArticle(slug);

    return (
      <ArticleLayout article={article} slug={slug}>
        <ArticleContent />
      </ArticleLayout>
    );
  }

  const dynamicArticle = await getDynamicArticleBySlug(slug);

  if (!dynamicArticle) {
    notFound();
  }

  return (
    <ArticleLayout article={dynamicArticle} slug={slug}>
      <DynamicArticleContent content={dynamicArticle.content} />
    </ArticleLayout>
  );
}

function ArticleLayout({
  article,
  slug,
  children,
}: {
  article: ArticleSummary;
  slug: string;
  children: ReactNode;
}) {
  return (
    <>
      <ReadingProgress />
      <article className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-indigo-300"
        >
          <ArrowLeft size={16} />
          Back to all articles
        </Link>

        <header className="mt-10 border-b border-line pb-8">
          <p className="eyebrow">{article.category}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-400">{article.excerpt}</p>
          <p className="mt-5 flex items-center gap-2 text-sm text-gray-500">
            <Clock size={15} />
            {article.date}
          </p>
        </header>

        <BlogEngagement slug={slug} title={article.title}>
          <div className="article-content mt-10">
            {children}
          </div>
        </BlogEngagement>
        </div>
      </article>
    </>
  );
}
