import { getAdminAuth, getAdminDb } from "./firebase-admin";
import { PlanSku } from "./pricing";

export async function addCredits(
  uid: string,
  qty: number,
  source: PlanSku,
  note: string
): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore non configurato");

  const ref = db.collection("credits").doc(uid);
  const snap = await ref.get();
  const current = snap.exists ? snap.data()?.total || 0 : 0;

  await ref.set(
    {
      total: current + qty,
      history: [
        ...(snap.data()?.history || []),
        { type: "purchase", qty, source, ts: Date.now(), note },
      ],
    },
    { merge: true }
  );
}

export async function getCredits(uid: string): Promise<number> {
  const db = getAdminDb();
  if (!db) return 0;
  const snap = await db.collection("credits").doc(uid).get();
  return snap.exists ? snap.data()?.total || 0 : 0;
}

export async function consumeCredits(
  uid: string,
  note: string
): Promise<{ ok: boolean; remaining: number }> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore non configurato");

  const ref = db.collection("credits").doc(uid);
  let ok = false;
  let remaining = 0;

  await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    const current = snap.exists ? snap.data()?.total || 0 : 0;
    if (current < 1) {
      remaining = current;
      ok = false;
      return;
    }

    remaining = current - 1;
    ok = true;
    transaction.set(
      ref,
      {
        total: remaining,
        history: [
          ...(snap.data()?.history || []),
          { type: "consume", qty: -1, ts: Date.now(), note },
        ],
      },
      { merge: true }
    );
  });

  return { ok, remaining };
}

export async function refundCredit(uid: string, note: string): Promise<void> {
  await addCredits(uid, 1, "pack2", note);
}

export async function adminAdjustCredits(
  uid: string,
  delta: number,
  note: string
): Promise<{ total: number }> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore non configurato");

  const ref = db.collection("credits").doc(uid);
  let total = 0;

  await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    const current = snap.exists ? snap.data()?.total || 0 : 0;
    total = Math.max(0, current + delta);
    transaction.set(
      ref,
      {
        total,
        history: [
          ...(snap.data()?.history || []),
          {
            type: delta >= 0 ? "purchase" : "consume",
            qty: delta,
            source: "pack2",
            ts: Date.now(),
            note,
          },
        ],
      },
      { merge: true }
    );
  });

  return { total };
}

export async function adminSetCredits(
  uid: string,
  total: number,
  note: string
): Promise<{ total: number }> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore non configurato");

  const safeTotal = Math.max(0, Math.floor(total));
  const ref = db.collection("credits").doc(uid);
  const snap = await ref.get();
  const previous = snap.exists ? snap.data()?.total || 0 : 0;

  await ref.set(
    {
      total: safeTotal,
      history: [
        ...(snap.data()?.history || []),
        {
          type: "purchase",
          qty: safeTotal - previous,
          source: "pack2",
          ts: Date.now(),
          note,
        },
      ],
    },
    { merge: true }
  );

  return { total: safeTotal };
}

export async function ensureGuestUser(email: string): Promise<{
  uid: string;
  newAccount: boolean;
  password?: string;
}> {
  const auth = getAdminAuth();
  const db = getAdminDb();
  if (!auth || !db) throw new Error("Firebase Admin non configurato");

  try {
    const existing = await auth.getUserByEmail(email);
    return { uid: existing.uid, newAccount: false };
  } catch {
    const password = `Targa${Math.floor(Math.random() * 900) + 100}!`;
    const user = await auth.createUser({
      email,
      password,
      displayName: email.split("@")[0],
    });

    await db.collection("users").doc(user.uid).set({
      email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      site: "checktarga.it",
    });

    return { uid: user.uid, newAccount: true, password };
  }
}
