import { articles, quizzes, videos } from "@/lib/data";
import { getPrisma } from "@/lib/prisma";

export type ArticleSummary = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  color: string;
  slug: string | null;
};

export type VideoSummary = {
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
  title: string;
  topic: string;
  questions: number;
  level: string;
  tags?: string[];
};

export type PyqPaperSummary = {
  title: string;
  source: string;
  questions: string;
  year: string;
  fileId: string;
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

export async function getAdminContent() {
  return readDynamic(
    async () => {
      const prisma = getPrisma();
      const [dynamicArticles, dynamicVideos, dynamicQuizzes, dynamicPyqPapers] =
        await Promise.all([
          prisma.dynamicArticle.findMany({ orderBy: { createdAt: "desc" } }),
          prisma.dynamicVideo.findMany({ orderBy: { createdAt: "desc" } }),
          prisma.dynamicQuiz.findMany({ orderBy: { createdAt: "desc" } }),
          prisma.dynamicPyqPaper.findMany({ orderBy: { createdAt: "desc" } }),
        ]);

      return {
        articles: dynamicArticles.map(mapArticle),
        videos: dynamicVideos.map(mapVideo),
        quizzes: dynamicQuizzes.map(mapQuiz),
        pyqs: dynamicPyqPapers.map(mapPyqPaper),
      };
    },
    { articles: [], videos: [], quizzes: [], pyqs: [] },
  );
}

async function getDynamicArticles(): Promise<ArticleSummary[]> {
  return readDynamic(async () => {
    const prisma = getPrisma();
    const dynamicArticles = await prisma.dynamicArticle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return dynamicArticles.map(mapArticle);
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

function mapQuiz(quiz: {
  title: string;
  topic: string;
  questions: number;
  level: string;
  tags: string[];
}): QuizSummary {
  return {
    title: quiz.title,
    topic: quiz.topic,
    questions: quiz.questions,
    level: quiz.level,
    tags: quiz.tags,
  };
}

function mapPyqPaper(paper: {
  title: string;
  source: string;
  questions: string;
  year: string;
  fileId: string;
}): PyqPaperSummary {
  return {
    title: paper.title,
    source: paper.source,
    questions: paper.questions,
    year: paper.year,
    fileId: paper.fileId,
  };
}
