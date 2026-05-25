import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPlanBySku } from "@/lib/pricing";
import { addCredits } from "@/lib/credits";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { orderId, sessionId } = await req.json();

    if (!orderId && !sessionId) {
      return NextResponse.json({ error: "orderId o sessionId richiesto" }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db || !stripe) {
      return NextResponse.json({ error: "Servizio non configurato" }, { status: 500 });
    }

    let resolvedOrderId = orderId as string | undefined;
    let paymentIntentId: string | undefined;

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paymentIntentId = session.payment_intent as string;
      if (!resolvedOrderId && session.metadata?.orderId) {
        resolvedOrderId = session.metadata.orderId;
      }
    }

    if (!resolvedOrderId) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    const orderSnap = await db.collection("orders").doc(resolvedOrderId).get();
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Ordine inesistente" }, { status: 404 });
    }

    const order = orderSnap.data()!;
    if (order.status === "COMPLETE") {
      return NextResponse.json({
        ok: true,
        creditsAdded: order.creditsAdded || order.creditsToAdd || 0,
      });
    }

    if (paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== "succeeded") {
        return NextResponse.json({ error: "Pagamento non completato" }, { status: 402 });
      }
    }

    const plan = getPlanBySku(order.sku);
    const credits = plan?.reports || order.creditsToAdd || 0;

    await db.collection("orders").doc(resolvedOrderId).update({
      status: "COMPLETE",
      paymentIntentId: paymentIntentId || order.paymentIntentId || null,
      creditsAdded: credits,
      paidAt: Date.now(),
      updatedAt: Date.now(),
    });

    if (order.customerUid && credits > 0) {
      await addCredits(order.customerUid, credits, order.sku, "Conferma pagamento success page");
    }

    return NextResponse.json({ ok: true, creditsAdded: credits });
  } catch (error) {
    console.error("[process-payment-success]", error);
    return NextResponse.json({ error: "Errore elaborazione" }, { status: 500 });
  }
}
