"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  AlertTriangle,
  Bolt,
  Check,
  CheckCircle2,
  ClipboardCopy,
  CreditCard,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Container from "@/components/Container";
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
  { icon: CreditCard, label: "Verifica del pagamento" },
  { icon: ShieldCheck, label: "Sicurezza della transazione" },
  { icon: Bolt, label: "Aggiunta crediti" },
  { icon: Mail, label: "Invio conferma email" },
];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10">
            <div className="w-12 h-12 mx-auto mb-6 bg-slate-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>

            <h2 className="text-xl font-bold text-center text-slate-900 mb-8">
              Finalizzazione del tuo ordine
            </h2>

            <div className="space-y-4 mb-8">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStep;
                const isComplete = index < currentStep;

                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-slate-900" : "bg-slate-100"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isActive ? "text-slate-900 font-medium" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-sm text-slate-500 animate-pulse">
              Attendere prego, non chiudere questa pagina...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10">
            <div className="w-12 h-12 mx-auto mb-6 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-center text-slate-900 mb-4">Ops!</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <p className="text-center text-slate-600 text-sm mb-8">
              Non preoccuparti: se il pagamento è andato a buon fine, i crediti arriveranno via email.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium"
            >
              Riprova
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-6 bg-slate-900 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {result.newAccount ? "Benvenuto su CheckTarga!" : "Pagamento confermato"}
            </h1>
            <p className="text-lg text-slate-600">
              {result.newAccount
                ? "Il tuo account è attivo e i crediti sono pronti."
                : "I crediti sono stati aggiunti istantaneamente al tuo account."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-500 mb-4">Riepilogo</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Prodotto</span>
                  <span className="font-bold text-slate-900">{result.productName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Importo pagato</span>
                  <span className="font-bold text-slate-900">{result.amount.toFixed(2)} €</span>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between gap-4">
                  <span className="text-slate-600">Crediti aggiunti</span>
                  <span className="text-2xl font-bold text-slate-900">+{result.creditsAdded}</span>
                </div>
              </div>
              <div className="mt-6 bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Saldo totale</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{result.totalCredits}</span>
                  <span className="text-xs text-slate-400">crediti</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-500 mb-4">
                {result.emailSent ? "Email inviata" : "Email in corso"}
              </h2>
              {result.emailSent ? (
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-900 font-medium">Conferma inviata</p>
                    <p className="text-xs text-slate-500 mt-1">Ricevuta inviata a {customerEmail}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-amber-800">Email in elaborazione...</p>
                  <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-700">
                    Controlla anche la cartella spam se non la trovi entro qualche minuto.
                  </div>
                </div>
              )}
            </div>
          </div>

          {result.newAccount && result.password && customerEmail && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8">
              <h2 className="text-sm font-semibold text-slate-500 mb-6">I tuoi accessi</h2>
              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <label className="text-xs font-medium text-slate-500 mb-2 block">Email</label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-900 flex-1">{customerEmail}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(customerEmail, "email")}
                      className="p-1.5 hover:bg-slate-100 rounded-lg"
                    >
                      {copiedField === "email" ? (
                        <Check className="w-4 h-4 text-slate-900" />
                      ) : (
                        <ClipboardCopy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <label className="text-xs font-medium text-slate-500 mb-2 block">Password</label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-900 flex-1">
                      {showPassword ? result.password : "••••••••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.password!, "password")}
                      className="p-1.5 hover:bg-slate-100 rounded-lg"
                    >
                      {copiedField === "password" ? (
                        <Check className="w-4 h-4 text-slate-900" />
                      ) : (
                        <ClipboardCopy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                Conserva queste credenziali. Potrai cambiarle dall&apos;area personale.
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-blue-950 mb-2">Prossimo passo</h3>
            <p className="text-sm text-blue-900/90 leading-relaxed mb-6">
              Vai all&apos;area personale per generare il tuo primo report completo con targa o VIN.
            </p>
            <Link
              href="/account"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Vai all&apos;area personale
            </Link>
          </div>
        </div>
      </Container>
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
