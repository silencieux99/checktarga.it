import { NextRequest, NextResponse } from "next/server";
import { COMPANY } from "@/lib/company";
import { SITE } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Compila tutti i campi" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    console.info("[contact]", {
      company: COMPANY.legalName,
      name: name.trim(),
      email: email.trim(),
      message: message.trim().slice(0, 2000),
      to: SITE.supportEmail,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json({ error: "Errore durante l'invio" }, { status: 500 });
  }
}
