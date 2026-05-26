import type { Metadata } from "next";
import AccountClient from "./AccountClient";
import { SITE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: `Area personale | ${SITE.name}`,
  description: "Gestisci i tuoi crediti e genera report veicolo su CheckTarga.it",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountClient />;
}
