"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import { notifyAdminDataChanged } from "@/lib/admin-sync";
import { formatPrice } from "@/lib/pricing";

interface OrderRow {
  id: string;
  customerEmail?: string;
  productName?: string;
  sku?: string;
  amount?: number;
  status?: string;
  createdAt?: number;
  searchValue?: string;
  searchType?: string;
  paymentIntentId?: string;
  customerUid?: string;
}

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("it-IT");
}

function statusClass(status?: string) {
  const value = String(status || "").toLowerCase();
  if (["complete", "paid", "succeeded", "completed"].includes(value)) {
    return "bg-emerald-500/10 text-emerald-300";
  }
  if (["pending"].includes(value)) {
    return "bg-amber-500/10 text-amber-300";
  }
  return "bg-red-500/10 text-red-300";
}

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const { fetchAdmin, adminRequest, firebaseUser } = useAdminFetch();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialEmail);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchAdmin("/api/admin/orders?limit=300")) as {
        orders: OrderRow[];
      };
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di caricamento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firebaseUser) return;
    loadOrders();
  }, [firebaseUser]);

  const filteredOrders = useMemo(() => {
    let list = orders;
    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (order) =>
          order.customerEmail?.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query) ||
          order.searchValue?.toLowerCase().includes(query) ||
          order.paymentIntentId?.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter(
        (order) => String(order.status || "").toLowerCase() === statusFilter
      );
    }
    return list;
  }, [orders, search, statusFilter]);

  const deleteOrder = async (order: OrderRow) => {
    if (!window.confirm(`Eliminare l'ordine ${order.id}?`)) return;
    setActionLoading(order.id);
    try {
      await adminRequest(`/api/admin/orders/${order.id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((item) => item.id !== order.id));
      notifyAdminDataChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore");
    } finally {
      setActionLoading(null);
    }
  };

  const updateStatus = async (order: OrderRow, status: string) => {
    setActionLoading(`${order.id}-${status}`);
    try {
      await adminRequest(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((item) => (item.id === order.id ? { ...item, status } : item))
      );
      notifyAdminDataChanged();
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
          <h1 className="text-3xl font-bold text-white">Ordini</h1>
          <p className="mt-2 text-slate-400">
            Storico vendite, stati manuali e cancellazioni.
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
        >
          Aggiorna
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cerca email, ID ordine, targa..."
          className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-blue-500 md:max-w-md"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="all">Tutti gli stati</option>
          <option value="complete">Complete</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Prodotto</th>
                <th className="px-4 py-3 font-medium">Veicolo</th>
                <th className="px-4 py-3 font-medium">Importo</th>
                <th className="px-4 py-3 font-medium">Stato</th>
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
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Nessun ordine trovato.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-slate-300">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="text-white">{order.customerEmail || "—"}</div>
                      <div className="text-xs text-slate-500">{order.id}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {order.productName || order.sku || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {order.searchValue
                        ? `${order.searchType || "plate"} · ${order.searchValue}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatPrice((order.amount || 0) / 100)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                      >
                        {order.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <select
                          value={String(order.status || "PENDING").toUpperCase()}
                          onChange={(event) => updateStatus(order, event.target.value)}
                          disabled={Boolean(actionLoading?.startsWith(order.id))}
                          className="rounded-lg border border-white/10 bg-[#0A0A0A] px-2 py-1 text-xs text-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETE">COMPLETE</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                        <button
                          type="button"
                          disabled={actionLoading === order.id}
                          onClick={() => deleteOrder(order)}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                        >
                          Elimina
                        </button>
                      </div>
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

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
          Caricamento ordini...
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
