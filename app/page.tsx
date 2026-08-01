import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  Binary,
  BookOpenText,
  Braces,
  Calculator,
  Code2,
  FileCode2,
  FileQuestion,
  FileText,
  GraduationCap,
  Layers3,
  PlayCircle,
  Search,
  TerminalSquare,
} from "lucide-react";
import { ArticleCard, QuizCard, ToolCard, VideoCard } from "@/components/content-cards";
import { HomeScrollRow } from "@/components/home-scroll-row";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { articles, quizzes, videos } from "@/lib/data";
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

const paths = [
  { title: "Learn", text: "Read one concept with examples", icon: BookOpenText },
  { title: "Watch", text: "Use video for the first mental model", icon: PlayCircle },
  { title: "Practice", text: "Test recall with focused quizzes", icon: FileQuestion },
  { title: "Build", text: "Run code and apply the idea", icon: TerminalSquare },
];

const learningPaths = [
  {
    title: "Core CS",
    text: "DSA, OS, DBMS, CN, and algorithms",
    icon: Layers3,
    href: "/videos#core-cs",
  },
  {
    title: "Exam Prep",
    text: "PYQs, topic filters, and timed practice",
    icon: GraduationCap,
    href: "/pyq",
  },
  {
    title: "Developer Tools",
    text: "Format, convert, compare, and test",
    icon: Braces,
    href: "/tools",
  },
];

const dotNetPaths = [
  {
    title: "C# Basics",
    text: "Types, strings, records, methods, and OOP basics",
    icon: Code2,
    href: "/blog/csharp-basics-for-dotnet-interviews",
  },
  {
    title: ".NET Roadmap",
    text: "C#, ASP.NET Core, SQL, EF Core, testing, and deployment",
    icon: GraduationCap,
    href: "/blog/how-to-become-dotnet-developer-roadmap",
  },
  {
    title: "Localization",
    text: "Culture, resource files, translated UI, dates, and prices",
    icon: FileText,
    href: "/blog/dotnet-localization-globalization",
  },
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "CodeWithShreya",
  url: "https://codewithshreya.com",
  logo: "https://codewithshreya.com/codewithshreya-logo-final.png",
  description:
    "Computer Science and programming learning platform for tutorials, quizzes, PYQs, and interview preparation.",
};

export default function Home() {
  return (
    <>
      <Script
        id="organization-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <section className="premium-hero relative overflow-hidden border-b border-line">
        <div className="premium-hero-glow absolute inset-0" />
        <div className="container-page relative grid min-h-[360px] items-center gap-6 py-8 lg:min-h-[390px] lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal direction="right">
            <h1 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Learn Computer Science{" "}
              <span className="text-violet-300">in One Place.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-300">
              Blogs, videos, quizzes, PYQs, compiler practice, and developer tools for focused learning.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/blog" className="button-primary">
                Start learning <ArrowRight size={17} />
              </Link>
              <Link href="/tools" className="button-secondary">
                Explore tools <Code2 size={17} />
              </Link>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.12}>
            <div className="cs-3d-scene relative mx-auto hidden h-[300px] w-full max-w-md lg:block" aria-hidden="true">
              <div className="scene-orbit scene-orbit-one" />
              <div className="scene-orbit scene-orbit-two" />
              <div className="floating-cube cube-one">C#</div>
              <div className="floating-cube cube-two">SQL</div>
              <div className="floating-cube cube-three">API</div>
              <div className="scene-laptop">
                <div className="scene-screen">
                  <div className="flex items-center gap-2 border-b border-line pb-4">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-xs text-gray-500">codewithshreya.academy</span>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {paths.map(({ title, text, icon: Icon }) => (
                    <div key={title} className="scene-tile">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-violet-500/10 text-violet-300">
                        <Icon size={22} />
                      </span>
                      <h2 className="mt-5 text-xl font-bold text-white">{title}</h2>
                      <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
                    </div>
                  ))}
                  </div>
                  <div className="mt-5 rounded-lg border border-white/10 bg-black/35 p-5">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Search size={16} /> Search a topic
                    </div>
                    <p className="mt-3 text-lg font-bold text-white">C# basics, SQL joins, time complexity...</p>
                  </div>
                </div>
                <div className="scene-base">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="learning-path-section py-14">
        <div className="container-page">
          <div className="learning-path-shell">
            <div className="learning-dots learning-dots-left" />
            <div className="learning-dots learning-dots-right" />
            <div className="text-center">
              <span className="learning-pill">Learning paths</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Choose what you want to improve
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400">
                Move between explanations, practice, code, and previous-year questions without losing context.
              </p>
            </div>
            <HomeScrollRow className="mt-9">
            {learningPaths.map(({ title, text, icon: Icon, href }) => (
              <Link key={title} href={href} className="learning-path-card group">
                <span className="learning-path-icon">
                  <Icon size={30} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
                <span className="learning-path-action">
                  Open path <ArrowRight size={15} />
                </span>
              </Link>
            ))}
            </HomeScrollRow>
          </div>
        </div>
      </section>

      <section className="dotnet-section py-14">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow=".NET"
              title="Build strong .NET fundamentals"
              description="Start with C#, understand the .NET platform, then move into ASP.NET Core and real application skills."
            />
            <Link href="/blog/csharp-basics-for-dotnet-interviews" className="button-secondary shrink-0">
              Start .NET <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {dotNetPaths.map(({ title, text, icon: Icon, href }) => (
              <Link key={title} href={href} className="dotnet-card group">
                <span className="dotnet-icon">
                  <Icon size={24} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
                <span className="dotnet-action">
                  Open lesson <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Preview
        eyebrow="Latest blogs"
        title="Read deep explanations"
        href="/blog"
        label="View all blogs"
      >
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.title} article={article} />
        ))}
      </Preview>

      <Preview eyebrow="Videos" title="Watch visual lessons" href="/videos" label="Browse videos">
        {videos.slice(0, 3).map((video) => (
          <VideoCard key={video.title} video={video} />
        ))}
      </Preview>

      <Preview eyebrow="Quizzes" title="Practice with topic cards" href="/quizzes" label="Start practice">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.title} quiz={quiz} />
        ))}
      </Preview>

      <section className="border-y border-line bg-white/[0.015] py-20">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Tools"
              title="Small utilities for students and developers"
              description="Useful tools for formatting, conversion, debugging, and CS practice."
            />
            <Link href="/tools" className="button-secondary shrink-0">
              Open tools <ArrowRight size={16} />
            </Link>
          </div>
          <HomeScrollRow className="mt-10">
            {tools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </HomeScrollRow>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <Reveal className="card relative overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-500/15 via-panel to-indigo-500/10 p-8 sm:p-12">
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-violet-500/10 text-violet-300">
                    <FileText size={25} />
                  </span>
                  <span className="eyebrow">PYQ practice</span>
                </div>
                <h2 className="mt-5 text-3xl font-bold text-white">Practice real exam questions by subject and year</h2>
                <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                  Use PYQ cards for GATE, university papers, solved counts, and quick revision sessions.
                </p>
              </div>
              <Link href="/pyq" className="button-primary">
                Explore PYQs <ArrowRight size={17} />
              </Link>
            </div>
          </Reveal>
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
    <section className="py-20">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <Link href={href} className="button-secondary shrink-0">
            {label} <ArrowRight size={16} />
          </Link>
        </div>
        <HomeScrollRow className="mt-10">
          {children}
        </HomeScrollRow>
      </div>
    </section>
  );
}
