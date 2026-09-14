"use client";

import { AlertCircle, BookOpenText, CheckCircle2, FileQuestion, GraduationCap, LogOut, Pencil, PlayCircle, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { getAdminContent } from "@/lib/dynamic-content";

type AdminContent = Awaited<ReturnType<typeof getAdminContent>>;
type ContentType = "article" | "video" | "quiz" | "pyq";
type SelectOption = string | { label: string; value: string };
type FormValues = Record<string, string>;
type EditableContent = {
  id: string;
  type: ContentType;
  title: string;
  meta: string;
  values: FormValues;
};

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

const saveMessageKey = "codewithshreya-admin-save-message";

export function AdminContentManager({ content }: { content: AdminContent }) {
  const router = useRouter();
  const [activeType, setActiveType] = useState<ContentType>("article");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<EditableContent | null>(null);
  const [formKey, setFormKey] = useState(0);
  const editing = editItem?.type === activeType ? editItem : null;

  useEffect(() => {
    const savedMessage = sessionStorage.getItem(saveMessageKey);

    if (savedMessage) {
      setMessage(savedMessage);
      sessionStorage.removeItem(saveMessageKey);
    }
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => setMessage(""), 7000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  async function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const editing = editItem?.type === activeType ? editItem : null;

    const response = await fetch("/api/admin/content", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: activeType,
        ...(editing ? { id: editing.id } : {}),
        ...payload,
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Unable to save content.");
      setSaving(false);
      return;
    }

    const activeLabel = contentTypes.find((item) => item.id === activeType)?.label ?? "Content";
    const successMessage = `${activeLabel} ${editing ? "updated" : "saved"} successfully. Public pages are updated.`;

    form.reset();
    setEditItem(null);
    setFormKey((value) => value + 1);
    sessionStorage.setItem(saveMessageKey, successMessage);
    setMessage(successMessage);
    setSaving(false);
    router.refresh();
  }

  function beginEdit(item: EditableContent) {
    setActiveType(item.type);
    setEditItem(item);
    setMessage("");
    setError("");
    setFormKey((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditItem(null);
    setMessage("");
    setError("");
    setFormKey((value) => value + 1);
  }

  async function deleteItem(item: EditableContent) {
    const ok = window.confirm(`Delete "${item.title}"? This cannot be undone.`);
    if (!ok) return;

    setSaving(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: item.type, id: item.id }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Unable to delete content.");
      setSaving(false);
      return;
    }

    if (editItem?.id === item.id) {
      setEditItem(null);
      setFormKey((value) => value + 1);
    }

    const successMessage = `"${item.title}" deleted successfully.`;
    sessionStorage.setItem(saveMessageKey, successMessage);
    setMessage(successMessage);
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
                    setEditItem(null);
                    setFormKey((value) => value + 1);
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

        <div className="mt-5" aria-live="polite" aria-atomic="true">
          {message ? <StatusBanner tone="success" message={message} /> : null}
          {error ? <StatusBanner tone="error" message={error} /> : null}
        </div>

        {editing ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-violet-200">Editing</p>
              <p className="text-sm text-slate-500 dark:text-gray-300">{editing.title}</p>
            </div>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-slate-600 hover:border-violet-400 dark:text-gray-300"
            >
              <X size={16} />
              Cancel edit
            </button>
          </div>
        ) : null}

        <form key={`${activeType}-${formKey}`} onSubmit={submitContent} className="mt-6 grid gap-4">
          {activeType === "article" ? <ArticleFields values={editing?.values} /> : null}
          {activeType === "video" ? <VideoFields values={editing?.values} /> : null}
          {activeType === "quiz" ? <QuizFields values={editing?.values} /> : null}
          {activeType === "pyq" ? <PyqFields values={editing?.values} /> : null}

          <button type="submit" className="button-primary w-full sm:w-fit" disabled={saving}>
            {saving
              ? "Saving..."
              : `${editing ? "Update" : "Add"} ${contentTypes.find((item) => item.id === activeType)?.label}`}
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
        <ManagedContentList
          activeType={activeType}
          content={content}
          onEdit={beginEdit}
          onDelete={deleteItem}
          busy={saving}
        />
      </aside>
    </div>
  );
}

function StatusBanner({
  tone,
  message,
}: {
  tone: "success" | "error";
  message: string;
}) {
  const success = tone === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm ${
        success
          ? "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border-rose-400/40 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function ArticleFields({ values }: { values?: FormValues }) {
  return (
    <>
      <Field name="title" label="Blog title" defaultValue={values?.title} required />
      <Field name="slug" label="Slug" placeholder="ip-addressing-basics" defaultValue={values?.slug} />
      <Select name="category" label="Category" options={["Computer Networks", "DBMS", "DotNet", "Data Structures", "Algorithms", "Operating Systems", "Programming", "Career"]} defaultValue={values?.category} />
      <Field name="excerpt" label="Short excerpt" defaultValue={values?.excerpt} required />
      <Field name="readTime" label="Read time" placeholder="8 min read" defaultValue={values?.readTime} />
      <Select name="color" label="Gradient color" options={articleGradientOptions} defaultValue={values?.color} />
      <TextArea name="content" label="Blog content" rows={12} defaultValue={values?.content} required />
    </>
  );
}

function VideoFields({ values }: { values?: FormValues }) {
  return (
    <>
      <Field name="title" label="Video title" defaultValue={values?.title} required />
      <Select name="topic" label="Topic" options={["Core CS", "Algorithms", "DBMS", "Operating Systems", "Computer Networks", "Programming", "System Design"]} defaultValue={values?.topic} />
      <Field name="subject" label="Subject" placeholder="Computer Networks" defaultValue={values?.subject} />
      <Select name="level" label="Level" options={["Beginner", "Intermediate", "Advanced"]} defaultValue={values?.level} />
      <Field name="duration" label="Duration" placeholder="Lecture 1 or 18:40" defaultValue={values?.duration} />
      <Field name="youtubeUrl" label="YouTube URL" placeholder="https://www.youtube.com/watch?v=..." defaultValue={values?.youtubeUrl} />
      <Field name="youtubePlaylistId" label="Playlist ID" defaultValue={values?.youtubePlaylistId} />
      <Field name="description" label="Description" defaultValue={values?.description} required />
      <Select name="color" label="Gradient color" options={videoGradientOptions} defaultValue={values?.color} />
    </>
  );
}

function QuizFields({ values }: { values?: FormValues }) {
  return (
    <>
      <Field name="title" label="Quiz title" defaultValue={values?.title} required />
      <Field name="topic" label="Topic" placeholder="TCP / IP / DNS" defaultValue={values?.topic} required />
      <Field name="questions" label="Question count" type="number" placeholder="15" defaultValue={values?.questions} />
      <Select name="level" label="Level" options={["Beginner", "Intermediate", "Advanced"]} defaultValue={values?.level} />
      <Field name="tags" label="Tags" placeholder="TCP, IP, DNS" defaultValue={values?.tags} />
    </>
  );
}

function PyqFields({ values }: { values?: FormValues }) {
  return (
    <>
      <Field name="title" label="Paper title" placeholder="GATE CSE 2025" defaultValue={values?.title} required />
      <Field name="source" label="Source" placeholder="GATE CSE" defaultValue={values?.source} />
      <Field name="questions" label="Paper type" placeholder="Question paper" defaultValue={values?.questions} />
      <Field name="year" label="Year" placeholder="2025" defaultValue={values?.year} required />
      <Field name="fileId" label="Google Drive file ID" defaultValue={values?.fileId} required />
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
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
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  rows: number;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
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
  defaultValue,
}: {
  name: string;
  label: string;
  options: SelectOption[];
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
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

function ManagedContentList({
  activeType,
  content,
  onEdit,
  onDelete,
  busy,
}: {
  activeType: ContentType;
  content: AdminContent;
  onEdit: (item: EditableContent) => void;
  onDelete: (item: EditableContent) => void;
  busy: boolean;
}) {
  const items = getEditableItems(content, activeType);
  const activeLabel = contentTypes.find((item) => item.id === activeType)?.label ?? "Content";

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Manage {activeLabel}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
            Edit or delete admin-created content.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-4 text-sm text-slate-500 dark:text-gray-400">
            No admin-created {activeLabel.toLowerCase()} items yet.
          </p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-xl border border-line bg-white/60 p-3 dark:bg-white/[0.035]">
              <h3 className="line-clamp-2 text-sm font-bold text-slate-950 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-gray-400">
                {item.meta}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  disabled={busy}
                  className="inline-flex items-center gap-1 rounded-lg border border-violet-400/40 px-3 py-2 text-xs font-bold text-violet-500 transition hover:bg-violet-500/10 disabled:opacity-50"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  disabled={busy}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 px-3 py-2 text-xs font-bold text-rose-500 transition hover:bg-rose-500/10 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function getEditableItems(content: AdminContent, type: ContentType): EditableContent[] {
  if (type === "article") {
    return content.articles
      .filter((article) => article.id)
      .map((article) => ({
        id: article.id,
        type,
        title: article.title,
        meta: `${article.category} - ${article.date}`,
        values: {
          title: article.title,
          slug: article.slug ?? "",
          category: article.category,
          excerpt: article.excerpt,
          readTime: article.date,
          color: article.color,
          content: article.content,
        },
      }));
  }

  if (type === "video") {
    return content.videos
      .filter((video) => video.id)
      .map((video) => ({
        id: video.id ?? "",
        type,
        title: video.title,
        meta: `${video.topic}${video.subject ? ` - ${video.subject}` : ""}`,
        values: {
          title: video.title,
          topic: video.topic,
          subject: video.subject ?? "",
          level: video.level ?? "Beginner",
          duration: video.duration,
          youtubeUrl: video.youtubeUrl ?? "",
          youtubePlaylistId: video.youtubePlaylistId ?? "",
          description: video.description ?? "",
          color: video.color,
        },
      }));
  }

  if (type === "quiz") {
    return content.quizzes
      .filter((quiz) => quiz.id)
      .map((quiz) => ({
        id: quiz.id ?? "",
        type,
        title: quiz.title,
        meta: `${quiz.level} - ${quiz.questions} questions`,
        values: {
          title: quiz.title,
          topic: quiz.topic,
          questions: String(quiz.questions),
          level: quiz.level,
          tags: quiz.tags?.join(", ") ?? "",
        },
      }));
  }

  return content.pyqs
    .filter((paper) => paper.id)
    .map((paper) => ({
      id: paper.id ?? "",
      type,
      title: paper.title,
      meta: `${paper.source} - ${paper.year}`,
      values: {
        title: paper.title,
        source: paper.source,
        questions: paper.questions,
        year: paper.year,
        fileId: paper.fileId,
      },
    }));
}

function AdminCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-white/70 p-4 dark:bg-white/[0.035]">
      <div className="text-2xl font-black text-slate-950 dark:text-white">{value}</div>
      <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
