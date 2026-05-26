"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "ct_session_id";
const VISIT_LOGGED_KEY = "ct_visit_logged";
const TRAFFIC_SOURCE_KEY = "ct_traffic_source";

function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

function sendHeartbeat(sessionId: string, path: string) {
  fetch("/api/analytics/heartbeat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      ts: Date.now(),
      ua: navigator.userAgent,
      path,
      country: "IT",
    }),
    keepalive: true,
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const sessionId = getSessionId();
    if (!sessionId) return;

    const path = window.location.pathname + window.location.search;
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;

    sendHeartbeat(sessionId, path);

    let alreadyLogged = false;
    try {
      alreadyLogged = sessionStorage.getItem(VISIT_LOGGED_KEY) === "1";
    } catch {
      alreadyLogged = false;
    }

    if (alreadyLogged) {
      const interval = window.setInterval(() => {
        sendHeartbeat(sessionId, window.location.pathname + window.location.search);
      }, 15_000);

      return () => {
        window.clearInterval(interval);
        try {
          navigator.sendBeacon?.(
            "/api/analytics/heartbeat",
            new Blob(
              [
                JSON.stringify({
                  sessionId,
                  ts: Date.now(),
                  ua: navigator.userAgent,
                  path: window.location.pathname + window.location.search,
                  country: "IT",
                }),
              ],
              { type: "application/json" }
            )
          );
        } catch {
          // ignore
        }
      };
    }

    let isDoubleClick = false;
    let currentGclid: string | null = null;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      currentGclid = urlParams.get("gclid");
      if (currentGclid) {
        const storageKey = "ct_gclids";
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        let storedGclids: Record<string, number> = {};
        try {
          storedGclids = JSON.parse(localStorage.getItem(storageKey) || "{}");
        } catch {
          storedGclids = {};
        }
        Object.keys(storedGclids).forEach((gclid) => {
          if (now - storedGclids[gclid] > oneDay) delete storedGclids[gclid];
        });
        if (storedGclids[currentGclid]) {
          isDoubleClick = true;
        } else {
          storedGclids[currentGclid] = now;
        }
        localStorage.setItem(storageKey, JSON.stringify(storedGclids));
      }
    } catch {
      // ignore storage errors
    }

    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        path,
        search: window.location.search,
        referrer: document.referrer || "",
        ts: Date.now(),
        ua: navigator.userAgent,
        isDoubleClick,
        gclid: currentGclid,
        country: "IT",
      }),
      keepalive: true,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.trafficSource) {
          sessionStorage.setItem(TRAFFIC_SOURCE_KEY, data.trafficSource);
        }
        if (data?.ok) {
          sessionStorage.setItem(VISIT_LOGGED_KEY, "1");
        }
      })
      .catch(() => {});

    const interval = window.setInterval(() => {
      sendHeartbeat(sessionId, window.location.pathname + window.location.search);
    }, 15_000);

    return () => {
      window.clearInterval(interval);
      try {
        navigator.sendBeacon?.(
          "/api/analytics/heartbeat",
          new Blob(
            [
              JSON.stringify({
                sessionId,
                ts: Date.now(),
                ua: navigator.userAgent,
                path: window.location.pathname + window.location.search,
                country: "IT",
              }),
            ],
            { type: "application/json" }
          )
        );
      } catch {
        // ignore
      }
    };
  }, [pathname]);

  return null;
}
