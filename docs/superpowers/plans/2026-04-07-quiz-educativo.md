# Quiz Educativo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the tennis racket quiz with 4 player levels, educational context per question, and a results page with explained spec profiles, injury alerts, and personalized education blocks — all based on the research document.

**Architecture:** Update types → quiz-config (questions + context) → engine (scoring + result generation) → UI components (QuizStep with collapsible context, ResultadoPage with spec profile). Each layer is independent and testable.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, Vitest

**Spec:** `docs/superpowers/specs/2026-04-07-quiz-educativo-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/types.ts` | Modify | Add new types (PlayerLevel expanded, QuizAnswers rewritten, SpecRecommendation, EducationBlock, InjuryAlert) |
| `src/lib/quiz-config.ts` | Rewrite | 4 levels with all questions + educational context from document |
| `src/lib/engine.ts` | Modify | Add basico-intermediario defaults, swingweight/pattern scoring, generateSpecProfile, generateEducationBlocks, generateInjuryAlert |
| `src/components/QuizStep.tsx` | Modify | Add collapsible educational context card, back button |
| `src/app/quiz/page.tsx` | Modify | Support 4 levels, back navigation |
| `src/app/resultado/page.tsx` | Modify | Add spec profile table, injury alerts, education blocks above racket list |
| `src/lib/__tests__/types.test.ts` | Modify | Update for new types |
| `src/lib/__tests__/quiz-config.test.ts` | Rewrite | Test 4 levels, context field presence |
| `src/lib/__tests__/engine.test.ts` | Rewrite | Test new level, scoring, generateSpecProfile, generateEducationBlocks, generateInjuryAlert |

---

### Task 1: Update Types

**Files:**
- Modify: `src/lib/types.ts`
- Test: `src/lib/__tests__/types.test.ts`

- [ ] **Step 1: Update types.ts with new interfaces**

Replace the full content of `src/lib/types.ts`:

```typescript
export interface RacketScores {
  overall: number | null;
  groundstrokes: number | null;
  volleys: number | null;
  serves: number | null;
  returns: number | null;
  power: number | null;
  control: number | null;
  maneuverability: number | null;
  stability: number | null;
  comfort: number | null;
  touch_feel: number | null;
  topspin: number | null;
  slice: number | null;
}

export interface Racket {
  slug: string;
  brand: string;
  model: string;
  year: string | null;
  weight: number | null;
  swingweight: number | null;
  ra: number;
  balance_mm: number | null;
  head_size: number;
  string_pattern: string;
  scores: RacketScores;
  price_brl: number | null;
  expert_summary_pt: string | null;
  atp_players: string[];
  wta_players: string[];
  recommended_levels: string[];
}

export interface SpecRange {
  min: number;
  max: number;
  importance: number;
}

export interface IdealProfile {
  weight: SpecRange;
  head_size: SpecRange;
  ra: SpecRange;
  balance_mm: SpecRange;
  swingweight: SpecRange;
  preferred_patterns: string[];
  pattern_importance: number;
}

export type PlayerLevel = "iniciante" | "basico-intermediario" | "intermediario" | "avancado";

export interface QuizAnswers {
  level: PlayerLevel;
  // Iniciante
  lesao?: string;
  fisico?: string;
  objetivo?: string;
  frequencia?: string;
  estilo_basico?: string;
  // Basico-Intermediario
  tempo?: string;
  encordoamento?: string;
  padrao?: string;
  padrao_encordoamento?: string;
  estilo?: string;
  // Intermediario
  padrao_enc?: string;
  peso?: string;
  problema_atual?: string;
  rigidez?: string;
  // Avancado
  necessidade?: string;
  estilo_avancado?: string;
  padrao_enc_avancado?: string;
  swingweight?: string;
  lesao_avancado?: string;
  corda_atual?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  context?: string;
  options: { value: string; label: string }[];
}

export interface ScoredRacket {
  racket: Racket;
  score: number;
  reasons: string[];
}

export interface SpecRecommendation {
  spec: string;
  value: string;
  reason: string;
}

export interface EducationBlock {
  id: string;
  title: string;
  content: string;
}

export interface InjuryAlert {
  severity: "warning" | "urgent";
  title: string;
  recommendations: string[];
}
```

- [ ] **Step 2: Update types test**

Replace the full content of `src/lib/__tests__/types.test.ts`:

```typescript
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
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/lib/__tests__/types.test.ts`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/__tests__/types.test.ts
git commit -m "feat: update types for quiz educativo — 4 levels, new answer fields, result types"
```

---

### Task 2: Rewrite Quiz Config

**Files:**
- Rewrite: `src/lib/quiz-config.ts`
- Rewrite: `src/lib/__tests__/quiz-config.test.ts`

- [ ] **Step 1: Write the failing tests**

Replace the full content of `src/lib/__tests__/quiz-config.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { getQuizFlow } from "../quiz-config";
import type { PlayerLevel } from "../types";

const ALL_LEVELS: PlayerLevel[] = [
  "iniciante",
  "basico-intermediario",
  "intermediario",
  "avancado",
];

describe("getQuizFlow", () => {
  it("returns level question as first step for all flows", () => {
    for (const level of ALL_LEVELS) {
      const flow = getQuizFlow(level);
      expect(flow[0].id).toBe("level");
    }
  });

  it("level question has 4 options for 4 levels", () => {
    const flow = getQuizFlow("iniciante");
    expect(flow[0].options).toHaveLength(4);
    const values = flow[0].options.map((o) => o.value);
    expect(values).toEqual(ALL_LEVELS);
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/quiz-config.test.ts`
Expected: FAIL — current quiz-config doesn't have basico-intermediario, doesn't have context, etc.

- [ ] **Step 3: Rewrite quiz-config.ts**

Replace the full content of `src/lib/quiz-config.ts` with all 4 levels and every question from the spec document. Each question includes the `context` field with the educational text from the document.

```typescript
import type { QuizQuestion, PlayerLevel } from "./types";

const LEVEL_QUESTION: QuizQuestion = {
  id: "level",
  text: "Qual é o seu nível de tênis?",
  options: [
    { value: "iniciante", label: "Iniciante — Nunca joguei ou jogo há menos de 3 meses" },
    { value: "basico-intermediario", label: "Básico-Intermediário — 3 meses a 2 anos, jogo regularmente" },
    { value: "intermediario", label: "Intermediário — 2+ anos, estilo definido, busco performance" },
    { value: "avancado", label: "Avançado — Competitivo ou 5+ anos intensos" },
  ],
};

// ─── INICIANTE (5 perguntas) ────────────────────────────────

const BEGINNER_QUESTIONS: QuizQuestion[] = [
  {
    id: "lesao",
    text: "Você tem ou já teve dor no cotovelo, punho ou ombro?",
    context:
      "Isso é crucial. Raquetes com frame rígido (RA alto) transferem mais vibração para o braço — o que pode causar ou agravar lesões como o 'cotovelo do tenista'. Uma raquete com frame mais flexível pode fazer grande diferença na sua saúde.",
    options: [
      { value: "sem_lesao", label: "Não, estou sem dores" },
      { value: "cotovelo_leve", label: "Dor leve ou ocasional no cotovelo" },
      { value: "cotovelo_forte", label: "Dor frequente no cotovelo ou punho" },
      { value: "ombro", label: "Dor no ombro ou problemas no manguito" },
    ],
  },
  {
    id: "fisico",
    text: "Como você descreveria seu condicionamento físico e força no braço?",
    context:
      "O peso da raquete afeta diretamente o quanto de energia você precisa gastar para cada tacada. Para iniciantes, uma raquete leve (260–280g) é mais segura e reduz fadiga — mas deve ser pesada o suficiente para estabilizar o impacto da bola.",
    options: [
      { value: "fraco", label: "Tenho pouca força e me canso rápido" },
      { value: "medio", label: "Força média, jogo por prazer" },
      { value: "atletico", label: "Sou atlético(a), tenho boa resistência" },
    ],
  },
  {
    id: "objetivo",
    text: "Qual é o seu principal objetivo agora no tênis?",
    context:
      "Iniciantes se beneficiam de raquetes com maior área de cabeça (105–115 in²) — o sweet spot maior perdoa mais erros de centro. Isso permite focar na técnica, não na precisão do contato. Só depois de ganhar consistência vale pensar em raquetes menores.",
    options: [
      { value: "aprender", label: "Quero aprender do zero, sem me frustrar" },
      { value: "diversao", label: "Quero me divertir e fazer exercício" },
      { value: "evolucao", label: "Quero evoluir rápido e jogar bem logo" },
    ],
  },
  {
    id: "frequencia",
    text: "Com que frequência você pretende jogar?",
    context:
      "Jogar 1–2x por semana como lazer tem exigências muito diferentes de quem quer jogar 4–5x. Frequência maior significa mais desgaste da corda (especialmente poly), mais fadiga muscular e maior necessidade de equipamento de qualidade.",
    options: [
      { value: "lazer", label: "1–2x por semana como lazer" },
      { value: "regular", label: "3–4x por semana" },
      { value: "intenso", label: "Todo dia ou quase isso" },
    ],
  },
  {
    id: "estilo_basico",
    text: "Mesmo sem experiência, qual tipo de jogo mais te atrai?",
    context:
      "Mesmo sem ter um estilo definido, sua preferência natural já diz muito sobre que tipo de raquete vai te motivar mais. Quem quer bater forte precisa de mais controle; quem quer trocar bolas quer mais perdão nos erros.",
    options: [
      { value: "fundo", label: "Quero trocar bolas do fundo da quadra" },
      { value: "rede", label: "Quero subir à rede e fazer voleys" },
      { value: "indefinido", label: "Ainda não sei — quero experimentar" },
    ],
  },
];

// ─── BÁSICO-INTERMEDIÁRIO (6 perguntas) ─────────────────────

const BASIC_INTERMEDIATE_QUESTIONS: QuizQuestion[] = [
  {
    id: "tempo",
    text: "Há quanto tempo você joga tênis?",
    context:
      "O tempo de jogo influencia diretamente a capacidade de gerar potência própria. Quem joga há menos de 6 meses ainda depende muito da raquete para criar velocidade de bola e precisa de mais 'ajuda' do equipamento.",
    options: [
      { value: "menos6", label: "Menos de 6 meses" },
      { value: "6a12", label: "6 meses a 1 ano" },
      { value: "1a2", label: "1 a 2 anos" },
    ],
  },
  {
    id: "lesao",
    text: "Você tem ou já teve dor no cotovelo, punho ou ombro jogando tênis?",
    context:
      "A rigidez do frame (RA rating) é o fator mais direto para o cotovelo. Frames com RA acima de 68 transferem muito choque para o braço. Para jogadores ainda desenvolvendo técnica, a combinação rígido + poly é especialmente perigosa.",
    options: [
      { value: "sem_lesao", label: "Não tenho dores" },
      { value: "leve", label: "Dor leve, aparece depois de muito jogo" },
      { value: "forte", label: "Sinto dor frequente no cotovelo" },
    ],
  },
  {
    id: "encordoamento",
    text: "Você sabe que tipo de encordoamento sua raquete atual usa?",
    context:
      "O encordoamento pode ser mais importante que a própria raquete para o braço e o jogo. Cordas de polyester são duras, geram mais spin mas são as mais agressivas para o cotovelo. Muitas raquetes de fábrica vêm com corda sintética de baixa qualidade que é rígida E sem durabilidade.",
    options: [
      { value: "nao_sei", label: "Não sei / vem da fábrica" },
      { value: "poly", label: "Polyester (dura, comum em raquetes modernas)" },
      { value: "multi", label: "Multifilamento ou gut natural (mais macia)" },
    ],
  },
  {
    id: "padrao",
    text: "Onde a maioria das suas bolas cai na quadra adversária?",
    context:
      "Isso revela se sua raquete está te ajudando ou atrapalhando. Se a bola sempre sai, você pode precisar de mais controle (padrão mais fechado ou tensão mais alta). Se cai curta demais, precisa de mais potência ou spin para levar a bola mais fundo — e a raquete pode ajudar nisso.",
    options: [
      { value: "sai_muito", label: "Saem muito — erro pra fora com frequência" },
      { value: "curta", label: "Caem curtas — o adversário ataca facilmente" },
      { value: "consistente", label: "Tenho boa consistência no fundo" },
    ],
  },
  {
    id: "padrao_encordoamento",
    text: "Você sabe o que é o padrão de encordoamento (16x19, 18x20)?",
    context:
      "O padrão de encordoamento define quantas cordas principais (verticais) x cruzadas (horizontais) a raquete tem. 16x19 = espaços maiores = mais spin e potência automática, mais amigável ao braço. 18x20 = cordas mais juntas = mais controle e precisão, mas você precisa gerar toda a velocidade sozinho.",
    options: [
      { value: "desconhece", label: "Nunca ouvi falar nisso" },
      { value: "vago", label: "Já ouvi, mas não entendo bem" },
      { value: "conhece", label: "Conheço e uso isso como critério" },
    ],
  },
  {
    id: "estilo",
    text: "Qual melhor descreve como você joga hoje?",
    context:
      "Seu estilo atual define o tipo de raquete que vai amplificar seus pontos fortes. Mesmo que você ainda esteja desenvolvendo, já é possível identificar tendências.",
    options: [
      { value: "fundo", label: "Fico no fundo e troco muitas bolas" },
      { value: "rede", label: "Gosto de subir à rede e finalizar" },
      { value: "misto", label: "Misto — depende do ponto" },
    ],
  },
];

// ─── INTERMEDIÁRIO (6 perguntas) ────────────────────────────

const INTERMEDIATE_QUESTIONS: QuizQuestion[] = [
  {
    id: "estilo",
    text: "Qual é o seu estilo de jogo predominante?",
    context:
      "O estilo define quase tudo. Baseliners com topspin pesado se beneficiam de raquetes com cabeça de 97–100 in², padrão 16x19 e swingweight médio-alto. Jogadores de rede precisam de frames mais leves, head-light e mais manobrabilidade.",
    options: [
      { value: "baseliner_spin", label: "Baseliner com muito topspin" },
      { value: "baseliner_flat", label: "Baseliner flat — bato limpo e direto" },
      { value: "counter", label: "Contra-puncher — devolvo tudo e espero o erro" },
      { value: "rede", label: "Serve & Volley / Rede" },
      { value: "allcourt", label: "All-court — mudo conforme o ponto" },
    ],
  },
  {
    id: "lesao",
    text: "Você tem histórico de lesão ou desconforto no braço?",
    context:
      "Para intermediários, esse é o momento mais crítico para lesões — o volume de jogo aumenta significativamente mas a técnica ainda não é perfeita. Frames RA abaixo de 65, padrão aberto 16x19 e cordas multifilamento são uma combinação muito mais segura para o cotovelo.",
    options: [
      { value: "sem", label: "Nenhuma dor ou histórico" },
      { value: "cotovelo", label: "Cotovelo do tenista leve ou histórico" },
      { value: "ombro", label: "Dor no ombro ou manguito rotador" },
      { value: "punho", label: "Punho ou dedo — lesão recente" },
    ],
  },
  {
    id: "padrao_enc",
    text: "Qual padrão de encordoamento você prefere ou quer experimentar?",
    context:
      "16x19 (aberto): as cordas se movem, 'mordem' a bola e criam mais spin e potência. 18x20 (fechado): mais cordas, menos movimento, trajetória plana e precisa. 16x20 (híbrido): mais controle que 16x19, mais spin que 18x20 — crescendo em popularidade (Alcaraz usa).",
    options: [
      { value: "16x19", label: "16x19 — quero maximizar spin e potência" },
      { value: "18x20", label: "18x20 — quero controle e jogo plano" },
      { value: "16x20", label: "16x20 — quero equilíbrio entre os dois" },
      { value: "nao_sei", label: "Não sei ainda — me orienta" },
    ],
  },
  {
    id: "peso",
    text: "Qual é a sua relação com o peso da raquete?",
    context:
      "Raquetes mais pesadas (300–320g) oferecem mais estabilidade no impacto e mais potência em trocas difíceis. Raquetes mais leves (270–290g) são mais fáceis de acelerar — essenciais para jogadores de rede ou com swing mais curto. O swingweight (sensação ao balançar) é tão importante quanto o peso estático.",
    options: [
      { value: "leve", label: "Prefiro leveza — fácil de balançar rápido" },
      { value: "pesado", label: "Prefiro peso — quero estabilidade e penetração" },
      { value: "neutro", label: "Neutro — depende da sensação na mão" },
    ],
  },
  {
    id: "problema_atual",
    text: "Qual é o maior problema no seu jogo hoje que você quer resolver com a raquete?",
    context:
      "A raquete certa não resolve problemas técnicos, mas pode compensar limitações e ampliar pontos fortes. Saber o que falta guia a escolha de especificações de forma muito mais precisa do que qualquer outra pergunta.",
    options: [
      { value: "curta", label: "Minha bola cai curta — quero mais fundo e penetração" },
      { value: "erro", label: "Erro muito — quero mais controle e consistência" },
      { value: "sem_spin", label: "Não consigo gerar spin — bola sempre sai reta" },
      { value: "vibracao", label: "Sinto vibração / desconforto no braço" },
      { value: "feeling", label: "Minha raquete não tem feeling — não sinto a bola" },
    ],
  },
  {
    id: "rigidez",
    text: "Você prefere frame mais rígido ou mais flexível?",
    context:
      "RA é a escala de rigidez. RA acima de 68: mais potência, mais transmissão de choque — Babolat Pure Drive/Aero ficam nessa faixa. RA 63–67: equilíbrio popular, Head Radical/Speed e Yonex Ezone ficam aqui. RA abaixo de 62: muito flexível, muito feeling — Wilson Clash (RA 55) é a referência.",
    options: [
      { value: "rigido", label: "Mais rígido — quero potência e resposta rápida" },
      { value: "flexivel", label: "Mais flexível — quero conforto e feeling" },
      { value: "neutro", label: "Não tenho preferência definida" },
    ],
  },
];

// ─── AVANÇADO (6 perguntas) ─────────────────────────────────

const ADVANCED_QUESTIONS: QuizQuestion[] = [
  {
    id: "necessidade",
    text: "O que te faz querer mudar de raquete agora?",
    context:
      "Jogadores avançados raramente mudam por modismo. Geralmente é porque o jogo evoluiu e a raquete não acompanhou, ou porque surgiu uma necessidade física. Identificar a necessidade real é o passo mais importante — ele filtra todas as escolhas seguintes.",
    options: [
      { value: "controle", label: "Evolui e preciso de mais controle/precisão" },
      { value: "spin", label: "Quero mais spin — jogo ficou mais ofensivo" },
      { value: "lesao", label: "Dor no braço — preciso de algo mais amigável" },
      { value: "potencia", label: "Jogo ficou mais potente e quero uma raquete que aguente" },
      { value: "exploracao", label: "Curiosidade — quero explorar specs diferentes" },
    ],
  },
  {
    id: "estilo_avancado",
    text: "Qual descreve melhor seu jogo atual?",
    context:
      "No nível avançado, a distinção entre estilos é muito mais técnica. Baseliners com topspin pesado costumam preferir frames leves de 295–315g com swingweight alto (325+). Flat hitters precisam de raquetes estáveis e pesadas para manter a trajetória limpa.",
    options: [
      { value: "heavy_baseliner", label: "Baseliner pesado — topspin e profundidade constantes" },
      { value: "flat", label: "Flat hitter — velocidade e trajetória plana" },
      { value: "counter", label: "Counter-puncher — uso o ritmo do adversário" },
      { value: "allcourt", label: "All-court completo — sirvo bem, sou versátil" },
      { value: "rede", label: "Net rusher / doubles specialist" },
    ],
  },
  {
    id: "padrao_enc_avancado",
    text: "Qual padrão de encordoamento você usa e está considerando?",
    context:
      "No nível avançado, a diferença entre 16x19 e 18x20 é imediatamente perceptível. Djokovic usa 18x19 no Head Speed Pro — jogo de redirecionamento preciso. Nadal usava 16x19 — topspin pesado. Alcaraz usa 16x20 no Pure Aero VS — híbrido. Cada transição tem implicações no jogo.",
    options: [
      { value: "16x19", label: "Uso 16x19 e quero continuar nessa linha" },
      { value: "18x20_para_aberto", label: "Uso 18x20 e quero mais spin (abrir padrão)" },
      { value: "16x19_para_fechado", label: "Uso 16x19 e quero mais controle (fechar padrão)" },
      { value: "16x20", label: "Quero explorar o 16x20 como meio-termo" },
    ],
  },
  {
    id: "swingweight",
    text: "Como você descreve o seu swing?",
    context:
      "Swingweight é a sensação de peso ao balançar — não o peso estático. Swingweight acima de 325: muito estável, ótimo para redirecionar bolas pesadas, mas exige condicionamento físico. 310–325: equilíbrio clássico. Abaixo de 305: muito fácil de acelerar, ótimo para spin pesado com técnica vertical.",
    options: [
      { value: "longo", label: "Swing longo e pesado — bato com muita rotação" },
      { value: "compacto", label: "Swing compacto e explosivo — prefiro velocidade de cabeça" },
      { value: "equilibrado", label: "Swing equilibrado — adapto conforme a situação" },
    ],
  },
  {
    id: "lesao_avancado",
    text: "Você tem alguma condição física que afeta seu jogo?",
    context:
      "Jogadores avançados frequentemente ignoram sinais do corpo. RA acima de 68 + polyester cheio + tensão alta pode estar silenciosamente destruindo os tendões, mesmo sem dor imediata. A combinação mais agressiva para o cotovelo no nível avançado: raquete rígida + poly cheio + swing pesado.",
    options: [
      { value: "sem", label: "Nenhuma — estou 100% saudável" },
      { value: "cotovelo", label: "Tendinite ou histórico de cotovelo" },
      { value: "ombro", label: "Ombro — manguito rotador ou impingement" },
      { value: "costas", label: "Costas ou joelhos — preciso de raquete leve" },
    ],
  },
  {
    id: "corda_atual",
    text: "Que tipo de corda você usa atualmente e em qual tensão?",
    context:
      "Para avançados: polyester cheio em tensão baixa (44–50 lbs) é o setup moderno mais popular — gera muito spin e dura mais. Mas é o mais agressivo para o cotovelo a longo prazo. Hybrid (poly nas mains + multi nas crosses) equilibra spin e conforto. Gut natural continua sendo a melhor para o braço mas tem custo alto.",
    options: [
      { value: "poly", label: "Polyester cheio (Luxilon, Solinco, etc.)" },
      { value: "hybrid", label: "Hybrid — poly nas mains + multi nas crosses" },
      { value: "multi_gut", label: "Multifilamento ou gut natural" },
      { value: "nao_sei", label: "Não tenho controle do que colocam" },
    ],
  },
];

export function getQuizFlow(level: PlayerLevel): QuizQuestion[] {
  switch (level) {
    case "iniciante":
      return [LEVEL_QUESTION, ...BEGINNER_QUESTIONS];
    case "basico-intermediario":
      return [LEVEL_QUESTION, ...BASIC_INTERMEDIATE_QUESTIONS];
    case "intermediario":
      return [LEVEL_QUESTION, ...INTERMEDIATE_QUESTIONS];
    case "avancado":
      return [LEVEL_QUESTION, ...ADVANCED_QUESTIONS];
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/quiz-config.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/quiz-config.ts src/lib/__tests__/quiz-config.test.ts
git commit -m "feat: rewrite quiz-config with 4 levels and educational context"
```

---

### Task 3: Update Engine — Profile Defaults and Scoring

**Files:**
- Modify: `src/lib/engine.ts`
- Rewrite: `src/lib/__tests__/engine.test.ts`

- [ ] **Step 1: Write failing tests for updated engine**

Replace the full content of `src/lib/__tests__/engine.test.ts`:

```typescript
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

// --- buildIdealProfile ---

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
    // Injury should cap RA regardless of rigidez preference
    expect(profile.ra.max).toBeLessThanOrEqual(65);
  });
});

// --- scoreRacket ---

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

// --- generateSpecProfile ---

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

// --- generateEducationBlocks ---

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
    // May still have educational blocks (e.g., string pattern education), but no problem-specific ones
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

// --- generateInjuryAlert ---

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
    // Should mention switching from poly
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

// --- recommend ---

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/engine.test.ts`
Expected: FAIL — generateSpecProfile, generateEducationBlocks, generateInjuryAlert don't exist yet, buildIdealProfile doesn't have basico-intermediario, etc.

- [ ] **Step 3: Rewrite engine.ts**

Replace the full content of `src/lib/engine.ts`:

```typescript
import type {
  Racket,
  QuizAnswers,
  IdealProfile,
  ScoredRacket,
  SpecRange,
  SpecRecommendation,
  EducationBlock,
  InjuryAlert,
} from "./types";

// ─── Profile defaults per level ─────────────────────────────

const BEGINNER_DEFAULTS: IdealProfile = {
  weight: { min: 265, max: 285, importance: 0.2 },
  head_size: { min: 105, max: 115, importance: 0.25 },
  ra: { min: 55, max: 67, importance: 0.25 },
  balance_mm: { min: 325, max: 365, importance: 0.1 },
  swingweight: { min: 280, max: 310, importance: 0.1 },
  preferred_patterns: ["16x19"],
  pattern_importance: 0.1,
};

const BASIC_INTERMEDIATE_DEFAULTS: IdealProfile = {
  weight: { min: 270, max: 295, importance: 0.2 },
  head_size: { min: 100, max: 110, importance: 0.2 },
  ra: { min: 60, max: 67, importance: 0.25 },
  balance_mm: { min: 320, max: 345, importance: 0.1 },
  swingweight: { min: 305, max: 320, importance: 0.1 },
  preferred_patterns: ["16x19"],
  pattern_importance: 0.15,
};

const INTERMEDIATE_DEFAULTS: IdealProfile = {
  weight: { min: 285, max: 315, importance: 0.2 },
  head_size: { min: 97, max: 104, importance: 0.2 },
  ra: { min: 60, max: 70, importance: 0.2 },
  balance_mm: { min: 310, max: 340, importance: 0.1 },
  swingweight: { min: 312, max: 330, importance: 0.1 },
  preferred_patterns: ["16x19"],
  pattern_importance: 0.2,
};

const ADVANCED_DEFAULTS: IdealProfile = {
  weight: { min: 295, max: 320, importance: 0.2 },
  head_size: { min: 95, max: 100, importance: 0.2 },
  ra: { min: 60, max: 72, importance: 0.15 },
  balance_mm: { min: 305, max: 335, importance: 0.1 },
  swingweight: { min: 315, max: 340, importance: 0.15 },
  preferred_patterns: ["16x19"],
  pattern_importance: 0.2,
};

function cloneProfile(p: IdealProfile): IdealProfile {
  return {
    weight: { ...p.weight },
    head_size: { ...p.head_size },
    ra: { ...p.ra },
    balance_mm: { ...p.balance_mm },
    swingweight: { ...p.swingweight },
    preferred_patterns: [...p.preferred_patterns],
    pattern_importance: p.pattern_importance,
  };
}

// ─── Build ideal profile ────────────────────────────────────

export function buildIdealProfile(answers: QuizAnswers): IdealProfile {
  let base: IdealProfile;

  switch (answers.level) {
    case "iniciante":
      base = cloneProfile(BEGINNER_DEFAULTS);
      break;
    case "basico-intermediario":
      base = cloneProfile(BASIC_INTERMEDIATE_DEFAULTS);
      break;
    case "intermediario":
      base = cloneProfile(INTERMEDIATE_DEFAULTS);
      break;
    case "avancado":
      base = cloneProfile(ADVANCED_DEFAULTS);
      break;
  }

  // --- Iniciante adjustments ---
  if (answers.fisico === "fraco") {
    base.weight.min = 250;
    base.weight.max = 270;
  } else if (answers.fisico === "atletico") {
    base.weight.min = 275;
    base.weight.max = 295;
  }

  if (answers.objetivo === "aprender") {
    base.head_size.min = Math.max(base.head_size.min, 108);
  } else if (answers.objetivo === "evolucao") {
    base.head_size.min = Math.min(base.head_size.min, 103);
    base.head_size.max = Math.min(base.head_size.max, 108);
  }

  if (answers.estilo_basico === "fundo") {
    base.balance_mm.min = Math.max(base.balance_mm.min, 330);
  } else if (answers.estilo_basico === "rede") {
    base.balance_mm.max = Math.min(base.balance_mm.max, 324);
  }

  // --- Basico-Intermediario adjustments ---
  if (answers.tempo === "menos6") {
    base.head_size.min = Math.max(base.head_size.min, 105);
    base.weight.max = Math.min(base.weight.max, 280);
  } else if (answers.tempo === "1a2") {
    base.head_size.max = Math.min(base.head_size.max, 105);
    base.weight.min = Math.max(base.weight.min, 285);
  }

  if (answers.padrao === "sai_muito") {
    base.head_size.max = Math.min(base.head_size.max, 104);
  } else if (answers.padrao === "curta") {
    base.head_size.min = Math.max(base.head_size.min, 102);
  }

  if (answers.estilo === "fundo" || answers.estilo === "misto") {
    base.balance_mm.min = Math.max(base.balance_mm.min, 325);
  } else if (answers.estilo === "rede") {
    base.balance_mm.max = Math.min(base.balance_mm.max, 324);
    base.weight.max = Math.min(base.weight.max, 305);
  }

  // --- Intermediario adjustments ---
  if (answers.estilo === "baseliner_spin") {
    base.head_size.min = 97;
    base.head_size.max = 100;
    base.preferred_patterns = ["16x19"];
    base.weight.min = 295;
    base.weight.max = 315;
  } else if (answers.estilo === "baseliner_flat") {
    base.head_size.min = 95;
    base.head_size.max = 100;
    base.preferred_patterns = ["18x20"];
    base.weight.min = 300;
    base.weight.max = 320;
  } else if (answers.estilo === "counter") {
    base.head_size.min = 100;
    base.head_size.max = 104;
    base.preferred_patterns = ["16x19", "18x20"];
    base.weight.min = 295;
    base.weight.max = 310;
  } else if (answers.estilo === "allcourt") {
    base.head_size.min = 100;
    base.head_size.max = 104;
    base.preferred_patterns = ["16x19"];
    base.weight.min = 298;
    base.weight.max = 312;
  }

  // Intermediario pattern preference override
  if (answers.padrao_enc === "16x19") {
    base.preferred_patterns = ["16x19"];
  } else if (answers.padrao_enc === "18x20") {
    base.preferred_patterns = ["18x20"];
  } else if (answers.padrao_enc === "16x20") {
    base.preferred_patterns = ["16x20"];
  }

  // Intermediario weight preference
  if (answers.peso === "leve") {
    base.weight.min = 285;
    base.weight.max = 300;
    base.swingweight.min = 305;
    base.swingweight.max = 318;
  } else if (answers.peso === "pesado") {
    base.weight.min = 305;
    base.weight.max = 320;
    base.swingweight.min = 320;
    base.swingweight.max = 335;
  }

  // Intermediario problem adjustments
  if (answers.problema_atual === "curta") {
    base.swingweight.min = Math.max(base.swingweight.min, 320);
  } else if (answers.problema_atual === "erro") {
    base.preferred_patterns = ["18x20"];
  } else if (answers.problema_atual === "sem_spin") {
    base.preferred_patterns = ["16x19"];
    base.head_size.min = 97;
    base.head_size.max = 100;
  } else if (answers.problema_atual === "vibracao") {
    base.ra.max = Math.min(base.ra.max, 65);
  } else if (answers.problema_atual === "feeling") {
    base.ra.max = Math.min(base.ra.max, 65);
  }

  // Intermediario rigidez preference
  if (answers.rigidez === "rigido") {
    base.ra.min = Math.max(base.ra.min, 67);
    base.ra.max = 72;
  } else if (answers.rigidez === "flexivel") {
    base.ra.max = Math.min(base.ra.max, 65);
  }

  // --- Avancado adjustments ---
  if (answers.estilo_avancado === "heavy_baseliner") {
    base.head_size.min = 97;
    base.head_size.max = 100;
    base.preferred_patterns = ["16x19"];
    base.weight.min = 300;
    base.weight.max = 315;
    base.swingweight.min = 325;
    base.swingweight.max = 340;
  } else if (answers.estilo_avancado === "flat") {
    base.head_size.min = 95;
    base.head_size.max = 100;
    base.preferred_patterns = ["18x20"];
    base.weight.min = 305;
    base.weight.max = 320;
    base.ra.min = 65;
    base.ra.max = 70;
  } else if (answers.estilo_avancado === "counter") {
    base.head_size.min = 98;
    base.head_size.max = 102;
    base.weight.min = 300;
    base.weight.max = 315;
    base.ra.min = 63;
    base.ra.max = 67;
  } else if (answers.estilo_avancado === "allcourt") {
    base.head_size.min = 98;
    base.head_size.max = 100;
    base.preferred_patterns = ["16x19"];
    base.weight.min = 300;
    base.weight.max = 315;
  } else if (answers.estilo_avancado === "rede") {
    base.head_size.min = 98;
    base.head_size.max = 102;
    base.weight.min = 285;
    base.weight.max = 305;
    base.swingweight.min = 305;
    base.swingweight.max = 318;
  }

  // Avancado pattern preferences
  if (answers.padrao_enc_avancado === "16x19") {
    base.preferred_patterns = ["16x19"];
  } else if (answers.padrao_enc_avancado === "18x20_para_aberto") {
    base.preferred_patterns = ["16x20", "16x19"];
  } else if (answers.padrao_enc_avancado === "16x19_para_fechado") {
    base.preferred_patterns = ["16x20", "18x20"];
  } else if (answers.padrao_enc_avancado === "16x20") {
    base.preferred_patterns = ["16x20"];
  }

  // Avancado swingweight
  if (answers.swingweight === "longo") {
    base.swingweight.min = Math.max(base.swingweight.min, 325);
    base.swingweight.max = 340;
  } else if (answers.swingweight === "compacto") {
    base.swingweight.min = 305;
    base.swingweight.max = Math.min(base.swingweight.max, 320);
    base.weight.max = Math.min(base.weight.max, 305);
  }

  // Avancado necessidade
  if (answers.necessidade === "controle") {
    base.preferred_patterns = base.preferred_patterns.includes("18x20")
      ? base.preferred_patterns
      : [...base.preferred_patterns, "18x20"];
  } else if (answers.necessidade === "lesao") {
    base.ra.max = Math.min(base.ra.max, 65);
  }

  // --- Injury adjustments (applied last to override preferences) ---
  const injuryField = answers.lesao ?? answers.lesao_avancado;

  if (injuryField === "cotovelo_forte" || injuryField === "forte") {
    base.ra.max = Math.min(base.ra.max, 63);
    base.ra.importance = Math.min(base.ra.importance + 0.15, 0.5);
    base.head_size.min = Math.max(base.head_size.min, 105);
  } else if (injuryField === "cotovelo_leve" || injuryField === "leve" || injuryField === "cotovelo") {
    base.ra.max = Math.min(base.ra.max, 65);
    base.ra.importance = Math.min(base.ra.importance + 0.1, 0.5);
    base.preferred_patterns = ["16x19"];
  } else if (injuryField === "ombro") {
    base.ra.max = Math.min(base.ra.max, 65);
    base.weight.max = Math.min(base.weight.max, 280);
    base.balance_mm.max = Math.min(base.balance_mm.max, 324);
  } else if (injuryField === "punho") {
    base.swingweight.max = Math.min(base.swingweight.max, 315);
    base.ra.max = Math.min(base.ra.max, 65);
  } else if (injuryField === "costas") {
    base.weight.max = Math.min(base.weight.max, 305);
    base.swingweight.max = Math.min(base.swingweight.max, 320);
  }

  return base;
}

// ─── Scoring ────────────────────────────────────────────────

function scoreSpec(value: number | null, range: SpecRange): number {
  if (value === null) return 50;
  const { min, max } = range;
  if (value >= min && value <= max) return 100;
  const span = max - min || 1;
  const distance = value < min ? min - value : value - max;
  const penalty = Math.min((distance / span) * 200, 100);
  return Math.max(0, 100 - penalty);
}

function scorePattern(pattern: string, preferred: string[], importance: number): number {
  if (preferred.length === 0) return 50;
  if (preferred.includes(pattern)) return 100;
  return 0;
}

export function scoreRacket(racket: Racket, profile: IdealProfile): number {
  const specScores: Array<[number, number]> = [
    [scoreSpec(racket.weight, profile.weight), profile.weight.importance],
    [scoreSpec(racket.head_size, profile.head_size), profile.head_size.importance],
    [scoreSpec(racket.ra, profile.ra), profile.ra.importance],
    [scoreSpec(racket.balance_mm, profile.balance_mm), profile.balance_mm.importance],
    [scoreSpec(racket.swingweight, profile.swingweight), profile.swingweight.importance],
    [scorePattern(racket.string_pattern, profile.preferred_patterns, profile.pattern_importance), profile.pattern_importance],
  ];

  const totalImportance = specScores.reduce((sum, [, imp]) => sum + imp, 0);
  const weightedScore = specScores.reduce((acc, [score, imp]) => acc + score * (imp / totalImportance), 0);

  return Math.round(weightedScore * 10) / 10;
}

// ─── Reasons generator ──────────────────────────────────────

function generateReasons(racket: Racket, profile: IdealProfile, answers: QuizAnswers): string[] {
  const reasons: string[] = [];

  if (racket.weight !== null) {
    if (racket.weight >= profile.weight.min && racket.weight <= profile.weight.max) {
      reasons.push(`Peso de ${racket.weight}g é ideal para o seu perfil`);
    } else if (racket.weight < profile.weight.min) {
      reasons.push(`Raquete mais leve (${racket.weight}g) — boa para manobramento`);
    } else {
      reasons.push(`Raquete mais pesada (${racket.weight}g) — oferece mais estabilidade`);
    }
  }

  if (racket.ra <= 63) {
    reasons.push(`RA ${racket.ra} — frame flexível, amortece bem o impacto`);
  } else if (racket.ra >= 68) {
    reasons.push(`RA ${racket.ra} — frame rígido, transmite mais potência`);
  } else {
    reasons.push(`RA ${racket.ra} — rigidez intermediária, equilibra potência e conforto`);
  }

  if (racket.head_size >= 105) {
    reasons.push(`Cabeça de ${racket.head_size} in² oferece área de impacto generosa`);
  } else if (racket.head_size <= 98) {
    reasons.push(`Cabeça de ${racket.head_size} in² favorece precisão e controle`);
  }

  if (profile.preferred_patterns.includes(racket.string_pattern)) {
    reasons.push(`Padrão ${racket.string_pattern} — compatível com seu estilo`);
  }

  if (racket.swingweight !== null) {
    if (racket.swingweight >= profile.swingweight.min && racket.swingweight <= profile.swingweight.max) {
      reasons.push(`Swingweight de ${racket.swingweight} — na faixa ideal para seu swing`);
    }
  }

  if (racket.scores.topspin !== null && racket.scores.topspin >= 85) {
    reasons.push(`Excelente pontuação de topspin (${racket.scores.topspin})`);
  }
  if (racket.scores.comfort !== null && racket.scores.comfort >= 82) {
    reasons.push(`Alta pontuação de conforto (${racket.scores.comfort})`);
  }
  if (racket.scores.maneuverability !== null && racket.scores.maneuverability >= 83) {
    reasons.push(`Boa manobrabilidade (${racket.scores.maneuverability})`);
  }

  if (answers.level && racket.recommended_levels.includes(answers.level)) {
    reasons.push(`Recomendada para jogadores de nível ${answers.level}`);
  }

  if (racket.atp_players.length > 0) {
    reasons.push(`Usada por ${racket.atp_players.slice(0, 2).join(" e ")} no circuito ATP`);
  }

  return reasons;
}

// ─── Spec profile generation ────────────────────────────────

export function generateSpecProfile(answers: QuizAnswers): SpecRecommendation[] {
  const profile = buildIdealProfile(answers);
  const specs: SpecRecommendation[] = [];
  const level = answers.level;

  // Head size
  specs.push({
    spec: "Tamanho da cabeça",
    value: `${profile.head_size.min}–${profile.head_size.max} in²`,
    reason: level === "iniciante"
      ? "Cabeça maior oferece sweet spot generoso, perdoando erros de centro enquanto você desenvolve a técnica."
      : level === "basico-intermediario"
        ? "Área intermediária que equilibra perdão e controle conforme seu jogo se desenvolve."
        : "Área otimizada para seu estilo — prioriza controle e precisão nos golpes.",
  });

  // Weight
  specs.push({
    spec: "Peso",
    value: `${profile.weight.min}–${profile.weight.max}g`,
    reason: profile.weight.max <= 280
      ? "Raquete leve para minimizar fadiga e proteger as articulações."
      : profile.weight.min >= 305
        ? "Peso mais alto para máxima estabilidade e potência nos groundstrokes."
        : "Faixa de peso equilibrada entre manobra e estabilidade.",
  });

  // RA
  specs.push({
    spec: "Rigidez (RA)",
    value: `${profile.ra.min}–${profile.ra.max}`,
    reason: profile.ra.max <= 65
      ? "Frame flexível para absorver choque e proteger o braço. Prioridade máxima dado histórico de desconforto."
      : profile.ra.min >= 67
        ? "Frame mais rígido para resposta direta e potência — requer boa técnica e braço saudável."
        : "Faixa moderada que equilibra conforto e performance.",
  });

  // String pattern
  const patternStr = profile.preferred_patterns.join(" ou ");
  specs.push({
    spec: "Padrão de encordoamento",
    value: patternStr,
    reason: profile.preferred_patterns.includes("16x19")
      ? "Padrão aberto gera mais spin e potência, mais amigável ao braço."
      : profile.preferred_patterns.includes("18x20")
        ? "Padrão fechado oferece controle e trajetória plana — exige swing forte."
        : "Padrão híbrido equilibra spin e controle — boa opção de transição.",
  });

  // String type
  const injuryField = answers.lesao ?? answers.lesao_avancado;
  const hasInjury = injuryField && injuryField !== "sem_lesao" && injuryField !== "sem";
  const isBeginnerish = level === "iniciante" || level === "basico-intermediario";

  let cordaValue: string;
  let cordaReason: string;
  if (isBeginnerish || hasInjury) {
    cordaValue = "Multifilamento";
    cordaReason = hasInjury
      ? "Multifilamento é obrigatório para proteção do braço. NUNCA use polyester cheio com lesão."
      : "Multifilamento oferece conforto e potência sem agredir o braço. Ideal para quem está começando.";
  } else if (answers.corda_atual === "poly" && !hasInjury) {
    cordaValue = "Polyester ou Hybrid";
    cordaReason = "Polyester em tensão baixa (44–50 lbs) para spin. Hybrid é alternativa mais amigável.";
  } else {
    cordaValue = "Multifilamento ou Hybrid";
    cordaReason = "Hybrid (poly + multi) equilibra spin e conforto. Multifilamento se prioriza o braço.";
  }
  specs.push({ spec: "Tipo de corda", value: cordaValue, reason: cordaReason });

  // Tension
  let tensaoValue: string;
  let tensaoReason: string;
  if (hasInjury) {
    tensaoValue = "44–50 lbs";
    tensaoReason = "Tensão baixa reduz o choque transmitido ao braço e aumenta conforto.";
  } else if (isBeginnerish) {
    tensaoValue = "50–54 lbs";
    tensaoReason = "Tensão moderada para equilíbrio entre potência e controle — ponto de partida seguro.";
  } else {
    tensaoValue = "48–55 lbs";
    tensaoReason = "Ajuste conforme preferência: mais baixa = mais potência e spin; mais alta = mais controle.";
  }
  specs.push({ spec: "Tensão", value: tensaoValue, reason: tensaoReason });

  // Balance
  specs.push({
    spec: "Balance",
    value: profile.balance_mm.max <= 324
      ? "Head-light"
      : profile.balance_mm.min >= 330
        ? "Head-heavy a neutro"
        : "Neutro",
    reason: profile.balance_mm.max <= 324
      ? "Head-light facilita a manobra na rede e reduz carga no ombro."
      : profile.balance_mm.min >= 330
        ? "Head-heavy adiciona massa no impacto para mais potência nos groundstrokes."
        : "Balance neutro — versátil para todos os golpes.",
  });

  // Swingweight (intermediario+)
  if (level === "intermediario" || level === "avancado") {
    specs.push({
      spec: "Swingweight",
      value: `${profile.swingweight.min}–${profile.swingweight.max}`,
      reason: profile.swingweight.min >= 325
        ? "Swingweight alto para estabilidade e penetração contra bolas pesadas."
        : profile.swingweight.max <= 318
          ? "Swingweight mais baixo para velocidade de cabeça e aceleração rápida."
          : "Swingweight equilibrado — faixa mais versátil do mercado.",
    });
  }

  return specs;
}

// ─── Education blocks ───────────────────────────────────────

export function generateEducationBlocks(answers: QuizAnswers): EducationBlock[] {
  const blocks: EducationBlock[] = [];

  // String pattern education for basico-intermediario who doesn't know
  if (answers.padrao_encordoamento === "desconhece" || answers.padrao_encordoamento === "vago") {
    blocks.push({
      id: "padrao_explicacao",
      title: "O que é o padrão de encordoamento?",
      content:
        "O padrão (ex: 16x19) indica quantas cordas verticais × horizontais a raquete tem. 16x19 (aberto) = espaços maiores entre as cordas = mais spin e potência 'de graça', mais amigável ao braço. 18x20 (fechado) = cordas mais juntas = trajetória plana e precisa, mas exige que você gere toda a velocidade. Para quem está evoluindo, o 16x19 é quase sempre a melhor escolha.",
    });
  }

  // Swingweight education for intermediario+
  if (answers.level === "intermediario" || answers.level === "avancado") {
    blocks.push({
      id: "swingweight_explicacao",
      title: "Swingweight vs. peso estático",
      content:
        "O peso na ficha técnica (ex: 300g) é o peso estático. O swingweight mede o quanto a raquete 'pesa' ao ser balançada — e depende de onde o peso está distribuído. Duas raquetes de 300g podem ter swingweights muito diferentes. Uma raquete head-light de 300g tem swingweight menor que uma head-heavy de 295g. O swingweight é mais relevante para a sensação real de jogo.",
    });
  }

  // Problem-specific blocks
  if (answers.problema_atual === "curta") {
    blocks.push({
      id: "curta",
      title: "Por que sua bola cai curta?",
      content:
        "Bola caindo curta pode ter 3 causas de equipamento: (1) tensão de corda alta demais — experimente baixar 2–3 lbs. (2) Raquete muito leve e sem plow-through — considere swingweight maior. (3) Padrão 18x20 quando deveria usar 16x19 para ajuda natural na profundidade.",
    });
  }

  if (answers.problema_atual === "sem_spin") {
    blocks.push({
      id: "sem_spin",
      title: "Como gerar mais spin",
      content:
        "Spin vem principalmente do swing path vertical, mas a raquete amplifica ou limita. Padrão 16x19: as cordas mordem a bola e aumentam o spin automaticamente. Polyester em tensão baixa (44–48 lbs) maximiza esse efeito. Cabeça menor (97–100 in²) com beam fino também ajuda. Se estiver usando 18x20 e poly duro, essa é sua resposta.",
    });
  }

  if (answers.problema_atual === "feeling") {
    blocks.push({
      id: "feeling",
      title: "Recuperando o feeling da bola",
      content:
        "Falta de feeling quase sempre vem de: frame muito rígido (RA alto), corda muito dura (polyester em tensão alta) ou raquete muito leve (instabilidade). Experimente: RA abaixo de 65, multi ou hybrid, tensão 50–54 lbs, frame com beam mais fino.",
    });
  }

  // Pattern transition for avancado
  if (
    answers.padrao_enc_avancado === "18x20_para_aberto" ||
    answers.padrao_enc_avancado === "16x19_para_fechado"
  ) {
    blocks.push({
      id: "transicao_padrao",
      title: "O que esperar na transição de padrão",
      content: answers.padrao_enc_avancado === "18x20_para_aberto"
        ? "Jogadores migrando do 18x20 para 16x19 frequentemente relatam: mais bolas saindo pela linha do fundo até adaptar o swing, mais spin 'de graça' mas leve perda de precisão inicial. O 16x20 como etapa intermediária é uma transição mais suave."
        : "Migrando do 16x19 para padrão mais fechado, espere: trajetória mais baixa e plana, menos spin automático (você precisa gerar com técnica), e mais controle após a adaptação. A bola pode cair mais curta até você ajustar a potência do swing.",
    });
  }

  return blocks;
}

// ─── Injury alert ───────────────────────────────────────────

export function generateInjuryAlert(answers: QuizAnswers): InjuryAlert | null {
  const injuryField = answers.lesao ?? answers.lesao_avancado;

  if (!injuryField || injuryField === "sem_lesao" || injuryField === "sem") {
    return null;
  }

  const isUrgent =
    injuryField === "cotovelo_forte" ||
    injuryField === "forte" ||
    (injuryField === "cotovelo" && answers.corda_atual === "poly");

  if (injuryField === "ombro") {
    return {
      severity: "warning",
      title: "Atenção: proteção do ombro",
      recommendations: [
        "Prefira raquetes mais leves (abaixo de 295g) para reduzir esforço no overhead.",
        "Balance head-light reduz a carga no ombro durante o saque.",
        "RA abaixo de 65 para reduzir impacto na articulação.",
        "Multifilamento ou hybrid — nunca polyester cheio em tensão alta.",
      ],
    };
  }

  if (injuryField === "punho") {
    return {
      severity: "warning",
      title: "Atenção: proteção do punho",
      recommendations: [
        "Grip size correto é crítico — faça o teste do dedo indicador.",
        "Swingweight baixo (abaixo de 315) para reduzir esforço de estabilização.",
        "Frame flexível (RA 60–65) reduz vibração transmitida ao punho.",
      ],
    };
  }

  if (injuryField === "costas") {
    return {
      severity: "warning",
      title: "Atenção: proteção das costas e joelhos",
      recommendations: [
        "Peso abaixo de 305g para reduzir carga total.",
        "Swingweight abaixo de 320 para menos esforço nos golpes.",
        "Considere raquete head-light para menor torque no impacto.",
      ],
    };
  }

  // Cotovelo cases
  const recommendations = [
    "Frame com RA abaixo de 65 — Wilson Clash (RA 55) é a referência máxima em conforto.",
    "Troque para hybrid (poly nas mains + multi nas crosses) ou multifilamento puro.",
    "Baixe a tensão para 48–52 lbs.",
    "Padrão 16x19 — absorve mais choque que 18x20.",
    "Confirme o tamanho do grip — grip muito pequeno força aperto excessivo.",
    "Faça UMA mudança por vez para identificar o que funciona.",
  ];

  if (answers.corda_atual === "poly") {
    recommendations.unshift(
      "URGENTE: troque imediatamente o polyester cheio por hybrid ou multifilamento."
    );
  }

  return {
    severity: isUrgent ? "urgent" : "warning",
    title: isUrgent
      ? "Alerta urgente: proteção do cotovelo"
      : "Atenção: proteção do cotovelo",
    recommendations,
  };
}

// ─── Main recommend function ────────────────────────────────

export function recommend(
  data: Racket[],
  answers: QuizAnswers,
  topN: number
): ScoredRacket[] {
  const profile = buildIdealProfile(answers);

  const scored: ScoredRacket[] = data.map((racket) => ({
    racket,
    score: scoreRacket(racket, profile),
    reasons: generateReasons(racket, profile, answers),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/engine.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/engine.ts src/lib/__tests__/engine.test.ts
git commit -m "feat: update engine with 4 levels, swingweight/pattern scoring, spec profile, education blocks, injury alerts"
```

---

### Task 4: Update QuizStep Component

**Files:**
- Modify: `src/components/QuizStep.tsx`

- [ ] **Step 1: Update QuizStep with collapsible context and back button**

Replace the full content of `src/components/QuizStep.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import type { QuizQuestion } from "@/lib/types";

interface QuizStepProps {
  question: QuizQuestion;
  currentStep: number;
  totalSteps: number;
  onAnswer: (questionId: string, value: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export default function QuizStep({
  question,
  currentStep,
  totalSteps,
  onAnswer,
  onBack,
  canGoBack = false,
}: QuizStepProps) {
  const progressPct = Math.round((currentStep / totalSteps) * 100);
  const [contextOpen, setContextOpen] = useState(true);

  // Re-open context when question changes
  useEffect(() => {
    setContextOpen(true);
  }, [question.id]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-gray-500 font-medium">
          <span>Pergunta {currentStep} de {totalSteps}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Back button */}
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      )}

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
        {question.text}
      </h2>

      {/* Educational context */}
      {question.context && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setContextOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <span className="text-base" aria-hidden="true">💡</span>
              Por que isso importa?
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-amber-600 transition-transform duration-200 ${contextOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {contextOpen && (
            <div className="px-4 pb-4">
              <p className="text-sm text-amber-900 leading-relaxed">
                {question.context}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onAnswer(question.id, option.value)}
            className="w-full text-left border border-gray-300 rounded-xl px-5 py-4 text-gray-800 font-medium hover:border-green-500 hover:bg-green-50 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/components/QuizStep.tsx
git commit -m "feat: add collapsible educational context and back button to QuizStep"
```

---

### Task 5: Update Quiz Page

**Files:**
- Modify: `src/app/quiz/page.tsx`

- [ ] **Step 1: Update quiz page to support 4 levels and back navigation**

Replace the full content of `src/app/quiz/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PlayerLevel, QuizAnswers } from "@/lib/types";
import { getQuizFlow } from "@/lib/quiz-config";
import QuizStep from "@/components/QuizStep";

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [level, setLevel] = useState<PlayerLevel | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const flow = getQuizFlow(level ?? "iniciante");
  const currentQuestion = flow[stepIndex];
  const totalSteps = flow.length;

  function handleAnswer(questionId: string, value: string) {
    let updatedAnswers: Partial<QuizAnswers>;

    if (questionId === "level") {
      const lvl = value as PlayerLevel;
      setLevel(lvl);
      updatedAnswers = { ...answers, level: lvl };
    } else {
      updatedAnswers = { ...answers, [questionId]: value };
    }

    setAnswers(updatedAnswers);

    const nextIndex = stepIndex + 1;
    if (nextIndex >= totalSteps) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
      router.push("/resultado");
    } else {
      setStepIndex(nextIndex);
    }
  }

  function handleBack() {
    if (stepIndex <= 0) return;
    const prevIndex = stepIndex - 1;
    const prevQuestion = flow[prevIndex];

    // Remove the answer for the current question
    const updatedAnswers = { ...answers };
    delete (updatedAnswers as Record<string, unknown>)[currentQuestion.id];

    // If going back to level question, reset level
    if (prevQuestion.id === "level") {
      setLevel(null);
    }

    setAnswers(updatedAnswers);
    setStepIndex(prevIndex);
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <QuizStep
          question={currentQuestion}
          currentStep={stepIndex + 1}
          totalSteps={totalSteps}
          onAnswer={handleAnswer}
          onBack={handleBack}
          canGoBack={stepIndex > 0}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the page compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/app/quiz/page.tsx
git commit -m "feat: update quiz page with 4-level support and back navigation"
```

---

### Task 6: Update Resultado Page

**Files:**
- Modify: `src/app/resultado/page.tsx`

- [ ] **Step 1: Update resultado page with spec profile, injury alerts, and education blocks**

Replace the full content of `src/app/resultado/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { QuizAnswers, ScoredRacket, Racket, SpecRecommendation, EducationBlock, InjuryAlert } from "@/lib/types";
import { recommend, generateSpecProfile, generateEducationBlocks, generateInjuryAlert } from "@/lib/engine";
import RacketCard from "@/components/RacketCard";
import ScoresBar from "@/components/ScoresBar";
import racketData from "@/data/rackets.json";

const rackets = racketData as Racket[];

export default function ResultadoPage() {
  const router = useRouter();
  const [top3, setTop3] = useState<ScoredRacket[]>([]);
  const [more, setMore] = useState<ScoredRacket[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [specProfile, setSpecProfile] = useState<SpecRecommendation[]>([]);
  const [eduBlocks, setEduBlocks] = useState<EducationBlock[]>([]);
  const [injuryAlert, setInjuryAlert] = useState<InjuryAlert | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("quizAnswers");
    if (!raw) {
      router.replace("/quiz");
      return;
    }

    let answers: QuizAnswers;
    try {
      answers = JSON.parse(raw) as QuizAnswers;
    } catch {
      router.replace("/quiz");
      return;
    }

    const top = recommend(rackets, answers, 3);
    const rest = recommend(rackets, answers, 10).slice(3);

    setTop3(top);
    setMore(rest);
    setSpecProfile(generateSpecProfile(answers));
    setEduBlocks(generateEducationBlocks(answers));
    setInjuryAlert(generateInjuryAlert(answers));
    setLoaded(true);
  }, [router]);

  function handleAddToCompare(racket: Racket) {
    setCompareList((prev) => {
      const next = prev.includes(racket.slug)
        ? prev
        : [...prev, racket.slug].slice(0, 3);
      sessionStorage.setItem("compareList", JSON.stringify(next));
      return next;
    });
  }

  function goToComparator() {
    router.push(`/comparar?r=${compareList.join(",")}`);
  }

  if (!loaded) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Calculando suas recomendações...</p>
      </div>
    );
  }

  if (top3.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-gray-700 text-lg text-center">
          Nenhuma raquete encontrada para o seu perfil.
        </p>
        <Link
          href="/quiz"
          className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
        >
          Refazer quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Suas recomendações
        </h1>
        <p className="text-gray-500 text-lg">
          Com base nas suas respostas, montamos o perfil ideal de raquete para você.
        </p>
      </div>

      {/* Injury alert */}
      {injuryAlert && (
        <div
          className={`rounded-xl p-5 flex flex-col gap-3 ${
            injuryAlert.severity === "urgent"
              ? "bg-red-50 border-2 border-red-300"
              : "bg-yellow-50 border border-yellow-300"
          }`}
        >
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              injuryAlert.severity === "urgent" ? "text-red-800" : "text-yellow-800"
            }`}
          >
            <span aria-hidden="true">{injuryAlert.severity === "urgent" ? "⚠️" : "⚡"}</span>
            {injuryAlert.title}
          </h2>
          <ul className="flex flex-col gap-1.5">
            {injuryAlert.recommendations.map((rec, i) => (
              <li
                key={i}
                className={`text-sm leading-relaxed ${
                  injuryAlert.severity === "urgent" ? "text-red-700" : "text-yellow-700"
                }`}
              >
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Spec profile */}
      {specProfile.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Perfil de especificações recomendado
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Spec</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Recomendado</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Por quê</th>
                </tr>
              </thead>
              <tbody>
                {specProfile.map((spec) => (
                  <tr key={spec.spec} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {spec.spec}
                    </td>
                    <td className="px-5 py-3 text-green-700 font-semibold whitespace-nowrap">
                      {spec.value}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{spec.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Education blocks */}
      {eduBlocks.length > 0 && (
        <div className="flex flex-col gap-4">
          {eduBlocks.map((block) => (
            <div
              key={block.id}
              className="bg-blue-50 border border-blue-200 rounded-xl p-5"
            >
              <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span aria-hidden="true">📘</span>
                {block.title}
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">{block.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top 3 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Raquetes mais compatíveis
        </h2>
        <div className="flex flex-col gap-8">
          {top3.map((item, i) => (
            <div key={item.racket.slug} className="flex flex-col gap-4">
              {i === 0 && (
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Melhor match
                  </span>
                </div>
              )}

              <RacketCard
                racket={item.racket}
                score={item.score}
                reasons={item.reasons}
                showCompareButton
                onAddToCompare={handleAddToCompare}
              />

              {item.racket.scores.overall !== null && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Pontuações técnicas
                  </h3>
                  <ScoresBar label="Geral" value={item.racket.scores.overall} />
                  <ScoresBar label="Potência" value={item.racket.scores.power} />
                  <ScoresBar label="Controle" value={item.racket.scores.control} />
                  <ScoresBar label="Conforto" value={item.racket.scores.comfort} />
                  <ScoresBar label="Topspin" value={item.racket.scores.topspin} />
                  <ScoresBar label="Manobrabilidade" value={item.racket.scores.maneuverability} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ver mais section */}
      {more.length > 0 && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:border-green-500 hover:text-green-600 transition-colors"
          >
            {showMore ? "Ocultar raquetes extras" : `Ver mais ${more.length} raquetes`}
          </button>

          {showMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {more.map((item) => (
                <RacketCard
                  key={item.racket.slug}
                  racket={item.racket}
                  score={item.score}
                  showCompareButton
                  onAddToCompare={handleAddToCompare}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compare list indicator */}
      {compareList.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-green-800 font-medium text-sm">
            {compareList.length} raquete{compareList.length > 1 ? "s" : ""} adicionada{compareList.length > 1 ? "s" : ""} para comparação
          </p>
          <button
            type="button"
            onClick={goToComparator}
            className="bg-green-600 text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver comparação
          </button>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/quiz"
          className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full hover:border-green-500 hover:text-green-600 transition-colors"
        >
          Refazer quiz
        </Link>
        <Link
          href="/comparar"
          className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
        >
          Ir para comparador
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the page compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/app/resultado/page.tsx
git commit -m "feat: add spec profile, injury alerts, and education blocks to results page"
```

---

### Task 7: Run All Tests and Final Verification

**Files:** All test files

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Run linter**

Run: `npx next lint`
Expected: No errors

- [ ] **Step 4: Run dev server and verify manually**

Run: `npm run dev`
Verify:
1. Navigate to `/quiz` — level question shows 4 options
2. Select "Iniciante" — 5 questions follow, each with collapsible educational context
3. Educational context opens by default, can be collapsed
4. Back button works to go to previous question
5. After last question, redirects to `/resultado`
6. Resultado shows: injury alert (if applicable), spec profile table, education blocks, then top 3 rackets
7. Select "Avançado" — 6 questions follow with advanced terminology
8. Results include swingweight spec and pattern transition education

- [ ] **Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any issues found during manual verification"
```
