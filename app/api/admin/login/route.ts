import { NextResponse } from "next/server";
import {
  adminCookieName,
  createAdminToken,
  isAdminConfigured,
  isValidAdminPassword,
  sessionMaxAgeSeconds,
} from "@/lib/admin-auth";

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

  if (!isValidAdminPassword(password)) {
    return NextResponse.json(
      { error: "Incorrect admin password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createAdminToken(), {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
