"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AddCreditsModal from "@/components/admin/AddCreditsModal";
import Link from "next/link";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface AdminUser {
  id: string;
  email: string;
  credits: number;
  createdAt: number;
  disabled: boolean;
  guestCheckout?: boolean;
}

interface UsersResponse {
  users: AdminUser[];
  stats: { total: number; withCredits: number; disabled: number };
}

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("it-IT");
}

function AdminUsersContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const { fetchAdmin, adminRequest, firebaseUser } = useAdminFetch();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({ total: 0, withCredits: 0, disabled: 0 });
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<"all" | "credits" | "disabled">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = async (query = search) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "300" });
      if (query.trim()) params.set("search", query.trim());
      const data = (await fetchAdmin(`/api/admin/users?${params}`)) as UsersResponse;
      setUsers(data.users || []);
      setStats(data.stats || { total: 0, withCredits: 0, disabled: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di caricamento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firebaseUser) return;
    loadUsers();
  }, [firebaseUser]);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (filter === "credits") list = list.filter((user) => user.credits > 0);
    if (filter === "disabled") list = list.filter((user) => user.disabled);
    return list;
  }, [users, filter]);

  const handleCreditsSubmit = async (payload: {
    mode: "add" | "set";
    amount: number;
    note: string;
  }) => {
    if (!selectedUser) return;
    const data = await adminRequest(`/api/admin/users/${selectedUser.id}/credits`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id ? { ...user, credits: data.total } : user
      )
    );
  };

  const toggleDisable = async (user: AdminUser) => {
    const message = user.disabled
      ? `Riabilitare ${user.email}?`
      : `Disabilitare ${user.email}?`;
    if (!window.confirm(message)) return;

    setActionLoading(user.id);
    try {
      await adminRequest(`/api/admin/users/${user.id}/disable`, {
        method: "POST",
        body: JSON.stringify({ disable: !user.disabled }),
      });
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, disabled: !user.disabled } : item
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Utenti</h1>
          <p className="mt-2 text-slate-400">
            Gestisci crediti, accessi e account registrati.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadUsers()}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
        >
          Aggiorna
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Totale utenti</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Con crediti</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.withCredits}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Disabilitati</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.disabled}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cerca per email..."
          className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-blue-500 md:max-w-md"
        />
        <button
          type="button"
          onClick={() => loadUsers(search)}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Cerca
        </button>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as typeof filter)}
          className="rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="all">Tutti</option>
          <option value="credits">Con crediti</option>
          <option value="disabled">Disabilitati</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Crediti</th>
                <th className="px-4 py-3 font-medium">Creato</th>
                <th className="px-4 py-3 font-medium">Stato</th>
                <th className="px-4 py-3 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Caricamento...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Nessun utente trovato.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="text-white">{user.email}</div>
                      <div className="text-xs text-slate-500">{user.id}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{user.credits}</td>
                    <td className="px-4 py-3 text-slate-300">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.disabled
                            ? "bg-red-500/10 text-red-300"
                            : "bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        {user.disabled ? "Disabilitato" : "Attivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600/30"
                        >
                          Crediti
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === user.id}
                          onClick={() => toggleDisable(user)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                        >
                          {user.disabled ? "Riabilita" : "Disabilita"}
                        </button>
                        <Link
                          href={`/admin/orders?email=${encodeURIComponent(user.email)}`}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                        >
                          Ordini
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser ? (
        <AddCreditsModal
          email={selectedUser.email}
          currentCredits={selectedUser.credits}
          onClose={() => setSelectedUser(null)}
          onSubmit={handleCreditsSubmit}
        />
      ) : null}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
          Caricamento utenti...
        </div>
      }
    >
      <AdminUsersContent />
    </Suspense>
  );
}
