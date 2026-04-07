import { describe, it, expect } from "vitest";
import { getQuizFlow } from "../quiz-config";

describe("getQuizFlow", () => {
  it("returns level question as first step for all flows", () => {
    const flow = getQuizFlow("iniciante");
    expect(flow[0].id).toBe("level");
  });

  it("returns beginner-specific questions after level", () => {
    const flow = getQuizFlow("iniciante");
    const ids = flow.map((q) => q.id);
    expect(ids).toContain("frequency");
    expect(ids).toContain("physique");
    expect(ids).toContain("injury");
    expect(ids).toContain("budget");
    expect(ids).not.toContain("play_style");
  });

  it("returns intermediate-specific questions after level", () => {
    const flow = getQuizFlow("intermediario");
    const ids = flow.map((q) => q.id);
    expect(ids).toContain("play_style");
    expect(ids).toContain("improvement");
    expect(ids).toContain("injury");
    expect(ids).toContain("budget");
  });

  it("returns advanced-specific questions after level", () => {
    const flow = getQuizFlow("avancado");
    const ids = flow.map((q) => q.id);
    expect(ids).toContain("play_style");
    expect(ids).toContain("main_shot");
    expect(ids).toContain("tech_preferences_weight");
    expect(ids).toContain("change_desired");
    expect(ids).toContain("budget");
  });

  it("each question has text and at least 2 options", () => {
    for (const level of ["iniciante", "intermediario", "avancado"] as const) {
      const flow = getQuizFlow(level);
      for (const q of flow) {
        expect(q.text.length).toBeGreaterThan(0);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
