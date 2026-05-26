import { generateProfessionalPDF } from "./pdf-generator";
import {
  buildAiVerification,
  buildReportSections,
  enrichSectionsWithGemini,
  mapVehicleReportInfo,
} from "./report-sections-builder";
import type { InternationalVehicleData } from "./international-api";
import type { ReportGenerationResult } from "@/types/report.types";

export async function generateVehicleReport(
  searchValue: string,
  vehicleData: InternationalVehicleData,
  orderId: string
): Promise<ReportGenerationResult> {
  try {
    const vehicleInfo = mapVehicleReportInfo(vehicleData, searchValue);
    let sections = buildReportSections(vehicleData, searchValue);
    sections = await enrichSectionsWithGemini(vehicleInfo, sections);
    const ai = await buildAiVerification(vehicleInfo, sections);

    const pdfBuffer = await generateProfessionalPDF({
      sections,
      vehicleInfo,
      orderId,
      generatedDate: new Date(),
      ai,
    });

    return { success: true, pdfBuffer, vehicleInfo, sections, ai };
  } catch (error) {
    console.error("[Report] Errore generazione:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore sconosciuto",
    };
  }
}
