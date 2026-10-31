import { articles, quizzes, videos } from "@/lib/data";
import { getPrisma } from "@/lib/prisma";
import { normalizeQuizItems, type QuizQuestion } from "@/lib/quiz-format";
import { getStaticQuiz } from "@/lib/quizzes";

export type ArticleSummary = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  color: string;
  slug: string | null;
};

export type VideoSummary = {
  id?: string;
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

export type QuizSummary = {
  id?: string;
  slug?: string;
  title: string;
  topic: string;
  questions: number;
  level: string;
  tags?: string[];
};

export type PyqPaperSummary = {
  id?: string;
  title: string;
  source: string;
  questions: string;
  year: string;
  fileId: string;
};

export type QuizDetail = QuizSummary & {
  slug: string;
  items: QuizQuestion[];
};

export type DynamicArticleDetail = ArticleSummary & {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAllArticles(): Promise<ArticleSummary[]> {
  return [...(await getDynamicArticles()), ...articles];
}

export async function getAllVideos(): Promise<VideoSummary[]> {
  return [...(await getDynamicVideos()), ...videos];
}

export async function getAllQuizzes(): Promise<QuizSummary[]> {
  return [...(await getDynamicQuizzes()), ...quizzes];
}

export async function getAllPyqPapers(
  staticPapers: PyqPaperSummary[],
): Promise<PyqPaperSummary[]> {
  return [...(await getDynamicPyqPapers()), ...staticPapers];
}

export async function getDynamicArticleBySlug(
  slug: string,
): Promise<DynamicArticleDetail | null> {
  return readDynamic(async () => {
    const prisma = getPrisma();
    const article = await prisma.dynamicArticle.findUnique({ where: { slug } });
    return article ? mapArticle(article) : null;
  }, null);
}

// Static quizzes use readable slugs; dynamic quizzes are addressed by their id.
export async function getQuizBySlug(slug: string): Promise<QuizDetail | null> {
  const staticQuiz = getStaticQuiz(slug);

  if (staticQuiz) {
    return { ...staticQuiz, questions: staticQuiz.items.length };
  }

  return readDynamic(async () => {
    const prisma = getPrisma();
    const quiz = await prisma.dynamicQuiz.findUnique({ where: { id: slug } });
    return quiz ? mapQuizDetail(quiz) : null;
  }, null);
}

export async function getDynamicSitemapEntries() {
  // Read separately so one failing table does not hide the other's URLs.
  const [articles, quizzes] = await Promise.all([
    readDynamic(
      () => getPrisma().dynamicArticle.findMany({ select: { slug: true, updatedAt: true } }),
      [],
    ),
    readDynamic(async () => {
      const dynamicQuizzes = await getPrisma().dynamicQuiz.findMany({
        select: { id: true, items: true, updatedAt: true },
      });

      return dynamicQuizzes
        .filter((quiz) => normalizeQuizItems(quiz.items).length > 0)
        .map((quiz) => ({ slug: quiz.id, updatedAt: quiz.updatedAt }));
    }, []),
  ]);

  return { articles, quizzes };
}

export type FeedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt?: Date;
};

// Articles for the RSS feed: dynamic ones (newest first, with dates) then the
// published static ones, which have no publish date.
export async function getFeedArticles(): Promise<FeedArticle[]> {
  const dynamicArticles = await readDynamic(
    () =>
      getPrisma().dynamicArticle.findMany({
        select: { slug: true, title: true, excerpt: true, category: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
    [],
  );
  const seen = new Set(dynamicArticles.map((article) => article.slug));

  return [
    ...dynamicArticles.map(({ createdAt, ...article }) => ({ ...article, publishedAt: createdAt })),
    ...articles.flatMap((article) =>
      article.slug && !seen.has(article.slug)
        ? [{ slug: article.slug, title: article.title, excerpt: article.excerpt, category: article.category }]
        : [],
    ),
  ];
}

export type AdminComment = {
  id: string;
  articleSlug: string;
  articleTitle: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export async function getRecentComments(limit = 100): Promise<AdminComment[]> {
  return readDynamic(async () => {
    const prisma = getPrisma();
    const comments = await prisma.articleComment.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
    });
    const slugs = [...new Set(comments.map((comment) => comment.articleSlug))];
    const dynamicArticles = await prisma.dynamicArticle.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true, title: true },
    });
    const titles = new Map<string, string>([
      ...articles.flatMap((article) => (article.slug ? [[article.slug, article.title] as const] : [])),
      ...dynamicArticles.map((article) => [article.slug, article.title] as const),
    ]);

    return comments.map((comment) => ({
      id: comment.id,
      articleSlug: comment.articleSlug,
      articleTitle: titles.get(comment.articleSlug) ?? comment.articleSlug,
      authorName: comment.authorName,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
    }));
  }, []);
}

export async function getAdminContent() {
  // Each table is read on its own (null = failed), so one failing table, such
  // as one waiting for a migration, does not hide the others from the admin page.
  const [articles, videos, quizzes, pyqs] = await Promise.all([
    readDynamic(async () => {
      const rows = await getPrisma().dynamicArticle.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(mapArticle);
    }, null),
    readDynamic(async () => {
      const rows = await getPrisma().dynamicVideo.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(mapVideo);
    }, null),
    readDynamic(async () => {
      const rows = await getPrisma().dynamicQuiz.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(mapQuizDetail);
    }, null),
    readDynamic(async () => {
      const rows = await getPrisma().dynamicPyqPaper.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(mapPyqPaper);
    }, null),
  ]);
  const unavailable = (
    [
      ["article", articles],
      ["video", videos],
      ["quiz", quizzes],
      ["pyq", pyqs],
    ] as const
  ).flatMap(([type, rows]) => (rows ? [] : [type]));

  return {
    articles: articles ?? [],
    videos: videos ?? [],
    quizzes: quizzes ?? [],
    pyqs: pyqs ?? [],
    unavailable,
  };
}

async function getDynamicArticles(): Promise<ArticleSummary[]> {
  return readDynamic(async () => {
    const prisma = getPrisma();
    // Summary fields only: these lists reach client components, so the
    // article bodies would otherwise be sent to the browser on every list page.
    const dynamicArticles = await prisma.dynamicArticle.findMany({
      select: { title: true, slug: true, category: true, excerpt: true, readTime: true, color: true },
      orderBy: { createdAt: "desc" },
    });
    return dynamicArticles.map(({ readTime, ...article }) => ({ ...article, date: readTime }));
  }, []);
}

async function getDynamicVideos(): Promise<VideoSummary[]> {
  return readDynamic(async () => {
    const prisma = getPrisma();
    const dynamicVideos = await prisma.dynamicVideo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return dynamicVideos.map(mapVideo);
  }, []);
}

async function getDynamicQuizzes(): Promise<QuizSummary[]> {
  return readDynamic(async () => {
    const prisma = getPrisma();
    const dynamicQuizzes = await prisma.dynamicQuiz.findMany({
      orderBy: { createdAt: "desc" },
    });
    return dynamicQuizzes.map(mapQuiz);
  }, []);
}

async function getDynamicPyqPapers(): Promise<PyqPaperSummary[]> {
  return readDynamic(async () => {
    const prisma = getPrisma();
    const dynamicPapers = await prisma.dynamicPyqPaper.findMany({
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });
    return dynamicPapers.map(mapPyqPaper);
  }, []);
}

async function readDynamic<T>(reader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await reader();
  } catch (error) {
    console.error("Dynamic content unavailable", error);
    return fallback;
  }
}

function mapArticle(article: {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  readTime: string;
  color: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}): DynamicArticleDetail {
  return {
    id: article.id,
    category: article.category,
    title: article.title,
    excerpt: article.excerpt,
    date: article.readTime,
    color: article.color,
    slug: article.slug,
    content: article.content,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}

function mapVideo(video: {
  id?: string;
  title: string;
  topic: string;
  subject: string | null;
  duration: string;
  color: string;
  level: string;
  description: string;
  youtubeId: string | null;
  youtubePlaylistId: string | null;
  youtubeUrl: string | null;
}): VideoSummary {
  return {
    id: video.id,
    title: video.title,
    topic: video.topic,
    subject: video.subject ?? undefined,
    duration: video.duration,
    color: video.color,
    level: video.level,
    description: video.description,
    youtubeId: video.youtubeId ?? undefined,
    youtubePlaylistId: video.youtubePlaylistId ?? undefined,
    youtubeUrl: video.youtubeUrl ?? undefined,
  };
}

type QuizRow = {
  id: string;
  title: string;
  topic: string;
  level: string;
  tags: string[];
  items: unknown;
};

function mapQuiz(quiz: QuizRow): QuizSummary {
  const { items, ...summary } = mapQuizDetail(quiz);
  return summary;
}

function mapQuizDetail(quiz: QuizRow): QuizDetail {
  const items = normalizeQuizItems(quiz.items);

  return {
    id: quiz.id,
    slug: quiz.id,
    title: quiz.title,
    topic: quiz.topic,
    questions: items.length,
    level: quiz.level,
    tags: quiz.tags,
    items,
  };
}

function mapPyqPaper(paper: {
  id?: string;
  title: string;
  source: string;
  questions: string;
  year: string;
  fileId: string;
}): PyqPaperSummary {
  return {
    id: paper.id,
    title: paper.title,
    source: paper.source,
    questions: paper.questions,
    year: paper.year,
    fileId: paper.fileId,
  };
}
