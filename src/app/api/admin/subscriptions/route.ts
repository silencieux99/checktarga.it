import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-request";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { firestoreApiErrorResponse } from "@/lib/firestore-index-error";
import type { UserSubscription } from "@/lib/subscription-service";

export const runtime = "nodejs";

interface BillingEventRow {
  id: string;
  type: string;
  invoiceId: string;
  subscriptionId: string;
  uid: string;
  sku: string;
  creditsAdded: number;
  amountPaid: number;
  processedAt: number;
  email: string;
}

const ACTIVE_STATUSES = new Set(["trialing", "active", "past_due"]);

async function resolveUserEmail(
  uid: string,
  cache: Map<string, string>
): Promise<string> {
  const cached = cache.get(uid);
  if (cached) return cached;

  const firebaseAuth = getAdminAuth();
  if (!firebaseAuth) {
    cache.set(uid, uid);
    return uid;
  }

  try {
    const user = await firebaseAuth.getUser(uid);
    const email = user.email || uid;
    cache.set(uid, email);
    return email;
  } catch {
    cache.set(uid, uid);
    return uid;
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminRequest(req);
    if (!auth.ok) return auth.response;

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non disponibile" }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "300", 10), 500);

    const [subscriptionsSnap, renewalsSnap] = await Promise.all([
      db.collection("subscriptions").orderBy("createdAt", "desc").limit(limit).get(),
      db
        .collection("billing_events")
        .orderBy("processedAt", "desc")
        .limit(50)
        .get(),
    ]);

    const emailCache = new Map<string, string>();
    const subscriptions = await Promise.all(
      subscriptionsSnap.docs.map(async (doc) => {
        const data = doc.data() as UserSubscription;
        const email = await resolveUserEmail(data.uid, emailCache);
        return {
          id: doc.id,
          ...data,
          email,
        };
      })
    );

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const stats = {
      total: subscriptions.length,
      active: subscriptions.filter((item) => ACTIVE_STATUSES.has(item.status)).length,
      trialing: subscriptions.filter((item) => item.status === "trialing").length,
      pastDue: subscriptions.filter((item) => item.status === "past_due").length,
      canceled: subscriptions.filter((item) =>
        ["canceled", "unpaid"].includes(item.status)
      ).length,
      pendingCancel: subscriptions.filter(
        (item) => item.cancelAtPeriodEnd && ACTIVE_STATUSES.has(item.status)
      ).length,
      recurringRevenueCents: subscriptions
        .filter((item) => ACTIVE_STATUSES.has(item.status))
        .reduce((sum, item) => sum + (item.recurringAmount || 0), 0),
      renewalCount30d: 0,
      renewalRevenue30dCents: 0,
    };

    const renewals: BillingEventRow[] = await Promise.all(
      renewalsSnap.docs.map(async (doc) => {
        const data = doc.data();
        const uid = String(data.uid || "");
        const email = uid ? await resolveUserEmail(uid, emailCache) : "—";
        const processedAt = Number(data.processedAt || 0);

        if (processedAt >= thirtyDaysAgo) {
          stats.renewalCount30d += 1;
          stats.renewalRevenue30dCents += Number(data.amountPaid || 0);
        }

        return {
          id: doc.id,
          type: String(data.type || ""),
          invoiceId: String(data.invoiceId || doc.id),
          subscriptionId: String(data.subscriptionId || ""),
          uid,
          sku: String(data.sku || ""),
          creditsAdded: Number(data.creditsAdded || 0),
          amountPaid: Number(data.amountPaid || 0),
          processedAt,
          email,
        };
      })
    );

    return NextResponse.json({
      success: true,
      subscriptions,
      renewals,
      stats,
    });
  } catch (error) {
    return firestoreApiErrorResponse(error, "[admin/subscriptions]");
  }
}
