import Link from "next/link";
import Container from "@/components/Container";
import Logo from "@/components/brand/Logo";
import { FOOTER_COLUMNS } from "@/lib/site-content";
import { SITE } from "@/lib/pricing";

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-border bg-brand text-white">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size="lg" variant="inverse" href="/" />
            <div className="mt-4 max-w-sm space-y-2 text-sm leading-relaxed text-white/90">
              <p className="font-semibold text-white">VisuraVeicolo.it</p>
              <p>Servizio privato e indipendente</p>
              <p className="text-white/80">
                Non affiliato ad ACI, PRA, Motorizzazione Civile o enti pubblici
              </p>
              <p className="text-white/80">
                Le informazioni disponibili possono variare in base al veicolo e alle fonti consultabili.
              </p>
              <p className="text-white/80">BILL XIX LIMITED</p>
            </div>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="mt-4 inline-block text-sm font-semibold text-brand-accent hover:text-emerald-400"
            >
              Support: {SITE.supportEmail}
            </a>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CheckTarga.it — Tutti i diritti riservati
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            <span className="rounded border border-white/10 px-2 py-1">Visa</span>
            <span className="rounded border border-white/10 px-2 py-1">Mastercard</span>
            <span className="rounded border border-white/10 px-2 py-1">Stripe</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
