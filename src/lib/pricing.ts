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

export interface SubscriptionConfig {
  introPrice: number;
  recurringPrice: number;
  trialHours: number;
  interval: "week" | "month";
  intervalCount: number;
  recurringCredits: number;
}

export const SUBSCRIPTION_BILLING_INTERVAL = "week" as const;
export const SUBSCRIPTION_BILLING_INTERVAL_COUNT = 4;

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
  subscription?: SubscriptionConfig;
}

export const SUBSCRIPTION_TRIAL_HOURS = 48;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "pack1",
    sku: "pack1",
    name: "1 Report",
    description: "Un report basato sui dati disponibili per il veicolo cercato",
    price: 4.99,
    originalPrice: 29.99,
    reports: 1,
    unitPrice: 4.99,
    highlight: true,
    badge: "Più venduto",
    subscription: {
      introPrice: 4.99,
      recurringPrice: 29.99,
      trialHours: SUBSCRIPTION_TRIAL_HOURS,
      interval: SUBSCRIPTION_BILLING_INTERVAL,
      intervalCount: SUBSCRIPTION_BILLING_INTERVAL_COUNT,
      recurringCredits: 1,
    },
    features: [
      "1 report basato sui dati disponibili subito",
      "Storico chilometri e revisioni",
      "Verifica sinistri e fermo amministrativo",
      "Rinnovo automatico ogni 4 settimane con 1 nuovo credito",
    ],
  },
  {
    id: "pack5",
    sku: "pack5",
    name: "5 Report",
    description: "Ideale per confrontare più auto usate",
    price: 6.99,
    originalPrice: 39.99,
    reports: 5,
    unitPrice: 1.4,
    badge: "Miglior valore",
    subscription: {
      introPrice: 6.99,
      recurringPrice: 39.99,
      trialHours: SUBSCRIPTION_TRIAL_HOURS,
      interval: SUBSCRIPTION_BILLING_INTERVAL,
      intervalCount: SUBSCRIPTION_BILLING_INTERVAL_COUNT,
      recurringCredits: 5,
    },
    features: [
      "5 report basati sui dati disponibili subito",
      "Confronta più veicoli in tranquillità",
      "Esportazione PDF illimitata",
      "Rinnovo automatico ogni 4 settimane con 5 nuovi crediti",
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
    visible: false,
    features: [],
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
    visible: false,
    features: [],
  },
];

export function getPlanBySku(sku: string): PricingPlan | undefined {
  return PRICING_PLANS.find((plan) => plan.sku === sku);
}

export function getVisiblePricingPlans(): PricingPlan[] {
  return PRICING_PLANS.filter((plan) => plan.visible !== false && plan.subscription);
}

export function isSubscriptionPlan(plan: PricingPlan | undefined): plan is PricingPlan & {
  subscription: SubscriptionConfig;
} {
  return Boolean(plan?.subscription);
}

export function formatPrice(amount: number): string {
  return `${amount.toFixed(2).replace(".", ",")} ${SITE.currencySymbol}`;
}

export function formatSubscriptionIntroLabel(plan: PricingPlan): string {
  if (!plan.subscription) return formatPrice(plan.price);
  return formatPrice(plan.subscription.introPrice);
}

export function formatSubscriptionBillingPeriod(
  subscription?: Pick<SubscriptionConfig, "interval" | "intervalCount">
): string {
  const interval = subscription?.interval ?? SUBSCRIPTION_BILLING_INTERVAL;
  const count = subscription?.intervalCount ?? SUBSCRIPTION_BILLING_INTERVAL_COUNT;
  if (interval === "month" && count === 1) return "al mese";
  if (interval === "month") return `ogni ${count} mesi`;
  if (interval === "week" && count === 4) return "ogni 4 settimane";
  if (interval === "week") return `ogni ${count} settimane`;
  return "ogni periodo";
}

export function formatSubscriptionRecurringLabel(plan: PricingPlan): string {
  if (!plan.subscription) return "";
  return `${formatPrice(plan.subscription.recurringPrice)} ${formatSubscriptionBillingPeriod(plan.subscription)}`;
}

export function getSubscriptionTerms(plan: PricingPlan): string {
  if (!plan.subscription) return "";
  const { introPrice, recurringPrice, trialHours, recurringCredits } = plan.subscription;
  return (
    `Oggi paghi ${formatPrice(introPrice)} e ricevi ${plan.reports} credito${plan.reports > 1 ? "i" : ""} immediatamente. ` +
    `La carta viene salvata in modo sicuro tramite Stripe. ` +
    `Trascorse ${trialHours} ore verrà addebitato ${formatPrice(recurringPrice)} ${formatSubscriptionBillingPeriod(plan.subscription)} ` +
    `con ${recurringCredits} nuovo${recurringCredits > 1 ? "i" : ""} credito${recurringCredits > 1 ? "i" : ""}. ` +
    `Puoi annullare in qualsiasi momento dall'area personale prima del prossimo addebito.`
  );
}
