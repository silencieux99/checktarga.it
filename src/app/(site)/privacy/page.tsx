import { LegalLayout } from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Informativa privacy">
      <p>
        Trattiamo email, dati di pagamento (tramite Stripe) e informazioni di ricerca veicolo solo
        per erogare il servizio e inviare i report acquistati.
      </p>
      <p>
        I dati sono conservati su infrastrutture cloud con accesso limitato al personale autorizzato.
        Puoi richiedere accesso, rettifica o cancellazione scrivendo a assistenza@checktarga.it.
      </p>
    </LegalLayout>
  );
}
