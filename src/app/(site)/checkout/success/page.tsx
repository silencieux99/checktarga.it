"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const email = searchParams.get("customer_email");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const finalize = async () => {
      try {
        const res = await fetch("/api/process-payment-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, sessionId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCredits(data.creditsAdded ?? null);
        setStatus("ok");
      } catch {
        setStatus("error");
      }
    };

    if (orderId || sessionId) finalize();
    else setStatus("error");
  }, [orderId, sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-lg mx-auto px-4 text-center">
        {status === "ok" ? (
          <>
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Pagamento confermato</h1>
            <p className="text-slate-600 mb-6">
              {credits
                ? `Hai ricevuto ${credits} crediti report.`
                : "Il tuo ordine è stato registrato correttamente."}
              {email ? ` Controlla la casella ${email}.` : ""}
            </p>
            <Link
              href="/account"
              className="inline-flex rounded-xl bg-teal-700 px-6 py-3 text-white font-semibold hover:bg-teal-800"
            >
              Vai all&apos;area personale
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifica in corso</h1>
            <p className="text-slate-600 mb-6">
              Se hai appena pagato, attendi qualche istante e controlla la tua email.
            </p>
            <Link href="/account" className="text-teal-700 font-semibold hover:underline">
              Area personale
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SuccessContent />
    </Suspense>
  );
}
