import type { QuizAnswers } from "./types";

interface PlayerProfile {
  title: string;
  description: string;
  tags: string[];
}

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediario",
  avancado: "Avancado",
};

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  iniciante: "jogador iniciante",
  intermediario: "jogador de nivel intermediario",
  avancado: "jogador experiente",
};

const STYLE_LABELS: Record<string, string> = {
  baseline: "Fundo de Quadra",
  "serve-and-volley": "Saque e Voleio",
  "all-court": "All-Court",
};

const STYLE_DESCRIPTIONS: Record<string, string> = {
  baseline: "estilo de jogo de fundo de quadra",
  "serve-and-volley": "jogo agressivo de saque e voleio",
  "all-court": "jogo versatil all-court",
};

const IMPROVEMENT_DESCRIPTIONS: Record<string, string> = {
  potencia: "foco em ganhar mais potencia",
  controle: "busca por maior precisao e controle",
  spin: "foco em maximizar o efeito nas bolas",
};

const PHYSIQUE_DESCRIPTIONS: Record<string, string> = {
  pequeno: "porte fisico leve",
  medio: "porte fisico medio",
  grande: "porte fisico forte",
};

const MAIN_SHOT_DESCRIPTIONS: Record<string, string> = {
  forehand: "forehand como golpe principal",
  backhand: "backhand como ponto forte",
  saque: "saque como arma principal",
};

const CHANGE_DESCRIPTIONS: Record<string, string> = {
  "mais-potencia": "buscando mais potencia",
  "mais-controle": "buscando mais controle",
  "mais-spin": "buscando mais spin",
  "mais-conforto": "priorizando conforto e menos vibracao",
  "mais-leve": "procurando algo mais leve",
  "mais-pesada": "procurando algo mais pesado",
};

const BUDGET_DESCRIPTIONS: Record<string, string> = {
  baixo: "buscando melhor custo-beneficio",
  medio: "com orcamento intermediario",
  alto: "sem restricao de orcamento",
};

const INJURY_TAGS: Record<string, string> = {
  cotovelo: "Protecao Cotovelo",
  ombro: "Protecao Ombro",
  punho: "Protecao Punho",
};

export function generateProfile(answers: QuizAnswers): PlayerProfile {
  const tags: string[] = [];
  const fragments: string[] = [];

  // Level
  tags.push(LEVEL_LABELS[answers.level] ?? "Jogador");
  fragments.push(LEVEL_DESCRIPTIONS[answers.level] ?? "jogador");

  // Play style
  if (answers.play_style) {
    tags.push(STYLE_LABELS[answers.play_style] ?? "");
    fragments.push(`com ${STYLE_DESCRIPTIONS[answers.play_style]}`);
  }

  // Main shot (advanced)
  if (answers.main_shot) {
    tags.push(MAIN_SHOT_DESCRIPTIONS[answers.main_shot] ? answers.main_shot.charAt(0).toUpperCase() + answers.main_shot.slice(1) : "");
    fragments.push(`${MAIN_SHOT_DESCRIPTIONS[answers.main_shot]}`);
  }

  // Improvement (intermediate)
  if (answers.improvement) {
    fragments.push(`${IMPROVEMENT_DESCRIPTIONS[answers.improvement]}`);
  }

  // Change desired (advanced)
  if (answers.change_desired) {
    fragments.push(CHANGE_DESCRIPTIONS[answers.change_desired] ?? "");
  }

  // Physique (beginner)
  if (answers.physique) {
    fragments.push(PHYSIQUE_DESCRIPTIONS[answers.physique] ?? "");
  }

  // Injury
  if (answers.injury && answers.injury !== "nenhuma") {
    tags.push(INJURY_TAGS[answers.injury] ?? "");
  }

  // Budget
  if (answers.budget) {
    tags.push(answers.budget === "baixo" ? "Custo-beneficio" : answers.budget === "alto" ? "Premium" : "");
    fragments.push(BUDGET_DESCRIPTIONS[answers.budget] ?? "");
  }

  // Build title
  const styleLabel = answers.play_style ? STYLE_LABELS[answers.play_style] : "";
  const title = styleLabel
    ? `Perfil: Jogador ${styleLabel}`
    : `Perfil: ${LEVEL_LABELS[answers.level]}`;

  // Build description
  const validFragments = fragments.filter(Boolean);
  const description =
    `Baseado no seu perfil de ${validFragments.slice(0, 3).join(", ")}, ` +
    `identificamos as raquetes com maior compatibilidade para o seu jogo` +
    (validFragments.length > 3 ? ` — ${validFragments.slice(3).join(", ")}` : "") +
    ".";

  return {
    title,
    description,
    tags: tags.filter(Boolean),
  };
}
