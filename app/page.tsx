import Link from "next/link";
import Script from "next/script";
import { ArrowRight, BookOpen, Code2, PenLine, PlayCircle } from "lucide-react";
import { ArticleCard } from "@/components/content-cards";
import { DailyQuestionCard } from "@/components/daily-question-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SubjectCard } from "@/components/subject-cards";
import { getDailyQuestion } from "@/lib/daily-question";
import { staticPyqPapers } from "@/lib/pyq";
import { getSiteContent, subjectsWithContent } from "@/lib/site-content";
import { subjects, tracks } from "@/lib/subjects";

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
    { label: "Quizzes", value: quizzes.length },
    { label: "GATE papers", value: staticPyqPapers.length },
  ];
  // Four ways to learn, each one click from the home page.
  const paths = [
    { title: "Read", text: "Short, clear articles on every core topic.", href: "/blog", icon: BookOpen, count: `${articles.length} articles` },
    { title: "Watch", text: "Video lectures, subject by subject.", href: "/videos", icon: PlayCircle, count: `${videos.length} videos` },
    { title: "Practise", text: "Quizzes with explanations and real GATE papers.", href: "/quizzes", icon: PenLine, count: `${quizzes.length} quizzes · ${staticPyqPapers.length} papers` },
    { title: "Code", text: "Run Python, C#, Java, C++ and JavaScript in your browser.", href: "/compiler", icon: Code2, count: "Online compiler" },
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
        <Reveal className="container-page relative flex flex-col items-center py-20 text-center lg:py-28">
          <p className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
            Free · GATE CSE · Placements
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Crack GATE and land your{" "}
            <span className="text-violet-600 dark:text-violet-300">first tech job.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-300">
            Computer science explained simply, with lectures, quizzes and past papers organised by subject.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={tracks.gate.href} className="button-primary">
              Prepare for GATE <ArrowRight size={16} />
            </Link>
            <Link href={tracks.jobs.href} className="button-secondary">
              Prepare for jobs
            </Link>
          </div>
          <dl className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-xs text-gray-400">{stat.label}</dt>
                <dd className="text-3xl font-black text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading centered eyebrow="Start learning" title="Learn the way that suits you" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map(({ title, text, href, icon: Icon, count }) => (
              <Link key={href} href={href} className="group card p-6 hover:border-violet-400/60">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="mt-5 flex items-center justify-between text-lg font-bold text-white">
                  {title}
                  <ArrowRight size={16} className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-violet-300" />
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
                <p className="mt-4 text-xs font-semibold text-gray-500">{count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {daily ? (
        <section className="container-page pb-16">
          <DailyQuestionCard question={daily} />
        </section>
      ) : null}

      <section className="border-t border-line py-16">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Core subjects"
              title="Learn once, use it for GATE and interviews"
              description="DSA, DBMS, operating systems and computer networks are on the GATE syllabus and come up in almost every technical interview."
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

      {articles.length ? (
        <section className="border-t border-line py-16">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Latest articles" title="Fresh from the blog" />
              <Link href="/blog" className="button-secondary shrink-0">
                All articles <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.slug ?? article.title} article={article} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-page pb-20">
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Not sure where to start?</h2>
          <p className="mt-4 max-w-lg leading-7 text-gray-400">
            Pick your goal and follow the path: subjects in order, with a quiz after each one.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={tracks.gate.href} className="button-primary">
              GATE CSE path <ArrowRight size={16} />
            </Link>
            <Link href={tracks.jobs.href} className="button-secondary">
              Job prep path
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
