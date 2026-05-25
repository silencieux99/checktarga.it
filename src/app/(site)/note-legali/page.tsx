import { LegalLayout } from "@/components/LegalLayout";

export default function NoteLegaliPage() {
  return (
    <LegalLayout title="Note legali">
      <p>
        Editor del sito: CheckTarga.it — contatto: assistenza@checktarga.it
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
