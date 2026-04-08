"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { QuizAnswers, ScoredRacket, Racket, SpecRecommendation, EducationBlock, InjuryAlert } from "@/lib/types";
import { recommend, generateSpecProfile, generateEducationBlocks, generateInjuryAlert } from "@/lib/engine";
import RacketCard from "@/components/RacketCard";
import ScoresBar from "@/components/ScoresBar";
import racketData from "@/data/rackets.json";

const rackets = racketData as Racket[];

export default function ResultadoPage() {
  const router = useRouter();
  const [top3, setTop3] = useState<ScoredRacket[]>([]);
  const [more, setMore] = useState<ScoredRacket[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [specProfile, setSpecProfile] = useState<SpecRecommendation[]>([]);
  const [eduBlocks, setEduBlocks] = useState<EducationBlock[]>([]);
  const [injuryAlert, setInjuryAlert] = useState<InjuryAlert | null>(null);

  useEffect(() => {
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

    setTop3(top);
    setMore(rest);
    setSpecProfile(generateSpecProfile(answers));
    setEduBlocks(generateEducationBlocks(answers));
    setInjuryAlert(generateInjuryAlert(answers));
    setLoaded(true);
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

  if (!loaded) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Calculando suas recomendações...</p>
      </div>
    );
  }

  if (top3.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-gray-700 text-lg text-center">
          Nenhuma raquete encontrada para o seu perfil.
        </p>
        <Link
          href="/quiz"
          className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
        >
          Refazer quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Suas recomendações
        </h1>
        <p className="text-gray-500 text-lg">
          Com base nas suas respostas, montamos o perfil ideal de raquete para você.
        </p>
      </div>

      {/* Injury alert */}
      {injuryAlert && (
        <div
          className={`rounded-xl p-5 flex flex-col gap-3 ${
            injuryAlert.severity === "urgent"
              ? "bg-red-50 border-2 border-red-300"
              : "bg-yellow-50 border border-yellow-300"
          }`}
        >
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              injuryAlert.severity === "urgent" ? "text-red-800" : "text-yellow-800"
            }`}
          >
            <span aria-hidden="true">{injuryAlert.severity === "urgent" ? "⚠️" : "⚡"}</span>
            {injuryAlert.title}
          </h2>
          <ul className="flex flex-col gap-1.5">
            {injuryAlert.recommendations.map((rec, i) => (
              <li
                key={i}
                className={`text-sm leading-relaxed ${
                  injuryAlert.severity === "urgent" ? "text-red-700" : "text-yellow-700"
                }`}
              >
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Spec profile */}
      {specProfile.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Perfil de especificações recomendado
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Spec</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Recomendado</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Por quê</th>
                </tr>
              </thead>
              <tbody>
                {specProfile.map((spec) => (
                  <tr key={spec.spec} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {spec.spec}
                    </td>
                    <td className="px-5 py-3 text-green-700 font-semibold whitespace-nowrap">
                      {spec.value}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{spec.reason}</td>
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
          {eduBlocks.map((block) => (
            <div
              key={block.id}
              className="bg-blue-50 border border-blue-200 rounded-xl p-5"
            >
              <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span aria-hidden="true">📘</span>
                {block.title}
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">{block.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top 3 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Raquetes mais compatíveis
        </h2>
        <div className="flex flex-col gap-8">
          {top3.map((item, i) => (
            <div key={item.racket.slug} className="flex flex-col gap-4">
              {i === 0 && (
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
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
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Pontuações técnicas
                  </h3>
                  <ScoresBar label="Geral" value={item.racket.scores.overall} />
                  <ScoresBar label="Potência" value={item.racket.scores.power} />
                  <ScoresBar label="Controle" value={item.racket.scores.control} />
                  <ScoresBar label="Conforto" value={item.racket.scores.comfort} />
                  <ScoresBar label="Topspin" value={item.racket.scores.topspin} />
                  <ScoresBar label="Manobrabilidade" value={item.racket.scores.maneuverability} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ver mais section */}
      {more.length > 0 && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:border-green-500 hover:text-green-600 transition-colors"
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

      {/* Compare list indicator */}
      {compareList.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-green-800 font-medium text-sm">
            {compareList.length} raquete{compareList.length > 1 ? "s" : ""} adicionada{compareList.length > 1 ? "s" : ""} para comparação
          </p>
          <button
            type="button"
            onClick={goToComparator}
            className="bg-green-600 text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver comparação
          </button>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/quiz"
          className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full hover:border-green-500 hover:text-green-600 transition-colors"
        >
          Refazer quiz
        </Link>
        <Link
          href="/comparar"
          className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
        >
          Ir para comparador
        </Link>
      </div>
    </div>
  );
}
