import { COMPANY, COMPANY_FULL_ADDRESS } from "@/lib/company";
import { SITE } from "@/lib/pricing";
import { BASE_URL, SEO } from "@/lib/seo";

export default function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: COMPANY.legalName,
    url: BASE_URL,
    logo: `${BASE_URL}/apple-icon`,
    email: SITE.supportEmail,
    identifier: COMPANY.companyNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.addressLines.slice(0, 2).join(", "),
      addressLocality: COMPANY.addressLines[2],
      postalCode: COMPANY.addressLines[3],
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "Country",
      name: "Italia",
    },
    description:
      "Servizio privato e indipendente per consultare lo storico disponibile di un veicolo tramite targa o VIN.",
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
      name: COMPANY.legalName,
      url: BASE_URL,
    },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Report storico veicolo",
    provider: {
      "@type": "Organization",
      name: COMPANY.legalName,
      url: BASE_URL,
      address: COMPANY_FULL_ADDRESS,
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
