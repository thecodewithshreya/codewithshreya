// Unsent admin form contents, kept in this browser's localStorage so a reload,
// an expired session or a closed tab does not lose a half-written article.

export type AdminDraft = { values: Record<string, string>; savedAt: number };

const prefix = "codewithshreya-admin-draft";
const maxAgeMs = 30 * 24 * 60 * 60 * 1000;

export function draftKey(type: string, id?: string) {
  return `${prefix}:${type}:${id ?? "new"}`;
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readDraft(key: string, now = Date.now()): AdminDraft | null {
  try {
    const raw = storage()?.getItem(key);
    if (!raw) return null;

    const draft = JSON.parse(raw) as Partial<AdminDraft>;
    const valid =
      typeof draft.savedAt === "number" &&
      now - draft.savedAt < maxAgeMs &&
      draft.values !== null &&
      typeof draft.values === "object" &&
      Object.values(draft.values).every((value) => typeof value === "string");

    if (!valid) {
      storage()?.removeItem(key);
      return null;
    }

    return draft as AdminDraft;
  } catch {
    return null;
  }
}

export function saveDraft(key: string, values: Record<string, string>, now = Date.now()) {
  try {
    storage()?.setItem(key, JSON.stringify({ values, savedAt: now } satisfies AdminDraft));
  } catch {
    // Storage full or blocked: drafts are a convenience, so carry on without one.
  }
}

export function clearDraft(key: string) {
  try {
    storage()?.removeItem(key);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
