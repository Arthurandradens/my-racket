"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

interface QuizStepProps {
  question: QuizQuestion;
  currentStep: number;
  totalSteps: number;
  onAnswer: (questionId: string, value: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

function ContextCard({ text }: { text: string }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-amber-800">
          <span className="text-base" aria-hidden="true">💡</span>
          Por que isso importa?
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-amber-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-amber-900 leading-relaxed">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}

export default function QuizStep({
  question,
  currentStep,
  totalSteps,
  onAnswer,
  onBack,
  canGoBack = false,
}: QuizStepProps) {
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-gray-500 font-medium">
          <span>Pergunta {currentStep} de {totalSteps}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Back button */}
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      )}

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
        {question.text}
      </h2>

      {/* Educational context — key resets open state on question change */}
      {question.context && (
        <ContextCard key={question.id} text={question.context} />
      )}

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onAnswer(question.id, option.value)}
            className="w-full text-left border border-gray-300 rounded-xl px-5 py-4 text-gray-800 font-medium hover:border-green-500 hover:bg-green-50 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
