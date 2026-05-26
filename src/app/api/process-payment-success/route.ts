import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { fulfillPackOrder } from "@/lib/order-fulfillment";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, sessionId, paymentIntentId, customerEmail } = body as {
      orderId?: string;
      sessionId?: string;
      paymentIntentId?: string;
      customerEmail?: string;
    };

    if (!orderId && !sessionId && !paymentIntentId) {
      return NextResponse.json({ error: "orderId, sessionId o paymentIntentId richiesto" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    let decodedToken = null;
    if (authHeader?.startsWith("Bearer ")) {
      decodedToken = await verifyFirebaseToken(authHeader.substring(7));
    }

    let resolvedOrderId = orderId;

    if (!resolvedOrderId && paymentIntentId) {
      const { resolveOrderIdFromPaymentIntent } = await import("@/lib/order-fulfillment");
      resolvedOrderId = (await resolveOrderIdFromPaymentIntent(paymentIntentId)) || undefined;
    }

    if (!resolvedOrderId && sessionId) {
      const { stripe } = await import("@/lib/stripe");
      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        resolvedOrderId = session.metadata?.orderId;
      }
    }

    if (!resolvedOrderId) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non configurato" }, { status: 500 });
    }

    const orderSnap = await db.collection("orders").doc(resolvedOrderId).get();
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Ordine inesistente" }, { status: 404 });
    }

    const order = orderSnap.data()!;

    if (decodedToken && order.customerUid && order.customerUid !== decodedToken.uid) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    if (!decodedToken && customerEmail) {
      const orderEmail = String(order.customerEmail || "").toLowerCase();
      if (orderEmail !== customerEmail.toLowerCase()) {
        return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
      }
    }

    const result = await fulfillPackOrder({
      orderId: resolvedOrderId,
      sessionId,
      paymentIntentId,
      source: "process-payment-success",
    });

    if (!result) {
      return NextResponse.json({ error: "Impossibile elaborare l'ordine" }, { status: 500 });
    }

    if (result.status === "PROCESSING") {
      return NextResponse.json(
        { success: false, retry: true, status: result.status },
        { status: 409 }
      );
    }

    if (result.status === "PENDING") {
      return NextResponse.json(
        { success: false, retry: true, status: result.status },
        { status: 202 }
      );
    }

    return NextResponse.json({
      success: true,
      ok: true,
      alreadyProcessed: result.alreadyProcessed || false,
      creditsAdded: result.creditsAdded,
      credits: result.creditsAdded,
      totalCredits: result.totalCredits,
      newAccount: result.newAccount,
      password: result.password,
      customerEmail: result.customerEmail,
      productName: result.productName,
      amount: result.amount,
      emailSent: result.emailSent,
      status: result.status,
    });
  } catch (error) {
    console.error("[process-payment-success]", error);
    return NextResponse.json({ error: "Errore elaborazione" }, { status: 500 });
  }
}
