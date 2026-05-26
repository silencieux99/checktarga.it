import {
  getVehicleByPlate,
  getVehicleByVIN,
  type InternationalVehicleData,
} from "./international-api";

export function formatItalianPlate(raw: string): string {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
  if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)}`;
}

export function validatePlate(plate: string): string | null {
  const cleaned = plate.replace(/[\s-]/g, "").toUpperCase();
  if (!cleaned) return "Inserisci una targa italiana";
  if (!/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(cleaned)) {
    return "Formato targa non valido (es. AB123CD)";
  }
  return null;
}

export function validateVin(vin: string): string | null {
  const cleaned = vin.replace(/[\s-]/g, "").toUpperCase();
  if (!cleaned) return "Inserisci un numero di telaio (VIN)";
  if (!/^[A-HJ-NPR-Z0-9]{11,17}$/.test(cleaned)) {
    return "VIN non valido (11-17 caratteri alfanumerici)";
  }
  return null;
}

export function cleanQuery(value: string, type: "plate" | "vin"): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

export interface VehiclePreview {
  found: boolean;
  marca?: string;
  modello?: string;
  versione?: string;
  anno?: string;
  carburante?: string;
  potenza?: string;
  colore?: string;
  targa?: string;
  vin?: string;
  error?: string;
}

function mapToVehiclePreview(
  data: InternationalVehicleData,
  query: string,
  type: "plate" | "vin"
): VehiclePreview {
  if (data.erreur) {
    return {
      found: false,
      targa: type === "plate" ? query : data.immat || data.plaque,
      vin: type === "vin" ? query : data.vin,
    };
  }

  const year =
    data.date1erCir_fr?.split("-")[2] ||
    data.date1erCir_fr?.split("/")[2] ||
    data.date1erCir_us?.split("-")[0] ||
    data.debut_modele;

  return {
    found: true,
    marca: data.marque,
    modello: data.modele,
    versione: data.version || data.modele_en,
    anno: year,
    carburante: data.energieNGC || data.energie,
    potenza: data.puisFiscReelCH || (data.puisFisc ? `${data.puisFisc} CV` : undefined),
    colore: data.couleur,
    targa: data.immat || data.plaque || (type === "plate" ? query : undefined),
    vin: data.vin || data.numero_serie || (type === "vin" ? query : undefined),
  };
}

export async function lookupVehicle(
  query: string,
  type: "plate" | "vin"
): Promise<VehiclePreview> {
  const cleaned = cleanQuery(query, type);

  const data =
    type === "plate"
      ? await getVehicleByPlate(cleaned, "IT")
      : await getVehicleByVIN(cleaned);

  const preview = mapToVehiclePreview(data, cleaned, type);

  if (!preview.found) {
    return {
      ...preview,
      error: data.erreur || "Veicolo non trovato",
    };
  }

  return preview;
}

export type { InternationalVehicleData } from "./international-api";
export { getVehicleByPlate, getVehicleByVIN } from "./international-api";
