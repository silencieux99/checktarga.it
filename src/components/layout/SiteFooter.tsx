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
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Servizio indipendente di verifica storico veicoli in Italia. Trasparenza prima
              dell&apos;acquisto.
            </p>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="mt-4 inline-block text-sm text-brand-accent hover:text-emerald-400"
            >
              {SITE.supportEmail}
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
                      className="text-sm text-slate-400 transition-colors hover:text-white"
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
