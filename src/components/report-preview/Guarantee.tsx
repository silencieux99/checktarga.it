const GUARANTEES = [
  {
    no: "01",
    title: "Fonti ufficiali",
    desc: "PRA, revisioni, banche dati europee e partner certificati incrociati.",
  },
  {
    no: "02",
    title: "Pagamento sicuro",
    desc: "Stripe, 3-D Secure, crittografia SSL e conformità GDPR.",
  },
  {
    no: "03",
    title: "Soddisfatti o rimborsati",
    desc: "Trenta giorni per cambiare idea, senza condizioni complicate.",
  },
  {
    no: "04",
    title: "Generazione immediata",
    desc: "Report pronto in meno di trenta secondi, via email e area personale.",
  },
  {
    no: "05",
    title: "Nessun abbonamento",
    desc: "Pagamento unico. Nessun rinnovo automatico.",
  },
  {
    no: "06",
    title: "Supporto umano",
    desc: "Team raggiungibile sette giorni su sette via email.",
  },
];

export function ReportPreviewGuarantee() {
  return (
    <section className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Garanzie
            </p>
            <h2 className="text-[28px] font-light leading-[1.05] tracking-[-0.02em] text-slate-950 md:text-[40px]">
              Il dubbio non ha posto in una decisione da migliaia di euro.
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 gap-x-12 border-t border-slate-200/80 md:grid-cols-2">
              {GUARANTEES.map((g) => (
                <div
                  key={g.no}
                  className="flex items-start gap-5 border-b border-slate-200/80 py-5 md:py-6"
                >
                  <span className="pt-0.5 font-mono text-[11px] tabular-nums text-slate-300">{g.no}</span>
                  <div>
                    <h3 className="mb-1 text-[14px] font-medium tracking-tight text-slate-900 md:text-[15px]">
                      {g.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-slate-500 md:text-[14px]">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
