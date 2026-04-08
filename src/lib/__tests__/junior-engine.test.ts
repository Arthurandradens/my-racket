import { describe, it, expect } from "vitest";
import { recommendJunior } from "../junior-engine";
import type { Racket, QuizAnswers } from "../types";

// Minimal racket fixtures
function makeRacket(slug: string, weight: number | null = 250, headSize = 100, ra = 60): Racket {
  return {
    slug,
    brand: "Test",
    model: slug,
    year: "2024",
    weight,
    swingweight: null,
    ra,
    balance_mm: null,
    head_size: headSize,
    string_pattern: "16x19",
    scores: {
      overall: null, groundstrokes: null, volleys: null, serves: null,
      returns: null, power: null, control: null, maneuverability: null,
      stability: null, comfort: null, touch_feel: null, topspin: null, slice: null,
    },
    price_brl: null,
    image_url: null,
    expert_summary_pt: null,
    atp_players: [],
    wta_players: [],
    recommended_levels: [],
  };
}

const RACKETS: Racket[] = [
  makeRacket("babolat-pure-aero-jr-25-2023", 240),
  makeRacket("babolat-pure-drive-jr-26-2021", 250),
  makeRacket("head-speed-jr-25-2024", 230),
  makeRacket("wilson-clash-100-ul-v3-2025", 265, 100, 55),
];

function makeAnswers(overrides: Partial<QuizAnswers> = {}): QuizAnswers {
  return {
    level: "junior",
    altura: "140_150",
    idade: "9_10",
    nivel_junior: "recreativo",
    queixa: "sem_queixa",
    objetivo_junior: "saude_diversao",
    ...overrides,
  } as QuizAnswers;
}

describe("recommendJunior", () => {
  describe("racket size determination", () => {
    it("returns 19 for children below 110cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "abaixo_110" }));
      expect(result.racketSize).toBe("19");
    });

    it("returns 21 for 110-120cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "110_120" }));
      expect(result.racketSize).toBe("21");
    });

    it("returns 23 for 120-130cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "120_130" }));
      expect(result.racketSize).toBe("23");
    });

    it("returns 23 for 130-140cm non-competitive", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "130_140", nivel_junior: "recreativo" }));
      expect(result.racketSize).toBe("23");
    });

    it("returns 25 for 130-140cm competitive", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "130_140", nivel_junior: "competitivo" }));
      expect(result.racketSize).toBe("25");
    });

    it("returns 25 for 140-150cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "140_150" }));
      expect(result.racketSize).toBe("25");
    });

    it("returns 26 for 150-157cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "150_157" }));
      expect(result.racketSize).toBe("26");
    });

    it("returns 26 for above 157cm non-competitive", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "acima_157", nivel_junior: "recreativo" }));
      expect(result.racketSize).toBe("26");
    });

    it("returns adulta_ul for above 157cm competitive", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "acima_157", nivel_junior: "competitivo" }));
      expect(result.racketSize).toBe("adulta_ul");
    });
  });

  describe("racket type determination", () => {
    it("returns recreativa for primeiro_contato", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ nivel_junior: "primeiro_contato" }));
      expect(result.racketType).toBe("recreativa");
    });

    it("returns recreativa for experimentar objective", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ nivel_junior: "regular", objetivo_junior: "experimentar" }));
      expect(result.racketType).toBe("recreativa");
    });

    it("returns intermediate for regular level", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ nivel_junior: "regular", objetivo_junior: "saude_diversao" }));
      expect(result.racketType).toBe("intermediate");
    });

    it("returns performance for competitive", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ nivel_junior: "competitivo", objetivo_junior: "competicao" }));
      expect(result.racketType).toBe("performance");
    });
  });

  describe("ball stage", () => {
    it("returns red foam for youngest", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "abaixo_110", idade: "3_4" }));
      expect(result.ballStage).toContain("Vermelha");
    });

    it("returns orange for 130-140cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "130_140", idade: "9_10" }));
      expect(result.ballStage).toContain("Laranja");
    });

    it("returns green for 150-157cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "150_157", idade: "11_12" }));
      expect(result.ballStage).toContain("Verde");
    });

    it("returns adult yellow for above 157cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "acima_157", idade: "13_mais" }));
      expect(result.ballStage).toContain("Amarela");
    });
  });

  describe("alerts", () => {
    it("returns lesao alert for queixa_braco", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ queixa: "queixa_braco" }));
      expect(result.lesaoAlert).not.toBeNull();
      expect(result.lesaoAlert!.severity).toBe("urgent");
    });

    it("returns lesao alert for fadiga_braco", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ queixa: "fadiga_braco" }));
      expect(result.lesaoAlert).not.toBeNull();
    });

    it("returns null lesao alert for sem_queixa", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ queixa: "sem_queixa" }));
      expect(result.lesaoAlert).toBeNull();
    });

    it("returns transition alert for competitive child under 150cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({
        altura: "130_140",
        nivel_junior: "competitivo",
        objetivo_junior: "competicao",
      }));
      expect(result.transicaoAlert).not.toBeNull();
      expect(result.transicaoAlert!.severity).toBe("info");
    });

    it("returns no transition alert for tall competitive child", () => {
      const result = recommendJunior(RACKETS, makeAnswers({
        altura: "150_157",
        nivel_junior: "competitivo",
      }));
      expect(result.transicaoAlert).toBeNull();
    });
  });

  describe("education blocks", () => {
    it("always includes teste_tamanho", () => {
      const result = recommendJunior(RACKETS, makeAnswers());
      expect(result.educationBlocks.some(b => b.id === "teste_tamanho")).toBe(true);
    });

    it("includes nao_comprar_grande for primeiro_contato", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ nivel_junior: "primeiro_contato" }));
      expect(result.educationBlocks.some(b => b.id === "nao_comprar_grande")).toBe(true);
    });

    it("includes transicao_adulta for tall children", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "150_157" }));
      expect(result.educationBlocks.some(b => b.id === "transicao_adulta")).toBe(true);
    });

    it("includes material_raquete for competitive", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ nivel_junior: "competitivo" }));
      expect(result.educationBlocks.some(b => b.id === "material_raquete")).toBe(true);
    });
  });

  describe("racket filtering", () => {
    it("filters junior 25 rackets for 140-150cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "140_150" }));
      expect(result.rackets.every(r => r.slug.includes("25"))).toBe(true);
    });

    it("filters junior 26 rackets for 150-157cm", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "150_157" }));
      expect(result.rackets.every(r => r.slug.includes("26"))).toBe(true);
    });

    it("filters adult UL rackets for acima_157 competitive", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "acima_157", nivel_junior: "competitivo" }));
      expect(result.rackets.length).toBeGreaterThan(0);
      expect(result.rackets.every(r => !r.slug.includes("jr") && !r.slug.includes("junior"))).toBe(true);
    });

    it("returns empty array when no rackets match size", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ altura: "abaixo_110" }));
      expect(result.rackets).toEqual([]);
    });
  });

  describe("investment level", () => {
    it("returns baixo for recreativa", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ nivel_junior: "primeiro_contato" }));
      expect(result.investmentLevel).toBe("baixo");
    });

    it("returns alto for performance", () => {
      const result = recommendJunior(RACKETS, makeAnswers({ nivel_junior: "competitivo", objetivo_junior: "competicao" }));
      expect(result.investmentLevel).toBe("alto");
    });
  });
});
