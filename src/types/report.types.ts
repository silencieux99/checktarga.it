export type ReportFlag = "ok" | "warn" | "risk" | "neutral";

export interface ReportItem {
  label: string;
  value: string;
  flag?: ReportFlag;
}

export interface ReportSection {
  id?: string;
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
  puissance_fiscale?: string;
  couleur?: string;
  cylindree?: string;
  emission_co2?: string;
  boite_vitesse?: string;
  carrosserie?: string;
  nb_portes?: string;
  nr_passagers?: string;
  poids?: string;
  ptac?: string;
  date_premiere_immatriculation?: string;
  logo_marque?: string;
  photo_modele?: string;
  genreVCG?: string;
  type_mine?: string;
  code_moteur?: string;
  [key: string]: string | undefined;
}

export interface AIVerification {
  analysis?: string;
  score?: number;
  riskLevel?: string;
}

export interface ReportDataPayload {
  sections?: ReportSection[];
  ai?: AIVerification;
}

export interface ReportGenerationResult {
  success: boolean;
  pdfBuffer?: Buffer;
  vehicleInfo?: VehicleReportInfo;
  sections?: ReportSection[];
  ai?: AIVerification;
  error?: string;
}
