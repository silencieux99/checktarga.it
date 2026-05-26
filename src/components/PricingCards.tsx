import Link from "next/link";
import { PRICING_PLANS, formatPrice } from "@/lib/pricing";
import { Check } from "lucide-react";

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
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {PRICING_PLANS.map((plan) => {
        const params = new URLSearchParams({ sku: plan.sku });
        if (vehicle) params.set("value", vehicle);
        if (vehicleType) params.set("type", vehicleType);
        const ctaHref = ctaMode === "hero" ? "/#hero" : `${checkoutBasePath}?${params.toString()}`;

        return (
          <div
            key={plan.sku}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              plan.highlight
                ? "border-teal-600 shadow-lg shadow-teal-100 bg-teal-50/40"
                : "border-slate-200 bg-white"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">
                {plan.badge}
              </span>
            )}

            <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
            <p className="text-sm text-slate-600 mt-1 mb-4">{plan.description}</p>

            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-sm text-slate-400 line-through mb-1">
                  {formatPrice(plan.originalPrice)}
                </span>
              </div>
              {plan.promoText && (
                <p className="text-xs font-semibold text-teal-700 mt-1">{plan.promoText}</p>
              )}
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={ctaHref}
              className={`block text-center rounded-xl py-3 font-semibold transition-colors ${
                plan.highlight
                  ? "bg-teal-700 text-white hover:bg-teal-800"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {ctaMode === "hero" ? "Inizia la verifica" : "Scegli questo pacchetto"}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
