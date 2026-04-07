import { describe, it, expect } from "vitest";
import { mergeRacketData, fuzzyMatch, assignLevels } from "../merge-data";
import type { RacqixRacquet } from "../fetch-racqix";
import type { TwuReview } from "../parse-twu";

describe("fuzzyMatch", () => {
  it("matches exact normalized names", () => {
    expect(fuzzyMatch("babolat pure aero 2023", "babolat pure aero 2023")).toBe(true);
  });

  it("matches when TWU name contains Racqix name", () => {
    expect(fuzzyMatch("babolat pure aero", "babolat pure aero 2023")).toBe(true);
  });

  it("does not match different models", () => {
    expect(fuzzyMatch("babolat pure aero", "babolat pure drive")).toBe(false);
  });
});

describe("assignLevels", () => {
  it("assigns iniciante for light, large head, low RA", () => {
    const levels = assignLevels(270, 105, 62, 330);
    expect(levels).toContain("iniciante");
  });

  it("assigns avancado for heavy, small head", () => {
    const levels = assignLevels(310, 97, 68, 315);
    expect(levels).toContain("avancado");
  });

  it("assigns intermediario for mid-range specs", () => {
    const levels = assignLevels(290, 100, 66, 320);
    expect(levels).toContain("intermediario");
  });

  it("handles null values gracefully", () => {
    const levels = assignLevels(null, 100, 65, null);
    expect(Array.isArray(levels)).toBe(true);
    expect(levels.length).toBeGreaterThan(0);
  });
});

describe("mergeRacketData", () => {
  const racqixData: RacqixRacquet[] = [
    {
      slug: "babolat-pure-aero-2023",
      brand: "Babolat",
      model: "Pure Aero",
      year: "2023",
      weight: 300,
      swingweight: 328,
      ra: 71,
      balance_mm: 320,
      head_size: 100,
      string_pattern: "16x19",
      summaries_expert_en: "Spin-friendly racquet.",
      atp_players: ["Nadal"],
      wta_players: [],
    },
    {
      slug: "wilson-clash-100",
      brand: "Wilson",
      model: "Clash 100",
      year: null,
      weight: 295,
      swingweight: 310,
      ra: 55,
      balance_mm: 312,
      head_size: 100,
      string_pattern: "16x19",
      summaries_expert_en: "Flexible frame.",
      atp_players: [],
      wta_players: [],
    },
  ];

  const twuData: TwuReview[] = [
    {
      name: "Babolat Pure Aero 2023",
      normalized_name: "babolat pure aero 2023",
      scores: {
        overall: 84, groundstrokes: 84, volleys: 83, serves: 84,
        returns: 86, power: 83, control: 80, maneuverability: 85,
        stability: 81, comfort: 82, touch_feel: 81, topspin: 89, slice: 82,
      },
      price_usd: 269,
    },
  ];

  it("merges all Racqix racquets", () => {
    const result = mergeRacketData(racqixData, twuData);
    expect(result).toHaveLength(2);
  });

  it("enriches matched racquets with TWU scores", () => {
    const result = mergeRacketData(racqixData, twuData);
    const aero = result.find((r) => r.slug === "babolat-pure-aero-2023")!;
    expect(aero.scores.overall).toBe(84);
    expect(aero.scores.topspin).toBe(89);
  });

  it("leaves unmatched racquets with null scores", () => {
    const result = mergeRacketData(racqixData, twuData);
    const clash = result.find((r) => r.slug === "wilson-clash-100")!;
    expect(clash.scores.overall).toBeNull();
  });

  it("converts price to BRL", () => {
    const result = mergeRacketData(racqixData, twuData);
    const aero = result.find((r) => r.slug === "babolat-pure-aero-2023")!;
    expect(aero.price_brl).toBeCloseTo(269 * 5.7, 0);
  });

  it("assigns recommended levels", () => {
    const result = mergeRacketData(racqixData, twuData);
    const aero = result.find((r) => r.slug === "babolat-pure-aero-2023")!;
    expect(aero.recommended_levels.length).toBeGreaterThan(0);
  });
});
