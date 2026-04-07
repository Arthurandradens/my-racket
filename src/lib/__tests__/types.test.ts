import { describe, it, expect } from "vitest";
import type { Racket, RacketScores, QuizAnswers, IdealProfile } from "../types";

describe("Racket type", () => {
  it("can construct a valid racket object", () => {
    const racket: Racket = {
      slug: "babolat-pure-aero-2023",
      brand: "Babolat",
      model: "Pure Aero 2023",
      year: "2023",
      weight: 300,
      swingweight: 328,
      ra: 71,
      balance_mm: 320,
      head_size: 100,
      string_pattern: "16x19",
      scores: {
        overall: 84,
        groundstrokes: 84,
        volleys: 83,
        serves: 84,
        returns: 86,
        power: 83,
        control: 80,
        maneuverability: 85,
        stability: 81,
        comfort: 82,
        touch_feel: 81,
        topspin: 89,
        slice: 82,
      },
      price_brl: 1499.0,
      expert_summary_pt: null,
      atp_players: ["Nadal", "Alcaraz"],
      wta_players: ["Fernandez"],
      recommended_levels: ["intermediario", "avancado"],
    };

    expect(racket.slug).toBe("babolat-pure-aero-2023");
    expect(racket.scores.topspin).toBe(89);
    expect(racket.atp_players).toContain("Nadal");
  });
});

describe("QuizAnswers type", () => {
  it("can construct beginner quiz answers", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      frequency: "1-2x",
      physique: "medio",
      injury: "nenhuma",
      budget: "medio",
    };

    expect(answers.level).toBe("iniciante");
  });

  it("can construct advanced quiz answers", () => {
    const answers: QuizAnswers = {
      level: "avancado",
      play_style: "baseline",
      main_shot: "forehand",
      tech_preferences: { weight: "pesada", balance: "head-light", stiffness: "rigida" },
      current_racket: "babolat-pure-aero-2023",
      change_desired: "mais-controle",
      budget: "alto",
    };

    expect(answers.level).toBe("avancado");
    expect(answers.tech_preferences?.weight).toBe("pesada");
  });
});

describe("IdealProfile type", () => {
  it("can construct an ideal profile with spec ranges", () => {
    const profile: IdealProfile = {
      weight: { min: 260, max: 285, importance: 0.2 },
      head_size: { min: 100, max: 110, importance: 0.3 },
      ra: { min: 0, max: 66, importance: 0.3 },
      balance_mm: { min: 325, max: 360, importance: 0.2 },
    };

    expect(profile.weight.min).toBe(260);
    expect(profile.head_size.importance).toBe(0.3);
  });
});
