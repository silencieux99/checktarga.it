"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  Plus,
  X,
  Zap,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReportsList from "@/components/account/ReportsList";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { SITE } from "@/lib/pricing";
import { formatItalianPlate, validatePlate, validateVin } from "@/lib/vehicle";

export default function AccountClient() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { credits, loading: creditsLoading, refresh: refreshCredits } = useCredits();

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [searchType, setSearchType] = useState<"plate" | "vin">("plate");
  const [searchValue, setSearchValue] = useState("");
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);
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
    setGeneratedPdfUrl(null);
    setIsGenerating(false);
  };

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    const value = searchValue.trim();
    const error =
      searchType === "plate" ? validatePlate(value) : validateVin(value.replace(/\s/g, ""));

    if (error) {
      setGenerateError(error);
      inputRef.current?.focus();
      return;
    }

    if (!user) return;

    setIsGenerating(true);
    setGenerateError(null);
    setShowTerminal(true);
    setTerminalLogs([]);
    setGeneratedPdfUrl(null);

    const cleaned = value.replace(/[\s-]/g, "").toUpperCase();

    try {
      setTerminalLogs((prev) => [...prev, "> Avvio generazione report..."]);
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTerminalLogs((prev) => [...prev, "> Verifica crediti disponibili..."]);
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTerminalLogs((prev) => [...prev, "> Ricerca dati veicolo (Italia)..."]);

      const token = await user.getIdToken();
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

      setTerminalLogs((prev) => [...prev, "> Dati veicolo recuperati"]);
      await new Promise((resolve) => setTimeout(resolve, 400));

      setTerminalLogs((prev) => [...prev, "> Analisi e generazione PDF..."]);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTerminalLogs((prev) => [...prev, "> PDF salvato su cloud"]);
      setTerminalLogs((prev) => [...prev, "> Report pronto!"]);

      if (data.pdfUrl) {
        setGeneratedPdfUrl(data.pdfUrl);
        await refreshCredits();
        setReportsRefreshKey((key) => key + 1);
      } else {
        throw new Error("URL PDF non disponibile");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore imprevisto";
      setGenerateError(message);
      setTerminalLogs((prev) => [...prev, `> ERRORE: ${message}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600">Caricamento del tuo account...</p>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || user.email?.split("@")[0] || "Utente";

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-slate-50 to-blue-50 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  Ciao {displayName} 👋
                </h1>
                <p className="text-slate-600">Gestisci i tuoi crediti e genera report veicolo.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {creditsLoading ? "..." : credits} credit{credits === 1 ? "o" : "i"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Esci
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Genera un nuovo report</h2>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Inserisci targa italiana o VIN per ottenere lo storico completo del veicolo.
                  </p>
                </div>
                <Zap className="hidden sm:block h-8 w-8 text-blue-200" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Car className="h-5 w-5 text-blue-200 mr-2" />
                    <span className="font-medium text-sm">Per targa</span>
                  </div>
                  <p className="text-blue-100 text-xs">Es. AB123CD</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-blue-200 mr-2" />
                    <span className="font-medium text-sm">Per VIN</span>
                  </div>
                  <p className="text-blue-100 text-xs">17 caratteri alfanumerici</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGenerateModal(true)}
                disabled={creditsLoading || credits <= 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-blue-600 font-semibold py-4 hover:bg-blue-50 disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
                Genera report
              </button>

              {!creditsLoading && credits <= 0 && (
                <p className="text-blue-200 text-sm mt-3 text-center">
                  Nessun credito disponibile.{" "}
                  <Link href="/prezzi" className="underline font-medium text-white">
                    Acquista un pacchetto
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Azioni rapide</h3>
              <div className="space-y-3">
                <Link
                  href="/prezzi"
                  className="flex w-full items-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Acquista crediti
                </Link>
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="flex w-full items-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Mail className="h-4 w-4 mr-3" />
                  Assistenza
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Statistiche</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Crediti disponibili</span>
                  <span className="text-lg font-bold text-blue-600">
                    {creditsLoading ? "..." : credits}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Email account</span>
                  <span className="font-medium text-slate-900 truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">I miei report</h2>
            <button
              type="button"
              onClick={() => setShowGenerateModal(true)}
              disabled={credits <= 0}
              className="hidden sm:inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuovo report
            </button>
          </div>
          <ReportsList refreshKey={reportsRefreshKey} />
        </div>
      </div>

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0"
            onClick={resetGenerateModal}
          />

          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl">
            <div className="flex justify-center pt-3 pb-2 sm:hidden">
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
            </div>

            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Nuovo report</h3>
                <p className="text-sm text-slate-500">Cerca per targa o VIN</p>
              </div>
              <button
                type="button"
                onClick={resetGenerateModal}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            </div>

            {showTerminal ? (
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-green-400 min-h-[180px] max-h-[240px] overflow-y-auto">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex items-center gap-2 mt-2 text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      In corso...
                    </div>
                  )}
                </div>

                {generateError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {generateError}
                  </div>
                )}

                {generatedPdfUrl && !isGenerating && (
                  <a
                    href={generatedPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    Scarica il report PDF
                  </a>
                )}

                <button
                  type="button"
                  onClick={resetGenerateModal}
                  className="w-full py-3 rounded-lg border border-slate-300 text-slate-700"
                >
                  {generatedPdfUrl ? "Chiudi" : "Annulla"}
                </button>
              </div>
            ) : (
            <form onSubmit={handleGenerate} className="px-6 py-5 space-y-5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchType("plate");
                    setSearchValue("");
                    setGenerateError(null);
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium ${
                    searchType === "plate"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  Targa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchType("vin");
                    setSearchValue("");
                    setGenerateError(null);
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium ${
                    searchType === "vin"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  VIN
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {searchType === "plate" ? "Targa italiana" : "Numero di telaio (VIN)"}
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  maxLength={searchType === "plate" ? 9 : 17}
                />
              </div>

              {generateError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {generateError}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                Costo: 1 credito. Crediti rimanenti: {creditsLoading ? "..." : credits}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetGenerateModal}
                  className="flex-1 py-3 rounded-lg border border-slate-300 text-slate-700"
                  disabled={isGenerating}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !searchValue.trim() || credits <= 0}
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Avvio...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Genera
                    </>
                  )}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
