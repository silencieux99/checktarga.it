"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Car,
  Check,
  Download,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useUserReports } from "@/hooks/useUserReports";
import { ACCOUNT_UI } from "@/lib/account-ui-text";

export default function ReportsList() {
  const {
    reports,
    loading,
    error,
    indexUrl,
    fetchReports,
    downloadReport,
    getReportDisplayName,
    total,
  } = useUserReports();

  const [downloadStatus, setDownloadStatus] = useState<
    Record<string, "downloading" | "success" | "error">
  >({});

  const handleDownload = async (report: (typeof reports)[0]) => {
    setDownloadStatus((prev) => ({ ...prev, [report.id]: "downloading" }));
    try {
      const success = await downloadReport(report);
      setDownloadStatus((prev) => ({
        ...prev,
        [report.id]: success ? "success" : "error",
      }));
    } catch {
      setDownloadStatus((prev) => ({ ...prev, [report.id]: "error" }));
    }
    setTimeout(() => {
      setDownloadStatus((prev) => {
        const next = { ...prev };
        delete next[report.id];
        return next;
      });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="w-8 h-8 text-brand-accent animate-spin mx-auto mb-4" />
        <p className="text-brand-muted">{ACCOUNT_UI.accountLoadingReports}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-600 mb-4">{error}</p>
        {indexUrl ? (
          <a
            href={indexUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-block text-sm font-semibold text-brand-accent hover:text-brand-accent-hover underline"
          >
            Crea l&apos;indice Firestore
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => fetchReports(true)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          {ACCOUNT_UI.accountRetry}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <span className="text-sm text-slate-500">
          {total} report{total === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={() => fetchReports(true)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 self-end sm:self-auto"
          title={ACCOUNT_UI.accountRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          {ACCOUNT_UI.accountRefresh}
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-700 font-medium mb-1">{ACCOUNT_UI.accountNoReports}</p>
          <p className="text-sm text-slate-500">{ACCOUNT_UI.accountGenerateFirst}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const status = downloadStatus[report.id];
            return (
              <div
                key={report.id}
                className="flex flex-col gap-3 rounded-xl border border-brand-border p-4 transition-colors hover:border-slate-300 hover:bg-brand-surface sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                    {report.searchType === "vin" ? (
                      <Car className="h-4 w-4" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-slate-900 truncate">
                      {getReportDisplayName(report)}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-slate-500">
                      <span>{report.formattedDate}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{report.searchType === "vin" ? "VIN" : "Targa"}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="font-mono truncate">{report.searchValue}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/informe/${report.orderId || report.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">{ACCOUNT_UI.actionView}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDownload(report)}
                    disabled={status === "downloading"}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      status === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : status === "error"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {status === "downloading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">{ACCOUNT_UI.accountDownloading}</span>
                      </>
                    ) : status === "success" ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">{ACCOUNT_UI.accountDownloaded}</span>
                      </>
                    ) : status === "error" ? (
                      <>
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">{ACCOUNT_UI.accountErrorDownload}</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reports.length > 0 && (
        <p className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 text-center">
          {ACCOUNT_UI.tooltipReportHint}
        </p>
      )}
    </div>
  );
}
