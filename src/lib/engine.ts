import type { Racket, QuizAnswers, IdealProfile, ScoredRacket, SpecRange } from "./types";

// --- Profile defaults per level ---

const BEGINNER_DEFAULTS: IdealProfile = {
  weight: { min: 255, max: 285, importance: 0.2 },
  head_size: { min: 100, max: 115, importance: 0.3 },
  ra: { min: 55, max: 66, importance: 0.3 },
  balance_mm: { min: 325, max: 365, importance: 0.2 },
};

const INTERMEDIATE_DEFAULTS: IdealProfile = {
  weight: { min: 280, max: 305, importance: 0.25 },
  head_size: { min: 98, max: 107, importance: 0.25 },
  ra: { min: 58, max: 72, importance: 0.3 },
  balance_mm: { min: 310, max: 345, importance: 0.2 },
};

const ADVANCED_DEFAULTS: IdealProfile = {
  weight: { min: 295, max: 320, importance: 0.3 },
  head_size: { min: 95, max: 103, importance: 0.25 },
  ra: { min: 60, max: 75, importance: 0.25 },
  balance_mm: { min: 305, max: 335, importance: 0.2 },
};

function cloneProfile(profile: IdealProfile): IdealProfile {
  return {
    weight: { ...profile.weight },
    head_size: { ...profile.head_size },
    ra: { ...profile.ra },
    balance_mm: { ...profile.balance_mm },
  };
}

export function buildIdealProfile(answers: QuizAnswers): IdealProfile {
  let base: IdealProfile;

  if (answers.level === "iniciante") {
    base = cloneProfile(BEGINNER_DEFAULTS);
  } else if (answers.level === "intermediario") {
    base = cloneProfile(INTERMEDIATE_DEFAULTS);
  } else {
    base = cloneProfile(ADVANCED_DEFAULTS);
  }

  // Physique adjustments (beginner/intermediate mainly)
  if (answers.physique === "pequeno") {
    base.weight.min -= 15;
    base.weight.max -= 15;
    base.head_size.min = Math.max(base.head_size.min, 102);
  } else if (answers.physique === "grande") {
    base.weight.min += 10;
    base.weight.max += 10;
  }

  // Injury adjustments — lower RA ceiling for arm problems
  if (answers.injury && answers.injury !== "nenhuma") {
    base.ra.max = Math.min(base.ra.max, 63);
    base.ra.importance = Math.min(base.ra.importance + 0.1, 0.5);
  }

  // Improvement goals (intermediate)
  if (answers.improvement === "spin") {
    // More open string pattern preference, lighter for maneuverability
    base.weight.max = Math.min(base.weight.max, 300);
  } else if (answers.improvement === "controle") {
    base.ra.max = Math.min(base.ra.max, 68);
  } else if (answers.improvement === "potencia") {
    base.head_size.min = Math.max(base.head_size.min, 100);
    base.head_size.max = Math.max(base.head_size.max, 107);
  }

  // Tech preferences (advanced)
  if (answers.tech_preferences) {
    const tp = answers.tech_preferences;
    if (tp.weight === "leve") {
      base.weight.max = Math.min(base.weight.max, 300);
      base.weight.min = Math.min(base.weight.min, 285);
    } else if (tp.weight === "pesada") {
      base.weight.min = Math.max(base.weight.min, 300);
    }
    if (tp.balance === "head-light") {
      base.balance_mm.max = Math.min(base.balance_mm.max, 325);
    } else if (tp.balance === "head-heavy") {
      base.balance_mm.min = Math.max(base.balance_mm.min, 330);
    }
    if (tp.stiffness === "flexivel") {
      base.ra.max = Math.min(base.ra.max, 63);
    } else if (tp.stiffness === "rigida") {
      base.ra.min = Math.max(base.ra.min, 65);
    }
  }

  // Change desired (advanced)
  if (answers.change_desired) {
    if (answers.change_desired === "mais-conforto") {
      base.ra.max = Math.min(base.ra.max, 65);
    } else if (answers.change_desired === "mais-leve") {
      base.weight.max = Math.min(base.weight.max, 295);
    } else if (answers.change_desired === "mais-pesada") {
      base.weight.min = Math.max(base.weight.min, 305);
    }
  }

  return base;
}

// --- Scoring ---

/**
 * Returns 100 if value is within [min, max].
 * Penalizes proportionally to distance outside range.
 * Returns 50 if value is null (neutral score for unknown specs).
 */
function scoreSpec(value: number | null, range: SpecRange): number {
  if (value === null) return 50;
  const { min, max } = range;
  if (value >= min && value <= max) return 100;
  const span = max - min || 1;
  const distance = value < min ? min - value : value - max;
  // Use a steeper penalty: 2x multiplier so moderate deviations score below 50
  const penalty = Math.min((distance / span) * 200, 100);
  return Math.max(0, 100 - penalty);
}

export function scoreRacket(racket: Racket, profile: IdealProfile): number {
  const specs: Array<[number | null, SpecRange]> = [
    [racket.weight, profile.weight],
    [racket.head_size, profile.head_size],
    [racket.ra, profile.ra],
    [racket.balance_mm, profile.balance_mm],
  ];

  // Normalize importances
  const totalImportance = Object.values(profile).reduce(
    (sum, r) => sum + (r as SpecRange).importance,
    0
  );

  const weightedScore = specs.reduce((acc, [value, range]) => {
    const s = scoreSpec(value, range);
    return acc + s * (range.importance / totalImportance);
  }, 0);

  return Math.round(weightedScore * 10) / 10;
}

// --- Reasons generator ---

function generateReasons(racket: Racket, profile: IdealProfile, answers: QuizAnswers): string[] {
  const reasons: string[] = [];

  // Weight
  if (racket.weight !== null) {
    if (racket.weight >= profile.weight.min && racket.weight <= profile.weight.max) {
      reasons.push(`Peso de ${racket.weight}g é ideal para o seu perfil`);
    } else if (racket.weight < profile.weight.min) {
      reasons.push(`Raquete mais leve (${racket.weight}g) — boa para manobramento`);
    } else {
      reasons.push(`Raquete mais pesada (${racket.weight}g) — oferece mais estabilidade`);
    }
  }

  // RA / stiffness
  if (racket.ra <= 63) {
    reasons.push(`RA ${racket.ra} — frame flexível, amortece bem o impacto`);
  } else if (racket.ra >= 68) {
    reasons.push(`RA ${racket.ra} — frame rígido, transmite mais potência`);
  } else {
    reasons.push(`RA ${racket.ra} — rigidez intermediária, equilibra potência e conforto`);
  }

  // Head size
  if (racket.head_size >= 105) {
    reasons.push(`Cabeça de ${racket.head_size}cm² oferece área de impacto generosa`);
  } else if (racket.head_size <= 98) {
    reasons.push(`Cabeça de ${racket.head_size}cm² favorece precisão e controle`);
  }

  // TWU scores
  if (racket.scores.topspin !== null && racket.scores.topspin >= 85) {
    reasons.push(`Excelente pontuação de topspin (${racket.scores.topspin}) — ótima para spin`);
  }
  if (racket.scores.comfort !== null && racket.scores.comfort >= 82) {
    reasons.push(`Alta pontuação de conforto (${racket.scores.comfort})`);
  }
  if (racket.scores.maneuverability !== null && racket.scores.maneuverability >= 83) {
    reasons.push(`Boa manobrabilidade (${racket.scores.maneuverability})`);
  }

  // Recommended levels
  if (answers.level && racket.recommended_levels.includes(answers.level)) {
    reasons.push(`Recomendada para jogadores de nível ${answers.level}`);
  }

  // Notable players
  if (racket.atp_players.length > 0) {
    reasons.push(`Usada por ${racket.atp_players.slice(0, 2).join(" e ")} no circuito ATP`);
  }

  return reasons;
}

// --- Main recommend function ---

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
