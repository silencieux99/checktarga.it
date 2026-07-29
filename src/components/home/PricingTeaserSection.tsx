import Link from "next/link";
import Container from "@/components/Container";
import { PRICING_TEASER } from "@/lib/site-content";
import { Check } from "lucide-react";

export default function PricingTeaserSection() {
  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="card-surface overflow-hidden lg:grid lg:grid-cols-2">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="section-label">{PRICING_TEASER.label}</p>
            <h2 className="display-heading mt-3 text-3xl sm:text-4xl">{PRICING_TEASER.title}</h2>
            <p className="mt-4 text-brand-muted">{PRICING_TEASER.subtitle}</p>
            <ul className="mt-8 space-y-3">
              {PRICING_TEASER.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-brand">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-brand-accent">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
            <Link href="/prezzi" className="btn-accent mt-8">
              {PRICING_TEASER.cta}
            </Link>
          </div>

          <div className="flex flex-col justify-center bg-brand p-8 text-white sm:p-10 lg:p-12">
            <p className="text-sm text-slate-400">A partire da</p>
            <p className="mt-2 text-5xl font-light tracking-tight">
              15,99 €
              <span className="ml-2 text-lg text-slate-400">pagamento unico</span>
            </p>
            <p className="mt-4 text-slate-400">6 report a 23,99 € · 10 a 34,99 € · 20 a 49,99 €</p>
            <div className="mt-8 space-y-3 border-t border-white/10 pt-8 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Sinistri</span>
                <span className="font-medium">Incluso</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chilometri</span>
                <span className="font-medium">Incluso</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Intestatari</span>
                <span className="font-medium">Incluso</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
