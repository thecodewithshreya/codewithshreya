import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { BlogFilterList } from "@/components/blog-filter-list";
import { ReadCount } from "@/components/progress-badges";
import { getAllArticles } from "@/lib/dynamic-content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Computer science articles, tutorials, and study guides.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const articles = await getAllArticles();

  return (
    <>
      <section className="container-page py-10">
        <div className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">The CodeWithShreya blog</p>
              <h1 className="mt-2 text-3xl font-black text-white">Clear explanations</h1>
            </div>
            <a
              href="/feed.xml"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-violet-300"
            >
              <Rss size={15} />
              RSS feed
            </a>
          </div>
          <ReadCount
            slugs={articles.flatMap((article) => (article.slug ? [article.slug] : []))}
          />
        </div>
        <BlogFilterList articles={articles} />
      </section>
    </>
  );
}
