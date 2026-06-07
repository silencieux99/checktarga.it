"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatSubscriptionBillingPeriod } from "@/lib/pricing";

interface SubscriptionInfo {
  sku: string;
  planName: string;
  status: string;
  statusLabel: string;
  recurringAmount: number;
  recurringCredits: number;
  nextBillingAt: number | null;
  cancelAtPeriodEnd: boolean;
  paymentMethodBrand?: string | null;
  paymentMethodLast4?: string | null;
}

export default function SubscriptionPanel() {
  const { firebaseUser } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    if (!firebaseUser) return;
    setLoading(true);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch("/api/account/subscription", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore caricamento abbonamento");
      setSubscription(data.subscription || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const handleCancel = async () => {
    if (!firebaseUser || !subscription) return;
    if (!window.confirm("Vuoi annullare il rinnovo automatico alla fine del periodo corrente?")) {
      return;
    }

    setCancelling(true);
    setMessage(null);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch("/api/account/subscription", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore annullamento");
      setMessage(data.message);
      await loadSubscription();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setCancelling(false);
    }
  };

  if (loading || !subscription || subscription.status === "trialing") {
    return null;
  }

  const nextBilling = subscription.nextBillingAt
    ? new Date(subscription.nextBillingAt).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="card-surface space-y-4 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Abbonamento attivo
          </p>
          <h3 className="mt-1.5 text-lg font-semibold text-brand">{subscription.planName}</h3>
          <p className="mt-1 text-sm text-brand-muted">Stato: {subscription.statusLabel}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
          <RefreshCw className="h-5 w-5" />
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-border bg-brand-surface px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-muted">
            <CreditCard className="h-3.5 w-3.5" />
            Rinnovo
          </div>
          <p className="mt-1.5 text-sm font-semibold text-brand">
            {formatPrice(subscription.recurringAmount)} {formatSubscriptionBillingPeriod()}
          </p>
          <p className="mt-1 text-xs text-brand-muted">
            +{subscription.recurringCredits} credito
            {subscription.recurringCredits > 1 ? "i" : ""} per ciclo
          </p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-surface px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-muted">
            <CalendarClock className="h-3.5 w-3.5" />
            Prossimo addebito
          </div>
          <p className="mt-1.5 text-sm font-semibold text-brand">
            {nextBilling || "In programmazione"}
          </p>
          {subscription.paymentMethodLast4 && (
            <p className="mt-1 text-xs text-brand-muted">
              Carta {subscription.paymentMethodBrand || "card"} ••••{" "}
              {subscription.paymentMethodLast4}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-brand-border bg-brand-surface px-4 py-3 text-xs leading-relaxed text-brand-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
        <p>
          Il pagamento ricorrente avviene automaticamente sulla carta salvata tramite Stripe. Puoi
          annullare prima del prossimo addebito senza penali.
        </p>
      </div>

      {message && <p className="text-sm text-brand-accent">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!subscription.cancelAtPeriodEnd ? (
        <button
          type="button"
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
        >
          {cancelling ? "Annullamento..." : "Annulla rinnovo automatico"}
        </button>
      ) : (
        <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Il rinnovo automatico è già stato annullato. L&apos;abbonamento terminerà al prossimo
          ciclo di fatturazione.
        </p>
      )}
    </div>
  );
}
