import { NextRequest } from "next/server";
import { verifyAdmin } from "@/lib/firebase-admin";

export function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1] || null;
}

export async function requireAdminRequest(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) {
    return { ok: false as const, response: Response.json({ error: "Token mancante" }, { status: 401 }) };
  }

  const isAdmin = await verifyAdmin(token);
  if (!isAdmin) {
    return {
      ok: false as const,
      response: Response.json({ error: "Accesso non autorizzato" }, { status: 403 }),
    };
  }

  return { ok: true as const, token };
}
