"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type SiteAuthActionsProps = {
  variant: "home-desktop" | "home-mobile" | "site-nav" | "site-mobile" | "site-desktop";
  onNavigate?: () => void;
};

export default function SiteAuthActions({ variant, onNavigate }: SiteAuthActionsProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    onNavigate?.();
    router.push("/");
  };

  const desktopClass =
    "rounded-lg px-3.5 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand";
  const mobileClass =
    "rounded-xl px-3 py-3 text-sm font-medium text-brand hover:bg-brand-surface";

  if (variant === "site-desktop" || variant === "home-desktop") {
    return (
      <div className="flex items-center gap-1">
        {!user && (
          <Link href="/login" className={desktopClass}>
            Accedi
          </Link>
        )}
        <Link href="/account" className={desktopClass}>
          {user ? "Il mio account" : "Area personale"}
        </Link>
        {user && (
          <button type="button" onClick={handleSignOut} className={desktopClass}>
            Esci
          </button>
        )}
      </div>
    );
  }

  if (variant === "site-mobile" || variant === "home-mobile") {
    return (
      <>
        {!user && (
          <Link href="/login" className={mobileClass} onClick={onNavigate}>
            Accedi
          </Link>
        )}
        <Link href="/account" className={mobileClass} onClick={onNavigate}>
          {user ? "Il mio account" : "Area personale"}
        </Link>
        {user && (
          <button type="button" onClick={handleSignOut} className={`${mobileClass} w-full text-left`}>
            Esci
          </button>
        )}
      </>
    );
  }

  if (variant === "site-nav") {
    return (
      <>
        {!user && (
          <Link href="/login" className="hover:text-brand-accent">
            Accedi
          </Link>
        )}
        <Link href="/account" className="hover:text-brand-accent">
          {user ? "Il mio account" : "Area personale"}
        </Link>
        {user && (
          <button type="button" onClick={handleSignOut} className="hover:text-brand-accent">
            Esci
          </button>
        )}
      </>
    );
  }

  return null;
}
