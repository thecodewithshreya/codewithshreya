"use client";

import { CheckCircle2, Trophy } from "lucide-react";
import { useEffect, useRef } from "react";
import { getQuizBest, getReadArticles, markArticleRead, useProgress } from "@/lib/progress";

export function ArticleReadBadge({ slug }: { slug: string }) {
  const read = useProgress(() => Boolean(getReadArticles()[slug]), false);
  if (!read) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-black/20 px-2.5 py-1 text-xs font-medium text-emerald-300">
      <CheckCircle2 size={12} />
      Read
    </span>
  );
}

export function QuizBestBadge({ slug, total }: { slug: string; total: number }) {
  const best = useProgress(() => getQuizBest(slug), null);
  if (best === null) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300">
      <Trophy size={12} />
      Best {Math.min(best, total)}/{total}
    </span>
  );
}

export function ReadCount({ slugs }: { slugs: string[] }) {
  const count = useProgress(() => {
    const read = getReadArticles();
    return slugs.filter((slug) => read[slug]).length;
  }, 0);
  if (!count) return null;

  return (
    <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-300">
      <CheckCircle2 size={15} />
      You have read {count} of {slugs.length} articles
    </p>
  );
}

// Marks the article as read once the reader scrolls to the end of its content.
export function MarkReadOnFinish({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        markArticleRead(slug);
        observer.disconnect();
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [slug]);

  return <div ref={ref} aria-hidden className="h-px" />;
}
