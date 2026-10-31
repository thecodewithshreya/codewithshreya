import { getFeedArticles } from "@/lib/dynamic-content";
import { buildRssFeed } from "@/lib/rss";

// Regenerate hourly so articles added from the admin page are picked up.
export const revalidate = 3600;

export async function GET() {
  return new Response(buildRssFeed(await getFeedArticles()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
