import { describe, expect, it } from "vitest";
import { formatQuizText, normalizeQuizItems, parseQuizText, quizTextExample } from "@/lib/quiz-format";
import { staticQuizzes } from "@/lib/quizzes";

describe("parseQuizText", () => {
  it("parses questions, options, answer, explanation and source", () => {
    const [first] = parseQuizText(quizTextExample.replace("Q: Next question...", ""));

    expect(first).toEqual({
      question: "Which data structure follows LIFO order?",
      options: ["Queue", "Stack", "Linked list", "Heap"],
      answer: 1,
      explanation: "The last element pushed is the first one popped.",
      source: "GATE CSE 2019",
    });
  });

  it("splits questions on blank lines and handles Windows line endings", () => {
    const questions = parseQuizText("Q: One?\r\n- a\r\n* b\r\n\r\n\r\nQ: Two?\r\n* c\r\n- d");

    expect(questions.map((item) => [item.question, item.answer])).toEqual([
      ["One?", 1],
      ["Two?", 0],
    ]);
  });

  it("joins multi-line questions and explanations", () => {
    const [item] = parseQuizText("Q: First line\nsecond line?\n- a\n* b\n> Because\nit is.");

    expect(item.question).toBe("First line second line?");
    expect(item.explanation).toBe("Because it is.");
  });

  it.each([
    ["Q: x\n- a\n- b", 'Question 1 needs one correct option marked with "* ".'],
    ["Q: x\n* a\n* b", "Question 1 has more than one correct option (*)."],
    ["- a\n* b", 'Question 1 is missing its "Q:" line.'],
    ["Q: x\n* a", "Question 1 needs at least two options."],
    ["Q: x\n- a\n* b\nstray text", 'Question 1: options must start with "- " or "* ".'],
    ["Q: ok\n- a\n* b\n\nQ: x\n- a", 'Question 2 needs at least two options.'],
  ])("rejects %j", (text, message) => {
    expect(() => parseQuizText(text)).toThrow(message);
  });

  it("rejects quizzes with too many questions", () => {
    const text = Array.from({ length: 101 }, (_, index) => `Q: ${index}\n- a\n* b`).join("\n\n");
    expect(() => parseQuizText(text)).toThrow("at most 100 questions");
  });
});

describe("formatQuizText", () => {
  it("round-trips through parseQuizText", () => {
    const questions = staticQuizzes.flatMap((quiz) => quiz.items);
    expect(parseQuizText(formatQuizText(questions))).toEqual(questions);
  });
});

describe("normalizeQuizItems", () => {
  it("keeps valid items and drops malformed ones", () => {
    const valid = { question: "Q", options: ["a", "b"], answer: 1 };

    expect(
      normalizeQuizItems([
        valid,
        { ...valid, answer: 2 },
        { ...valid, answer: -1 },
        { ...valid, options: ["a", 3] },
        { options: ["a", "b"], answer: 0 },
        null,
        "text",
        { ...valid, explanation: "", source: "GATE" },
      ]),
    ).toEqual([valid, { ...valid, source: "GATE" }]);
  });

  it("returns an empty list for non-array input", () => {
    expect(normalizeQuizItems({})).toEqual([]);
    expect(normalizeQuizItems(null)).toEqual([]);
  });
});

describe("static quizzes", () => {
  it("have unique slugs and valid questions", () => {
    const slugs = staticQuizzes.map((quiz) => quiz.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const quiz of staticQuizzes) {
      expect(quiz.items.length).toBeGreaterThan(0);
      expect(normalizeQuizItems(quiz.items)).toEqual(quiz.items);
    }
  });
});
