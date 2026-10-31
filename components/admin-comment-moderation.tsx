"use client";

import { AlertCircle, CheckCircle2, MessageSquare, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AdminComment } from "@/lib/dynamic-content";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

export function AdminCommentModeration({ comments }: { comments: AdminComment[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return comments;

    return comments.filter((comment) =>
      [comment.authorName, comment.body, comment.articleTitle].some((value) => value.toLowerCase().includes(term)),
    );
  }, [comments, query]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((comment) => selected.has(comment.id));

  function toggle(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelected((previous) => {
      const next = new Set(previous);
      for (const comment of filtered) {
        if (allVisibleSelected) next.delete(comment.id);
        else next.add(comment.id);
      }
      return next;
    });
  }

  async function remove(ids: string[]) {
    const label = ids.length === 1 ? "this comment" : `${ids.length} comments`;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    setBusy(true);
    setStatus(null);

    const response = await fetch("/api/admin/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus({ tone: "error", message: result?.error ?? "Unable to delete comments." });
      setBusy(false);
      return;
    }

    setSelected((previous) => {
      const next = new Set(previous);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setStatus({ tone: "success", message: `Deleted ${result?.deleted ?? ids.length} comment${ids.length === 1 ? "" : "s"}.` });
    setBusy(false);
    router.refresh();
  }

  return (
    <section className="card mt-6 p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">Moderation</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
            <MessageSquare size={20} />
            Recent comments
            <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">({comments.length})</span>
          </h2>
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search comments</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, text or article"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:bg-white/[0.04] dark:text-white"
          />
        </label>
      </div>

      {status ? (
        <div
          role="status"
          className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
            status.tone === "success"
              ? "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-rose-400/40 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
          }`}
        >
          {status.tone === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
          {status.message}
        </div>
      ) : null}

      {comments.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500 dark:text-gray-400">No comments yet.</p>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="inline-flex items-center gap-2 font-semibold text-slate-600 dark:text-gray-300">
              <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} disabled={!filtered.length} />
              Select all shown ({filtered.length})
            </label>
            <button
              type="button"
              disabled={busy || selected.size === 0}
              onClick={() => remove([...selected])}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-400/50 px-3 py-2 font-semibold text-rose-500 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={15} />
              Delete selected ({selected.size})
            </button>
          </div>

          <ul className="mt-4 grid gap-3">
            {filtered.map((comment) => (
              <li
                key={comment.id}
                className="flex gap-3 rounded-xl border border-line bg-white/70 p-4 dark:bg-white/[0.035]"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={selected.has(comment.id)}
                  onChange={() => toggle(comment.id)}
                  aria-label={`Select comment by ${comment.authorName}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="font-bold text-slate-950 dark:text-white">{comment.authorName}</span>
                    <span className="text-slate-500 dark:text-gray-500">{dateFormatter.format(new Date(comment.createdAt))}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-gray-300">
                    {comment.body}
                  </p>
                  <Link
                    href={`/blog/${comment.articleSlug}`}
                    target="_blank"
                    className="mt-2 inline-block text-xs font-semibold text-violet-500 hover:underline"
                  >
                    {comment.articleTitle}
                  </Link>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove([comment.id])}
                  aria-label={`Delete comment by ${comment.authorName}`}
                  className="self-start rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-40"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-gray-400">No comments match your search.</p>
          ) : null}
        </>
      )}
    </section>
  );
}
