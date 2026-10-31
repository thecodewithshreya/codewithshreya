# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CodeWithShreya is a Next.js 16 (App Router, React 19, TypeScript, Tailwind 3) learning platform: CS blog articles, videos, quizzes, GATE PYQ papers, an online compiler, and an admin content manager. Deployed on Vercel with Neon Postgres via Prisma 7.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run lint         # next typegen && tsc --noEmit (type-check only; there is no ESLint)
npm run db:generate  # regenerate Prisma Client (also runs on postinstall)
npm run db:migrate   # create a new migration locally (prisma migrate dev)
npm run db:deploy    # apply checked-in migrations (use for production/Neon)
npm run db:studio
```

There is no test suite. Verify changes with `npm run lint` and `npm run build`.

## Environment

See `.env.example`. `DATABASE_URL` (pooled Neon) is used at runtime by `lib/prisma.ts` through `@prisma/adapter-neon`; `prisma.config.ts` uses `DIRECT_URL` → `DATABASE_URL_UNPOOLED` → `DATABASE_URL` for migrations. `JUDGE0_*` configures the compiler API; `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` enable the admin area.

The site must keep working without a database: likes/comments and admin-managed content just become unavailable.

## Architecture

### Two content sources, merged at read time

Every content type (articles, videos, quizzes, PYQ papers) has two sources:

1. **Static content** — hard-coded arrays in `lib/data.ts` (PYQ papers are defined in `app/pyq/page.tsx`). Static articles are MDX files in `content/blog/<slug>.mdx`.
2. **Dynamic content** — Prisma models `DynamicArticle`, `DynamicVideo`, `DynamicQuiz`, `DynamicPyqPaper`, created through the admin UI.

`lib/dynamic-content.ts` merges them (`getAllArticles`, `getAllVideos`, …, dynamic items first). All DB reads go through `readDynamic(reader, fallback)`, which logs and returns the fallback on any error. That is how the site survives a missing DB. Pages that read dynamic content export `dynamic = "force-dynamic"`.

### Blog articles

- `app/blog/[slug]/page.tsx` first looks for a static article (catalogue entry in `lib/data.ts` and a loader in `lib/articles.ts`) and renders the compiled MDX. If none exists, it falls back to `getDynamicArticleBySlug` and renders the stored markdown with `components/dynamic-article-content.tsx`. That is a small hand-written markdown parser (headings, paragraphs, lists, tables, quotes, code), not MDX.
- **Adding a static MDX article needs two registrations:** a catalogue entry with `slug` in `lib/data.ts` and an explicit `import()` loader in `lib/articles.ts`. Entries with `slug: null` are "coming soon" placeholders. `app/sitemap.ts` derives URLs from `lib/data.ts`, so don't edit it by hand.
- MDX components available globally are registered in `mdx-components.tsx` (currently `ArticleQuiz`).
- Article writing conventions (editorial voice, structure, length, ArticleQuiz use) live in `.agents/skills/blog-writer/SKILL.md` and `references/editorial-standards.md`. Follow them when writing or revising articles.

### Engagement (likes and comments)

`app/api/articles/[slug]/engagement/route.ts` backs `components/blog-engagement.tsx`. Likes are unique per `(articleSlug, visitorId)`, where the visitor ID comes from the client. It works for both static and dynamic slugs.

### Admin

- `lib/admin-auth.ts`: password login sets a `cws_admin` cookie holding `issuedAt.HMAC-SHA256(issuedAt)` signed with `ADMIN_SESSION_SECRET` (7-day max age). It uses constant-time comparison. There are no user accounts.
- `app/api/admin/content/route.ts` handles CRUD for all four dynamic types, keyed by `payload.type`. Each handler is guarded by `requireAdmin()`. Input validation (length limits matching the Prisma `VarChar` sizes, enum lists for categories, topics and levels, slugify, YouTube ID extraction) happens there. Keep those limits in sync with `prisma/schema.prisma`.
- UI: `app/admin/page.tsx` and `components/admin-content-manager.tsx`.

### Compiler

`app/api/compiler/run/route.ts` proxies code execution to Judge0. The supported languages and their Judge0 IDs are in `languageConfig`. It supports both Judge0 CE/self-hosted (`X-Auth-Token`) and RapidAPI (`JUDGE0_RAPIDAPI_HOST`). The UI is `components/compiler-playground.tsx`.

### Prisma

- The generator uses `provider = "prisma-client"` with output `app/generated/prisma` (gitignored). Import from `@/app/generated/prisma/client`, not `@prisma/client`.
- Always get the client with `getPrisma()` from `lib/prisma.ts`. It is a lazy singleton cached on `globalThis` and throws if `DATABASE_URL` is unset.
- Columns are snake_case via `@map`, and tables via `@@map`.

## Unrelated files

`Lord_Krishna_Residency_RWA_Roster.docx`, `lord-krishna-residency-roster-source.jpeg`, `outputs/`, `work/`, `.codex_tmp/`, and `.codex-tmp-roster/` are leftovers from a separate document task. They are not part of the website.
