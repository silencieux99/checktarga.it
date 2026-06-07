import Container from "@/components/Container";
import { STATS } from "@/lib/site-content";

export default function StatsSection() {
  return (
    <section className="section-padding bg-brand text-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {STATS.label}
          </p>
          <h2 className="display-heading mt-3 text-3xl text-white sm:text-4xl lg:text-5xl">
            {STATS.title}
            <br />
            <span className="font-semibold text-brand-accent">{STATS.titleAccent}</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
            >
              <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
