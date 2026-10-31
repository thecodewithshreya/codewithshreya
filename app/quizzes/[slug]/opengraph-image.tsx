import { getQuizBySlug } from "@/lib/dynamic-content";
import { renderShareImage, shareImageSize } from "@/lib/share-image";

export const size = shareImageSize;
export const contentType = "image/png";
export const alt = "CodeWithShreya practice quiz";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    return renderShareImage({ eyebrow: "Quiz", title: "Practice Computer Science Quizzes" });
  }

  return renderShareImage({
    eyebrow: `${quiz.level} quiz · ${quiz.items.length} questions`,
    title: quiz.title,
    subtitle: quiz.topic,
  });
}
