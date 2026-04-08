# Junior Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a kids/junior quiz path for parents to find the right racket size and type for their child, integrated into the existing quiz flow.

**Architecture:** New "junior" level option in the existing quiz level selector triggers a 5-question flow (height, age, level, complaints, goals). A separate deterministic engine (`junior-engine.ts`) processes answers into racket size, type, material, ball stage, alerts, and education blocks. The result page branches on `level === "junior"` to render a dedicated `JuniorResult` component with the child's profile, filtered rackets from the database, and educational content.

**Tech Stack:** TypeScript, React, Next.js, Vitest

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/types.ts` | Modify | Add "junior" to PlayerLevel, add JuniorAnswers, JuniorAlert, JuniorResult types |
| `src/lib/quiz-config.ts` | Modify | Add junior option to LEVEL_QUESTION, create JUNIOR_QUESTIONS array |
| `src/lib/junior-engine.ts` | Create | Deterministic recommendation logic for junior quiz |
| `src/lib/__tests__/junior-engine.test.ts` | Create | Tests for junior engine |
| `src/components/JuniorResult.tsx` | Create | Result view component for junior quiz |
| `src/app/resultado/page.tsx` | Modify | Branch on level === "junior" to render JuniorResult |

---

### Task 1: Add junior types to types.ts

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Add "junior" to PlayerLevel union**

In `src/lib/types.ts`, change line 53:

```typescript
// Before:
export type PlayerLevel = "iniciante" | "basico-intermediario" | "intermediario" | "avancado";

// After:
export type PlayerLevel = "iniciante" | "basico-intermediario" | "intermediario" | "avancado" | "junior";
```

- [ ] **Step 2: Add junior-specific fields to QuizAnswers**

In `src/lib/types.ts`, add the following fields to the `QuizAnswers` interface (after the existing Avancado fields, before the closing brace):

```typescript
  // Junior
  altura?: string;
  idade?: string;
  nivel_junior?: string;
  queixa?: string;
  objetivo_junior?: string;
```

- [ ] **Step 3: Add JuniorAlert and JuniorResult interfaces**

At the end of `src/lib/types.ts`, add:

```typescript
export interface JuniorAlert {
  severity: "urgent" | "info";
  title: string;
  message: string;
}

export interface JuniorResult {
  racketSize: string;
  racketType: "recreativa" | "intermediate" | "performance";
  material: string;
  ballStage: string;
  court: string;
  lesaoAlert: JuniorAlert | null;
  transicaoAlert: JuniorAlert | null;
  educationBlocks: EducationBlock[];
  rackets: Racket[];
  investmentLevel: "baixo" | "medio" | "alto";
  trocaPrevisao: string;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add junior quiz types to types.ts"
```

---

### Task 2: Add junior questions to quiz-config.ts

**Files:**
- Modify: `src/lib/quiz-config.ts`

- [ ] **Step 1: Add junior option to LEVEL_QUESTION**

In `src/lib/quiz-config.ts`, add a new option to the `LEVEL_QUESTION.options` array (after the "avancado" option):

```typescript
    { value: "junior", label: "Para o meu filho(a) — Busco a raquete certa para uma criança ou adolescente" },
```

- [ ] **Step 2: Create JUNIOR_QUESTIONS array**

In `src/lib/quiz-config.ts`, add after the `ADVANCED_QUESTIONS` array (before the `getQuizFlow` function):

```typescript
const JUNIOR_QUESTIONS: QuizQuestion[] = [
  {
    id: "altura",
    text: "Qual é a altura aproximada do seu filho(a)?",
    context: "A altura é o fator mais importante para escolher a raquete certa — mais importante até que a idade. Raquetes muito grandes causam vícios técnicos e podem lesionar o pulso e o cotovelo. Raquetes muito pequenas limitam o desenvolvimento. A medida certa transforma o aprendizado.",
    options: [
      { value: "abaixo_110", label: "Abaixo de 110cm" },
      { value: "110_120", label: "110–120cm" },
      { value: "120_130", label: "120–130cm" },
      { value: "130_140", label: "130–140cm" },
      { value: "140_150", label: "140–150cm" },
      { value: "150_157", label: "150–157cm" },
      { value: "acima_157", label: "Acima de 157cm" },
    ],
  },
  {
    id: "idade",
    text: "Quantos anos tem seu filho(a)?",
    context: "A idade ajuda a contextualizar o estágio de desenvolvimento motor e o tipo de jogo esperado. Crianças altas para a idade podem usar raquetes maiores — mas o resultado sempre prioriza a altura que você informou antes.",
    options: [
      { value: "3_4", label: "3–4 anos" },
      { value: "5_6", label: "5–6 anos" },
      { value: "7_8", label: "7–8 anos" },
      { value: "9_10", label: "9–10 anos" },
      { value: "11_12", label: "11–12 anos" },
      { value: "13_mais", label: "13 anos ou mais" },
    ],
  },
  {
    id: "nivel_junior",
    text: "Como você descreveria o envolvimento do seu filho(a) com o tênis?",
    context: "Isso define o tipo de raquete — e o quanto vale investir. Um iniciante que joga 1x por semana precisa de algo diferente de quem treina 4x e participa de torneios. E não adianta comprar a raquete \"de competição\" se a criança ainda está aprendendo a rebater — pode até atrapalhar.",
    options: [
      { value: "primeiro_contato", label: "Experimentando pela primeira vez — nunca jogou" },
      { value: "recreativo", label: "Aulas recreativas — 1–2x por semana" },
      { value: "regular", label: "Joga regularmente — 3–4x por semana, escolinhas" },
      { value: "competitivo", label: "Jogador competitivo — treina diariamente ou participa de torneios" },
    ],
  },
  {
    id: "queixa",
    text: "Seu filho(a) já reclamou de alguma dor ou desconforto jogando tênis?",
    context: "Crianças raramente verbalizam dores até ficarem sérias. Dores no pulso, cotovelo ou ombro após jogar podem ser sinais de que a raquete está grande demais, pesada demais, ou que o encordoamento está errado. Identifique isso cedo — na criança, esses problemas se desenvolvem rapidamente.",
    options: [
      { value: "sem_queixa", label: "Não, nunca reclamou de dor" },
      { value: "queixa_braco", label: "Às vezes reclama do pulso ou cotovelo depois de jogar" },
      { value: "fadiga_braco", label: "Reclama que a raquete é difícil de mover — fica com o braço cansado" },
      { value: "sem_historico", label: "Nunca jogou o suficiente para avaliar" },
    ],
  },
  {
    id: "objetivo_junior",
    text: "Qual é o principal objetivo de vocês com o tênis agora?",
    context: "Isso afeta o quanto vale investir e qual aspecto priorizar na recomendação — diversão e motor skills para os menores, ou técnica e progressão para os que querem levar o esporte a sério.",
    options: [
      { value: "experimentar", label: "Experimentar o esporte, ver se curte — sem compromisso" },
      { value: "saude_diversao", label: "Atividade saudável, diversão e exercício" },
      { value: "tecnica_futuro", label: "Aprender bem a técnica — possibilidade de competir no futuro" },
      { value: "competicao", label: "Levar o tênis a sério — treinos regulares e competições" },
    ],
  },
];
```

- [ ] **Step 3: Add junior case to getQuizFlow**

In `src/lib/quiz-config.ts`, add a case for "junior" in the `getQuizFlow` switch:

```typescript
// Before:
    case "avancado":
      return [LEVEL_QUESTION, ...ADVANCED_QUESTIONS];
  }

// After:
    case "avancado":
      return [LEVEL_QUESTION, ...ADVANCED_QUESTIONS];
    case "junior":
      return [LEVEL_QUESTION, ...JUNIOR_QUESTIONS];
  }
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/quiz-config.ts
git commit -m "feat: add junior quiz questions and flow"
```

---

### Task 3: Create junior engine with tests (TDD)

**Files:**
- Create: `src/lib/__tests__/junior-engine.test.ts`
- Create: `src/lib/junior-engine.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/__tests__/junior-engine.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/junior-engine.test.ts`
Expected: FAIL — module `../junior-engine` does not exist.

- [ ] **Step 3: Create junior-engine.ts implementation**

Create `src/lib/junior-engine.ts`:

```typescript
import type { Racket, QuizAnswers, EducationBlock, JuniorAlert, JuniorResult } from "./types";
import { hasProspinLink } from "./affiliate";

export function recommendJunior(allRackets: Racket[], answers: QuizAnswers): JuniorResult {
  const altura = answers.altura ?? "130_140";
  const idade = answers.idade ?? "9_10";
  const nivel = answers.nivel_junior ?? "recreativo";
  const queixa = answers.queixa ?? "sem_queixa";
  const objetivo = answers.objetivo_junior ?? "saude_diversao";

  const racketSize = getRacketSize(altura, nivel);
  const racketType = getRacketType(nivel, objetivo);
  const ballStage = getBallStage(altura, idade);
  const material = getMaterial(racketType, racketSize);
  const court = getCourtSize(altura);
  const lesaoAlert = getLesaoAlert(queixa);
  const transicaoAlert = getTransicaoAlert(altura, nivel, objetivo);
  const educationBlocks = getEducationBlocks(altura, idade, nivel, objetivo);
  const rackets = getJuniorRackets(allRackets, racketSize);
  const investmentLevel = getInvestmentLevel(racketType);

  return {
    racketSize,
    racketType,
    material,
    ballStage,
    court,
    lesaoAlert,
    transicaoAlert,
    educationBlocks,
    rackets,
    investmentLevel,
    trocaPrevisao: "12–18 meses",
  };
}

function getRacketSize(altura: string, nivel: string): string {
  switch (altura) {
    case "abaixo_110": return "19";
    case "110_120":    return "21";
    case "120_130":    return "23";
    case "130_140":    return nivel === "competitivo" ? "25" : "23";
    case "140_150":    return "25";
    case "150_157":    return "26";
    case "acima_157":  return nivel === "competitivo" ? "adulta_ul" : "26";
    default:           return "23";
  }
}

function getRacketType(nivel: string, objetivo: string): "recreativa" | "intermediate" | "performance" {
  if (nivel === "primeiro_contato" || nivel === "recreativo" || objetivo === "experimentar") {
    return "recreativa";
  }
  if (nivel === "regular" || objetivo === "tecnica_futuro") {
    return "intermediate";
  }
  if (nivel === "competitivo" || objetivo === "competicao") {
    return "performance";
  }
  return "recreativa";
}

function getBallStage(altura: string, idade: string): string {
  if (altura === "abaixo_110" || idade === "3_4") return "Vermelha (espuma)";
  if (altura === "110_120" || idade === "5_6")    return "Vermelha (Stage 3)";
  if (altura === "120_130" || idade === "7_8")    return "Vermelha / começando laranja";
  if (altura === "130_140" || idade === "9_10")   return "Laranja (Stage 2)";
  if (altura === "140_150")                        return "Laranja → Verde";
  if (altura === "150_157" || idade === "11_12")  return "Verde (Stage 1)";
  if (altura === "acima_157" || idade === "13_mais") return "Amarela adulta";
  return "Laranja";
}

function getMaterial(racketType: string, tamanho: string): string {
  const size = parseInt(tamanho) || 27;
  if (racketType === "recreativa" && size <= 21) return "Alumínio";
  if (racketType === "recreativa") return "Alumínio ou composite básico";
  if (racketType === "intermediate") return "Composite alumínio-grafite ou grafite";
  if (racketType === "performance") return "Grafite completo (100%)";
  return "Alumínio ou composite básico";
}

function getCourtSize(altura: string): string {
  if (altura === "abaixo_110" || altura === "110_120") return "Mini quadra (11m)";
  if (altura === "120_130" || altura === "130_140") return "Quadra reduzida (18m)";
  if (altura === "140_150") return "Quadra 60–78 pés";
  return "Quadra adulta (78 pés)";
}

function getLesaoAlert(queixa: string): JuniorAlert | null {
  if (queixa === "sem_queixa" || queixa === "sem_historico") return null;
  return {
    severity: "urgent",
    title: "Atenção: sinais de sobrecarga no braço",
    message: "Dores no pulso ou cotovelo após jogar são um sinal de alerta importante. As causas mais comuns em crianças são: (1) raquete grande ou pesada demais para a estatura/força atual, (2) muitas horas de jogo sem pausas, (3) técnica sendo forçada antes do tempo. Verifique se o tamanho que recomendamos está sendo respeitado. Em caso de dor persistente, consulte um pediatra ortopedista antes de continuar jogando.",
  };
}

function getTransicaoAlert(altura: string, nivel: string, objetivo: string): JuniorAlert | null {
  const alturaValues: Record<string, number> = {
    abaixo_110: 105, "110_120": 115, "120_130": 125,
    "130_140": 135, "140_150": 145, "150_157": 153, acima_157: 160,
  };
  const alturaMedia = alturaValues[altura] || 140;
  if (alturaMedia < 150 && (nivel === "competitivo" || objetivo === "competicao")) {
    return {
      severity: "info",
      title: "Sobre a transição para raquete adulta",
      message: "Sabemos que crianças competitivas às vezes sentem que precisam de raquete adulta. Mas a transição prematura — antes de 150cm de altura — cria problemas biomecânicos reais: o lever maior obriga a criança a se posicionar de forma errada, deforma o swing e pode lesionar ombro e cotovelo. A raquete 26\" de performance (grafite) é genuinamente competitiva. Aguardar o crescimento é sempre a decisão certa.",
    };
  }
  return null;
}

function getEducationBlocks(altura: string, idade: string, nivel: string, objetivo: string): EducationBlock[] {
  const blocks: EducationBlock[] = [];

  // Sistema de bolas — always for younger kids
  if (idade !== "13_mais") {
    blocks.push({
      id: "sistema_bolas",
      title: "O sistema de bolas coloridas — o que é e por que importa",
      content: "O ITF e a USTA criaram um sistema de bolas progressivas para que crianças aprendam tênis da forma certa:\n\n🔴 Bola Vermelha (Stage 3): 75% mais lenta que a bola adulta. Quadra de 11m. Para crianças até ~8 anos. Foco em contato, coordenação e diversão.\n\n🟠 Bola Laranja (Stage 2): ~50% mais lenta. Quadra de 18m. Para 7–10 anos. A técnica começa a se desenvolver de verdade.\n\n🟢 Bola Verde (Stage 1): ~25% mais lenta. Quadra adulta completa. Para 9–12 anos.\n\n🟡 Bola Amarela (adulta): A partir de 11+ anos.\n\nCada estágio tem um tamanho máximo de raquete recomendado. Usar a bola correta para a fase da criança é tão importante quanto o tamanho da raquete.",
    });
  }

  // Não comprar grande
  if (objetivo === "experimentar" || nivel === "primeiro_contato") {
    blocks.push({
      id: "nao_comprar_grande",
      title: "Resistir à tentação de comprar a raquete 'grande para durar'",
      content: "É tentador comprar uma raquete maior para aproveitar por mais tempo. Mas raquete grande demais é um dos erros mais comuns — e mais prejudiciais — que os pais cometem. Uma criança com raquete grande demais vai encurtar o swing, desenvolver vícios técnicos difíceis de corrigir, cansar mais rápido e ter mais risco de dores no pulso e cotovelo. A raquete certa para HOJE é sempre a melhor escolha, mesmo que dure só 12–18 meses.",
    });
  }

  // Encordoamento para iniciantes
  if (nivel === "recreativo" || nivel === "primeiro_contato") {
    blocks.push({
      id: "encordoamento_iniciante",
      title: "Sobre o encordoamento — o que os pais precisam saber",
      content: "Para crianças iniciantes ou recreativas: a corda de fábrica que vem na raquete está ótima. Não precisa reencordar agora.\n\nO que NUNCA usar em crianças: polyester (corda dura, comum em raquetes adultas de performance). É a corda mais agressiva para articulações em formação.\n\nQuando começar a reencordar: quando a criança joga 3+ vezes por semana, começa a participar de torneios, ou a corda quebra. Usar multifilamento em tensão baixa (44–48 lbs). Regra prática: reencordar pelo menos tantas vezes por ano quanto a criança joga por semana.",
    });
  }

  // Teste de tamanho — always
  blocks.push({
    id: "teste_tamanho",
    title: "Como confirmar em casa se a raquete está no tamanho certo",
    content: "Teste 1 — Braço estendido: Peça à criança para segurar a raquete com o braço estendido para frente, apontando horizontalmente. Ela deve manter por 10–15 segundos sem tremer. Se o braço cair, a raquete é pesada/grande demais.\n\nTeste 2 — Ao lado do corpo: Com a criança em pé e segurando a raquete ao lado do corpo com o braço relaxado, a cabeça da raquete NÃO deve arrastar no chão. Se arrastar: grande demais.\n\nTeste 3 — Swing: observe a criança fazendo forehand e backhand. Se ela parecer estar 'lutando' contra a raquete ou encurtando os movimentos, pode ser grande demais.",
  });

  // Transição para adulta
  if (altura === "150_157" || altura === "acima_157") {
    blocks.push({
      id: "transicao_adulta",
      title: "Quando e como fazer a transição para raquete adulta",
      content: "A maioria das crianças faz essa transição entre 11–13 anos, mas a altura e a técnica importam mais que a idade.\n\nSinais de prontidão:\n✅ Altura acima de 150cm\n✅ Consegue controlar uma raquete 26\" com swing completo sem tremer\n✅ Treina com frequência (3+ vezes por semana)\n✅ Técnica básica desenvolvida (forehand, backhand, serviço)\n\nComo fazer com segurança:\n1. Começar com modelos UL (ultralight) — entre 230–265g. Nunca ir direto para 300g+.\n2. Manter cabeça grande (105–110 in²) nas primeiras raquetes adultas.\n3. Encordoamento multifilamento — NUNCA polyester na transição.\n4. Se aparecer dor no braço: voltar ao 26\" por mais tempo.",
    });
  }

  // Material da raquete
  if (nivel === "regular" || nivel === "competitivo") {
    blocks.push({
      id: "material_raquete",
      title: "Alumínio vs. grafite — quando faz diferença real",
      content: "Para crianças iniciantes ou recreativas (1–2x por semana): alumínio está ótimo. É durável, acessível e mais do que suficiente para aprender.\n\nA partir do nível 'regular' (3–4x por semana) ou competitivo: vale considerar grafite. Grafite é mais leve por cm — ou seja, para o mesmo tamanho você tem menos peso. Também transmite melhor a energia da tacada e oferece mais feeling.\n\nGrafite composto (alumínio + grafite): boa opção intermediária. Melhor que alumínio puro, mais barato que grafite completo.\n\nGrafite 100%: raquetes de performance junior (ex: Babolat Pure Drive Junior 26, Wilson Blade Junior 26 v9). Genuinamente competitivas.",
    });
  }

  return blocks;
}

function getJuniorRackets(allRackets: Racket[], size: string): Racket[] {
  let filtered: Racket[];

  if (size === "adulta_ul") {
    filtered = allRackets.filter(r =>
      !r.slug.includes("jr") && !r.slug.includes("junior") &&
      r.weight !== null && r.weight <= 275 &&
      r.head_size >= 100 &&
      r.ra <= 65
    );
  } else {
    filtered = allRackets.filter(r =>
      (r.slug.includes("jr") || r.slug.includes("junior")) &&
      r.slug.includes(size)
    );
  }

  return filtered.sort((a, b) => {
    const aLink = hasProspinLink(a.slug) ? 1 : 0;
    const bLink = hasProspinLink(b.slug) ? 1 : 0;
    if (bLink !== aLink) return bLink - aLink;
    const aYear = a.year ? parseInt(a.year) : 0;
    const bYear = b.year ? parseInt(b.year) : 0;
    return bYear - aYear;
  }).slice(0, 6);
}

function getInvestmentLevel(racketType: string): "baixo" | "medio" | "alto" {
  if (racketType === "recreativa") return "baixo";
  if (racketType === "intermediate") return "medio";
  return "alto";
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/junior-engine.test.ts`
Expected: PASS — all tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/junior-engine.ts src/lib/__tests__/junior-engine.test.ts
git commit -m "feat: add junior recommendation engine with tests"
```

---

### Task 4: Create JuniorResult component

**Files:**
- Create: `src/components/JuniorResult.tsx`

- [ ] **Step 1: Create the JuniorResult component**

Create `src/components/JuniorResult.tsx`:

```tsx
import type { JuniorResult as JuniorResultType, Racket } from "@/lib/types";
import RacketCard from "./RacketCard";
import AffiliateButton from "./AffiliateButton";

interface JuniorResultProps {
  result: JuniorResultType;
}

const SIZE_LABELS: Record<string, string> = {
  "19": "19 polegadas (48cm)",
  "21": "21 polegadas (53cm)",
  "23": "23 polegadas (58cm)",
  "25": "25 polegadas (63cm)",
  "26": "26 polegadas (66cm)",
  "adulta_ul": "Adulta ultralight (transição)",
};

const TYPE_LABELS: Record<string, string> = {
  recreativa: "Recreativa",
  intermediate: "Intermediária",
  performance: "Performance",
};

const INVESTMENT_LABELS: Record<string, string> = {
  baixo: "Investimento baixo — foque em durabilidade e tamanho correto",
  medio: "Investimento moderado — vale considerar qualidade superior",
  alto: "Investimento justificado — raquete de performance faz diferença",
};

export default function JuniorResult({ result }: JuniorResultProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Profile summary */}
      <div
        className="bg-bg-elevated border border-surface rounded-lg p-6 sm:p-8"
        style={{ animation: "fadeInUp 0.6s ease-out" }}
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text uppercase tracking-wide mb-6">
          Resultado do quiz infantil
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileItem label="Tamanho da raquete" value={SIZE_LABELS[result.racketSize] ?? result.racketSize} highlight />
          <ProfileItem label="Tipo" value={TYPE_LABELS[result.racketType] ?? result.racketType} />
          <ProfileItem label="Material recomendado" value={result.material} />
          <ProfileItem label="Estágio de bola" value={result.ballStage} />
          <ProfileItem label="Quadra" value={result.court} />
          <ProfileItem label="Investimento" value={INVESTMENT_LABELS[result.investmentLevel] ?? result.investmentLevel} />
        </div>

        <div className="mt-4 pt-4 border-t border-surface">
          <p className="text-sm text-text-muted">
            Previsão de troca: <span className="text-text-secondary font-medium">{result.trocaPrevisao}</span> — reavalie conforme o crescimento
          </p>
        </div>
      </div>

      {/* Alerts */}
      {result.lesaoAlert && (
        <div
          className="rounded-lg p-5 flex flex-col gap-3 bg-danger/10 border-2 border-danger/30"
          style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
        >
          <h2 className="text-lg font-bold text-danger flex items-center gap-2">
            {result.lesaoAlert.title}
          </h2>
          <p className="text-sm text-danger/80 leading-relaxed">
            {result.lesaoAlert.message}
          </p>
        </div>
      )}

      {result.transicaoAlert && (
        <div
          className="rounded-lg p-5 flex flex-col gap-3 bg-accent/10 border border-accent/20"
          style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
        >
          <h2 className="text-lg font-bold text-accent flex items-center gap-2">
            {result.transicaoAlert.title}
          </h2>
          <p className="text-sm text-accent/80 leading-relaxed">
            {result.transicaoAlert.message}
          </p>
        </div>
      )}

      {/* Racket recommendations */}
      {result.rackets.length > 0 && (
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-text uppercase tracking-wide mb-6 text-center">
            Raquetes recomendadas
          </h2>
          <div className="flex flex-col gap-6">
            {result.rackets.map((racket, i) => (
              <div
                key={racket.slug}
                style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}
              >
                <RacketCard racket={racket} />
              </div>
            ))}
          </div>
        </div>
      )}

      {result.rackets.length === 0 && (
        <div className="bg-bg-elevated border border-surface rounded-lg p-6 text-center">
          <p className="text-text-secondary">
            Ainda não temos raquetes de {SIZE_LABELS[result.racketSize] ?? result.racketSize} no nosso banco de dados.
            O guia abaixo vai te ajudar a escolher a raquete certa.
          </p>
        </div>
      )}

      {/* Education blocks */}
      {result.educationBlocks.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-text uppercase tracking-wide text-center">
            Guia para pais
          </h2>
          {result.educationBlocks.map((block, i) => (
            <div
              key={block.id}
              className="bg-bg-elevated border border-surface rounded-lg p-5"
              style={{ animation: `fadeInUp 0.5s ease-out ${0.3 + i * 0.05}s both` }}
            >
              <h3 className="text-sm font-bold text-accent mb-3">
                {block.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {block.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-accent text-lg" : "text-text-secondary"}`}>
        {value}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/JuniorResult.tsx
git commit -m "feat: add JuniorResult component"
```

---

### Task 5: Integrate junior result into resultado page

**Files:**
- Modify: `src/app/resultado/page.tsx`

- [ ] **Step 1: Add junior imports**

At the top of `src/app/resultado/page.tsx`, add:

```typescript
import type { JuniorResult as JuniorResultType } from "@/lib/types";
import { recommendJunior } from "@/lib/junior-engine";
import JuniorResult from "@/components/JuniorResult";
```

- [ ] **Step 2: Add JuniorResultData type and update state**

After the existing `ResultData` interface (line 21-28), add:

```typescript
interface JuniorResultData {
  result: JuniorResultType;
  answers: QuizAnswers;
}
```

Then add state for junior data. After line 37 (`const [data, setData] = useState<ResultData | null>(null);`), add:

```typescript
const [juniorData, setJuniorData] = useState<JuniorResultData | null>(null);
```

- [ ] **Step 3: Add junior branch in useEffect**

In the `useEffect`, after `answers = JSON.parse(raw) as QuizAnswers;` (after the try/catch block around line 55), add a branch for junior before the adult logic:

```typescript
    if (answers.level === "junior") {
      const result = recommendJunior(rackets, answers);
      setJuniorData({ result, answers });

      setTimeout(() => {
        setPhase("reveal");
        setTimeout(() => setPhase("done"), 800);
      }, 2500);

      return;
    }
```

- [ ] **Step 4: Add junior result rendering**

After the loading phase check (after the `if (phase === "loading")` block that ends around line 145), and before the `if (!data || top3.length === 0)` check, add:

```typescript
  // Junior result
  if (juniorData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
        <JuniorResult result={juniorData.result} />

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-surface">
          <Link
            href="/quiz"
            className="border border-surface text-text-secondary font-semibold px-6 py-3 rounded hover:border-primary hover:text-primary transition-colors"
          >
            Refazer quiz
          </Link>
          <Link
            href="/raquetes"
            className="bg-primary text-white font-bold px-6 py-3 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
          >
            Ver catálogo completo
          </Link>
        </div>
      </div>
    );
  }
```

- [ ] **Step 5: Verify the app builds**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/resultado/page.tsx
git commit -m "feat: integrate junior quiz results into resultado page"
```

---

### Task 6: Final verification

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests pass.

- [ ] **Step 2: Build the app**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 3: Manual smoke test**

Start dev server (`npx next dev`) and verify:

1. `/quiz` — "Para o meu filho(a)" option appears in level selector
2. Selecting it shows 5 junior questions with educational context
3. Completing the quiz goes to `/resultado` with junior layout
4. Profile summary shows racket size, type, material, ball stage, court
5. For `queixa_braco` — urgent alert appears in red
6. For competitive child under 150cm — transition alert appears
7. Racket cards appear for sizes with data (25", 26")
8. Education blocks show conditionally (test `primeiro_contato` vs `competitivo`)
9. For `abaixo_110` — "no rackets in database" message appears, guide still shows

- [ ] **Step 4: Commit any final fixes if needed**
