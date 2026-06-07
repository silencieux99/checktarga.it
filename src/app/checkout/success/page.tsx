"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ClipboardCopy,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import PageLoader from "@/components/PageLoader";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface PaymentResult {
  success: boolean;
  status: string;
  creditsAdded: number;
  totalCredits: number;
  productName: string;
  amount: number;
  newAccount?: boolean;
  password?: string | null;
  customerEmail?: string | null;
  emailSent?: boolean;
}

const STEPS = [
  "Verifica del pagamento",
  "Conferma transazione",
  "Aggiunta crediti",
  "Invio email di conferma",
];

function formatEuro(amount: number) {
  return `${amount.toFixed(2).replace(".", ",")} €`;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const { user, firebaseUser, loading: authLoading } = useAuth();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");
  const customerEmail = searchParams.get("customer_email");
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const processingStartedRef = useRef(false);

  const sessionKey = orderId
    ? `payment_processed_order_${orderId}`
    : paymentIntentId
      ? `payment_processed_pi_${paymentIntentId}`
      : `payment_processed_${sessionId}`;

  useEffect(() => {
    if (loading && currentStep < STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, currentStep]);

  const processPayment = useCallback(async () => {
    try {
      setLoading(true);

      if (typeof window !== "undefined" && sessionKey) {
        const alreadyDone = sessionStorage.getItem(sessionKey);
        if (!alreadyDone) {
          sessionStorage.setItem(sessionKey, "processing");

          const headers: HeadersInit = { "Content-Type": "application/json" };
          if (firebaseUser) {
            headers.Authorization = `Bearer ${await firebaseUser.getIdToken()}`;
          }

          await fetch("/api/process-payment-success", {
            method: "POST",
            headers,
            body: JSON.stringify({ orderId, sessionId, paymentIntentId, customerEmail }),
          });

          sessionStorage.setItem(sessionKey, "completed");
        }
      }

      let attempts = 0;
      while (attempts < 30) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch("/api/check-order-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, sessionId, paymentIntentId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.status === "COMPLETE") {
            setResult(data);
            setLoading(false);
            return;
          }
          if (data.status === "PROCESSING" || data.status === "PENDING") {
            attempts++;
            continue;
          }
        }
        attempts++;
      }

      throw new Error(
        "L'elaborazione richiede più tempo del previsto. Controlla la tua email tra qualche minuto."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }, [orderId, sessionId, paymentIntentId, customerEmail, sessionKey, user]);

  useEffect(() => {
    if (redirectStatus === "failed") {
      setError("Il pagamento non è andato a buon fine. Riprova o usa un altro metodo.");
      setLoading(false);
      return;
    }

    if ((!orderId && !sessionId && !paymentIntentId) || !customerEmail) {
      setError("Parametri di pagamento mancanti");
      setLoading(false);
      return;
    }
    if (processingStartedRef.current) return;
    processingStartedRef.current = true;
    processPayment();
  }, [orderId, sessionId, paymentIntentId, redirectStatus, customerEmail, processPayment]);

  useEffect(() => {
    if (!result || authLoading || !auth) return;
    if (!result.newAccount || !result.password) return;

    const emailRaw = (customerEmail || result.customerEmail || "").trim();
    if (!emailRaw) return;

    let cancelled = false;

    (async () => {
      try {
        if (auth.currentUser?.email?.toLowerCase() === emailRaw.toLowerCase()) return;
        if (auth.currentUser) await signOut(auth);
        if (cancelled) return;
        await signInWithEmailAndPassword(auth, emailRaw, result.password!);
      } catch (loginError) {
        console.error("[success] Autologin fallito:", loginError);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [result, customerEmail, authLoading]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const shell = (children: React.ReactNode) => (
    <div className="min-h-[100dvh] bg-white">
      <div className="mx-auto w-full max-w-md px-5 py-8 sm:py-12">
        <div className="mb-10">
          <Logo size="sm" href="/" />
        </div>
        {children}
      </div>
    </div>
  );

  if (loading) {
    return shell(
      <div>
        <div className="mb-8 flex items-center gap-3 text-slate-900">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-slate-400" />
          <h1 className="text-xl font-semibold tracking-tight">Elaborazione in corso</h1>
        </div>

        <p className="mb-8 text-sm leading-relaxed text-slate-600">
          Stiamo confermando il pagamento. Non chiudere questa pagina.
        </p>

        <ol className="space-y-4 border-t border-slate-200 pt-6">
          {STEPS.map((label, index) => {
            const done = index < currentStep;
            const active = index === currentStep;
            return (
              <li key={label} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    done
                      ? "bg-slate-900 text-white"
                      : active
                        ? "border-2 border-slate-900 text-slate-900"
                        : "border border-slate-200 text-slate-300"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                <span className={active || done ? "text-slate-900" : "text-slate-400"}>{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (error) {
    return shell(
      <div>
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Errore</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{error}</p>
        <p className="mt-3 text-sm text-slate-500">
          Se il pagamento è andato a buon fine, i crediti arriveranno via email entro pochi minuti.
        </p>
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-accent w-full"
          >
            <RefreshCw className="h-4 w-4" />
            Riprova
          </button>
          <Link href="/prezzi" className="btn-outline w-full">
            Torna ai prezzi
          </Link>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return shell(
    <div>
      <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900">
        <Check className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
        {result.newAccount ? "Account creato" : "Pagamento confermato"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {result.newAccount
          ? "I crediti sono disponibili nell'area personale."
          : "I crediti sono stati aggiunti al tuo account."}
      </p>

      <dl className="mt-10 divide-y divide-slate-200 border-t border-slate-200">
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-sm text-slate-500">Prodotto</dt>
          <dd className="text-right text-sm font-medium text-slate-900">{result.productName}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-sm text-slate-500">Importo pagato</dt>
          <dd className="text-right text-sm font-medium tabular-nums text-slate-900">
            {formatEuro(result.amount)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-sm text-slate-500">Crediti aggiunti</dt>
          <dd className="text-right text-sm font-medium tabular-nums text-slate-900">
            +{result.creditsAdded}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-sm text-slate-500">Saldo attuale</dt>
          <dd className="text-right text-base font-semibold tabular-nums text-slate-900">
            {result.totalCredits} crediti
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-sm text-slate-500">Email</dt>
          <dd className="min-w-0 text-right text-sm text-slate-900">
            <span className="break-all">{customerEmail}</span>
            {!result.emailSent && (
              <span className="mt-1 block text-xs text-slate-400">Conferma in invio…</span>
            )}
          </dd>
        </div>
      </dl>

      {result.newAccount && result.password && customerEmail && (
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-sm font-semibold text-slate-900">Accesso all&apos;account</h2>
          <p className="mt-1 text-sm text-slate-500">
            Conserva queste credenziali. Puoi modificarle dall&apos;area personale.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <div className="mt-1 flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
                <span className="min-w-0 truncate font-mono text-sm text-slate-900">
                  {customerEmail}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(customerEmail, "email")}
                  className="shrink-0 p-2 text-slate-400 hover:text-slate-900"
                  aria-label="Copia email"
                >
                  {copiedField === "email" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ClipboardCopy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500">Password</p>
              <div className="mt-1 flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
                <span className="font-mono text-sm text-slate-900">
                  {showPassword ? result.password : "••••••••••••"}
                </span>
                <div className="flex shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="p-2 text-slate-400 hover:text-slate-900"
                    aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.password!, "password")}
                    className="p-2 text-slate-400 hover:text-slate-900"
                    aria-label="Copia password"
                  >
                    {copiedField === "password" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ClipboardCopy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mt-10 space-y-3 border-t border-slate-200 pt-8">
        <Link href="/account" className="btn-accent w-full">
          Vai all&apos;area personale
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn-outline w-full">
          Torna al sito
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        Pagamento elaborato tramite Stripe
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<PageLoader fullScreen message="Caricamento..." />}>
      <SuccessContent />
    </Suspense>
  );
}
