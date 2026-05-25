import Container from "@/components/Container";

const FEATURES = [
  {
    num: "01",
    title: "Intestatario attuale",
    desc: "Dati anagrafici del proprietario registrato",
    exclusive: true,
  },
  {
    num: "02",
    title: "Storico chilometri",
    desc: "Rilevamenti durante revisioni e controlli",
    exclusive: true,
  },
  {
    num: "03",
    title: "Revisioni periodiche",
    desc: "Esiti, difetti gravi e lievi",
    exclusive: false,
  },
  {
    num: "04",
    title: "Sinistri segnalati",
    desc: "Incidenti e denunce assicurative",
    exclusive: false,
  },
  {
    num: "05",
    title: "Situazione amministrativa",
    desc: "Fermo, ipoteca, furto, segnalazioni europee",
    exclusive: false,
  },
  {
    num: "06",
    title: "Uso professionale",
    desc: "Taxi, NCC, scuola guida, noleggio",
    exclusive: false,
  },
  {
    num: "07",
    title: "Storico proprietari",
    desc: "Numero e localizzazione dei passaggi PRA",
    exclusive: false,
  },
  {
    num: "08",
    title: "Stima di mercato",
    desc: "Valutazione personalizzata in base ai km reali",
    exclusive: false,
  },
];

const TRUST = ["Dati in tempo reale", "100% italiano", "Conforme GDPR"];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <Container className="px-4">
        <div className="mb-10 text-center sm:mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
            Contenuto del report
          </p>
          <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Tutto ciò che devi sapere
            <br className="hidden sm:block" />
            <span className="font-medium text-slate-400"> prima di acquistare</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.num} className="flex flex-col bg-white p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tabular-nums text-slate-300">
                  {feature.num}
                </span>
                {feature.exclusive && (
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    Esclusivo
                  </span>
                )}
              </div>
              <h3 className="mb-1 text-sm font-bold leading-snug text-slate-900 sm:text-base">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 sm:gap-8">
          {TRUST.map((item) => (
            <span key={item} className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
              <span className="block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {item}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
