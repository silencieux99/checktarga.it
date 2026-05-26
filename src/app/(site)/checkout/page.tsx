"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPlanBySku, formatPrice } from "@/lib/pricing";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import PageLoader from "@/components/PageLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import StripeCheckoutForm from "@/components/checkout/StripeCheckoutForm";

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
  const [step, setStep] = useState<"email" | "payment">("email");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const plan = sku ? getPlanBySku(sku) : undefined;

  useEffect(() => {
    if (!sku || !plan) router.replace("/prezzi");
  }, [sku, plan, router]);

  const preparePayment = async () => {
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

      if (!data.clientSecret || !data.orderId) {
        throw new Error("Impossibile inizializzare il pagamento");
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setStep("payment");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return <PageLoader message="Caricamento checkout..." />;
  }

  return (
    <div className="min-h-[70vh] py-10 relative">
      {loading && step === "email" && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center px-4">
          <LoadingSpinner size="lg" color="teal" />
          <p className="mt-4 text-slate-700 font-medium">Preparazione pagamento sicuro...</p>
        </div>
      )}

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

        {step === "email" ? (
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
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  emailError ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"
                } focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 disabled:opacity-60`}
              />
            </div>
            {emailError && (
              <p className="text-sm text-red-600">Inserisci un indirizzo email valido</p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="button"
              onClick={preparePayment}
              disabled={loading}
              className="w-full rounded-xl bg-teal-700 py-3.5 text-white font-semibold hover:bg-teal-800 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparazione...
                </>
              ) : (
                "Continua al pagamento"
              )}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 text-sm text-teal-900">
              <span className="font-medium">Email:</span> {email}
            </div>

            {clientSecret && orderId && (
              <StripeCheckoutForm
                clientSecret={clientSecret}
                orderId={orderId}
                email={email}
                amountLabel={formatPrice(plan.price)}
              />
            )}

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setClientSecret(null);
                setOrderId(null);
                setError(null);
              }}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Modifica email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageLoader message="Caricamento checkout..." />}>
      <CheckoutContent />
    </Suspense>
  );
}
