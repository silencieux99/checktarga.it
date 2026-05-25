import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;

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
  return app ? getFirestore(app) : null;
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
