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
}

export type PlayerLevel = "iniciante" | "intermediario" | "avancado";

export type PlayStyle = "baseline" | "serve-and-volley" | "all-court";

export type Physique = "pequeno" | "medio" | "grande";

export type Frequency = "1-2x" | "3-4x" | "5+";

export type Injury = "nenhuma" | "cotovelo" | "ombro" | "punho";

export type Budget = "baixo" | "medio" | "alto";

export type MainShot = "forehand" | "backhand" | "saque";

export type Improvement = "potencia" | "controle" | "spin";

export type ChangeDesired = "mais-potencia" | "mais-controle" | "mais-spin" | "mais-conforto" | "mais-leve" | "mais-pesada";

export interface TechPreferences {
  weight: "leve" | "media" | "pesada";
  balance: "head-light" | "equilibrada" | "head-heavy";
  stiffness: "flexivel" | "media" | "rigida";
}

export interface QuizAnswers {
  level: PlayerLevel;
  frequency?: Frequency;
  physique?: Physique;
  practice_time?: string;
  play_style?: PlayStyle;
  improvement?: Improvement;
  main_shot?: MainShot;
  tech_preferences?: TechPreferences;
  change_desired?: ChangeDesired;
  injury?: Injury;
  current_racket?: string;
  budget?: Budget;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: { value: string; label: string }[];
}

export interface ScoredRacket {
  racket: Racket;
  score: number;
  reasons: string[];
}
