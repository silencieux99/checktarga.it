"use client";

import { FormEvent, useState } from "react";

interface AddCreditsModalProps {
  email: string;
  currentCredits: number;
  onClose: () => void;
  onSubmit: (payload: { mode: "add" | "set"; amount: number; note: string }) => Promise<void>;
}

export default function AddCreditsModal({
  email,
  currentCredits,
  onClose,
  onSubmit,
}: AddCreditsModalProps) {
  const [mode, setMode] = useState<"add" | "set">("add");
  const [amount, setAmount] = useState(1);
  const [note, setNote] = useState("Aggiunta manuale admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ mode, amount, note });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Gestisci crediti</h2>
        <p className="mt-1 text-sm text-slate-400">{email}</p>
        <p className="mt-2 text-sm text-slate-300">
          Saldo attuale: <span className="font-semibold text-white">{currentCredits}</span>
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("add")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                mode === "add" ? "bg-blue-600 text-white" : "bg-white/5 text-slate-300"
              }`}
            >
              Aggiungi / rimuovi
            </button>
            <button
              type="button"
              onClick={() => setMode("set")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                mode === "set" ? "bg-blue-600 text-white" : "bg-white/5 text-slate-300"
              }`}
            >
              Imposta totale
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              {mode === "set" ? "Nuovo totale crediti" : "Quantità (+ o -)"}
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Nota</label>
            <input
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-slate-300 hover:bg-white/5"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
