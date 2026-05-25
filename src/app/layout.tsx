import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/pricing";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Storico veicolo e verifica targa`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Controlla lo storico di un'auto usata in Italia: chilometri, sinistri, revisioni e dati PRA prima di firmare.",
  metadataBase: new URL(`https://${SITE.domain}`),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
