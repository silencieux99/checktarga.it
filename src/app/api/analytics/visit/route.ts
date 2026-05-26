import { NextRequest, NextResponse } from "next/server";
import { classifyTrafficSource } from "@/lib/analytics-traffic";
import { getAdminDb } from "@/lib/firebase-admin";
import { getTodayLocal } from "@/lib/date-range-admin";

export const runtime = "nodejs";

const recentVisitsCache = new Map<string, number>();
const RECENT_VISIT_TTL = 10_000;

export async function POST(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const { sessionId, path, ts, ua, isDoubleClick, country } = body || {};
    const search = body.search ?? (path && path.includes("?") ? path.split("?")[1] ?? "" : "");
    const referrer = body.referrer ?? "";

    if (sessionId && path) {
      const cacheKey = `${sessionId}:${path}`;
      const nowTime = Date.now();
      const lastVisit = recentVisitsCache.get(cacheKey);
      if (lastVisit && nowTime - lastVisit < RECENT_VISIT_TTL) {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      recentVisitsCache.set(cacheKey, nowTime);
      if (recentVisitsCache.size > 10_000) recentVisitsCache.clear();
    }

    const now = Date.now();
    const trafficSource = classifyTrafficSource(search, referrer, body.gclid || null);

    await db.collection("analytics_visits").add({
      sessionId: sessionId || null,
      path: path || "/",
      ts: typeof ts === "number" ? ts : now,
      ua: ua || null,
      isDoubleClick: isDoubleClick || false,
      country: country || "IT",
      domain: "checktarga.it",
      trafficSource,
      utm_source: new URLSearchParams(search).get("utm_source") || null,
      utm_medium: new URLSearchParams(search).get("utm_medium") || null,
      utm_campaign: new URLSearchParams(search).get("utm_campaign") || null,
      siteId: "checktarga.it",
      day: getTodayLocal(),
      timestamp: now,
      createdAt: now,
    });

    if (sessionId) {
      await db.doc(`analytics_presence/${sessionId}`).set(
        {
          lastActive: now,
          lastPath: path || "/",
          country: country || "IT",
          ua: ua || null,
          domain: "checktarga.it",
          siteId: "checktarga.it",
        },
        { merge: true }
      );
    }

    return NextResponse.json({ ok: true, trafficSource });
  } catch (error) {
    console.error("[analytics/visit]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
