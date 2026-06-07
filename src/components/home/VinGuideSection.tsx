import Link from "next/link";
import Container from "@/components/Container";
import { VIN_GUIDE } from "@/lib/site-content";
import { Car, DoorOpen, FileText, Gauge } from "lucide-react";

const LOCATION_ICONS = [Gauge, DoorOpen, Car, FileText];

export default function VinGuideSection() {
  return (
    <section id="dove-trovo-vin" className="scroll-mt-20 section-padding bg-brand-surface">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="section-label">{VIN_GUIDE.label}</p>
            <h2 className="display-heading mt-3 text-3xl sm:text-4xl">{VIN_GUIDE.title}</h2>
            <p className="mt-4 leading-relaxed text-brand-muted">{VIN_GUIDE.description}</p>
            <Link href="/#hero" className="btn-accent mt-8">
              {VIN_GUIDE.cta}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {VIN_GUIDE.locations.map((location, index) => {
              const Icon = LOCATION_ICONS[index];
              return (
                <article key={location.title} className="card-surface p-5">
                  <div className="mb-3 inline-flex rounded-lg bg-emerald-50 p-2.5 text-brand-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-brand">{location.title}</h3>
                  <p className="mt-1.5 text-sm text-brand-muted">{location.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
