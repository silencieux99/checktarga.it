"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "@/components/Container";
import { FAQ_ITEMS } from "@/lib/site-content";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-16 lg:py-20">
      <Container className="px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">Domande frequenti</h2>
          <p className="mx-auto max-w-xl text-slate-600">
            Tutto quello che devi sapere prima di verificare la targa.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {FAQ_ITEMS.map((faq, index) => (
            <div key={faq.question} className="overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
              >
                <span className="pr-4 font-medium text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
