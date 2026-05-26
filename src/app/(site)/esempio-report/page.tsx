import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Esempio report",
  description:
    "Scopri la struttura di un report CheckTarga: identificazione veicolo, chilometri, proprietà e vincoli.",
  path: "/esempio-report",
});

const DEMO_SECTIONS = [
  {
    title: "Identificazione veicolo",
    rows: [
      ["Targa", "GA 482 LM"],
      ["VIN", "ZFA31200001234567"],
      ["Marca / Modello", "FIAT / Panda"],
      ["Immatricolazione", "03/2019"],
    ],
  },
  {
    title: "Storico chilometri",
    rows: [
      ["Ultimo dato registrato", "84.320 km"],
      ["Anomalia rilevata", "Nessuna"],
      ["Fonte", "Revisioni e banche dati partner"],
    ],
  },
  {
    title: "Proprietà e vincoli",
    rows: [
      ["Proprietari registrati", "2"],
      ["Fermo amministrativo", "Non rilevato"],
      ["Ipoteca / vincolo", "Non rilevato"],
    ],
  },
];

export default function EsempioReportPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-sm font-semibold text-teal-700 mb-2">Esempio dimostrativo</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Anteprima di un report CheckTarga</h1>
          <p className="text-slate-600">
            I dati mostrati sono fittizi e servono solo a illustrare la struttura del documento che
            riceverai dopo l&apos;acquisto.
          </p>
        </div>

        <div className="space-y-6">
          {DEMO_SECTIONS.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-bold text-slate-900 mb-4">{section.title}</h2>
              <dl className="space-y-2">
                {section.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="font-medium text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
