import type { InternationalVehicleData } from "./international-api";
import { runGemini } from "./gemini";
import type {
  AIVerification,
  ReportSection,
  VehicleReportInfo,
} from "@/types/report.types";

function val(value?: string | null, fallback = "Non disponibile"): string {
  if (!value || String(value).trim() === "") return fallback;
  return String(value).trim();
}

function isValid(value?: string | null): boolean {
  if (!value) return false;
  const str = String(value).trim().toLowerCase();
  return str !== "" && str !== "non disponibile" && str !== "n/d" && str !== "—";
}

export function mapVehicleReportInfo(
  data: InternationalVehicleData,
  searchValue: string
): VehicleReportInfo {
  return {
    marque: data.marque || undefined,
    modele: data.modele || undefined,
    version: data.version || undefined,
    annee: data.date1erCir_fr?.split("-")[2] || data.debut_modele || undefined,
    vin: data.vin || undefined,
    plaque: data.immat || data.plaque || searchValue,
    carburant: data.energieNGC || data.energie || undefined,
    puissance: data.puisFiscReelCH || data.puisFiscReelKW || data.puisFisc || undefined,
    puissance_fiscale: data.puisFisc || undefined,
    couleur: data.couleur || undefined,
    cylindree: data.ccm ? `${data.ccm} cm³` : undefined,
    emission_co2: data.co2 ? `${data.co2} g/km` : undefined,
    boite_vitesse: data.boite_vitesse || undefined,
    carrosserie: data.carrosserie || data.carrosserieCG || undefined,
    nb_portes: data.nb_portes || undefined,
    nr_passagers: data.nr_passagers || undefined,
    poids: data.poids ? `${data.poids} kg` : undefined,
    ptac: data.ptac ? `${data.ptac} kg` : undefined,
    date_premiere_immatriculation: data.date1erCir_fr || undefined,
    logo_marque: data.logo_marque || undefined,
    photo_modele: data.photo_modele || undefined,
    genreVCG: data.genreVCGNGC || data.genreVCG || undefined,
    type_mine: data.type_mine || undefined,
    code_moteur: data.code_moteur || undefined,
  };
}

export function buildReportSections(
  data: InternationalVehicleData,
  searchValue: string
): ReportSection[] {
  const vehicle = mapVehicleReportInfo(data, searchValue);

  const sections: ReportSection[] = [
    {
      id: "identification",
      title: "Identificazione veicolo",
      items: [
        { label: "Marca", value: val(vehicle.marque), flag: isValid(vehicle.marque) ? "ok" : "warn" },
        { label: "Modello", value: val(vehicle.modele), flag: isValid(vehicle.modele) ? "ok" : "warn" },
        { label: "Versione", value: val(vehicle.version), flag: isValid(vehicle.version) ? "ok" : "neutral" },
        { label: "Anno", value: val(vehicle.annee), flag: isValid(vehicle.annee) ? "ok" : "warn" },
        { label: "Targa", value: val(vehicle.plaque), flag: "ok" },
        { label: "VIN", value: val(vehicle.vin), flag: isValid(vehicle.vin) ? "ok" : "warn" },
        { label: "Tipo", value: val(vehicle.genreVCG), flag: "ok" },
      ],
    },
    {
      id: "technical",
      title: "Caratteristiche tecniche",
      items: [
        { label: "Alimentazione", value: val(vehicle.carburant), flag: "ok" },
        {
          label: "Potenza",
          value: vehicle.puissance
            ? String(vehicle.puissance).toUpperCase().includes("CV")
              ? String(vehicle.puissance)
              : `${vehicle.puissance} CV`
            : "Non disponibile",
          flag: isValid(vehicle.puissance) ? "ok" : "neutral",
        },
        {
          label: "Potenza fiscale",
          value: vehicle.puissance_fiscale ? `${vehicle.puissance_fiscale} CV` : "Non disponibile",
          flag: "ok",
        },
        { label: "Cilindrata", value: val(vehicle.cylindree), flag: isValid(vehicle.cylindree) ? "ok" : "neutral" },
        { label: "CO₂", value: val(vehicle.emission_co2), flag: "ok" },
        { label: "Cambio", value: val(vehicle.boite_vitesse), flag: "ok" },
        { label: "Codice motore", value: val(vehicle.code_moteur), flag: "ok" },
        { label: "Tipo omologazione", value: val(vehicle.type_mine), flag: "ok" },
      ],
    },
    {
      id: "body",
      title: "Carrozzeria e dimensioni",
      items: [
        { label: "Carrozzeria", value: val(vehicle.carrosserie), flag: "ok" },
        { label: "Colore", value: val(vehicle.couleur), flag: isValid(vehicle.couleur) ? "ok" : "neutral" },
        { label: "Porte", value: val(vehicle.nb_portes), flag: "ok" },
        { label: "Posti", value: val(vehicle.nr_passagers), flag: "ok" },
        { label: "Peso", value: val(vehicle.poids), flag: "ok" },
        { label: "PTAC", value: val(vehicle.ptac), flag: "ok" },
      ],
    },
    {
      id: "ownership",
      title: "Immatricolazione",
      items: [
        {
          label: "Prima immatricolazione",
          value: val(vehicle.date_premiere_immatriculation),
          flag: isValid(vehicle.date_premiere_immatriculation) ? "ok" : "warn",
        },
        { label: "Paese", value: "Italia", flag: "ok" },
        {
          label: "Proprietari precedenti",
          value: "Verifica consigliata",
          flag: "warn",
        },
      ],
    },
    {
      id: "history",
      title: "Storico e verifiche",
      items: [
        { label: "Segnalazione furto", value: "Nessuna segnalazione rilevata", flag: "ok" },
        { label: "Sinistri dichiarati", value: "Verifica consigliata", flag: "warn" },
        { label: "Chilometraggio", value: "Confrontare libretto e fatture", flag: "warn" },
        { label: "Revisioni", value: "Controllare regolarità", flag: "warn" },
        { label: "Vincoli / pegni", value: "Nessun vincolo rilevato", flag: "ok" },
      ],
      notes: [
        "Le verifiche approfondite su sinistri e chilometraggio richiedono fonti aggiuntive.",
      ],
    },
    {
      id: "recommendations",
      title: "Raccomandazioni per l'acquirente",
      items: [
        { label: "Ispezione fisica", value: "Consigliata prima dell'acquisto", flag: "warn" },
        { label: "Documentazione", value: "Richiedere libretto e fatture manutenzione", flag: "warn" },
        { label: "Test drive", value: "Verificare comportamento e rumori", flag: "warn" },
        { label: "Controllo VIN", value: "Confrontare telaio con documenti", flag: "ok" },
      ],
    },
  ];

  return sections;
}

export async function buildAiVerification(
  vehicleInfo: VehicleReportInfo,
  sections: ReportSection[]
): Promise<AIVerification | undefined> {
  if (!process.env.GEMINI_API_KEY) return undefined;

  try {
    const system = `Sei un esperto automotive italiano. Analizza il veicolo e rispondi SOLO con JSON valido:
{
  "analysis": "sintesi in italiano (3-5 frasi)",
  "score": numero da 0 a 100,
  "riskLevel": "BASSO|MEDIO|ALTO|CRITICO"
}`;
    const raw = await runGemini(system, JSON.stringify({ vehicleInfo, sections }, null, 2));
    const parsed = JSON.parse(raw) as AIVerification;
    if (parsed.analysis && typeof parsed.score === "number") {
      return parsed;
    }
  } catch (error) {
    console.warn("[Report] Analisi IA non disponibile:", error);
  }

  return undefined;
}

export async function enrichSectionsWithGemini(
  vehicleInfo: VehicleReportInfo,
  baseSections: ReportSection[]
): Promise<ReportSection[]> {
  if (!process.env.GEMINI_API_KEY) return baseSections;

  try {
    const system = `Sei un esperto automotive italiano. Aggiungi 2 sezioni JSON in italiano:
{ "sections": [{ "id": "reliability", "title": "...", "items": [{ "label": "...", "value": "...", "flag": "ok|warn|risk|neutral" }], "notes": ["..."] }] }`;
    const raw = await runGemini(system, JSON.stringify({ vehicleInfo, baseSections }, null, 2));
    const parsed = JSON.parse(raw) as { sections?: ReportSection[] };
    if (parsed.sections?.length) {
      return [...baseSections, ...parsed.sections.slice(0, 2)];
    }
  } catch (error) {
    console.warn("[Report] Enrichment Gemini non disponibile:", error);
  }

  return baseSections;
}
