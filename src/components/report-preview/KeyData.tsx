"use client";

import { ReportPreviewQuery, maskVin } from "@/lib/report-preview";

interface Props {
  query: ReportPreviewQuery;
  onUnlock: () => void;
}

const ROWS = [
  "Numero VIN",
  "Codice motore",
  "Codice cambio",
  "Ultimo chilometraggio rilevato",
  "Revisione",
  "Sinistri segnalati",
  "Intestatario attuale",
  "N° libretto / visura PRA",
];

export function ReportPreviewKeyData({ query, onUnlock }: Props) {
  const maskedVin = query.type === "vin" ? maskVin(query.cleanValue) : "— da sbloccare";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Contenuto del report
            </p>
            <h2 className="text-[28px] font-light leading-[1.05] tracking-[-0.02em] text-slate-950 md:text-[40px]">
              Dati disponibili dopo l&apos;acquisto
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-slate-500 md:text-[15px]">
              Nessun dato veicolo viene mostrato in anteprima. Sblocca il report per accedere a
              chilometri, sinistri, intestatario e storico amministrativo verificati.
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="border-t border-slate-200/80">
              {ROWS.map((label) => (
                <div
                  key={label}
                  className="group flex items-center justify-between gap-6 border-b border-slate-200/80 py-4 md:py-5"
                >
                  <span className="flex-shrink-0 text-[12px] font-medium uppercase tracking-[0.16em] text-slate-400 md:text-[13px]">
                    {label}
                  </span>
                  <button
                    type="button"
                    onClick={onUnlock}
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-slate-400 transition-colors hover:text-slate-900 md:text-[15px]"
                  >
                    <span className="font-mono tracking-wider">
                      {label === "Numero VIN" && query.type === "vin" ? maskedVin : "— da sbloccare"}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 transition-colors group-hover:text-slate-500">
                      Bloccato
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
