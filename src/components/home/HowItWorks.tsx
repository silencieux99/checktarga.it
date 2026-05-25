import Container from "@/components/Container";

const STEPS = [
  {
    name: "Inserisci targa o VIN",
    description: "Digita la targa italiana o il numero di telaio del veicolo che vuoi controllare.",
  },
  {
    name: "Scegli il pacchetto",
    description: "Consulta l'anteprima e seleziona il numero di report di cui hai bisogno.",
  },
  {
    name: "Ricevi il report",
    description: "Paga in sicurezza con Stripe e accedi subito all'area personale.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <Container className="px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">Come funziona</h2>
          <p className="mx-auto max-w-xl text-slate-600">
            Tre passaggi semplici per verificare un&apos;auto usata prima di acquistarla.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.name} className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {index + 1}
              </div>
              <h3 className="mb-2 font-semibold text-slate-900">{step.name}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
