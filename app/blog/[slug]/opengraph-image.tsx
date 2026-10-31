import { articles } from "@/lib/data";
import { getDynamicArticleBySlug } from "@/lib/dynamic-content";
import { renderShareImage, shareImageSize } from "@/lib/share-image";
import { categoryLabel } from "@/lib/title";

export const size = shareImageSize;
export const contentType = "image/png";
export const alt = "CodeWithShreya article";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article =
    articles.find((item) => item.slug === slug) ?? (await getDynamicArticleBySlug(slug));

  if (!article) {
    return renderShareImage({ eyebrow: "Article", title: "Learn Computer Science in One Place" });
  }

  return renderShareImage({
    eyebrow: categoryLabel(article.category),
    title: article.title,
    subtitle: article.excerpt,
  });
}
