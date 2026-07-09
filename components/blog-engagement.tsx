"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Share2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

type Comment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type EngagementData = {
  likeCount: number;
  liked: boolean;
  comments: Comment[];
};

type BlogEngagementProps = {
  slug: string;
  title: string;
  children: ReactNode;
};

const emptyData: EngagementData = {
  likeCount: 0,
  liked: false,
  comments: [],
};

function getVisitorId() {
  const storageKey = "codewithshreya-visitor-id";
  const savedId = localStorage.getItem(storageKey);

  if (savedId) {
    return savedId;
  }

  const newId = crypto.randomUUID();
  localStorage.setItem(storageKey, newId);
  return newId;
}

export function BlogEngagement({
  slug,
  title,
  children,
}: BlogEngagementProps) {
  const [data, setData] = useState<EngagementData>(emptyData);
  const [visitorId, setVisitorId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    const id = getVisitorId();
    setVisitorId(id);

    fetch(`/api/articles/${slug}/engagement?visitorId=${encodeURIComponent(id)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(t("engagement.activityError"));
        }

        return response.json() as Promise<EngagementData>;
      })
      .then(setData)
      .catch(() => setMessage(t("engagement.activityError")))
      .finally(() => setLoading(false));
  }, [slug]);

  async function toggleLike() {
    if (!visitorId || submitting) return;
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/articles/${slug}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-like", visitorId }),
      });

      if (!response.ok) throw new Error();
      const result = (await response.json()) as Pick<
        EngagementData,
        "liked" | "likeCount"
      >;
      setData((current) => ({ ...current, ...result }));
    } catch {
      setMessage(t("engagement.likeError"));
    } finally {
      setSubmitting(false);
    }
  }

  async function shareArticle() {
    const shareData = { title, url: window.location.href };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setMessage(t("engagement.linkCopied"));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage(t("engagement.shareError"));
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/articles/${slug}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "comment",
          authorName,
          body: commentBody,
        }),
      });
      const result = (await response.json()) as {
        comment?: Comment;
        error?: string;
      };

      if (!response.ok || !result.comment) {
        throw new Error(result.error ?? t("engagement.publishError"));
      }

      setData((current) => ({
        ...current,
        comments: [result.comment as Comment, ...current.comments],
      }));
      setCommentBody("");
      setMessage(t("engagement.published"));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("engagement.publishError"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleLike}
          disabled={loading || submitting}
          className={`button-secondary !px-4 !py-2 ${
            data.liked ? "!border-rose-500/50 !text-rose-400" : ""
          }`}
          aria-pressed={data.liked}
        >
          <Heart size={17} fill={data.liked ? "currentColor" : "none"} />
          {data.liked ? t("engagement.liked") : t("engagement.like")} {!loading && `(${data.likeCount})`}
        </button>
        <button
          type="button"
          onClick={shareArticle}
          className="button-secondary !px-4 !py-2"
        >
          <Share2 size={17} />
          {t("engagement.share")}
        </button>
        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
          <MessageCircle size={16} />
          {data.comments.length} {t("engagement.comments")}
        </span>
      </div>

      {message && <p role="status" className="mt-3 text-sm text-gray-400">{message}</p>}

      {children}

      <section className="mt-14 border-t border-line pt-10" aria-labelledby="comments-title">
        <h2 id="comments-title" className="text-2xl font-bold">{t("engagement.commentsTitle")}</h2>
        <p className="mt-2 text-sm text-gray-400">
          {t("engagement.join")}
        </p>

        <form onSubmit={submitComment} className="card mt-6 space-y-4 p-5">
          <div>
            <label htmlFor="comment-name" className="text-sm font-medium">{t("engagement.name")}</label>
            <input
              id="comment-name"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              minLength={2}
              maxLength={50}
              required
              className="mt-2 w-full rounded-lg border border-line bg-ink/40 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
              placeholder={t("engagement.namePlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="comment-body" className="text-sm font-medium">{t("engagement.comment")}</label>
            <textarea
              id="comment-body"
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              minLength={2}
              maxLength={1_000}
              required
              rows={4}
              className="mt-2 w-full resize-y rounded-lg border border-line bg-ink/40 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
              placeholder={t("engagement.commentPlaceholder")}
            />
          </div>
          <button type="submit" disabled={submitting} className="button-primary disabled:opacity-60">
            <Send size={16} />
            {submitting ? t("engagement.publishing") : t("engagement.publish")}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">{t("engagement.loading")}</p>
          ) : data.comments.length === 0 ? (
            <p className="text-sm text-gray-500">{t("engagement.empty")}</p>
          ) : (
            data.comments.map((comment) => (
              <article key={comment.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{comment.authorName}</h3>
                  <time className="text-xs text-gray-500" dateTime={comment.createdAt}>
                    {new Date(`${comment.createdAt}Z`).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-400">
                  {comment.body}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
