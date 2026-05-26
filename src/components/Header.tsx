import Link from "next/link";
import { SITE } from "@/lib/pricing";

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm">
            CT
          </span>
          <span>
            {SITE.name}
            <span className="text-blue-600">.it</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/esempio-report" className="hover:text-blue-600">
            Esempio report
          </Link>
          <Link href="/prezzi" className="hover:text-blue-600">
            Prezzi
          </Link>
          <Link href="/login" className="hover:text-blue-600">
            Accedi
          </Link>
          <Link href="/account" className="hover:text-blue-600">
            Il mio account
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 md:hidden">
            Accedi
          </Link>
          <Link href="/account" className="text-sm font-medium text-slate-600 hover:text-blue-600 md:hidden">
            Account
          </Link>
          <Link
            href="/prezzi"
            className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors sm:px-4"
          >
            Verifica ora
          </Link>
        </div>
      </div>
    </header>
  );
}
