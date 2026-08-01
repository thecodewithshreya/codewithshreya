import { ArrowRight, Clock, FileQuestion, Layers3 } from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";
import { PyqCardActions } from "./pyq-card-actions";
import { VideoEmbedPreview } from "./video-embed-preview";

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
  subject?: string;
  duration: string;
  color: string;
  level?: string;
  description?: string;
  youtubeId?: string;
  youtubePlaylistId?: string;
  youtubePlaylistIndex?: number;
  youtubeUrl?: string;
};

export function VideoCard({ video }: { video: Video }) {
  const level = video.level ?? (video.topic === "Core CS" ? "Intermediate" : "Beginner");
  const playlistIndexQuery = video.youtubePlaylistIndex ? `&index=${video.youtubePlaylistIndex}` : "";
  const embedUrl = video.youtubeId
    ? `https://www.youtube.com/embed/${video.youtubeId}${video.youtubePlaylistId ? `?list=${video.youtubePlaylistId}${playlistIndexQuery}` : ""}`
    : video.youtubePlaylistId
      ? `https://www.youtube.com/embed/videoseries?list=${video.youtubePlaylistId}${playlistIndexQuery}`
      : null;
  const levelColor =
    level === "Advanced"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
      : level === "Intermediate"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

  return (
    <article className="card group h-full overflow-hidden">
      <div className="relative grid aspect-video place-items-center overflow-hidden bg-[#20232c]">
        <VideoEmbedPreview
          title={video.title}
          youtubeId={video.youtubeId}
          embedUrl={embedUrl}
          color={video.color}
          duration={video.duration}
        />
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
        {video.youtubeUrl ? (
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-300"
          >
            Watch on YouTube <ArrowRight size={15} />
          </a>
        ) : (
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
            Watch now <ArrowRight size={15} />
          </span>
        )}
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
  viewUrl,
  previewUrl,
  downloadUrl,
}: {
  title: string;
  source: string;
  questions: string;
  year: string;
  viewUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
}) {
  return (
    <article className="card h-full overflow-hidden !bg-white/90 shadow-lg shadow-indigo-950/5 dark:!bg-[#0f1422]">
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-100 text-[#5f33d7] dark:bg-violet-500/10 dark:text-violet-300">
            <Layers3 size={18} />
          </span>
          <span className="text-xs font-medium text-slate-600 dark:text-gray-400">
            {year}
          </span>
        </div>
        <h3 className="mt-4 text-sm font-bold leading-snug text-slate-950 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-gray-400">
          {source} <span className="text-slate-300 dark:text-gray-600">-</span> {questions}
        </p>
      </div>
      <PyqCardActions
        title={title}
        viewUrl={viewUrl}
        previewUrl={previewUrl}
        downloadUrl={downloadUrl}
      />
    </article>
  );
}
