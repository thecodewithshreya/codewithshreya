import type { Metadata } from "next";
import { BlogFilterList } from "@/components/blog-filter-list";
import { articles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Computer science articles, tutorials, and study guides.",
};

export default function BlogPage() {
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
