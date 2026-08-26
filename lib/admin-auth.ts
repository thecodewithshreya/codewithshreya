import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const adminCookieName = "cws_admin";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

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
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;

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

export { sessionMaxAgeSeconds };

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return "";

  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) return false;

  return timingSafeEqual(firstBuffer, secondBuffer);
}
