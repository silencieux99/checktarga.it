export const SITE = {
  name: "CheckTarga",
  domain: "checktarga.it",
  tagline: "Verifica lo storico del veicolo prima di acquistare",
  supportEmail: "support@checktarga.it",
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
  visible?: boolean;
}

/**
 * Griglia pacchetti one-shot (EUR) — allineata agli altri siti IT/FR/ES/DE/UK.
 * Stripe: se usi Price IDs fissi, aggiorna gli importi nel Dashboard per combaciare.
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "pack1",
    sku: "pack1",
    name: "1 Report",
    description: "Un report completo prima dell'acquisto",
    price: 15.99,
    originalPrice: 15.99,
    reports: 1,
    unitPrice: 15.99,
    features: [
      "1 report completo subito",
      "Storico chilometri e revisioni",
      "Verifica sinistri e fermo amministrativo",
      "Esportazione PDF",
    ],
  },
  {
    id: "pack2",
    sku: "pack2",
    name: "3 + 3 in regalo",
    description: "Sei report totali — ideale per confrontare più annunci",
    price: 23.99,
    originalPrice: 95.94,
    reports: 6,
    unitPrice: 4.0,
    highlight: true,
    badge: "Consigliato",
    promoText: "+3 GRATIS",
    features: [
      "6 report completi (3 + 3 in regalo)",
      "Confronta più veicoli in tranquillità",
      "Storico chilometri e revisioni",
      "Esportazione PDF illimitata",
    ],
  },
  {
    id: "pack5",
    sku: "pack5",
    name: "5 + 5 in regalo",
    description: "Dieci report totali — per più veicoli o rivenditori",
    price: 34.99,
    originalPrice: 159.9,
    reports: 10,
    unitPrice: 3.5,
    badge: "Miglior valore",
    promoText: "+5 GRATIS",
    features: [
      "10 report completi (5 + 5 in regalo)",
      "Massimo risparmio sul report singolo",
      "Ideale per chi valuta più auto",
      "Esportazione PDF illimitata",
    ],
  },
  {
    id: "pack10",
    sku: "pack10",
    name: "10 + 10 in regalo",
    description: "Venti report totali — volume per professionisti",
    price: 49.99,
    originalPrice: 319.8,
    reports: 20,
    unitPrice: 2.5,
    badge: "Professionisti",
    promoText: "+10 GRATIS",
    features: [
      "20 report completi (10 + 10 in regalo)",
      "Miglior prezzo unitario",
      "Pensato per rivenditori e professionisti",
      "Esportazione PDF illimitata",
    ],
  },
];

export function getPlanBySku(sku: string): PricingPlan | undefined {
  return PRICING_PLANS.find((plan) => plan.sku === sku);
}

export function getVisiblePricingPlans(): PricingPlan[] {
  return PRICING_PLANS.filter((plan) => plan.visible !== false);
}

export function formatPrice(amount: number): string {
  return `${amount.toFixed(2).replace(".", ",")} ${SITE.currencySymbol}`;
}
