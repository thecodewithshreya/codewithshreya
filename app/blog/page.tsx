import type { Metadata } from "next";
import { ArticleCard } from "@/components/content-cards";
import { T } from "@/components/i18n-provider";
import { PageHero } from "@/components/page-hero";
import { StaggerReveal } from "@/components/motion/reveal";
import { articles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Computer science articles, tutorials, and study guides.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow={<T k="blog.eyebrow" />}
        title={<T k="blog.title" />}
        description={<T k="blog.description" />}
      />
      <section className="container-page py-16">
        <div className="flex flex-wrap gap-2">
          {["blog.filter.all", "DSA", "Core CS", "Programming", "Career"].map((filter, index) => (
            <span
              key={filter}
              className={`rounded-full px-4 py-2 text-sm ${
                index === 0 ? "bg-indigo-600 text-white" : "border border-line text-gray-400"
              }`}
            >
              {filter.includes(".") ? <T k={filter} /> : filter}
            </span>
          ))}
          <span className="self-center px-2 text-xs text-gray-500"><T k="common.moreFiltersComingSoon" /></span>
        </div>
        <StaggerReveal className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => <ArticleCard key={article.title} article={article} />)}
        </StaggerReveal>
      </section>
    </>
  );
}
