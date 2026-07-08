"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import KpiCard from "@/components/admin/KpiCard";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import { formatPrice, getPlanBySku } from "@/lib/pricing";
import { describeSubscriptionStatus } from "@/lib/subscription-labels";

interface AdminSubscription {
  id: string;
  uid: string;
  email: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  sku: string;
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
  lastRenewalAt?: number;
}

interface BillingEventRow {
  id: string;
  invoiceId: string;
  subscriptionId: string;
  uid: string;
  email: string;
  sku: string;
  creditsAdded: number;
  amountPaid: number;
  processedAt: number;
}

interface SubscriptionsResponse {
  subscriptions: AdminSubscription[];
  renewals: BillingEventRow[];
  stats: {
    total: number;
    active: number;
    trialing: number;
    pastDue: number;
    canceled: number;
    pendingCancel: number;
    recurringRevenueCents: number;
    renewalCount30d: number;
    renewalRevenue30dCents: number;
  };
}

function formatDateTime(ts?: number | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("it-IT");
}

function formatDate(ts?: number | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("it-IT");
}

function subscriptionStatusClass(status: string, cancelAtPeriodEnd: boolean) {
  if (cancelAtPeriodEnd && ["trialing", "active", "past_due"].includes(status)) {
    return "bg-amber-500/10 text-amber-300";
  }
  switch (status) {
    case "trialing":
      return "bg-blue-500/10 text-blue-300";
    case "active":
      return "bg-emerald-500/10 text-emerald-300";
    case "past_due":
      return "bg-red-500/10 text-red-300";
    case "canceled":
    case "unpaid":
      return "bg-slate-500/10 text-slate-400";
    default:
      return "bg-white/5 text-slate-300";
  }
}

function stripeDashboardUrl(path: string) {
  const isTest =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test");
  const base = isTest ? "https://dashboard.stripe.com/test" : "https://dashboard.stripe.com";
  return `${base}/${path}`;
}

function planLabel(sku: string) {
  return getPlanBySku(sku)?.name || sku;
}

function AdminSubscriptionsContent() {
  const { fetchAdmin, adminRequest, firebaseUser } = useAdminFetch();
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [renewals, setRenewals] = useState<BillingEventRow[]>([]);
  const [stats, setStats] = useState<SubscriptionsResponse["stats"]>({
    total: 0,
    active: 0,
    trialing: 0,
    pastDue: 0,
    canceled: 0,
    pendingCancel: 0,
    recurringRevenueCents: 0,
    renewalCount30d: 0,
    renewalRevenue30dCents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [skuFilter, setSkuFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchAdmin("/api/admin/subscriptions?limit=300")) as SubscriptionsResponse;
      setSubscriptions(data.subscriptions || []);
      setRenewals(data.renewals || []);
      setStats(
        data.stats || {
          total: 0,
          active: 0,
          trialing: 0,
          pastDue: 0,
          canceled: 0,
          pendingCancel: 0,
          recurringRevenueCents: 0,
          renewalCount30d: 0,
          renewalRevenue30dCents: 0,
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di caricamento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firebaseUser) return;
    loadData();
  }, [firebaseUser]);

  const filteredSubscriptions = useMemo(() => {
    let list = subscriptions;
    const query = search.trim().toLowerCase();

    if (query) {
      list = list.filter(
        (item) =>
          item.email.toLowerCase().includes(query) ||
          item.uid.toLowerCase().includes(query) ||
          item.stripeSubscriptionId.toLowerCase().includes(query) ||
          item.stripeCustomerId.toLowerCase().includes(query) ||
          item.introOrderId.toLowerCase().includes(query)
      );
    }

    if (statusFilter === "live") {
      list = list.filter((item) => ["trialing", "active", "past_due"].includes(item.status));
    } else if (statusFilter === "pending_cancel") {
      list = list.filter(
        (item) => item.cancelAtPeriodEnd && ["trialing", "active", "past_due"].includes(item.status)
      );
    } else if (statusFilter !== "all") {
      list = list.filter((item) => item.status === statusFilter);
    }

    if (skuFilter !== "all") {
      list = list.filter((item) => item.sku === skuFilter);
    }

    return list;
  }, [subscriptions, search, statusFilter, skuFilter]);

  const cancelSubscription = async (item: AdminSubscription) => {
    if (item.cancelAtPeriodEnd) return;
    if (
      !window.confirm(
        `Programmare la disdetta per ${item.email}?\nL'abbonamento resterà attivo fino al prossimo addebito.`
      )
    ) {
      return;
    }

    setActionLoading(item.stripeSubscriptionId);
    try {
      await adminRequest("/api/admin/subscriptions/cancel", {
        method: "POST",
        body: JSON.stringify({ stripeSubscriptionId: item.stripeSubscriptionId }),
      });
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.stripeSubscriptionId === item.stripeSubscriptionId
            ? { ...sub, cancelAtPeriodEnd: true }
            : sub
        )
      );
      setStats((prev) => ({
        ...prev,
        pendingCancel: prev.pendingCancel + 1,
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Abbonamenti</h1>
          <p className="mt-2 text-slate-400">
            Monitora trial, rinnovi ogni 4 settimane, disdette e ricavi ricorrenti.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
        >
          Aggiorna
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Abbonamenti attivi"
          value={String(stats.active)}
          hint={`${stats.trialing} in periodo iniziale`}
        />
        <KpiCard
          label="Ricavo ricorrente"
          value={formatPrice(stats.recurringRevenueCents / 100)}
          hint="Somma cicli attivi ogni 4 settimane"
        />
        <KpiCard
          label="Disdette in corso"
          value={String(stats.pendingCancel)}
          hint={`${stats.pastDue} pagamenti in sospeso`}
        />
        <KpiCard
          label="Rinnovi (30 gg)"
          value={String(stats.renewalCount30d)}
          hint={formatPrice(stats.renewalRevenue30dCents / 100)}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cerca email, UID, ordine intro, ID Stripe..."
          className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-blue-500 lg:max-w-md"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="all">Tutti gli stati</option>
          <option value="live">In corso (trial + attivo + sospeso)</option>
          <option value="trialing">Periodo iniziale</option>
          <option value="active">Attivo</option>
          <option value="past_due">Pagamento in sospeso</option>
          <option value="pending_cancel">Disdetta programmata</option>
          <option value="canceled">Annullato</option>
        </select>
        <select
          value={skuFilter}
          onChange={(event) => setSkuFilter(event.target.value)}
          className="rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="all">Tutti i pacchetti</option>
          <option value="pack1">Pack 1</option>
          <option value="pack5">Pack 5</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
        <div className="border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-semibold text-white">
            Abbonamenti ({filteredSubscriptions.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Piano</th>
                <th className="px-4 py-3 font-medium">Stato</th>
                <th className="px-4 py-3 font-medium">Prossimo addebito</th>
                <th className="px-4 py-3 font-medium">Ricorrente</th>
                <th className="px-4 py-3 font-medium">Carta</th>
                <th className="px-4 py-3 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Caricamento...
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Nessun abbonamento trovato.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="text-white">{item.email}</div>
                      <div className="text-xs text-slate-500">
                        Intro {formatDate(item.introPaidAt)} ·{" "}
                        <span className="font-mono">{item.introOrderId.slice(0, 12)}…</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>{planLabel(item.sku)}</div>
                      <div className="text-xs text-slate-500">
                        {item.recurringCredits} credito{item.recurringCredits > 1 ? "i" : ""}/ciclo
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${subscriptionStatusClass(
                          item.status,
                          item.cancelAtPeriodEnd
                        )}`}
                      >
                        {item.cancelAtPeriodEnd &&
                        ["trialing", "active", "past_due"].includes(item.status)
                          ? "Disdetta programmata"
                          : describeSubscriptionStatus(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatDateTime(item.nextBillingAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatPrice(item.recurringAmount / 100)}
                      <span className="block text-xs font-normal text-slate-500">
                        ogni 4 settimane
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.paymentMethodBrand && item.paymentMethodLast4
                        ? `${item.paymentMethodBrand} ·••• ${item.paymentMethodLast4}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/users?search=${encodeURIComponent(item.email)}`}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                        >
                          Utente
                        </Link>
                        <Link
                          href={`/admin/orders?email=${encodeURIComponent(item.email)}`}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                        >
                          Ordini
                        </Link>
                        <a
                          href={stripeDashboardUrl(`subscriptions/${item.stripeSubscriptionId}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600/30"
                        >
                          Stripe
                        </a>
                        {["trialing", "active", "past_due"].includes(item.status) &&
                        !item.cancelAtPeriodEnd ? (
                          <button
                            type="button"
                            disabled={actionLoading === item.stripeSubscriptionId}
                            onClick={() => cancelSubscription(item)}
                            className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                          >
                            Disdici
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
        <div className="border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-semibold text-white">Rinnovi recenti</h2>
          <p className="mt-1 text-xs text-slate-500">
            Crediti aggiunti automaticamente dopo ogni fattura Stripe.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Piano</th>
                <th className="px-4 py-3 font-medium">Importo</th>
                <th className="px-4 py-3 font-medium">Crediti</th>
                <th className="px-4 py-3 font-medium">Fattura</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Caricamento...
                  </td>
                </tr>
              ) : renewals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Nessun rinnovo registrato.
                  </td>
                </tr>
              ) : (
                renewals.map((event) => (
                  <tr key={event.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-slate-300">
                      {formatDateTime(event.processedAt)}
                    </td>
                    <td className="px-4 py-3 text-white">{event.email}</td>
                    <td className="px-4 py-3 text-slate-300">{planLabel(event.sku)}</td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatPrice(event.amountPaid / 100)}
                    </td>
                    <td className="px-4 py-3 text-emerald-300">+{event.creditsAdded}</td>
                    <td className="px-4 py-3">
                      <a
                        href={stripeDashboardUrl(`invoices/${event.invoiceId}`)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-blue-300 hover:underline"
                      >
                        {event.invoiceId.slice(0, 14)}…
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
          Caricamento abbonamenti...
        </div>
      }
    >
      <AdminSubscriptionsContent />
    </Suspense>
  );
}
