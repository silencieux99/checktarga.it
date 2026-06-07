import Container from "@/components/Container";
import { TESTIMONIALS } from "@/lib/site-content";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-brand-surface">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">{TESTIMONIALS.label}</p>
          <h2 className="display-heading mt-3 text-3xl sm:text-4xl">{TESTIMONIALS.title}</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.items.map((item) => (
            <article key={item.name} className="card-surface p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {item.initials}
                </div>
                <div>
                  <p className="font-semibold text-brand">{item.name}</p>
                  <p className="text-xs text-brand-muted">{item.date}</p>
                </div>
                <div className="ml-auto flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
