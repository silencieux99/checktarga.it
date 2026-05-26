"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import Container from "@/components/Container";
import { formatItalianPlate, validatePlate, validateVin } from "@/lib/vehicle";

const KEY_POINTS = [
  "Intestatario attuale",
  "Storico chilometri",
  "Sinistri segnalati",
  "Revisioni e controlli",
];

export default function HomeHero() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"plate" | "vin">("plate");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (raw: string) => {
    setValue(searchType === "plate" ? formatItalianPlate(raw) : raw.toUpperCase());
    if (error) setError("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = searchType === "plate" ? validatePlate(value) : validateVin(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const param = searchType === "plate" ? "plate" : "vin";
    router.push(`/anteprima-report?type=${param}&value=${encodeURIComponent(value.trim())}`);
  };

  return (
    <section id="hero" className="relative scroll-mt-20 bg-white pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-24 lg:pt-16">
      <Container className="px-3 sm:px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                <span className="text-base leading-none">🇮🇹</span>
                <span className="text-[10px] font-semibold text-slate-700 sm:text-xs">
                  100% italiano • Dati aggiornati ogni giorno
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/70 px-3 py-1.5 shadow-sm">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 sm:h-4 sm:w-4" />
                <span className="text-[10px] font-semibold text-amber-700 sm:text-xs">
                  Richiami sicurezza attivi
                </span>
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Il report storico auto
            <br />
            <span className="text-blue-600">più completo d&apos;Italia</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Individua i rischi che costano caro: sinistri, chilometri dubbi, uso intensivo o
            vincoli amministrativi.
            <span className="mt-2 block text-sm text-slate-500">
              Un report chiaro per decidere con serenità.
            </span>
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:gap-x-3">
            {KEY_POINTS.map((text, i) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 text-[13px] text-slate-600 sm:text-sm"
              >
                <svg className="h-3.5 w-3.5 shrink-0 text-blue-500" viewBox="0 0 16 16" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.28-8.72a.75.75 0 00-1.06-1.06L7 8.44 5.78 7.22a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3.75-3.75z"
                    clipRule="evenodd"
                  />
                </svg>
                {text}
                {i < KEY_POINTS.length - 1 && (
                  <span className="ml-0.5 hidden text-slate-200 sm:inline" aria-hidden>
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>

          <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 sm:max-w-lg sm:rounded-2xl sm:shadow-xl">
            <div className="flex border-b border-slate-100">
              {(["plate", "vin"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSearchType(type);
                    setValue("");
                    setError("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors sm:py-3 sm:text-sm ${
                    searchType === type
                      ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {type === "plate" ? "Targa" : "Numero VIN"}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="p-3 sm:p-5">
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={searchType === "plate" ? "AB 123 CD" : "ZFA31200001234567"}
                maxLength={searchType === "vin" ? 17 : 10}
                className="mb-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center text-base font-semibold uppercase text-slate-900 transition-all placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:mb-4 sm:rounded-xl sm:px-4 sm:py-3.5 sm:text-lg"
              />

              {error && (
                <div className="mb-3 rounded-lg border border-red-100 bg-red-50 p-2.5 text-xs font-medium text-red-600 sm:mb-4 sm:p-3 sm:text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:rounded-xl sm:py-3.5 sm:text-base"
              >
                {loading ? "Analisi in corso..." : "Rileva i rischi del veicolo"}
                {!loading && (
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>

              <p className="mt-2.5 text-center text-[10px] text-slate-400 sm:mt-3 sm:text-xs">
                Report completo in 2 min • Accesso immediato • Soddisfatti o rimborsati
              </p>
            </form>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-px text-sm text-amber-400" aria-hidden>
                {"★★★★☆".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <span className="text-sm font-bold tabular-nums text-slate-800">4,7</span>
              <span className="text-xs text-slate-400">/5</span>
            </div>

            <div className="hidden h-4 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-bold text-emerald-600">
                30g
              </span>
              <span className="text-sm text-slate-600">Soddisfatti o rimborsati</span>
            </div>

            <div className="hidden h-4 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-400">Pagamento sicuro</span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                <span className="rounded border border-slate-200 px-1.5 py-0.5">Visa</span>
                <span className="rounded border border-slate-200 px-1.5 py-0.5">MC</span>
                <span className="rounded border border-slate-200 px-1.5 py-0.5">Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
