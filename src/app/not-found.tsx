import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/pricing";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pagina non trovata",
  description: "La pagina richiesta non esiste su CheckTarga.it.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">404</p>
      <h1 className="mb-4 text-3xl font-bold text-slate-900">Pagina non trovata</h1>
      <p className="mb-8 max-w-md text-slate-600">
        La pagina che cerchi non esiste o è stata spostata. Torna alla home per verificare una
        targa o consultare i prezzi.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Torna alla home
        </Link>
        <Link
          href="/prezzi"
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Vedi i prezzi
        </Link>
      </div>
      <p className="mt-10 text-xs text-slate-400">{SITE.name}.it</p>
    </div>
  );
}
