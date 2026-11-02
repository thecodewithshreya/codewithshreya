import { ArrowRight, Clock, FileQuestion, Layers3 } from "lucide-react";
import Link from "next/link";
import { ArticleReadBadge, QuizBestBadge } from "./progress-badges";
import { PyqCardActions } from "./pyq-card-actions";
import { VideoEmbedPreview } from "./video-embed-preview";
import { TitleText } from "./title-text";
import { categoryLabel, plainTitle } from "@/lib/title";
import { articleTone, cardBand, iconTile, levelDots, quizTone, videoPoster, videoTone } from "@/lib/palette";

type Article = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  color: string;
  slug: string | null;
};

export function ArticleCard({ article }: { article: Article }) {
  const label = categoryLabel(article.category);

  return (
    <article className={`card h-full overflow-hidden ${article.slug ? "card-hover" : ""}`}>
      <div className={`flex h-20 items-start justify-between gap-2 bg-gradient-to-br ${cardBand[articleTone(article.category)]} p-4`}>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-200">
          {label}
        </span>
        {article.slug ? <ArticleReadBadge slug={article.slug} /> : null}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={13} /> {article.date}
        </div>
        <h3 className="mt-3 text-base font-semibold leading-snug"><TitleText title={article.title} /></h3>
        <p className="mt-2 text-sm leading-6 text-gray-400">{article.excerpt}</p>
        {article.slug ? (
          <Link
            href={`/blog/${article.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-violet-400 hover:text-violet-300"
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

  return (
    <article className="card group h-full overflow-hidden">
      <div className="relative grid aspect-video place-items-center overflow-hidden bg-[#20232c]">
        <VideoEmbedPreview
          title={plainTitle(video.title)}
          youtubeId={video.youtubeId}
          embedUrl={embedUrl}
          color={videoPoster[videoTone(video)]}
          duration={video.duration}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <LevelBadge level={level} />
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock size={15} /> {video.duration}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-bold leading-snug"><TitleText title={video.title} /></h3>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          {video.description ?? `Focused ${video.topic} lesson with visual examples and practice notes.`}
        </p>
        {video.youtubeUrl ? (
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300"
          >
            Watch on YouTube <ArrowRight size={15} />
          </a>
        ) : (
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-400">
            Watch now <ArrowRight size={15} />
          </span>
        )}
      </div>
    </article>
  );
}

type Quiz = {
  slug?: string;
  title: string;
  topic: string;
  questions: number;
  level: string;
  tags?: string[];
};

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const playable = Boolean(quiz.slug) && quiz.questions > 0;

  const card = (
    <article className={`card h-full p-4 ${playable ? "card-hover" : ""}`}>
      <div className="flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-lg ${iconTile[quizTone(quiz.slug)]}`}>
          <FileQuestion size={20} />
        </span>
        <LevelBadge level={quiz.level} />
      </div>
      <h3 className="mt-5 text-lg font-bold leading-snug"><TitleText title={quiz.title} /></h3>
      {playable && quiz.slug ? (
        <div className="mt-1">
          <QuizBestBadge slug={quiz.slug} total={quiz.questions} />
        </div>
      ) : null}
      <p className="mt-2 text-sm text-gray-400">
        {quiz.questions > 0 ? `${quiz.questions} questions` : "No questions yet"} <span aria-hidden="true" className="text-gray-600">-</span> {quiz.topic}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(quiz.tags ?? [quiz.topic, quiz.level]).slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md bg-white/[0.06] px-3 py-1.5 text-sm text-gray-400">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5">
        {playable ? (
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.07] px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-white/[0.1]">
            Start quiz <ArrowRight size={15} />
          </span>
        ) : (
          <span className="inline-flex w-full items-center justify-center rounded-lg bg-white/[0.03] px-4 py-3 text-sm font-semibold text-gray-500">
            Questions coming soon
          </span>
        )}
      </div>
    </article>
  );

  return playable ? (
    <Link href={`/quizzes/${quiz.slug}`} className="group block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}

// Difficulty shown as 1-3 dots in a neutral badge, so green and red stay reserved for right and wrong.
function LevelBadge({ level }: { level: string }) {
  const dots = levelDots(level);

  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.04] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={`h-1.5 w-1.5 rounded-full ${dot <= dots ? "bg-violet-400" : "bg-gray-500/40"}`}
          />
        ))}
      </span>
      {level}
    </span>
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
          {source} <span aria-hidden="true" className="text-slate-300 dark:text-gray-600">-</span> {questions}
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
