CREATE TABLE "dynamic_articles" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "excerpt" VARCHAR(320) NOT NULL,
    "read_time" VARCHAR(40) NOT NULL DEFAULT '8 min read',
    "color" VARCHAR(120) NOT NULL DEFAULT 'from-indigo-500/30 to-violet-500/5',
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dynamic_articles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dynamic_videos" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "topic" VARCHAR(80) NOT NULL,
    "subject" VARCHAR(80),
    "duration" VARCHAR(40) NOT NULL DEFAULT 'Video lesson',
    "color" VARCHAR(120) NOT NULL DEFAULT 'from-violet-600 to-indigo-950',
    "level" VARCHAR(40) NOT NULL DEFAULT 'Beginner',
    "description" VARCHAR(360) NOT NULL,
    "youtube_id" VARCHAR(80),
    "youtube_playlist_id" VARCHAR(120),
    "youtube_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dynamic_videos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dynamic_quizzes" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "topic" VARCHAR(180) NOT NULL,
    "questions" INTEGER NOT NULL DEFAULT 10,
    "level" VARCHAR(40) NOT NULL DEFAULT 'Beginner',
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dynamic_quizzes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dynamic_pyq_papers" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "source" VARCHAR(80) NOT NULL DEFAULT 'GATE CSE',
    "questions" VARCHAR(120) NOT NULL DEFAULT 'Question paper',
    "year" VARCHAR(10) NOT NULL,
    "file_id" VARCHAR(180) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dynamic_pyq_papers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "dynamic_articles_slug_key" ON "dynamic_articles"("slug");
CREATE INDEX "dynamic_articles_category_idx" ON "dynamic_articles"("category");
CREATE INDEX "dynamic_articles_created_at_idx" ON "dynamic_articles"("created_at" DESC);
CREATE INDEX "dynamic_videos_topic_idx" ON "dynamic_videos"("topic");
CREATE INDEX "dynamic_videos_subject_idx" ON "dynamic_videos"("subject");
CREATE INDEX "dynamic_videos_created_at_idx" ON "dynamic_videos"("created_at" DESC);
CREATE INDEX "dynamic_quizzes_level_idx" ON "dynamic_quizzes"("level");
CREATE INDEX "dynamic_quizzes_created_at_idx" ON "dynamic_quizzes"("created_at" DESC);
CREATE INDEX "dynamic_pyq_papers_source_idx" ON "dynamic_pyq_papers"("source");
CREATE INDEX "dynamic_pyq_papers_year_idx" ON "dynamic_pyq_papers"("year");
CREATE INDEX "dynamic_pyq_papers_created_at_idx" ON "dynamic_pyq_papers"("created_at" DESC);
