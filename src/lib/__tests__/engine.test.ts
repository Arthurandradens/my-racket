import { describe, it, expect } from "vitest";
import { buildIdealProfile, scoreRacket, recommend } from "../engine";
import type { QuizAnswers, Racket, IdealProfile } from "../types";
import fixtureData from "./fixtures/rackets-fixture.json";

describe("buildIdealProfile", () => {
  it("builds beginner profile with safe ranges", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      frequency: "1-2x",
      physique: "medio",
      injury: "nenhuma",
      budget: "medio",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.weight.max).toBeLessThanOrEqual(285);
    expect(profile.head_size.min).toBeGreaterThanOrEqual(100);
    expect(profile.ra.max).toBeLessThanOrEqual(66);
  });

  it("adjusts for injury — lowers RA ceiling", () => {
    const noInjury: QuizAnswers = {
      level: "intermediario",
      play_style: "baseline",
      improvement: "spin",
      injury: "nenhuma",
      budget: "medio",
    };
    const withInjury: QuizAnswers = { ...noInjury, injury: "cotovelo" };
    const profileClean = buildIdealProfile(noInjury);
    const profileInjury = buildIdealProfile(withInjury);
    expect(profileInjury.ra.max).toBeLessThan(profileClean.ra.max);
  });

  it("builds advanced profile with heavier weight range", () => {
    const answers: QuizAnswers = {
      level: "avancado",
      play_style: "baseline",
      main_shot: "forehand",
      tech_preferences: { weight: "pesada", balance: "head-light", stiffness: "rigida" },
      change_desired: "mais-controle",
      budget: "alto",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.weight.min).toBeGreaterThanOrEqual(295);
  });

  it("adjusts for small physique — lowers weight range", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      frequency: "1-2x",
      physique: "pequeno",
      injury: "nenhuma",
      budget: "medio",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.weight.max).toBeLessThanOrEqual(275);
  });
});

describe("scoreRacket", () => {
  const beginnerProfile: IdealProfile = {
    weight: { min: 260, max: 285, importance: 0.2 },
    head_size: { min: 100, max: 110, importance: 0.3 },
    ra: { min: 0, max: 66, importance: 0.3 },
    balance_mm: { min: 325, max: 360, importance: 0.2 },
  };

  it("scores a racket inside all ranges highly", () => {
    const perfectMatch: Racket = {
      slug: "test", brand: "Test", model: "Perfect", year: null,
      weight: 270, swingweight: null, ra: 60, balance_mm: 330, head_size: 105,
      string_pattern: "16x19",
      scores: { overall: null, groundstrokes: null, volleys: null, serves: null, returns: null, power: null, control: null, maneuverability: null, stability: null, comfort: null, touch_feel: null, topspin: null, slice: null },
      price_brl: null, expert_summary_pt: null, atp_players: [], wta_players: [], recommended_levels: ["iniciante"],
    };
    const score = scoreRacket(perfectMatch, beginnerProfile);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  it("scores a racket outside ranges lower", () => {
    const poorMatch: Racket = {
      slug: "test2", brand: "Test", model: "Heavy", year: null,
      weight: 330, swingweight: null, ra: 75, balance_mm: 310, head_size: 95,
      string_pattern: "18x20",
      scores: { overall: null, groundstrokes: null, volleys: null, serves: null, returns: null, power: null, control: null, maneuverability: null, stability: null, comfort: null, touch_feel: null, topspin: null, slice: null },
      price_brl: null, expert_summary_pt: null, atp_players: [], wta_players: [], recommended_levels: ["avancado"],
    };
    const score = scoreRacket(poorMatch, beginnerProfile);
    expect(score).toBeLessThan(50);
  });

  it("handles null weight/balance gracefully", () => {
    const nullSpecs: Racket = {
      slug: "test3", brand: "Test", model: "Null", year: null,
      weight: null, swingweight: null, ra: 60, balance_mm: null, head_size: 105,
      string_pattern: "16x19",
      scores: { overall: null, groundstrokes: null, volleys: null, serves: null, returns: null, power: null, control: null, maneuverability: null, stability: null, comfort: null, touch_feel: null, topspin: null, slice: null },
      price_brl: null, expert_summary_pt: null, atp_players: [], wta_players: [], recommended_levels: ["iniciante"],
    };
    const score = scoreRacket(nullSpecs, beginnerProfile);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("recommend", () => {
  it("returns top N rackets sorted by score descending", () => {
    const answers: QuizAnswers = {
      level: "intermediario",
      play_style: "baseline",
      improvement: "spin",
      injury: "nenhuma",
      budget: "medio",
    };
    const results = recommend(fixtureData as Racket[], answers, 3);
    expect(results.length).toBeLessThanOrEqual(3);
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
  });

  it("includes reasons for each recommendation", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      frequency: "1-2x",
      physique: "medio",
      injury: "nenhuma",
      budget: "medio",
    };
    const results = recommend(fixtureData as Racket[], answers, 3);
    expect(results[0].reasons.length).toBeGreaterThan(0);
  });
});
