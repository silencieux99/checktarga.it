import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import {
  cancelUserSubscription,
  describeSubscriptionStatus,
  getAccountSubscriptionForUser,
} from "@/lib/subscription-service";
import { getPlanBySku } from "@/lib/pricing";

export const runtime = "nodejs";

async function getUid(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const decoded = await verifyFirebaseToken(token);
  return decoded?.uid || null;
}

export async function GET(req: NextRequest) {
  try {
    const uid = await getUid(req);
    if (!uid) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const subscription = await getAccountSubscriptionForUser(uid);
    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    const plan = getPlanBySku(subscription.sku);

    return NextResponse.json({
      subscription: {
        sku: subscription.sku,
        planName: plan?.name || subscription.sku,
        status: subscription.status,
        statusLabel: describeSubscriptionStatus(subscription.status),
        recurringAmount: subscription.recurringAmount / 100,
        recurringCredits: subscription.recurringCredits,
        nextBillingAt: subscription.nextBillingAt,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        paymentMethodBrand: subscription.paymentMethodBrand,
        paymentMethodLast4: subscription.paymentMethodLast4,
      },
    });
  } catch (error) {
    console.error("[account/subscription GET]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const uid = await getUid(req);
    if (!uid) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const result = await cancelUserSubscription(uid);

    return NextResponse.json({
      success: true,
      cancelAt: result.cancelAt,
      message: "Abbonamento annullato alla fine del periodo corrente.",
    });
  } catch (error) {
    console.error("[account/subscription POST]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore interno" },
      { status: 400 }
    );
  }
}
