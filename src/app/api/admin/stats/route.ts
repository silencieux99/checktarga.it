import { NextRequest, NextResponse } from "next/server";
import type { Firestore } from "firebase-admin/firestore";
import { getAdminDb, verifyAdmin } from "@/lib/firebase-admin";
import {
  getDaysBetween,
  getRangeForCustom,
  getRangeForPreset,
  getTodayLocal,
  startOfDayLocal,
  type PeriodPreset,
} from "@/lib/date-range-admin";

import {
  firestoreApiErrorResponse,
  isFirestoreIndexError,
} from "@/lib/firestore-index-error";
import {
  getAdminStatsCache,
  setAdminStatsCache,
} from "@/lib/admin-stats-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_ORDERS = 2000;
const MAX_VISITS = 20_000;
const MAX_SEARCHES = 2000;

function isPaidStatus(status: string) {
  return ["paid", "complete", "succeeded", "completed"].includes(status.toLowerCase());
}

function isFailedStatus(status: string) {
  return ["failed", "refunded", "cancelled", "canceled"].includes(status.toLowerCase());
}

function isChecktargaOrder(data: FirebaseFirestore.DocumentData) {
  if (data.source === "account_credit") return false;
  if (data.site && data.site !== "checktarga.it") return false;
  return true;
}

async function countVisitsForDay(db: Firestore, dayStr: string) {
  const snap = await db
    .collection("analytics_visits")
    .where("day", "==", dayStr)
    .orderBy("ts", "asc")
    .limit(MAX_VISITS)
    .get();

  const unique = new Set<string>();
  const bySource: Record<string, Set<string>> = {};

  snap.docs.forEach((doc) => {
    const v = doc.data();
    if (v.siteId && v.siteId !== "checktarga.it") return;
    const sid = v.sessionId ? String(v.sessionId) : null;
    if (sid) unique.add(sid);
    const source = (v.trafficSource || "Direct").trim() || "Direct";
    if (!bySource[source]) bySource[source] = new Set();
    if (sid) bySource[source].add(sid);
  });

  const visitsBySource: Record<string, number> = {};
  Object.entries(bySource).forEach(([key, set]) => {
    visitsBySource[key] = set.size;
  });

  return { visits: unique.size, visitsBySource };
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token mancante" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accesso non autorizzato" }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non disponibile" }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const periodParam = searchParams.get("period") || "today";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let range;
    if (startDateParam && endDateParam) {
      range = getRangeForCustom(startDateParam, endDateParam);
    } else {
      const preset = (["today", "last_7_days", "last_30_days"].includes(periodParam)
        ? periodParam
        : "today") as PeriodPreset;
      range = getRangeForPreset(preset);
    }

    const cacheKey = `stats:${range.period}:${range.startDate}:${range.endDate}`;
    const cached = getAdminStatsCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const todayStr = getTodayLocal();
    const days = getDaysBetween(range.startDate, range.endDate);
    let visitsTotal = 0;
    const visitsBySource: Record<string, number> = {};
    const visitsSeries: Array<{ t: number; visits: number }> = [];

    for (const day of days) {
      const dayStats = await countVisitsForDay(db, day);
      visitsTotal += dayStats.visits;
      visitsSeries.push({ t: startOfDayLocal(day), visits: dayStats.visits });
      Object.entries(dayStats.visitsBySource).forEach(([source, count]) => {
        visitsBySource[source] = (visitsBySource[source] || 0) + count;
      });
    }

    const ordersSnap = await db
      .collection("orders")
      .where("createdAt", ">=", range.from)
      .where("createdAt", "<=", range.to)
      .orderBy("createdAt", "asc")
      .limit(MAX_ORDERS)
      .get();

    let revenue = 0;
    let paid = 0;
    let total = 0;
    let failed = 0;
    const salesByPeriod = new Map<string, { amount: number; count: number }>();
    const isSingleDay = range.to - range.from <= 25 * 3600 * 1000;

    ordersSnap.forEach((doc) => {
      const order = doc.data();
      if (!isChecktargaOrder(order)) return;

      total += 1;
      const status = String(order.status || "");
      const amount = Number(order.amount || 0);

      if (isPaidStatus(status)) {
        paid += 1;
        revenue += amount;
        const orderDate = new Date(order.createdAt || Date.now());
        const periodKey = isSingleDay
          ? orderDate.toISOString().slice(0, 13) + ":00:00.000Z"
          : orderDate.toISOString().slice(0, 10) + "T00:00:00.000Z";
        const existing = salesByPeriod.get(periodKey) || { amount: 0, count: 0 };
        existing.amount += amount;
        existing.count += 1;
        salesByPeriod.set(periodKey, existing);
      } else if (isFailedStatus(status)) {
        failed += 1;
      }
    });

    const seriesSales = Array.from(salesByPeriod.entries())
      .map(([periodKey, data]) => ({
        t: new Date(periodKey).getTime(),
        amount: data.amount / 100,
        count: data.count,
      }))
      .sort((a, b) => a.t - b.t);

    const now = Date.now();
    let online = 0;
    const presenceSnap = await db.collection("analytics_presence").limit(2000).get();
    presenceSnap.forEach((doc) => {
      const data = doc.data();
      if (data.siteId && data.siteId !== "checktarga.it") return;
      if (data.lastActive && now - Number(data.lastActive) < 60_000) online += 1;
    });

    let totalSearches = 0;
    let totalHits = 0;
    try {
      const searchesSnap = await db
        .collection("vehicle_searches")
        .where("ts", ">=", range.from)
        .where("ts", "<=", range.to)
        .limit(MAX_SEARCHES)
        .get();
      const uniqueSearchSessions = new Set<string>();
      const uniqueHitSessions = new Set<string>();
      searchesSnap.forEach((doc) => {
        const search = doc.data();
        if (search.siteId && search.siteId !== "checktarga.it") return;
        const key = search.sessionId ? String(search.sessionId) : null;
        if (!key) return;
        uniqueSearchSessions.add(key);
        if (search.found) uniqueHitSessions.add(key);
      });
      totalSearches = uniqueSearchSessions.size;
      totalHits = uniqueHitSessions.size;
    } catch (searchError) {
      if (isFirestoreIndexError(searchError)) {
        throw searchError;
      }
      console.warn("[admin/stats] vehicle_searches unavailable", searchError);
    }

    const payload = {
      success: true,
      revenue: revenue / 100,
      paid,
      total,
      failed,
      visits: visitsTotal,
      visitsBySource,
      visitsSeries,
      seriesSales,
      online,
      totalSearches,
      totalHits,
      hitRate: totalSearches > 0 ? (totalHits / totalSearches) * 100 : 0,
      from: range.from,
      to: range.to,
      startDate: range.startDate,
      endDate: range.endDate,
      period: range.period,
      visitsToday: days.includes(todayStr) ? visitsBySource.Direct || 0 : 0,
    };

    setAdminStatsCache(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (error) {
    return firestoreApiErrorResponse(error, "[admin/stats]");
  }
}
