import { createElement } from "react";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { extractHeadings, headingId, nodeText, plainHeading } from "@/lib/headings";

describe("article headings", () => {
  it("lists level-2 headings outside code fences", () => {
    const markdown = [
      "# Title",
      "## First part",
      "text",
      "```bash",
      "## not a heading",
      "```",
      "### Sub part",
      "## Using `var` and **bold** with [links](https://example.com)",
      "## First part",
    ].join("\n");

    expect(extractHeadings(markdown)).toEqual([
      { id: "first-part", text: "First part" },
      { id: "using-var-and-bold-with-links", text: "Using var and bold with links" },
    ]);
  });

  it("includes h1 lines when asked, as the admin renderer shows them as h2", () => {
    expect(extractHeadings("# Intro\n## Next", { includeH1: true }).map((h) => h.id)).toEqual(["intro", "next"]);
  });

  it("gives the rendered MDX heading the same id as the extracted one", () => {
    const rendered = createElement("h2", null, "Using ", createElement("code", null, "var"), " safely");
    expect(headingId(nodeText(rendered))).toBe(headingId(plainHeading("Using `var` safely")));
  });

  it("finds unique headings in every static article", () => {
    const dir = join(process.cwd(), "content", "blog");
    for (const file of readdirSync(dir).filter((name) => name.endsWith(".mdx"))) {
      const source = readFileSync(join(dir, file), "utf8");
      const headings = extractHeadings(source);
      expect(headings.length, file).toBeGreaterThan(0);
      expect(headings.length, file).toBe(source.split(/\r?\n/).filter((line) => /^##\s/.test(line)).length);
    }
  });
});
