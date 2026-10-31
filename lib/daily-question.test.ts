import { describe, expect, it } from "vitest";
import { dailyQuestionPoolSize, getDailyQuestion, indiaDate } from "@/lib/daily-question";

describe("getDailyQuestion", () => {
  it("uses the India date, so it changes at midnight IST", () => {
    expect(indiaDate(new Date("2026-10-31T18:29:00Z"))).toBe("2026-10-31");
    expect(indiaDate(new Date("2026-10-31T18:31:00Z"))).toBe("2026-11-01");
  });

  it("gives the same question all day and a different one the next day", () => {
    const morning = getDailyQuestion(new Date("2026-10-31T01:00:00Z"));
    const evening = getDailyQuestion(new Date("2026-10-31T17:00:00Z"));
    const tomorrow = getDailyQuestion(new Date("2026-11-01T01:00:00Z"));

    expect(morning?.question).toBe(evening?.question);
    expect(tomorrow?.question).not.toBe(morning?.question);
    expect(morning?.date).toBe("2026-10-31");
  });

  it("goes through every question before repeating", () => {
    const seen = new Set<string>();
    const start = Date.parse("2026-01-01T06:00:00Z");

    for (let day = 0; day < dailyQuestionPoolSize; day++) {
      const question = getDailyQuestion(new Date(start + day * 86_400_000))!;
      seen.add(`${question.quizSlug}:${question.question}`);
    }

    expect(seen.size).toBe(dailyQuestionPoolSize);
  });
});
