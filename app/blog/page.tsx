import type { Metadata } from "next";
import { BlogFilterList } from "@/components/blog-filter-list";
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
          <p className="eyebrow">The CodeWithShreya blog</p>
          <h1 className="mt-2 text-3xl font-black text-white">Clear explanations</h1>
        </div>
        <BlogFilterList articles={articles} />
      </section>
    </>
  );
}
