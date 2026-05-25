"use client";

import { useState } from "react";

const TESTIMONIALS = [
  {
    name: "Marco R.",
    role: "Milano · Acquirente privato",
    text: "Stavo per comprare una Audi A3 usata. Il report ha mostrato due sinistri non dichiarati. Ho evitato un acquisto rischioso.",
  },
  {
    name: "Giulia P.",
    role: "Roma · Acquirente",
    text: "Il venditore garantiva chilometri originali. Il report ha evidenziato incongruenze. Ho risparmiato tempo e soldi.",
  },
  {
    name: "Antonio L.",
    role: "Napoli · Rivenditore",
    text: "Controllo ogni veicolo prima di acquistarlo. Più completo di altri servizi che avevo provato in passato.",
  },
];

export function ReportPreviewTestimonials() {
  const [active, setActive] = useState(0);
  const current = TESTIMONIALS[active];

  return (
    <section className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Si fidano di noi
            </p>
            <h2 className="mb-6 text-[32px] font-light leading-[1.05] tracking-[-0.02em] text-slate-950 md:text-[44px]">
              <span className="tabular-nums">15.000+</span>
              <span className="block italic text-slate-400">acquirenti più sereni.</span>
            </h2>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-[36px] font-light tracking-tight text-slate-950 tabular-nums">4,7</span>
              <span className="text-[14px] font-medium text-slate-400">/ 5</span>
            </div>
          </div>

          <div className="md:col-span-8">
            <figure>
              <blockquote className="text-[18px] leading-relaxed text-slate-700 md:text-[22px]">
                &ldquo;{current.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-slate-500">
                <span className="font-semibold text-slate-900">{current.name}</span>
                <span className="mx-2 text-slate-300">·</span>
                {current.role}
              </figcaption>
            </figure>
            <div className="mt-8 flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`h-2 w-2 rounded-full ${idx === active ? "bg-slate-900" : "bg-slate-200"}`}
                  aria-label={`Testimonianza ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
