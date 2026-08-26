"use client";

import { BookOpenText, FileQuestion, GraduationCap, LogOut, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import type { getAdminContent } from "@/lib/dynamic-content";

type AdminContent = Awaited<ReturnType<typeof getAdminContent>>;
type ContentType = "article" | "video" | "quiz" | "pyq";
type SelectOption = string | { label: string; value: string };

const contentTypes: {
  id: ContentType;
  label: string;
  icon: typeof BookOpenText;
}[] = [
  { id: "article", label: "Blog", icon: BookOpenText },
  { id: "video", label: "Video", icon: PlayCircle },
  { id: "quiz", label: "Quiz", icon: FileQuestion },
  { id: "pyq", label: "PYQ", icon: GraduationCap },
];

const articleGradientOptions = [
  { label: "Emerald / Teal", value: "from-emerald-500/30 to-teal-500/5" },
  { label: "Blue / Cyan", value: "from-blue-500/30 to-cyan-500/5" },
  { label: "Indigo / Blue", value: "from-indigo-500/30 to-blue-500/5" },
  { label: "Violet / Indigo", value: "from-violet-500/30 to-indigo-500/5" },
  { label: "Purple / Pink", value: "from-purple-500/30 to-pink-500/5" },
  { label: "Orange / Amber", value: "from-orange-500/30 to-amber-500/5" },
  { label: "Rose / Purple", value: "from-rose-500/30 to-purple-500/5" },
];

const videoGradientOptions = [
  { label: "Blue / Indigo", value: "from-blue-600 to-indigo-900" },
  { label: "Violet / Indigo", value: "from-violet-600 to-indigo-950" },
  { label: "Purple / Slate", value: "from-purple-600 to-slate-900" },
  { label: "Cyan / Blue", value: "from-cyan-600 to-blue-950" },
  { label: "Rose / Purple", value: "from-rose-600 to-purple-950" },
  { label: "Amber / Orange", value: "from-amber-600 to-orange-950" },
  { label: "Emerald / Teal", value: "from-emerald-600 to-teal-950" },
];

export function AdminContentManager({ content }: { content: AdminContent }) {
  const router = useRouter();
  const [activeType, setActiveType] = useState<ContentType>("article");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: activeType, ...payload }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Unable to save content.");
      setSaving(false);
      return;
    }

    event.currentTarget.reset();
    setMessage("Content saved. Public pages are updated.");
    setSaving(false);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {contentTypes.map(({ id, label, icon: Icon }) => {
              const active = activeType === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveType(id);
                    setMessage("");
                    setError("");
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-950/20"
                      : "border-line bg-white/80 text-slate-600 hover:border-violet-400 dark:bg-white/[0.04] dark:text-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-400 hover:text-rose-500 dark:text-gray-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <form onSubmit={submitContent} className="mt-6 grid gap-4">
          {activeType === "article" ? <ArticleFields /> : null}
          {activeType === "video" ? <VideoFields /> : null}
          {activeType === "quiz" ? <QuizFields /> : null}
          {activeType === "pyq" ? <PyqFields /> : null}

          {message ? <p className="text-sm font-medium text-emerald-400">{message}</p> : null}
          {error ? <p className="text-sm font-medium text-rose-400">{error}</p> : null}

          <button type="submit" className="button-primary w-full sm:w-fit" disabled={saving}>
            {saving ? "Saving..." : `Add ${contentTypes.find((item) => item.id === activeType)?.label}`}
          </button>
        </form>
      </div>

      <aside className="card p-5">
        <p className="eyebrow">Database content</p>
        <div className="mt-4 grid gap-3">
          <AdminCount label="Blogs" value={content.articles.length} />
          <AdminCount label="Videos" value={content.videos.length} />
          <AdminCount label="Quizzes" value={content.quizzes.length} />
          <AdminCount label="PYQs" value={content.pyqs.length} />
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-gray-400">
          Static content stays in code. New admin content is stored in Neon/Postgres
          and appears before static cards.
        </p>
      </aside>
    </div>
  );
}

function ArticleFields() {
  return (
    <>
      <Field name="title" label="Blog title" required />
      <Field name="slug" label="Slug" placeholder="ip-addressing-basics" />
      <Select name="category" label="Category" options={["Computer Networks", "DBMS", "DotNet", "Data Structures", "Algorithms", "Operating Systems", "Programming", "Career"]} />
      <Field name="excerpt" label="Short excerpt" required />
      <Field name="readTime" label="Read time" placeholder="8 min read" />
      <Select name="color" label="Gradient color" options={articleGradientOptions} />
      <TextArea name="content" label="Blog content" rows={12} required />
    </>
  );
}

function VideoFields() {
  return (
    <>
      <Field name="title" label="Video title" required />
      <Select name="topic" label="Topic" options={["Core CS", "Algorithms", "DBMS", "Operating Systems", "Computer Networks", "Programming", "System Design"]} />
      <Field name="subject" label="Subject" placeholder="Computer Networks" />
      <Select name="level" label="Level" options={["Beginner", "Intermediate", "Advanced"]} />
      <Field name="duration" label="Duration" placeholder="Lecture 1 or 18:40" />
      <Field name="youtubeUrl" label="YouTube URL" placeholder="https://www.youtube.com/watch?v=..." />
      <Field name="youtubePlaylistId" label="Playlist ID" />
      <Field name="description" label="Description" required />
      <Select name="color" label="Gradient color" options={videoGradientOptions} />
    </>
  );
}

function QuizFields() {
  return (
    <>
      <Field name="title" label="Quiz title" required />
      <Field name="topic" label="Topic" placeholder="TCP / IP / DNS" required />
      <Field name="questions" label="Question count" type="number" placeholder="15" />
      <Select name="level" label="Level" options={["Beginner", "Intermediate", "Advanced"]} />
      <Field name="tags" label="Tags" placeholder="TCP, IP, DNS" />
    </>
  );
}

function PyqFields() {
  return (
    <>
      <Field name="title" label="Paper title" placeholder="GATE CSE 2025" required />
      <Field name="source" label="Source" placeholder="GATE CSE" />
      <Field name="questions" label="Paper type" placeholder="Question paper" />
      <Field name="year" label="Year" placeholder="2025" required />
      <Field name="fileId" label="Google Drive file ID" required />
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:bg-white/[0.04] dark:text-white"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  rows,
  required,
}: {
  name: string;
  label: string;
  rows: number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">
      {label}
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:bg-white/[0.04] dark:text-white"
      />
    </label>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: SelectOption[];
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">
      {label}
      <select
        name={name}
        className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:bg-[#111827] dark:text-white"
      >
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AdminCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-white/70 p-4 dark:bg-white/[0.035]">
      <div className="text-2xl font-black text-slate-950 dark:text-white">{value}</div>
      <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
