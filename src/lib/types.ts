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
  image_url: string | null;
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

export type PlayerLevel = "iniciante" | "basico-intermediario" | "intermediario" | "avancado" | "junior";

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
  // Junior
  altura?: string;
  idade?: string;
  nivel_junior?: string;
  queixa?: string;
  objetivo_junior?: string;
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
