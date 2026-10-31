import { getAllArticles, getAllQuizzes, getAllVideos } from "@/lib/dynamic-content";
import { contentForSubject, subjects, type Subject, type SubjectContent } from "@/lib/subjects";

// Merged static + admin content, read once per request for the track, topic and home pages.
export async function getSiteContent(): Promise<SubjectContent> {
  const [articles, videos, quizzes] = await Promise.all([getAllArticles(), getAllVideos(), getAllQuizzes()]);
  return { articles, videos, quizzes };
}

export function subjectsWithContent(all: SubjectContent, list: Subject[] = subjects) {
  return list.map((subject) => ({ subject, content: contentForSubject(subject, all) }));
}
