# Pro Spin Affiliate Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Google Shopping fallback links with real Pro Spin affiliate links (coupon `NUNES`), prioritize rackets with Pro Spin links in catalog and quiz tiebreakers.

**Architecture:** A scraping script extracts product data from prospin.com.br into raw JSON. AI-assisted matching maps Pro Spin products to local racket slugs, saved in a static mapping file. The affiliate module checks this mapping first, falling back to Google Shopping. Catalog sorting and quiz tiebreaking use the mapping to prioritize linked rackets.

**Tech Stack:** Node.js fetch + HTML parsing (no external deps), TypeScript, Vitest

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `scripts/scrape-prospin.ts` | Create | Fetch all pages from prospin.com.br, extract product names + URLs |
| `data/prospin-raw.json` | Create (gitignored) | Raw scraping output for AI matching |
| `src/data/prospin-links.json` | Create | Slug-to-URL mapping (committed) |
| `src/lib/affiliate.ts` | Modify | Lookup mapping, append coupon, fallback to Google Shopping |
| `src/lib/__tests__/affiliate.test.ts` | Modify | Test new behavior |
| `src/components/AffiliateButton.tsx` | Modify | Accept `slug` prop, differentiate button text |
| `src/components/RacketCard.tsx` | Modify | Pass `slug` to AffiliateButton |
| `src/components/CompareTable.tsx` | Modify | Pass `slug` to AffiliateButton |
| `src/app/raquetes/page.tsx` | Modify | Sort by Pro Spin link + year, pass `slug` |
| `src/app/raquete/[slug]/page.tsx` | Modify | Pass `slug` to AffiliateButton |
| `src/lib/engine.ts` | Modify | Tiebreak by Pro Spin link |
| `.gitignore` | Modify | Add `data/prospin-raw.json` |

---

### Task 1: Create prospin-links.json mapping file and gitignore raw data

**Files:**
- Create: `src/data/prospin-links.json`
- Modify: `.gitignore`

- [ ] **Step 1: Create the empty mapping file**

```json
{}
```

Write this to `src/data/prospin-links.json`. This is the empty mapping that will be populated after scraping + AI matching.

- [ ] **Step 2: Add prospin-raw.json to .gitignore**

Add to the end of `.gitignore` (before any trailing newline):

```
# prospin scraping
data/prospin-raw.json
```

- [ ] **Step 3: Commit**

```bash
git add src/data/prospin-links.json .gitignore
git commit -m "chore: add empty prospin-links mapping and gitignore raw data"
```

---

### Task 2: Update affiliate module with Pro Spin lookup

**Files:**
- Modify: `src/lib/affiliate.ts`
- Modify: `src/lib/__tests__/affiliate.test.ts`

- [ ] **Step 1: Write the failing tests**

Replace the contents of `src/lib/__tests__/affiliate.test.ts` with:

```typescript
import { describe, it, expect, vi } from "vitest";
import { generateAffiliateLink, hasProspinLink } from "../affiliate";

// Mock the prospin-links module
vi.mock("@/data/prospin-links.json", () => ({
  default: {
    "babolat-pure-aero-2023": "https://www.prospin.com.br/raquete-de-tenis-babolat-pure-aero-101479-0370",
  },
}));

describe("generateAffiliateLink", () => {
  it("returns Pro Spin URL with coupon when slug has a mapping", () => {
    const link = generateAffiliateLink("babolat-pure-aero-2023", "Babolat", "Pure Aero 2023");
    expect(link).toBe(
      "https://www.prospin.com.br/raquete-de-tenis-babolat-pure-aero-101479-0370?coupon_code=NUNES"
    );
  });

  it("falls back to Google Shopping when slug has no mapping", () => {
    const link = generateAffiliateLink("head-speed-mp-2024", "Head", "Speed MP 2024");
    expect(link).toContain("google.com/search");
    expect(link).toContain("Head");
    expect(link).toContain("Speed+MP+2024");
    expect(link).toContain("tbm=shop");
  });

  it("encodes special characters in fallback", () => {
    const link = generateAffiliateLink("some-slug", "Head", "Speed MP 2024");
    expect(link).not.toContain(" ");
  });
});

describe("hasProspinLink", () => {
  it("returns true for mapped slugs", () => {
    expect(hasProspinLink("babolat-pure-aero-2023")).toBe(true);
  });

  it("returns false for unmapped slugs", () => {
    expect(hasProspinLink("head-speed-mp-2024")).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/affiliate.test.ts`
Expected: FAIL — `hasProspinLink` is not exported, `generateAffiliateLink` has wrong signature.

- [ ] **Step 3: Update affiliate.ts implementation**

Replace the contents of `src/lib/affiliate.ts` with:

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/affiliate.test.ts`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliate.ts src/lib/__tests__/affiliate.test.ts
git commit -m "feat: add Pro Spin affiliate lookup with coupon code fallback"
```

---

### Task 3: Update AffiliateButton component

**Files:**
- Modify: `src/components/AffiliateButton.tsx`

- [ ] **Step 1: Update AffiliateButton to accept slug and differentiate text**

Replace the contents of `src/components/AffiliateButton.tsx` with:

```tsx
import { generateAffiliateLink, hasProspinLink } from "@/lib/affiliate";

interface AffiliateButtonProps {
  slug: string;
  brand: string;
  model: string;
}

export default function AffiliateButton({ slug, brand, model }: AffiliateButtonProps) {
  const href = generateAffiliateLink(slug, brand, model);
  const isProSpin = hasProspinLink(slug);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {isProSpin ? "Comprar na Pro Spin" : "Buscar nas lojas"}
    </a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AffiliateButton.tsx
git commit -m "feat: update AffiliateButton with slug prop and Pro Spin label"
```

---

### Task 4: Update all AffiliateButton callers to pass slug

**Files:**
- Modify: `src/components/RacketCard.tsx`
- Modify: `src/components/CompareTable.tsx`
- Modify: `src/app/raquetes/page.tsx`
- Modify: `src/app/raquete/[slug]/page.tsx`

- [ ] **Step 1: Update RacketCard.tsx**

In `src/components/RacketCard.tsx`, change line 101:

```tsx
// Before:
<AffiliateButton brand={brand} model={model} />

// After:
<AffiliateButton slug={slug} brand={brand} model={model} />
```

- [ ] **Step 2: Update CompareTable.tsx**

In `src/components/CompareTable.tsx`, change line 137:

```tsx
// Before:
<AffiliateButton brand={r.brand} model={r.model} />

// After:
<AffiliateButton slug={r.slug} brand={r.brand} model={r.model} />
```

- [ ] **Step 3: Update raquetes/page.tsx (CatalogCard)**

In `src/app/raquetes/page.tsx`, change line 140:

```tsx
// Before:
<AffiliateButton brand={brand} model={model} />

// After:
<AffiliateButton slug={slug} brand={brand} model={model} />
```

- [ ] **Step 4: Update raquete/[slug]/page.tsx**

In `src/app/raquete/[slug]/page.tsx`, change line 93:

```tsx
// Before:
<AffiliateButton brand={brand} model={model} />

// After:
<AffiliateButton slug={racket.slug} brand={brand} model={model} />
```

Note: Use `racket.slug` here because `slug` is the route param (a string from the URL), but it's the same value. Either works — `racket.slug` is more explicit about the data source.

- [ ] **Step 5: Verify the app builds**

Run: `npx next build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/RacketCard.tsx src/components/CompareTable.tsx src/app/raquetes/page.tsx src/app/raquete/[slug]/page.tsx
git commit -m "feat: pass slug to AffiliateButton across all callers"
```

---

### Task 5: Add catalog sorting (Pro Spin link + year)

**Files:**
- Modify: `src/app/raquetes/page.tsx`

- [ ] **Step 1: Add import for hasProspinLink**

At the top of `src/app/raquetes/page.tsx`, add the import:

```tsx
import { hasProspinLink } from "@/lib/affiliate";
```

- [ ] **Step 2: Add sorted rackets computation**

Replace the existing `allRackets` constant (line 11):

```tsx
// Before:
const allRackets = getAllRackets(rackets);

// After:
const allRackets = getAllRackets(rackets).sort((a, b) => {
  // 1. Rackets with Pro Spin link first
  const aLink = hasProspinLink(a.slug) ? 1 : 0;
  const bLink = hasProspinLink(b.slug) ? 1 : 0;
  if (bLink !== aLink) return bLink - aLink;

  // 2. Most recent year first
  const aYear = a.year ? parseInt(a.year) : 0;
  const bYear = b.year ? parseInt(b.year) : 0;
  return bYear - aYear;
});
```

- [ ] **Step 3: Verify the app builds**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/raquetes/page.tsx
git commit -m "feat: sort catalog by Pro Spin availability and year"
```

---

### Task 6: Add quiz recommendation tiebreaker

**Files:**
- Modify: `src/lib/engine.ts`

- [ ] **Step 1: Add import for hasProspinLink**

At the top of `src/lib/engine.ts`, add:

```typescript
import { hasProspinLink } from "./affiliate";
```

- [ ] **Step 2: Update the sort in the recommend function**

In `src/lib/engine.ts`, replace line 634:

```typescript
// Before:
scored.sort((a, b) => b.score - a.score);

// After:
scored.sort((a, b) => {
  const scoreDiff = b.score - a.score;
  if (Math.abs(scoreDiff) >= 1) return scoreDiff;
  // Tiebreak: prefer rackets with Pro Spin link
  const aLink = hasProspinLink(a.racket.slug) ? 1 : 0;
  const bLink = hasProspinLink(b.racket.slug) ? 1 : 0;
  return bLink - aLink;
});
```

This only applies the tiebreaker when scores are within 1 point of each other (same integer score).

- [ ] **Step 3: Run existing engine tests**

Run: `npx vitest run src/lib/__tests__/`
Expected: All tests pass (affiliate tests + any engine tests).

- [ ] **Step 4: Commit**

```bash
git add src/lib/engine.ts
git commit -m "feat: tiebreak quiz recommendations by Pro Spin link availability"
```

---

### Task 7: Create scraping script

**Files:**
- Create: `scripts/scrape-prospin.ts`

- [ ] **Step 1: Create the scraping script**

Write to `scripts/scrape-prospin.ts`:

```typescript
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
```

- [ ] **Step 2: Verify script runs without errors**

Run: `npx tsx scripts/scrape-prospin.ts`
Expected: Script fetches pages and writes `data/prospin-raw.json` with product data. Check output for reasonable product count.

Note: The HTML regex patterns may need adjustment based on the actual page structure. If the script finds 0 products, inspect the HTML of the first page (`curl https://www.prospin.com.br/raquetes/tenis -o /tmp/prospin.html`) and adjust the regex patterns in `extractProducts` accordingly.

- [ ] **Step 3: Commit**

```bash
git add scripts/scrape-prospin.ts
git commit -m "feat: add Pro Spin scraping script"
```

---

### Task 8: Run scraping and perform AI-assisted matching

This task is a manual workflow, not automated code.

- [ ] **Step 1: Run the scraper**

```bash
npx tsx scripts/scrape-prospin.ts
```

Verify `data/prospin-raw.json` has products.

- [ ] **Step 2: Share raw data with AI for matching**

Read `data/prospin-raw.json` and `src/data/rackets.json`. The AI compares product names from Pro Spin with slugs/models in the rackets database and generates the mapping.

Matching criteria:
- Normalize accents, casing, "Gen4" vs "Gen 4", etc.
- Match by brand + model name
- Ignore SKU suffixes in Pro Spin URLs
- If ambiguous, prefer matching by year and specs (weight, pattern) if present in the Pro Spin name

- [ ] **Step 3: Write the mapping to prospin-links.json**

Update `src/data/prospin-links.json` with the matched slug-to-URL pairs.

- [ ] **Step 4: Verify links work**

Spot-check 3-5 URLs from the mapping by opening them in a browser. Verify they go to the correct product page.

- [ ] **Step 5: Commit**

```bash
git add src/data/prospin-links.json
git commit -m "feat: populate Pro Spin product link mappings"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 2: Build the app**

```bash
npx next build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Manual smoke test**

Start dev server (`npx next dev`) and verify:

1. `/raquetes` — rackets with Pro Spin links appear first, button says "Comprar na Pro Spin"
2. `/raquetes` — rackets without Pro Spin links show "Buscar nas lojas" (Google Shopping fallback)
3. `/raquete/<slug-with-prospin-link>` — button says "Comprar na Pro Spin", link includes `?coupon_code=NUNES`
4. `/raquete/<slug-without-link>` — button says "Buscar nas lojas", link goes to Google Shopping
5. Quiz results — complete a quiz, verify Pro Spin linked rackets appear in tiebreaks
6. `/comparar` — compare 2 rackets, verify buttons show correct labels

- [ ] **Step 4: Commit any final fixes if needed**
