export type ReportFlag = "ok" | "warn" | "risk" | "neutral";

export interface ReportItem {
  label: string;
  value: string;
  flag?: ReportFlag;
}

export interface ReportSection {
  title: string;
  items: ReportItem[];
  notes?: string[];
}

export interface VehicleReportInfo {
  marque?: string;
  modele?: string;
  version?: string;
  annee?: string;
  vin?: string;
  plaque?: string;
  carburant?: string;
  puissance?: string;
  couleur?: string;
  date_premiere_immatriculation?: string;
}

export interface ReportGenerationResult {
  success: boolean;
  pdfBuffer?: Buffer;
  vehicleInfo?: VehicleReportInfo;
  sections?: ReportSection[];
  error?: string;
}
