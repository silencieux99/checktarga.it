import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Termini di servizio",
  description: "Termini e condizioni del servizio CheckTarga.it per i report storico veicolo.",
  path: "/termini",
});

export default function TerminiPage() {
  return (
    <LegalLayout title="Termini di servizio">
      <p>
        CheckTarga.it fornisce report informativi sullo storico dei veicoli. I dati provengono da
        fonti terze e possono non essere esaustivi al 100%.
      </p>
      <p>
        L&apos;acquisto di un pacchetto crediti consente di generare uno o più report secondo il
        piano scelto. I crediti non utilizzati restano associati all&apos;account per 12 mesi.
      </p>
      <p>
        Il servizio non sostituisce una perizia meccanica o una consulenza legale. L&apos;utente
        resta responsabile delle decisioni di acquisto.
      </p>
    </LegalLayout>
  );
}
