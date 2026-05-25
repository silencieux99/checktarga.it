"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const ACCIDENT_PHOTOS = [
  { src: "/accident/IMG_0367.jpeg", alt: "Foto sinistro 1" },
  { src: "/accident/IMG_0368.jpeg", alt: "Foto sinistro 2" },
  { src: "/accident/IMG_0369.jpeg", alt: "Foto sinistro 3" },
  { src: "/accident/IMG_0370.jpeg", alt: "Foto sinistro 4" },
];

export default function AccidentReveal() {
  const [selected, setSelected] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setSelected(null), []);
  const nextImage = useCallback(
    () => setSelected((prev) => (prev !== null ? (prev + 1) % ACCIDENT_PHOTOS.length : 0)),
    []
  );
  const prevImage = useCallback(
    () =>
      setSelected((prev) =>
        prev !== null ? (prev - 1 + ACCIDENT_PHOTOS.length) % ACCIDENT_PHOTOS.length : 0
      ),
    []
  );

  useEffect(() => {
    document.body.style.overflow = selected !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, closeLightbox, nextImage, prevImage]);

  return (
    <>
      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center lg:mb-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Esclusiva CheckTarga
            </p>
            <h2 className="mb-5 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Ciò che il venditore
              <br className="sm:hidden" />
              <span className="text-blue-600"> non ti mostrerà mai</span>
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Immagini reali di sinistri passati, quando disponibili nei dossier assicurativi e
              nelle banche dati partner.
            </p>
          </div>

          <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:mb-12 lg:p-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {ACCIDENT_PHOTOS.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setSelected(index)}
                  className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-blue-300 sm:rounded-xl"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 40vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-blue-600/0 transition-colors duration-200 group-hover:bg-blue-600/5" />
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-center text-sm leading-relaxed text-slate-700 sm:text-base">
              <span className="font-semibold text-slate-900">Veicolo segnalato come sinistrato.</span>
              <br className="hidden sm:block" />
              <span className="text-slate-500">
                {" "}
                Senza il nostro report, non avresti mai avuto accesso a queste informazioni.
              </span>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Fonte: partner assicurativo • Identità del veicolo oscurata
          </p>
        </div>
      </section>

      {selected !== null && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black" onClick={closeLightbox}>
          <div className="flex items-center justify-between bg-black/80 px-4 py-3 sm:py-4">
            <span className="text-sm font-medium text-white/70">
              {selected + 1} / {ACCIDENT_PHOTOS.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Chiudi
            </button>
          </div>

          <div
            className="flex flex-1 items-center justify-center px-2 pb-20 sm:px-8 sm:pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={ACCIDENT_PHOTOS[selected].src}
              alt={ACCIDENT_PHOTOS[selected].alt}
              width={1200}
              height={900}
              className="max-h-full max-w-full rounded-lg object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="max-w-[140px] flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              ← Precedente
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="max-w-[140px] flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Successivo →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
