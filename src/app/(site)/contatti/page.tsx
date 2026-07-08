import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contatti",
  description: "Contatta MG COMPANY DAYA LTD per assistenza su CheckTarga.it.",
  path: "/contatti",
});

export { default } from "./ContattiClient";
