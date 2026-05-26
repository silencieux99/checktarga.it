import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pagamento completato",
  description: "Conferma del pagamento CheckTarga.it.",
  path: "/checkout/success",
  noIndex: true,
});

export default function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
