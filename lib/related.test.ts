import { describe, expect, it } from "vitest";
import { getRelatedArticles, getRelatedQuizSlug } from "@/lib/related";
import { getStaticQuiz } from "@/lib/quizzes";

const article = (slug: string | null, category: string) => ({
  slug,
  category,
  title: `Title ${slug}`,
  excerpt: "",
  date: "5 min read",
  color: "",
});

describe("getRelatedArticles", () => {
  const all = [
    article("a", "DBMS"),
    article("b", "Computer Networks"),
    article(null, "DBMS"),
    article("c", "DBMS"),
    article("d", "Career"),
    article("e", "Algorithms"),
  ];

  it("puts the same category first and skips the current article and placeholders", () => {
    expect(getRelatedArticles(all, { slug: "a", category: "DBMS" }).map((item) => item.slug)).toEqual([
      "c",
      "b",
      "d",
    ]);
  });

  it("respects the limit", () => {
    expect(getRelatedArticles(all, { slug: "b", category: "Computer Networks" }, 2)).toHaveLength(2);
  });

  it("drops a duplicate slug, keeping the first (dynamic) entry", () => {
    const withDuplicate = [article("c", "DBMS"), ...all];
    const slugs = getRelatedArticles(withDuplicate, { slug: "a", category: "DBMS" }, 10).map((item) => item.slug);
    expect(slugs.filter((slug) => slug === "c")).toHaveLength(1);
  });
});

describe("getRelatedQuizSlug", () => {
  it("maps every known category to a quiz that exists", () => {
    for (const category of ["Data Structures", "Algorithms", "Operating Systems", "DBMS", "Computer Networks", "DotNet"]) {
      const slug = getRelatedQuizSlug(category);
      expect(slug && getStaticQuiz(slug)).toBeTruthy();
    }
  });

  it("returns null for categories without a quiz", () => {
    expect(getRelatedQuizSlug("Career")).toBeNull();
  });
});
