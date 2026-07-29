import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import TermsOfServiceContent from "@/components/legal/TermsOfServiceContent";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Condizioni generali di vendita",
  description:
    "Condizioni generali di vendita di CheckTarga.it gestito da MG COMPANY DAYA LTD: pacchetti report, pagamenti, recesso e responsabilità.",
  path: "/termini",
});

export default function TerminiPage() {
  return (
    <LegalLayout title="Condizioni generali di vendita">
      <TermsOfServiceContent />
    </LegalLayout>
  );
}
