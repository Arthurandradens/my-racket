import { describe, it, expect } from "vitest";
import { parseTwuRow, normalizeName, type TwuReview } from "../parse-twu";

describe("parseTwuRow", () => {
  it("parses a full-breakdown row (0-100 scale)", () => {
    const row = {
      Racquet: "Babolat Pure Aero 2023",
      Overall: "84",
      Groundstrokes: "84",
      Volleys: "83",
      Serves: "84",
      Returns: "86",
      Power: "83",
      Control: "80",
      Maneuverability: "85",
      Stability: "81",
      Comfort: "82",
      TouchFeel: "81",
      Topspin: "89",
      Slice: "82",
      Price: "$269.00",
    };
    const result = parseTwuRow(row);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Babolat Pure Aero 2023");
    expect(result!.scores.overall).toBe(84);
    expect(result!.scores.topspin).toBe(89);
    expect(result!.price_usd).toBe(269.0);
  });

  it("parses a summary-only row (1-10 scale) and normalizes to 0-100", () => {
    const row = {
      Racquet: "Head Speed Pro 2024",
      Overall: "9.3",
      Groundstrokes: "",
      Volleys: "",
      Serves: "",
      Returns: "",
      Power: "",
      Control: "",
      Maneuverability: "",
      Stability: "",
      Comfort: "",
      TouchFeel: "",
      Topspin: "",
      Slice: "",
      Price: "$169.00",
    };
    const result = parseTwuRow(row);
    expect(result).not.toBeNull();
    expect(result!.scores.overall).toBe(93);
    expect(result!.scores.power).toBeNull();
  });

  it("skips rows with no scores at all", () => {
    const row = {
      Racquet: "Babolat Pure Aero 2026",
      Overall: "",
      Groundstrokes: "",
      Volleys: "",
      Serves: "",
      Returns: "",
      Power: "",
      Control: "",
      Maneuverability: "",
      Stability: "",
      Comfort: "",
      TouchFeel: "",
      Topspin: "",
      Slice: "",
      Price: "$299.00",
    };
    const result = parseTwuRow(row);
    expect(result).toBeNull();
  });

  it("handles missing price", () => {
    const row = {
      Racquet: "Babolat Pure Strike 16x20 2024",
      Overall: "8.3",
      Groundstrokes: "",
      Volleys: "",
      Serves: "",
      Returns: "",
      Power: "",
      Control: "",
      Maneuverability: "",
      Stability: "",
      Comfort: "",
      TouchFeel: "",
      Topspin: "",
      Slice: "",
      Price: "",
    };
    const result = parseTwuRow(row);
    expect(result).not.toBeNull();
    expect(result!.price_usd).toBeNull();
  });
});

describe("normalizeName", () => {
  it("strips 'Review' suffix", () => {
    expect(normalizeName("Babolat Pure Aero 98 2026 Review")).toBe(
      "babolat pure aero 98 2026"
    );
  });

  it("strips 'Tennis' and 'Racquet/Racqut' suffixes", () => {
    expect(normalizeName("Dunlop CX 400 Tour Racqut Review")).toBe(
      "dunlop cx 400 tour"
    );
  });

  it("trims whitespace and lowercases", () => {
    expect(normalizeName(" Yonex EZONE 100 (2025)")).toBe(
      "yonex ezone 100 2025"
    );
  });

  it("removes parentheses", () => {
    expect(normalizeName("Yonex EZONE 98 (2025)")).toBe("yonex ezone 98 2025");
  });
});
