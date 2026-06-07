import Stripe from "stripe";
import {
  getPlanBySku,
  isSubscriptionPlan,
  PlanSku,
  SITE,
  SUBSCRIPTION_BILLING_INTERVAL,
  SUBSCRIPTION_BILLING_INTERVAL_COUNT,
} from "./pricing";

const key = process.env.STRIPE_SECRET_KEY || "";

export const stripe = key
  ? new Stripe(key, { apiVersion: "2025-08-27.basil" })
  : null;

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

const recurringPriceCache = new Map<string, string>();

export function getStripePriceId(sku: PlanSku): string | null {
  const map: Record<PlanSku, string | undefined> = {
    pack1: process.env.STRIPE_PRICE_PACK1,
    pack2: process.env.STRIPE_PRICE_PACK2,
    pack5: process.env.STRIPE_PRICE_PACK5,
    pack10: process.env.STRIPE_PRICE_PACK10,
  };
  return map[sku] || null;
}

function getStripeRecurringPriceId(sku: PlanSku): string | null {
  const map: Record<PlanSku, string | undefined> = {
    pack1: process.env.STRIPE_PRICE_PACK1_RECURRING,
    pack2: process.env.STRIPE_PRICE_PACK2_RECURRING,
    pack5: process.env.STRIPE_PRICE_PACK5_RECURRING,
    pack10: process.env.STRIPE_PRICE_PACK10_RECURRING,
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

export async function getOrCreateRecurringPriceId(
  sku: PlanSku,
  amountCents: number,
  productName: string,
  interval: "week" | "month" = SUBSCRIPTION_BILLING_INTERVAL,
  intervalCount: number = SUBSCRIPTION_BILLING_INTERVAL_COUNT
): Promise<string> {
  if (!stripe) throw new Error("Stripe non configurato");

  const configured = getStripeRecurringPriceId(sku);
  if (configured) return configured;

  const cacheKey = `${sku}-${interval}-${intervalCount}`;
  const cached = recurringPriceCache.get(cacheKey);
  if (cached) return cached;

  const product = await stripe.products.create({
    name: `${SITE.name} — ${productName}`,
    metadata: {
      site: SITE.domain,
      sku,
      billing: "recurring",
      interval,
      interval_count: String(intervalCount),
    },
  });

  const price = await stripe.prices.create({
    currency: "eur",
    unit_amount: amountCents,
    recurring: { interval, interval_count: intervalCount },
    product: product.id,
    metadata: { site: SITE.domain, sku, interval, interval_count: String(intervalCount) },
  });

  recurringPriceCache.set(cacheKey, price.id);
  return price.id;
}

export async function createPackPaymentIntent(params: {
  sku: PlanSku;
  email: string;
  amountCents: number;
  metadata: Record<string, string>;
  productName: string;
  savePaymentMethod?: boolean;
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
    setup_future_usage: params.savePaymentMethod ? "off_session" : undefined,
  });
}

export async function createSubscriptionAfterIntro(params: {
  customerId: string;
  paymentMethodId: string;
  sku: PlanSku;
  trialHours: number;
  metadata: Record<string, string>;
}): Promise<Stripe.Subscription> {
  if (!stripe) throw new Error("Stripe non configurato");

  const plan = getPlanBySku(params.sku);
  if (!isSubscriptionPlan(plan)) {
    throw new Error("Piano abbonamento non valido");
  }

  const recurringPriceId = await getOrCreateRecurringPriceId(
    params.sku,
    Math.round(plan.subscription.recurringPrice * 100),
    plan.name,
    plan.subscription.interval,
    plan.subscription.intervalCount
  );

  const trialEnd = Math.floor(Date.now() / 1000) + params.trialHours * 60 * 60;

  await stripe.customers.update(params.customerId, {
    invoice_settings: { default_payment_method: params.paymentMethodId },
  });

  return stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: recurringPriceId }],
    trial_end: trialEnd,
    default_payment_method: params.paymentMethodId,
    metadata: params.metadata,
    payment_settings: {
      save_default_payment_method: "on_subscription",
    },
    collection_method: "charge_automatically",
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
