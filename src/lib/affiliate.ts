import prospinLinks from "@/data/prospin-links.json";

const COUPON_CODE = "NUNES";

const links: Record<string, string> = prospinLinks;

export function generateAffiliateLink(slug: string, brand: string, model: string): string {
  const prospinUrl = links[slug];
  if (prospinUrl) {
    return `${prospinUrl}?coupon_code=${COUPON_CODE}`;
  }
  const query = encodeURIComponent(`${brand} ${model} raquete tênis`).replace(/%20/g, "+");
  return `https://www.google.com/search?q=${query}&tbm=shop`;
}

export function hasProspinLink(slug: string): boolean {
  return slug in links;
}
