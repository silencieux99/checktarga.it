"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPlanBySku, formatPrice } from "@/lib/pricing";
import { Loader2, Mail, ShieldCheck } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sku = searchParams.get("sku");
  const vehicle = searchParams.get("value") || "";
  const vehicleType = searchParams.get("type") || "plate";

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = sku ? getPlanBySku(sku) : undefined;

  useEffect(() => {
    if (!sku || !plan) router.replace("/prezzi");
  }, [sku, plan, router]);

  const startCheckout = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      return;
    }
    if (!plan) return;

    setEmailError(false);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/prepare-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: plan.sku,
          email,
          vehicle,
          vehicleType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore durante il checkout");

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("URL di pagamento non disponibile");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto");
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-teal-700 text-sm font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            Pagamento sicuro Stripe
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Completa il tuo ordine</h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
          <h2 className="font-semibold text-slate-900">{plan.name}</h2>
          <p className="text-sm text-slate-600 mt-1">{plan.description}</p>
          <p className="text-2xl font-bold text-slate-900 mt-4">{formatPrice(plan.price)}</p>
          {vehicle && (
            <p className="text-xs text-slate-500 mt-3">
              Veicolo: {vehicleType === "plate" ? "Targa" : "VIN"} {vehicle}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email per ricevere l&apos;accesso al report
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(false);
              }}
              placeholder="nome@email.it"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                emailError ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"
              } focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500`}
            />
          </div>
          {emailError && (
            <p className="text-sm text-red-600">Inserisci un indirizzo email valido</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={startCheckout}
            disabled={loading}
            className="w-full rounded-xl bg-teal-700 py-3.5 text-white font-semibold hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? "Reindirizzamento a Stripe..." : "Paga con carta"}
          </button>

          <p className="text-xs text-slate-500 text-center">
            Verrai reindirizzato al checkout Stripe. Nessun dato della carta transita sui nostri
            server.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
