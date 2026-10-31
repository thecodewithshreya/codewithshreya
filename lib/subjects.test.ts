import { describe, expect, it } from "vitest";
import { articles, videos } from "@/lib/data";
import { getStaticQuiz } from "@/lib/quizzes";
import { contentForSubject, getSubject, subjects, subjectsForTrack } from "@/lib/subjects";

describe("subjects", () => {
  it("have unique slugs and at least one track", () => {
    expect(new Set(subjects.map((subject) => subject.slug)).size).toBe(subjects.length);
    for (const subject of subjects) expect(subject.tracks.length, subject.slug).toBeGreaterThan(0);
  });

  it("only name quizzes that exist", () => {
    for (const subject of subjects) {
      for (const slug of subject.quizSlugs) expect(getStaticQuiz(slug), `${subject.slug}: ${slug}`).toBeTruthy();
    }
  });

  it("give every published article and every video a subject page", () => {
    const covered = (predicate: (subject: (typeof subjects)[number]) => boolean) => subjects.some(predicate);

    for (const article of articles.filter((item) => item.slug)) {
      expect(covered((subject) => subject.articleCategories.includes(article.category)), article.title).toBe(true);
    }
    for (const video of videos) {
      const key = "subject" in video && video.subject ? video.subject : video.topic;
      expect(covered((subject) => subject.videoSubjects.includes(key)), video.title).toBe(true);
    }
  });

  it("filters content for a subject and skips placeholders", () => {
    const dbms = getSubject("dbms")!;
    const content = contentForSubject(dbms, {
      articles: [
        { slug: "joins", category: "DBMS", title: "Joins", excerpt: "", date: "", color: "" },
        { slug: null, category: "DBMS", title: "Planned", excerpt: "", date: "", color: "" },
        { slug: "tcp", category: "Computer Networks", title: "TCP", excerpt: "", date: "", color: "" },
      ],
      videos: [
        { title: "SQL", topic: "DBMS", duration: "", color: "" },
        { title: "Lecture", topic: "Core CS", subject: "DBMS", duration: "", color: "" },
        { title: "OS", topic: "Core CS", subject: "Operating Systems", duration: "", color: "" },
      ],
      quizzes: [
        { slug: "dbms-essentials", title: "DBMS", topic: "", questions: 10, level: "" },
        { slug: "graph-algorithms", title: "Graphs", topic: "", questions: 10, level: "" },
      ],
    });

    expect(content.articles.map((item) => item.title)).toEqual(["Joins"]);
    expect(content.videos.map((item) => item.title)).toEqual(["SQL", "Lecture"]);
    expect(content.quizzes.map((item) => item.title)).toEqual(["DBMS"]);
  });

  it("put core CS in both tracks", () => {
    const both = subjectsForTrack("gate").filter((subject) => subject.tracks.includes("jobs"));
    expect(both.map((subject) => subject.slug)).toEqual([
      "data-structures-and-algorithms",
      "dbms",
      "operating-systems",
      "computer-networks",
    ]);
  });
});
