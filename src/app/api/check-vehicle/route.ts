import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getTodayLocal } from "@/lib/date-range-admin";
import { cleanQuery, lookupVehicle } from "@/lib/vehicle";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const type = (searchParams.get("type") || "plate") as "plate" | "vin";
    const sessionId = searchParams.get("sessionId") || "unknown";

    if (!query) {
      return NextResponse.json({ error: "QUERY_REQUIRED" }, { status: 400 });
    }

    const cleaned = cleanQuery(query, type);
    const data = await lookupVehicle(cleaned, type);

    try {
      const db = getAdminDb();
      if (db) {
        await db.collection("vehicle_searches").add({
          query: cleaned,
          type,
          found: Boolean(data.found),
          sessionId,
          siteId: "checktarga.it",
          day: getTodayLocal(),
          ts: Date.now(),
        });
      }
    } catch (logError) {
      console.warn("[check-vehicle] search log failed", logError);
    }

    if (!data.found) {
      return NextResponse.json(
        {
          found: false,
          error: data.error || "Veicolo non trovato",
          data,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      found: true,
      data,
    });
  } catch (error) {
    console.error("[check-vehicle]", error);
    return NextResponse.json({ error: "LOOKUP_FAILED" }, { status: 500 });
  }
}
