"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Container from "@/components/Container";
import Logo from "@/components/brand/Logo";
import PageLoader from "@/components/PageLoader";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/account");
    } catch {
      setError("Accesso non riuscito. Verifica email e password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <Container className="flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Logo size="lg" href="/" className="justify-center" />
            <h1 className="display-heading mt-6 text-3xl">
              Accedi al tuo account
            </h1>
            <p className="mt-2 text-sm text-brand-muted">
              Usa le credenziali ricevute via email dopo l&apos;acquisto.
            </p>
          </div>

          <form className="card-surface p-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
                placeholder="nome@email.it"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
                placeholder="La tua password"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Accesso in corso...
                </span>
              ) : (
                "Accedi"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Non hai ancora un account?{" "}
            <Link href="/prezzi" className="font-semibold text-brand-accent hover:text-brand-accent-hover">
              Acquista un pacchetto report
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader fullScreen message="Caricamento..." />}>
      <LoginContent />
    </Suspense>
  );
}
