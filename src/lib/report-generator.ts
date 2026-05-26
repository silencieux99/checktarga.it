import type { InternationalVehicleData } from "./international-api";
import { runGemini } from "./gemini";
import { generateProfessionalPDF } from "./pdf-generator";
import type { ReportGenerationResult, ReportSection, VehicleReportInfo } from "@/types/report.types";

function mapVehicleInfo(data: InternationalVehicleData, searchValue: string): VehicleReportInfo {
  return {
    marque: data.marque || undefined,
    modele: data.modele || undefined,
    version: data.version || undefined,
    annee: data.date1erCir_fr?.split("-")[2] || data.debut_modele || undefined,
    vin: data.vin || undefined,
    plaque: data.immat || data.plaque || searchValue,
    carburant: data.energieNGC || data.energie || undefined,
    puissance: data.puisFiscReelCH || data.puisFisc || undefined,
    couleur: data.couleur || undefined,
    date_premiere_immatriculation: data.date1erCir_fr || undefined,
  };
}

function buildDefaultSections(data: InternationalVehicleData): ReportSection[] {
  const val = (v?: string) => (v && v !== "Non disponibile" ? v : "Non disponibile");

  return [
    {
      title: "Identificazione veicolo",
      items: [
        { label: "Marca", value: val(data.marque), flag: data.marque ? "ok" : "warn" },
        { label: "Modello", value: val(data.modele), flag: data.modele ? "ok" : "warn" },
        { label: "Versione", value: val(data.version), flag: data.version ? "ok" : "neutral" },
        { label: "Targa", value: val(data.immat || data.plaque), flag: "ok" },
        { label: "VIN", value: val(data.vin), flag: data.vin ? "ok" : "warn" },
      ],
    },
    {
      title: "Caratteristiche tecniche",
      items: [
        { label: "Alimentazione", value: val(data.energieNGC || data.energie), flag: "ok" },
        { label: "Potenza fiscale", value: val(data.puisFisc), flag: "ok" },
        { label: "Potenza (CV/kW)", value: val(data.puisFiscReelCH || data.puisFiscReelKW), flag: "ok" },
        { label: "Cilindrata", value: data.ccm ? `${data.ccm} cm³` : "Non disponibile", flag: data.ccm ? "ok" : "neutral" },
        { label: "CO₂", value: data.co2 ? `${data.co2} g/km` : "Non disponibile", flag: "ok" },
        { label: "Cambio", value: val(data.boite_vitesse), flag: "ok" },
      ],
    },
    {
      title: "Immatricolazione e uso",
      items: [
        {
          label: "Prima immatricolazione",
          value: val(data.date1erCir_fr),
          flag: data.date1erCir_fr ? "ok" : "warn",
        },
        { label: "Carrozzeria", value: val(data.carrosserie || data.carrosserieCG), flag: "ok" },
        { label: "Porte", value: val(data.nb_portes), flag: "ok" },
        { label: "Posti", value: val(data.nr_passagers), flag: "ok" },
        { label: "Peso", value: data.poids ? `${data.poids} kg` : "Non disponibile", flag: "ok" },
      ],
    },
    {
      title: "Verifiche consigliate",
      items: [
        { label: "Storico sinistri", value: "Verifica consigliata", flag: "warn" },
        { label: "Chilometraggio", value: "Confrontare con libretto e fatture", flag: "warn" },
        { label: "Proprietari precedenti", value: "Richiedere documentazione", flag: "warn" },
        { label: "Revisioni", value: "Controllare regolarità", flag: "warn" },
      ],
      notes: [
        "Questo report si basa sui dati ufficiali disponibili al momento della generazione.",
        "Si consiglia sempre un'ispezione fisica del veicolo prima dell'acquisto.",
      ],
    },
  ];
}

async function enrichSectionsWithGemini(
  data: InternationalVehicleData,
  vehicleInfo: VehicleReportInfo
): Promise<ReportSection[] | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const system = `Sei un esperto automotive italiano. Analizza i dati del veicolo e rispondi SOLO con JSON valido:
{
  "sections": [
    {
      "title": "string",
      "items": [{ "label": "string", "value": "string", "flag": "ok|warn|risk|neutral" }],
      "notes": ["string opzionale"]
    }
  ]
}
Scrivi in italiano. Aggiungi 1-2 sezioni con raccomandazioni per l'acquirente.`;

    const user = JSON.stringify({ vehicleInfo, rawData: data }, null, 2);
    const raw = await runGemini(system, user);
    const parsed = JSON.parse(raw) as { sections?: ReportSection[] };

    if (parsed.sections?.length) {
      const base = buildDefaultSections(data);
      return [...base, ...parsed.sections.slice(0, 2)];
    }
  } catch (error) {
    console.warn("[Report] Gemini non disponibile, sezioni predefinite:", error);
  }

  return null;
}

export async function generateVehicleReport(
  searchValue: string,
  vehicleData: InternationalVehicleData,
  orderId: string
): Promise<ReportGenerationResult> {
  try {
    const vehicleInfo = mapVehicleInfo(vehicleData, searchValue);
    const sections =
      (await enrichSectionsWithGemini(vehicleData, vehicleInfo)) || buildDefaultSections(vehicleData);

    const pdfBuffer = await generateProfessionalPDF({
      sections,
      vehicleInfo,
      orderId,
      generatedDate: new Date(),
    });

    return { success: true, pdfBuffer, vehicleInfo, sections };
  } catch (error) {
    console.error("[Report] Errore generazione:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore sconosciuto",
    };
  }
}
