import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearDraft, draftKey, readDraft, saveDraft } from "@/lib/admin-drafts";

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  };
}

describe("admin drafts", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keys drafts by type and item", () => {
    expect(draftKey("article")).toBe("codewithshreya-admin-draft:article:new");
    expect(draftKey("quiz", "abc")).toBe("codewithshreya-admin-draft:quiz:abc");
  });

  it("saves, reads and clears a draft", () => {
    const key = draftKey("article");
    saveDraft(key, { title: "Draft", content: "## Hi" }, 1000);

    expect(readDraft(key, 2000)).toEqual({ values: { title: "Draft", content: "## Hi" }, savedAt: 1000 });

    clearDraft(key);
    expect(readDraft(key, 2000)).toBeNull();
  });

  it("drops corrupt and expired drafts", () => {
    const key = draftKey("video");
    window.localStorage.setItem(key, "{not json");
    expect(readDraft(key)).toBeNull();

    window.localStorage.setItem(key, JSON.stringify({ values: { title: 3 }, savedAt: Date.now() }));
    expect(readDraft(key)).toBeNull();
    expect(window.localStorage.getItem(key)).toBeNull();

    saveDraft(key, { title: "Old" }, 0);
    expect(readDraft(key, 31 * 24 * 60 * 60 * 1000)).toBeNull();
  });

  it("does nothing when storage is unavailable", () => {
    vi.stubGlobal("window", {
      get localStorage(): Storage {
        throw new Error("blocked");
      },
    });

    expect(() => saveDraft(draftKey("pyq"), { title: "x" })).not.toThrow();
    expect(readDraft(draftKey("pyq"))).toBeNull();
    expect(() => clearDraft(draftKey("pyq"))).not.toThrow();
  });
});
