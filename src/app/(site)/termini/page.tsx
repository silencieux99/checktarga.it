import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import TermsOfServiceContent from "@/components/legal/TermsOfServiceContent";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Termini e condizioni di utilizzo",
  description:
    "Condizioni generali di utilizzo di CheckTarga.it: abbonamenti, report veicolo, disdetta, recesso e responsabilità.",
  path: "/termini",
});

export default function TerminiPage() {
  return (
    <LegalLayout title="Condizioni di utilizzo">
      <TermsOfServiceContent />
    </LegalLayout>
  );
}
