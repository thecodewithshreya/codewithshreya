import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DynamicArticleContent } from "@/components/dynamic-article-content";

function render(content: string) {
  return renderToStaticMarkup(<DynamicArticleContent content={content} />);
}

describe("DynamicArticleContent", () => {
  it("renders headings, paragraphs and inline formatting", () => {
    const html = render("## Title\n\n### Sub\n\nSome **bold** and `code`.");

    expect(html).toContain(`<h2 id="title">Title</h2>`);
    expect(html).toContain("<h3>Sub</h3>");
    expect(html).toContain("<p>Some <strong>bold</strong> and <code>code</code>.</p>");
  });

  it("renders ordered and unordered lists", () => {
    const html = render("- one\n- two\n\n1. first\n2. second");

    expect(html).toContain("<ul><li>one</li><li>two</li></ul>");
    expect(html).toContain("<ol><li>first</li><li>second</li></ol>");
  });

  it("renders tables without the separator row", () => {
    const html = render("| A | B |\n| --- | --- |\n| 1 | 2 |");

    expect(html).toMatch(/<th[^>]*>A<\/th>/);
    expect(html).toMatch(/<td[^>]*>2<\/td>/);
    expect(html).not.toContain("---");
  });

  it("renders code blocks verbatim with a copy button", () => {
    const html = render("```js\nconst a = 1 < 2;\n```");
    expect(html).toContain("<pre><code>const a = 1 &lt; 2;</code></pre>");
    expect(html).toContain('aria-label="Copy code"');
  });

  it("keeps safe links and strips unsafe ones", () => {
    const html = render(
      "[web](https://example.com) [site](/blog) [mail](mailto:a@b.c) [bad](javascript:alert(1)) [proto](//evil.com)",
    );

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('href="/blog"');
    expect(html).toContain('href="mailto:a@b.c"');
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("//evil.com");
    expect(html).toContain("bad");
  });

  it("renders images with captions and drops unsafe image URLs", () => {
    expect(render("![A diagram](https://cdn.example.com/a.png)")).toMatch(
      /<figure[^>]*><img src="https:\/\/cdn\.example\.com\/a\.png" alt="A diagram"[^>]*\/><figcaption[^>]*>A diagram<\/figcaption><\/figure>/,
    );
    expect(render("![x](data:image/png;base64,AAAA)")).toBe("");

    const scripted = render("![x](javascript:alert(1))");
    expect(scripted).not.toContain("<img");
    expect(scripted).not.toContain("javascript:");
  });

  it("renders quiz fences as quick-check questions", () => {
    const html = render("```quiz\nQ: Pick B\n- A\n* B\n\nQ: Pick C\n* C\n- D\n```");

    expect(html.match(/Quick check/g)).toHaveLength(2);
    expect(html).toContain("Pick B");
    expect(html).toContain("Pick C");
  });

  it("shows a notice for an invalid quiz fence", () => {
    const html = render("```quiz\nQ: Broken\n- only\n```");
    expect(html).toContain("Quiz block error: Question 1 needs at least two options.");
  });
});
