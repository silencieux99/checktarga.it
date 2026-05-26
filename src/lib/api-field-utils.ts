import type { InternationalVehicleData, TyreSpec } from "./international-api";

export function displayApiValue(value?: string | number | null): string {
  if (value === null || value === undefined) return "Non disponibile";
  const str = String(value).trim();
  if (str === "") return "Non disponibile";
  return str;
}

export function hasApiValue(value?: string | number | null): boolean {
  if (value === null || value === undefined) return false;
  return String(value).trim() !== "";
}

export function extractRegistrationYear(data: InternationalVehicleData): string | undefined {
  const fr = data.date1erCir_fr?.trim();
  if (fr) {
    if (fr.includes("/")) {
      const parts = fr.split("/");
      return parts[2] || parts[parts.length - 1];
    }
    if (fr.includes("-")) {
      const parts = fr.split("-");
      if (parts[0]?.length === 4) return parts[0];
      return parts[2];
    }
    return fr;
  }

  if (data.date1erCir_us) {
    return data.date1erCir_us.split("-")[0];
  }

  return data.debut_modele?.split("-")[0];
}

export function formatGearbox(code?: string): string {
  if (!hasApiValue(code)) return "Non disponibile";
  const normalized = String(code).toUpperCase();
  if (normalized === "M") return "Manuale";
  if (normalized === "S" || normalized === "A") return "Automatico";
  return String(code);
}

export function formatTyreSpec(tyre: TyreSpec, index: number): string {
  const label = tyre.name || `${tyre.width}/${tyre.height} R ${tyre.diameter}`;
  const load = tyre.load_index ? ` ${tyre.load_index}` : "";
  const speed = tyre.speed_index || "";
  return `${label}${load}${speed}`.trim();
}

export function formatTyreItems(pneus?: TyreSpec[]) {
  if (!pneus?.length) return [];
  return pneus.map((tyre, index) => ({
    label: `Pneumatico ${index + 1}`,
    value: formatTyreSpec(tyre, index),
    flag: "ok" as const,
  }));
}
