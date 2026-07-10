import type { Metadata } from "next";
import { ArticleCard } from "@/components/content-cards";
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
        eyebrow="The CodeWithShreya blog"
        title="Clear explanations for curious developers"
        description="Explore practical tutorials, core CS concepts, interview preparation, and learning strategies."
      />
      <section className="container-page py-16">
        <div className="flex flex-wrap gap-2">
          {["All articles", "DSA", "Core CS", "Programming", "Career"].map((filter, index) => (
            <span
              key={filter}
              className={`rounded-full px-4 py-2 text-sm ${
                index === 0 ? "bg-indigo-600 text-white" : "border border-line text-gray-400"
              }`}
            >
              {filter}
            </span>
          ))}
          <span className="self-center px-2 text-xs text-gray-500">More filters coming soon</span>
        </div>
        <StaggerReveal className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => <ArticleCard key={article.title} article={article} />)}
        </StaggerReveal>
      </section>
    </>
  );
}
