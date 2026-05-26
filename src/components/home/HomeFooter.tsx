import Link from "next/link";
import Container from "@/components/Container";
import { SITE } from "@/lib/pricing";

const COLUMNS = [
  {
    title: "Soluzioni",
    links: [
      { label: "Report singolo", href: "/prezzi" },
      { label: "Pacchetti report", href: "/prezzi" },
      { label: "Esempio report", href: "/esempio-report" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Marche",
    links: [
      { label: "Report Fiat", href: "/prezzi" },
      { label: "Report Volkswagen", href: "/prezzi" },
      { label: "Report Ford", href: "/prezzi" },
      { label: "Report Renault", href: "/prezzi" },
      { label: "Report BMW", href: "/prezzi" },
    ],
  },
  {
    title: "Supporto",
    links: [
      { label: "Contattaci", href: `mailto:${SITE.supportEmail}` },
      { label: "Blog", href: "/blog" },
      { label: "Accedi", href: "/login" },
      { label: "Il mio account", href: "/account" },
    ],
  },
  {
    title: "Legale",
    links: [
      { label: "Termini", href: "/termini" },
      { label: "Note legali", href: "/note-legali" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function HomeFooter() {
  return (
    <footer className="bg-slate-950 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container className="px-4">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 mb-4 sm:col-span-4 lg:col-span-1 lg:mb-0">
              <Link href="/" className="mb-4 inline-block text-xl font-bold">
                CheckTarga<span className="text-blue-400">.it</span>
              </Link>
              <p className="max-w-xs text-[13px] leading-relaxed text-slate-500">
                Servizio indipendente di verifica storico veicoli in Italia. Trasparenza prima
                dell&apos;acquisto.
              </p>
              <a
                href={`mailto:${SITE.supportEmail}`}
                className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
              >
                {SITE.supportEmail}
              </a>
            </div>

            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-semibold text-white">{column.title}</h3>
                <ul className="space-y-3">
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
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CheckTarga.it — Tutti i diritti riservati
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            <span className="rounded border border-white/10 px-1.5 py-0.5">Visa</span>
            <span className="rounded border border-white/10 px-1.5 py-0.5">Mastercard</span>
            <span className="rounded border border-white/10 px-1.5 py-0.5">Stripe</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
