"use client";

import { ReportPreviewQuery, formatItalianPlateDisplay } from "@/lib/report-preview";

interface Props {
  query: ReportPreviewQuery;
  startingFromPrice: string;
  onScrollToPricing: () => void;
}

function ItalianPlate({ value }: { value: string }) {
  const display = formatItalianPlateDisplay(value);
  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-[6px] bg-white ring-1 ring-slate-900/90">
      <div className="flex min-w-[26px] flex-col items-center justify-center bg-[#009246] px-1.5 py-1.5 md:min-w-[30px]">
        <span className="text-[7px] font-semibold leading-none tracking-wider text-white/95 md:text-[9px]">
          EU
        </span>
        <span className="mt-1 text-[10px] font-bold leading-none text-white md:text-[12px]">I</span>
      </div>
      <div className="flex min-w-[160px] items-center justify-center px-4 py-2 md:min-w-[200px] md:py-2.5">
        <span className="whitespace-nowrap text-[18px] font-bold tracking-[0.18em] text-slate-900 md:text-[24px] md:tracking-[0.22em]">
          {display}
        </span>
      </div>
      <div className="flex min-w-[26px] flex-col items-center justify-center bg-[#CE2B37] px-1.5 py-1.5 md:min-w-[30px]">
        <span className="text-[8px] font-bold leading-none text-white/95 md:text-[10px]">IT</span>
      </div>
    </div>
  );
}

export function ReportPreviewHero({ query, startingFromPrice, onScrollToPricing }: Props) {
  const headline =
    query.type === "plate" ? "Report per targa" : "Report per VIN";

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="pb-12 pt-14 md:pb-20 md:pt-24">
          <div className="mb-10 flex items-center gap-2 text-[11px] text-slate-500 md:mb-16 md:text-[12px]">
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium">Anteprima pronta per la tua ricerca</span>
          </div>

          <div className="min-w-0 max-w-4xl">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 md:mb-7">
              Ricerca selezionata
            </p>
            <h1 className="text-[42px] font-light leading-[0.92] tracking-[-0.03em] text-slate-950 sm:text-[64px] md:text-[72px]">
              {headline}
            </h1>
            <p className="mt-6 max-w-xl text-[14px] leading-relaxed text-slate-500 md:mt-8 md:text-[15px]">
              I dati tecnici e lo storico del veicolo saranno generati dopo il pagamento. Qui vedi
              solo il riferimento inserito e le sezioni incluse nel report.
            </p>
          </div>

          <div className="mt-12 border-t border-slate-200/80 pt-10 md:mt-20 md:pt-12">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                {query.type === "plate" ? "Targa" : "Numero VIN"}
              </p>
              {query.type === "plate" ? (
                <ItalianPlate value={query.value} />
              ) : (
                <p className="break-all font-mono text-2xl font-bold tracking-wider text-slate-900">
                  {query.cleanValue}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 md:mt-14">
            <button
              type="button"
              onClick={onScrollToPricing}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-slate-800"
            >
              Vedi il report basato sui dati disponibili
            </button>
            <p className="text-[13px] text-slate-500">
              A partire da{" "}
              <span className="font-medium tabular-nums text-slate-900">{startingFromPrice}</span>
              <span className="mx-2 text-slate-300">·</span>
              offerta introduttiva, poi abbonamento mensile dopo 3 giorni
            </p>
          </div>
        </div>
        <div className="h-px bg-slate-200/80" aria-hidden />
      </div>
    </section>
  );
}
