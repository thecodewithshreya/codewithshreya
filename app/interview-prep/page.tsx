import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Braces, BriefcaseBusiness, Code2, Layers3, MessagesSquare, TerminalSquare } from "lucide-react";
import { ArticleCard, QuizCard } from "@/components/content-cards";
import { TrackPage, TrackSection } from "@/components/track-page";
import { getSiteContent, subjectsWithContent } from "@/lib/site-content";
import { subjectsForTrack, tracks } from "@/lib/subjects";

const track = tracks.jobs;

export const metadata: Metadata = {
  title: "Placement & Interview Preparation",
  description:
    "Prepare for software developer interviews and campus placements: core CS for technical rounds, C# and .NET, an online compiler, quizzes and career roadmaps.",
  alternates: { canonical: track.href },
};

export const dynamic = "force-dynamic";

const steps = [
  {
    title: "Strengthen core CS",
    text: "DSA, DBMS, operating systems and networks come up in almost every technical round.",
    icon: Layers3,
  },
  {
    title: "Go deep in one stack",
    text: "Learn one language and framework properly. Our C# and .NET track takes you from basics to APIs.",
    icon: Code2,
  },
  {
    title: "Write and run code",
    text: "Practice in the online compiler in Python, C#, Java, C++ or JavaScript, with no setup.",
    icon: TerminalSquare,
  },
  {
    title: "Rehearse interview questions",
    text: "Use the quizzes to check your answers, and follow a roadmap so you know what to learn next.",
    icon: MessagesSquare,
  },
];

export default async function InterviewPrepPage() {
  const content = await getSiteContent();
  const jobSubjects = subjectsWithContent(content, subjectsForTrack("jobs"));
  const articles = jobSubjects.flatMap(({ content: subjectContent }) => subjectContent.articles);
  const quizzes = jobSubjects.flatMap(({ content: subjectContent }) => subjectContent.quizzes);
  const uniqueArticles = articles.filter(
    (article, index) => articles.findIndex((other) => other.slug === article.slug) === index,
  );

  return (
    <TrackPage
      track={track}
      content={content}
      steps={steps}
      stats={[
        { label: "Subjects", value: jobSubjects.length },
        { label: "Articles", value: uniqueArticles.length },
        { label: "Practice quizzes", value: quizzes.length },
        { label: "Video lessons", value: jobSubjects.reduce((sum, item) => sum + item.content.videos.length, 0) },
      ]}
      actions={
        <>
          <Link href="/topics/data-structures-and-algorithms" className="button-primary">
            Start with DSA <ArrowRight size={17} />
          </Link>
          <Link href="/compiler" className="button-secondary">
            Open the compiler
          </Link>
        </>
      }
    >
      {uniqueArticles.length ? (
        <TrackSection
          title="Read before your interview"
          description="Explanations written around the questions interviewers actually ask."
          href="/blog"
          linkLabel="All articles"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uniqueArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </TrackSection>
      ) : null}

      {quizzes.length ? (
        <TrackSection title="Interview quizzes" href="/quizzes" linkLabel="All quizzes">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.slug ?? quiz.title} quiz={quiz} />
            ))}
          </div>
        </TrackSection>
      ) : null}

      <section className="container-page pb-16">
        <div className="card grid gap-6 border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-panel to-violet-500/10 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <BriefcaseBusiness size={15} /> Practice like the real round
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">Code, format and debug in your browser</h2>
            <p className="mt-2 max-w-2xl text-gray-400">
              Run solutions in five languages, then use the JSON formatter, code formatter and number converters
              while you practise.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link href="/compiler" className="button-primary">
              <TerminalSquare size={17} /> Compiler
            </Link>
            <Link href="/tools" className="button-secondary">
              <Braces size={17} /> Developer tools
            </Link>
          </div>
        </div>
      </section>
    </TrackPage>
  );
}
