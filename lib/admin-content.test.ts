import { afterEach, describe, expect, it, vi } from "vitest";

const now = new Date("2026-10-01T00:00:00Z");

vi.mock("@/lib/prisma", () => ({
  getPrisma: () => ({
    dynamicArticle: {
      findMany: async () => [
        {
          id: "a1",
          title: "Admin article",
          slug: "admin-article",
          category: "DBMS",
          excerpt: "Excerpt",
          readTime: "5 min read",
          color: "",
          content: "## Body",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    dynamicVideo: { findMany: async () => [] },
    // A table waiting for a migration, as when DynamicQuiz.items was added.
    dynamicQuiz: {
      findMany: async () => {
        throw new Error("ColumnNotFound");
      },
    },
    dynamicPyqPaper: { findMany: async () => [] },
  }),
}));

describe("getAdminContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the readable tables when one table fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { getAdminContent } = await import("@/lib/dynamic-content");
    const content = await getAdminContent();

    expect(content.articles.map((article) => article.title)).toEqual(["Admin article"]);
    expect(content.quizzes).toEqual([]);
    expect(content.unavailable).toEqual(["quiz"]);
  });
});
