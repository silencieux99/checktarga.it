import { NextRequest, NextResponse } from "next/server";
import { cleanQuery, lookupVehicle } from "@/lib/vehicle";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const type = (searchParams.get("type") || "plate") as "plate" | "vin";

    if (!query) {
      return NextResponse.json({ error: "QUERY_REQUIRED" }, { status: 400 });
    }

    const cleaned = cleanQuery(query, type);
    const data = await lookupVehicle(cleaned, type);

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
