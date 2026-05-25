const REGIONS = [
  "Lombardia",
  "Lazio",
  "Campania",
  "Sicilia",
  "Veneto",
  "Emilia-Romagna",
  "Piemonte",
  "Puglia",
  "Toscana",
  "Calabria",
];

export default function ItalyCoverageBanner() {
  return (
    <section className="border-y border-slate-100 bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <span className="block h-5 w-1.5 rounded-full bg-green-600" />
              <span className="block h-5 w-1.5 rounded-full bg-white" />
              <span className="block h-5 w-1.5 rounded-full bg-red-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800 sm:text-base">
              Copertura su tutto il territorio nazionale
            </p>
          </div>
          <p className="text-xs font-medium text-slate-400 sm:text-sm">
            {REGIONS.map((region, i) => (
              <span key={region}>
                {i > 0 && (
                  <span className="mx-1 text-slate-300 sm:mx-1.5" aria-hidden>
                    ·
                  </span>
                )}
                {region}
              </span>
            ))}
            <span className="mx-1 text-slate-300 sm:mx-1.5" aria-hidden>
              ·
            </span>
            e altre regioni
          </p>
        </div>
      </div>
    </section>
  );
}
