import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-request";
import { invalidateAdminStatsCache } from "@/lib/admin-stats-cache";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(["PENDING", "COMPLETE", "FAILED"]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const auth = await requireAdminRequest(req);
    if (!auth.ok) return auth.response;

    const { orderId } = await context.params;
    const body = await req.json().catch(() => ({}));
    const status = String(body.status || "").toUpperCase();

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: "Stato non valido." }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non disponibile" }, { status: 503 });
    }

    const ref = db.collection("orders").doc(orderId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
    }

    await ref.set(
      {
        status,
        updatedAt: Date.now(),
        processingLogs: [
          ...(snap.data()?.processingLogs || []),
          `[admin] Stato aggiornato a ${status} (${new Date().toISOString()})`,
        ],
      },
      { merge: true }
    );

    invalidateAdminStatsCache();
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("[admin/orders/patch]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const auth = await requireAdminRequest(_req);
    if (!auth.ok) return auth.response;

    const { orderId } = await context.params;
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non disponibile" }, { status: 503 });
    }

    const ref = db.collection("orders").doc(orderId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
    }

    await ref.delete();
    invalidateAdminStatsCache();
    return NextResponse.json({ success: true, deleted: orderId });
  } catch (error) {
    console.error("[admin/orders/delete]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
