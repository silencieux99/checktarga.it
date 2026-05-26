import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-request";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminRequest(req);
    if (!auth.ok) return auth.response;

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non disponibile" }, { status: 503 });
    }

    const limit = Math.min(parseInt(new URL(req.url).searchParams.get("limit") || "200", 10), 500);
    const snap = await db.collection("orders").orderBy("createdAt", "desc").limit(limit).get();

    const reports = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Record<string, unknown> & { id: string })
      .filter((item) => item.source === "account_credit")
      .map((item) => ({
        id: item.id,
        orderId: item.orderId || item.id,
        customerEmail: item.customerEmail,
        customerUid: item.customerUid,
        searchType: item.searchType,
        searchValue: item.searchValue,
        status: item.status,
        pdfUrl: item.pdfUrl,
        createdAt: item.createdAt,
        vehicleInfo: item.vehicleInfo,
      }));

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("[admin/reports]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
