"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import PremiumReportView from "@/components/reports/PremiumReportView";
import { convertToSections } from "@/lib/convert-report-sections";
import type { AIVerification, ReportSection, VehicleReportInfo } from "@/types/report.types";

interface ReportPayload {
  orderId: string;
  vehicleInfo: VehicleReportInfo;
  searchType: string;
  searchValue: string;
  createdAt: number;
  pdfUrl?: string;
  reportData?: { sections?: ReportSection[]; ai?: AIVerification };
  sections?: ReportSection[];
}

function ReportHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[60px] px-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <Link
        href="/account"
        className="p-2 rounded-full hover:bg-slate-100 inline-flex items-center justify-center"
      >
        <ArrowLeft className="h-5 w-5 text-slate-700" />
      </Link>
      <h1 className="text-lg font-bold text-slate-900">Report Veicolo</h1>
      <div className="w-10" />
    </header>
  );
}

export default function InformePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(`/api/report/interactive/${orderId}`);
        if (!response.ok) throw new Error("Report non disponibile");
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore di caricamento");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ReportHeader />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Report non disponibile</h2>
            <p className="text-slate-600 mb-6">
              {error || "Questo report non esiste o non è ancora stato generato."}
            </p>
            <button
              type="button"
              onClick={() => router.push("/account")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Torna al mio account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sections = convertToSections(reportData);

  return (
    <PremiumReportView
      sections={sections}
      vehicleInfo={reportData.vehicleInfo}
      ai={reportData.reportData?.ai}
      reportId={orderId}
      pdfUrl={reportData.pdfUrl}
    />
  );
}
