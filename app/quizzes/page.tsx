import type { Metadata } from "next";
import { QuizCard } from "@/components/content-cards";
import { StaggerReveal } from "@/components/motion/reveal";
import { quizzes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quizzes",
  description: "Test your computer science knowledge with focused quizzes.",
};

export default function QuizzesPage() {
  return (
    <>
      <section className="container-page py-10">
        <div className="mb-8">
          <p className="eyebrow">Practice quizzes</p>
          <h1 className="mt-2 text-3xl font-black text-white">Topic-based quizzes</h1>
        </div>
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            ["60+", "Practice questions"],
            ["6", "Topic tracks"],
            ["3", "Difficulty levels"],
          ].map(([value, label]) => (
            <div key={label} className="card p-5">
              <div className="text-3xl font-black text-white">{value}</div>
              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
        <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => <QuizCard key={quiz.title} quiz={quiz} />)}
        </StaggerReveal>
      </section>
    </>
  );
}
