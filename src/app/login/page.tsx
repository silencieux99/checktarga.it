"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Container from "@/components/Container";
import PageLoader from "@/components/PageLoader";
import { useAuth } from "@/context/AuthContext";
import { SITE } from "@/lib/pricing";

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
    <div className="min-h-screen bg-slate-50">
      <Container className="flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-slate-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white text-sm">
                CT
              </span>
              <span>
                {SITE.name}
                <span className="text-blue-600">.it</span>
              </span>
            </Link>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
              Accedi al tuo account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Usa le credenziali ricevute via email dopo l&apos;acquisto.
            </p>
          </div>

          <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" onSubmit={handleSubmit}>
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
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
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
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                placeholder="La tua password"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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
            <Link href="/prezzi" className="font-semibold text-blue-600 hover:text-blue-700">
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
