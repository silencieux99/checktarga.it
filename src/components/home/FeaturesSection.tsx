import Container from "@/components/Container";
import { FEATURES } from "@/lib/site-content";
import { AlertTriangle, Gauge, ShieldCheck, Wrench } from "lucide-react";

const ICONS = {
  gauge: Gauge,
  alert: AlertTriangle,
  shield: ShieldCheck,
  wrench: Wrench,
};

export default function FeaturesSection() {
  return (
    <section id="funzionalita" className="scroll-mt-20 section-padding bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">{FEATURES.label}</p>
          <h2 className="display-heading mt-3 text-3xl sm:text-4xl lg:text-5xl">
            {FEATURES.title}
          </h2>
          <p className="mt-4 text-base text-brand-muted sm:text-lg">{FEATURES.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.items.map((item) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS];
            return (
              <article key={item.title} className="card-surface p-6 transition-shadow hover:shadow-card-lg">
                <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-brand-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.description}</p>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm font-medium text-brand-accent">{FEATURES.extra}</p>
      </Container>
    </section>
  );
}
