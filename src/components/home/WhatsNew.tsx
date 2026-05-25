export default function WhatsNew() {
  return (
    <section className="overflow-hidden border-y border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-0 pt-10 sm:pt-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="w-full pb-10 text-center md:w-1/2 md:pb-16 md:text-left">
            <span className="mb-4 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Novità 2026
            </span>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
              Versione esatta e optional di serie inclusi
            </h2>
            <p className="text-base leading-relaxed text-slate-600 lg:text-lg">
              Il report mostra ora la versione precisa del veicolo e l&apos;elenco completo degli
              equipaggiamenti di fabbrica. Niente più sorprese sugli optional realmente montati.
              <span className="mt-4 block text-sm font-medium text-slate-500">
                Disponibile per veicoli immatricolati dal 2011 in poi.
              </span>
            </p>
          </div>

          <div className="w-full self-end md:w-1/2">
            <div className="relative overflow-hidden rounded-t-2xl border-x border-t border-slate-200 bg-white shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-6">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 h-2 w-24 rounded bg-blue-600" />
                  <div className="space-y-2">
                    {["Versione 1.0 Hybrid", "Navigatore", "Sensori parcheggio", "Cruise control"].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                        >
                          <span className="text-slate-700">{item}</span>
                          <span className="text-xs font-semibold text-emerald-600">Verificato</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
