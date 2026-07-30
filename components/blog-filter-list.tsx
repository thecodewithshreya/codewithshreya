"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/content-cards";
import { StaggerReveal } from "@/components/motion/reveal";

type Article = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  color: string;
  slug: string | null;
};

const filters = ["All articles", "DSA", "Core CS", "DBMS", "Programming", ".NET", "Career"] as const;
type BlogFilter = (typeof filters)[number];

export function BlogFilterList({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState<BlogFilter>("All articles");

  const filteredArticles = useMemo(
    () => articles.filter((article) => articleMatchesFilter(article, activeFilter)),
    [activeFilter, articles],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeFilter === filter
                ? "bg-indigo-600 text-white"
                : "border border-line text-gray-400 hover:border-indigo-500/60 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <StaggerReveal className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.title} article={article} />
        ))}
      </StaggerReveal>
    </>
  );
}

function articleMatchesFilter(article: Article, filter: BlogFilter): boolean {
  if (filter === "All articles") return true;
  if (filter === "DSA") return ["Data Structures", "Algorithms"].includes(article.category);
  if (filter === "Core CS") {
    return ["Operating Systems", "Computer Networks"].includes(article.category);
  }
  if (filter === ".NET") {
    return article.category === "DotNet";
  }
  if (filter === "Programming") {
    return article.category === "Programming" && !articleMatchesFilter(article, ".NET");
  }

  return article.category === filter;
}
