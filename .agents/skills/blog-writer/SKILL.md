---
name: blog-writer
description: Plan, draft, revise, fact-check, and publish engaging CodeWithShreya MDX articles. Use for requests to create, outline, improve, review, fact-check, optimize, or publish a blog post, tutorial, study note, interview guide, or PYQ explanation in this repository, including article registration, ArticleQuiz usage, SEO metadata, and build verification. Do not use for unrelated UI or backend work.
---

# CodeWithShreya Blog Writer

Create accurate, engaging articles that match this repository's MDX architecture and editorial voice.

## Workflow

1. Inspect the existing patterns before editing:
   - `content/blog/time-and-space-complexity.mdx`
   - `lib/data.ts`
   - `lib/articles.ts`
   - `mdx-components.tsx`
   - `app/blog/[slug]/page.tsx`
2. Establish the topic, target reader, search intent, and learning outcome. Use beginner-to-intermediate CS students as the default audience.
3. Plan before drafting unless the user explicitly requests direct implementation. Include:
   - a concrete opening problem or question
   - learning outcomes
   - common misconceptions
   - one running example
   - sections, code or tables, and an interactive check
4. Read `references/editorial-standards.md` before drafting or substantially revising article prose.
5. Verify claims that are current, niche, or uncertain. Use primary documentation for technical research. Never invent statistics, quotations, APIs, or citations.
6. Write the article as `content/blog/<slug>.mdx`.
7. Register a published article in both places:
   - add its catalogue entry and slug in `lib/data.ts`
   - add an explicit loader in `lib/articles.ts`
8. Do not manually edit `app/sitemap.ts`; it derives published article URLs from `lib/data.ts`.
9. Run `npm run lint` and `npm run build`.
10. Review the diff for broken MDX, duplicate explanations, unsupported claims, generic filler, and accidental unrelated edits.

## MDX Requirements

- Use one H1 matching the catalogue title.
- Prefer 1,200–1,800 words unless the topic requires a different length.
- Keep paragraphs short and explain why before implementation details.
- Use one coherent example across sections where practical.
- Use fenced code blocks with the correct language.
- Include a useful table only when it clarifies a comparison.
- Include at least one `<ArticleQuiz />` for a full tutorial.
- Explain code immediately before or after it.
- End with a practical summary or small reader challenge.
- Do not use imports for globally registered MDX components.

Example:

```mdx
<ArticleQuiz
  question="Which data structure follows FIFO order?"
  options={["Stack", "Queue", "Tree", "Graph"]}
  answer="Queue"
/>
```

## Catalogue Requirements

For `lib/data.ts`, provide:

- a category consistent with existing navigation
- a specific title
- a concise, search-friendly excerpt
- a realistic reading time
- an existing gradient style unless a new palette is justified
- a unique lowercase hyphenated slug

Keep unpublished cards at `slug: null`. Never point a card to an article that does not exist.

## Revision Modes

- **Outline only:** Return the plan without modifying files.
- **Draft only:** Create or revise MDX without publishing it when requested.
- **Publish:** Create MDX, register it, and verify the build.
- **Editorial review:** Report problems first; edit only when the user requests changes.
- **Fact-check:** Separate confirmed facts, corrections, and unresolved claims.

## Completion Report

Report the article path, slug, registrations changed, research limitations, and verification results. Keep the report concise.
