const PARTNERS = ["Generali", "UnipolSai", "Allianz", "Zurich", "Reale Mutua", "Linear", "Cattolica"];

export function InsurancePartners() {
  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Fonti dati certificate
          </h3>
          <p className="mx-auto max-w-xl text-sm font-medium text-slate-600">
            Incrociamo dati amministrativi e segnalazioni sinistri con partner assicurativi per
            maggiore trasparenza.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70 md:gap-x-16">
          {PARTNERS.map((name) => (
            <span key={name} className="text-base font-bold text-slate-400 md:text-lg">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
