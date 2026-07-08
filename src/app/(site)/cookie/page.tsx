import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import LegalCompanyBlock from "@/components/legal/LegalCompanyBlock";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/pricing";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description: "Informativa sui cookie utilizzati da CheckTarga.it.",
  path: "/cookie",
});

export default function CookiePage() {
  return (
    <LegalLayout title="Cookie Policy">
      <LegalCompanyBlock />

      <section className="mt-8 space-y-4 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">1. Cosa sono i cookie</h2>
        <p>
          I cookie sono piccoli file di testo salvati sul dispositivo dell&apos;utente quando visita
          un sito web. Servono a far funzionare il sito, ricordare preferenze e, in alcuni casi,
          analizzare l&apos;utilizzo del servizio.
        </p>

        <h2 className="text-xl font-bold text-slate-900">2. Tipologie di cookie utilizzati</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Cookie tecnici necessari</strong>: indispensabili per login, checkout, sicurezza
            e funzionamento dell&apos;area personale.
          </li>
          <li>
            <strong>Cookie di preferenza</strong>: memorizzano scelte dell&apos;utente per migliorare
            l&apos;esperienza.
          </li>
          <li>
            <strong>Cookie analitici</strong>: ci aiutano a capire come viene utilizzato il sito, in
            forma aggregata, per migliorare il servizio.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900">3. Cookie di terze parti</h2>
        <p>
          Utilizziamo servizi di terze parti come Stripe per i pagamenti e strumenti di analisi o
          hosting. Questi fornitori possono impostare cookie propri secondo le rispettive policy.
        </p>

        <h2 className="text-xl font-bold text-slate-900">4. Gestione dei cookie</h2>
        <p>
          Puoi gestire o disabilitare i cookie dalle impostazioni del browser. La disattivazione di
          alcuni cookie tecnici può limitare l&apos;uso di alcune funzionalità del sito.
        </p>

        <h2 className="text-xl font-bold text-slate-900">5. Contatti</h2>
        <p>
          Per domande sulla presente Cookie Policy puoi scrivere a{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
