import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { ArticleCard, PyqCard, QuizCard, VideoCard } from "@/components/content-cards";
import { minQueryLength, searchSite } from "@/lib/search";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = readQuery((await searchParams).q);

  return {
    title: query ? `Search: ${query}` : "Search",
    description: "Search CodeWithShreya articles, videos, quizzes and previous year papers.",
    robots: { index: false, follow: true },
  };
}

const suggestions = ["SQL joins", "subnetting", "C#", "operating systems", "GATE 2024", "graph"];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = readQuery((await searchParams).q);
  const results = await searchSite(query);
  const total = results.articles.length + results.videos.length + results.quizzes.length + results.pyqs.length;
  const searched = query.length >= minQueryLength;

  return (
    <section className="container-page py-10">
      <p className="eyebrow">Search</p>
      <h1 className="mt-2 text-3xl font-black text-white">Find what to learn next</h1>

      <form action="/search" role="search" className="mt-6 flex max-w-2xl gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Search the site</span>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            autoFocus={!query}
            placeholder="Search articles, videos, quizzes, PYQs"
            className="w-full rounded-lg border border-line bg-panel/75 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
          />
        </label>
        <button type="submit" className="button-primary">
          Search
        </button>
      </form>

      {!searched ? (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          Try:
          {suggestions.map((suggestion) => (
            <a
              key={suggestion}
              href={`/search?q=${encodeURIComponent(suggestion)}`}
              className="rounded-md bg-white/[0.06] px-3 py-1.5 text-gray-300 transition hover:bg-white/[0.1]"
            >
              {suggestion}
            </a>
          ))}
        </div>
      ) : total === 0 ? (
        <p className="mt-8 text-gray-400">
          No results for &ldquo;{query}&rdquo;. Try a shorter or more general term.
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-gray-500">
            {total} result{total === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>

          <ResultGroup title="Articles" count={results.articles.length}>
            {results.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </ResultGroup>

          <ResultGroup title="Quizzes" count={results.quizzes.length}>
            {results.quizzes.map((quiz) => (
              <QuizCard key={quiz.slug} quiz={quiz} />
            ))}
          </ResultGroup>

          <ResultGroup title="Videos" count={results.videos.length}>
            {results.videos.map((video) => (
              <VideoCard key={video.id ?? video.title} video={video} />
            ))}
          </ResultGroup>

          <ResultGroup title="Previous year papers" count={results.pyqs.length}>
            {results.pyqs.map((paper) => (
              <PyqCard
                key={paper.fileId}
                title={paper.title}
                source={paper.source}
                questions={paper.questions}
                year={paper.year}
                viewUrl={`https://drive.google.com/file/d/${paper.fileId}/view?usp=sharing`}
                previewUrl={`https://drive.google.com/file/d/${paper.fileId}/preview`}
                downloadUrl={`https://drive.google.com/uc?export=download&id=${paper.fileId}`}
              />
            ))}
          </ResultGroup>
        </>
      )}
    </section>
  );
}

function ResultGroup({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  if (!count) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">
        {title} <span className="text-sm font-semibold text-gray-500">({count})</span>
      </h2>
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function readQuery(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value ?? "").trim().slice(0, 100);
}
