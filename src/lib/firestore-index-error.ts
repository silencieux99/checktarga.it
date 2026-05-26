import { NextResponse } from "next/server";

export function isFirestoreIndexError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: number | string; message?: string };
  return (
    err.code === 9 ||
    err.code === "FAILED_PRECONDITION" ||
    Boolean(err.message?.toLowerCase().includes("index"))
  );
}

export function extractFirestoreIndexUrl(error: unknown): string | null {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const match = message.match(/https:\/\/console\.firebase\.google\.com[^\s)]+/);
  return match ? match[0] : null;
}

export function getFirestoreIndexErrorPayload(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const indexUrl = extractFirestoreIndexUrl(error);

  return {
    error: "Firestore index required",
    message,
    indexUrl,
    details:
      "Questa query richiede un indice Firestore. Apri il link qui sotto per crearlo nella console Firebase.",
  };
}

export function firestoreApiErrorResponse(error: unknown, scope: string) {
  console.error(scope, error);
  if (isFirestoreIndexError(error)) {
    return NextResponse.json(getFirestoreIndexErrorPayload(error), { status: 400 });
  }
  return NextResponse.json({ error: "Errore interno" }, { status: 500 });
}
