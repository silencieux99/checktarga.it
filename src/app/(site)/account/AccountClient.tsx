"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  HelpCircle,
  Loader2,
  LogOut,
  Plus,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReportsList from "@/components/account/ReportsList";
import SubscriptionPanel from "@/components/account/SubscriptionPanel";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { ACCOUNT_UI } from "@/lib/account-ui-text";
import { SITE } from "@/lib/pricing";
import { formatItalianPlate, validatePlate, validateVin } from "@/lib/vehicle";

export default function AccountClient() {
  const router = useRouter();
  const { user, firebaseUser, loading: authLoading, signOut } = useAuth();
  const { credits, loading: creditsLoading, refresh: refreshCredits } = useCredits();

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [searchType, setSearchType] = useState<"plate" | "vin">("plate");
  const [searchValue, setSearchValue] = useState("");
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [generatedOrderId, setGeneratedOrderId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const resetGenerateModal = () => {
    setShowGenerateModal(false);
    setSearchValue("");
    setGenerateError(null);
    setShowTerminal(false);
    setTerminalLogs([]);
    setGeneratedOrderId(null);
    setIsGenerating(false);
  };

  const handleGenerateReport = async () => {
    const value = searchValue.trim();
    const error =
      searchType === "plate" ? validatePlate(value) : validateVin(value.replace(/\s/g, ""));

    if (error) {
      setGenerateError(error);
      inputRef.current?.focus();
      return;
    }

    if (!user || !firebaseUser) return;

    setIsGenerating(true);
    setGenerateError(null);
    setShowTerminal(true);
    setTerminalLogs([]);
    setGeneratedOrderId(null);

    const cleaned = value.replace(/[\s-]/g, "").toUpperCase();

    try {
      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountGenerationStarting]);
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountCheckingCredits]);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountCreditDeducted]);

      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountCallingAPI]);

      const token = await firebaseUser.getIdToken();
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searchType, searchValue: cleaned }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.creditNotDeducted) {
          throw new Error(data.message || "Veicolo non trovato. Nessun credito scalato.");
        }
        throw new Error(data.message || data.error || "Errore durante la generazione");
      }

      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountAPISuccess]);
      await new Promise((resolve) => setTimeout(resolve, 400));

      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountAnalyzing]);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountAnalysisComplete]);

      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountGeneratingPDF]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountPDFGenerated]);

      setTerminalLogs((prev) => [...prev, ACCOUNT_UI.accountReportSuccess]);

      if (data.orderId) {
        setGeneratedOrderId(data.orderId);
        await refreshCredits();
      } else {
        throw new Error("ID report non disponibile");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore imprevisto";
      setGenerateError(message);
      setTerminalLogs((prev) => [...prev, `❌ ${message}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-brand-muted">Caricamento del tuo account...</p>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || user.email?.split("@")[0] || "Utente";
  const initials = displayName.slice(0, 2).toUpperCase();
  const hasCredits = !creditsLoading && credits > 0;

  return (
    <div className="min-h-[70vh] bg-brand-surface">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-sm font-semibold text-white sm:h-14 sm:w-14">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
                Area personale
              </p>
              <h1 className="truncate text-xl font-semibold tracking-tight text-brand sm:text-2xl">
                {displayName}
              </h1>
              <p className="truncate text-sm text-brand-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-medium text-brand-muted transition-colors hover:border-slate-300 hover:text-brand sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            Esci
          </button>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-5 lg:col-span-2">
            {/* Balance + generate hero */}
            <section className="relative overflow-hidden rounded-3xl bg-brand p-6 text-white sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-accent/20 blur-3xl"
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Crediti disponibili
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-5xl font-semibold tabular-nums tracking-tight">
                        {creditsLoading ? "—" : credits}
                      </span>
                      <span className="text-sm text-slate-400">
                        credit{credits === 1 ? "o" : "i"}
                      </span>
                    </div>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-5 w-5 text-brand-accent" />
                  </span>
                </div>

                <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-300">
                  Inserisci una targa italiana o un VIN per ottenere lo storico disponibile del
                  veicolo in pochi secondi.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(true)}
                    disabled={creditsLoading || credits <= 0}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-accent px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Genera report
                  </button>
                  {!hasCredits && !creditsLoading && (
                    <Link
                      href="/prezzi"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      Acquista crediti
                    </Link>
                  )}
                </div>

                {!creditsLoading && credits <= 0 && (
                  <p className="mt-3 text-xs text-slate-400">
                    Nessun credito disponibile. Acquista un pacchetto per generare un report.
                  </p>
                )}
              </div>
            </section>

            {/* Reports */}
            <section className="card-surface p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-brand">{ACCOUNT_UI.accountMyReports}</h2>
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(true)}
                  disabled={credits <= 0}
                  className="hidden items-center gap-2 rounded-xl border border-brand-border px-4 py-2 text-sm font-medium text-brand-muted transition-colors hover:border-slate-300 hover:text-brand disabled:opacity-50 sm:inline-flex"
                >
                  <Plus className="h-4 w-4" />
                  {ACCOUNT_UI.accountNewReport}
                </button>
              </div>
              <ReportsList />
            </section>
          </div>

          {/* Side column */}
          <aside className="space-y-5">
            <SubscriptionPanel />

            <section className="card-surface p-5 sm:p-6">
              <h3 className="mb-4 text-sm font-semibold text-brand">Azioni rapide</h3>
              <div className="space-y-2.5">
                <Link
                  href="/prezzi"
                  className="flex items-center gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm font-medium text-brand-muted transition-colors hover:border-brand-accent/40 hover:bg-brand-accent/[0.04] hover:text-brand"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                    <CreditCard className="h-4 w-4" />
                  </span>
                  Acquista crediti
                </Link>
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="flex items-center gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm font-medium text-brand-muted transition-colors hover:border-brand-accent/40 hover:bg-brand-accent/[0.04] hover:text-brand"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  Assistenza
                </a>
              </div>
            </section>

            <section className="card-surface p-5 sm:p-6">
              <h3 className="mb-4 text-sm font-semibold text-brand">Dettagli account</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-brand-muted">Crediti</dt>
                  <dd className="font-semibold tabular-nums text-brand">
                    {creditsLoading ? "…" : credits}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-brand-border pt-3">
                  <dt className="text-brand-muted">Email</dt>
                  <dd className="max-w-[180px] truncate font-medium text-brand">{user.email}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>

      {/* Generate modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-brand/50 backdrop-blur-sm"
            onClick={resetGenerateModal}
          />

          <div className="absolute bottom-0 left-0 right-0 flex max-h-[92vh] flex-col rounded-t-3xl bg-white shadow-2xl sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:right-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-12 rounded-full bg-slate-300" />
            </div>

            <div className="flex items-center justify-between border-b border-brand-border px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-brand">
                  {ACCOUNT_UI.accountNewReport}
                </h3>
                <p className="text-sm text-brand-muted">{ACCOUNT_UI.accountSearchVehicle}</p>
              </div>
              <button
                type="button"
                onClick={resetGenerateModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {showTerminal && (
                <div className="rounded-2xl bg-brand p-4 font-mono text-sm">
                  <div className="mb-3 flex items-center">
                    <div className="flex space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="ml-3 text-slate-400">Generazione report</span>
                  </div>
                  <div className="space-y-1">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className="text-emerald-400">
                        <span className="text-slate-500">$</span> {log}
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="text-emerald-400">
                        <span className="text-slate-500">$</span>{" "}
                        <span className="animate-pulse">▋</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {generatedOrderId && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-emerald-900">
                        {ACCOUNT_UI.accountReportGeneratedSuccess}
                      </h4>
                      <p className="mt-1 text-sm text-emerald-700">
                        {ACCOUNT_UI.accountReportAddedToAccount}
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push(`/informe/${generatedOrderId}`)}
                        className="btn-accent mt-3 w-full"
                      >
                        <Eye className="h-4 w-4" />
                        {ACCOUNT_UI.accountViewMyReport}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {generateError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {generateError}
                </div>
              )}

              {!showTerminal && (
                <>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-brand">
                      {ACCOUNT_UI.accountSearchType}
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchType("plate");
                          setSearchValue("");
                          setGenerateError(null);
                        }}
                        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          searchType === "plate"
                            ? "border-brand-accent bg-brand-accent/[0.06] text-brand-accent"
                            : "border-brand-border bg-white text-brand-muted hover:border-slate-300"
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Car className="h-4 w-4" />
                          {ACCOUNT_UI.accountPlate}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchType("vin");
                          setSearchValue("");
                          setGenerateError(null);
                        }}
                        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          searchType === "vin"
                            ? "border-brand-accent bg-brand-accent/[0.06] text-brand-accent"
                            : "border-brand-border bg-white text-brand-muted hover:border-slate-300"
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <FileText className="h-4 w-4" />
                          {ACCOUNT_UI.accountVIN}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand">
                      {searchType === "plate"
                        ? ACCOUNT_UI.accountPlateNumber
                        : ACCOUNT_UI.accountVINNumber}
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchValue}
                      onChange={(event) => {
                        const value =
                          searchType === "plate"
                            ? formatItalianPlate(event.target.value)
                            : event.target.value.toUpperCase();
                        setSearchValue(value);
                        if (generateError) setGenerateError(null);
                      }}
                      placeholder={searchType === "plate" ? "AB 123 CD" : "VF1234567890ABCDEF"}
                      className="w-full rounded-xl border border-brand-border px-4 py-3 font-mono text-base text-brand outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                      maxLength={searchType === "plate" ? 9 : 17}
                    />
                    {searchType === "vin" && (
                      <p className="mt-1.5 text-xs text-brand-muted">
                        {ACCOUNT_UI.accountVINCharacters}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-surface p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                      <CreditCard className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-brand">
                        {ACCOUNT_UI.accountReportCost}
                      </h4>
                      <p className="mt-0.5 text-sm text-brand-muted">
                        {ACCOUNT_UI.accountOneCreditFromAccount}
                      </p>
                      <p className="mt-1 text-xs font-medium text-brand-accent">
                        {ACCOUNT_UI.accountCreditsRemaining.replace(
                          "{credits}",
                          creditsLoading ? "…" : String(credits)
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!showTerminal && (
              <div className="flex gap-3 border-t border-brand-border bg-brand-surface px-6 py-4 [padding-bottom:max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={resetGenerateModal}
                  disabled={isGenerating}
                  className="flex-1 rounded-xl border border-brand-border bg-white py-3 text-sm font-medium text-brand-muted transition-colors hover:text-brand disabled:opacity-60"
                >
                  {ACCOUNT_UI.accountCancel}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={isGenerating || !searchValue.trim() || credits <= 0}
                  className="btn-accent flex-1 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {ACCOUNT_UI.loadingGenerating}
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      {ACCOUNT_UI.actionGenerate}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
