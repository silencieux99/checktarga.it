import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { fulfillPackOrder, resolveOrderIdFromPaymentIntent } from "@/lib/order-fulfillment";
import {
  fulfillSubscriptionRenewal,
  syncSubscriptionStatus,
} from "@/lib/subscription-service";
import { sendTelegramErrorNotification } from "@/lib/telegram-notification-service";
import Stripe from "stripe";

export const runtime = "nodejs";

const processedEvents = new Set<string>();

function getWebhookSecrets(): string[] {
  return [
    STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_TEST,
    process.env.STRIPE_WEBHOOK_SECRET_LIVE,
    process.env.STRIPE_WEBHOOK_SECRET_ALT,
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId =
    paymentIntent.metadata?.orderId || (await resolveOrderIdFromPaymentIntent(paymentIntent.id));

  if (!orderId) {
    console.warn("[webhook] PaymentIntent senza orderId:", paymentIntent.id);
    return;
  }

  await fulfillPackOrder({
    orderId,
    paymentIntentId: paymentIntent.id,
    source: "webhook",
  });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const paymentIntentId = session.payment_intent as string | null;
  const orderId = session.metadata?.orderId;

  if (orderId) {
    await fulfillPackOrder({
      orderId,
      paymentIntentId: paymentIntentId || undefined,
      sessionId: session.id,
      source: "webhook-checkout",
    });
    return;
  }

  if (paymentIntentId) {
    const resolvedOrderId = await resolveOrderIdFromPaymentIntent(paymentIntentId);
    if (resolvedOrderId) {
      await fulfillPackOrder({
        orderId: resolvedOrderId,
        paymentIntentId,
        sessionId: session.id,
        source: "webhook-checkout",
      });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe non configurato" }, { status: 500 });
    }

    const secrets = getWebhookSecrets();
    if (secrets.length === 0) {
      return NextResponse.json({ error: "Webhook secret mancante" }, { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
    }

    let event: Stripe.Event | undefined;
    let lastError: unknown = null;

    for (const secret of secrets) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, secret);
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!event) {
      console.error("[webhook] Firma non valida:", lastError);
      return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
    }

    if (processedEvents.has(event.id)) {
      return NextResponse.json({ received: true });
    }
    processedEvents.add(event.id);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "invoice.paid":
        await fulfillSubscriptionRenewal(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscriptionStatus(event.data.object as Stripe.Subscription);
        break;
      case "payment_intent.payment_failed": {
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = failedIntent.metadata?.orderId;
        if (orderId) {
          const { getAdminDb } = await import("@/lib/firebase-admin");
          const db = getAdminDb();
          if (db) {
            await db.collection("orders").doc(orderId).update({
              status: "FAILED",
              updatedAt: Date.now(),
              processingLogs: [
                `[${new Date().toISOString()}] Pagamento Stripe fallito (${failedIntent.id})`,
              ],
            });
          }
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook]", error);
    await sendTelegramErrorNotification(
      error instanceof Error ? error.message : "Errore webhook",
      "Stripe webhook CheckTarga"
    );
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
