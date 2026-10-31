import {
  getAllArticles,
  getAllPyqPapers,
  getAllQuizzes,
  getAllVideos,
  type ArticleSummary,
  type PyqPaperSummary,
  type QuizSummary,
  type VideoSummary,
} from "@/lib/dynamic-content";
import { staticPyqPapers } from "@/lib/pyq";

export type SearchResults = {
  articles: ArticleSummary[];
  videos: VideoSummary[];
  quizzes: QuizSummary[];
  pyqs: PyqPaperSummary[];
};

type WeightedField = [value: string | undefined, weight: number];

export const minQueryLength = 2;

export async function searchSite(query: string): Promise<SearchResults> {
  const terms = tokenize(query);

  if (!terms.length || query.trim().length < minQueryLength) {
    return { articles: [], videos: [], quizzes: [], pyqs: [] };
  }

  const [articles, videos, quizzes, pyqs] = await Promise.all([
    getAllArticles(),
    getAllVideos(),
    getAllQuizzes(),
    getAllPyqPapers(staticPyqPapers),
  ]);

  return {
    articles: rank(
      articles.filter((article) => article.slug),
      terms,
      (article) => [
        [article.title, 3],
        [article.category === "DotNet" ? ".NET DotNet C#" : article.category, 2],
        [article.excerpt, 1],
      ],
    ),
    videos: rank(videos, terms, (video) => [
      [video.title, 3],
      [`${video.topic} ${video.subject ?? ""} ${video.level ?? ""}`, 2],
      [video.description, 1],
    ]),
    quizzes: rank(
      quizzes.filter((quiz) => quiz.slug && quiz.questions > 0),
      terms,
      (quiz) => [
        [quiz.title, 3],
        [`${quiz.topic} ${quiz.tags?.join(" ") ?? ""} ${quiz.level}`, 2],
      ],
    ),
    pyqs: rank(pyqs, terms, (paper) => [
      [paper.title, 3],
      [`${paper.source} ${paper.year}`, 2],
    ]),
  };
}

// Every term must appear in at least one field; matches in heavier fields rank higher.
function rank<T>(items: T[], terms: string[], fields: (item: T) => WeightedField[]): T[] {
  return items
    .map((item, index) => {
      const normalized = fields(item).map(([value, weight]) => [normalize(value ?? ""), weight] as const);
      let score = 0;

      for (const term of terms) {
        const termScore = normalized.reduce(
          (best, [value, weight]) => (value.includes(term) ? Math.max(best, weight) : best),
          0,
        );
        if (!termScore) return null;
        score += termScore;
      }

      return { item, score, index };
    })
    .filter((entry): entry is { item: T; score: number; index: number } => entry !== null)
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .map((entry) => entry.item);
}

function tokenize(query: string) {
  return [...new Set(normalize(query).split(/\s+/).filter(Boolean))].slice(0, 8);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}#+.\s]/gu, " ");
}
