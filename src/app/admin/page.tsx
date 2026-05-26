"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import KpiCard from "@/components/admin/KpiCard";
import RealtimeVisitors from "@/components/admin/RealtimeVisitors";
import { useAdminFetch, AdminApiError } from "@/hooks/useAdminFetch";
import { useLivePresence } from "@/hooks/useLivePresence";
import { ADMIN_DATA_CHANGED, readAdminDataVersion } from "@/lib/admin-sync";
import { formatPrice } from "@/lib/pricing";

type Period = "today" | "last_7_days" | "last_30_days";

interface StatsResponse {
  revenue: number;
  paid: number;
  total: number;
  failed: number;
  visits: number;
  online: number;
  totalSearches: number;
  totalHits: number;
  hitRate: number;
  visitsBySource: Record<string, number>;
  seriesSales: Array<{ t: number; amount: number; count: number }>;
}

interface OrdersResponse {
  orders: Array<{
    id: string;
    customerEmail?: string;
    productName?: string;
    sku?: string;
    amount?: number;
    status?: string;
    createdAt?: number;
    searchValue?: string;
  }>;
}

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("it-IT");
}

export default function AdminDashboardPage() {
  const pathname = usePathname();
  const { fetchAdmin, firebaseUser } = useAdminFetch();
  const [period, setPeriod] = useState<Period>("today");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrdersResponse["orders"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indexUrl, setIndexUrl] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const {
    presence,
    totalOnline,
    loading: liveLoading,
    updatedAt: liveUpdatedAt,
  } = useLivePresence(10_000);

  const loadDashboard = useCallback(async () => {
    if (!firebaseUser) return;

    setLoading(true);
    setError(null);
    setIndexUrl(null);
    try {
      const bust = Date.now();
      const statsData = (await fetchAdmin(
        `/api/admin/stats?period=${period}&_=${bust}`
      )) as StatsResponse;
      const ordersData = (await fetchAdmin(
        `/api/admin/orders?limit=8&_=${bust}`
      )) as OrdersResponse;
      setStats(statsData);
      setRecentOrders(ordersData.orders || []);
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
        setIndexUrl(err.indexUrl || null);
      } else {
        setError(err instanceof Error ? err.message : "Errore di caricamento");
      }
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, period, fetchAdmin]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, refreshToken]);

  useEffect(() => {
    if (pathname === "/admin") {
      setRefreshToken(Date.now());
    }
  }, [pathname]);

  useEffect(() => {
    const refresh = () => setRefreshToken(Date.now());

    window.addEventListener(ADMIN_DATA_CHANGED, refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);

    return () => {
      window.removeEventListener(ADMIN_DATA_CHANGED, refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, []);

  useEffect(() => {
    setRefreshToken(Number(readAdminDataVersion()) || Date.now());
  }, []);

  const topSources = useMemo(() => {
    if (!stats?.visitsBySource) return [];
    return Object.entries(stats.visitsBySource)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [stats]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Monitora visitatori, ricerche veicolo e vendite CheckTarga.it
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRefreshToken(Date.now())}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            Aggiorna
          </button>
          <div className="flex rounded-xl border border-white/10 bg-[#111111] p-1">
            {([
              ["today", "Oggi"],
              ["last_7_days", "7 giorni"],
              ["last_30_days", "30 giorni"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPeriod(value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  period === value ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          <p>{error}</p>
          {indexUrl ? (
            <a
              href={indexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-red-200 underline hover:text-white"
            >
              Crea l&apos;indice Firestore
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Fatturato"
          value={loading || !stats ? "..." : formatPrice(stats.revenue)}
          hint={`${stats?.paid ?? 0} ordini pagati`}
        />
        <KpiCard
          label="Online adesso"
          value={liveLoading ? "..." : String(totalOnline)}
          hint={
            liveUpdatedAt
              ? `Live ${new Date(liveUpdatedAt).toLocaleTimeString("it-IT")}`
              : "Aggiornamento ogni 10s"
          }
        />
        <KpiCard
          label="Visite uniche"
          value={loading || !stats ? "..." : String(stats.visits)}
          hint="Nel periodo selezionato"
        />
        <KpiCard
          label="Ricerche veicolo"
          value={loading || !stats ? "..." : String(stats.totalSearches)}
          hint={`${stats?.hitRate?.toFixed?.(0) ?? 0}% con risultato`}
        />
        <KpiCard
          label="Ordini totali"
          value={loading || !stats ? "..." : String(stats.total)}
          hint={`${stats?.failed ?? 0} falliti`}
        />
      </div>

      <RealtimeVisitors
        pages={presence.pages}
        totalOnline={totalOnline}
        loading={liveLoading}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-lg font-semibold text-white">Fonti di traffico</h2>
          <div className="mt-4 space-y-3">
            {topSources.length === 0 ? (
              <p className="text-sm text-slate-500">Nessun dato disponibile.</p>
            ) : (
              topSources.map(([source, count]) => (
                <div key={source} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-300">{source}</span>
                  <span className="text-sm font-semibold tabular-nums text-white">{count}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-lg font-semibold text-white">Ultimi ordini</h2>
          <div className="mt-4 space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-500">Nessun ordine recente.</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {order.customerEmail || "Cliente sconosciuto"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {order.productName || order.sku || order.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatPrice((order.amount || 0) / 100)}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
