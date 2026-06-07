import Container from "@/components/Container";
import VehicleSearchForm from "@/components/shared/VehicleSearchForm";
import { HERO, VEHICLE_TYPES } from "@/lib/site-content";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="hero" className="scroll-mt-20 overflow-hidden bg-gradient-to-b from-brand-surface to-white section-padding">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <p className="section-label mb-4">{HERO.eyebrow}</p>
          <h1 className="display-heading text-4xl sm:text-5xl lg:text-6xl">
            {HERO.title}
            <br />
            <span className="font-semibold text-brand-accent">{HERO.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-muted sm:text-lg">
            {HERO.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {VEHICLE_TYPES.map((type) => (
              <span
                key={type}
                className="rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs font-medium text-brand-muted shadow-sm"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-lg">
            <VehicleSearchForm ctaLabel={HERO.cta} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-brand-muted">
            {HERO.trust.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-accent" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-brand-border pt-8">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="font-bold text-brand">4,7</span>
              <span className="text-brand-muted">/5</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-accent" />
              <span>Pagamento sicuro Stripe</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
