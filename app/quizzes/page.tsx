import type { Metadata } from "next";
import { QuizCard } from "@/components/content-cards";
import { PageHero } from "@/components/page-hero";
import { StaggerReveal } from "@/components/motion/reveal";
import { quizzes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quizzes",
  description: "Test your computer science knowledge with focused quizzes.",
};

export default function QuizzesPage() {
  return (
    <>
      <PageHero
        eyebrow="Practice quizzes"
        title="Turn knowledge into confidence"
        description="Challenge yourself with topic-based questions and find the areas that need more practice."
      />
      <section className="container-page py-16">
        <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => <QuizCard key={quiz.title} quiz={quiz} />)}
        </StaggerReveal>
      </section>
    </>
  );
}
