import type { Metadata } from "next";
import Container from "@/components/Container";
import PrivateServiceDisclaimer from "@/components/legal/PrivateServiceDisclaimer";
import { SUBSCRIPTION_PRE_PAYMENT_NOTICE } from "@/lib/company";
import { SITE } from "@/lib/pricing";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Abbonamento",
  description:
    "Informazioni chiare su pagamento iniziale, rinnovo automatico ogni 4 settimane e disdetta dell'abbonamento CheckTarga.it.",
  path: "/abbonamento",
});

export default function AbbonamentoPage() {
  return (
    <div className="bg-white">
      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Abbonamento
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Questa pagina spiega in modo chiaro come funziona l&apos;offerta prima del pagamento.
          </p>

          <div className="mt-8 space-y-6">
            <PrivateServiceDisclaimer />

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Pagamento iniziale</h2>
              <p className="mt-2 text-base text-slate-700">
                Oggi paghi <span className="font-semibold">4,99 €</span> e ottieni{" "}
                <span className="font-semibold">1 report immediato</span>.
              </p>
            </section>

            <section className="rounded-2xl border-2 border-slate-900 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-950">Rinnovo automatico</h2>
              <p className="mt-2 text-base font-medium text-slate-900">{SUBSCRIPTION_PRE_PAYMENT_NOTICE}</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Come annullare</h2>
              <p className="mt-2 text-base text-slate-700">
                Puoi annullare in qualsiasi momento dal tuo account. Consulta la pagina{" "}
                <a href="/disdetta" className="font-semibold text-brand-accent underline underline-offset-2">
                  Disdetta
                </a>{" "}
                per i passaggi dettagliati.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Supporto</h2>
              <p className="mt-2 text-base text-slate-700">
                Per assistenza scrivi a{" "}
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="font-semibold text-brand-accent underline underline-offset-2"
                >
                  {SITE.supportEmail}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
