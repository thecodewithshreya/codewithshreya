import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Database,
  FileText,
  GraduationCap,
  Layers3,
  MonitorPlay,
  Network,
  Play,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { ArticleCard, QuizCard, VideoCard } from "@/components/content-cards";
import { Reveal, StaggerReveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { articles, quizzes, videos } from "@/lib/data";

const categories = [
  { name: "Data Structures", lessons: "32 lessons", icon: Layers3, color: "text-blue-400 bg-blue-500/10" },
  { name: "Algorithms", lessons: "28 lessons", icon: BrainCircuit, color: "text-purple-400 bg-purple-500/10" },
  { name: "DBMS", lessons: "21 lessons", icon: Database, color: "text-cyan-400 bg-cyan-500/10" },
  { name: "Operating Systems", lessons: "24 lessons", icon: MonitorPlay, color: "text-pink-400 bg-pink-500/10" },
  { name: "Computer Networks", lessons: "19 lessons", icon: Network, color: "text-emerald-400 bg-emerald-500/10" },
  { name: "Programming", lessons: "40+ lessons", icon: Code2, color: "text-orange-400 bg-orange-500/10" },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <section className="hero-grid relative overflow-hidden">
        <div className="animate-ambient pointer-events-none absolute left-1/2 top-0 h-[35rem] w-[35rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="container-page relative grid items-center gap-14 py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-28">
          <Reveal direction="right">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
              <Sparkles size={14} /> Your complete CS learning companion
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
              Master computer science,{" "}
              <span className="gradient-text">one concept at a time.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Structured lessons, practical coding, focused quizzes, and exam
              resources—everything you need to build strong CS fundamentals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/blog" className="button-primary">
                Start learning <ArrowRight size={17} />
              </Link>
              <Link href="/compiler" className="button-secondary">
                <Code2 size={17} /> Try online compiler
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
              {["Beginner friendly", "Exam focused", "Always free"].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-indigo-400" /> {text}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal
            direction="left"
            delay={0.14}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -inset-5 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl" />
            <div className="animate-float-slow card relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-gray-500">learning_path.py</span>
              </div>
              <pre className="overflow-x-auto p-6 text-sm leading-7 text-gray-300 sm:p-8">
                <code>
                  <span className="text-purple-400">class</span>{" "}
                  <span className="text-blue-400">LearningPath</span>:{"\n"}
                  {"    "}<span className="text-purple-400">def</span>{" "}
                  <span className="text-cyan-300">__init__</span>(self):{"\n"}
                  {"        "}self.foundation = <span className="text-amber-300">&quot;strong&quot;</span>{"\n"}
                  {"        "}self.practice = <span className="text-amber-300">True</span>{"\n\n"}
                  {"    "}<span className="text-purple-400">def</span>{" "}
                  <span className="text-cyan-300">grow</span>(self):{"\n"}
                  {"        "}<span className="text-purple-400">return</span>{" "}
                  <span className="text-amber-300">&quot;Learn → Code → Grow&quot;</span>
                </code>
              </pre>
              <div className="grid grid-cols-3 border-t border-line">
                {[
                  ["100+", "Lessons"],
                  ["50+", "Quizzes"],
                  ["6", "Languages"],
                ].map(([value, label]) => (
                  <div key={label} className="border-r border-line p-4 text-center last:border-0">
                    <div className="font-bold text-indigo-300">{value}</div>
                    <div className="mt-1 text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-white/[0.015] py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Explore topics"
            title="Build your computer science foundation"
            description="Clear, structured resources across the subjects that matter most."
            centered
          />
          <StaggerReveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.name} className="card h-full flex items-center gap-4 p-5">
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${category.color}`}>
                  <category.icon size={23} />
                </span>
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{category.lessons}</p>
                </div>
                <span className="ml-auto text-xs text-gray-500">Coming soon</span>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <PreviewSection
        id="articles"
        eyebrow="Latest articles"
        title="Learn with in-depth explanations"
        description="Practical guides that make complex computer science concepts easier to understand."
        href="/blog"
        linkLabel="View all articles"
      >
        {articles.slice(0, 3).map((article) => <ArticleCard key={article.title} article={article} />)}
      </PreviewSection>

      <section className="border-y border-line bg-white/[0.015] py-20">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Video lessons"
              title="Watch. Understand. Apply."
              description="Concise video lessons designed to turn difficult concepts into useful mental models."
            />
            <Link href="/videos" className="button-secondary shrink-0">
              Browse videos <ArrowRight size={16} />
            </Link>
          </div>
          <StaggerReveal className="mt-10 grid gap-5 md:grid-cols-3">
            {videos.slice(0, 3).map((video) => <VideoCard key={video.title} video={video} />)}
          </StaggerReveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <p className="eyebrow">Online compiler</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Practice code without leaving your browser
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-gray-400">
              Write and test programs in C, C++, Java, Python, JavaScript, and
              SQL with a clean, distraction-free editor.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-300">
              {["6 languages", "Custom input", "Instant feedback", "No setup needed"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-indigo-400" /> {item}
                </span>
              ))}
            </div>
            <Link href="/compiler" className="button-primary mt-8">
              Open compiler <TerminalSquare size={17} />
            </Link>
          </Reveal>
          <Reveal direction="left" delay={0.1} className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-xs text-gray-400">main.py</span>
              <span className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-300">Python</span>
            </div>
            <pre className="min-h-52 overflow-x-auto p-6 text-sm leading-7">
              <code>
                <span className="text-purple-400">def</span>{" "}
                <span className="text-blue-400">greet</span>(name):{"\n"}
                {"    "}<span className="text-purple-400">return</span>{" "}
                <span className="text-amber-300">f&quot;Keep coding, {"{"}name{"}"}!&quot;</span>{"\n\n"}
                <span className="text-gray-500"># Start your journey</span>{"\n"}
                print(greet(<span className="text-amber-300">&quot;Shreya&quot;</span>))
              </code>
            </pre>
            <div className="border-t border-line bg-black/20 p-4">
              <span className="text-xs uppercase tracking-widest text-gray-600">Output</span>
              <p className="mt-2 font-mono text-sm text-emerald-400">Keep coding, Shreya!</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-white/[0.015] py-20">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Test your knowledge"
              title="Practice with focused quizzes"
              description="Get immediate feedback and identify the concepts you need to revisit."
            />
            <Link href="/quizzes" className="button-secondary shrink-0">All quizzes <ArrowRight size={16} /></Link>
          </div>
          <StaggerReveal className="mt-10 grid gap-5 md:grid-cols-3">
            {quizzes.slice(0, 3).map((quiz) => <QuizCard key={quiz.title} quiz={quiz} />)}
          </StaggerReveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <Reveal className="card relative overflow-hidden bg-gradient-to-br from-indigo-600/20 via-panel to-purple-600/10 p-8 sm:p-12">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
                    <GraduationCap size={25} />
                  </span>
                  <span className="eyebrow">Previous year questions</span>
                </div>
                <h2 className="mt-5 text-3xl font-bold">Prepare smarter with real exam questions</h2>
                <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                  Explore GATE questions, college-wise papers, and exam-style PYQ quizzes in one place.
                </p>
              </div>
              <Link href="/pyq" className="button-primary">
                Explore PYQs <FileText size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function PreviewSection({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <Link href={href} className="button-secondary shrink-0">{linkLabel} <ArrowRight size={16} /></Link>
        </div>
        <StaggerReveal className="mt-10 grid gap-5 md:grid-cols-3">
          {children}
        </StaggerReveal>
      </div>
    </section>
  );
}
