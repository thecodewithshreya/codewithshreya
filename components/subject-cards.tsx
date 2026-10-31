import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { subjectHref, tracks, type Subject, type SubjectContent } from "@/lib/subjects";

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

export function subjectSummary(content: SubjectContent) {
  const parts = [
    content.articles.length ? plural(content.articles.length, "article", "articles") : null,
    content.videos.length ? plural(content.videos.length, "video", "videos") : null,
    content.quizzes.length ? plural(content.quizzes.length, "quiz", "quizzes") : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Lessons being added";
}

export function SubjectCard({ subject, content }: { subject: Subject; content: SubjectContent }) {
  return (
    <Link href={subjectHref(subject)} className="card card-hover group flex h-full flex-col p-5">
      <div className="flex flex-wrap gap-1.5">
        {subject.tracks.map((track) => (
          <span
            key={track}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              track === "gate" ? "bg-violet-500/15 text-violet-300" : "bg-cyan-500/15 text-cyan-300"
            }`}
          >
            {tracks[track].label}
          </span>
        ))}
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug">{subject.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-gray-400">{subject.description}</p>
      <p className="mt-4 flex items-center justify-between gap-2 text-xs font-medium text-gray-500">
        {subjectSummary(content)}
        <ArrowRight size={16} className="shrink-0 text-violet-400 transition group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}
