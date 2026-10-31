import { describe, expect, it } from "vitest";
import { buildRssFeed } from "@/lib/rss";

describe("buildRssFeed", () => {
  it("escapes text and includes dates only when known", () => {
    const feed = buildRssFeed([
      {
        slug: "joins",
        title: "Joins <and> \"rows\" & more",
        excerpt: "Inner & outer",
        category: "DotNet",
        publishedAt: new Date("2026-10-01T10:00:00Z"),
      },
      { slug: "static-one", title: "Static", excerpt: "No date", category: "DBMS" },
    ]);

    expect(feed).toContain("<title>Joins &lt;and&gt; &quot;rows&quot; &amp; more</title>");
    expect(feed).toContain("<link>https://codewithshreya.com/blog/joins</link>");
    expect(feed).toContain("<category>.NET</category>");
    expect(feed).toContain("<pubDate>Thu, 01 Oct 2026 10:00:00 GMT</pubDate>");
    expect(feed.match(/<pubDate>/g)).toHaveLength(1);
    expect(feed.match(/<item>/g)).toHaveLength(2);
  });

  it("produces a valid empty channel", () => {
    const feed = buildRssFeed([]);
    expect(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(feed).not.toContain("<item>");
  });
});
