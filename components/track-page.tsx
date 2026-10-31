import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { SubjectCard } from "@/components/subject-cards";
import { subjectsWithContent } from "@/lib/site-content";
import { subjectsForTrack, type SubjectContent, type Track } from "@/lib/subjects";

export type PrepStep = { title: string; text: string; icon: LucideIcon };

// Shared layout for /gate and /interview-prep: hero, preparation steps, subjects, then track-specific sections.
export function TrackPage({
  track,
  content,
  steps,
  stats,
  actions,
  children,
}: {
  track: Track;
  content: SubjectContent;
  steps: PrepStep[];
  stats: { label: string; value: number }[];
  actions: ReactNode;
  children?: ReactNode;
}) {
  const subjects = subjectsWithContent(content, subjectsForTrack(track.id));

  return (
    <>
      <section className="premium-hero relative overflow-hidden border-b border-line">
        <div className="premium-hero-glow absolute inset-0" />
        <div className="container-page relative py-12 sm:py-16">
          <p className="eyebrow">{track.label}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            {track.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">{track.description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">{actions}</div>
          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="card px-4 py-3">
                <dt className="text-xs text-gray-400">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-black text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">How to prepare</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, text, icon: Icon }, index) => (
            <li key={title} className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
                  <Icon size={20} />
                </span>
                <span className="text-xs font-semibold text-gray-500">Step {index + 1}</span>
              </div>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page pb-14">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Subjects</h2>
            <p className="mt-2 text-sm text-gray-400">
              Each subject page collects its articles, video lectures and practice quizzes.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map(({ subject, content: subjectContent }) => (
            <SubjectCard key={subject.slug} subject={subject} content={subjectContent} />
          ))}
        </div>
      </section>

      {children}
    </>
  );
}

export function TrackSection({
  title,
  description,
  href,
  linkLabel,
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="container-page pb-14">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          {description ? <p className="mt-2 text-sm text-gray-400">{description}</p> : null}
        </div>
        {href && linkLabel ? (
          <Link href={href} className="button-secondary shrink-0">
            {linkLabel} <ArrowRight size={16} />
          </Link>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
