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
