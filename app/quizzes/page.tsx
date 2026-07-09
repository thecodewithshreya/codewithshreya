import type { Metadata } from "next";
import { QuizCard } from "@/components/content-cards";
import { T } from "@/components/i18n-provider";
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
        eyebrow={<T k="quizzes.eyebrow" />}
        title={<T k="quizzes.title" />}
        description={<T k="quizzes.description" />}
      />
      <section className="container-page py-16">
        <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => <QuizCard key={quiz.title} quiz={quiz} />)}
        </StaggerReveal>
      </section>
    </>
  );
}
