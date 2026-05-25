import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import Container from "@/components/Container";

export default function PressTeaser() {
  return (
    <section className="border-t border-slate-100 bg-white py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Star className="h-3.5 w-3.5 fill-current" />
              Stampa e media
            </div>

            <h2 className="mb-6 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Ne parlano <span className="text-blue-600">i media</span>
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              CheckTarga sta cambiando il modo di comprare auto usate in Italia. Scopri perché
              giornalisti e specialisti consigliano una verifica prima di firmare il passaggio di
              proprietà.
            </p>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
            >
              Leggi le recensioni e guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-blue-100/50 to-slate-100/50 opacity-50 blur-3xl" />

            <div className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:p-8">
              <div className="mb-6">
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-amber-400" />
                  ))}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  &ldquo;Finalmente trasparenza nell&apos;usato italiano&rdquo;
                </h3>
                <p className="italic text-slate-500">
                  &ldquo;...permette a chiunque di verificare la storia di un&apos;auto prima di
                  consegnare un assegno al venditore.&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                    <span className="text-xs font-bold text-slate-900">QR</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-slate-900">Quattroruote</div>
                    <div className="text-xs text-slate-500">Guida all&apos;acquisto</div>
                  </div>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  Consigliato
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-100 pt-8">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-slate-400">
            Si fidano del nostro approccio
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 md:gap-16">
            {["Auto.it", "Alvolante", "Motor1", "Repubblica"].map((name) => (
              <span key={name} className="text-lg font-bold text-slate-400">
                {name}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
