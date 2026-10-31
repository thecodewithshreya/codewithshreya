import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SubjectCard } from "@/components/subject-cards";
import { getSiteContent, subjectsWithContent } from "@/lib/site-content";
import { subjects, tracks, type Subject, type TrackId } from "@/lib/subjects";

const groups: { title: string; description: string; track?: TrackId; subjects: Subject[] }[] = [
  {
    title: "Core computer science",
    description: "Needed for both the GATE exam and technical interviews.",
    subjects: subjects.filter((subject) => subject.tracks.length > 1),
  },
  {
    title: "More for GATE",
    description: "The rest of the GATE CSE syllabus.",
    track: "gate",
    subjects: subjects.filter((subject) => subject.tracks.length === 1 && subject.tracks[0] === "gate"),
  },
  {
    title: "More for job prep",
    description: "Skills for developer roles beyond core CS.",
    track: "jobs",
    subjects: subjects.filter((subject) => subject.tracks.length === 1 && subject.tracks[0] === "jobs"),
  },
];

export const metadata: Metadata = {
  title: "All subjects",
  description: "Computer science subjects for GATE CSE and placement preparation, each with articles, videos and quizzes.",
  alternates: { canonical: "/topics" },
};

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const content = await getSiteContent();

  return (
    <section className="container-page py-10 sm:py-14">
      <p className="eyebrow">Subjects</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Pick a subject</h1>
      <p className="mt-4 max-w-2xl text-gray-400">
        Every subject page brings its articles, video lessons and practice quizzes together. Core CS subjects
        count for both GATE and interviews.
      </p>

      {groups.map((group) => (
        <div key={group.title} className="mt-12">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{group.title}</h2>
              <p className="mt-2 text-sm text-gray-400">{group.description}</p>
            </div>
            {group.track ? (
              <Link
                href={tracks[group.track].href}
                className="inline-flex shrink-0 items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
              >
                {tracks[group.track].label} preparation guide <ArrowRight size={15} />
              </Link>
            ) : null}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjectsWithContent(content, group.subjects).map(({ subject, content: subjectContent }) => (
              <SubjectCard key={subject.slug} subject={subject} content={subjectContent} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
