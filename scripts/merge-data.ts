import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import type { Racket, RacketScores } from "../src/lib/types";
import type { RacqixRacquet } from "./fetch-racqix";
import type { TwuReview } from "./parse-twu";
import { USD_TO_BRL } from "../src/lib/constants";

const EMPTY_SCORES: RacketScores = {
  overall: null, groundstrokes: null, volleys: null, serves: null,
  returns: null, power: null, control: null, maneuverability: null,
  stability: null, comfort: null, touch_feel: null, topspin: null, slice: null,
};

export function fuzzyMatch(racqixName: string, twuName: string): boolean {
  if (racqixName === twuName) return true;
  return twuName.includes(racqixName) || racqixName.includes(twuName);
}

export function assignLevels(
  weight: number | null,
  headSize: number,
  ra: number,
  balance: number | null
): string[] {
  const levels: string[] = [];
  const w = weight ?? 290;
  const b = balance ?? 320;

  if (w <= 285 && headSize >= 100 && ra <= 68) {
    levels.push("iniciante");
  }
  if (w >= 275 && w <= 310 && headSize >= 98 && headSize <= 105) {
    levels.push("intermediario");
  }
  if (w >= 295 && headSize <= 102) {
    levels.push("avancado");
  }

  if (levels.length === 0) {
    levels.push("intermediario");
  }

  return levels;
}

function normalizeRacqixName(r: RacqixRacquet): string {
  const parts = [r.brand, r.model, r.year].filter(Boolean);
  return parts.join(" ").toLowerCase().trim();
}

export function mergeRacketData(
  racqixData: RacqixRacquet[],
  twuData: TwuReview[]
): Racket[] {
  return racqixData.map((r) => {
    const racqixNorm = normalizeRacqixName(r);
    const twuMatch = twuData.find((t) => fuzzyMatch(racqixNorm, t.normalized_name));

    const priceBrl = twuMatch?.price_usd
      ? Math.round(twuMatch.price_usd * USD_TO_BRL)
      : null;

    return {
      slug: r.slug,
      brand: r.brand,
      model: `${r.model}${r.year ? ` ${r.year}` : ""}`,
      year: r.year,
      weight: r.weight,
      swingweight: r.swingweight,
      ra: r.ra,
      balance_mm: r.balance_mm,
      head_size: r.head_size,
      string_pattern: r.string_pattern,
      scores: twuMatch ? { ...twuMatch.scores } : { ...EMPTY_SCORES },
      price_brl: priceBrl,
      expert_summary_pt: r.summaries_expert_en || null,
      atp_players: r.atp_players,
      wta_players: r.wta_players,
      recommended_levels: assignLevels(r.weight, r.head_size, r.ra, r.balance_mm),
    };
  });
}
