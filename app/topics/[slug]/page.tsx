import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { ArticleCard, QuizCard, VideoCard } from "@/components/content-cards";
import { SubjectCard } from "@/components/subject-cards";
import { TrackSection } from "@/components/track-page";
import { getSiteContent, subjectsWithContent } from "@/lib/site-content";
import { contentForSubject, getSubject, subjects, tracks } from "@/lib/subjects";

type TopicPageProps = { params: Promise<{ slug: string }> };

// Large lecture series are previewed here; the videos page has the full list.
const videoPreviewLimit = 9;

export function generateStaticParams() {
  return subjects.map((subject) => ({ slug: subject.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const subject = getSubject((await params).slug);
  if (!subject) return {};

  const audience = subject.tracks.map((track) => tracks[track].label).join(" and ");
  return {
    title: `${subject.name}: notes, videos and quizzes`,
    description: `${subject.name} for ${audience}: ${subject.description}`,
    alternates: { canonical: `/topics/${subject.slug}` },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const subject = getSubject((await params).slug);
  if (!subject) notFound();

  const all = await getSiteContent();
  const { articles, videos, quizzes } = contentForSubject(subject, all);
  const related = subjectsWithContent(all)
    .filter(
      (item) => item.subject.slug !== subject.slug && item.subject.tracks.some((track) => subject.tracks.includes(track)),
    )
    .slice(0, 3);
  const empty = articles.length + videos.length + quizzes.length === 0;

  return (
    <>
      <section className="premium-hero relative overflow-hidden border-b border-line">
        <div className="premium-hero-glow absolute inset-0" />
        <div className="container-page relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
            <Link href="/topics" className="inline-flex items-center gap-1 hover:text-indigo-300">
              <ArrowLeft size={15} /> All subjects
            </Link>
            {subject.tracks.map((track) => (
              <Link
                key={track}
                href={tracks[track].href}
                className="rounded-full border border-line px-2.5 py-0.5 text-xs hover:border-violet-400 hover:text-violet-300"
              >
                {tracks[track].label}
              </Link>
            ))}
          </nav>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            {subject.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">{subject.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            {(
              [
                ["articles", articles.length, "Article", "Articles"],
                ["videos", videos.length, "Video lesson", "Video lessons"],
                ["quizzes", quizzes.length, "Quiz", "Quizzes"],
              ] as const
            )
              .filter(([, count]) => count > 0)
              .map(([id, count, one, many]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel/60 px-3 py-1.5 text-gray-300 hover:border-violet-400"
                  >
                    <span className="font-bold text-white">{count}</span> {count === 1 ? one : many}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <div className="pt-12">
        {empty ? (
          <section className="container-page pb-14">
            <div className="card p-8 text-center">
              <h2 className="text-xl font-bold">Lessons for this subject are being prepared</h2>
              <p className="mt-2 text-gray-400">Meanwhile, practise with the previous year papers and other subjects.</p>
            </div>
          </section>
        ) : null}

        {quizzes.length ? (
          <div id="quizzes" className="scroll-mt-24">
            <TrackSection title="Practice quizzes">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz.slug ?? quiz.title} quiz={quiz} />
                ))}
              </div>
            </TrackSection>
          </div>
        ) : null}

        {articles.length ? (
          <div id="articles" className="scroll-mt-24">
            <TrackSection title="Articles">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </TrackSection>
          </div>
        ) : null}

        {videos.length ? (
          <div id="videos" className="scroll-mt-24">
            <TrackSection
              title="Video lessons"
              description={
                videos.length > videoPreviewLimit
                  ? `Showing ${videoPreviewLimit} of ${videos.length} lessons.`
                  : undefined
              }
              href={videos.length > videoPreviewLimit ? "/videos" : undefined}
              linkLabel="All videos"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videos.slice(0, videoPreviewLimit).map((video) => (
                  <VideoCard key={video.id ?? video.youtubeId ?? video.title} video={video} />
                ))}
              </div>
            </TrackSection>
          </div>
        ) : null}

        {subject.tracks.includes("gate") ? (
          <section className="container-page pb-14">
            <Link
              href="/pyq"
              className="card card-hover flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
                <FileText size={24} />
              </span>
              <span className="flex-1">
                <span className="block font-bold">Solve GATE previous year papers</span>
                <span className="mt-1 block text-sm text-gray-400">
                  {subject.name} questions appear in every GATE CSE paper. Practise them in exam conditions.
                </span>
              </span>
              <ArrowRight size={18} className="text-indigo-400" />
            </Link>
          </section>
        ) : null}

        {related.length ? (
          <TrackSection title="Related subjects" href="/topics" linkLabel="All subjects">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(({ subject: other, content }) => (
                <SubjectCard key={other.slug} subject={other} content={content} />
              ))}
            </div>
          </TrackSection>
        ) : null}
      </div>
    </>
  );
}
