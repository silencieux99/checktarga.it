"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formatPrice,
  formatSubscriptionIntroLabel,
  getPlanBySku,
  isSubscriptionPlan,
} from "@/lib/pricing";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import PageLoader from "@/components/PageLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import StripeCheckoutForm from "@/components/checkout/StripeCheckoutForm";
import SubscriptionTerms from "@/components/checkout/SubscriptionTerms";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sku = searchParams.get("sku");
  const vehicle = searchParams.get("value") || "";
  const vehicleType = searchParams.get("type") || "plate";

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [acceptedSubscriptionRenewal, setAcceptedSubscriptionRenewal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "payment">("email");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const plan = sku ? getPlanBySku(sku) : undefined;
  const subscriptionPlan = isSubscriptionPlan(plan) ? plan : null;

  useEffect(() => {
    if (!sku || !plan || plan.visible === false) router.replace("/prezzi");
  }, [sku, plan, router]);

  const preparePayment = async () => {
    let hasError = false;

    if (!acceptedTerms) {
      setTermsError(true);
      hasError = true;
    } else {
      setTermsError(false);
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (hasError || !plan) return;
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

  const amountLabel = subscriptionPlan
    ? formatSubscriptionIntroLabel(subscriptionPlan)
    : formatPrice(plan.price);

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
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent">
            <ShieldCheck className="w-4 h-4" />
            Pagamento sicuro Stripe
          </div>
          <h1 className="display-heading text-2xl sm:text-3xl">Completa il tuo ordine</h1>
        </div>

        <div className="card-surface mb-6 p-6">
          <h2 className="font-semibold text-slate-900">{plan.name}</h2>
          <p className="text-sm text-slate-600 mt-1">{plan.description}</p>
          <p className="mt-4 text-2xl font-bold text-slate-900">{amountLabel}</p>
          {vehicle && (
            <p className="text-xs text-slate-500 mt-3">
              Veicolo: {vehicleType === "plate" ? "Targa" : "VIN"} {vehicle}
            </p>
          )}
        </div>

        <div className="mt-6">
          {step === "email" ? (
            <div className="card-surface space-y-4 p-6">
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

              <label
                className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  termsError
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (termsError) setTermsError(false);
                  }}
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-accent focus:ring-brand-accent/30"
                />
                <span className="text-sm leading-relaxed text-slate-600">
                  Ho letto e accetto le{" "}
                  <Link
                    href="/termini"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-accent underline underline-offset-2 hover:text-brand-accent-hover"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Condizioni generali di vendita
                  </Link>{" "}
                  e l&apos;{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-accent underline underline-offset-2 hover:text-brand-accent-hover"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Informativa privacy
                  </Link>
                  .
                </span>
              </label>
              {termsError && (
                <p className="text-sm text-red-600">
                  Devi accettare i termini per continuare.
                </p>
              )}

              <button
                type="button"
                onClick={preparePayment}
                disabled={loading || !acceptedTerms}
                className="btn-accent w-full disabled:opacity-60"
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
            <div className="card-surface space-y-4 p-6">
              <div className="rounded-xl border border-brand-accent/20 bg-emerald-50 px-4 py-3 text-sm text-brand">
                <span className="font-medium">Email:</span> {email}
              </div>

              {subscriptionPlan && (
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-950">Riepilogo dell’offerta</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        Oggi paghi: {formatPrice(subscriptionPlan.subscription.introPrice)}
                      </p>
                    </div>
                    <Link
                      href="/abbonamento"
                      className="text-sm font-semibold text-brand-accent underline underline-offset-2 hover:text-brand-accent-hover"
                    >
                      Dettagli abbonamento
                    </Link>
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm text-slate-900">
                    <p>Include: 1 report immediato</p>
                    <p>
                      Dopo 3 giorni: abbonamento mensile a{" "}
                      {formatPrice(subscriptionPlan.subscription.recurringPrice)}/mese
                    </p>
                    <p>Rinnovo automatico fino alla disdetta</p>
                    <p>Puoi annullare in qualsiasi momento dal tuo account</p>
                  </div>
                </div>
              )}

              {clientSecret && orderId && (
                <StripeCheckoutForm
                  clientSecret={clientSecret}
                  orderId={orderId}
                  email={email}
                  amountLabel={amountLabel}
                  isSubscription={Boolean(subscriptionPlan)}
                  subscriptionConsent={
                    subscriptionPlan
                      ? {
                          checked: acceptedSubscriptionRenewal,
                          onCheckedChange: (checked) => {
                            setAcceptedSubscriptionRenewal(checked);
                          },
                        }
                      : undefined
                  }
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

        {subscriptionPlan && (
          <div className="mt-8 border-t border-slate-100 pt-4">
            <SubscriptionTerms plan={subscriptionPlan} variant="finePrint" />
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
