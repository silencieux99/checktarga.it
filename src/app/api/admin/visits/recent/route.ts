import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, verifyAdmin } from "@/lib/firebase-admin";
import type { RecentVisitEvent } from "@/lib/admin-presence";
import { getTodayLocal } from "@/lib/date-range-admin";
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
      return NextResponse.json({ success: true, visits: [], updatedAt: Date.now() });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get("limit") || "25", 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 25;
    const day = getTodayLocal();

    const snap = await db
      .collection("analytics_visits")
      .where("day", "==", day)
      .orderBy("ts", "desc")
      .limit(limit)
      .get();

    const visits: RecentVisitEvent[] = snap.docs
      .map((doc) => {
        const data = doc.data();
        if (data.siteId && data.siteId !== "checktarga.it") return null;
        return {
          id: doc.id,
          path: String(data.path || "/"),
          ts: Number(data.ts || data.timestamp || data.createdAt || 0),
          sessionId: data.sessionId ? String(data.sessionId) : undefined,
          country: data.country ? String(data.country) : undefined,
          trafficSource: data.trafficSource ? String(data.trafficSource) : undefined,
        };
      })
      .filter(Boolean) as RecentVisitEvent[];

    return NextResponse.json({
      success: true,
      visits,
      updatedAt: Date.now(),
    });
  } catch (error) {
    return firestoreApiErrorResponse(error, "[admin/visits/recent]");
  }
}
