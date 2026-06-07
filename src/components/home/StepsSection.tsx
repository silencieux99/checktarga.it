import Link from "next/link";
import Container from "@/components/Container";
import VehicleSearchForm from "@/components/shared/VehicleSearchForm";
import { STEPS } from "@/lib/site-content";

export default function StepsSection() {
  return (
    <section id="come-funziona" className="scroll-mt-20 section-padding bg-brand-surface">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="section-label">{STEPS.label}</p>
            <h2 className="display-heading mt-3 text-3xl sm:text-4xl">{STEPS.title}</h2>
            <p className="mt-4 text-brand-muted">{STEPS.subtitle}</p>

            <div className="mt-10 space-y-8">
              {STEPS.items.map((item) => (
                <div key={item.step} className="flex gap-5">
                  <span className="text-3xl font-light tabular-nums text-brand-accent/40">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                      {item.description}
                    </p>
                    {"link" in item && item.link && (
                      <Link
                        href={item.link.href}
                        className="mt-2 inline-block text-sm font-medium text-brand-accent hover:underline"
                      >
                        {item.link.label}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <VehicleSearchForm ctaLabel={STEPS.cta} />
          </div>
        </div>
      </Container>
    </section>
  );
}
