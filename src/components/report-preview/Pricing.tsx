"use client";

import { PRICING_PLANS, PricingPlan, formatPrice } from "@/lib/pricing";

interface Props {
  vehicleValue: string;
  onCheckout: (plan: PricingPlan) => void;
}

function PlanRow({
  plan,
  baseUnit,
  onCheckout,
}: {
  plan: PricingPlan;
  baseUnit: number;
  onCheckout: (plan: PricingPlan) => void;
}) {
  const unitPrice = plan.price / Math.max(plan.reports, 1);
  const savePct = plan.reports > 1 ? Math.round((1 - unitPrice / baseUnit) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => onCheckout(plan)}
      className="group w-full border-b border-slate-200/80 py-5 text-left transition-colors hover:bg-slate-50/60 lg:-mx-6 lg:px-6 lg:py-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[15px] font-medium tracking-tight text-slate-900 lg:text-[17px]">
              {plan.name}
            </p>
            {plan.promoText && (
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                {plan.promoText}
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] text-slate-500 lg:text-[13px]">
            {plan.reports} report{plan.reports > 1 ? "s" : ""}
            {plan.reports > 1 && (
              <>
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="tabular-nums">{formatPrice(unitPrice)} cad.</span>
              </>
            )}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-[20px] font-light leading-none tracking-tight text-slate-900 tabular-nums lg:text-[22px]">
            {formatPrice(plan.price)}
          </p>
          {savePct > 0 && (
            <span className="mt-1.5 block text-[10px] font-medium tabular-nums text-emerald-700">
              −{savePct} %
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export function ReportPreviewPricing({ vehicleValue, onCheckout }: Props) {
  const featured = PRICING_PLANS.find((p) => p.highlight) ?? PRICING_PLANS[0];
  const others = PRICING_PLANS.filter((p) => p.sku !== featured.sku);
  const singlePlan = PRICING_PLANS.find((p) => p.sku === "pack1");
  const baseUnit = singlePlan?.price ?? featured.price;
  const featuredUnit = featured.price / Math.max(featured.reports, 1);
  const featuredSave =
    featured.reports > 1 ? Math.round((1 - featuredUnit / baseUnit) * 100) : 0;

  return (
    <section id="pricing-section" className="scroll-mt-24 border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <div className="mb-12 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
          <div className="min-w-0 flex-1 lg:max-w-2xl">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Prezzi · Pagamento unico
            </p>
            <h2 className="text-balance text-[32px] font-light leading-[1.05] tracking-[-0.02em] text-slate-950 sm:text-[40px] lg:text-[56px]">
              Il report che ogni acquirente{" "}
              <em className="font-light italic text-slate-400">avrebbe dovuto leggere.</em>
            </h2>
          </div>
          <div className="lg:w-[340px] lg:flex-shrink-0 lg:border-l lg:border-slate-200/80 lg:pl-10">
            <p className="text-[14px] leading-relaxed text-slate-500 md:text-[15px]">
              Scegli la formula giusta. Nessun rinnovo automatico. Dati disponibili pochi secondi
              dopo il pagamento.
              <span className="mt-3 block text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Per <span className="font-medium text-slate-900">{vehicleValue.toUpperCase()}</span>
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-12">
          <article className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-8 lg:col-span-5 lg:p-10">
            {featured.badge && (
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-blue-300 lg:mb-6">
                ★ {featured.badge}
              </p>
            )}
            <h3 className="mb-2 text-[24px] font-light leading-tight tracking-[-0.02em] sm:text-[28px] lg:text-[32px]">
              {featured.name}
            </h3>
            <p className="mb-6 max-w-sm text-[13px] leading-relaxed text-slate-400 lg:mb-8 lg:text-[14px]">
              {featured.description}
            </p>
            <p className="text-[48px] font-light leading-none tracking-[-0.04em] tabular-nums sm:text-[56px] lg:text-[72px]">
              {formatPrice(featured.price)}
            </p>
            {featuredSave > 0 && (
              <p className="mb-2 mt-2 text-[13px] font-medium tabular-nums text-emerald-400">
                risparmi {featuredSave} %
              </p>
            )}
            <p className="mb-6 text-[13px] font-medium tabular-nums text-blue-300 lg:mb-8">
              {featured.reports} report · {formatPrice(featuredUnit)} cad.
            </p>
            <button
              type="button"
              onClick={() => onCheckout(featured)}
              className="w-full rounded-full bg-white px-6 py-4 text-[14px] font-medium tracking-wide text-slate-950 transition-colors hover:bg-blue-50"
            >
              Scegli questo pacchetto
            </button>
          </article>

          <div className="lg:col-span-7">
            <div className="mb-2 flex items-baseline justify-between lg:px-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                Altre formule
              </p>
            </div>
            <div className="border-t border-slate-200/80">
              {others.map((plan) => (
                <PlanRow key={plan.sku} plan={plan} baseUnit={baseUnit} onCheckout={onCheckout} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
