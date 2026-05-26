"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface ReportRow {
  id: string;
  orderId?: string;
  customerEmail?: string;
  searchType?: string;
  searchValue?: string;
  status?: string;
  pdfUrl?: string;
  createdAt?: number;
  vehicleInfo?: { brand?: string; model?: string };
}

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("it-IT");
}

export default function AdminReportsPage() {
  const { fetchAdmin, firebaseUser } = useAdminFetch();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = (await fetchAdmin("/api/admin/reports?limit=300")) as {
          reports: ReportRow[];
        };
        setReports(data.reports || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore di caricamento");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [firebaseUser, fetchAdmin]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reports;
    return reports.filter(
      (report) =>
        report.customerEmail?.toLowerCase().includes(query) ||
        report.searchValue?.toLowerCase().includes(query) ||
        report.orderId?.toLowerCase().includes(query)
    );
  }, [reports, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Report generati</h1>
        <p className="mt-2 text-slate-400">
          Report creati tramite crediti account su CheckTarga.it.
        </p>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cerca email, targa, orderId..."
        className="w-full max-w-md rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-blue-500"
      />

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
                <th className="px-4 py-3 font-medium">Veicolo</th>
                <th className="px-4 py-3 font-medium">Ricerca</th>
                <th className="px-4 py-3 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Caricamento...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Nessun report trovato.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-slate-300">{formatDate(report.createdAt)}</td>
                    <td className="px-4 py-3 text-white">{report.customerEmail || "—"}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {[report.vehicleInfo?.brand, report.vehicleInfo?.model]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {report.searchValue
                        ? `${report.searchType || "plate"} · ${report.searchValue}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {report.orderId ? (
                          <Link
                            href={`/informe/${report.orderId}`}
                            target="_blank"
                            className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600/30"
                          >
                            Apri
                          </Link>
                        ) : null}
                        {report.pdfUrl ? (
                          <a
                            href={report.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                          >
                            PDF
                          </a>
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
    </div>
  );
}
