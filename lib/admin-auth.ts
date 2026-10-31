import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const adminCookieName = "cws_admin";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export const adminCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
} as const;

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function isValidAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return false;

  return safeEqual(password, configuredPassword);
}

export function createAdminToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token || !isAdminConfigured()) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const issuedAtNumber = Number(issuedAt);
  if (!Number.isFinite(issuedAtNumber)) return false;

  const ageSeconds = (Date.now() - issuedAtNumber) / 1000;
  if (ageSeconds < 0 || ageSeconds > sessionMaxAgeSeconds) return false;

  return safeEqual(signature, sign(issuedAt));
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(adminCookieName)?.value);
}

// Returns an error response for API routes when the caller is not a signed-in admin.
export async function requireAdmin() {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 },
    );
  }

  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  return null;
}

export { sessionMaxAgeSeconds };

// The signature also covers a fingerprint of ADMIN_PASSWORD, so changing the
// password (or the secret) signs out every existing session.
function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password) return "";

  const passwordFingerprint = createHash("sha256").update(password).digest("hex");
  return createHmac("sha256", secret).update(`${value}.${passwordFingerprint}`).digest("hex");
}

function safeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) return false;

  return timingSafeEqual(firstBuffer, secondBuffer);
}
