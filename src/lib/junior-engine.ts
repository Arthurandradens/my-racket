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

  if (idade !== "13_mais") {
    blocks.push({
      id: "sistema_bolas",
      title: "O sistema de bolas coloridas — o que é e por que importa",
      content: "O ITF e a USTA criaram um sistema de bolas progressivas para que crianças aprendam tênis da forma certa:\n\nBola Vermelha (Stage 3): 75% mais lenta que a bola adulta. Quadra de 11m. Para crianças até ~8 anos. Foco em contato, coordenação e diversão.\n\nBola Laranja (Stage 2): ~50% mais lenta. Quadra de 18m. Para 7–10 anos. A técnica começa a se desenvolver de verdade.\n\nBola Verde (Stage 1): ~25% mais lenta. Quadra adulta completa. Para 9–12 anos.\n\nBola Amarela (adulta): A partir de 11+ anos.\n\nCada estágio tem um tamanho máximo de raquete recomendado. Usar a bola correta para a fase da criança é tão importante quanto o tamanho da raquete.",
    });
  }

  if (objetivo === "experimentar" || nivel === "primeiro_contato") {
    blocks.push({
      id: "nao_comprar_grande",
      title: "Resistir à tentação de comprar a raquete 'grande para durar'",
      content: "É tentador comprar uma raquete maior para aproveitar por mais tempo. Mas raquete grande demais é um dos erros mais comuns — e mais prejudiciais — que os pais cometem. Uma criança com raquete grande demais vai encurtar o swing, desenvolver vícios técnicos difíceis de corrigir, cansar mais rápido e ter mais risco de dores no pulso e cotovelo. A raquete certa para HOJE é sempre a melhor escolha, mesmo que dure só 12–18 meses.",
    });
  }

  if (nivel === "recreativo" || nivel === "primeiro_contato") {
    blocks.push({
      id: "encordoamento_iniciante",
      title: "Sobre o encordoamento — o que os pais precisam saber",
      content: "Para crianças iniciantes ou recreativas: a corda de fábrica que vem na raquete está ótima. Não precisa reencordar agora.\n\nO que NUNCA usar em crianças: polyester (corda dura, comum em raquetes adultas de performance). É a corda mais agressiva para articulações em formação.\n\nQuando começar a reencordar: quando a criança joga 3+ vezes por semana, começa a participar de torneios, ou a corda quebra. Usar multifilamento em tensão baixa (44–48 lbs). Regra prática: reencordar pelo menos tantas vezes por ano quanto a criança joga por semana.",
    });
  }

  blocks.push({
    id: "teste_tamanho",
    title: "Como confirmar em casa se a raquete está no tamanho certo",
    content: "Teste 1 — Braço estendido: Peça à criança para segurar a raquete com o braço estendido para frente, apontando horizontalmente. Ela deve manter por 10–15 segundos sem tremer. Se o braço cair, a raquete é pesada/grande demais.\n\nTeste 2 — Ao lado do corpo: Com a criança em pé e segurando a raquete ao lado do corpo com o braço relaxado, a cabeça da raquete NÃO deve arrastar no chão. Se arrastar: grande demais.\n\nTeste 3 — Swing: observe a criança fazendo forehand e backhand. Se ela parecer estar 'lutando' contra a raquete ou encurtando os movimentos, pode ser grande demais.",
  });

  if (altura === "150_157" || altura === "acima_157") {
    blocks.push({
      id: "transicao_adulta",
      title: "Quando e como fazer a transição para raquete adulta",
      content: "A maioria das crianças faz essa transição entre 11–13 anos, mas a altura e a técnica importam mais que a idade.\n\nSinais de prontidão:\nAltura acima de 150cm\nConsegue controlar uma raquete 26\" com swing completo sem tremer\nTreina com frequência (3+ vezes por semana)\nTécnica básica desenvolvida (forehand, backhand, serviço)\n\nComo fazer com segurança:\n1. Começar com modelos UL (ultralight) — entre 230–265g. Nunca ir direto para 300g+.\n2. Manter cabeça grande (105–110 in²) nas primeiras raquetes adultas.\n3. Encordoamento multifilamento — NUNCA polyester na transição.\n4. Se aparecer dor no braço: voltar ao 26\" por mais tempo.",
    });
  }

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
