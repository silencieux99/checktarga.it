import { NextRequest, NextResponse } from "next/server";
import { createPackCheckoutSession, stripe } from "@/lib/stripe";
import { getPlanBySku, PlanSku } from "@/lib/pricing";
import { ensureGuestUser } from "@/lib/credits";
import { getAdminDb } from "@/lib/firebase-admin";
import { cleanQuery, lookupVehicle } from "@/lib/vehicle";
import { SITE } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe non configurato" }, { status: 500 });
    }

    const body = await req.json();
    const { sku, email, vehicle = "", vehicleType = "plate" } = body as {
      sku?: PlanSku;
      email?: string;
      vehicle?: string;
      vehicleType?: string;
    };

    if (!sku || !email) {
      return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    const plan = getPlanBySku(sku);
    if (!plan) {
      return NextResponse.json({ error: "Pacchetto non trovato" }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non configurato" }, { status: 500 });
    }

    let vehicleInfo: Record<string, string | undefined> = {};
    if (vehicle) {
      const type = vehicleType === "vin" ? "vin" : "plate";
      const cleaned = cleanQuery(vehicle, type);
      const preview = await lookupVehicle(cleaned, type);
      vehicleInfo = {
        searchValue: cleaned,
        searchType: type,
        brand: preview.marca,
        model: preview.modello,
      };
    }

    const guest = await ensureGuestUser(email);
    const now = Date.now();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const orderRef = await db.collection("orders").add({
      status: "PENDING",
      site: SITE.domain,
      sku: plan.sku,
      productName: plan.name,
      amount: Math.round(plan.price * 100),
      currency: "eur",
      country: "IT",
      customerEmail: email,
      customerUid: guest.uid,
      creditsToAdd: plan.reports,
      searchValue: vehicleInfo.searchValue || null,
      searchType: vehicleInfo.searchType || null,
      brand: vehicleInfo.brand || null,
      model: vehicleInfo.model || null,
      newAccount: guest.newAccount,
      guestCheckout: true,
      password: guest.password || null,
      createdAt: now,
      updatedAt: now,
      processingLogs: [`[${new Date(now).toISOString()}] Ordine creato, in attesa pagamento Stripe.`],
    });

    const orderId = orderRef.id;
    const metadata = {
      site: SITE.domain,
      orderId,
      sku: plan.sku,
      customer_email: email,
      customerUid: guest.uid,
      guest_checkout: "true",
      country: "IT",
      searchValue: vehicleInfo.searchValue || "",
      searchType: vehicleInfo.searchType || "",
    };

    const session = await createPackCheckoutSession({
      sku: plan.sku,
      email,
      productName: `${plan.name} — ${SITE.name}`,
      amountCents: Math.round(plan.price * 100),
      successUrl: `${siteUrl}/checkout/success?order_id=${orderId}&customer_email=${encodeURIComponent(email)}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/checkout?sku=${plan.sku}&value=${encodeURIComponent(vehicle)}&type=${vehicleType}`,
      metadata,
    });

    await orderRef.update({
      stripeSessionId: session.id,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    console.error("[prepare-checkout]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore checkout" },
      { status: 500 }
    );
  }
}
