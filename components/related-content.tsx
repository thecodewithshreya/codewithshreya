import Link from "next/link";
import { ArrowRight, FileQuestion } from "lucide-react";
import { ArticleCard } from "@/components/content-cards";
import type { ArticleSummary } from "@/lib/dynamic-content";
import { getStaticQuiz } from "@/lib/quizzes";
import { TitleText } from "@/components/title-text";

export function RelatedContent({
  articles,
  quizSlug,
}: {
  articles: ArticleSummary[];
  quizSlug: string | null;
}) {
  const quiz = quizSlug ? getStaticQuiz(quizSlug) : undefined;

  if (articles.length === 0 && !quiz) {
    return null;
  }

  return (
    <section aria-labelledby="keep-reading" className="mt-14 border-t border-line pt-10">
      <h2 id="keep-reading" className="text-2xl font-bold">
        Keep learning
      </h2>

      {quiz ? (
        <Link
          href={`/quizzes/${quiz.slug}`}
          className="card card-hover mt-6 flex items-center gap-4 p-5"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
            <FileQuestion size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Test yourself: <TitleText title={quiz.title} /></span>
            <span className="mt-1 block text-sm text-gray-400">
              {quiz.items.length} questions · {quiz.topic}
            </span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-indigo-400" />
        </Link>
      ) : null}

      {articles.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
