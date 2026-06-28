import { NextResponse } from "next/server";
import { hasArticle } from "@/lib/articles";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

type CommentRow = {
  id: string;
  authorName: string;
  body: string;
  createdAt: Date;
};

function invalidRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;

  if (!hasArticle(slug)) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const visitorId = new URL(request.url).searchParams.get("visitorId")?.slice(0, 100);
  const prisma = getPrisma();
  const [likeCount, comments, existingLike] = await Promise.all([
    prisma.articleLike.count({ where: { articleSlug: slug } }),
    prisma.articleComment.findMany({
      where: { articleSlug: slug },
      select: {
        id: true,
        authorName: true,
        body: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
    }),
    visitorId
      ? prisma.articleLike.findUnique({
          where: {
            articleSlug_visitorId: {
              articleSlug: slug,
              visitorId,
            },
          },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);
  const liked = visitorId
    ? Boolean(existingLike)
    : false;

  return NextResponse.json({
    likeCount,
    liked,
    comments,
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params;

  if (!hasArticle(slug)) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return invalidRequest("Invalid request body.");
  }

  if (!payload || typeof payload !== "object" || !("action" in payload)) {
    return invalidRequest("An action is required.");
  }

  const prisma = getPrisma();

  if (payload.action === "toggle-like") {
    const visitorId =
      "visitorId" in payload && typeof payload.visitorId === "string"
        ? payload.visitorId.trim().slice(0, 100)
        : "";

    if (visitorId.length < 8) {
      return invalidRequest("A valid visitor ID is required.");
    }

    const likeKey = {
      articleSlug_visitorId: {
        articleSlug: slug,
        visitorId,
      },
    };
    const existing = await prisma.articleLike.findUnique({
      where: likeKey,
      select: { id: true },
    });
    let liked: boolean;

    if (existing) {
      await prisma.articleLike.delete({ where: likeKey });
      liked = false;
    } else {
      await prisma.articleLike.create({
        data: { articleSlug: slug, visitorId },
      });
      liked = true;
    }

    const likeCount = await prisma.articleLike.count({
      where: { articleSlug: slug },
    });

    return NextResponse.json({ liked, likeCount });
  }

  if (payload.action === "comment") {
    const authorName =
      "authorName" in payload && typeof payload.authorName === "string"
        ? payload.authorName.trim()
        : "";
    const body =
      "body" in payload && typeof payload.body === "string"
        ? payload.body.trim()
        : "";

    if (authorName.length < 2 || authorName.length > 50) {
      return invalidRequest("Name must contain between 2 and 50 characters.");
    }

    if (body.length < 2 || body.length > 1_000) {
      return invalidRequest("Comment must contain between 2 and 1,000 characters.");
    }

    const comment: CommentRow = await prisma.articleComment.create({
      data: {
        articleSlug: slug,
        authorName,
        body,
      },
      select: {
        id: true,
        authorName: true,
        body: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  }

  return invalidRequest("Unsupported action.");
}
