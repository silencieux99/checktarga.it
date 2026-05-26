// API Plaque Immatriculation — https://api.apiplaqueimmatriculation.com
// Utilisée par VerifieMaVoiture, adaptée pour l'Italia (pays=IT)

export type CountryCode = "IT";

export interface InternationalVehicleData {
  immat?: string;
  vin?: string;
  plaque?: string;
  pays?: string;
  marque?: string;
  modele?: string;
  modele_en?: string;
  version?: string;
  date1erCir_fr?: string;
  date1erCir_us?: string;
  debut_modele?: string;
  fin_modele?: string;
  energie?: string;
  energieNGC?: string;
  type_moteur?: string;
  puisFisc?: string;
  puisFiscReelKW?: string;
  puisFiscReelCH?: string;
  genreVCG?: string;
  genreVCGNGC?: string;
  co2?: string;
  carrosserie?: string;
  carrosserieCG?: string;
  code_carrosserie?: string;
  nb_portes?: string;
  nr_passagers?: string;
  boite_vitesse?: string;
  type_transmission?: string;
  code_type_transmission?: string;
  poids?: string;
  ptac?: string;
  capacite_litres?: string;
  ccm?: string;
  cylindres?: string;
  code_moteur?: string;
  systeme_alimentation?: string;
  valves?: string;
  type_mine?: string;
  cnit?: string;
  variante?: string;
  logo_marque?: string;
  photo_modele?: string;
  couleur?: string;
  collection?: string;
  numero_serie?: string;
  erreur?: string;
}

export interface InternationalAPIResponse {
  data: InternationalVehicleData;
  "api-version": string;
  message: string;
  code_erreur: number;
}

function getApiToken(): string {
  const token =
    process.env.NEW_API_PLAQUE_TOKEN ||
    process.env.API_PLAQUE_KEY ||
    process.env.VEHICLE_API_TOKEN;

  if (!token) {
    throw new Error("NEW_API_PLAQUE_TOKEN non configurato");
  }

  return token;
}

export async function getVehicleByPlate(
  immatriculation: string,
  country: CountryCode = "IT"
): Promise<InternationalVehicleData> {
  try {
    const token = getApiToken();
    const cleanPlate = immatriculation.replace(/[-\s]/g, "").toUpperCase();
    const url = `https://api.apiplaqueimmatriculation.com/plaque?immatriculation=${encodeURIComponent(cleanPlate)}&token=${token}&pays=${country}`;

    console.log(`[InternationalAPI] Ricerca targa: ${cleanPlate} (${country})`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        try {
          const errorJson = await response.json();
          if (errorJson.message) throw new Error(errorJson.message);
        } catch {
          // ignore json parse error
        }
        throw new Error("Veicolo non trovato (404)");
      }
      throw new Error(`API HTTP ${response.status}: ${response.statusText}`);
    }

    const result: InternationalAPIResponse = await response.json();

    if (result.code_erreur !== 200) {
      throw new Error(result.message || "Errore API");
    }

    if (result.data.erreur) {
      throw new Error(result.data.erreur);
    }

    console.log(
      `[InternationalAPI] Veicolo trovato: ${result.data.marque} ${result.data.modele}`
    );
    return result.data;
  } catch (error) {
    console.error("[InternationalAPI] Errore targa:", error);
    return {
      erreur: error instanceof Error ? error.message : "Errore sconosciuto",
    };
  }
}

export async function getVehicleByVIN(vin: string): Promise<InternationalVehicleData> {
  try {
    const token = getApiToken();
    const cleanVIN = vin.replace(/[-\s]/g, "").toUpperCase();
    const url = `https://api.apiplaqueimmatriculation.com/vin?vin=${encodeURIComponent(cleanVIN)}&token=${token}`;

    console.log(`[InternationalAPI] Ricerca VIN: ${cleanVIN}`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Veicolo non trovato (404)");
      }
      throw new Error(`API HTTP ${response.status}: ${response.statusText}`);
    }

    const result: InternationalAPIResponse = await response.json();

    if (result.code_erreur !== 200) {
      throw new Error(result.message || "Errore API");
    }

    if (result.data.erreur) {
      throw new Error(result.data.erreur);
    }

    console.log(
      `[InternationalAPI] Veicolo trovato: ${result.data.marque} ${result.data.modele}`
    );
    return result.data;
  } catch (error) {
    console.error("[InternationalAPI] Errore VIN:", error);
    return {
      erreur: error instanceof Error ? error.message : "Errore sconosciuto",
    };
  }
}
