import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAdminToken, isValidAdminPassword, sessionMaxAgeSeconds, verifyAdminToken } from "@/lib/admin-auth";

describe("admin session tokens", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_PASSWORD", "test-password");
    vi.stubEnv("ADMIN_SESSION_SECRET", "test-secret-value");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("accepts a freshly issued token", () => {
    expect(verifyAdminToken(createAdminToken())).toBe(true);
  });

  it("rejects missing, malformed and tampered tokens", () => {
    const [issuedAt, signature] = createAdminToken().split(".");

    expect(verifyAdminToken(undefined)).toBe(false);
    expect(verifyAdminToken("")).toBe(false);
    expect(verifyAdminToken("not-a-token")).toBe(false);
    expect(verifyAdminToken(`${Number(issuedAt) + 1}.${signature}`)).toBe(false);
    expect(verifyAdminToken(`${issuedAt}.${signature.replace(/.$/, (c) => (c === "0" ? "1" : "0"))}`)).toBe(false);
  });

  it("expires tokens after the session lifetime", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const token = createAdminToken();

    vi.setSystemTime(new Date(Date.now() + (sessionMaxAgeSeconds - 60) * 1000));
    expect(verifyAdminToken(token)).toBe(true);

    vi.setSystemTime(new Date(Date.now() + 120 * 1000));
    expect(verifyAdminToken(token)).toBe(false);
  });

  it("signs out every session when the password changes", () => {
    const token = createAdminToken();
    vi.stubEnv("ADMIN_PASSWORD", "new-password");
    expect(verifyAdminToken(token)).toBe(false);
  });

  it("signs out every session when the secret changes", () => {
    const token = createAdminToken();
    vi.stubEnv("ADMIN_SESSION_SECRET", "rotated-secret");
    expect(verifyAdminToken(token)).toBe(false);
  });

  it("rejects everything when admin is not configured", () => {
    const token = createAdminToken();
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(verifyAdminToken(token)).toBe(false);
    expect(isValidAdminPassword("")).toBe(false);
  });

  it("checks the password exactly", () => {
    expect(isValidAdminPassword("test-password")).toBe(true);
    expect(isValidAdminPassword("test-passwor")).toBe(false);
    expect(isValidAdminPassword("TEST-PASSWORD")).toBe(false);
  });
});
