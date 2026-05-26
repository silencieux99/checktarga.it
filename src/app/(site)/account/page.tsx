import type { Metadata } from "next";
import AccountClient from "./AccountClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Area personale",
  description: "Gestisci i tuoi crediti e genera report veicolo su CheckTarga.it.",
  path: "/account",
  noIndex: true,
});

export default function AccountPage() {
  return <AccountClient />;
}
