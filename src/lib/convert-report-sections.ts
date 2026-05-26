import type { ReportSection, VehicleReportInfo } from "@/types/report.types";

function isValidValue(val: unknown): boolean {
  if (!val) return false;
  const str = String(val).trim();
  return (
    str !== "" &&
    str !== "Non disponibile" &&
    str !== "N/D" &&
    str !== "—" &&
    str !== "null"
  );
}

export function convertToSections(reportData: {
  sections?: ReportSection[];
  reportData?: { sections?: ReportSection[] };
  vehicleInfo?: VehicleReportInfo;
}): ReportSection[] {
  if (reportData.reportData?.sections?.length) {
    return reportData.reportData.sections;
  }
  if (reportData.sections?.length) {
    return reportData.sections;
  }

  const v = reportData.vehicleInfo;
  if (!v) return [];

  const sections: ReportSection[] = [];

  const identItems = [
    v.marque && { label: "Marca", value: v.marque, flag: "ok" as const },
    v.modele && { label: "Modello", value: v.modele, flag: "ok" as const },
    v.version && { label: "Versione", value: v.version, flag: "ok" as const },
    v.annee && { label: "Anno", value: v.annee, flag: "ok" as const },
    v.plaque && { label: "Targa", value: v.plaque, flag: "ok" as const },
    v.vin && { label: "VIN", value: v.vin, flag: "ok" as const },
  ].filter(Boolean) as ReportSection["items"];

  if (identItems.length) {
    sections.push({ id: "identification", title: "Identificazione", items: identItems });
  }

  const techItems = [
    v.carburant && { label: "Carburante", value: v.carburant, flag: "ok" as const },
    v.puissance && { label: "Potenza", value: v.puissance, flag: "ok" as const },
    v.cylindree && { label: "Cilindrata", value: v.cylindree, flag: "ok" as const },
    v.emission_co2 && { label: "CO₂", value: v.emission_co2, flag: "ok" as const },
  ].filter(Boolean) as ReportSection["items"];

  if (techItems.length) {
    sections.push({ id: "technical", title: "Caratteristiche tecniche", items: techItems });
  }

  return sections;
}

export function getVehicleDisplayName(vehicleInfo?: VehicleReportInfo, searchValue?: string): string {
  if (vehicleInfo?.marque && vehicleInfo?.modele) {
    return `${vehicleInfo.marque} ${vehicleInfo.modele}`;
  }
  return searchValue || "Veicolo";
}

export { isValidValue };
