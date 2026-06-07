import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getCredits } from "@/lib/credits";
import { fulfillPackOrder } from "@/lib/order-fulfillment";
import { getPlanBySku } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentIntentId, sessionId } = body as {
      orderId?: string;
      paymentIntentId?: string;
      sessionId?: string;
    };

    if (!orderId && !paymentIntentId && !sessionId) {
      return NextResponse.json({ error: "orderId, paymentIntentId o sessionId richiesto" }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non configurato" }, { status: 500 });
    }

    let resolvedOrderId = orderId;

    if (!resolvedOrderId && sessionId) {
      const { stripe } = await import("@/lib/stripe");
      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        resolvedOrderId = session.metadata?.orderId;
      }
    }

    if (!resolvedOrderId && paymentIntentId) {
      const { resolveOrderIdFromPaymentIntent } = await import("@/lib/order-fulfillment");
      resolvedOrderId = (await resolveOrderIdFromPaymentIntent(paymentIntentId)) || undefined;
    }

    if (!resolvedOrderId) {
      return NextResponse.json({
        success: false,
        status: "PROCESSING",
        message: "Ordine in elaborazione, attendere...",
      });
    }

    const orderRef = db.collection("orders").doc(resolvedOrderId);
    let orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({
        success: false,
        status: "PROCESSING",
        message: "Ordine in elaborazione, attendere...",
      });
    }

    let order = orderSnap.data()!;

    if (order.status === "PENDING" || !order.creditsProcessed) {
      await fulfillPackOrder({
        orderId: resolvedOrderId,
        paymentIntentId,
        sessionId,
        source: "check-order-status",
      });
      orderSnap = await orderRef.get();
      order = orderSnap.data()!;
    }

    const plan = getPlanBySku(order.sku);
    const productName = plan?.name || order.productName || "Pack report";
    const creditsAdded = order.creditsAdded || plan?.reports || order.creditsToAdd || 0;
    const totalCredits =
      order.customerUid && order.creditsProcessed
        ? await getCredits(order.customerUid)
        : creditsAdded;

    return NextResponse.json({
      success: order.status === "COMPLETE",
      status: order.status,
      productName,
      amount: (order.amount || 0) / 100,
      creditsAdded,
      totalCredits,
      newAccount: order.newAccount || false,
      password: order.password || null,
      emailSent: order.emailSent || false,
      emailError: order.emailError || null,
      customerEmail: order.customerEmail || null,
      userId: order.customerUid || null,
      sku: order.sku,
      currency: order.currency || "eur",
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      isSubscription: order.orderType === "subscription_intro",
      recurringAmount: order.recurringAmount ? order.recurringAmount / 100 : null,
      subscriptionNextBillingAt: order.subscriptionNextBillingAt || null,
      subscriptionTrialHours: order.subscriptionTrialHours || null,
    });
  } catch (error) {
    console.error("[check-order-status]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
