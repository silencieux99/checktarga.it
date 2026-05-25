import { AlertTriangle, FileSearch, Scale, ShieldCheck } from "lucide-react";
import Container from "@/components/Container";

export default function SpecialDetectionSection() {
  return (
    <section className="border-t border-slate-100 bg-white py-16 md:py-24">
      <Container>
        <div className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
            <FileSearch className="h-3.5 w-3.5" />
            Esclusiva 2026
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Controlli amministrativi avanzati
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Il nostro motore non si limita allo storico: analizza segnali amministrativi deboli per
            rivelare ciò che talvolta viene omesso in fase di vendita.
          </p>
        </div>

        <div className="relative mx-auto mb-16 max-w-2xl">
          <div className="absolute inset-0 scale-75 transform rounded-full bg-blue-600/10 blur-3xl" />
          <div className="relative group">
            <div className="relative z-10 rotate-2 overflow-hidden rounded-2xl border-4 border-white shadow-2xl transition-all duration-500 group-hover:rotate-0">
              <div className="aspect-[16/10] bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-8">
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white/80 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Libretto / visura PRA
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">Targa: GA 482 LM</div>
                    <div className="rounded-lg bg-slate-50 p-3">VIN: ZFA***********</div>
                    <div className="rounded-lg bg-slate-50 p-3">PRA: Verificato</div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">Stato: OK</div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 w-full animate-[scan_3s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
              <div className="absolute left-0 top-0 h-[2px] w-full animate-[scan_3s_ease-in-out_infinite] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
            </div>

            <div className="absolute -bottom-5 -right-5 z-20 flex animate-[bounce_3s_infinite] items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
              <div className="relative h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Stato
                </div>
                <div className="text-xs font-bold text-slate-800">Conforme</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5">
            <div className="absolute right-0 top-0 p-6 opacity-[0.03] transition-opacity group-hover:opacity-10">
              <Scale className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 transition-transform duration-300 group-hover:scale-110">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                Passaggi PRA sospetti
              </h3>
              <p className="mb-6 leading-relaxed text-slate-600">
                Una sequenza rapida di passaggi tra intermediari può indicare un veicolo
                problematico o tentativi di occultare la provenienza reale. Analizziamo tempi e
                catena di proprietà.
              </p>
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-700">Tempi di detenzione anomali</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-700">Interruzioni nella catena PRA</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
            <div className="absolute right-0 top-0 p-6 opacity-[0.03] transition-opacity group-hover:opacity-10">
              <FileSearch className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-transform duration-300 group-hover:scale-110">
                <ShieldCheck className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                Leasing, pegno e vincoli
              </h3>
              <p className="mb-6 leading-relaxed text-slate-600">
                Non puoi vendere legalmente un veicolo sotto leasing attivo o gravato da ipoteca
                senza autorizzazione. Verifichiamo lo stato amministrativo reale prima che tu
                paghi.
              </p>
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-700">Contratti di noleggio in corso</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-700">Fermo amministrativo e opposizioni</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
