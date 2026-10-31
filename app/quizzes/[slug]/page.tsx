import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz-player";
import { getQuizBySlug } from "@/lib/dynamic-content";
import { staticQuizzes } from "@/lib/quizzes";
import { TitleText } from "@/components/title-text";
import { plainTitle } from "@/lib/title";

type QuizPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return staticQuizzes.map((quiz) => ({ slug: quiz.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    return {};
  }

  const title = `${plainTitle(quiz.title)} Quiz`;
  const description = `Practice ${quiz.questions} ${quiz.level.toLowerCase()} questions on ${quiz.topic} with instant answers and explanations.`;
  const url = `/quizzes/${quiz.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: "CodeWithShreya" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  return (
    <section className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-indigo-300"
        >
          <ArrowLeft size={16} />
          Back to all quizzes
        </Link>

        <header className="mt-8 mb-8">
          <p className="eyebrow">
            {quiz.level} · {quiz.topic}
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl"><TitleText title={quiz.title} /></h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <FileQuestion size={15} />
            {quiz.items.length} questions
          </p>
        </header>

        {quiz.items.length > 0 ? (
          <QuizPlayer slug={quiz.slug} items={quiz.items} />
        ) : (
          <div className="card p-6 text-gray-400">Questions for this quiz are coming soon.</div>
        )}
      </div>
    </section>
  );
}
