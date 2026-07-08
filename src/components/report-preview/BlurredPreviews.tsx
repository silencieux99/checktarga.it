"use client";

import { ReportPreviewQuery, formatItalianPlateDisplay } from "@/lib/report-preview";

interface Props {
  query: ReportPreviewQuery;
  onUnlock: () => void;
}

function PlaceholderLines() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="h-4 w-1/2 rounded bg-slate-200" />
      <div className="h-4 w-2/3 rounded bg-slate-200" />
      <div className="h-4 w-5/6 rounded bg-slate-200" />
    </div>
  );
}

function BlurredCard({
  title,
  onUnlock,
  highlight,
  glow,
}: {
  title: string;
  onUnlock: () => void;
  highlight?: boolean;
  glow?: boolean;
}) {
  const borderClass = glow
    ? "border-indigo-300 animate-card-glow"
    : highlight
      ? "border-amber-200"
      : "border-slate-200";
  const headerClass = glow
    ? "border-indigo-100 bg-indigo-50/50"
    : highlight
      ? "border-amber-100 bg-amber-50/50"
      : "border-slate-100";
  const titleClass = glow ? "text-indigo-600" : highlight ? "text-amber-600" : "text-slate-400";

  return (
    <div className={`overflow-hidden rounded-none border-y bg-white md:rounded-2xl md:border ${borderClass}`}>
      <div className={`border-b px-5 py-3 md:py-4 ${headerClass}`}>
        <p className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${titleClass}`}>{title}</p>
      </div>
      <div className="relative min-h-[200px] overflow-hidden">
        <div className="pointer-events-none select-none px-5 py-5 md:px-6 md:py-6" style={{ filter: "blur(12px)" }}>
          <PlaceholderLines />
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/20 via-white/40 to-white/60">
          <button
            type="button"
            onClick={onUnlock}
            className="pointer-events-auto rounded-xl bg-slate-900 px-7 py-4 text-sm font-semibold text-white shadow-2xl shadow-slate-900/30 transition-all hover:bg-black active:scale-95"
          >
            Vedi il report basato sui dati disponibili
          </button>
        </div>
      </div>
    </div>
  );
}

export function BlurredReportPreviews({ query, onUnlock }: Props) {
  const identifier =
    query.type === "plate"
      ? formatItalianPlateDisplay(query.value)
      : query.cleanValue;

  return (
    <div className="mx-auto max-w-3xl space-y-3 md:px-4">
      <div className="overflow-hidden rounded-none border-y border-slate-200 bg-white md:rounded-2xl md:border">
        <div className="px-5 py-6 md:px-8 md:py-8">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Riferimento ricerca
          </p>
          <h3 className="truncate text-lg font-bold leading-tight text-slate-900 md:text-xl">
            {query.type === "plate" ? "Targa" : "VIN"}: {identifier}
          </h3>
          <p className="mt-2 text-xs text-slate-500 md:text-sm">
            Marca, modello e dati tecnici saranno inclusi nel report dopo il pagamento.
          </p>
        </div>
      </div>

      <BlurredCard title="Storico chilometri" onUnlock={onUnlock} />
      <BlurredCard title="Sinistri e incidenti" onUnlock={onUnlock} />
      <BlurredCard title="Situazione amministrativa" onUnlock={onUnlock} />
      <BlurredCard title="Storico manutenzione" onUnlock={onUnlock} highlight />
      <BlurredCard title="Libretto / visura PRA" onUnlock={onUnlock} glow />
    </div>
  );
}
