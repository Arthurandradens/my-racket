import { describe, it, expect } from "vitest";
import {
  getAllRackets,
  getRacketBySlug,
  getRacketsByBrand,
  searchRackets,
  getAllBrands,
} from "../rackets";
import fixtureData from "./fixtures/rackets-fixture.json";

describe("rackets data access", () => {
  it("getAllRackets returns all rackets", () => {
    const rackets = getAllRackets(fixtureData);
    expect(rackets).toHaveLength(3);
  });

  it("getRacketBySlug finds a racket", () => {
    const racket = getRacketBySlug(fixtureData, "babolat-pure-aero-2023");
    expect(racket).not.toBeNull();
    expect(racket!.brand).toBe("Babolat");
  });

  it("getRacketBySlug returns null for unknown slug", () => {
    const racket = getRacketBySlug(fixtureData, "nonexistent");
    expect(racket).toBeNull();
  });

  it("getRacketsByBrand filters by brand", () => {
    const rackets = getRacketsByBrand(fixtureData, "Wilson");
    expect(rackets).toHaveLength(1);
    expect(rackets[0].slug).toBe("wilson-clash-100");
  });

  it("searchRackets finds by model name", () => {
    const results = searchRackets(fixtureData, "pure aero");
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe("babolat-pure-aero-2023");
  });

  it("searchRackets is case-insensitive", () => {
    const results = searchRackets(fixtureData, "CLASH");
    expect(results).toHaveLength(1);
  });

  it("getAllBrands returns unique brands", () => {
    const brands = getAllBrands(fixtureData);
    expect(brands).toEqual(["Babolat", "Head", "Wilson"]);
  });
});
