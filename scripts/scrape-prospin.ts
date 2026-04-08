/**
 * Scrape racket product data from prospin.com.br
 *
 * Usage: npx tsx scripts/scrape-prospin.ts
 * Output: data/prospin-raw.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://www.prospin.com.br/raquetes/tenis";
const OUTPUT_PATH = resolve(__dirname, "..", "data", "prospin-raw.json");
const DELAY_MS = 1000;

interface ProspinProduct {
  name: string;
  url: string;
  image: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function extractProducts(html: string): ProspinProduct[] {
  const products: ProspinProduct[] = [];

  // Product links: <a class="product-item-link" onclick="..." href="URL">Name</a>
  const linkRegex = /<a\s+class="product-item-link"[^>]*href="(https:\/\/www\.prospin\.com\.br\/[^"]+)"[^>]*>([^<]+)<\/a>/g;

  // Product images: <img class="... product-image-photo" ... src="..." alt="...">
  const imgRegex = /<img[^>]*class="[^"]*product-image-photo[^"]*"[^>]*src="([^"]+)"[^>]*>/g;

  // Extract all product links (name + URL)
  const links: { name: string; url: string }[] = [];
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    links.push({ url: linkMatch[1], name: linkMatch[2].trim() });
  }

  // Extract all product images
  const imageUrls: string[] = [];
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    imageUrls.push(imgMatch[1]);
  }

  // Pair links with images (they appear in the same order)
  for (let i = 0; i < links.length; i++) {
    products.push({
      name: links[i].name,
      url: links[i].url,
      image: imageUrls[i] || "",
    });
  }

  return products;
}

function extractMaxPage(html: string): number {
  // Look for pagination links like ?p=2, ?p=3, etc.
  const pageRegex = /[?&]p=(\d+)/g;
  let max = 1;
  let match;
  while ((match = pageRegex.exec(html)) !== null) {
    const page = parseInt(match[1]);
    if (page > max) max = page;
  }
  return max;
}

async function fetchPage(url: string): Promise<string> {
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MyRacket/1.0; +https://myracket.com.br)",
      "Accept": "text/html",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function main() {
  console.log("Scraping Pro Spin rackets...\n");

  // Fetch first page to discover pagination
  const firstPageHtml = await fetchPage(BASE_URL);
  const maxPage = extractMaxPage(firstPageHtml);
  console.log(`  Found ${maxPage} page(s)\n`);

  const allProducts: ProspinProduct[] = [];

  // Process first page
  const firstPageProducts = extractProducts(firstPageHtml);
  allProducts.push(...firstPageProducts);
  console.log(`  Page 1: ${firstPageProducts.length} products`);

  // Process remaining pages
  for (let page = 2; page <= maxPage; page++) {
    await sleep(DELAY_MS);
    const html = await fetchPage(`${BASE_URL}?p=${page}`);
    const products = extractProducts(html);
    allProducts.push(...products);
    console.log(`  Page ${page}: ${products.length} products`);
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allProducts.filter((p) => {
    if (seen.has(p.url)) return false;
    seen.add(p.url);
    return true;
  });

  // Ensure output directory exists
  mkdirSync(resolve(__dirname, "..", "data"), { recursive: true });

  writeFileSync(OUTPUT_PATH, JSON.stringify(unique, null, 2), "utf-8");
  console.log(`\nDone! ${unique.length} unique products saved to data/prospin-raw.json`);
}

main().catch((err) => {
  console.error("Scraping failed:", err);
  process.exit(1);
});
