"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

const TICKER_ITEMS = [
  "ATTENZIONE: aumento frodi su auto usate importate",
  "Nuovo: verifica equipaggiamenti di serie inclusa",
  "Controllo fermo amministrativo aggiornato oggi",
  "Campagna revisioni: controlla i km prima di pagare",
];

export default function NewsTicker() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString("it-IT", { day: "numeric", month: "short" }).toUpperCase()
    );
  }, []);

  return (
    <div className="relative z-50 overflow-hidden border-b border-white/5 bg-slate-900 py-2.5 text-white sm:py-3">
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-slate-900 to-transparent sm:w-24" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-slate-900 to-transparent sm:w-24" />

      <div className="animate-marquee flex w-max items-center whitespace-nowrap">
        {[...Array(4)].map((_, block) =>
          TICKER_ITEMS.map((item) => (
            <div key={`${block}-${item}`} className="mx-6 flex items-center gap-3 sm:mx-10 sm:gap-5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                </span>
                Flash
              </span>
              <span className="font-mono text-[11px] font-bold tracking-wider text-slate-500">
                {dateStr || "OGGI"}
              </span>
              <span className="h-0.5 w-0.5 rounded-full bg-slate-700" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-gray-100 sm:text-sm">
                {item}
              </span>
              <AlertTriangle className="hidden h-3.5 w-3.5 text-amber-400 sm:block" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
