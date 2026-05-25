import { CheckCircle2 } from "lucide-react";

export function PostPaymentProcess() {
  return (
    <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32">
      <div className="mb-12 text-center md:mb-16">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Semplicità assoluta
        </p>
        <h2 className="text-2xl font-light leading-tight text-slate-900 md:text-4xl">
          Il tuo report in 3 passaggi
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {[
          {
            n: "1",
            title: "Pagamento sicuro",
            text: "Conferma l'ordine tramite Stripe con protezione bancaria.",
          },
          {
            n: "2",
            title: "Conferma veicolo",
            text: "Reinserisci targa o VIN per generare il report corretto.",
          },
          {
            n: "3",
            title: "Accesso immediato",
            text: "Consulta il report completo in meno di 30 secondi.",
          },
        ].map((step, idx) => (
          <div key={step.title} className="flex flex-row items-start gap-6 md:flex-col md:items-center md:text-center">
            <div
              className={`z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border shadow-sm ${
                idx === 2 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
              }`}
            >
              {idx === 2 ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <span className="text-lg font-bold text-slate-900">{step.n}</span>
              )}
            </div>
            <div className="pt-2 md:pt-6">
              <h3 className="mb-2 text-base font-bold uppercase tracking-wide text-slate-900">
                {step.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500 md:max-w-xs">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
