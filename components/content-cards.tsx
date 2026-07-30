import { ArrowRight, Clock, FileQuestion, Layers3, Play } from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";

type Article = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  color: string;
  slug: string | null;
};

export function ArticleCard({ article }: { article: Article }) {
  const categoryLabel = article.category === "DotNet" ? ".NET" : article.category;

  return (
    <article className={`card h-full overflow-hidden ${article.slug ? "card-hover" : ""}`}>
      <div className={`h-20 bg-gradient-to-br ${article.color} p-4`}>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-200">
          {categoryLabel}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={13} /> {article.date}
        </div>
        <h3 className="mt-3 text-base font-semibold leading-snug">{article.title}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-400">{article.excerpt}</p>
        {article.slug ? (
          <Link
            href={`/blog/${article.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            Read article <ArrowRight size={15} />
          </Link>
        ) : (
          <span className="mt-3 inline-flex text-sm text-gray-500">Coming soon</span>
        )}
      </div>
    </article>
  );
}

type Video = {
  title: string;
  topic: string;
  duration: string;
  color: string;
  level?: string;
  description?: string;
};

export function VideoCard({ video }: { video: Video }) {
  const level = video.level ?? (video.topic === "Core CS" ? "Intermediate" : "Beginner");
  const levelColor =
    level === "Advanced"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
      : level === "Intermediate"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

  return (
    <article className="card group h-full overflow-hidden">
      <div className="relative grid aspect-video place-items-center bg-[#20232c]">
        <div className={`absolute inset-0 bg-gradient-to-br ${video.color} opacity-25 transition group-hover:opacity-40`} />
        <span className="relative grid h-12 w-12 place-items-center rounded-full border border-amber-400/30 bg-amber-500/20 text-amber-300 shadow-xl shadow-amber-950/20 transition group-hover:scale-105">
          <Play size={20} fill="currentColor" />
        </span>
        <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
          {video.duration}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <span className={`rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${levelColor}`}>
            {level}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock size={15} /> {video.duration}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-bold leading-snug">{video.title}</h3>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          {video.description ?? `Focused ${video.topic} lesson with visual examples and practice notes.`}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
          Watch now <ArrowRight size={15} />
        </span>
      </div>
    </article>
  );
}

type Quiz = {
  title: string;
  topic: string;
  questions: number;
  level: string;
  tags?: string[];
};

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const levelColor =
    quiz.level === "Advanced"
      ? "border-rose-500/30 text-rose-300 bg-rose-500/10"
      : quiz.level === "Intermediate"
        ? "border-amber-500/30 text-amber-300 bg-amber-500/10"
        : "border-emerald-500/30 text-emerald-300 bg-emerald-500/10";
  const accent =
    quiz.level === "Advanced"
      ? "border-rose-500/35 hover:border-rose-400/70"
      : quiz.level === "Intermediate"
        ? "border-amber-500/25 hover:border-amber-400/60"
        : "border-emerald-500/25 hover:border-emerald-400/60";

  return (
    <article className={`card h-full p-4 ${accent}`}>
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-rose-500/10 text-rose-300">
          <FileQuestion size={20} />
        </span>
        <span className={`rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${levelColor}`}>
          {quiz.level}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold leading-snug">{quiz.title}</h3>
      <p className="mt-2 text-sm text-gray-400">
        {quiz.questions} questions <span className="text-gray-600">-</span> {quiz.topic}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(quiz.tags ?? [quiz.topic, quiz.level]).slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md bg-white/[0.06] px-3 py-1.5 text-sm text-gray-400">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5">
        <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.07] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]">
          Start quiz <ArrowRight size={15} />
        </span>
      </div>
    </article>
  );
}

type Tool = {
  title: string;
  description: string;
  icon: ElementType;
  href: string;
  accent: string;
  status?: string;
};

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={tool.href} className={`tool-preview-card group ${tool.accent}`}>
      <div className="flex items-start justify-between gap-4">
        <span className="tool-preview-icon">
          <tool.icon size={20} />
        </span>
        {tool.status && <span className="tool-preview-status">{tool.status}</span>}
      </div>
      <h3 className="mt-5 text-lg font-bold text-white">{tool.title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-400">{tool.description}</p>
      <div className="mt-5">
        <span className="tool-preview-action rounded-lg px-3 py-2">
          Open tool <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}

export function PyqCard({
  title,
  source,
  questions,
  year,
}: {
  title: string;
  source: string;
  questions: string;
  year: string;
}) {
  return (
    <article className="card h-full p-6">
      <div className="flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300">
          <Layers3 size={24} />
        </span>
        <span className="rounded-md bg-white/[0.06] px-3 py-1.5 text-sm font-semibold text-gray-400">
          {year}
        </span>
      </div>
      <h3 className="mt-7 text-2xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-lg text-gray-400">
        {source} <span className="text-gray-600">-</span> {questions}
      </p>
      <div className="mt-8 flex gap-3">
        <span className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/[0.07] px-4 py-3 font-semibold text-white">
          View <ArrowRight size={16} />
        </span>
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/[0.07] text-gray-400">
          PDF
        </span>
      </div>
    </article>
  );
}
