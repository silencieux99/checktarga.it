import type { Metadata } from "next";
import { SITE } from "@/lib/pricing";

export const BASE_URL = `https://${SITE.domain}`;

export const SEO = {
  titleDefault: `${SITE.name} — Storico veicolo e verifica targa`,
  titleTemplate: `%s | ${SITE.name}`,
  description:
    "Controlla lo storico di un'auto usata in Italia: chilometri, sinistri, revisioni e dati PRA prima di firmare. Report completo per targa o VIN.",
  keywords: [
    "verifica targa",
    "storico auto usata",
    "controllo chilometri",
    "report veicolo Italia",
    "verifica VIN",
    "PRA auto usata",
    "sinistri auto",
    "revisioni veicolo",
    "CheckTarga",
  ],
  locale: "it_IT",
  themeColor: "#2563eb",
} as const;

export const PUBLIC_ROUTES = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/prezzi", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/esempio-report", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/note-legali", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/termini", changeFrequency: "yearly" as const, priority: 0.3 },
];

interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description = SEO.description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = path ? `${BASE_URL}${path}` : BASE_URL;

  return {
    title,
    description,
    alternates: path ? { canonical: path } : { canonical: "/" },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      locale: SEO.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SEO.titleDefault,
    template: SEO.titleTemplate,
  },
  description: SEO.description,
  keywords: [...SEO.keywords],
  authors: [{ name: SITE.name, url: BASE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  applicationName: SITE.name,
  category: "automotive",
  alternates: {
    canonical: "/",
    languages: {
      "it-IT": BASE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
    shortcut: ["/icon"],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: SEO.titleDefault,
    description: SEO.description,
    url: BASE_URL,
    siteName: SITE.name,
    locale: SEO.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.titleDefault,
    description: SEO.description,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  other: {
    "geo.region": "IT",
    "geo.placename": "Italia",
  },
};
