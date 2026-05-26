import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, verifyAdmin } from "@/lib/firebase-admin";
import { aggregateLivePresence, PRESENCE_TIMEOUT_MS } from "@/lib/admin-presence";
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

    const now = Date.now();
    const threshold = now - PRESENCE_TIMEOUT_MS;
    const snap = await db
      .collection("analytics_presence")
      .where("lastActive", ">=", threshold)
      .limit(500)
      .get();

    const snapshot = aggregateLivePresence(snap.docs, now);

    return NextResponse.json({
      success: true,
      ...snapshot,
      updatedAt: now,
    });
  } catch (error) {
    return firestoreApiErrorResponse(error, "[admin/presence]");
  }
}
