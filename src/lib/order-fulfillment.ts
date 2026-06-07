import { FieldValue, DocumentData, DocumentReference } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "./firebase-admin";
import { addCredits, getCredits } from "./credits";
import { getPlanBySku, isSubscriptionPlan, SITE, PlanSku } from "./pricing";
import { stripe } from "./stripe";
import { sendOrderConfirmationEmail } from "./order-confirmation-email-service";
import { sendWelcomeEmail } from "./welcome-email-service";
import { sendTelegramOrderNotification } from "./telegram-notification-service";
import { scheduleSubscriptionAfterIntroPayment } from "./subscription-service";

export interface FulfillmentResult {
  success: boolean;
  status: string;
  creditsAdded: number;
  totalCredits: number;
  newAccount: boolean;
  password: string | null;
  customerEmail: string;
  productName: string;
  amount: number;
  sku: string;
  emailSent: boolean;
  emailError?: string | null;
  alreadyProcessed?: boolean;
  userId?: string | null;
}

function buildResult(
  order: DocumentData,
  creditsAdded: number,
  totalCredits: number,
  alreadyProcessed = false,
  status = "COMPLETE"
): FulfillmentResult {
  return {
    success: status === "COMPLETE",
    status,
    creditsAdded,
    totalCredits,
    newAccount: Boolean(order.newAccount),
    password: order.password || null,
    customerEmail: order.customerEmail || "",
    productName: order.productName || "Pack report",
    amount: (order.amount || 0) / 100,
    sku: order.sku || "",
    emailSent: Boolean(order.emailSent),
    emailError: order.emailError || null,
    alreadyProcessed,
    userId: order.customerUid || null,
  };
}

export function generateGuestPassword(): string {
  return `Targa${Math.floor(Math.random() * 900) + 100}!`;
}

async function ensureCustomerAccount(order: DocumentData): Promise<{
  customerUid: string;
  newAccount: boolean;
  password: string | null;
}> {
  const auth = getAdminAuth();
  const db = getAdminDb();
  if (!auth || !db) throw new Error("Firebase Admin non configurato");

  const email = order.customerEmail as string;
  if (!email) throw new Error("Email cliente mancante");

  if (order.customerUid) {
    return {
      customerUid: order.customerUid,
      newAccount: Boolean(order.newAccount),
      password: order.password || null,
    };
  }

  const password = generateGuestPassword();
  try {
    const user = await auth.createUser({
      email,
      password,
      displayName: email.split("@")[0],
    });

    await db.collection("users").doc(user.uid).set({
      email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      site: SITE.domain,
      guestCheckout: true,
    });

    return { customerUid: user.uid, newAccount: true, password };
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === "auth/email-already-exists") {
      const existing = await auth.getUserByEmail(email);
      return { customerUid: existing.uid, newAccount: false, password: null };
    }
    throw error;
  }
}

async function sendOrderEmails(
  orderRef: DocumentReference,
  order: DocumentData,
  orderId: string,
  creditsAdded: number,
  totalCredits: number,
  password: string | null,
  newAccount: boolean
): Promise<boolean> {
  const email = order.customerEmail as string;
  if (!email) return false;

  let emailSent = false;

  if (newAccount && password) {
    emailSent = await sendWelcomeEmail(email, {
      productName: order.productName || "Pack report",
      creditsAdded,
      totalCredits,
      amount: (order.amount || 0) / 100,
      password,
      newAccount: true,
    });
  }

  const confirmationSent = await sendOrderConfirmationEmail({
    email,
    orderId,
    productName: order.productName || "Pack report",
    amount: ((order.amount || 0) / 100).toFixed(2),
    sku: order.sku || "",
    credits: creditsAdded,
    totalCredits,
    password: password || undefined,
    newAccount,
  });

  emailSent = emailSent || confirmationSent;

  await orderRef.update({
    emailSent,
    emailError: emailSent ? null : "Invio email fallito",
    updatedAt: Date.now(),
  });

  return emailSent;
}

export async function fulfillPackOrder(options: {
  orderId: string;
  paymentIntentId?: string;
  sessionId?: string;
  source: string;
}): Promise<FulfillmentResult | null> {
  const db = getAdminDb();
  if (!db || !stripe) return null;

  const orderRef = db.collection("orders").doc(options.orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) return null;

  const order = orderSnap.data()!;

  if (order.site && order.site !== SITE.domain) return null;

  if (order.creditsProcessed === true) {
    const totalCredits = order.customerUid ? await getCredits(order.customerUid) : order.creditsAdded || 0;
    return buildResult(order, order.creditsAdded || 0, totalCredits, true);
  }

  if (order.processingInProgress) {
    return buildResult(order, 0, 0, false, "PROCESSING");
  }

  let paymentIntentId = options.paymentIntentId || order.paymentIntentId;

  if (!paymentIntentId && options.sessionId) {
    const session = await stripe.checkout.sessions.retrieve(options.sessionId);
    paymentIntentId = session.payment_intent as string;
  }

  if (!paymentIntentId) {
    return buildResult(order, 0, 0, false, "PENDING");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    return buildResult(order, 0, 0, false, "PENDING");
  }

  if (paymentIntent.metadata?.site && paymentIntent.metadata.site !== SITE.domain) {
    return null;
  }

  await orderRef.update({
    processingInProgress: true,
    processingStartedAt: Date.now(),
    paymentIntentId,
    updatedAt: Date.now(),
  });

  try {
    const plan = getPlanBySku(order.sku);
    const creditsToAdd = plan?.reports || order.creditsToAdd || 0;
    const { customerUid, newAccount, password } = await ensureCustomerAccount(order);

    if (creditsToAdd > 0) {
      await addCredits(
        customerUid,
        creditsToAdd,
        (order.sku as PlanSku) || "pack1",
        `Acquisto Stripe (${options.source})`
      );
    }

    const totalCredits = await getCredits(customerUid);

    await orderRef.update({
      status: "COMPLETE",
      creditsProcessed: true,
      creditsAdded: creditsToAdd,
      customerUid,
      newAccount,
      password: password || order.password || null,
      paymentIntentId,
      paidAt: Date.now(),
      updatedAt: Date.now(),
      processingInProgress: false,
      processingLogs: FieldValue.arrayUnion(
        `[${new Date().toISOString()}] Ordine completato via ${options.source}`
      ),
    });

    const updatedSnap = await orderRef.get();
    const updatedOrder = updatedSnap.data()!;

    let emailSent = Boolean(updatedOrder.emailSent);
    if (!emailSent) {
      emailSent = await sendOrderEmails(
        orderRef,
        updatedOrder,
        options.orderId,
        creditsToAdd,
        totalCredits,
        password || updatedOrder.password || null,
        newAccount
      );
    }

    if (
      isSubscriptionPlan(plan) &&
      !updatedOrder.subscriptionScheduled &&
      paymentIntent.setup_future_usage === "off_session"
    ) {
      try {
        await scheduleSubscriptionAfterIntroPayment({
          orderId: options.orderId,
          paymentIntentId,
          customerUid,
        });
      } catch (subscriptionError) {
        await orderRef.update({
          subscriptionError:
            subscriptionError instanceof Error
              ? subscriptionError.message
              : "Errore programmazione abbonamento",
          updatedAt: Date.now(),
          processingLogs: FieldValue.arrayUnion(
            `[${new Date().toISOString()}] Errore abbonamento: ${
              subscriptionError instanceof Error
                ? subscriptionError.message
                : "Errore sconosciuto"
            }`
          ),
        });
      }
    }

    if (!updatedOrder.telegramNotificationSent) {
      await sendTelegramOrderNotification({
        orderId: options.orderId,
        productName: updatedOrder.productName || plan?.name || "Pack report",
        amount: updatedOrder.amount || paymentIntent.amount_received || paymentIntent.amount,
        customerEmail: updatedOrder.customerEmail,
        sku: updatedOrder.sku || "",
        creditsAdded: creditsToAdd,
        newAccount,
        connectedUser: !newAccount,
        currency: updatedOrder.currency || "eur",
        country: updatedOrder.country || "IT",
      });

      await orderRef.update({
        telegramNotificationSent: true,
        updatedAt: Date.now(),
      });
    }

    return {
      success: true,
      status: "COMPLETE",
      creditsAdded: creditsToAdd,
      totalCredits,
      newAccount,
      password: password || updatedOrder.password || null,
      customerEmail: updatedOrder.customerEmail,
      productName: updatedOrder.productName || plan?.name || "Pack report",
      amount: (updatedOrder.amount || 0) / 100,
      sku: updatedOrder.sku || "",
      emailSent,
      userId: customerUid,
    };
  } catch (error) {
    await orderRef.update({
      processingInProgress: false,
      updatedAt: Date.now(),
      processingLogs: FieldValue.arrayUnion(
        `[${new Date().toISOString()}] Errore fulfillment: ${
          error instanceof Error ? error.message : "Errore sconosciuto"
        }`
      ),
    });
    throw error;
  }
}

export async function resolveOrderIdFromPaymentIntent(
  paymentIntentId: string
): Promise<string | null> {
  const db = getAdminDb();
  if (!db || !stripe) return null;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.metadata?.orderId) {
    return paymentIntent.metadata.orderId;
  }

  const existing = await db
    .collection("orders")
    .where("paymentIntentId", "==", paymentIntentId)
    .limit(1)
    .get();

  if (!existing.empty) {
    return existing.docs[0].id;
  }

  return null;
}
