export default function AccountPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Area personale</h1>
        <p className="text-slate-600 mb-8">
          Dopo il pagamento riceverai le credenziali via email per accedere e generare i tuoi
          report veicolo. Se hai già un account, effettua il login con quelle credenziali.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900 mb-2">Come funziona</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
            <li>Completa il pagamento con Stripe</li>
            <li>Ricevi email con accesso e crediti disponibili</li>
            <li>Inserisci targa o VIN per generare il report completo</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
