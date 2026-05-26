import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function parseServiceAccount(): Record<string, string> | null {
  const inline = process.env.FIREBASE_ADMIN_KEY;
  if (inline) {
    try {
      return JSON.parse(inline);
    } catch {
      return null;
    }
  }
  return null;
}

export function getAdminApp(): App | null {
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  const serviceAccount = parseServiceAccount();
  if (serviceAccount) {
    adminApp = initializeApp({ credential: cert(serviceAccount) });
    return adminApp;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    adminApp = initializeApp();
    return adminApp;
  }

  return null;
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  if (adminDb) return adminDb;

  adminDb = getFirestore(app);
  try {
    adminDb.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    // Firestore may already be initialized (e.g. Next.js HMR or prior getFirestore use).
    console.warn("[firebase-admin] Firestore settings skipped:", error);
  }

  return adminDb;
}

export function getAdminAuth() {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export async function verifyFirebaseToken(token: string) {
  const auth = getAdminAuth();
  if (!auth) return null;
  try {
    return await auth.verifyIdToken(token);
  } catch {
    return null;
  }
}

const adminTokenCache = new Map<string, { isAdmin: boolean; expires: number }>();

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function verifyAdmin(token: string): Promise<boolean> {
  if (process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true") {
    return true;
  }

  const cached = adminTokenCache.get(token);
  if (cached && cached.expires > Date.now()) {
    return cached.isAdmin;
  }

  const auth = getAdminAuth();
  if (!auth) return false;

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userEmail = (decodedToken.email || "").toLowerCase();
    const isAdmin =
      decodedToken.admin === true || getAdminEmails().includes(userEmail);

    adminTokenCache.set(token, {
      isAdmin,
      expires: Date.now() + 5 * 60 * 1000,
    });

    if (adminTokenCache.size > 100) {
      const oldestKey = adminTokenCache.keys().next().value;
      if (oldestKey) adminTokenCache.delete(oldestKey);
    }

    return isAdmin;
  } catch {
    adminTokenCache.set(token, {
      isAdmin: false,
      expires: Date.now() + 60 * 1000,
    });
    return false;
  }
}

export async function requireAdminToken(token: string | null | undefined) {
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  const isAdmin = await verifyAdmin(token);
  if (!isAdmin) {
    throw new Error("FORBIDDEN");
  }
}
