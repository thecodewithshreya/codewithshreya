import { useEffect, useState } from "react";

// Learning progress lives only in this browser's localStorage. Every access is
// guarded because storage can be blocked (private windows, strict settings).

const readArticlesKey = "codewithshreya-read-articles";
const quizBestPrefix = "codewithshreya-quiz-best-";
const changeEvent = "codewithshreya-progress-change";

export function quizBestKey(slug: string) {
  return `${quizBestPrefix}${slug}`;
}

export function getReadArticles(): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(readArticlesKey) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

export function markArticleRead(slug: string) {
  const read = getReadArticles();
  if (read[slug]) return;

  write(readArticlesKey, JSON.stringify({ ...read, [slug]: new Date().toISOString() }));
}

export function getQuizBest(slug: string): number | null {
  try {
    const stored = window.localStorage.getItem(quizBestKey(slug));
    return stored !== null && Number.isFinite(Number(stored)) ? Number(stored) : null;
  } catch {
    return null;
  }
}

export function saveQuizBest(slug: string, score: number) {
  const best = getQuizBest(slug);
  if (best !== null && score <= best) return;

  write(quizBestKey(slug), String(score));
}

// Re-reads a progress value on mount and whenever progress changes in this tab or another one.
export function useProgress<T>(read: () => T, initial: T): T {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const update = () => setValue(read());
    update();

    window.addEventListener(changeEvent, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(changeEvent, update);
      window.removeEventListener("storage", update);
    };
    // `read` is expected to be stable for the component's lifetime.
  }, []);

  return value;
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(changeEvent));
  } catch {
    // Progress is a convenience; ignore storage failures.
  }
}
