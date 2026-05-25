"use client";

import { useEffect, useState } from "react";
import { PricingPlan, formatPrice } from "@/lib/pricing";

interface Props {
  vehicleValue: string;
  startingFromPlan?: PricingPlan;
  onScrollToPricing: () => void;
}

export function ReportPreviewStickyBar({
  vehicleValue,
  startingFromPlan,
  onScrollToPricing,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [pricingInView, setPricingInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("pricing-section");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPricingInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const showBar = visible && !pricingInView;

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 md:hidden ${
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-slate-400">
                {vehicleValue.toUpperCase()}
              </p>
              {startingFromPlan ? (
                <p className="truncate text-[13px] font-medium leading-tight text-slate-900">
                  Da {formatPrice(startingFromPlan.price)}
                  <span className="ml-2 text-[11px] font-normal text-slate-400">senza abbonamento</span>
                </p>
              ) : (
                <p className="text-[13px] font-medium leading-tight text-slate-900">Vedi i prezzi</p>
              )}
            </div>
            <button
              type="button"
              onClick={onScrollToPricing}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-[12px] font-medium text-white transition-colors hover:bg-slate-800"
            >
              Sblocca
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 transition-all duration-300 md:block ${
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        }`}
      >
        <div className="flex items-center gap-6 rounded-full border border-slate-200/80 bg-white/90 py-1.5 pl-5 pr-1.5 shadow-[0_20px_40px_-20px_rgba(2,6,23,0.18)] backdrop-blur-xl">
          <div className="flex items-baseline gap-3 py-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
              {vehicleValue.toUpperCase()}
            </span>
            {startingFromPlan && (
              <>
                <span className="text-slate-200">·</span>
                <span className="text-[12px] text-slate-500">
                  Da <span className="font-medium tabular-nums text-slate-900">{formatPrice(startingFromPlan.price)}</span>
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onScrollToPricing}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-slate-800"
          >
            Sblocca il report
          </button>
        </div>
      </div>
    </>
  );
}
