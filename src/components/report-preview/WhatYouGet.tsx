"use client";

import { useState } from "react";

interface Props {
  onUnlock: () => void;
}

const CATEGORIES = [
  {
    id: "history",
    index: "01",
    title: "Storico e chilometri",
    intro:
      "Il contachilometri manomesso resta la frode n.1 in Italia. Incrociamo più fonti per individuare incoerenze lungo tutta la vita del veicolo.",
    items: [
      "Rilevamento contachilometri alterato",
      "Chilometri registrati ad ogni revisione",
      "Uso professionale: taxi, NCC, scuola guida",
      "Storico passaggi PRA e proprietari",
    ],
  },
  {
    id: "safety",
    index: "02",
    title: "Sinistri e sicurezza",
    intro:
      "Un'auto può sembrare perfetta e nascondere danni strutturali. Mostriamo ciò che spesso non viene dichiarato in vendita.",
    items: [
      "Foto e segnalazioni di sinistri",
      "Richiami di sicurezza non eseguiti",
      "Esiti revisioni e difetti rilevati",
      "Zone verniciate o sospette",
    ],
  },
  {
    id: "admin",
    index: "03",
    title: "Situazione amministrativa",
    intro:
      "Comprare un veicolo gravato da vincoli può costare molto più del prezzo pagato. Verifichiamo ogni punto critico.",
    items: [
      "Fermo amministrativo",
      "Pegno e ipoteca",
      "Segnalazioni furto",
      "Opposizioni al passaggio di proprietà",
    ],
  },
  {
    id: "value",
    index: "04",
    title: "Valore e negoziazione",
    intro:
      "Non pagare mai più del valore reale. I dati del report ti danno leve concrete per negoziare.",
    items: [
      "Stima di mercato personalizzata",
      "Margine di negoziazione stimato",
      "Optional di serie verificati",
      "Costi di manutenzione previsti",
    ],
  },
  {
    id: "exclusive",
    index: "05",
    title: "Proprietario e sinistri dettagliati",
    intro:
      "Informazioni che raramente trovi altrove: identità del titolare e storico sinistri completo.",
    items: [
      "Nome dell'intestatario attuale",
      "Numero passaggi PRA",
      "Data e natura dei sinistri",
      "Coerenza tra libretto e visura",
    ],
    exclusive: true,
  },
];

export function ReportPreviewWhatYouGet({ onUnlock }: Props) {
  const [active, setActive] = useState(CATEGORIES[0].id);
  const current = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0];

  return (
    <section className="border-t border-slate-200/80 bg-slate-50/40">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <div className="mb-12 max-w-2xl md:mb-20">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
            Cosa ottieni
          </p>
          <h2 className="text-[32px] font-light leading-[1.05] tracking-[-0.02em] text-slate-950 md:text-[52px]">
            Un report che non lascia{" "}
            <em className="font-light italic text-slate-400">nulla nell&apos;ombra.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <nav className="hidden md:col-span-4 md:block">
            <ul className="border-t border-slate-200/80">
              {CATEGORIES.map((cat) => (
                <li key={cat.id} className="border-b border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setActive(cat.id)}
                    className="group flex w-full items-center gap-5 py-5 text-left"
                  >
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        active === cat.id ? "text-slate-900" : "text-slate-300 group-hover:text-slate-500"
                      }`}
                    >
                      {cat.index}
                    </span>
                    <span
                      className={`text-[15px] tracking-tight ${
                        active === cat.id
                          ? "font-medium text-slate-900"
                          : "font-normal text-slate-500 group-hover:text-slate-900"
                      }`}
                    >
                      {cat.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-8">
            <h3 className="mb-5 text-[24px] font-light leading-tight tracking-[-0.02em] text-slate-950 md:mb-6 md:text-[34px]">
              {current.title}
            </h3>
            <p className="mb-10 max-w-xl text-[14px] leading-relaxed text-slate-500 md:mb-12 md:text-[16px]">
              {current.intro}
            </p>
            <ul className="border-t border-slate-200/80">
              {current.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 border-b border-slate-200/80 py-3.5 text-[14px] leading-relaxed text-slate-700 md:py-4 md:text-[15px]"
                >
                  <span className="mt-1 select-none text-slate-300" aria-hidden>
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onUnlock}
              className="mt-10 text-[13px] font-medium text-slate-900 underline decoration-slate-300 decoration-1 underline-offset-[6px] transition-all hover:decoration-slate-900 md:mt-12"
            >
              Sblocca tutto →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
