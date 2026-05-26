"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UserReport {
  id: string;
  orderId: string;
  searchType: string;
  searchValue: string;
  pdfUrl: string;
  formattedDate: string;
  vehicleBrand?: string;
  vehicleModel?: string;
}

interface ReportsListProps {
  refreshKey?: number;
}

export default function ReportsList({ refreshKey = 0 }: ReportsListProps) {
  const { user } = useAuth();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!user) {
      setReports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/user-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Errore caricamento report");
      }

      setReports(data.reports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, refreshKey]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Caricamento report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700 mb-1">Nessun report generato</p>
        <p className="text-sm text-slate-500">
          I tuoi report completi appariranno qui dopo la generazione.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => {
        const label =
          report.vehicleBrand && report.vehicleModel
            ? `${report.vehicleBrand} ${report.vehicleModel}`
            : report.searchType === "vin"
              ? `VIN ${report.searchValue}`
              : `Targa ${report.searchValue}`;

        return (
          <div
            key={report.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{label}</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {report.searchType === "vin" ? "VIN" : "Targa"}:{" "}
                <span className="font-mono">{report.searchValue}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">{report.formattedDate}</p>
            </div>
            <a
              href={report.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shrink-0"
            >
              <Download className="h-4 w-4" />
              Scarica PDF
            </a>
          </div>
        );
      })}
    </div>
  );
}
