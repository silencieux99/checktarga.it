import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken, getAdminDb } from "@/lib/firebase-admin";
import { consumeCredits, getCredits, refundCredit } from "@/lib/credits";
import { generateVehicleReport } from "@/lib/report-generator";
import { getVehicleByPlate, getVehicleByVIN } from "@/lib/international-api";
import { storePdfReport } from "@/lib/blob-storage";
import { validatePlate, validateVin } from "@/lib/vehicle";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Autenticazione richiesta" }, { status: 401 });
    }

    const decodedToken = await verifyFirebaseToken(authHeader.substring(7));
    if (!decodedToken) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email || "";
    const body = await request.json();
    const { searchType, searchValue } = body;

    if (!searchType || !searchValue) {
      return NextResponse.json(
        { error: "Parametri mancanti: searchType, searchValue" },
        { status: 400 }
      );
    }

    if (!["vin", "plate"].includes(searchType)) {
      return NextResponse.json({ error: "searchType non valido" }, { status: 400 });
    }

    const cleaned =
      searchType === "plate"
        ? String(searchValue).replace(/[\s-]/g, "").toUpperCase()
        : String(searchValue).replace(/[\s-]/g, "").toUpperCase();

    const validationError =
      searchType === "plate" ? validatePlate(cleaned) : validateVin(cleaned);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const availableCredits = await getCredits(uid);
    if (availableCredits < 1) {
      return NextResponse.json(
        {
          error: "Crediti insufficienti",
          message: "Acquista un pacchetto per generare un report.",
          remaining: availableCredits,
        },
        { status: 402 }
      );
    }

    const reportId = crypto.randomUUID();
    const orderId = `report_${reportId}`;

    let vehicleData;
    try {
      vehicleData =
        searchType === "vin"
          ? await getVehicleByVIN(cleaned)
          : await getVehicleByPlate(cleaned, "IT");
    } catch (error) {
      console.error("[Generate] Errore API veicolo:", error);
      return NextResponse.json(
        {
          error: "Errore API veicolo",
          message: error instanceof Error ? error.message : "Errore sconosciuto",
          creditNotDeducted: true,
        },
        { status: 502 }
      );
    }

    if (vehicleData.erreur) {
      return NextResponse.json(
        {
          error: "Veicolo non trovato",
          message: vehicleData.erreur,
          creditNotDeducted: true,
        },
        { status: 404 }
      );
    }

    const reportResult = await generateVehicleReport(cleaned, vehicleData, orderId);
    if (!reportResult.success || !reportResult.pdfBuffer) {
      return NextResponse.json(
        {
          error: "Generazione report fallita",
          message: reportResult.error || "Errore sconosciuto",
          creditNotDeducted: true,
        },
        { status: 500 }
      );
    }

    const consumption = await consumeCredits(uid, `Report ${searchType}: ${cleaned}`);
    if (!consumption.ok) {
      return NextResponse.json(
        {
          error: "Crediti insufficienti",
          remaining: consumption.remaining,
        },
        { status: 402 }
      );
    }

    let pdfUrl = "";
    let pdfStoragePath = "";

    const blobResult = await storePdfReport(reportResult.pdfBuffer, orderId, {
      customerEmail: email,
      searchType,
      searchValue: cleaned,
      vehicleBrand: reportResult.vehicleInfo?.marque || "",
    });

    if (!blobResult) {
      await refundCredit(uid, "Rimborso — errore storage PDF");
      return NextResponse.json(
        {
          error: "Storage PDF fallito",
          message: "BLOB_READ_WRITE_TOKEN non configurato o errore Vercel Blob.",
          creditRefunded: true,
        },
        { status: 500 }
      );
    }

    pdfUrl = blobResult.url;
    pdfStoragePath = blobResult.storagePath;

    const db = getAdminDb();
    if (db) {
      await db.collection("orders").doc(orderId).set({
        orderId,
        customerEmail: email,
        customerUid: uid,
        searchType,
        searchValue: cleaned,
        status: "COMPLETE",
        pdfUrl,
        pdfStoragePath,
        pdfGenerated: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        vehicleInfo: reportResult.vehicleInfo || {},
        source: "account_credit",
        country: "IT",
        site: "checktarga.it",
      });
    }

    return NextResponse.json({
      success: true,
      reportId,
      orderId,
      pdfUrl,
      pdfStoragePath,
      remaining: consumption.remaining,
      vehicleInfo: reportResult.vehicleInfo,
    });
  } catch (error) {
    console.error("[Generate] Errore API:", error);
    return NextResponse.json(
      {
        error: "Errore interno",
        message: error instanceof Error ? error.message : "Errore sconosciuto",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Autenticazione richiesta" }, { status: 401 });
    }

    const decodedToken = await verifyFirebaseToken(authHeader.substring(7));
    if (!decodedToken) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const remaining = await getCredits(decodedToken.uid);
    return NextResponse.json({
      canGenerate: remaining >= 1,
      remaining,
    });
  } catch (error) {
    console.error("[Generate] Errore GET:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
