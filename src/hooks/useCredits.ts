"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useCredits() {
  const { user, firebaseUser } = useAuth();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user || !firebaseUser) {
      setCredits(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch("/api/account/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCredits(data.total ?? 0);
    } catch {
      setCredits(0);
    } finally {
      setLoading(false);
    }
  }, [user, firebaseUser]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return { credits, loading, fetchCredits, refresh: fetchCredits };
}
