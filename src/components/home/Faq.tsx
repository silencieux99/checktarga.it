"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "@/components/Container";

const FAQS = [
  {
    question: "Quanto tempo ci vuole per ricevere il report?",
    answer:
      "Dopo il pagamento, l'accesso all'area personale è immediato. La generazione del report richiede in genere pochi minuti.",
  },
  {
    question: "Posso verificare qualsiasi targa italiana?",
    answer:
      "Sì, supportiamo le targhe immatricolate in Italia. Puoi anche cercare tramite numero di telaio (VIN).",
  },
  {
    question: "I dati sono aggiornati?",
    answer:
      "Incrociamo fonti ufficiali e partner certificati. I database vengono aggiornati quotidianamente.",
  },
  {
    question: "Come funziona il rimborso?",
    answer:
      "Se il report non contiene dati utili rispetto a quanto promesso, puoi contattarci entro 30 giorni per una verifica del rimborso.",
  },
  {
    question: "Come funziona l'abbonamento?",
    answer:
      "Paghi un importo introduttivo (4,99 € o 6,99 €) e ricevi subito i crediti. Dopo 48 ore parte il rinnovo automatico ogni 4 settimane (29,99 € o 39,99 €) sulla carta salvata in sicurezza tramite Stripe. Puoi annullare in qualsiasi momento dall'area personale.",
  },
  {
    question: "Il pagamento è sicuro?",
    answer:
      "Sì, utilizziamo Stripe. I dati della carta non transitano sui nostri server.",
  },
  {
    question: "Cos'è un leasing irregolare?",
    answer:
      "Si tratta di un veicolo ancora vincolato a un contratto di noleggio o leasing long term, venduto senza estinzione del contratto. Può comportare rischi legali per l'acquirente.",
  },
  {
    question: "Cos'è un fermo amministrativo?",
    answer:
      "È un vincolo che impedisce la vendita del veicolo fino alla risoluzione di un debito o procedura. Il nostro report segnala queste situazioni quando presenti.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-16 lg:py-20">
      <Container className="px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">Domande frequenti</h2>
          <p className="mx-auto max-w-xl text-slate-600">
            Tutto quello che devi sapere prima di verificare la targa.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {FAQS.map((faq, index) => (
            <div key={faq.question} className="overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
              >
                <span className="pr-4 font-medium text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
