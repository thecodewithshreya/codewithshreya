import type { QuizQuestion } from "@/lib/quiz-format";
import { staticQuizzes } from "@/lib/quizzes";

export type DailyQuestion = QuizQuestion & {
  quizSlug: string;
  quizTitle: string;
  // The day this question belongs to, as YYYY-MM-DD in India time.
  date: string;
};

const pool = staticQuizzes.flatMap((quiz) =>
  quiz.items.map((item) => ({ ...item, quizSlug: quiz.slug, quizTitle: quiz.title })),
);

// Most readers are in India, so the question changes at midnight IST.
export function indiaDate(now: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}

// Same question for everyone on a given day. Stepping by a prime that does not
// divide the pool size walks every question before any repeats, mixing subjects.
export function getDailyQuestion(now = new Date()): DailyQuestion | null {
  if (pool.length === 0) return null;

  const date = indiaDate(now);
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  const step = [37, 41, 43, 47].find((prime) => pool.length % prime !== 0) ?? 1;
  const index = (((day * step) % pool.length) + pool.length) % pool.length;

  return { ...pool[index], date };
}

export const dailyQuestionPoolSize = pool.length;
