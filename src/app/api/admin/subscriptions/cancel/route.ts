import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-request";
import { cancelSubscriptionByStripeId } from "@/lib/subscription-service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminRequest(req);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const stripeSubscriptionId = String(body.stripeSubscriptionId || "").trim();

    if (!stripeSubscriptionId) {
      return NextResponse.json({ error: "ID abbonamento mancante" }, { status: 400 });
    }

    const result = await cancelSubscriptionByStripeId(stripeSubscriptionId);

    return NextResponse.json({
      success: true,
      cancelAt: result.cancelAt,
    });
  } catch (error) {
    console.error("[admin/subscriptions/cancel]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore interno" },
      { status: 500 }
    );
  }
}
