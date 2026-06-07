import type { Metadata } from "next";
import PricingCards from "@/components/PricingCards";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Prezzi",
  description:
    "Offerta introduttiva da 4,99 € con rinnovo ogni 4 settimane dopo 48 ore. Verifica targa o VIN in Italia.",
  path: "/prezzi",
});

export default function PrezziPage() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="section-label">Prezzi trasparenti</p>
          <h1 className="display-heading mt-3 text-3xl sm:text-4xl lg:text-5xl">
            Scegli il piano giusto per te
          </h1>
          <p className="mt-4 text-brand-muted">
            Paghi un importo ridotto oggi e ricevi subito i crediti. Il rinnovo ogni 4 settimane parte
            automaticamente dopo 48 ore. Annulla in qualsiasi momento dall&apos;area personale.
          </p>
        </div>

        <PricingCards />

        <div className="card-surface mt-10 p-6 text-sm text-brand-muted">
          <p className="font-semibold text-brand">Come funziona l&apos;abbonamento</p>
          <ul className="mt-3 space-y-2">
            <li>• Pagamento iniziale: 4,99 € (1 report) o 6,99 € (5 report).</li>
            <li>• Dopo 48 ore: rinnovo automatico ogni 4 settimane a 29,99 € o 39,99 €.</li>
            <li>• Ogni rinnovo aggiunge nuovi crediti al tuo account.</li>
            <li>• Cancellazione possibile prima del prossimo addebito.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
