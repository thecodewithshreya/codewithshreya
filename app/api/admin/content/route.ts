import { NextResponse } from "next/server";
import { hasAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { getAdminContent } from "@/lib/dynamic-content";
import { getPrisma } from "@/lib/prisma";

const articleCategories = [
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "Computer Networks",
  "DBMS",
  "DotNet",
  "Programming",
  "Career",
] as const;

const videoTopics = ["Algorithms", "Core CS", "DBMS", "Operating Systems", "Computer Networks", "Programming", "System Design"] as const;
const levels = ["Beginner", "Intermediate", "Advanced"] as const;

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  return NextResponse.json(await getAdminContent());
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload.type !== "string") {
    return NextResponse.json({ error: "Invalid content payload." }, { status: 400 });
  }

  const prisma = getPrisma();

  try {
    if (payload.type === "article") {
      const title = requiredString(payload.title, "Title", 180);
      const slug = slugify(requiredString(payload.slug || payload.title, "Slug", 220));
      const category = enumValue(payload.category, articleCategories, "Computer Networks");
      const excerpt = requiredString(payload.excerpt, "Excerpt", 320);
      const content = requiredString(payload.content, "Content", 12000);

      const article = await prisma.dynamicArticle.create({
        data: {
          title,
          slug,
          category,
          excerpt,
          readTime: optionalString(payload.readTime, 40) || "8 min read",
          color: optionalString(payload.color, 120) || "from-indigo-500/30 to-violet-500/5",
          content,
        },
      });

      return NextResponse.json({ item: article }, { status: 201 });
    }

    if (payload.type === "video") {
      const youtubeUrl = optionalString(payload.youtubeUrl, 500);
      const video = await prisma.dynamicVideo.create({
        data: {
          title: requiredString(payload.title, "Title", 180),
          topic: enumValue(payload.topic, videoTopics, "Core CS"),
          subject: optionalString(payload.subject, 80),
          duration: optionalString(payload.duration, 40) || "Video lesson",
          color: optionalString(payload.color, 120) || "from-violet-600 to-indigo-950",
          level: enumValue(payload.level, levels, "Beginner"),
          description: requiredString(payload.description, "Description", 360),
          youtubeId: optionalString(payload.youtubeId, 80) || extractYouTubeId(youtubeUrl),
          youtubePlaylistId: optionalString(payload.youtubePlaylistId, 120),
          youtubeUrl,
        },
      });

      return NextResponse.json({ item: video }, { status: 201 });
    }

    if (payload.type === "quiz") {
      const quiz = await prisma.dynamicQuiz.create({
        data: {
          title: requiredString(payload.title, "Title", 180),
          topic: requiredString(payload.topic, "Topic", 180),
          questions: Math.max(1, Math.min(Number(payload.questions) || 10, 500)),
          level: enumValue(payload.level, levels, "Beginner"),
          tags: parseTags(payload.tags),
        },
      });

      return NextResponse.json({ item: quiz }, { status: 201 });
    }

    if (payload.type === "pyq") {
      const paper = await prisma.dynamicPyqPaper.create({
        data: {
          title: requiredString(payload.title, "Title", 180),
          source: optionalString(payload.source, 80) || "GATE CSE",
          questions: optionalString(payload.questions, 120) || "Question paper",
          year: requiredString(payload.year, "Year", 10),
          fileId: requiredString(payload.fileId, "Google Drive file ID", 180),
        },
      });

      return NextResponse.json({ item: paper }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown content type." }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save content.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function requireAdmin() {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 },
    );
  }

  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  return null;
}

function requiredString(value: unknown, label: string, maxLength: number) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }

  return value.trim().slice(0, maxLength);
}

function optionalString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function enumValue<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
) {
  return typeof value === "string" && allowed.includes(value)
    ? (value as T[number])
    : fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

function parseTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function extractYouTubeId(url: string | undefined) {
  if (!url) return undefined;

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/live\/([^?&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return undefined;
}
