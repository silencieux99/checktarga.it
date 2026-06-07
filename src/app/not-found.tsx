import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/brand/Logo";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pagina non trovata",
  description: "La pagina richiesta non esiste su checktarga.it.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-surface px-4 text-center">
      <Logo size="lg" href="/" className="mb-10" />
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-accent">404</p>
      <h1 className="display-heading mb-4 text-3xl">Pagina non trovata</h1>
      <p className="mb-8 max-w-md text-brand-muted">
        La pagina che cerchi non esiste o è stata spostata. Torna alla home per verificare una
        targa o consultare i prezzi.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-accent">
          Torna alla home
        </Link>
        <Link href="/prezzi" className="btn-outline">
          Vedi i prezzi
        </Link>
      </div>
    </div>
  );
}
