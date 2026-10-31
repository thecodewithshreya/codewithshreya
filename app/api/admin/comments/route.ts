import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const payload = await request.json().catch(() => null);
  const ids: unknown = payload?.ids;

  if (!Array.isArray(ids) || !ids.length || !ids.every((id) => typeof id === "string") || ids.length > 100) {
    return NextResponse.json({ error: "Select between 1 and 100 comments." }, { status: 400 });
  }

  try {
    const { count } = await getPrisma().articleComment.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: count });
  } catch {
    return NextResponse.json({ error: "Unable to delete comments." }, { status: 500 });
  }
}
