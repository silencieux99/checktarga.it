import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import LegalCompanyBlock from "@/components/legal/LegalCompanyBlock";
import PrivateServiceDisclaimer from "@/components/legal/PrivateServiceDisclaimer";
import { DATA_VARIABILITY_NOTICE } from "@/lib/company";
import { SITE } from "@/lib/pricing";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Note legali",
  description: "Note legali, dati societari e informazioni sull'hosting di CheckTarga.it.",
  path: "/note-legali",
});

export default function NoteLegaliPage() {
  return (
    <LegalLayout title="Note legali">
      <LegalCompanyBlock />

      <section className="mt-8 space-y-4 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">Editor del sito</h2>
        <p>
          Il sito CheckTarga.it è gestito da MG COMPANY DAYA LTD, società registrata nel Regno Unito
          con Company Number 16707902.
        </p>

        <h2 className="text-xl font-bold text-slate-900">Natura del servizio</h2>
        <PrivateServiceDisclaimer className="mt-2" />
        <p className="mt-4">{DATA_VARIABILITY_NOTICE}</p>

        <h2 className="text-xl font-bold text-slate-900">Hosting e pagamenti</h2>
        <p>Hosting: Vercel Inc.</p>
        <p>Pagamenti: Stripe Payments Europe Ltd.</p>

        <h2 className="text-xl font-bold text-slate-900">Responsabilità</h2>
        <p>
          I report forniti da CheckTarga.it hanno finalità informativa e si basano sui dati
          disponibili al momento della richiesta. Non sostituiscono visure ufficiali, perizie
          tecniche o consulenze legali. L&apos;utente resta responsabile delle decisioni prese sulla
          base delle informazioni consultate.
        </p>

        <h2 className="text-xl font-bold text-slate-900">Diritto applicabile</h2>
        <p>
          Salvo diversa disposizione inderogabile a tutela dei consumatori, le presenti note legali
          e i rapporti con gli utenti sono regolati dalla legge inglese, in relazione alla società
          MG COMPANY DAYA LTD.
        </p>

        <h2 className="text-xl font-bold text-slate-900">Contatti</h2>
        <p>
          Per assistenza o richieste legali:{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
            {SITE.supportEmail}
          </a>
        </p>
      </section>
    </LegalLayout>
  );
}
