export function generateAffiliateLink(brand: string, model: string): string {
  // Use + for spaces (application/x-www-form-urlencoded style) as expected by Google Shopping
  const query = encodeURIComponent(`${brand} ${model} raquete tênis`).replace(/%20/g, "+");
  return `https://www.google.com/search?q=${query}&tbm=shop`;
}
