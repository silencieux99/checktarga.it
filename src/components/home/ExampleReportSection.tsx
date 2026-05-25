import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export default function ExampleReportSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          Vuoi vedere un esempio concreto?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-slate-600">
          Consulta un report dimostrativo con dati fittizi per capire subito il livello di
          dettaglio che riceverai dopo l&apos;acquisto.
        </p>
        <Link
          href="/esempio-report"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <FileText className="h-5 w-5" />
          Vedi esempio report
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-6 text-sm text-slate-500">
          Nessuna registrazione richiesta • Dati di esempio non riferiti a veicoli reali
        </p>
      </div>
    </section>
  );
}
