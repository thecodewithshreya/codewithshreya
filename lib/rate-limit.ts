import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

type RateLimitRule = {
  limit: number;
  windowSeconds: number;
};

export const rateLimits = {
  adminLogin: { limit: 5, windowSeconds: 15 * 60 },
  comment: { limit: 5, windowSeconds: 10 * 60 },
  like: { limit: 30, windowSeconds: 10 * 60 },
  compiler: { limit: 20, windowSeconds: 5 * 60 },
} satisfies Record<string, RateLimitRule>;

export type RateLimitScope = keyof typeof rateLimits;

let warnedUnavailable = false;

// Fixed-window counter per scope and client IP, stored in Postgres so it holds
// across serverless instances. IPs are hashed before storage. If the database
// is unavailable the request is allowed, so the site keeps working without it.
export async function checkRateLimit(request: Request, scope: RateLimitScope) {
  const { limit, windowSeconds } = rateLimits[scope];
  const key = `${scope}:${hashClient(request)}`;

  try {
    const prisma = getPrisma();
    const [row] = await prisma.$queryRaw<{ count: number; window_start: Date }[]>`
      INSERT INTO rate_limits (key, count, window_start)
      VALUES (${key}, 1, now())
      ON CONFLICT (key) DO UPDATE SET
        count = CASE
          WHEN rate_limits.window_start <= now() - make_interval(secs => ${windowSeconds}) THEN 1
          ELSE rate_limits.count + 1
        END,
        window_start = CASE
          WHEN rate_limits.window_start <= now() - make_interval(secs => ${windowSeconds}) THEN now()
          ELSE rate_limits.window_start
        END
      RETURNING count, window_start`;

    if (Math.random() < 0.01) {
      await prisma.rateLimit.deleteMany({
        where: { windowStart: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      });
    }

    if (!row || row.count <= limit) {
      return null;
    }

    const resetAt = new Date(row.window_start).getTime() + windowSeconds * 1000;
    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    const minutes = Math.ceil(retryAfter / 60);

    return NextResponse.json(
      {
        error: `Too many requests. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  } catch (error) {
    if (!warnedUnavailable) {
      warnedUnavailable = true;
      console.error("Rate limiting unavailable; allowing requests", error);
    }
    return null;
  }
}

function hashClient(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "unknown";

  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}
