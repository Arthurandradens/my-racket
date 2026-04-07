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
    atp_players: r.atp_players ?? [],
    wta_players: r.wta_players ?? [],
  }));
}

const RACQIX_URL = "https://www.racqix.com/api/racquets?mode=minimal";

export async function fetchRacqix(): Promise<RacqixRacquet[]> {
  console.log("Fetching from Racqix API...");
  const response = await fetch(RACQIX_URL);
  if (!response.ok) {
    throw new Error(`Racqix API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const racquets = parseRacqixResponse(data);
  console.log(`Fetched ${racquets.length} racquets from Racqix.`);
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
