import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-request";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { getCredits } from "@/lib/credits";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminRequest(req);
    if (!auth.ok) return auth.response;

    const email = (new URL(req.url).searchParams.get("email") || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email richiesta." }, { status: 400 });
    }

    const firebaseAuth = getAdminAuth();
    const db = getAdminDb();
    if (!firebaseAuth || !db) {
      return NextResponse.json({ error: "Firebase Admin non configurato." }, { status: 503 });
    }

    const authUser = await firebaseAuth.getUserByEmail(email);
    const userDoc = await db.collection("users").doc(authUser.uid).get();
    const credits = await getCredits(authUser.uid);

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.uid,
        email: authUser.email,
        disabled: authUser.disabled,
        createdAt: userDoc.data()?.createdAt || 0,
        credits,
      },
    });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "auth/user-not-found") {
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });
    }
    console.error("[admin/users/lookup]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
