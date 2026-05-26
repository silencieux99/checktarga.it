"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type SiteAuthActionsProps = {
  variant: "home-desktop" | "home-mobile" | "site-nav" | "site-mobile";
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

  if (variant === "home-desktop") {
    return (
      <>
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
        {user && (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Esci
          </button>
        )}
      </>
    );
  }

  if (variant === "home-mobile") {
    return (
      <>
        {!user && (
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onNavigate}
          >
            Accedi
          </Link>
        )}
        <Link
          href="/account"
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onClick={onNavigate}
        >
          {user ? "Il mio account" : "Area personale"}
        </Link>
        {user && (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
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
          <Link href="/login" className="hover:text-blue-600">
            Accedi
          </Link>
        )}
        <Link href="/account" className="hover:text-blue-600">
          {user ? "Il mio account" : "Area personale"}
        </Link>
        {user && (
          <button
            type="button"
            onClick={handleSignOut}
            className="hover:text-blue-600"
          >
            Esci
          </button>
        )}
      </>
    );
  }

  return (
    <>
      {!user && (
        <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
          Accedi
        </Link>
      )}
      <Link href="/account" className="text-sm font-medium text-slate-600 hover:text-blue-600">
        Account
      </Link>
      {user && (
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          Esci
        </button>
      )}
    </>
  );
}
