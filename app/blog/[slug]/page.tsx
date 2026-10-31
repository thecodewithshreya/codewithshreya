import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { hasArticle, loadArticle } from "@/lib/articles";
import { articles } from "@/lib/data";
import { BlogEngagement } from "@/components/blog-engagement";
import { ReadingProgress } from "@/components/motion/reading-progress";
import { MarkReadOnFinish } from "@/components/progress-badges";
import { DynamicArticleContent } from "@/components/dynamic-article-content";
import { RelatedContent } from "@/components/related-content";
import { ArticleToc } from "@/components/article-toc";
import { extractHeadings, type ArticleHeading } from "@/lib/headings";
import { getRelatedArticles, getRelatedQuizSlug } from "@/lib/related";
import {
  getAllArticles,
  getDynamicArticleBySlug,
  type ArticleSummary,
  type DynamicArticleDetail,
} from "@/lib/dynamic-content";
import { TitleText } from "@/components/title-text";
import { categoryLabel, plainTitle } from "@/lib/title";

const siteUrl = "https://codewithshreya.com";

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
  const staticArticle = articles.find((item) => item.slug === slug);
  const dynamicArticle = staticArticle ? null : await getDynamicArticleBySlug(slug);
  const article = staticArticle ?? dynamicArticle;

  if (!article) {
    return {};
  }

  const url = `/blog/${slug}`;

  return {
    title: plainTitle(article.title),
    description: article.excerpt,
    alternates: {
      canonical: url,
      // Setting alternates here replaces the layout's, so repeat the feed link.
      types: { "application/rss+xml": [{ url: "/feed.xml", title: "CodeWithShreya articles" }] },
    },
    openGraph: {
      type: "article",
      url,
      title: plainTitle(article.title),
      description: article.excerpt,
      siteName: "CodeWithShreya",
      section: categoryLabel(article.category),
      ...(dynamicArticle
        ? {
            publishedTime: dynamicArticle.createdAt.toISOString(),
            modifiedTime: dynamicArticle.updatedAt.toISOString(),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: plainTitle(article.title),
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (article && hasArticle(slug)) {
    const { default: ArticleContent } = await loadArticle(slug);

    return (
      <ArticleLayout
        article={article}
        slug={slug}
        related={getRelatedArticles(await getAllArticles(), { slug, category: article.category })}
        headings={await getStaticHeadings(slug)}
      >
        <ArticleContent />
      </ArticleLayout>
    );
  }

  const dynamicArticle = await getDynamicArticleBySlug(slug);

  if (!dynamicArticle) {
    notFound();
  }

  return (
    <ArticleLayout
      article={dynamicArticle}
      slug={slug}
      related={getRelatedArticles(await getAllArticles(), { slug, category: dynamicArticle.category })}
      headings={extractHeadings(dynamicArticle.content, { includeH1: true })}
    >
      <DynamicArticleContent content={dynamicArticle.content} />
    </ArticleLayout>
  );
}

// The MDX source is read only for its headings; next.config.ts includes
// content/blog in this route's server bundle.
async function getStaticHeadings(slug: string): Promise<ArticleHeading[]> {
  try {
    return extractHeadings(await readFile(join(process.cwd(), "content", "blog", `${slug}.mdx`), "utf8"));
  } catch (error) {
    console.error("Article headings unavailable", error);
    return [];
  }
}

function ArticleLayout({
  article,
  slug,
  related,
  headings,
  children,
}: {
  article: ArticleSummary | DynamicArticleDetail;
  slug: string;
  related: ArticleSummary[];
  headings: ArticleHeading[];
  children: ReactNode;
}) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: plainTitle(article.title),
    description: article.excerpt,
    articleSection: categoryLabel(article.category),
    url: `${siteUrl}/blog/${slug}`,
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
    author: { "@type": "Organization", name: "CodeWithShreya", url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: "CodeWithShreya",
      logo: { "@type": "ImageObject", url: `${siteUrl}/codewithshreya-logo-final.png` },
    },
    ...("createdAt" in article
      ? {
          datePublished: article.createdAt.toISOString(),
          dateModified: article.updatedAt.toISOString(),
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <ReadingProgress />
      <article className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-violet-300"
        >
          <ArrowLeft size={16} />
          Back to all articles
        </Link>

        <header className="mt-10 border-b border-line pb-8">
          <p className="eyebrow">{categoryLabel(article.category)}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            <TitleText title={article.title} />
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-400">{article.excerpt}</p>
          <p className="mt-5 flex items-center gap-2 text-sm text-gray-500">
            <Clock size={15} />
            {article.date}
          </p>
        </header>

        <ArticleToc headings={headings} />

        <BlogEngagement slug={slug} title={plainTitle(article.title)}>
          <div className="article-content mt-10">
            {children}
          </div>
          <MarkReadOnFinish slug={slug} />
        </BlogEngagement>

        <RelatedContent articles={related} quizSlug={getRelatedQuizSlug(article.category)} />
        </div>
      </article>
    </>
  );
}
