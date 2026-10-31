import type { Metadata } from "next";
import { QuizCard } from "@/components/content-cards";
import { StaggerReveal } from "@/components/motion/reveal";
import { getAllQuizzes } from "@/lib/dynamic-content";

export const metadata: Metadata = {
  title: "Quizzes",
  description: "Test your computer science knowledge with focused quizzes.",
};

export const dynamic = "force-dynamic";

export default async function QuizzesPage() {
  const quizzes = await getAllQuizzes();
  const totalQuestions = quizzes.reduce((total, quiz) => total + quiz.questions, 0);

  return (
    <>
      <section className="container-page py-10">
        <div className="mb-8">
          <p className="eyebrow">Practice quizzes</p>
          <h1 className="mt-2 text-3xl font-black text-white">Topic-based quizzes</h1>
        </div>
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            [String(totalQuestions), "Practice questions"],
            [String(quizzes.length), "Quizzes"],
            [String(new Set(quizzes.map((quiz) => quiz.level)).size), "Difficulty levels"],
          ].map(([value, label]) => (
            <div key={label} className="card p-5">
              <div className="text-3xl font-black text-white">{value}</div>
              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
        <h2 className="sr-only">All quizzes</h2>
        <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => <QuizCard key={quiz.slug ?? quiz.title} quiz={quiz} />)}
        </StaggerReveal>
      </section>
    </>
  );
}
