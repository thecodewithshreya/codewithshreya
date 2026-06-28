import { ArrowRight, Clock, FileQuestion, Play } from "lucide-react";
import Link from "next/link";

type Article = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  color: string;
  slug: string | null;
};

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className={`card overflow-hidden ${article.slug ? "card-hover" : ""}`}>
      <div className={`h-32 bg-gradient-to-br ${article.color} p-5`}>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-200">
          {article.category}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={13} /> {article.date}
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug">{article.title}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-400">{article.excerpt}</p>
        {article.slug ? (
          <Link
            href={`/blog/${article.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            Read article <ArrowRight size={15} />
          </Link>
        ) : (
          <span className="mt-4 inline-flex text-sm text-gray-500">Coming soon</span>
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
};

export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="card overflow-hidden">
      <div className={`group relative grid aspect-video place-items-center bg-gradient-to-br ${video.color}`}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-indigo-700 shadow-xl transition group-hover:scale-110">
          <Play size={20} fill="currentColor" />
        </span>
        <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs">
          {video.duration}
        </span>
      </div>
      <div className="p-5">
        <span className="text-xs font-medium text-indigo-400">{video.topic}</span>
        <h3 className="mt-2 font-semibold">{video.title}</h3>
        <p className="mt-3 text-sm text-gray-500">Video coming soon</p>
      </div>
    </article>
  );
}

type Quiz = {
  title: string;
  topic: string;
  questions: number;
  level: string;
};

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const levelColor =
    quiz.level === "Advanced"
      ? "text-pink-300 bg-pink-500/10"
      : quiz.level === "Intermediate"
        ? "text-amber-300 bg-amber-500/10"
        : "text-emerald-300 bg-emerald-500/10";

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <FileQuestion size={22} />
        </span>
        <span className={`rounded-full px-3 py-1 text-xs ${levelColor}`}>{quiz.level}</span>
      </div>
      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-indigo-400">{quiz.topic}</p>
      <h3 className="mt-2 text-lg font-semibold">{quiz.title}</h3>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm text-gray-500">{quiz.questions} questions</span>
        <span className="text-sm font-medium text-gray-500">Coming soon</span>
      </div>
    </article>
  );
}
