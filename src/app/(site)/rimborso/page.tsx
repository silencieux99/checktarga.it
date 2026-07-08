import Container from "@/components/Container";
import LegalCompanyBlock from "@/components/legal/LegalCompanyBlock";
import { SITE } from "@/lib/pricing";

export default function RimborsoPage() {
  return (
    <div className="bg-white">
      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Rimborso
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Se ritieni che il servizio non sia adatto alle tue esigenze o riscontri problemi, puoi
            contattarci per assistenza e valutare la possibilità di rimborso in base alle condizioni
            applicabili.
          </p>

          <div className="mt-8">
            <LegalCompanyBlock />
          </div>

          <div className="mt-8 space-y-4 text-base text-slate-700">
            <p>
              Se un report non contiene dati utili rispetto a quanto ragionevolmente atteso per il
              veicolo cercato, puoi contattarci entro 30 giorni per una verifica.
            </p>
            <p>
              Per supporto scrivi a{" "}
              <a
                href={`mailto:${SITE.supportEmail}`}
                className="font-semibold text-brand-accent underline underline-offset-2 hover:text-brand-accent-hover"
              >
                {SITE.supportEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
