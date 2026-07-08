import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PrivateServiceDisclaimer from "@/components/legal/PrivateServiceDisclaimer";
import LegalCompanyBlock from "@/components/legal/LegalCompanyBlock";
import { COMPANY, DATA_VARIABILITY_NOTICE } from "@/lib/company";
import { SITE } from "@/lib/pricing";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Chi siamo",
  description:
    "Scopri chi è MG COMPANY DAYA LTD, come funziona CheckTarga.it e il nostro impegno per la trasparenza.",
  path: "/chi-siamo",
});

export default function ChiSiamoPage() {
  return (
    <div className="bg-white">
      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Chi siamo
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            CheckTarga.it è un servizio privato gestito da {COMPANY.legalName} (Company Number{" "}
            {COMPANY.companyNumber}) che aiuta gli utenti a consultare lo storico disponibile di un
            veicolo tramite targa o VIN.
          </p>

          <div className="mt-8 space-y-8">
            <PrivateServiceDisclaimer />

            <section>
              <h2 className="text-xl font-semibold text-slate-950">Chi è {COMPANY.legalName}</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-700">
                {COMPANY.legalName} è la società che gestisce CheckTarga.it. Siamo un servizio
                indipendente con sede nel Regno Unito e offriamo report basati sui dati disponibili
                da fonti consultabili legalmente.
              </p>
              <div className="mt-4">
                <LegalCompanyBlock />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-950">Come funziona il servizio</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-base text-slate-700">
                <li>Inserisci la targa italiana o il VIN del veicolo.</li>
                <li>Consulta l&apos;anteprima e completa il pagamento in modo sicuro tramite Stripe.</li>
                <li>Ricevi il report basato sui dati disponibili nella tua area personale.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-950">Il nostro impegno per la trasparenza</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-700">
                Presentiamo chiaramente prezzi, abbonamento, rinnovo automatico e modalità di
                disdetta prima del pagamento. Non ci presentiamo come ente pubblico né come
                rappresentanti ufficiali di ACI, PRA o Motorizzazione Civile.
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-700">{DATA_VARIABILITY_NOTICE}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-950">Contatta il supporto</h2>
              <p className="mt-3 text-base text-slate-700">
                Per assistenza scrivi a{" "}
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="font-semibold text-brand-accent underline underline-offset-2"
                >
                  {SITE.supportEmail}
                </a>{" "}
                oppure visita la pagina{" "}
                <Link href="/contatti" className="font-semibold text-brand-accent underline underline-offset-2">
                  Contatti
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
