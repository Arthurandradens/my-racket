import type { QuizQuestion, PlayerLevel } from "./types";

const LEVEL_QUESTION: QuizQuestion = {
  id: "level",
  text: "Qual é o seu nível de tênis?",
  options: [
    { value: "iniciante", label: "Iniciante — Estou aprendendo ou jogo há menos de 1 ano" },
    { value: "intermediario", label: "Intermediário — Jogo regularmente há 1–5 anos" },
    { value: "avancado", label: "Avançado — Jogo competitivamente ou há mais de 5 anos" },
  ],
};

const BEGINNER_QUESTIONS: QuizQuestion[] = [
  {
    id: "frequency",
    text: "Com que frequência você joga tênis?",
    options: [
      { value: "1-2x", label: "1–2 vezes por semana" },
      { value: "3-4x", label: "3–4 vezes por semana" },
      { value: "5+", label: "5 ou mais vezes por semana" },
    ],
  },
  {
    id: "physique",
    text: "Como você descreveria seu porte físico?",
    options: [
      { value: "pequeno", label: "Pequeno / Leve" },
      { value: "medio", label: "Médio" },
      { value: "grande", label: "Grande / Forte" },
    ],
  },
  {
    id: "injury",
    text: "Você tem alguma lesão ou dor recorrente?",
    options: [
      { value: "nenhuma", label: "Não tenho nenhuma lesão" },
      { value: "cotovelo", label: "Cotovelo (ex: epicondilite)" },
      { value: "ombro", label: "Ombro" },
      { value: "punho", label: "Punho" },
    ],
  },
  {
    id: "budget",
    text: "Qual é o seu orçamento para a raquete?",
    options: [
      { value: "baixo", label: "Até R$ 500" },
      { value: "medio", label: "R$ 500 – R$ 1.200" },
      { value: "alto", label: "Acima de R$ 1.200" },
    ],
  },
];

const INTERMEDIATE_QUESTIONS: QuizQuestion[] = [
  {
    id: "play_style",
    text: "Qual é o seu estilo de jogo predominante?",
    options: [
      { value: "baseline", label: "Fundo de quadra — prefiro trocar bolas do fundo" },
      { value: "serve-and-volley", label: "Saque e voleio — gosto de subir à rede" },
      { value: "all-court", label: "All-court — me adapto bem a diversas situações" },
    ],
  },
  {
    id: "improvement",
    text: "O que você mais quer melhorar no seu jogo?",
    options: [
      { value: "potencia", label: "Potência — quero bater mais forte" },
      { value: "controle", label: "Controle — quero mais precisão nos golpes" },
      { value: "spin", label: "Spin — quero colocar mais efeito nas bolas" },
    ],
  },
  {
    id: "injury",
    text: "Você tem alguma lesão ou dor recorrente?",
    options: [
      { value: "nenhuma", label: "Não tenho nenhuma lesão" },
      { value: "cotovelo", label: "Cotovelo (ex: epicondilite)" },
      { value: "ombro", label: "Ombro" },
      { value: "punho", label: "Punho" },
    ],
  },
  {
    id: "budget",
    text: "Qual é o seu orçamento para a raquete?",
    options: [
      { value: "baixo", label: "Até R$ 500" },
      { value: "medio", label: "R$ 500 – R$ 1.200" },
      { value: "alto", label: "Acima de R$ 1.200" },
    ],
  },
];

const ADVANCED_QUESTIONS: QuizQuestion[] = [
  {
    id: "play_style",
    text: "Qual é o seu estilo de jogo predominante?",
    options: [
      { value: "baseline", label: "Fundo de quadra" },
      { value: "serve-and-volley", label: "Saque e voleio" },
      { value: "all-court", label: "All-court" },
    ],
  },
  {
    id: "main_shot",
    text: "Qual é o seu golpe mais forte?",
    options: [
      { value: "forehand", label: "Forehand (direita)" },
      { value: "backhand", label: "Backhand (esquerda / duas mãos)" },
      { value: "saque", label: "Saque" },
    ],
  },
  {
    id: "tech_preferences_weight",
    text: "Qual peso de raquete você prefere?",
    options: [
      { value: "leve", label: "Leve (abaixo de 290g)" },
      { value: "media", label: "Média (290–305g)" },
      { value: "pesada", label: "Pesada (acima de 305g)" },
    ],
  },
  {
    id: "change_desired",
    text: "O que você quer mudar em relação à sua raquete atual?",
    options: [
      { value: "mais-potencia", label: "Mais potência" },
      { value: "mais-controle", label: "Mais controle" },
      { value: "mais-spin", label: "Mais spin" },
      { value: "mais-conforto", label: "Mais conforto / menos vibração" },
      { value: "mais-leve", label: "Algo mais leve" },
      { value: "mais-pesada", label: "Algo mais pesado" },
    ],
  },
  {
    id: "budget",
    text: "Qual é o seu orçamento para a raquete?",
    options: [
      { value: "baixo", label: "Até R$ 500" },
      { value: "medio", label: "R$ 500 – R$ 1.200" },
      { value: "alto", label: "Acima de R$ 1.200" },
    ],
  },
];

export function getQuizFlow(level: PlayerLevel): QuizQuestion[] {
  if (level === "iniciante") {
    return [LEVEL_QUESTION, ...BEGINNER_QUESTIONS];
  } else if (level === "intermediario") {
    return [LEVEL_QUESTION, ...INTERMEDIATE_QUESTIONS];
  } else {
    return [LEVEL_QUESTION, ...ADVANCED_QUESTIONS];
  }
}
