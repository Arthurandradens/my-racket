import { describe, it, expect } from "vitest";
import { parseRacqixResponse, type RacqixRacquet } from "../fetch-racqix";

const sampleResponse = {
  total_racquets: 2,
  racquets: [
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
      summaries_expert_en: "Spin-friendly racquet with good power.",
      atp_players: ["Nadal"],
      wta_players: [],
    },
    {
      slug: "wilson-clash-100-v2",
      brand: "Wilson",
      model: "Clash 100 v2",
      year: "2023",
      weight: 295,
      swingweight: 310,
      ra: 55,
      balance_mm: 312,
      head_size: 100,
      string_pattern: "16x19",
      summaries_expert_en: "Flexible and comfortable.",
      atp_players: [],
      wta_players: [],
    },
  ],
};

describe("parseRacqixResponse", () => {
  it("parses all racquets from response", () => {
    const result = parseRacqixResponse(sampleResponse);
    expect(result).toHaveLength(2);
  });

  it("maps fields correctly", () => {
    const result = parseRacqixResponse(sampleResponse);
    const racquet = result[0];
    expect(racquet.slug).toBe("babolat-pure-aero-2023");
    expect(racquet.brand).toBe("Babolat");
    expect(racquet.model).toBe("Pure Aero");
    expect(racquet.year).toBe("2023");
    expect(racquet.weight).toBe(300);
    expect(racquet.ra).toBe(71);
    expect(racquet.atp_players).toEqual(["Nadal"]);
  });

  it("handles null optional fields", () => {
    const response = {
      total_racquets: 1,
      racquets: [
        {
          slug: "test",
          brand: "Test",
          model: "Test",
          year: null,
          weight: null,
          swingweight: null,
          ra: 65,
          balance_mm: null,
          head_size: 100,
          string_pattern: "16x19",
          summaries_expert_en: "",
          atp_players: [],
          wta_players: [],
        },
      ],
    };
    const result = parseRacqixResponse(response);
    expect(result[0].weight).toBeNull();
    expect(result[0].swingweight).toBeNull();
    expect(result[0].balance_mm).toBeNull();
  });
});
