"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { QuizAnswers, ScoredRacket, Racket, SpecRecommendation, EducationBlock, InjuryAlert } from "@/lib/types";
import { recommend, generateSpecProfile, generateEducationBlocks, generateInjuryAlert } from "@/lib/engine";
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

interface ResultData {
  top3: ScoredRacket[];
  more: ScoredRacket[];
  specProfile: SpecRecommendation[];
  eduBlocks: EducationBlock[];
  injuryAlert: InjuryAlert | null;
  answers: QuizAnswers;
}

export default function ResultadoPage() {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const [loadingStep, setLoadingStep] = useState(0);
  const hasRun = useRef(false);
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

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

    setData({
      top3: top,
      more: rest,
      specProfile: generateSpecProfile(answers),
      eduBlocks: generateEducationBlocks(answers),
      injuryAlert: generateInjuryAlert(answers),
      answers,
    });

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

  const top3 = data?.top3 ?? [];
  const more = data?.more ?? [];
  const specProfile = data?.specProfile ?? [];
  const eduBlocks = data?.eduBlocks ?? [];
  const injuryAlert = data?.injuryAlert ?? null;

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
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

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

        <div className="w-64 sm:w-80 bg-surface rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
            style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (!data || top3.length === 0) {
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

  const profile = generateProfile(data.answers);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Personalized Profile Report */}
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

      {/* Injury alert */}
      {injuryAlert && (
        <div
          className={`rounded-lg p-5 flex flex-col gap-3 ${
            injuryAlert.severity === "urgent"
              ? "bg-danger/10 border-2 border-danger/30"
              : "bg-accent/10 border border-accent/20"
          }`}
          style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
        >
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              injuryAlert.severity === "urgent" ? "text-danger" : "text-accent"
            }`}
          >
            {injuryAlert.title}
          </h2>
          <ul className="flex flex-col gap-1.5">
            {injuryAlert.recommendations.map((rec, i) => (
              <li
                key={i}
                className={`text-sm leading-relaxed ${
                  injuryAlert.severity === "urgent" ? "text-danger/80" : "text-accent/80"
                }`}
              >
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Spec profile table */}
      {specProfile.length > 0 && (
        <div
          className="bg-bg-elevated border border-surface rounded-lg overflow-hidden"
          style={{ animation: "fadeInUp 0.6s ease-out 0.15s both" }}
        >
          <div className="px-5 py-4 border-b border-surface">
            <h2 className="text-lg font-bold text-text">
              Perfil de especificacoes recomendado
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-subtle">
                  <th className="text-left px-5 py-3 font-semibold text-text-secondary">Spec</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-secondary">Recomendado</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-secondary">Por que</th>
                </tr>
              </thead>
              <tbody>
                {specProfile.map((spec) => (
                  <tr key={spec.spec} className="border-t border-surface">
                    <td className="px-5 py-3 font-medium text-text whitespace-nowrap">
                      {spec.spec}
                    </td>
                    <td className="px-5 py-3 text-accent font-semibold whitespace-nowrap">
                      {spec.value}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{spec.reason}</td>
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
          {eduBlocks.map((block, i) => (
            <div
              key={block.id}
              className="bg-bg-elevated border border-surface rounded-lg p-5"
              style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + i * 0.05}s both` }}
            >
              <h3 className="text-sm font-bold text-accent mb-2">
                {block.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{block.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div
        className="text-center"
        style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
      >
        <h2 className="font-display text-xl sm:text-2xl font-bold text-text uppercase tracking-wide mb-3">
          Raquetes mais compativeis
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
