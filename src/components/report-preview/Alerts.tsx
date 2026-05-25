"use client";

import { ReportPreviewQuery } from "@/lib/report-preview";

const CHECKS = [
  {
    no: "01",
    title: "Sinistri e riparazioni",
    desc: "Verifica eventuali incidenti segnalati, zone d'impatto e riparazioni documentate.",
  },
  {
    no: "02",
    title: "Chilometri e revisioni",
    desc: "Controllo coerenza chilometrica e storico delle revisioni periodiche.",
  },
  {
    no: "03",
    title: "Proprietà e vincoli PRA",
    desc: "Passaggi di proprietà, fermo amministrativo, pegno e opposizioni al trasferimento.",
  },
];

interface Props {
  query: ReportPreviewQuery;
  onUnlock: () => void;
}

export function ReportPreviewAlerts({ query, onUnlock }: Props) {
  const refLabel = query.displayValue;

  return (
    <section className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Cosa verifichiamo
            </p>
            <h2 className="mb-5 text-[28px] font-light leading-[1.05] tracking-[-0.02em] text-slate-950 md:text-[40px]">
              Controlli inclusi per {refLabel}.
            </h2>
            <p className="mb-7 max-w-md text-[14px] leading-relaxed text-slate-500 md:text-[15px]">
              L&apos;anteprima non mostra risultati reali. Dopo l&apos;acquisto, il report analizza
              il veicolo su questi punti e molti altri.
            </p>
            <button
              type="button"
              onClick={onUnlock}
              className="text-[13px] font-medium text-slate-900 underline decoration-slate-300 decoration-1 underline-offset-[6px] transition-all hover:decoration-slate-900"
            >
              Sblocca il report →
            </button>
          </div>

          <div className="md:col-span-8">
            <div className="border-t border-slate-200/80">
              {CHECKS.map((check) => (
                <button
                  key={check.title}
                  type="button"
                  onClick={onUnlock}
                  className="group flex w-full items-start gap-5 border-b border-slate-200/80 py-6 text-left md:gap-8 md:py-7"
                >
                  <span className="flex-shrink-0 pt-1 font-mono text-[11px] tabular-nums text-slate-300">
                    {check.no}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1.5 text-[16px] font-medium tracking-tight text-slate-900 transition-colors group-hover:text-slate-600 md:text-[18px]">
                      {check.title}
                    </h3>
                    <p className="pr-4 text-[13px] leading-relaxed text-slate-500 md:text-[14px]">
                      {check.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
