/**
 * Scrape racket product data from prospin.com.br
 *
 * Usage: npx tsx scripts/scrape-prospin.ts
 * Output: data/prospin-raw.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://www.prospin.com.br/raquetes/tenis";
const OUTPUT_PATH = resolve(import.meta.dirname, "..", "data", "prospin-raw.json");
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

  // Match product link + image patterns
  // Product links: <a href="https://www.prospin.com.br/raquete-de-tenis-..." class="product-item-link">
  const linkRegex = /<a[^>]+href="(https:\/\/www\.prospin\.com\.br\/raquete-de-tenis-[^"]+)"[^>]*class="[^"]*product-item-link[^"]*"[^>]*>/g;
  const imgRegex = /<img[^>]+class="[^"]*product-image-photo[^"]*"[^>]*>/g;

  // Extract all product URLs
  const urls: string[] = [];
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    urls.push(linkMatch[1]);
  }

  // Extract all product images (name from alt, image from src)
  const images: { name: string; image: string }[] = [];
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const tag = imgMatch[0];
    const altMatch = tag.match(/alt="([^"]+)"/);
    const srcMatch = tag.match(/src="([^"]+)"/);
    if (altMatch && srcMatch) {
      images.push({ name: altMatch[1], image: srcMatch[1] });
    }
  }

  // Pair them up (they appear in the same order in the page)
  const count = Math.min(urls.length, images.length);
  for (let i = 0; i < count; i++) {
    products.push({
      name: images[i].name,
      url: urls[i],
      image: images[i].image,
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
  mkdirSync(resolve(import.meta.dirname, "..", "data"), { recursive: true });

  writeFileSync(OUTPUT_PATH, JSON.stringify(unique, null, 2), "utf-8");
  console.log(`\nDone! ${unique.length} unique products saved to data/prospin-raw.json`);
}

main().catch((err) => {
  console.error("Scraping failed:", err);
  process.exit(1);
});
