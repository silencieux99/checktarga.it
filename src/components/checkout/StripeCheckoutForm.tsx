"use client";

import { FormEvent, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface StripeCheckoutFormProps {
  clientSecret: string;
  orderId: string;
  email: string;
  amountLabel: string;
  isSubscription?: boolean;
}

function PaymentForm({
  clientSecret,
  orderId,
  email,
  amountLabel,
  isSubscription = false,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError(null);

    const siteUrl = window.location.origin;
    const returnUrl = `${siteUrl}/checkout/success?order_id=${encodeURIComponent(orderId)}&customer_email=${encodeURIComponent(email)}`;

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (stripeError) {
      setError(stripeError.message || "Errore durante il pagamento");
      setIsSubmitting(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="text-center py-6 text-sm text-slate-500">
        Preparazione del pagamento sicuro...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "apple_pay", "google_pay"],
          }}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="btn-accent w-full disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Pagamento in corso...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Paga {amountLabel}
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 text-center">
        {isSubscription
          ? "Confermando il pagamento autorizzi il salvataggio sicuro della carta tramite Stripe per il rinnovo automatico dopo 48 ore. Puoi annullare dall'area personale."
          : "Pagamento elaborato da Stripe. I dati della carta non transitano sui nostri server."}
      </p>
    </form>
  );
}

export default function StripeCheckoutForm(props: StripeCheckoutFormProps) {
  if (!stripePromise) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Stripe non configurato (chiave pubblica mancante).
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#059669",
            colorText: "#0f172a",
            borderRadius: "12px",
          },
        },
        locale: "it",
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
}
