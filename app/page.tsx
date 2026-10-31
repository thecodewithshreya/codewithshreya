import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  Binary,
  Braces,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  FileCode2,
  GraduationCap,
  Search,
} from "lucide-react";
import { ArticleCard, ToolCard, VideoCard } from "@/components/content-cards";
import { DailyQuestionCard } from "@/components/daily-question-card";
import { HomeScrollRow } from "@/components/home-scroll-row";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SubjectCard } from "@/components/subject-cards";
import { getDailyQuestion } from "@/lib/daily-question";
import { staticPyqPapers } from "@/lib/pyq";
import { getSiteContent, subjectsWithContent } from "@/lib/site-content";
import { subjects, tracks } from "@/lib/subjects";
import type { ReactNode } from "react";

const tools = [
  {
    title: "JSON Formatter",
    description: "Validate and format JSON with readable indentation and quick error checks.",
    icon: FileCode2,
    href: "/tools#json",
    accent: "border-blue-500/20 hover:border-blue-400/60",
  },
  {
    title: "Code Formatter",
    description: "Beautify snippets and keep your examples consistent before sharing.",
    icon: Braces,
    href: "/tools#code",
    accent: "border-emerald-500/20 hover:border-emerald-400/60",
  },
  {
    title: "Number Converter",
    description: "Convert decimal, binary, hexadecimal, and octal values instantly.",
    icon: Binary,
    href: "/tools#number",
    accent: "border-violet-500/20 hover:border-violet-400/60",
  },
  {
    title: "Base Calculator",
    description: "Practice base arithmetic for digital logic and computer architecture.",
    icon: Calculator,
    href: "/tools#base",
    accent: "border-cyan-500/30 hover:border-cyan-400/70",
  },
];

const trackCards = [
  {
    track: tracks.gate,
    icon: GraduationCap,
    accent: "from-violet-500/25 via-panel to-indigo-500/10 border-violet-500/30 hover:border-violet-400/70",
    iconStyle: "bg-violet-500/15 text-violet-300",
    points: ["Subject-wise notes and lectures", "Topic quizzes with explanations", "GATE CSE papers from 2007"],
  },
  {
    track: tracks.jobs,
    icon: BriefcaseBusiness,
    accent: "from-cyan-500/20 via-panel to-blue-500/10 border-cyan-500/30 hover:border-cyan-400/70",
    iconStyle: "bg-cyan-500/15 text-cyan-300",
    points: ["Core CS for technical rounds", "C#, .NET and career roadmaps", "Online compiler in 5 languages"],
  },
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "CodeWithShreya",
  url: "https://codewithshreya.com",
  logo: "https://codewithshreya.com/codewithshreya-logo-final.png",
  description:
    "Computer science learning platform for GATE CSE preparation and software job interviews: articles, video lectures, quizzes, previous year papers and an online compiler.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  const { articles, videos, quizzes } = content;
  const coreSubjects = subjectsWithContent(
    content,
    subjects.filter((subject) => subject.tracks.length > 1),
  );
  const daily = getDailyQuestion();
  const stats = [
    { label: "Articles", value: articles.length },
    { label: "Video lessons", value: videos.length },
    { label: "Practice quizzes", value: quizzes.length },
    { label: "GATE papers", value: staticPyqPapers.length },
  ];

  return (
    <>
      <Script
        id="organization-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <section className="premium-hero relative overflow-hidden border-b border-line">
        <div className="premium-hero-glow absolute inset-0" />
        <div className="container-page relative grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <Reveal direction="right">
            <p className="eyebrow">GATE CSE · Placements · Interviews</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Crack GATE and land your{" "}
              <span className="text-violet-600 dark:text-violet-300">first tech job.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-300">
              Clear computer science explanations, video lectures, practice quizzes, previous year papers and an
              online compiler, organised by subject and by goal.
            </p>

            <form action="/search" role="search" className="mt-7 flex max-w-xl gap-2">
              <label className="relative flex-1">
                <span className="sr-only">Search the site</span>
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="search"
                  name="q"
                  placeholder="Search a topic, e.g. normalization, subnetting"
                  className="w-full rounded-xl border border-line bg-panel/80 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                />
              </label>
              <button type="submit" className="button-primary">
                Search
              </button>
            </form>

            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="text-xs text-gray-400">{stat.label}</dt>
                  <dd className="text-2xl font-black text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal direction="left" delay={0.12}>
            <div className="grid gap-4">
              <p className="text-sm font-semibold text-gray-400">What are you preparing for?</p>
              {trackCards.map(({ track, icon: Icon, accent, iconStyle, points }) => (
                <Link
                  key={track.id}
                  href={track.href}
                  className={`group card bg-gradient-to-br p-6 transition ${accent}`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${iconStyle}`}>
                      <Icon size={24} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="flex items-center justify-between gap-2 text-xl font-extrabold text-white">
                        {track.title}
                        <ArrowRight size={18} className="shrink-0 text-gray-400 transition group-hover:translate-x-1" />
                      </h2>
                      <ul className="mt-3 grid gap-1.5 text-sm text-gray-300">
                        {points.map((point) => (
                          <li key={point} className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" /> {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {daily ? (
        <section className="container-page pt-14">
          <DailyQuestionCard question={daily} />
        </section>
      ) : null}

      <section className="py-14">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Core subjects"
              title="Learn once, use it for GATE and interviews"
              description="DSA, DBMS, operating systems and computer networks are part of the GATE CSE syllabus and come up in almost every technical interview."
            />
            <Link href="/topics" className="button-secondary shrink-0">
              All subjects <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreSubjects.map(({ subject, content: subjectContent }) => (
              <SubjectCard key={subject.slug} subject={subject} content={subjectContent} />
            ))}
          </div>
        </div>
      </section>

      <Preview eyebrow="Latest articles" title="Read clear explanations" href="/blog" label="View all articles">
        {articles.slice(0, 6).map((article) => (
          <ArticleCard key={article.slug ?? article.title} article={article} />
        ))}
      </Preview>

      <Preview eyebrow="Video lessons" title="Watch the lectures" href="/videos" label="Browse videos">
        {videos.slice(0, 6).map((video) => (
          <VideoCard key={video.id ?? video.youtubeId ?? video.title} video={video} />
        ))}
      </Preview>

      <section className="border-y border-line bg-white/[0.015] py-16">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Tools"
              title="Code and practise in your browser"
              description="An online compiler for Python, C#, Java, C++ and JavaScript, plus small utilities for students and developers."
            />
            <div className="flex shrink-0 gap-3">
              <Link href="/compiler" className="button-primary">
                Open compiler <ArrowRight size={16} />
              </Link>
              <Link href="/tools" className="button-secondary">
                All tools
              </Link>
            </div>
          </div>
          <HomeScrollRow className="mt-10">
            {tools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </HomeScrollRow>
        </div>
      </section>
    </>
  );
}

function Preview({
  eyebrow,
  title,
  href,
  label,
  children,
}: {
  eyebrow: string;
  title: string;
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="py-14">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <Link href={href} className="button-secondary shrink-0">
            {label} <ArrowRight size={16} />
          </Link>
        </div>
        <HomeScrollRow className="mt-10">{children}</HomeScrollRow>
      </div>
    </section>
  );
}
