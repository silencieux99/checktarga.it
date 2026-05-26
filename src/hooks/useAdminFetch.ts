"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export function useAdminFetch() {
  const { firebaseUser } = useAuth();

  const adminRequest = useCallback(
    async (path: string, init?: RequestInit) => {
      if (!firebaseUser) {
        throw new Error("Non autenticato");
      }
      const token = await firebaseUser.getIdToken();
      const res = await fetch(path, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(init?.body ? { "Content-Type": "application/json" } : {}),
          ...init?.headers,
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Errore API (${res.status})`);
      }
      return data;
    },
    [firebaseUser]
  );

  const fetchAdmin = useCallback(
    async (path: string) => adminRequest(path),
    [adminRequest]
  );

  return { fetchAdmin, adminRequest, firebaseUser };
}
