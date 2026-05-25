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
  const cleaned = value.replace(/[\s-]/g, "").toUpperCase();
  return type === "plate" ? cleaned : cleaned;
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
}

export async function lookupVehicle(query: string, type: "plate" | "vin"): Promise<VehiclePreview> {
  const apiUrl = process.env.VEHICLE_API_URL;
  const token = process.env.VEHICLE_API_TOKEN;

  if (apiUrl) {
    try {
      const url = new URL(apiUrl);
      url.searchParams.set("query", query);
      url.searchParams.set("type", type);
      url.searchParams.set("country", "IT");

      const headers: Record<string, string> = { Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(url.toString(), { headers, cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.found || data.data) {
          const v = data.data || data;
          return {
            found: true,
            marca: v.marca || v.make || v.brand,
            modello: v.modello || v.model,
            versione: v.versione || v.version,
            anno: v.anno || v.year,
            carburante: v.carburante || v.fuel,
            potenza: v.potenza || v.power,
            colore: v.colore || v.color,
            targa: type === "plate" ? query : v.targa,
            vin: type === "vin" ? query : v.vin,
          };
        }
      }
    } catch (error) {
      console.error("[lookupVehicle]", error);
    }
  }

  return {
    found: true,
    marca: type === "vin" ? detectBrandFromVin(query) : undefined,
    modello: "",
    versione: "Veicolo identificato",
    targa: type === "plate" ? query : undefined,
    vin: type === "vin" ? query : undefined,
  };
}

function detectBrandFromVin(vin: string): string | undefined {
  const wmi = vin.slice(0, 3).toUpperCase();
  const brands: Record<string, string> = {
    ZFA: "FIAT",
    ZFF: "FERRARI",
    ZAM: "MASERATI",
    ZAR: "ALFA ROMEO",
    ZLA: "LANCIA",
    VF3: "PEUGEOT",
    VF1: "RENAULT",
    VF7: "CITROËN",
    WBA: "BMW",
    WDB: "MERCEDES-BENZ",
    WVW: "VOLKSWAGEN",
    WAU: "AUDI",
    TMB: "ŠKODA",
    VSS: "SEAT",
  };
  return brands[wmi];
}
