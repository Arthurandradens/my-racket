"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { QuizAnswers, ScoredRacket, Racket } from "@/lib/types";
import { recommend } from "@/lib/engine";
import { generateProfile } from "@/lib/profile";
import RacketCard from "@/components/RacketCard";
import ScoresBar from "@/components/ScoresBar";
import racketData from "@/data/rackets.json";

const rackets = racketData as Racket[];

const LOADING_STEPS = [
  "Analisando seu perfil de jogo...",
  "Cruzando dados com 1.000+ raquetes...",
  "Calculando compatibilidade...",
];

export default function ResultadoPage() {
  const router = useRouter();
  const [top3, setTop3] = useState<ScoredRacket[]>([]);
  const [more, setMore] = useState<ScoredRacket[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const [loadingStep, setLoadingStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const raw = sessionStorage.getItem("quizAnswers");
    if (!raw) {
      router.replace("/quiz");
      return;
    }

    let parsed: QuizAnswers;
    try {
      parsed = JSON.parse(raw) as QuizAnswers;
    } catch {
      router.replace("/quiz");
      return;
    }

    setAnswers(parsed);

    const top = recommend(rackets, parsed, 3);
    const rest = recommend(rackets, parsed, 10).slice(3);
    setTop3(top);
    setMore(rest);

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    // Transition to reveal phase
    setTimeout(() => {
      clearInterval(stepInterval);
      setPhase("reveal");
      setTimeout(() => setPhase("done"), 800);
    }, 4500);

    return () => clearInterval(stepInterval);
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

  // Phase 1: Loading animation
  if (phase === "loading") {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 gap-8">
        {/* Pulsing icon */}
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Loading messages */}
        <div className="flex flex-col items-center gap-3 min-h-[60px]">
          {LOADING_STEPS.map((step, i) => (
            <p
              key={step}
              className={`text-sm sm:text-base transition-all duration-500 ${
                i === loadingStep
                  ? "text-text opacity-100"
                  : i < loadingStep
                  ? "text-text-muted opacity-50 text-xs"
                  : "text-text-muted opacity-0 h-0 overflow-hidden"
              }`}
            >
              {step}
            </p>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 sm:w-80 bg-surface rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
            style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (top3.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-text-secondary text-lg text-center">
          Nenhuma raquete encontrada para o seu perfil.
        </p>
        <Link
          href="/quiz"
          className="bg-primary text-white font-bold px-6 py-3 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
        >
          Refazer quiz
        </Link>
      </div>
    );
  }

  const profile = answers ? generateProfile(answers) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Personalized Report */}
      {profile && (
        <div
          className="bg-bg-elevated border border-surface rounded-lg p-6 sm:p-8"
          style={{ animation: "fadeInUp 0.6s ease-out" }}
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text uppercase tracking-wide mb-3">
            {profile.title}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">
            {profile.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-accent text-xs font-semibold px-3 py-1 rounded border border-primary/20 uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="text-center"
        style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
      >
        <h2 className="font-display text-xl sm:text-2xl font-bold text-text uppercase tracking-wide mb-3">
          Suas recomendacoes
        </h2>
        <p className="text-text-secondary text-base">
          As raquetes mais compativeis com o seu perfil.
        </p>
      </div>

      {/* Top 3 */}
      <div className="flex flex-col gap-8">
        {top3.map((item, i) => (
          <div
            key={item.racket.slug}
            className="flex flex-col gap-4"
            style={{ animation: `fadeInUp 0.5s ease-out ${0.3 + i * 0.15}s both` }}
          >
            {i === 0 && (
              <div className="flex items-center gap-2">
                <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
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
              <div className="bg-bg-elevated border border-surface rounded-lg p-5 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-text-secondary mb-1 uppercase tracking-wide">
                  Pontuacoes tecnicas
                </h3>
                <ScoresBar label="Geral" value={item.racket.scores.overall} animate={phase === "done"} />
                <ScoresBar label="Potencia" value={item.racket.scores.power} animate={phase === "done"} />
                <ScoresBar label="Controle" value={item.racket.scores.control} animate={phase === "done"} />
                <ScoresBar label="Conforto" value={item.racket.scores.comfort} animate={phase === "done"} />
                <ScoresBar label="Topspin" value={item.racket.scores.topspin} animate={phase === "done"} />
                <ScoresBar label="Manobrabilidade" value={item.racket.scores.maneuverability} animate={phase === "done"} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ver mais */}
      {more.length > 0 && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="w-full border border-surface text-text-secondary font-semibold py-3 rounded-lg hover:border-primary hover:text-primary transition-colors"
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

      {/* Compare indicator */}
      {compareList.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-accent font-medium text-sm">
            {compareList.length} raquete{compareList.length > 1 ? "s" : ""} adicionada{compareList.length > 1 ? "s" : ""} para comparacao
          </p>
          <button
            type="button"
            onClick={goToComparator}
            className="bg-primary text-white font-bold text-sm px-5 py-2 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
          >
            Ver comparacao
          </button>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-surface">
        <Link
          href="/quiz"
          className="border border-surface text-text-secondary font-semibold px-6 py-3 rounded hover:border-primary hover:text-primary transition-colors"
        >
          Refazer quiz
        </Link>
        <Link
          href="/comparar"
          className="bg-primary text-white font-bold px-6 py-3 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
        >
          Ir para comparador
        </Link>
      </div>
    </div>
  );
}
