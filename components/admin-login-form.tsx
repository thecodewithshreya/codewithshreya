"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Unable to login.");
      setSaving(false);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={submitLogin} className="card max-w-md p-6">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-500/10 text-violet-300">
        <LockKeyhole size={22} />
      </span>
      <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
        Admin login
      </h2>
      <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-gray-300">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:bg-white/[0.04] dark:text-white"
          required
        />
      </label>
      {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
      <button type="submit" className="button-primary mt-5 w-full" disabled={saving}>
        {saving ? "Checking..." : "Open admin"}
      </button>
    </form>
  );
}
