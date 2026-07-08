import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/pricing";

export const metadata: Metadata = buildPageMetadata({
  title: "Note legali",
  description: "Note legali, editor del sito e informazioni sull'hosting di CheckTarga.it.",
  path: "/note-legali",
});

export default function NoteLegaliPage() {
  return (
    <LegalLayout title="Note legali">
      <p>
        Editor del sito: CheckTarga.it — contatto: {SITE.supportEmail}
      </p>
      <p>
        Hosting: Vercel Inc. Pagamenti: Stripe Payments Europe Ltd.
      </p>
      <p>
        Marchi e loghi citati appartengono ai rispettivi proprietari. CheckTarga non è affiliato
        al PRA o ad enti governativi italiani.
      </p>
    </LegalLayout>
  );
}
