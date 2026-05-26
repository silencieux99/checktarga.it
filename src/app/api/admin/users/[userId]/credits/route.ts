import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-request";
import { adminAdjustCredits, adminSetCredits } from "@/lib/credits";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireAdminRequest(req);
    if (!auth.ok) return auth.response;

    const { userId } = await context.params;
    const body = await req.json().catch(() => ({}));
    const mode = body.mode === "set" ? "set" : "add";
    const amount = Number(body.amount);
    const note = String(body.note || "Modifica admin");

    if (!Number.isFinite(amount)) {
      return NextResponse.json({ error: "Importo non valido." }, { status: 400 });
    }

    if (mode === "set") {
      const result = await adminSetCredits(userId, amount, note);
      return NextResponse.json({ success: true, total: result.total });
    }

    if (amount === 0) {
      return NextResponse.json({ error: "Importo non valido." }, { status: 400 });
    }

    const result = await adminAdjustCredits(userId, amount, note);
    return NextResponse.json({ success: true, total: result.total });
  } catch (error) {
    console.error("[admin/users/credits]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
