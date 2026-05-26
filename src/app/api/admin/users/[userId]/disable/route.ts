import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-request";
import { getAdminAuth } from "@/lib/firebase-admin";

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
    const disable = Boolean(body.disable);

    const firebaseAuth = getAdminAuth();
    if (!firebaseAuth) {
      return NextResponse.json({ error: "Firebase Admin non configurato." }, { status: 503 });
    }

    await firebaseAuth.updateUser(userId, { disabled: disable });

    return NextResponse.json({
      success: true,
      disabled: disable,
      message: disable ? "Utente disabilitato." : "Utente riabilitato.",
    });
  } catch (error) {
    console.error("[admin/users/disable]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
