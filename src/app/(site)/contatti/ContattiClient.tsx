"use client";

import { FormEvent, useState } from "react";
import Container from "@/components/Container";
import LegalCompanyBlock from "@/components/legal/LegalCompanyBlock";
import PrivateServiceDisclaimer from "@/components/legal/PrivateServiceDisclaimer";
import { COMPANY } from "@/lib/company";
import { SITE } from "@/lib/pricing";

export default function ContattiClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore durante l'invio");
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Contatti
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Contatta {COMPANY.legalName} per assistenza, informazioni sul servizio o richieste
            relative al tuo account.
          </p>

          <div className="mt-8 space-y-8">
            <LegalCompanyBlock />
            <PrivateServiceDisclaimer />

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-950">Scrivici</h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Messaggio</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && (
                  <p className="text-sm text-emerald-700">
                    Messaggio inviato. Ti risponderemo al più presto.
                  </p>
                )}
                <button type="submit" disabled={loading} className="btn-accent disabled:opacity-60">
                  {loading ? "Invio in corso..." : "Invia messaggio"}
                </button>
              </form>
              <p className="mt-4 text-sm text-slate-600">
                Oppure scrivi direttamente a{" "}
                <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-brand-accent underline">
                  {SITE.supportEmail}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
