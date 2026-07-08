import Container from "@/components/Container";
import { SITE } from "@/lib/pricing";

export default function DisdettaPage() {
  return (
    <div className="bg-white">
      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Disdetta
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Puoi annullare l&apos;abbonamento in qualsiasi momento dal tuo account.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Passaggi</h2>
            <ol className="mt-3 space-y-2 text-base text-slate-700">
              <li>
                <span className="font-semibold">1.</span> Accedi al tuo account
              </li>
              <li>
                <span className="font-semibold">2.</span> Vai su Il mio account
              </li>
              <li>
                <span className="font-semibold">3.</span> Seleziona Gestisci abbonamento
              </li>
              <li>
                <span className="font-semibold">4.</span> Clicca su Annulla abbonamento
              </li>
            </ol>
          </div>

          <p className="mt-6 text-base text-slate-700">
            Se hai difficoltà, contattaci a{" "}
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
