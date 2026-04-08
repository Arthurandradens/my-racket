import type { QuizAnswers } from "./types";

interface PlayerProfile {
  title: string;
  description: string;
  tags: string[];
}

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  "basico-intermediario": "Básico-Intermediário",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  iniciante: "jogador iniciante",
  "basico-intermediario": "jogador em desenvolvimento",
  intermediario: "jogador de nível intermediário",
  avancado: "jogador experiente",
};

const ESTILO_LABELS: Record<string, string> = {
  fundo: "Fundo de Quadra",
  rede: "Saque e Voleio",
  misto: "All-Court",
  baseliner_spin: "Baseliner Spin",
  baseliner_flat: "Baseliner Flat",
  counter: "Counter-Puncher",
  allcourt: "All-Court",
  heavy_baseliner: "Heavy Baseliner",
  flat: "Flat Hitter",
};

export function generateProfile(answers: QuizAnswers): PlayerProfile {
  const tags: string[] = [];
  const fragments: string[] = [];

  // Level
  tags.push(LEVEL_LABELS[answers.level] ?? "Jogador");
  fragments.push(LEVEL_DESCRIPTIONS[answers.level] ?? "jogador");

  // Style (various fields depending on level)
  const estilo = answers.estilo_avancado ?? answers.estilo ?? answers.estilo_basico;
  if (estilo) {
    const label = ESTILO_LABELS[estilo];
    if (label) {
      tags.push(label);
      fragments.push(`com estilo ${label.toLowerCase()}`);
    }
  }

  // Injury tag
  const injuryField = answers.lesao ?? answers.lesao_avancado;
  if (injuryField && injuryField !== "sem_lesao" && injuryField !== "sem") {
    tags.push("Proteção de lesão");
  }

  // Build title
  const styleTag = tags[1];
  const title = styleTag
    ? `Perfil: Jogador ${styleTag}`
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
