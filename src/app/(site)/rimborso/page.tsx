"use client";

import Container from "@/components/Container";
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
          <p className="mt-4 text-base text-slate-700">
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
      </Container>
    </div>
  );
}

