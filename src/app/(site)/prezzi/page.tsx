import type { Metadata } from "next";
import PricingCards from "@/components/PricingCards";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Prezzi",
  description:
    "Pacchetti report da 15,99 €: 1, 6, 10 o 20 crediti. Pagamento unico. Verifica targa o VIN in Italia.",
  path: "/prezzi",
});

export default function PrezziPage() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="section-label">Prezzi trasparenti</p>
          <h1 className="display-heading mt-3 text-3xl sm:text-4xl lg:text-5xl">
            Scegli il pacchetto giusto per te
          </h1>
          <p className="mt-4 text-brand-muted">
            Pagamento unico via Stripe. I crediti sono subito disponibili nella tua area personale.
            Nessun rinnovo automatico.
          </p>
        </div>

        <PricingCards />

        <div className="card-surface mt-10 p-6 text-sm text-brand-muted">
          <p className="font-semibold text-brand">Come funzionano i pacchetti</p>
          <ul className="mt-3 space-y-2">
            <li>• 1 report a 15,99 € · 6 report (3+3) a 23,99 € · 10 report (5+5) a 34,99 € · 20 report (10+10) a 49,99 €</li>
            <li>• Pagamento unico, senza rinnovo automatico.</li>
            <li>• I crediti restano sul tuo account fino all&apos;utilizzo.</li>
            <li>• Pagamento sicuro con Stripe (carta).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
