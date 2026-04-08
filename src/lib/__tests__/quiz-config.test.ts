import { describe, it, expect } from "vitest";
import { getQuizFlow } from "../quiz-config";
import type { PlayerLevel } from "../types";

const ALL_LEVELS: PlayerLevel[] = [
  "iniciante",
  "basico-intermediario",
  "intermediario",
  "avancado",
  "junior",
];

describe("getQuizFlow", () => {
  it("returns level question as first step for all flows", () => {
    for (const level of ALL_LEVELS) {
      const flow = getQuizFlow(level);
      expect(flow[0].id).toBe("level");
    }
  });

  it("level question has 5 options for 5 levels", () => {
    const flow = getQuizFlow("iniciante");
    expect(flow[0].options).toHaveLength(5);
    const values = flow[0].options.map((o) => o.value);
    expect(values).toEqual(ALL_LEVELS);
  });

  it("returns 6 questions for junior (level + 5)", () => {
    const flow = getQuizFlow("junior");
    expect(flow).toHaveLength(6);
    const ids = flow.map((q) => q.id);
    expect(ids).toEqual(["level", "altura", "idade", "nivel_junior", "queixa", "objetivo_junior"]);
  });

  it("returns 6 questions for iniciante (level + 5)", () => {
    const flow = getQuizFlow("iniciante");
    expect(flow).toHaveLength(6);
    const ids = flow.map((q) => q.id);
    expect(ids).toEqual(["level", "lesao", "fisico", "objetivo", "frequencia", "estilo_basico"]);
  });

  it("returns 7 questions for basico-intermediario (level + 6)", () => {
    const flow = getQuizFlow("basico-intermediario");
    expect(flow).toHaveLength(7);
    const ids = flow.map((q) => q.id);
    expect(ids).toEqual(["level", "tempo", "lesao", "encordoamento", "padrao", "padrao_encordoamento", "estilo"]);
  });

  it("returns 7 questions for intermediario (level + 6)", () => {
    const flow = getQuizFlow("intermediario");
    expect(flow).toHaveLength(7);
    const ids = flow.map((q) => q.id);
    expect(ids).toEqual(["level", "estilo", "lesao", "padrao_enc", "peso", "problema_atual", "rigidez"]);
  });

  it("returns 7 questions for avancado (level + 6)", () => {
    const flow = getQuizFlow("avancado");
    expect(flow).toHaveLength(7);
    const ids = flow.map((q) => q.id);
    expect(ids).toEqual(["level", "necessidade", "estilo_avancado", "padrao_enc_avancado", "swingweight", "lesao_avancado", "corda_atual"]);
  });

  it("every question has educational context except level", () => {
    for (const level of ALL_LEVELS) {
      const flow = getQuizFlow(level);
      for (const q of flow) {
        if (q.id === "level") continue;
        expect(q.context, `Question ${q.id} in ${level} should have context`).toBeDefined();
        expect(q.context!.length).toBeGreaterThan(20);
      }
    }
  });

  it("each question has text and at least 2 options", () => {
    for (const level of ALL_LEVELS) {
      const flow = getQuizFlow(level);
      for (const q of flow) {
        expect(q.text.length).toBeGreaterThan(0);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("every option has a non-empty value and label", () => {
    for (const level of ALL_LEVELS) {
      const flow = getQuizFlow(level);
      for (const q of flow) {
        for (const opt of q.options) {
          expect(opt.value.length).toBeGreaterThan(0);
          expect(opt.label.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
