"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import KpiCard from "@/components/admin/KpiCard";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import { formatPrice } from "@/lib/pricing";

interface ClientRow {
  email: string;
  totalOrders: number;
  totalSpent: number;
  successfulOrders: number;
  firstOrderDate: number;
  lastOrderDate: number;
  status: "active" | "inactive";
}

interface ClientsResponse {
  clients: ClientRow[];
  stats: {
    totalClients: number;
    activeClients: number;
    returningClients: number;
    avgLifetimeValue: number;
  };
}

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("it-IT");
}

export default function AdminClientsPage() {
  const { fetchAdmin, firebaseUser } = useAdminFetch();
  const [data, setData] = useState<ClientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = (await fetchAdmin("/api/admin/clients")) as ClientsResponse;
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore di caricamento");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [firebaseUser, fetchAdmin]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Clienti</h1>
        <p className="mt-2 text-slate-400">
          Clienti aggregati dagli ordini pagati su CheckTarga.it.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Clienti totali"
          value={loading || !data ? "..." : String(data.stats.totalClients)}
        />
        <KpiCard
          label="Attivi (90g)"
          value={loading || !data ? "..." : String(data.stats.activeClients)}
        />
        <KpiCard
          label="Ritornanti"
          value={loading || !data ? "..." : String(data.stats.returningClients)}
        />
        <KpiCard
          label="LTV medio"
          value={
            loading || !data ? "..." : formatPrice(data.stats.avgLifetimeValue)
          }
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Ordini</th>
                <th className="px-4 py-3 font-medium">Speso</th>
                <th className="px-4 py-3 font-medium">Primo ordine</th>
                <th className="px-4 py-3 font-medium">Ultimo ordine</th>
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
              ) : !data || data.clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Nessun cliente trovato.
                  </td>
                </tr>
              ) : (
                data.clients.map((client) => (
                  <tr key={client.email} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-white">{client.email}</td>
                    <td className="px-4 py-3 text-slate-300">{client.totalOrders}</td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatPrice(client.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatDate(client.firstOrderDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatDate(client.lastOrderDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          client.status === "active"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-slate-500/10 text-slate-300"
                        }`}
                      >
                        {client.status === "active" ? "Attivo" : "Inattivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/users?search=${encodeURIComponent(client.email)}`}
                          className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600/30"
                        >
                          Utente
                        </Link>
                        <Link
                          href={`/admin/orders?email=${encodeURIComponent(client.email)}`}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                        >
                          Ordini
                        </Link>
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
