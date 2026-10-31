import { describe, expect, it, vi } from "vitest";
import { searchSite } from "@/lib/search";

vi.mock("@/lib/dynamic-content", () => {
  const article = (title: string, category: string, excerpt: string, slug: string | null) => ({
    title,
    category,
    excerpt,
    slug,
    date: "5 min read",
    color: "",
  });

  return {
    getAllArticles: async () => [
      article("Normalization basics", "DBMS", "Why SQL tables get split.", "normalization"),
      article("SQL joins without confusion", "DBMS", "Inner and outer joins.", "sql-joins"),
      article("SQL coming soon", "DBMS", "Not written yet.", null),
      article("C# basics", "DotNet", "Types and classes.", "csharp-basics"),
    ],
    getAllVideos: async () => [
      { title: "Joins visually", topic: "DBMS", duration: "10:00", color: "", description: "SQL joins on one dataset." },
    ],
    getAllQuizzes: async () => [
      { slug: "dbms", title: "DBMS Essentials", topic: "SQL / Normalization", questions: 10, level: "Intermediate" },
      { slug: "empty", title: "SQL drafts", topic: "SQL", questions: 0, level: "Beginner" },
    ],
    getAllPyqPapers: async () => [
      { title: "GATE CSE 2024 - Set 1", source: "GATE CSE", questions: "Question paper", year: "2024", fileId: "a" },
      { title: "GATE CSE 2023", source: "GATE CSE", questions: "Question paper", year: "2023", fileId: "b" },
    ],
  };
});

describe("searchSite", () => {
  it("returns nothing for empty or too-short queries", async () => {
    for (const query of ["", " ", "a"]) {
      const results = await searchSite(query);
      expect(Object.values(results).flat()).toEqual([]);
    }
  });

  it("ranks title matches above excerpt matches", async () => {
    const { articles } = await searchSite("sql");
    expect(articles.map((article) => article.slug)).toEqual(["sql-joins", "normalization"]);
  });

  it("requires every term to match", async () => {
    const { pyqs } = await searchSite("gate 2024");
    expect(pyqs.map((paper) => paper.fileId)).toEqual(["a"]);
  });

  it("is case-insensitive and searches every content type", async () => {
    const results = await searchSite("JOINS");

    expect(results.articles.map((article) => article.slug)).toEqual(["sql-joins"]);
    expect(results.videos.map((video) => video.title)).toEqual(["Joins visually"]);
  });

  it("skips coming-soon articles and quizzes without questions", async () => {
    const { articles, quizzes } = await searchSite("sql");

    expect(articles.some((article) => article.slug === null)).toBe(false);
    expect(quizzes.map((quiz) => quiz.slug)).toEqual(["dbms"]);
  });

  it("matches .NET articles by C# and dotnet", async () => {
    expect((await searchSite("c#")).articles.map((article) => article.slug)).toEqual(["csharp-basics"]);
    expect((await searchSite("dotnet")).articles.map((article) => article.slug)).toEqual(["csharp-basics"]);
  });
});
