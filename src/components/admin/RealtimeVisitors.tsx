"use client";

import { Clock, Globe, Monitor, Users } from "lucide-react";
import type { LivePageVisitors } from "@/lib/admin-presence";
import { countryFlag, getPageLabel } from "@/lib/admin-presence";

interface RealtimeVisitorsProps {
  pages: LivePageVisitors[];
  totalOnline: number;
  loading?: boolean;
}

export default function RealtimeVisitors({
  pages,
  totalOnline,
  loading = false,
}: RealtimeVisitorsProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
        <div className="flex h-32 flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-xs font-medium text-slate-500">Sincronizzazione live...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-white/10">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">Pagine attive</h3>
            <p className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              {totalOnline} connesso{totalOnline === 1 ? "" : "i"} adesso
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {pages.length === 0 ? (
          <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/5 text-slate-500">
            <Users className="h-6 w-6 opacity-20" />
            <p className="text-xs">Nessuna attività in tempo reale</p>
          </div>
        ) : (
          pages.map((pageVisitor) => (
            <div
              key={pageVisitor.path}
              className="group flex flex-col gap-2 rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/40 text-[10px] font-bold text-slate-400 ring-1 ring-white/10">
                    {getPageLabel(pageVisitor.path).substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-200 group-hover:text-white">
                      {getPageLabel(pageVisitor.path)}
                    </p>
                    <p className="truncate text-[10px] text-slate-500">{pageVisitor.path}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 text-xs font-bold text-white ring-1 ring-white/20">
                  <Monitor className="h-3 w-3 text-blue-400" />
                  {pageVisitor.count}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pl-11">
                {pageVisitor.visitors.map((visitor) => (
                  <span
                    key={visitor.sessionId}
                    title={`Visitatore ${visitor.country || "?"}`}
                    className="cursor-help text-sm transition-transform hover:scale-125"
                  >
                    {countryFlag(visitor.country)}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600">
        <Clock className="h-2.5 w-2.5" />
        Live stream
      </div>
    </div>
  );
}
