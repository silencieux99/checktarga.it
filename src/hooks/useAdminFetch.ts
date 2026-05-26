"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export class AdminApiError extends Error {
  indexUrl?: string;

  constructor(message: string, indexUrl?: string) {
    super(message);
    this.name = "AdminApiError";
    this.indexUrl = indexUrl;
  }
}

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
        if (data.error === "Firestore index required") {
          if (data.indexUrl) {
            console.error("Firestore index required:", data.indexUrl);
          } else if (data.message) {
            console.error("Firestore index required:", data.message);
          }
          throw new AdminApiError(
            data.details || data.message || "Indice Firestore richiesto",
            data.indexUrl
          );
        }
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
