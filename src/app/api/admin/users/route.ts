import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-request";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { getCredits } from "@/lib/credits";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminRequest(req);
    if (!auth.ok) return auth.response;

    const db = getAdminDb();
    const firebaseAuth = getAdminAuth();
    if (!db || !firebaseAuth) {
      return NextResponse.json({ error: "Database non disponibile" }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const limit = Math.min(parseInt(searchParams.get("limit") || "200", 10), 500);

    const snap = await db.collection("users").orderBy("createdAt", "desc").limit(limit).get();
    const users = await Promise.all(
      snap.docs.map(async (doc) => {
        const data = doc.data();
        const uid = doc.id;
        let email = String(data.email || "");
        let disabled = false;

        try {
          const authUser = await firebaseAuth.getUser(uid);
          email = authUser.email || email || uid;
          disabled = authUser.disabled;
        } catch {
          email = email || uid;
        }

        const credits = await getCredits(uid);
        return {
          id: uid,
          email,
          createdAt: data.createdAt || 0,
          updatedAt: data.updatedAt || 0,
          site: data.site || "checktarga.it",
          role: data.role || "customer",
          guestCheckout: Boolean(data.guestCheckout),
          credits,
          disabled,
        };
      })
    );

    const filtered = search
      ? users.filter((user) => user.email.toLowerCase().includes(search))
      : users;

    return NextResponse.json({
      success: true,
      users: filtered,
      stats: {
        total: users.length,
        withCredits: users.filter((user) => user.credits > 0).length,
        disabled: users.filter((user) => user.disabled).length,
      },
    });
  } catch (error) {
    console.error("[admin/users]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
