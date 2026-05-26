"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface UserReport {
  id: string;
  orderId: string;
  createdAt: number;
  searchType: string;
  searchValue: string;
  vehicleInfo: Record<string, string>;
  pdfUrl: string;
  pdfStoragePath?: string;
  status: string;
  formattedDate: string;
  vehicleBrand?: string;
  vehicleModel?: string;
}

interface UserReportsResponse {
  success: boolean;
  reports: UserReport[];
  total: number;
}

export function useUserReports() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  const fetchReports = useCallback(
    async (forceRefresh = false) => {
      if (!user || authLoading) {
        setLoading(false);
        return;
      }

      const now = Date.now();
      if (!forceRefresh && now - lastFetch < 300000) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = await user.getIdToken();
        const response = await fetch("/api/user-reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Impossibile caricare i report");

        const data: UserReportsResponse = await response.json();
        setReports(data.reports || []);
        setLastFetch(now);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
        setReports([]);
      } finally {
        setLoading(false);
      }
    },
    [user, authLoading, lastFetch]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const downloadReport = useCallback(async (report: UserReport) => {
    try {
      const vehicleName =
        report.vehicleBrand && report.vehicleModel
          ? `${report.vehicleBrand}_${report.vehicleModel}`
          : report.searchValue;
      const fileName = `report_${vehicleName}_${report.formattedDate.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

      const response = await fetch(report.pdfUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch {
      window.open(report.pdfUrl, "_blank");
      return true;
    }
  }, []);

  const getReportDisplayName = useCallback((report: UserReport) => {
    if (report.vehicleInfo?.marque && report.vehicleInfo?.modele) {
      return `${report.vehicleInfo.marque} ${report.vehicleInfo.modele}`;
    }
    if (report.vehicleBrand && report.vehicleModel) {
      return `${report.vehicleBrand} ${report.vehicleModel}`;
    }
    return report.searchValue;
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    downloadReport,
    getReportDisplayName,
    total: reports.length,
  };
}
