import { writeFileSync, mkdirSync } from "fs";
import path from "path";

export interface RacqixRacquet {
  slug: string;
  brand: string;
  model: string;
  year: string | null;
  weight: number | null;
  swingweight: number | null;
  ra: number;
  balance_mm: number | null;
  head_size: number;
  string_pattern: string;
  summaries_expert_en: string;
  image_url: string | null;
  atp_players: string[];
  wta_players: string[];
}

export function parseRacqixResponse(response: {
  total_racquets: number;
  racquets: RacqixRacquet[];
}): RacqixRacquet[] {
  return response.racquets.map((r) => ({
    slug: r.slug,
    brand: r.brand,
    model: r.model,
    year: r.year ?? null,
    weight: r.weight ?? null,
    swingweight: r.swingweight ?? null,
    ra: r.ra,
    balance_mm: r.balance_mm ?? null,
    head_size: r.head_size,
    string_pattern: r.string_pattern,
    summaries_expert_en: r.summaries_expert_en ?? "",
    image_url: null,
    atp_players: r.atp_players ?? [],
    wta_players: r.wta_players ?? [],
  }));
}

const RACQIX_URL = "https://www.racqix.com/api/racquets?mode=minimal";
const RACQIX_DETAIL_URL = "https://www.racqix.com/api/racquets";

async function fetchImageUrl(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${RACQIX_DETAIL_URL}/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.media_image_url ?? null;
  } catch {
    return null;
  }
}

async function fetchImagesInBatches(
  slugs: string[],
  batchSize = 20,
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (slug) => ({ slug, url: await fetchImageUrl(slug) })),
    );
    for (const { slug, url } of results) {
      if (url) imageMap.set(slug, url);
    }
    const done = Math.min(i + batchSize, slugs.length);
    process.stdout.write(`\r  Images: ${done}/${slugs.length}`);
  }
  console.log();
  return imageMap;
}

export async function fetchRacqix(): Promise<RacqixRacquet[]> {
  console.log("Fetching from Racqix API...");
  const response = await fetch(RACQIX_URL);
  if (!response.ok) {
    throw new Error(`Racqix API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const racquets = parseRacqixResponse(data);
  console.log(`Fetched ${racquets.length} racquets from Racqix.`);

  console.log("Fetching racquet images...");
  const slugs = racquets.map((r) => r.slug);
  const imageMap = await fetchImagesInBatches(slugs);
  console.log(`Found images for ${imageMap.size}/${racquets.length} racquets.`);

  for (const r of racquets) {
    r.image_url = imageMap.get(r.slug) ?? null;
  }

  return racquets;
}

// CLI entry point
if (process.argv[1] === import.meta.filename) {
  const outDir = path.resolve("data/pipeline");
  mkdirSync(outDir, { recursive: true });
  fetchRacqix().then((racquets) => {
    const outPath = path.join(outDir, "racqix-raw.json");
    writeFileSync(outPath, JSON.stringify(racquets, null, 2));
    console.log(`Written to ${outPath}`);
  });
}
