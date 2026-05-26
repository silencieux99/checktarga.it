import Link from "next/link";
import { SITE } from "@/lib/pricing";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div className="md:col-span-2">
          <p className="font-bold text-slate-900 mb-2">{SITE.name}.it</p>
          <p className="text-slate-600 max-w-md leading-relaxed">
            Servizio indipendente di verifica storico veicoli immatricolati in Italia.
            Aiutiamo privati e professionisti a evitare sorprese nell&apos;acquisto di auto usate.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 mb-3">Servizio</p>
          <ul className="space-y-2 text-slate-600">
            <li><Link href="/prezzi" className="hover:text-teal-700">Prezzi</Link></li>
            <li><Link href="/esempio-report" className="hover:text-teal-700">Esempio report</Link></li>
            <li><Link href="/account" className="hover:text-teal-700">Area personale</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900 mb-3">Legale</p>
          <ul className="space-y-2 text-slate-600">
            <li><Link href="/termini" className="hover:text-teal-700">Termini di servizio</Link></li>
            <li><Link href="/privacy" className="hover:text-teal-700">Privacy</Link></li>
            <li><Link href="/note-legali" className="hover:text-teal-700">Note legali</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {SITE.name}. Tutti i diritti riservati.{" "}
        <a href={`mailto:${SITE.supportEmail}`} className="hover:text-teal-700">
          {SITE.supportEmail}
        </a>
      </div>
    </footer>
  );
}
