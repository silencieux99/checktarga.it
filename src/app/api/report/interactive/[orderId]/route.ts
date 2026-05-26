import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { SITE } from "@/lib/pricing";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ error: "ID ordine mancante" }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non configurato" }, { status: 500 });
    }

    const snap = await db.collection("orders").doc(orderId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    const order = snap.data()!;
    if (order.site && order.site !== SITE.domain) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    if (order.status !== "COMPLETE") {
      return NextResponse.json({ error: "Report non ancora disponibile" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId || orderId,
      reportData: order.reportData || {
        sections: order.sections || [],
        ai: order.reportData?.ai,
        rawApiData: order.rawApiData || order.reportData?.rawApiData,
      },
      sections: order.sections || order.reportData?.sections || [],
      rawApiData: order.rawApiData || order.reportData?.rawApiData || null,
      vehicleInfo: order.vehicleInfo || {},
      searchType: order.searchType,
      searchValue: order.searchValue,
      createdAt: order.createdAt,
      pdfUrl: order.pdfUrl,
    });
  } catch (error) {
    console.error("[InteractiveReport]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
