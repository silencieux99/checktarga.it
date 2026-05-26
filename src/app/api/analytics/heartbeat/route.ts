import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const { sessionId, ts, ua, path, country } = body;

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "sessionId required" }, { status: 400 });
    }

    const now = Date.now();
    await db.doc(`analytics_presence/${sessionId}`).set(
      {
        lastActive: typeof ts === "number" ? ts : now,
        lastPath: path || "/",
        country: country || "IT",
        ua: ua || null,
        siteId: "checktarga.it",
        updatedAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[analytics/heartbeat]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
