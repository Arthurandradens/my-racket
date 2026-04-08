import { describe, it, expect } from "vitest";
import {
  buildIdealProfile,
  scoreRacket,
  recommend,
  generateSpecProfile,
  generateEducationBlocks,
  generateInjuryAlert,
} from "../engine";
import type { QuizAnswers, Racket, IdealProfile } from "../types";
import fixtureData from "./fixtures/rackets-fixture.json";

describe("buildIdealProfile", () => {
  it("builds iniciante profile with safe ranges", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "sem_lesao",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.weight.max).toBeLessThanOrEqual(285);
    expect(profile.head_size.min).toBeGreaterThanOrEqual(105);
    expect(profile.ra.max).toBeLessThanOrEqual(67);
    expect(profile.preferred_patterns).toContain("16x19");
  });

  it("builds basico-intermediario profile", () => {
    const answers: QuizAnswers = {
      level: "basico-intermediario",
      tempo: "6a12",
      lesao: "sem_lesao",
      encordoamento: "nao_sei",
      padrao: "consistente",
      padrao_encordoamento: "desconhece",
      estilo: "fundo",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.weight.min).toBeGreaterThanOrEqual(270);
    expect(profile.weight.max).toBeLessThanOrEqual(295);
    expect(profile.head_size.min).toBeGreaterThanOrEqual(100);
  });

  it("adjusts iniciante for cotovelo_forte — very low RA", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "cotovelo_forte",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.ra.max).toBeLessThanOrEqual(63);
  });

  it("adjusts iniciante for ombro — lighter weight", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "ombro",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.weight.max).toBeLessThanOrEqual(280);
  });

  it("adjusts iniciante for fraco physique — lightest weight", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "sem_lesao",
      fisico: "fraco",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.weight.max).toBeLessThanOrEqual(270);
  });

  it("adjusts intermediario for baseliner_flat — 18x20 preferred", () => {
    const answers: QuizAnswers = {
      level: "intermediario",
      estilo: "baseliner_flat",
      lesao: "sem",
      padrao_enc: "18x20",
      peso: "pesado",
      problema_atual: "erro",
      rigidez: "rigido",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.preferred_patterns).toContain("18x20");
  });

  it("adjusts avancado for heavy_baseliner — high swingweight", () => {
    const answers: QuizAnswers = {
      level: "avancado",
      necessidade: "spin",
      estilo_avancado: "heavy_baseliner",
      padrao_enc_avancado: "16x19",
      swingweight: "longo",
      lesao_avancado: "sem",
      corda_atual: "poly",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.swingweight.min).toBeGreaterThanOrEqual(325);
  });

  it("overrides RA when lesao + RA too high", () => {
    const answers: QuizAnswers = {
      level: "intermediario",
      estilo: "baseliner_spin",
      lesao: "cotovelo",
      padrao_enc: "16x19",
      peso: "neutro",
      problema_atual: "curta",
      rigidez: "rigido",
    };
    const profile = buildIdealProfile(answers);
    expect(profile.ra.max).toBeLessThanOrEqual(65);
  });
});

describe("scoreRacket", () => {
  const baseProfile: IdealProfile = {
    weight: { min: 260, max: 285, importance: 0.2 },
    head_size: { min: 100, max: 110, importance: 0.25 },
    ra: { min: 55, max: 66, importance: 0.25 },
    balance_mm: { min: 325, max: 360, importance: 0.1 },
    swingweight: { min: 290, max: 315, importance: 0.1 },
    preferred_patterns: ["16x19"],
    pattern_importance: 0.1,
  };

  const makeRacket = (overrides: Partial<Racket>): Racket => ({
    slug: "test",
    brand: "Test",
    model: "Test",
    year: null,
    weight: 270,
    swingweight: 305,
    ra: 60,
    balance_mm: 330,
    head_size: 105,
    string_pattern: "16x19",
    scores: { overall: null, groundstrokes: null, volleys: null, serves: null, returns: null, power: null, control: null, maneuverability: null, stability: null, comfort: null, touch_feel: null, topspin: null, slice: null },
    price_brl: null,
    expert_summary_pt: null,
    atp_players: [],
    wta_players: [],
    recommended_levels: ["iniciante"],
    ...overrides,
  });

  it("scores perfect match highly", () => {
    const score = scoreRacket(makeRacket({}), baseProfile);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  it("penalizes wrong string pattern", () => {
    const matchingPattern = scoreRacket(makeRacket({ string_pattern: "16x19" }), baseProfile);
    const wrongPattern = scoreRacket(makeRacket({ string_pattern: "18x20" }), baseProfile);
    expect(matchingPattern).toBeGreaterThan(wrongPattern);
  });

  it("scores swingweight within range highly", () => {
    const inRange = scoreRacket(makeRacket({ swingweight: 305 }), baseProfile);
    const outRange = scoreRacket(makeRacket({ swingweight: 350 }), baseProfile);
    expect(inRange).toBeGreaterThan(outRange);
  });

  it("handles null swingweight gracefully", () => {
    const score = scoreRacket(makeRacket({ swingweight: null }), baseProfile);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("generateSpecProfile", () => {
  it("returns spec recommendations for iniciante", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "sem_lesao",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "fundo",
    };
    const specs = generateSpecProfile(answers);
    expect(specs.length).toBeGreaterThanOrEqual(5);
    const specNames = specs.map((s) => s.spec);
    expect(specNames).toContain("Tamanho da cabeça");
    expect(specNames).toContain("Peso");
    expect(specNames).toContain("Rigidez (RA)");
    expect(specNames).toContain("Padrão de encordoamento");
    expect(specNames).toContain("Tipo de corda");
    for (const s of specs) {
      expect(s.value.length).toBeGreaterThan(0);
      expect(s.reason.length).toBeGreaterThan(0);
    }
  });

  it("returns spec recommendations for avancado", () => {
    const answers: QuizAnswers = {
      level: "avancado",
      necessidade: "controle",
      estilo_avancado: "flat",
      padrao_enc_avancado: "16x19_para_fechado",
      swingweight: "equilibrado",
      lesao_avancado: "sem",
      corda_atual: "poly",
    };
    const specs = generateSpecProfile(answers);
    expect(specs.length).toBeGreaterThanOrEqual(5);
    const specNames = specs.map((s) => s.spec);
    expect(specNames).toContain("Swingweight");
  });
});

describe("generateEducationBlocks", () => {
  it("returns empty for healthy iniciante with no issues", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "sem_lesao",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    const blocks = generateEducationBlocks(answers);
    const problemIds = blocks.map((b) => b.id);
    expect(problemIds).not.toContain("curta");
    expect(problemIds).not.toContain("sem_spin");
  });

  it("returns 'curta' block for intermediario with bola curta", () => {
    const answers: QuizAnswers = {
      level: "intermediario",
      estilo: "baseliner_spin",
      lesao: "sem",
      padrao_enc: "16x19",
      peso: "neutro",
      problema_atual: "curta",
      rigidez: "neutro",
    };
    const blocks = generateEducationBlocks(answers);
    const ids = blocks.map((b) => b.id);
    expect(ids).toContain("curta");
  });

  it("returns 'sem_spin' block for intermediario with spin problem", () => {
    const answers: QuizAnswers = {
      level: "intermediario",
      estilo: "baseliner_spin",
      lesao: "sem",
      padrao_enc: "16x19",
      peso: "neutro",
      problema_atual: "sem_spin",
      rigidez: "neutro",
    };
    const blocks = generateEducationBlocks(answers);
    const ids = blocks.map((b) => b.id);
    expect(ids).toContain("sem_spin");
  });

  it("returns pattern education for basico-intermediario who desconhece", () => {
    const answers: QuizAnswers = {
      level: "basico-intermediario",
      tempo: "6a12",
      lesao: "sem_lesao",
      encordoamento: "nao_sei",
      padrao: "consistente",
      padrao_encordoamento: "desconhece",
      estilo: "fundo",
    };
    const blocks = generateEducationBlocks(answers);
    const ids = blocks.map((b) => b.id);
    expect(ids).toContain("padrao_explicacao");
  });

  it("returns transition block for avancado changing pattern", () => {
    const answers: QuizAnswers = {
      level: "avancado",
      necessidade: "controle",
      estilo_avancado: "heavy_baseliner",
      padrao_enc_avancado: "16x19_para_fechado",
      swingweight: "longo",
      lesao_avancado: "sem",
      corda_atual: "poly",
    };
    const blocks = generateEducationBlocks(answers);
    const ids = blocks.map((b) => b.id);
    expect(ids).toContain("transicao_padrao");
  });
});

describe("generateInjuryAlert", () => {
  it("returns null for healthy player", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "sem_lesao",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    expect(generateInjuryAlert(answers)).toBeNull();
  });

  it("returns warning for cotovelo_leve", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "cotovelo_leve",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    const alert = generateInjuryAlert(answers);
    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe("warning");
    expect(alert!.recommendations.length).toBeGreaterThan(0);
  });

  it("returns urgent for cotovelo_forte", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "cotovelo_forte",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    const alert = generateInjuryAlert(answers);
    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe("urgent");
  });

  it("returns urgent for avancado cotovelo + poly", () => {
    const answers: QuizAnswers = {
      level: "avancado",
      necessidade: "lesao",
      estilo_avancado: "heavy_baseliner",
      padrao_enc_avancado: "16x19",
      swingweight: "longo",
      lesao_avancado: "cotovelo",
      corda_atual: "poly",
    };
    const alert = generateInjuryAlert(answers);
    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe("urgent");
    const allText = alert!.recommendations.join(" ");
    expect(allText.toLowerCase()).toMatch(/hybrid|multifilamento/);
  });

  it("returns warning for ombro", () => {
    const answers: QuizAnswers = {
      level: "intermediario",
      estilo: "baseliner_spin",
      lesao: "ombro",
      padrao_enc: "16x19",
      peso: "neutro",
      problema_atual: "curta",
      rigidez: "neutro",
    };
    const alert = generateInjuryAlert(answers);
    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe("warning");
  });
});

describe("recommend", () => {
  it("returns top N rackets sorted by score descending", () => {
    const answers: QuizAnswers = {
      level: "intermediario",
      estilo: "baseliner_spin",
      lesao: "sem",
      padrao_enc: "16x19",
      peso: "neutro",
      problema_atual: "curta",
      rigidez: "neutro",
    };
    const results = recommend(fixtureData as Racket[], answers, 3);
    expect(results.length).toBeLessThanOrEqual(3);
    if (results.length >= 2) {
      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
    }
  });

  it("includes reasons for each recommendation", () => {
    const answers: QuizAnswers = {
      level: "iniciante",
      lesao: "sem_lesao",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "indefinido",
    };
    const results = recommend(fixtureData as Racket[], answers, 3);
    for (const r of results) {
      expect(r.reasons.length).toBeGreaterThan(0);
    }
  });
});
