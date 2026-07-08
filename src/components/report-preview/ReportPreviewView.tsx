"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PRICING_PLANS, PricingPlan } from "@/lib/pricing";
import { parseReportPreviewQuery } from "@/lib/report-preview";
import { ReportPreviewStickyBar } from "./StickyBar";
import { ReportPreviewHero } from "./Hero";
import { ReportPreviewKeyData } from "./KeyData";
import { BlurredReportPreviews } from "./BlurredPreviews";
import { ReportPreviewAlerts } from "./Alerts";
import { ReportPreviewWhatYouGet } from "./WhatYouGet";
import { PostPaymentProcess } from "./PostPayment";
import { ReportPreviewTestimonials } from "./Testimonials";
import { InsurancePartners } from "./InsurancePartners";
import { ReportPreviewPricing } from "./Pricing";
import { ReportPreviewGuarantee } from "./Guarantee";
import { ReportPreviewFaq } from "./Faq";
import PrivateServiceDisclaimer from "@/components/legal/PrivateServiceDisclaimer";

export default function ReportPreviewView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleType = (searchParams.get("type") || "plate") as "plate" | "vin";
  const vehicleValue = searchParams.get("value") || "";
  const query = parseReportPreviewQuery(vehicleValue, vehicleType);

  const startingPlan = PRICING_PLANS.reduce((min, plan) =>
    plan.price < min.price ? plan : min
  );

  const scrollToPricing = () => {
    document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openCheckout = (plan: PricingPlan) => {
    router.push(
      `/checkout?sku=${plan.sku}&value=${encodeURIComponent(query.value)}&type=${query.type}`
    );
  };

  if (!query.cleanValue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="mb-4 text-slate-600">Inserisci una targa o un VIN per vedere l&apos;anteprima.</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white"
          >
            Torna alla home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 antialiased md:pb-4">
      <ReportPreviewStickyBar
        vehicleValue={query.displayValue}
        startingFromPlan={startingPlan}
        onScrollToPricing={scrollToPricing}
      />

      <ReportPreviewHero
        query={query}
        startingFromPrice={`${startingPlan.price.toFixed(2).replace(".", ",")} €`}
        onScrollToPricing={scrollToPricing}
      />

      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mt-6 md:mt-8">
          <PrivateServiceDisclaimer />
        </div>
      </div>

      <ReportPreviewKeyData query={query} onUnlock={scrollToPricing} />

      <section className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-24">
          <div className="mb-10 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
            <div className="min-w-0 flex-1 lg:max-w-lg">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
                Anteprima del report
              </p>
              <h2 className="text-balance text-[32px] font-light leading-[1.08] tracking-[-0.02em] text-slate-950 sm:text-[40px] lg:text-[48px]">
                Alcune pagine{" "}
                <span className="italic text-slate-400">in anteprima.</span>
              </h2>
            </div>
            <div className="lg:w-[340px] lg:flex-shrink-0 lg:border-l lg:border-slate-200/80 lg:pl-10">
              <p className="text-[14px] leading-relaxed text-slate-500 md:text-[15px]">
                I dati del veicolo saranno disponibili dopo l&apos;acquisto. Le sezioni sotto mostrano
                solo la struttura del report, senza contenuti inventati.
              </p>
            </div>
          </div>
          <BlurredReportPreviews query={query} onUnlock={scrollToPricing} />
        </div>
      </section>

      <ReportPreviewAlerts query={query} onUnlock={scrollToPricing} />
      <ReportPreviewWhatYouGet onUnlock={scrollToPricing} />
      <PostPaymentProcess />
      <ReportPreviewTestimonials />
      <InsurancePartners />
      <ReportPreviewPricing vehicleValue={query.displayValue} onCheckout={openCheckout} />
      <ReportPreviewGuarantee />

      <div className="bg-white py-14 md:py-20">
        <ReportPreviewFaq />
      </div>

      <div className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium text-slate-400">
            <span>Soddisfatti o rimborsati 30 giorni</span>
            <span aria-hidden className="text-slate-200">
              ·
            </span>
            <span>Pagamento sicuro SSL</span>
            <span aria-hidden className="text-slate-200">
              ·
            </span>
            <span>Report immediato</span>
            <span aria-hidden className="text-slate-200">
              ·
            </span>
            <span>Supporto 7 giorni su 7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
