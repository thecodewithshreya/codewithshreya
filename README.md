# CodeWithShreya

Next.js learning platform with MDX articles, interactive quizzes, and
Prisma-backed article likes and comments.

## Local development

```bash
npm install
npm run dev
```

The main website works without a database. Likes and comments require the Neon
environment variables described below.

## Neon and Prisma setup

1. In the Vercel project, open **Storage**.
2. Create or connect a **Neon Postgres** database.
3. Confirm that the project has a pooled `DATABASE_URL`.
4. Use the unpooled Neon URL for either `DIRECT_URL` or
   `DATABASE_URL_UNPOOLED`.
5. For local Prisma commands, copy those values into a local `.env` file using
   `.env.example` as the template. Never commit `.env`.
6. Apply the checked-in database migration:

```bash
npm run db:deploy
```

7. Redeploy the Vercel project.

Prisma Client is generated automatically after dependency installation.

## Database commands

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:studio
```

- `db:migrate` creates a new migration during local development.
- `db:deploy` applies existing migrations to Neon and is the correct command
  for production.
