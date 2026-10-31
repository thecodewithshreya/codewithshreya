import { describe, expect, it } from "vitest";
import { articleTone, levelDots, quizTone, videoTone } from "@/lib/palette";

describe("palette", () => {
  it("colours content by the track of its subject", () => {
    expect(articleTone("DBMS")).toBe("both");
    expect(articleTone("DotNet")).toBe("jobs");
    expect(videoTone({ topic: "Core CS", subject: "Theory of Computation" })).toBe("gate");
    expect(videoTone({ topic: "System Design" })).toBe("jobs");
    expect(quizTone("csharp-interview-basics")).toBe("jobs");
  });

  it("falls back to neutral for unknown subjects", () => {
    expect(articleTone("Unknown")).toBe("neutral");
    expect(quizTone(undefined)).toBe("neutral");
    expect(quizTone("some-admin-quiz-id")).toBe("neutral");
  });

  it("maps levels to one, two or three dots", () => {
    expect([levelDots("Beginner"), levelDots("Intermediate"), levelDots("Advanced"), levelDots(undefined)]).toEqual([
      1, 2, 3, 1,
    ]);
  });
});
