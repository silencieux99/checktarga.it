import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/"],
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/account/",
          "/checkout/",
          "/login/",
          "/informe/",
          "/anteprima-report/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/static/"],
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/account/",
          "/checkout/",
          "/login/",
          "/informe/",
          "/anteprima-report/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
