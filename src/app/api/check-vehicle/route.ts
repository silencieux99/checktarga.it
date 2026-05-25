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

    return NextResponse.json({
      found: data.found,
      data,
    });
  } catch (error) {
    console.error("[check-vehicle]", error);
    return NextResponse.json({ error: "LOOKUP_FAILED" }, { status: 500 });
  }
}
