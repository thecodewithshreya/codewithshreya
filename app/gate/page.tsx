import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarCheck, FileQuestion, FileText } from "lucide-react";
import { DailyQuestionCard } from "@/components/daily-question-card";
import { QuizCard } from "@/components/content-cards";
import { TrackPage, TrackSection } from "@/components/track-page";
import { getDailyQuestion } from "@/lib/daily-question";
import { getAllPyqPapers } from "@/lib/dynamic-content";
import { staticPyqPapers } from "@/lib/pyq";
import { getSiteContent, subjectsWithContent } from "@/lib/site-content";
import { subjectsForTrack, tracks } from "@/lib/subjects";

const track = tracks.gate;

export const metadata: Metadata = {
  title: "GATE CSE Preparation",
  description:
    "Prepare for GATE Computer Science with subject-wise notes, video lectures, topic quizzes, a daily question and previous year papers from 2007 onwards.",
  alternates: { canonical: track.href },
};

export const dynamic = "force-dynamic";

const steps = [
  {
    title: "Learn each subject",
    text: "Start with the concept: read the article or watch the lecture for one topic at a time.",
    icon: BookOpenText,
  },
  {
    title: "Practice by topic",
    text: "Take the subject quiz right after learning it, and read the explanation for every miss.",
    icon: FileQuestion,
  },
  {
    title: "Solve previous papers",
    text: "Work through GATE papers year by year to learn the exam pattern and the question style.",
    icon: FileText,
  },
  {
    title: "Revise every day",
    text: "Answer the daily question to keep older subjects fresh while you study new ones.",
    icon: CalendarCheck,
  },
];

export default async function GatePage() {
  const [content, papers] = await Promise.all([getSiteContent(), getAllPyqPapers(staticPyqPapers)]);
  const gateSubjects = subjectsWithContent(content, subjectsForTrack("gate"));
  const gatePapers = papers.filter((paper) => paper.source.toUpperCase().includes("GATE"));
  const years = gatePapers.map((paper) => Number(paper.year)).filter(Number.isFinite);
  const quizzes = gateSubjects.flatMap(({ content: subjectContent }) => subjectContent.quizzes);
  const daily = getDailyQuestion();

  return (
    <TrackPage
      track={track}
      content={content}
      steps={steps}
      stats={[
        { label: "Subjects", value: gateSubjects.length },
        { label: "Video lectures", value: gateSubjects.reduce((sum, item) => sum + item.content.videos.length, 0) },
        { label: "Practice quizzes", value: quizzes.length },
        { label: "Previous papers", value: gatePapers.length },
      ]}
      actions={
        <>
          <Link href="/pyq" className="button-primary">
            Solve previous papers <ArrowRight size={17} />
          </Link>
          <Link href="/quizzes" className="button-secondary">
            Take a practice quiz
          </Link>
        </>
      }
    >
      {daily ? (
        <section className="container-page pb-14">
          <DailyQuestionCard question={daily} />
        </section>
      ) : null}

      <TrackSection
        title="GATE CSE previous year papers"
        description={
          years.length
            ? `${gatePapers.length} question papers from ${Math.min(...years)} to ${Math.max(...years)}, ready to view or download.`
            : undefined
        }
        href="/pyq"
        linkLabel="Open all papers"
      >
        <div className="flex flex-wrap gap-2">
          {[...new Set(gatePapers.map((paper) => paper.year))].map((year) => (
            <Link
              key={year}
              href={`/pyq?year=${encodeURIComponent(year)}#papers`}
              className="rounded-lg border border-line px-3 py-1.5 text-sm text-gray-300 transition hover:border-violet-400 hover:text-violet-300"
            >
              GATE {year}
            </Link>
          ))}
        </div>
      </TrackSection>

      {quizzes.length ? (
        <TrackSection title="Subject quizzes" href="/quizzes" linkLabel="All quizzes">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.slug ?? quiz.title} quiz={quiz} />
            ))}
          </div>
        </TrackSection>
      ) : null}
    </TrackPage>
  );
}
