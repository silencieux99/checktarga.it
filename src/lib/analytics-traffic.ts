export function classifyTrafficSource(
  search: string,
  referrer: string,
  bodyGclid?: string | null
): string {
  const params = new URLSearchParams(search);
  const source = (params.get("utm_source") || "").toLowerCase();
  const medium = (params.get("utm_medium") || "").toLowerCase();
  const campaign = (params.get("utm_campaign") || "").toLowerCase();
  const cleanSearch = search.toLowerCase();
  const gclidPresent = !!bodyGclid || cleanSearch.includes("gclid");

  if (gclidPresent || cleanSearch.includes("wbraid") || cleanSearch.includes("gbraid")) {
    if (medium.includes("display") || campaign.includes("display") || campaign.includes("gdn")) {
      return "Google Ads Display";
    }
    return "Google Ads Search";
  }

  if (cleanSearch.includes("ttclid") || source.includes("tiktok") || referrer.includes("tiktok.com")) {
    return "TikTok Ads";
  }

  if (
    cleanSearch.includes("fbclid") ||
    source.includes("facebook") ||
    source.includes("instagram") ||
    source.includes("meta")
  ) {
    return "Meta Ads";
  }

  if (source.includes("google")) {
    if (medium.includes("display") || campaign.includes("display")) return "Google Ads Display";
    if (medium.includes("search") || medium.includes("cpc")) return "Google Ads Search";
    return "Google Ads";
  }

  if (source.includes("bing") || cleanSearch.includes("msclkid")) {
    return "Microsoft Ads";
  }

  if (referrer) {
    const ref = referrer.toLowerCase();
    if (ref.includes("google.")) return "SEO Google";
    if (ref.includes("bing.")) return "SEO Bing";
    if (ref.includes("checktarga.it")) return "Interno";
    return "Referral";
  }

  if (!source && !medium && !campaign) {
    return "Direct";
  }

  if (source) {
    return `Campagna ${source.charAt(0).toUpperCase()}${source.slice(1)}`;
  }

  return "Altro";
}
