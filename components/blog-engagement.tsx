"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Share2 } from "lucide-react";

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

  useEffect(() => {
    const id = getVisitorId();
    setVisitorId(id);

    fetch(`/api/articles/${slug}/engagement?visitorId=${encodeURIComponent(id)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load article activity.");
        }

        return response.json() as Promise<EngagementData>;
      })
      .then(setData)
      .catch(() => setMessage("Article activity is temporarily unavailable."))
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
      setMessage("Unable to update your like. Please try again.");
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
      setMessage("Article link copied.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("Unable to share this article.");
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
        throw new Error(result.error ?? "Unable to publish comment.");
      }

      setData((current) => ({
        ...current,
        comments: [result.comment as Comment, ...current.comments],
      }));
      setCommentBody("");
      setMessage("Comment published.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to publish comment.",
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
          {data.liked ? "Liked" : "Like"} {!loading && `(${data.likeCount})`}
        </button>
        <button
          type="button"
          onClick={shareArticle}
          className="button-secondary !px-4 !py-2"
        >
          <Share2 size={17} />
          Share
        </button>
        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
          <MessageCircle size={16} />
          {data.comments.length} comments
        </span>
      </div>

      {message && <p role="status" className="mt-3 text-sm text-gray-400">{message}</p>}

      {children}

      <section className="mt-14 border-t border-line pt-10" aria-labelledby="comments-title">
        <h2 id="comments-title" className="text-2xl font-bold">Comments</h2>
        <p className="mt-2 text-sm text-gray-400">
          Join the discussion. Please keep comments respectful and relevant.
        </p>

        <form onSubmit={submitComment} className="card mt-6 space-y-4 p-5">
          <div>
            <label htmlFor="comment-name" className="text-sm font-medium">Name</label>
            <input
              id="comment-name"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              minLength={2}
              maxLength={50}
              required
              className="mt-2 w-full rounded-lg border border-line bg-ink/40 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="comment-body" className="text-sm font-medium">Comment</label>
            <textarea
              id="comment-body"
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              minLength={2}
              maxLength={1_000}
              required
              rows={4}
              className="mt-2 w-full resize-y rounded-lg border border-line bg-ink/40 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
              placeholder="Share your thoughts..."
            />
          </div>
          <button type="submit" disabled={submitting} className="button-primary disabled:opacity-60">
            <Send size={16} />
            {submitting ? "Publishing..." : "Publish comment"}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading comments...</p>
          ) : data.comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet. Start the conversation.</p>
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
