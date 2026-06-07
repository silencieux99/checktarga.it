"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { formatItalianPlate, validatePlate, validateVin } from "@/lib/vehicle";

interface VehicleSearchFormProps {
  ctaLabel?: string;
  className?: string;
  compact?: boolean;
}

export default function VehicleSearchForm({
  ctaLabel = "Verifica veicolo",
  className = "",
  compact = false,
}: VehicleSearchFormProps) {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"plate" | "vin">("plate");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (raw: string) => {
    setValue(searchType === "plate" ? formatItalianPlate(raw) : raw.toUpperCase());
    if (error) setError("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = searchType === "plate" ? validatePlate(value) : validateVin(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const param = searchType === "plate" ? "plate" : "vin";
    router.push(`/anteprima-report?type=${param}&value=${encodeURIComponent(value.trim())}`);
  };

  return (
    <div className={`card-surface overflow-hidden ${compact ? "" : "shadow-card-lg"} ${className}`}>
      <div className="flex border-b border-brand-border">
        {(["plate", "vin"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setSearchType(type);
              setValue("");
              setError("");
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              searchType === type
                ? "border-b-2 border-brand-accent bg-emerald-50/50 text-brand-accent"
                : "text-brand-muted hover:text-brand"
            }`}
          >
            {type === "plate" ? "Targa" : "Numero VIN"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className={compact ? "p-4" : "p-5 sm:p-6"}>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={searchType === "plate" ? "AB 123 CD" : "ZFA31200001234567"}
          maxLength={searchType === "vin" ? 17 : 10}
          className="mb-3 w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-3.5 text-center text-lg font-semibold uppercase tracking-wide text-brand placeholder:text-slate-300 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
        />

        {error && (
          <div className="mb-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analisi in corso...
            </>
          ) : (
            <>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
