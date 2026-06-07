import Container from "@/components/Container";
import { SUPPORT } from "@/lib/site-content";
import { Mail } from "lucide-react";

export default function SupportSection() {
  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="card-surface mx-auto max-w-4xl p-8 text-center sm:p-12">
          <p className="section-label">{SUPPORT.label}</p>
          <h2 className="display-heading mt-3 text-3xl sm:text-4xl">{SUPPORT.title}</h2>
          <p className="mt-3 text-brand-muted">{SUPPORT.subtitle}</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {SUPPORT.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-brand">{stat.value}</p>
                <p className="mt-1 text-sm text-brand-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <a href={`mailto:${SUPPORT.cta}`} className="btn-primary mt-10 inline-flex">
            <Mail className="h-4 w-4" />
            {SUPPORT.cta}
          </a>
        </div>
      </Container>
    </section>
  );
}
