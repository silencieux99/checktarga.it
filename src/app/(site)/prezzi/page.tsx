import type { Metadata } from "next";
import PricingCards from "@/components/PricingCards";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Prezzi",
  description:
    "Pacchetti report veicolo senza abbonamento. Scegli il piano giusto per verificare targa o VIN in Italia.",
  path: "/prezzi",
});

export default function PrezziPage() {
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Scegli il pacchetto giusto per te
          </h1>
          <p className="text-slate-600">
            Acquisti una tantum, senza abbonamento. I crediti restano disponibili nella tua area
            personale per generare i report quando ne hai bisogno.
          </p>
        </div>

        <PricingCards ctaMode="hero" />
      </div>
    </div>
  );
}
