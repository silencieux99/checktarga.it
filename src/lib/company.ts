import { SITE } from "./pricing";

export const COMPANY = {
  legalName: "MG COMPANY DAYA LTD",
  companyNumber: "16707902",
  addressLines: [
    "71-75 Shelton Street",
    "Covent Garden",
    "London",
    "WC2H 9JQ",
    "United Kingdom",
  ],
  supportHours: "Lunedì – Domenica, 9:00 – 18:00 (CET)",
} as const;

export const COMPANY_FULL_ADDRESS = COMPANY.addressLines.join(", ");

export const PRIVATE_SERVICE_DISCLAIMER = `CheckTarga.it è un servizio privato e indipendente.

Non siamo affiliati, autorizzati o rappresentiamo ACI, PRA, il Ministero delle Infrastrutture e dei Trasporti o qualsiasi altro ente pubblico italiano.

Tutti i marchi citati appartengono ai rispettivi proprietari.`;

export const DATA_VARIABILITY_NOTICE =
  "Le informazioni disponibili possono variare in base al veicolo e alle fonti consultabili.";

export function getCompanyContactBlock(): string {
  return `${COMPANY.legalName} — Company Number ${COMPANY.companyNumber}\n${COMPANY_FULL_ADDRESS}\n${SITE.supportEmail}`;
}
