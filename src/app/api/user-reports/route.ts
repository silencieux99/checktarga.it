import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken, getAdminDb } from "@/lib/firebase-admin";
import { resolveBlobDownloadUrl } from "@/lib/blob-storage";

export interface UserReport {
  id: string;
  orderId: string;
  createdAt: number;
  searchType: string;
  searchValue: string;
  vehicleInfo: Record<string, string>;
  pdfUrl: string;
  pdfStoragePath?: string;
  status: string;
  formattedDate: string;
  vehicleBrand?: string;
  vehicleModel?: string;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Autenticazione richiesta" }, { status: 401 });
    }

    const decodedToken = await verifyFirebaseToken(authHeader.substring(7));
    if (!decodedToken?.email) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ success: true, reports: [], total: 0 });
    }

    const userEmail = decodedToken.email;
    const ordersSnapshot = await db
      .collection("orders")
      .where("customerEmail", "==", userEmail)
      .limit(100)
      .get();

    const reports: UserReport[] = [];

    for (const doc of ordersSnapshot.docs) {
      const order = doc.data();
      if (order.status !== "COMPLETE") continue;
      if (!order.pdfUrl && !order.pdfStoragePath) continue;

      let pdfUrl = order.pdfUrl as string | undefined;
      if (!pdfUrl && order.pdfStoragePath) {
        pdfUrl = resolveBlobDownloadUrl(order.pdfStoragePath, order.orderId || doc.id);
      }

      if (!pdfUrl) continue;

      reports.push({
        id: doc.id,
        orderId: order.orderId || doc.id,
        createdAt: order.createdAt || 0,
        searchType: order.searchType || "plate",
        searchValue: order.searchValue || "",
        vehicleInfo: order.vehicleInfo || {},
        pdfUrl,
        pdfStoragePath: order.pdfStoragePath,
        status: order.status,
        formattedDate: new Date(order.createdAt || Date.now()).toLocaleDateString("it-IT", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        vehicleBrand: order.vehicleInfo?.marque,
        vehicleModel: order.vehicleInfo?.modele,
      });
    }

    reports.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({
      success: true,
      reports,
      total: reports.length,
      userEmail,
    });
  } catch (error) {
    console.error("[UserReports] Errore:", error);
    return NextResponse.json(
      {
        error: "Errore interno",
        message: error instanceof Error ? error.message : "Errore sconosciuto",
      },
      { status: 500 }
    );
  }
}
