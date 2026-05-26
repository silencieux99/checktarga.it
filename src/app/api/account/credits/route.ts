import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { getCredits } from "@/lib/credits";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const decoded = await verifyFirebaseToken(authHeader.substring(7));
    if (!decoded?.uid) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const total = await getCredits(decoded.uid);
    return NextResponse.json({ total, uid: decoded.uid });
  } catch (error) {
    console.error("[account/credits]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
