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
import { hasProspinLink } from "./affiliate";

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
    default:
      base = cloneProfile(BEGINNER_DEFAULTS);
      break;
  }

  // Iniciante adjustments
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

  // Basico-Intermediario adjustments
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

  // Intermediario style adjustments
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

  // Avancado style adjustments
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

  // Injury adjustments (applied LAST to override preferences)
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

function scoreSpec(value: number | null, range: SpecRange): number {
  if (value === null) return 50;
  const { min, max } = range;
  if (value >= min && value <= max) return 100;
  const span = max - min || 1;
  const distance = value < min ? min - value : value - max;
  const penalty = Math.min((distance / span) * 200, 100);
  return Math.max(0, 100 - penalty);
}

function scorePattern(pattern: string, preferred: string[]): number {
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
    [scorePattern(racket.string_pattern, profile.preferred_patterns), profile.pattern_importance],
  ];

  const totalImportance = specScores.reduce((sum, [, imp]) => sum + imp, 0);
  const weightedScore = specScores.reduce((acc, [score, imp]) => acc + score * (imp / totalImportance), 0);

  return Math.round(weightedScore * 10) / 10;
}

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

export function generateSpecProfile(answers: QuizAnswers): SpecRecommendation[] {
  const profile = buildIdealProfile(answers);
  const specs: SpecRecommendation[] = [];
  const level = answers.level;

  specs.push({
    spec: "Tamanho da cabeça",
    value: `${profile.head_size.min}–${profile.head_size.max} in²`,
    reason: level === "iniciante"
      ? "Cabeça maior oferece sweet spot generoso, perdoando erros de centro enquanto você desenvolve a técnica."
      : level === "basico-intermediario"
        ? "Área intermediária que equilibra perdão e controle conforme seu jogo se desenvolve."
        : "Área otimizada para seu estilo — prioriza controle e precisão nos golpes.",
  });

  specs.push({
    spec: "Peso",
    value: `${profile.weight.min}–${profile.weight.max}g`,
    reason: profile.weight.max <= 280
      ? "Raquete leve para minimizar fadiga e proteger as articulações."
      : profile.weight.min >= 305
        ? "Peso mais alto para máxima estabilidade e potência nos groundstrokes."
        : "Faixa de peso equilibrada entre manobra e estabilidade.",
  });

  specs.push({
    spec: "Rigidez (RA)",
    value: `${profile.ra.min}–${profile.ra.max}`,
    reason: profile.ra.max <= 65
      ? "Frame flexível para absorver choque e proteger o braço. Prioridade máxima dado histórico de desconforto."
      : profile.ra.min >= 67
        ? "Frame mais rígido para resposta direta e potência — requer boa técnica e braço saudável."
        : "Faixa moderada que equilibra conforto e performance.",
  });

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

export function generateEducationBlocks(answers: QuizAnswers): EducationBlock[] {
  const blocks: EducationBlock[] = [];

  if (answers.padrao_encordoamento === "desconhece" || answers.padrao_encordoamento === "vago") {
    blocks.push({
      id: "padrao_explicacao",
      title: "O que é o padrão de encordoamento?",
      content:
        "O padrão (ex: 16x19) indica quantas cordas verticais × horizontais a raquete tem. 16x19 (aberto) = espaços maiores entre as cordas = mais spin e potência 'de graça', mais amigável ao braço. 18x20 (fechado) = cordas mais juntas = trajetória plana e precisa, mas exige que você gere toda a velocidade. Para quem está evoluindo, o 16x19 é quase sempre a melhor escolha.",
    });
  }

  if (answers.level === "intermediario" || answers.level === "avancado") {
    blocks.push({
      id: "swingweight_explicacao",
      title: "Swingweight vs. peso estático",
      content:
        "O peso na ficha técnica (ex: 300g) é o peso estático. O swingweight mede o quanto a raquete 'pesa' ao ser balançada — e depende de onde o peso está distribuído. Duas raquetes de 300g podem ter swingweights muito diferentes. Uma raquete head-light de 300g tem swingweight menor que uma head-heavy de 295g. O swingweight é mais relevante para a sensação real de jogo.",
    });
  }

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
  scored.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (Math.abs(scoreDiff) >= 1) return scoreDiff;
    // Tiebreak: prefer rackets with Pro Spin link
    const aLink = hasProspinLink(a.racket.slug) ? 1 : 0;
    const bLink = hasProspinLink(b.racket.slug) ? 1 : 0;
    return bLink - aLink;
  });
  return scored.slice(0, topN);
}
