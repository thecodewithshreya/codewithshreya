import { NextResponse } from "next/server";
import {
  adminCookieName,
  adminCookieOptions,
  createAdminToken,
  isAdminConfigured,
  isValidAdminPassword,
  sessionMaxAgeSeconds,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin", request.url));
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const password =
    payload && typeof payload.password === "string" ? payload.password : "";

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 },
    );
  }

  const limited = await checkRateLimit(request, "adminLogin");
  if (limited) return limited;

  if (!isValidAdminPassword(password)) {
    return NextResponse.json(
      { error: "Incorrect admin password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createAdminToken(), {
    ...adminCookieOptions,
    maxAge: sessionMaxAgeSeconds,
  });

  return response;
}
