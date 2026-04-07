import { describe, it, expect } from "vitest";
import { generateAffiliateLink } from "../affiliate";

describe("generateAffiliateLink", () => {
  it("generates Google Shopping fallback link", () => {
    const link = generateAffiliateLink("Babolat", "Pure Aero 2023");
    expect(link).toContain("google.com/search");
    expect(link).toContain("Babolat");
    expect(link).toContain("Pure+Aero+2023");
    expect(link).toContain("tbm=shop");
  });

  it("encodes special characters in model name", () => {
    const link = generateAffiliateLink("Head", "Speed MP 2024");
    expect(link).not.toContain(" ");
  });
});
