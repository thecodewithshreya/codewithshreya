CREATE TABLE "article_likes" (
    "id" TEXT NOT NULL,
    "article_slug" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_likes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "article_comments" (
    "id" TEXT NOT NULL,
    "article_slug" TEXT NOT NULL,
    "author_name" VARCHAR(50) NOT NULL,
    "body" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_comments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "article_likes_article_slug_visitor_id_key"
    ON "article_likes"("article_slug", "visitor_id");

CREATE INDEX "article_comments_article_slug_created_at_idx"
    ON "article_comments"("article_slug", "created_at" DESC);
