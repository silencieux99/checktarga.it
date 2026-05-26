import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, verifyAdmin } from "@/lib/firebase-admin";
import { firestoreApiErrorResponse } from "@/lib/firestore-index-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token mancante" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accesso non autorizzato" }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non disponibile" }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get("limit") || "100", 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 500) : 100;

    const snap = await db.collection("orders").orderBy("createdAt", "desc").limit(limit).get();
    const orders = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Record<string, unknown> & { id: string })
      .filter((order) => {
        if (order.source === "account_credit") return false;
        if (order.site && order.site !== "checktarga.it") return false;
        return true;
      });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return firestoreApiErrorResponse(error, "[admin/orders]");
  }
}
