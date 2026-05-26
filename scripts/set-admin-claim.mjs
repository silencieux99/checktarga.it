/**
 * Usage:
 * node scripts/set-admin-claim.mjs user@example.com
 *
 * Requires FIREBASE_ADMIN_KEY or GOOGLE_APPLICATION_CREDENTIALS in env.
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getCredentials() {
  if (process.env.FIREBASE_ADMIN_KEY) {
    return JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  }
  throw new Error("Set FIREBASE_ADMIN_KEY before running this script.");
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/set-admin-claim.mjs user@example.com");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert(getCredentials()) });
}

const auth = getAuth();
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
console.log(`Admin claim set for ${email} (${user.uid})`);
