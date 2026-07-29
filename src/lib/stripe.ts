import Stripe from "stripe";
import { PlanSku, SITE } from "./pricing";

const key = process.env.STRIPE_SECRET_KEY || "";

export const stripe = key
  ? new Stripe(key, { apiVersion: "2025-08-27.basil" })
  : null;

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export function getStripePriceId(sku: PlanSku): string | null {
  const map: Record<PlanSku, string | undefined> = {
    pack1: process.env.STRIPE_PRICE_PACK1,
    pack2: process.env.STRIPE_PRICE_PACK2,
    pack5: process.env.STRIPE_PRICE_PACK5,
    pack10: process.env.STRIPE_PRICE_PACK10,
  };
  return map[sku] || null;
}

export async function getOrCreateStripeCustomer(
  email: string,
  metadata: Record<string, string>
): Promise<Stripe.Customer> {
  if (!stripe) throw new Error("Stripe non configurato");

  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) {
    return existing.data[0];
  }

  return stripe.customers.create({
    email,
    metadata,
  });
}

export async function createPackPaymentIntent(params: {
  sku: PlanSku;
  email: string;
  amountCents: number;
  metadata: Record<string, string>;
  productName: string;
}): Promise<Stripe.PaymentIntent> {
  if (!stripe) throw new Error("Stripe non configurato");

  const customer = await getOrCreateStripeCustomer(params.email, {
    guest_checkout: "true",
    site: params.metadata.site || SITE.domain,
  });

  return stripe.paymentIntents.create({
    amount: params.amountCents,
    currency: "eur",
    customer: customer.id,
    receipt_email: params.email,
    description: params.productName,
    metadata: {
      ...params.metadata,
      stripeCustomerId: customer.id,
    },
    automatic_payment_methods: { enabled: true },
  });
}

export async function createPackCheckoutSession(params: {
  sku: PlanSku;
  email: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
  productName: string;
  amountCents: number;
}): Promise<Stripe.Checkout.Session> {
  if (!stripe) throw new Error("Stripe non configurato");

  const priceId = getStripePriceId(params.sku);
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
    ? [{ price: priceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: "eur",
            unit_amount: params.amountCents,
            product_data: {
              name: params.productName,
            },
          },
          quantity: 1,
        },
      ];

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: params.email,
    line_items: lineItems,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    locale: "it",
    metadata: params.metadata,
    payment_intent_data: {
      metadata: params.metadata,
    },
  });
}
