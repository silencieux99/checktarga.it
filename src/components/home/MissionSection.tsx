import Link from "next/link";
import Container from "@/components/Container";
import { MISSION } from "@/lib/site-content";
import { ShieldCheck } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="section-label">{MISSION.label}</p>
            <h2 className="display-heading mt-3 text-3xl sm:text-4xl">{MISSION.title}</h2>
            <div className="mt-6 space-y-4 text-brand-muted">
              {MISSION.paragraphs.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            <Link href="/#hero" className="btn-accent mt-8">
              {MISSION.cta}
            </Link>
          </div>

          <div className="card-surface border-brand-accent/20 bg-emerald-50/30 p-8">
            <div className="inline-flex rounded-xl bg-brand-accent p-3 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-brand">Garanzia soddisfatti o rimborsati</h3>
            <p className="mt-3 leading-relaxed text-brand-muted">{MISSION.guarantee}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
