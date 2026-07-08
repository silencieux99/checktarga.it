"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { SITE } from "@/lib/pricing";

export default function AbbonamentoPage() {
  return (
    <div className="bg-white">
      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Abbonamento
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Questa pagina spiega in modo chiaro come funziona l’offerta prima del pagamento.
          </p>

          <div className="mt-8 space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Pagamento iniziale</h2>
              <p className="mt-2 text-base text-slate-700">
                Oggi paghi <span className="font-semibold">4,99 €</span> e ottieni{" "}
                <span className="font-semibold">1 report immediato</span>.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Prova di 3 giorni</h2>
              <p className="mt-2 text-base text-slate-700">
                Dopo l’acquisto, hai <span className="font-semibold">3 giorni</span> prima che parta
                il rinnovo dell’abbonamento.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Prezzo e rinnovo</h2>
              <p className="mt-2 text-base text-slate-700">
                Trascorsi 3 giorni, l’abbonamento si rinnova automaticamente a{" "}
                <span className="font-semibold">29,99 €/mese</span> fino alla disdetta.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Come annullare</h2>
              <p className="mt-2 text-base text-slate-700">
                Puoi annullare in qualsiasi momento dal tuo account. Per le istruzioni passo-passo,
                visita la pagina{" "}
                <Link
                  href="/disdetta"
                  className="font-semibold text-brand-accent underline underline-offset-2 hover:text-brand-accent-hover"
                >
                  Disdetta
                </Link>
                .
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Supporto</h2>
              <p className="mt-2 text-base text-slate-700">
                Per assistenza puoi scriverci a{" "}
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="font-semibold text-brand-accent underline underline-offset-2 hover:text-brand-accent-hover"
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

