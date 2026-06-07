"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "@/components/Container";
import Logo from "@/components/brand/Logo";
import SiteAuthActions from "@/components/SiteAuthActions";
import { NAV_LINKS } from "@/lib/site-content";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-brand-border/80 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-[72px]">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <SiteAuthActions variant="site-desktop" />
          <Link href="/#hero" className="btn-accent px-5 py-2.5 text-sm">
            Verifica veicolo
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-brand lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-brand-border bg-white px-4 py-5 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-brand hover:bg-brand-surface"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <SiteAuthActions variant="site-mobile" onNavigate={() => setOpen(false)} />
            <Link
              href="/#hero"
              className="btn-accent mt-3 text-center"
              onClick={() => setOpen(false)}
            >
              Verifica veicolo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
