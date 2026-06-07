"use client";

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Ordini" },
  { href: "/admin/subscriptions", label: "Abbonamenti" },
  { href: "/admin/clients", label: "Clienti" },
  { href: "/admin/users", label: "Utenti" },
  { href: "/admin/reports", label: "Report" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean) {
  return active
    ? "bg-blue-600 text-white"
    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white";
}

export default function AdminHeader() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
          <Logo size="sm" variant="admin" href="/admin" />

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white sm:inline"
            >
              Sito
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="hidden rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 sm:inline"
            >
              Esci
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 sm:hidden"
              aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${navLinkClass(active)}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {mobileOpen ? (
          <div className="border-t border-white/10 py-3 sm:hidden">
            <div className="grid gap-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                Vai al sito
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-red-300 hover:bg-red-500/10"
              >
                Esci
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
