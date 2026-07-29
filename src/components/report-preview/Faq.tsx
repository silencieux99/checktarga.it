"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "Cosa significa fermo amministrativo?",
    answer:
      "È un vincolo che impedisce la vendita del veicolo finché non viene risolta una situazione debitoria o amministrativa. Il nostro report segnala queste condizioni quando presenti.",
  },
  {
    question: "Come funziona il rimborso?",
    answer:
      "Hai 30 giorni per richiedere un rimborso se il report non contiene le informazioni promesse rispetto al veicolo verificato.",
  },
  {
    question: "Come funzionano i pacchetti?",
    answer:
      "Acquisti un pacchetto one-shot (da 15,99 €) e usi i crediti quando vuoi. Nessun rinnovo automatico.",
  },
  {
    question: "Quanto tempo ci vuole?",
    answer:
      "Dopo il pagamento, l'accesso all'area personale è immediato e il report viene generato in pochi minuti.",
  },
  {
    question: "Posso verificare targa e VIN?",
    answer:
      "Sì, supportiamo targhe italiane e numeri di telaio (VIN) per ottenere lo storico del veicolo.",
  },
];

export function ReportPreviewFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto mb-20 max-w-3xl px-4 md:mb-28">
      <div className="mb-10 text-center">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Guida</p>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Come interpretare il report?</h2>
      </div>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={item.question} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50"
            >
              <span className="pr-4 text-sm font-semibold text-slate-900 md:text-base">{item.question}</span>
              <span className="text-slate-400">{openIndex === idx ? "−" : "+"}</span>
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5">
                <p className="text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
