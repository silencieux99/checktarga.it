import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Report veicolo",
  noIndex: true,
});

export default function InformeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
