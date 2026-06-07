"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { FAQ_ITEMS } from "@/lib/site-content";
import { ChevronDown } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 section-padding bg-brand-surface">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Domande frequenti</p>
          <h2 className="display-heading mt-3 text-3xl sm:text-4xl">
            Tutto quello che devi sapere
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="card-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-brand">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-muted transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-brand-border px-6 pb-5 pt-2">
                    <p className="text-sm leading-relaxed text-brand-muted">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
