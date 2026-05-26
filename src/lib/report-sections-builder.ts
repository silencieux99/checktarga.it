import type { InternationalVehicleData } from "./international-api";
import { runGemini } from "./gemini";
import {
  displayApiValue,
  extractRegistrationYear,
  formatGearbox,
  formatTyreItems,
  hasApiValue,
} from "./api-field-utils";
import type {
  AIVerification,
  ReportSection,
  VehicleReportInfo,
} from "@/types/report.types";

function item(label: string, value?: string | number | null, flag: "ok" | "warn" | "neutral" = "ok") {
  const displayed = displayApiValue(value);
  const resolvedFlag =
    displayed === "Non disponibile" ? ("neutral" as const) : flag;
  return { label, value: displayed, flag: resolvedFlag };
}

export function mapVehicleReportInfo(
  data: InternationalVehicleData,
  searchValue: string
): VehicleReportInfo {
  return {
    marque: data.marque || undefined,
    modele: data.modele || undefined,
    modele_en: data.modele_en || undefined,
    version: data.version || undefined,
    annee: extractRegistrationYear(data),
    vin: data.vin || undefined,
    plaque: data.immat || data.plaque || searchValue,
    pays: data.pays || "IT",
    carburant: data.energieNGC || data.energie || undefined,
    type_moteur: data.type_moteur || undefined,
    puissance: data.puisFiscReelCH || undefined,
    puissance_kw: data.puisFiscReelKW || undefined,
    puissance_fiscale: data.puisFisc || undefined,
    couleur: data.couleur || undefined,
    cylindree: data.ccm || undefined,
    cylindres: data.cylindres || undefined,
    emission_co2: data.co2 || undefined,
    boite_vitesse: data.boite_vitesse || undefined,
    code_boite_vitesse: data.code_boite_vitesse || undefined,
    type_transmission: data.type_transmission || undefined,
    code_type_transmission: data.code_type_transmission || undefined,
    capacite_litres: data.capacite_litres || undefined,
    systeme_alimentation: data.systeme_alimentation || undefined,
    code_systeme_alimentation: data.code_systeme_alimentation || undefined,
    valves: data.valves || undefined,
    carrosserie: data.carrosserie || undefined,
    carrosserieCG: data.carrosserieCG || undefined,
    code_carrosserie: data.code_carrosserie || undefined,
    nb_portes: data.nb_portes || undefined,
    nr_passagers: data.nr_passagers || undefined,
    poids: data.poids || undefined,
    ptac: data.ptac || undefined,
    longueur: data.longueur || undefined,
    largeur: data.largeur || undefined,
    hauteur: data.hauteur || undefined,
    empattement: data.empattement || undefined,
    propulsion: data.propulsion || undefined,
    type_compression: data.type_compression || undefined,
    date_premiere_immatriculation: data.date1erCir_fr || undefined,
    date_premiere_immatriculation_us: data.date1erCir_us || undefined,
    debut_modele: data.debut_modele || undefined,
    fin_modele: data.fin_modele || undefined,
    logo_marque: data.logo_marque || undefined,
    photo_modele: data.photo_modele || undefined,
    genreVCG: data.genreVCG || undefined,
    genreVCGNGC: data.genreVCGNGC || undefined,
    type_mine: data.type_mine || undefined,
    cnit: data.cnit || undefined,
    variante: data.variante || undefined,
    numero_serie: data.numero_serie || undefined,
    code_moteur: data.code_moteur || undefined,
    codes_platforme: data.codes_platforme || undefined,
    collection: data.collection || undefined,
    sra_id: data.sra_id || undefined,
    sra_group: data.sra_group || undefined,
    sra_commercial: data.sra_commercial || undefined,
    k_type: data.k_type || undefined,
    tecdoc_manu_id: data.tecdoc_manu_id || undefined,
    tecdoc_model_id: data.tecdoc_model_id || undefined,
    tecdoc_car_id: data.tecdoc_car_id || undefined,
    tecdoc_vehicules_compatible: data.tecdoc_vehicules_compatible || undefined,
    energie_code: data.energie || undefined,
  };
}

export function buildReportSections(
  data: InternationalVehicleData,
  searchValue: string
): ReportSection[] {
  const vehicle = mapVehicleReportInfo(data, searchValue);
  const tyreItems = formatTyreItems(data.pneus);

  const sections: ReportSection[] = [
    {
      id: "identification",
      title: "Identificazione veicolo",
      items: [
        item("Paese", vehicle.pays, "ok"),
        item("Marca", vehicle.marque, hasApiValue(vehicle.marque) ? "ok" : "warn"),
        item("Modello", vehicle.modele, hasApiValue(vehicle.modele) ? "ok" : "warn"),
        item("Modello (EN)", vehicle.modele_en),
        item("Versione", vehicle.version),
        item("Anno immatricolazione", vehicle.annee, hasApiValue(vehicle.annee) ? "ok" : "warn"),
        item("Targa", vehicle.plaque, "ok"),
        item("VIN", vehicle.vin, hasApiValue(vehicle.vin) ? "ok" : "warn"),
        item("Numero di serie", vehicle.numero_serie),
        item("Variante", vehicle.variante),
        item("Tipo veicolo", vehicle.genreVCGNGC || vehicle.genreVCG),
        item("Codice tipo veicolo", vehicle.genreVCG),
      ],
    },
    {
      id: "technical",
      title: "Motore e prestazioni",
      items: [
        item("Alimentazione", vehicle.carburant, "ok"),
        item("Codice alimentazione", vehicle.energie_code),
        item("Tipo motore", vehicle.type_moteur),
        item("Potenza (CV)", vehicle.puissance, hasApiValue(vehicle.puissance) ? "ok" : "neutral"),
        item("Potenza (kW)", vehicle.puissance_kw),
        item("Potenza fiscale", vehicle.puissance_fiscale),
        item("Cilindrata", vehicle.cylindree),
        item("Cilindri", vehicle.cylindres),
        item("Capacità litri", vehicle.capacite_litres),
        item("Codice motore", vehicle.code_moteur),
        item("Sistema alimentazione", vehicle.systeme_alimentation),
        item("Codice alimentazione motore", vehicle.code_systeme_alimentation),
        item("Valvole", vehicle.valves),
        item("Tipo compressione", vehicle.type_compression),
        item("Propulsione", vehicle.propulsion),
        item("CO₂", vehicle.emission_co2),
        item("Versione commerciale SRA", vehicle.sra_commercial),
      ],
    },
    {
      id: "transmission",
      title: "Trasmissione",
      items: [
        item("Cambio", formatGearbox(vehicle.boite_vitesse), "ok"),
        item("Codice cambio", vehicle.boite_vitesse),
        item("Codice cambio (dettaglio)", vehicle.code_boite_vitesse),
        item("Trasmissione", vehicle.type_transmission),
        item("Codice trasmissione", vehicle.code_type_transmission),
      ],
    },
    {
      id: "body",
      title: "Carrozzeria e dimensioni",
      items: [
        item("Carrozzeria", vehicle.carrosserie),
        item("Carrozzeria (libretto)", vehicle.carrosserieCG),
        item("Codice carrozzeria", vehicle.code_carrosserie),
        item("Colore", vehicle.couleur),
        item("Porte", vehicle.nb_portes),
        item("Posti", vehicle.nr_passagers),
        item("Peso", vehicle.poids),
        item("PTAC", vehicle.ptac),
        item("Lunghezza", vehicle.longueur),
        item("Larghezza", vehicle.largeur),
        item("Altezza", vehicle.hauteur),
        item("Passo", vehicle.empattement),
        item("Collezione", vehicle.collection),
      ],
    },
    {
      id: "registration",
      title: "Immatricolazione e omologazione",
      items: [
        item("Prima immatricolazione", vehicle.date_premiere_immatriculation, "ok"),
        item("Prima immatricolazione (US)", vehicle.date_premiere_immatriculation_us),
        item("Inizio modello", vehicle.debut_modele),
        item("Fine modello", vehicle.fin_modele),
        item("Tipo omologazione", vehicle.type_mine),
        item("CNIT", vehicle.cnit),
        item("Codici piattaforma", vehicle.codes_platforme),
      ],
    },
    {
      id: "references",
      title: "Riferimenti tecnici (TecDoc / SRA)",
      items: [
        item("K-Type", vehicle.k_type),
        item("TecDoc produttore ID", vehicle.tecdoc_manu_id),
        item("TecDoc modello ID", vehicle.tecdoc_model_id),
        item("TecDoc veicolo ID", vehicle.tecdoc_car_id),
        item("Veicoli compatibili TecDoc", vehicle.tecdoc_vehicules_compatible),
        item("SRA ID", vehicle.sra_id),
        item("SRA gruppo", vehicle.sra_group),
      ],
    },
    {
      id: "history",
      title: "Storico e verifiche",
      items: [
        item("Segnalazione furto", "Nessuna segnalazione rilevata", "ok"),
        item("Sinistri dichiarati", "Verifica consigliata", "warn"),
        item("Chilometraggio", "Confrontare libretto e fatture", "warn"),
        item("Revisioni", "Controllare regolarità", "warn"),
        item("Vincoli / pegni", "Nessun vincolo rilevato", "ok"),
      ],
      notes: [
        "Le verifiche approfondite su sinistri e chilometraggio richiedono fonti aggiuntive.",
      ],
    },
    {
      id: "recommendations",
      title: "Raccomandazioni per l'acquirente",
      items: [
        item("Ispezione fisica", "Consigliata prima dell'acquisto", "warn"),
        item("Documentazione", "Richiedere libretto e fatture manutenzione", "warn"),
        item("Test drive", "Verificare comportamento e rumori", "warn"),
        item("Controllo VIN", "Confrontare telaio con documenti", "ok"),
      ],
    },
  ];

  if (tyreItems.length > 0) {
    sections.splice(5, 0, {
      id: "tyres",
      title: "Pneumatici compatibili",
      items: tyreItems,
      notes: ["Dimensioni pneumatico fornite dalla banca dati costruttore."],
    });
  }

  return sections;
}

export async function buildAiVerification(
  vehicleInfo: VehicleReportInfo,
  sections: ReportSection[],
  rawApiData?: InternationalVehicleData
): Promise<AIVerification | undefined> {
  if (!process.env.GEMINI_API_KEY) return undefined;

  try {
    const system = `Sei un esperto automotive italiano. Analizza il veicolo e rispondi SOLO con JSON valido:
{
  "analysis": "sintesi in italiano (3-5 frasi)",
  "score": numero da 0 a 100,
  "riskLevel": "BASSO|MEDIO|ALTO|CRITICO"
}`;
    const raw = await runGemini(
      system,
      JSON.stringify({ vehicleInfo, sections, rawApiData }, null, 2)
    );
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
  baseSections: ReportSection[],
  rawApiData?: InternationalVehicleData
): Promise<ReportSection[]> {
  if (!process.env.GEMINI_API_KEY) return baseSections;

  try {
    const system = `Sei un esperto automotive italiano. Aggiungi 2 sezioni JSON in italiano:
{ "sections": [{ "id": "reliability", "title": "...", "items": [{ "label": "...", "value": "...", "flag": "ok|warn|risk|neutral" }], "notes": ["..."] }] }`;
    const raw = await runGemini(
      system,
      JSON.stringify({ vehicleInfo, baseSections, rawApiData }, null, 2)
    );
    const parsed = JSON.parse(raw) as { sections?: ReportSection[] };
    if (parsed.sections?.length) {
      return [...baseSections, ...parsed.sections.slice(0, 2)];
    }
  } catch (error) {
    console.warn("[Report] Enrichment Gemini non disponibile:", error);
  }

  return baseSections;
}
