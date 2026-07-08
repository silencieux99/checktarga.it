import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import LegalCompanyBlock from "@/components/legal/LegalCompanyBlock";
import { DATA_VARIABILITY_NOTICE } from "@/lib/company";
import { SITE } from "@/lib/pricing";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Informativa privacy",
  description: "Informativa privacy di CheckTarga.it sul trattamento dei dati personali.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalLayout title="Informativa privacy">
      <LegalCompanyBlock />

      <section className="mt-8 space-y-4 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">1. Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento dei dati personali è MG COMPANY DAYA LTD, con sede legale in{" "}
          71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
        </p>

        <h2 className="text-xl font-bold text-slate-900">2. Dati trattati</h2>
        <p>
          Trattiamo email, dati di account, informazioni di ricerca veicolo (targa o VIN), dati di
          pagamento elaborati da Stripe e informazioni tecniche di navigazione necessarie al
          funzionamento del servizio.
        </p>

        <h2 className="text-xl font-bold text-slate-900">3. Finalità del trattamento</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Erogazione del servizio e generazione dei report.</li>
          <li>Gestione account, abbonamenti, pagamenti e assistenza clienti.</li>
          <li>Adempimenti legali, contabili e di sicurezza.</li>
          <li>Miglioramento del servizio e prevenzione abusi.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900">4. Base giuridica</h2>
        <p>
          Il trattamento avviene per esecuzione del contratto, legittimo interesse, obblighi di
          legge e, ove necessario, consenso dell&apos;utente.
        </p>

        <h2 className="text-xl font-bold text-slate-900">5. Conservazione</h2>
        <p>
          I dati sono conservati per il tempo necessario a fornire il servizio, gestire abbonamenti
          e adempiere agli obblighi legali. I report restano disponibili nell&apos;area personale per
          il periodo indicato nelle Condizioni generali.
        </p>

        <h2 className="text-xl font-bold text-slate-900">6. Destinatari e trasferimenti</h2>
        <p>
          Possiamo condividere dati con fornitori che ci supportano (hosting, pagamenti, email,
          analisi) che agiscono come responsabili del trattamento o autonomi titolari, anche al di
          fuori dello Spazio Economico Europeo, con garanzie adeguate ove richiesto.
        </p>

        <h2 className="text-xl font-bold text-slate-900">7. Diritti dell&apos;utente</h2>
        <p>
          Puoi richiedere accesso, rettifica, cancellazione, limitazione, opposizione o portabilità
          dei dati scrivendo a{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
            {SITE.supportEmail}
          </a>
          .
        </p>

        <h2 className="text-xl font-bold text-slate-900">8. Cookie</h2>
        <p>
          Per informazioni sui cookie consulta la pagina{" "}
          <a href="/cookie" className="text-brand-accent underline">
            Cookie Policy
          </a>
          .
        </p>

        <h2 className="text-xl font-bold text-slate-900">9. Trasparenza sui dati veicolo</h2>
        <p>{DATA_VARIABILITY_NOTICE}</p>
      </section>
    </LegalLayout>
  );
}
