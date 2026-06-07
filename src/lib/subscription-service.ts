import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
import { addCredits } from "./credits";
import { getAdminDb } from "./firebase-admin";
import {
  getPlanBySku,
  isSubscriptionPlan,
  PlanSku,
  SITE,
  type SubscriptionConfig,
} from "./pricing";
import { createSubscriptionAfterIntro, stripe } from "./stripe";

export interface UserSubscription {
  uid: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  sku: PlanSku;
  status: string;
  introOrderId: string;
  introPaidAt: number;
  nextBillingAt: number | null;
  recurringAmount: number;
  recurringCredits: number;
  cancelAtPeriodEnd: boolean;
  paymentMethodBrand?: string | null;
  paymentMethodLast4?: string | null;
  createdAt: number;
  updatedAt: number;
}

function subscriptionDocId(uid: string, stripeSubscriptionId: string) {
  return `${uid}_${stripeSubscriptionId}`;
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): number {
  const item = subscription.items?.data?.[0];
  if (item?.current_period_end) return item.current_period_end;
  if (subscription.trial_end) return subscription.trial_end;
  return subscription.billing_cycle_anchor;
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription = invoice.parent?.subscription_details?.subscription;
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
}

export async function scheduleSubscriptionAfterIntroPayment(options: {
  orderId: string;
  paymentIntentId: string;
  customerUid: string;
}): Promise<Stripe.Subscription | null> {
  const db = getAdminDb();
  if (!db || !stripe) return null;

  const orderRef = db.collection("orders").doc(options.orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) return null;

  const order = orderSnap.data()!;
  if (order.subscriptionScheduled === true) {
    return null;
  }

  const plan = getPlanBySku(order.sku);
  if (!isSubscriptionPlan(plan)) return null;

  const paymentIntent = await stripe.paymentIntents.retrieve(options.paymentIntentId, {
    expand: ["payment_method"],
  });

  const paymentMethod = paymentIntent.payment_method;
  const paymentMethodId =
    typeof paymentMethod === "string" ? paymentMethod : paymentMethod?.id;

  if (!paymentMethodId) {
    throw new Error("Metodo di pagamento non disponibile per l'abbonamento");
  }

  const customerId =
    (typeof paymentIntent.customer === "string"
      ? paymentIntent.customer
      : paymentIntent.customer?.id) || order.stripeCustomerId;

  if (!customerId) {
    throw new Error("Cliente Stripe non disponibile");
  }

  const subscription = await createSubscriptionAfterIntro({
    customerId,
    paymentMethodId,
    sku: plan.sku,
    trialHours: plan.subscription.trialHours,
    metadata: {
      site: SITE.domain,
      sku: plan.sku,
      orderId: options.orderId,
      customerUid: options.customerUid,
      customer_email: order.customerEmail || "",
    },
  });

  const pm =
    typeof paymentMethod === "object" && paymentMethod && "card" in paymentMethod
      ? paymentMethod
      : null;

  const nextBillingAt = getSubscriptionPeriodEnd(subscription) * 1000;

  const subscriptionRecord: UserSubscription = {
    uid: options.customerUid,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    sku: plan.sku,
    status: subscription.status,
    introOrderId: options.orderId,
    introPaidAt: Date.now(),
    nextBillingAt,
    recurringAmount: Math.round(plan.subscription.recurringPrice * 100),
    recurringCredits: plan.subscription.recurringCredits,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    paymentMethodBrand: pm?.card?.brand || null,
    paymentMethodLast4: pm?.card?.last4 || null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await db
    .collection("subscriptions")
    .doc(subscriptionDocId(options.customerUid, subscription.id))
    .set(subscriptionRecord);

  await orderRef.update({
    subscriptionScheduled: true,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionNextBillingAt: nextBillingAt,
    recurringAmount: subscriptionRecord.recurringAmount,
    updatedAt: Date.now(),
    processingLogs: FieldValue.arrayUnion(
      `[${new Date().toISOString()}] Abbonamento programmato (${subscription.id}), primo rinnovo tra ${plan.subscription.trialHours}h`
    ),
  });

  return subscription;
}

export async function fulfillSubscriptionRenewal(
  invoice: Stripe.Invoice
): Promise<{ creditsAdded: number; uid: string | null } | null> {
  const db = getAdminDb();
  if (!db || !stripe) return null;

  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId || !invoice.id || invoice.amount_paid <= 0) {
    return null;
  }

  if (invoice.billing_reason !== "subscription_cycle") {
    return null;
  }

  const eventRef = db.collection("billing_events").doc(invoice.id);
  const existing = await eventRef.get();
  if (existing.exists) {
    return null;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const uid = subscription.metadata?.customerUid;
  const sku = subscription.metadata?.sku as PlanSku | undefined;

  if (!uid || !sku) {
    console.warn("[subscription] Invoice senza metadata utente:", invoice.id);
    return null;
  }

  const plan = getPlanBySku(sku);
  const creditsToAdd =
    plan?.subscription?.recurringCredits || plan?.reports || 0;

  if (creditsToAdd <= 0) return null;

  await addCredits(
    uid,
    creditsToAdd,
    sku,
    `Rinnovo abbonamento Stripe (${invoice.id})`
  );

  await eventRef.set({
    type: "subscription_renewal",
    invoiceId: invoice.id,
    subscriptionId,
    uid,
    sku,
    creditsAdded: creditsToAdd,
    amountPaid: invoice.amount_paid,
    processedAt: Date.now(),
  });

  const subQuery = await db
    .collection("subscriptions")
    .where("stripeSubscriptionId", "==", subscriptionId)
    .limit(1)
    .get();

  if (!subQuery.empty) {
    await subQuery.docs[0].ref.update({
      status: subscription.status,
      nextBillingAt: getSubscriptionPeriodEnd(subscription) * 1000,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: Date.now(),
      lastRenewalAt: Date.now(),
      lastInvoiceId: invoice.id,
    });
  }

  return { creditsAdded: creditsToAdd, uid };
}

export async function syncSubscriptionStatus(
  subscription: Stripe.Subscription
): Promise<void> {
  const db = getAdminDb();
  if (!db) return;

  const uid = subscription.metadata?.customerUid;
  if (!uid) return;

  const subQuery = await db
    .collection("subscriptions")
    .where("stripeSubscriptionId", "==", subscription.id)
    .limit(1)
    .get();

  if (subQuery.empty) return;

  await subQuery.docs[0].ref.update({
    status: subscription.status,
    nextBillingAt: getSubscriptionPeriodEnd(subscription) * 1000,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: Date.now(),
  });
}

export async function getActiveSubscriptionForUser(
  uid: string
): Promise<UserSubscription | null> {
  const db = getAdminDb();
  if (!db) return null;

  const snap = await db.collection("subscriptions").where("uid", "==", uid).get();

  const active = snap.docs
    .map((doc) => doc.data() as UserSubscription)
    .sort((a, b) => b.createdAt - a.createdAt)
    .find((item) => ["trialing", "active", "past_due"].includes(item.status));

  return active || null;
}

export function isSubscriptionVisibleInAccount(subscription: UserSubscription): boolean {
  return subscription.status !== "trialing";
}

export async function getAccountSubscriptionForUser(
  uid: string
): Promise<UserSubscription | null> {
  const subscription = await getActiveSubscriptionForUser(uid);
  if (!subscription || !isSubscriptionVisibleInAccount(subscription)) {
    return null;
  }
  return subscription;
}

async function markSubscriptionCanceledAtPeriodEnd(
  stripeSubscriptionId: string,
  updated: Stripe.Subscription
): Promise<void> {
  const db = getAdminDb();
  if (!db) return;

  const snap = await db
    .collection("subscriptions")
    .where("stripeSubscriptionId", "==", stripeSubscriptionId)
    .limit(1)
    .get();

  if (snap.empty) return;

  await snap.docs[0].ref.update({
    cancelAtPeriodEnd: true,
    status: updated.status,
    nextBillingAt: getSubscriptionPeriodEnd(updated) * 1000,
    updatedAt: Date.now(),
  });
}

export async function cancelSubscriptionByStripeId(
  stripeSubscriptionId: string
): Promise<{ success: boolean; cancelAt: number | null }> {
  if (!stripe) throw new Error("Stripe non configurato");

  const updated = await stripe.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await markSubscriptionCanceledAtPeriodEnd(stripeSubscriptionId, updated);

  return {
    success: true,
    cancelAt: getSubscriptionPeriodEnd(updated) * 1000,
  };
}

export async function cancelUserSubscription(
  uid: string
): Promise<{ success: boolean; cancelAt: number | null }> {
  const subscription = await getActiveSubscriptionForUser(uid);
  if (!subscription) {
    throw new Error("Nessun abbonamento attivo");
  }

  return cancelSubscriptionByStripeId(subscription.stripeSubscriptionId);
}

export { describeSubscriptionStatus } from "./subscription-labels";

export function getSubscriptionSummary(planSku: PlanSku): SubscriptionConfig | null {
  const plan = getPlanBySku(planSku);
  return plan?.subscription || null;
}
