import type { Metadata } from "next";
import { AdminContentManager } from "@/components/admin-content-manager";
import { AdminLoginForm } from "@/components/admin-login-form";
import { hasAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { getAdminContent } from "@/lib/dynamic-content";

export const metadata: Metadata = {
  title: "Admin",
  description: "CodeWithShreya admin content manager.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = isAdminConfigured();
  const signedIn = configured ? await hasAdminSession() : false;
  const content = signedIn ? await getAdminContent() : null;

  return (
    <section className="container-page py-10">
      <div className="mb-8">
        <p className="eyebrow">Admin only</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Manage CodeWithShreya content
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-gray-400">
          Add blogs, videos, quizzes, and PYQ papers from one protected screen.
        </p>
      </div>

      {!configured ? (
        <div className="card max-w-2xl p-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Admin login is not configured
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-gray-400">
            Add `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in your environment,
            then restart the server.
          </p>
        </div>
      ) : signedIn && content ? (
        <AdminContentManager content={content} />
      ) : (
        <AdminLoginForm />
      )}
    </section>
  );
}
