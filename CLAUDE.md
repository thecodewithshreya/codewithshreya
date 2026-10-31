# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CodeWithShreya is a Next.js 16 (App Router, React 19, TypeScript, Tailwind 3) learning platform: CS blog articles, videos, quizzes, GATE PYQ papers, an online compiler, and an admin content manager. Deployed on Vercel with Neon Postgres via Prisma 7.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run lint         # next typegen && tsc --noEmit (type-check only; there is no ESLint)
npm test             # Vitest, runs **/*.test.{ts,tsx} once
npx vitest run lib/search.test.ts   # a single test file (add -t "name" for one test)
npm run db:generate  # regenerate Prisma Client (also runs on postinstall)
npm run db:migrate   # create a new migration locally (prisma migrate dev)
npm run db:deploy    # apply checked-in migrations (use for production/Neon)
npm run db:studio
```

Tests sit next to the code they cover (`lib/*.test.ts`, `components/*.test.tsx`); `vitest.config.ts` maps the `@/` alias. Tests that touch the content layer mock `@/lib/dynamic-content` rather than using a database. Verify changes with `npm test`, `npm run lint` and `npm run build`.

## Environment

See `.env.example`. `DATABASE_URL` (pooled Neon) is used at runtime by `lib/prisma.ts` through `@prisma/adapter-neon`; `prisma.config.ts` uses `DIRECT_URL` → `DATABASE_URL_UNPOOLED` → `DATABASE_URL` for migrations. `JUDGE0_*` configures the compiler API; `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` enable the admin area.

The site must keep working without a database: likes/comments and admin-managed content just become unavailable.

## Architecture

### Two content sources, merged at read time

Every content type (articles, videos, quizzes, PYQ papers) has two sources:

1. **Static content** — hard-coded arrays in `lib/data.ts` (quizzes in `lib/quizzes.ts`, PYQ papers in `lib/pyq.ts`). Static articles are MDX files in `content/blog/<slug>.mdx`.
2. **Dynamic content** — Prisma models `DynamicArticle`, `DynamicVideo`, `DynamicQuiz`, `DynamicPyqPaper`, created through the admin UI.

`lib/dynamic-content.ts` merges them (`getAllArticles`, `getAllVideos`, …, dynamic items first). All DB reads go through `readDynamic(reader, fallback)`, which logs and returns the fallback on any error. That is how the site survives a missing DB. Pages that read dynamic content export `dynamic = "force-dynamic"`.

Site search (`/search?q=`, `lib/search.ts`) runs over these merged lists (title/category/excerpt etc., not full article bodies).

### Blog articles

- `app/blog/[slug]/page.tsx` first looks for a static article (catalogue entry in `lib/data.ts` and a loader in `lib/articles.ts`) and renders the compiled MDX. If none exists, it falls back to `getDynamicArticleBySlug` and renders the stored markdown with `components/dynamic-article-content.tsx`. That is a small hand-written markdown parser, not MDX: headings, paragraphs, lists, tables, quotes, code, `![alt](url)` images, and ` ```quiz ` fences (quiz text format, rendered as `ArticleQuiz`). Links and images pass through `safeUrl` (http(s), site-relative, `#`, `mailto:` only). The admin editor previews with the same component.
- **Adding a static MDX article needs two registrations:** a catalogue entry with `slug` in `lib/data.ts` and an explicit `import()` loader in `lib/articles.ts`. Entries with `slug: null` are "coming soon" placeholders. `app/sitemap.ts` and the RSS feed (`app/feed.xml/route.ts`, built by `lib/rss.ts`) derive URLs from `lib/data.ts` plus the DB, so don't edit them by hand.
- The "Keep learning" section under each article (`components/related-content.tsx`) picks related articles and a quiz via `lib/related.ts`. A new article category needs an entry in its `quizForCategory` map to get a quiz link.
- MDX components available globally are registered in `mdx-components.tsx` (`ArticleQuiz`, an `h2` override that adds anchor ids, and `pre` → `components/code-block.tsx`, which adds a copy button; the admin renderer uses `CodeBlock` too).
- The "On this page" contents list (`components/article-toc.tsx`) comes from `extractHeadings` in `lib/headings.ts`, run over the markdown source: the MDX file read at request time (traced via `outputFileTracingIncludes` in `next.config.ts`) or the stored dynamic content. Both renderers give `<h2>` the matching `headingId`; keep them in step.
- `getAllArticles` returns summaries without bodies, because those lists reach client components. Use `getDynamicArticleBySlug` for content.
- Article writing conventions (editorial voice, structure, length, ArticleQuiz use) live in `.agents/skills/blog-writer/SKILL.md` and `references/editorial-standards.md`. Follow them when writing or revising articles.

### Quizzes

Static quizzes (with their questions) live in `lib/quizzes.ts`; `lib/data.ts` derives its quiz summaries from them. Admin quizzes store questions in the `DynamicQuiz.items` JSON column. `/quizzes/[slug]` resolves a static slug first, then a dynamic quiz by id (`getQuizBySlug`). The admin UI edits questions as plain text (`Q:` / `-` / `*` / `>` / `@`), parsed and serialized by `lib/quiz-format.ts`; always read stored JSON through `normalizeQuizItems`.

### Rate limiting

`checkRateLimit(request, scope)` in `lib/rate-limit.ts` is a Postgres fixed-window counter (`rate_limits` table, hashed client IP) used by admin login, comments, likes and the compiler. It fails open when the DB is unavailable. Limits are in `rateLimits`.

### Engagement (likes and comments)

`app/api/articles/[slug]/engagement/route.ts` backs `components/blog-engagement.tsx`. Likes are unique per `(articleSlug, visitorId)`, where the visitor ID comes from the client. It works for both static and dynamic slugs.

### Admin

- `lib/admin-auth.ts`: password login sets a `cws_admin` cookie (`adminCookieOptions`: httpOnly, SameSite=Strict) holding `issuedAt.HMAC(issuedAt + sha256(ADMIN_PASSWORD))` keyed by `ADMIN_SESSION_SECRET`, 7-day max age, constant-time comparison. Changing the password or the secret invalidates every session; logout only clears the local cookie. There are no user accounts. API routes guard with `requireAdmin()`.
- `app/api/admin/content/route.ts` handles CRUD for all four dynamic types, keyed by `payload.type`. Each handler is guarded by `requireAdmin()`. Input validation (length limits matching the Prisma `VarChar` sizes, enum lists for categories, topics and levels, slugify, YouTube ID extraction) happens there. Keep those limits in sync with `prisma/schema.prisma`.
- Unsent form contents autosave to localStorage per form (`lib/admin-drafts.ts`, keyed by type and item id or `new`) and are restored with a "Discard draft" banner. Saving, cancelling an edit or deleting the item clears its draft.
- UI: `app/admin/page.tsx`, `components/admin-content-manager.tsx`, and comment moderation in `components/admin-comment-moderation.tsx` (deletes via `app/api/admin/comments/route.ts`).

### Compiler

`app/api/compiler/run/route.ts` proxies code execution to Judge0. The supported languages and their Judge0 IDs are in `languageConfig`. It supports both Judge0 CE/self-hosted (`X-Auth-Token`) and RapidAPI (`JUDGE0_RAPIDAPI_HOST`). The UI is `components/compiler-playground.tsx`.

### Theming

`darkMode: "class"`: `dark:` utilities follow `html.dark` / `html.light` (set by the inline theme script in `app/layout.tsx` and `components/theme-toggle.tsx`), not the OS. `app/globals.css` also remaps legacy utilities under `html.light` (e.g. `html.light .text-white { color: #111827 }`). Two consequences: use `!text-white` for white text on coloured backgrounds, and never `@apply` an overridden utility inside a component class (Tailwind copies the override too; `.button-primary` sets `color` directly for this reason). The compiler has its own light/dark switch; `.compiler-dark` / `.compiler-light` scopes in `globals.css` keep it readable in every combination.

### Prisma

- The generator uses `provider = "prisma-client"` with output `app/generated/prisma` (gitignored). Import from `@/app/generated/prisma/client`, not `@prisma/client`.
- Always get the client with `getPrisma()` from `lib/prisma.ts`. It is a lazy singleton cached on `globalThis` and throws if `DATABASE_URL` is unset.
- Columns are snake_case via `@map`, and tables via `@@map`.

## Unrelated files

`Lord_Krishna_Residency_RWA_Roster.docx`, `lord-krishna-residency-roster-source.jpeg`, `outputs/`, `work/`, `tmp/`, `.codex_tmp/`, and `.codex-tmp-roster/` are local leftovers from a separate document task. They are gitignored and are not part of the website.
