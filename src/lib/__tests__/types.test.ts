import { describe, it, expect } from "vitest";
import type {
  PlayerLevel,
  QuizAnswers,
  IdealProfile,
  SpecRecommendation,
  EducationBlock,
  InjuryAlert,
  QuizQuestion,
} from "../types";

describe("type contracts", () => {
  it("PlayerLevel includes basico-intermediario", () => {
    const levels: PlayerLevel[] = ["iniciante", "basico-intermediario", "intermediario", "avancado"];
    expect(levels).toHaveLength(4);
  });

  it("QuizAnswers accepts all level-specific fields", () => {
    const beginner: QuizAnswers = {
      level: "iniciante",
      lesao: "sem_lesao",
      fisico: "medio",
      objetivo: "aprender",
      frequencia: "lazer",
      estilo_basico: "fundo",
    };
    expect(beginner.level).toBe("iniciante");

    const basicInt: QuizAnswers = {
      level: "basico-intermediario",
      tempo: "6a12",
      lesao: "sem_lesao",
      encordoamento: "nao_sei",
      padrao: "consistente",
      padrao_encordoamento: "desconhece",
      estilo: "fundo",
    };
    expect(basicInt.level).toBe("basico-intermediario");

    const intermediate: QuizAnswers = {
      level: "intermediario",
      estilo: "baseliner_spin",
      lesao: "sem",
      padrao_enc: "16x19",
      peso: "neutro",
      problema_atual: "curta",
      rigidez: "neutro",
    };
    expect(intermediate.level).toBe("intermediario");

    const advanced: QuizAnswers = {
      level: "avancado",
      necessidade: "controle",
      estilo_avancado: "heavy_baseliner",
      padrao_enc_avancado: "16x19",
      swingweight: "longo",
      lesao_avancado: "sem",
      corda_atual: "poly",
    };
    expect(advanced.level).toBe("avancado");
  });

  it("IdealProfile includes swingweight and pattern fields", () => {
    const profile: IdealProfile = {
      weight: { min: 270, max: 300, importance: 0.2 },
      head_size: { min: 100, max: 110, importance: 0.25 },
      ra: { min: 60, max: 67, importance: 0.3 },
      balance_mm: { min: 320, max: 345, importance: 0.15 },
      swingweight: { min: 305, max: 320, importance: 0.1 },
      preferred_patterns: ["16x19"],
      pattern_importance: 0.1,
    };
    expect(profile.swingweight.min).toBe(305);
    expect(profile.preferred_patterns).toContain("16x19");
  });

  it("QuizQuestion supports optional context", () => {
    const withContext: QuizQuestion = {
      id: "test",
      text: "Pergunta?",
      context: "Explicacao educativa...",
      options: [{ value: "a", label: "Opcao A" }],
    };
    expect(withContext.context).toBeDefined();

    const withoutContext: QuizQuestion = {
      id: "test2",
      text: "Outra pergunta?",
      options: [{ value: "b", label: "Opcao B" }],
    };
    expect(withoutContext.context).toBeUndefined();
  });

  it("SpecRecommendation has spec, value, reason", () => {
    const rec: SpecRecommendation = {
      spec: "Head size",
      value: "100-105 in²",
      reason: "Seu estilo baseliner spin se beneficia...",
    };
    expect(rec.spec).toBe("Head size");
  });

  it("EducationBlock has id, title, content", () => {
    const block: EducationBlock = {
      id: "curta",
      title: "Bola caindo curta",
      content: "Explicacao...",
    };
    expect(block.id).toBe("curta");
  });

  it("InjuryAlert has severity, title, recommendations", () => {
    const alert: InjuryAlert = {
      severity: "urgent",
      title: "Alerta de lesao",
      recommendations: ["Trocar corda", "Baixar tensao"],
    };
    expect(alert.severity).toBe("urgent");
    expect(alert.recommendations).toHaveLength(2);
  });
});
