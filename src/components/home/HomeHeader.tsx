"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/blog", label: "Blog" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/note-legali", label: "Legale" },
];

export default function HomeHeader() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <Container className="flex h-14 items-center justify-between sm:h-20">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm text-white sm:h-10 sm:w-10">
            CT
          </span>
          <span className="text-lg sm:text-xl">
            CheckTarga<span className="text-blue-600">.it</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <div className="mx-4 flex items-center rounded-full border border-slate-200/50 bg-slate-50 p-1 shadow-sm">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="ml-2 flex items-center gap-2">
            {!user && (
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Accedi
              </Link>
            )}
            <Link
              href="/account"
              className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              {user ? "Il mio account" : "Area personale"}
            </Link>
            <Link
              href="/prezzi"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Verifica targa
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </Container>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Accedi
              </Link>
            )}
            <Link
              href="/account"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {user ? "Il mio account" : "Area personale"}
            </Link>
            <Link
              href="/prezzi"
              className="mt-2 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Verifica targa
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
