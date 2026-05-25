import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { getPlanBySku } from "@/lib/pricing";
import { addCredits } from "@/lib/credits";
import { getAdminDb } from "@/lib/firebase-admin";
import Stripe from "stripe";

export const runtime = "nodejs";

const processed = new Set<string>();

async function fulfillOrder(paymentIntent: Stripe.PaymentIntent) {
  if (paymentIntent.metadata?.site && paymentIntent.metadata.site !== "checktarga.it") {
    return;
  }

  const db = getAdminDb();
  if (!db) throw new Error("Firestore non configurato");

  const orderId = paymentIntent.metadata?.orderId;
  const sku = paymentIntent.metadata?.sku;
  const customerEmail = paymentIntent.metadata?.customer_email;
  const customerUid = paymentIntent.metadata?.customerUid;

  if (!orderId || !sku || !customerEmail || !customerUid) {
    console.error("[webhook] metadata mancanti", paymentIntent.metadata);
    return;
  }

  const existing = await db
    .collection("orders")
    .where("paymentIntentId", "==", paymentIntent.id)
    .limit(1)
    .get();

  if (!existing.empty) {
    const data = existing.docs[0].data();
    if (data.status === "COMPLETE") return;
  }

  const plan = getPlanBySku(sku);
  if (!plan) return;

  await db.collection("orders").doc(orderId).set(
    {
      status: "COMPLETE",
      paymentIntentId: paymentIntent.id,
      paidAt: Date.now(),
      updatedAt: Date.now(),
      creditsAdded: plan.reports,
      processingLogs: [
        `[${new Date().toISOString()}] Pagamento Stripe confermato, crediti aggiunti.`,
      ],
    },
    { merge: true }
  );

  await addCredits(customerUid, plan.reports, plan.sku, "Acquisto Stripe completato");
}

export async function POST(req: NextRequest) {
  try {
    if (!stripe || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook non configurato" }, { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

    if (processed.has(event.id)) {
      return NextResponse.json({ received: true });
    }
    processed.add(event.id);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentIntentId = session.payment_intent as string;
        if (paymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          await fulfillOrder(paymentIntent);
        }
        break;
      }
      case "payment_intent.succeeded":
        await fulfillOrder(event.data.object as Stripe.PaymentIntent);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook]", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
