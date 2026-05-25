export const SITE = {
  name: "CheckTarga",
  domain: "checktarga.it",
  tagline: "Verifica lo storico del veicolo prima di acquistare",
  supportEmail: "assistenza@checktarga.it",
  locale: "it-IT",
  currency: "eur",
  currencySymbol: "€",
} as const;

export type PlanSku = "pack1" | "pack2" | "pack5" | "pack10";

export interface PricingPlan {
  id: PlanSku;
  sku: PlanSku;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  reports: number;
  unitPrice: number;
  features: string[];
  highlight?: boolean;
  badge?: string;
  promoText?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "pack1",
    sku: "pack1",
    name: "1 Report",
    description: "Un report completo per il veicolo cercato",
    price: 15.99,
    originalPrice: 24.99,
    reports: 1,
    unitPrice: 15.99,
    features: [
      "Storico chilometri e revisioni",
      "Verifica sinistri e fermo amministrativo",
      "Dati tecnici e immatricolazione",
    ],
  },
  {
    id: "pack2",
    sku: "pack2",
    name: "3 + 3 in regalo",
    description: "Ideale per confrontare più auto usate",
    price: 23.99,
    originalPrice: 56.94,
    reports: 6,
    unitPrice: 4.0,
    features: [
      "6 report completi inclusi",
      "Supporto prioritario via email",
      "Accesso area personale 12 mesi",
    ],
    highlight: true,
    badge: "Più venduto",
    promoText: "+3 OMAGGIO",
  },
  {
    id: "pack5",
    sku: "pack5",
    name: "5 + 5 in regalo",
    description: "Per chi compra spesso o per famiglie",
    price: 34.99,
    originalPrice: 94.95,
    reports: 10,
    unitPrice: 3.49,
    features: [
      "10 report completi inclusi",
      "Esportazione PDF illimitata",
      "Supporto prioritario",
    ],
    badge: "Popolare",
    promoText: "+5 OMAGGIO",
  },
  {
    id: "pack10",
    sku: "pack10",
    name: "10 + 10 in regalo",
    description: "Per professionisti e rivenditori",
    price: 49.99,
    originalPrice: 189.9,
    reports: 20,
    unitPrice: 2.5,
    features: [
      "20 report completi inclusi",
      "Area riservata multi-utente",
      "Assistenza dedicata",
    ],
    badge: "Miglior prezzo",
    promoText: "+10 OMAGGIO",
  },
];

export function getPlanBySku(sku: string): PricingPlan | undefined {
  return PRICING_PLANS.find((plan) => plan.sku === sku);
}

export function formatPrice(amount: number): string {
  return `${amount.toFixed(2).replace(".", ",")} ${SITE.currencySymbol}`;
}
