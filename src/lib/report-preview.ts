export interface ReportPreviewQuery {
  type: "plate" | "vin";
  value: string;
  cleanValue: string;
  displayValue: string;
}

export function parseReportPreviewQuery(
  rawValue: string,
  type: "plate" | "vin"
): ReportPreviewQuery {
  const clean = rawValue.replace(/[\s-]/g, "").toUpperCase().trim();
  const displayValue =
    type === "vin" ? formatVinDisplay(clean) : formatItalianPlateDisplay(rawValue || clean);

  return {
    type,
    value: rawValue.trim() || clean,
    cleanValue: clean,
    displayValue,
  };
}

export function formatVinDisplay(value: string): string {
  const clean = value.replace(/[\s-]/g, "").toUpperCase();
  if (clean.length > 11) return `${clean.slice(0, 8)}…${clean.slice(-3)}`;
  return clean;
}

export function formatItalianPlateDisplay(value: string): string {
  const clean = value.replace(/[\s-]/g, "").toUpperCase();
  if (!clean) return "";
  if (clean.length <= 2) return clean;
  if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`;
  return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 7)}`;
}

export function maskVin(value: string): string {
  const clean = value.replace(/[\s-]/g, "").toUpperCase();
  if (clean.length <= 7) return "···· ····";
  return `${clean.slice(0, 4)} ···· ${clean.slice(-3)}`;
}
