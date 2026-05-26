"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import type { LivePresenceSnapshot, RecentVisitEvent } from "@/lib/admin-presence";

interface LivePresenceResponse extends LivePresenceSnapshot {
  success: boolean;
  updatedAt: number;
}

interface RecentVisitsResponse {
  success: boolean;
  visits: RecentVisitEvent[];
  updatedAt: number;
}

const EMPTY_PRESENCE: LivePresenceSnapshot = {
  totalOnline: 0,
  pages: [],
  sessions: [],
};

export function useLivePresence(pollIntervalMs = 10_000) {
  const { adminRequest, firebaseUser } = useAdminFetch();
  const [presence, setPresence] = useState<LivePresenceSnapshot>(EMPTY_PRESENCE);
  const [recentVisits, setRecentVisits] = useState<RecentVisitEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    if (!firebaseUser) return;

    try {
      const [presenceData, visitsData] = await Promise.all([
        adminRequest("/api/admin/presence") as Promise<LivePresenceResponse>,
        adminRequest("/api/admin/visits/recent?limit=25") as Promise<RecentVisitsResponse>,
      ]);

      setPresence({
        totalOnline: presenceData.totalOnline,
        pages: presenceData.pages || [],
        sessions: presenceData.sessions || [],
      });
      setRecentVisits(visitsData.visits || []);
      setUpdatedAt(Math.max(presenceData.updatedAt || 0, visitsData.updatedAt || 0));
    } catch {
      // Keep last known values during transient errors.
    } finally {
      setLoading(false);
    }
  }, [adminRequest, firebaseUser]);

  useEffect(() => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }

    refresh();
    const intervalId = window.setInterval(refresh, pollIntervalMs);
    return () => window.clearInterval(intervalId);
  }, [firebaseUser, refresh, pollIntervalMs]);

  return {
    presence,
    recentVisits,
    totalOnline: presence.totalOnline,
    loading,
    updatedAt,
    refresh,
  };
}
