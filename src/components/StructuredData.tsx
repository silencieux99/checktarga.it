import { SITE } from "@/lib/pricing";
import { BASE_URL, SEO } from "@/lib/seo";

export default function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: BASE_URL,
    logo: `${BASE_URL}/apple-icon`,
    email: SITE.supportEmail,
    areaServed: {
      "@type": "Country",
      name: "Italia",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: BASE_URL,
    description: SEO.description,
    inLanguage: "it-IT",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Report storico veicolo",
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: BASE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Italia",
    },
    serviceType: "Verifica storico auto usata",
    description: SEO.description,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/prezzi`,
      priceCurrency: SITE.currency.toUpperCase(),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
    </>
  );
}
