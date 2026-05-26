"use client";

import { Activity, Radio } from "lucide-react";
import type { RecentVisitEvent } from "@/lib/admin-presence";
import { formatTimeAgo, getPageLabel } from "@/lib/admin-presence";

interface LiveVisitsFeedProps {
  visits: RecentVisitEvent[];
  loading?: boolean;
}

export default function LiveVisitsFeed({ visits, loading = false }: LiveVisitsFeedProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
        <div className="flex h-32 flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-xs font-medium text-slate-500">Caricamento visite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-white/10">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Visite in tempo reale</h3>
          <p className="text-xs text-slate-400">Ultimi accessi registrati oggi</p>
        </div>
      </div>

      <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {visits.length === 0 ? (
          <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/5 text-slate-500">
            <Radio className="h-6 w-6 opacity-20" />
            <p className="text-xs">Nessuna visita registrata oggi</p>
          </div>
        ) : (
          visits.map((visit) => (
            <div
              key={visit.id}
              className="rounded-xl border border-white/5 bg-white/5 px-3 py-3 transition-colors hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {getPageLabel(visit.path)}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">{visit.path}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-slate-400">
                  {formatTimeAgo(visit.ts)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                {visit.trafficSource ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-slate-300">
                    {visit.trafficSource}
                  </span>
                ) : null}
                {visit.country ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-slate-300">
                    {visit.country}
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
