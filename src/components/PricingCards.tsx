import Link from "next/link";
import {
  formatPrice,
  formatSubscriptionIntroLabel,
  formatSubscriptionRecurringLabel,
  getVisiblePricingPlans,
} from "@/lib/pricing";
import { Check, RefreshCw } from "lucide-react";

interface PricingCardsProps {
  checkoutBasePath?: string;
  vehicle?: string;
  vehicleType?: string;
  ctaMode?: "checkout" | "hero";
}

export default function PricingCards({
  checkoutBasePath = "/checkout",
  vehicle,
  vehicleType,
  ctaMode = "checkout",
}: PricingCardsProps) {
  const plans = getVisiblePricingPlans();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plans.map((plan) => {
        const params = new URLSearchParams({ sku: plan.sku });
        if (vehicle) params.set("value", vehicle);
        if (vehicleType) params.set("type", vehicleType);
        const ctaHref = ctaMode === "hero" ? "/#hero" : `${checkoutBasePath}?${params.toString()}`;

        return (
          <div
            key={plan.sku}
            className={`card-surface relative flex flex-col p-6 ${
              plan.highlight ? "border-brand-accent/30 shadow-glow" : ""
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-3 py-1 text-xs font-bold text-white">
                {plan.badge}
              </span>
            )}

            <h3 className="text-lg font-bold text-brand">{plan.name}</h3>
            <p className="mt-1 text-sm text-brand-muted">{plan.description}</p>

            <div className="mb-4 mt-5 space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-brand">
                  {formatSubscriptionIntroLabel(plan)}
                </span>
                <span className="mb-1 text-sm text-brand-muted">oggi</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-xs font-medium text-brand-accent">
                <RefreshCw className="h-3.5 w-3.5" />
                poi {formatSubscriptionRecurringLabel(plan)}
              </div>
            </div>

            <ul className="mb-6 flex-1 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-brand">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={ctaHref}
              className={plan.highlight ? "btn-accent text-center" : "btn-primary text-center"}
            >
              {ctaMode === "hero"
                ? "Inizia la verifica"
                : `Inizia a ${formatPrice(plan.subscription!.introPrice)}`}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
