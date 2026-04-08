"use client";

import { useState, useEffect, useRef } from "react";
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
    <div className="bg-accent/10 border border-accent/20 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-accent">
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
          className={`text-accent transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-text-secondary leading-relaxed">
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
  const [animState, setAnimState] = useState<"enter" | "visible" | "exit">("enter");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const prevStepRef = useRef(currentStep);
  const pendingAnswer = useRef<{ id: string; value: string } | null>(null);

  // Detect step changes and trigger enter animation
  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      setDirection(currentStep > prevStepRef.current ? "forward" : "backward");
      prevStepRef.current = currentStep;
    }
    setAnimState("enter");
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState("visible"));
    });
    return () => cancelAnimationFrame(timer);
  }, [currentStep, question.id]);

  function handleAnswer(questionId: string, value: string) {
    pendingAnswer.current = { id: questionId, value };
    setDirection("forward");
    setAnimState("exit");
  }

  function handleBack() {
    setDirection("backward");
    setAnimState("exit");
    pendingAnswer.current = null;
  }

  function onTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (animState !== "exit") return;
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "opacity") return;
    if (pendingAnswer.current) {
      onAnswer(pendingAnswer.current.id, pendingAnswer.current.value);
      pendingAnswer.current = null;
    } else if (onBack) {
      onBack();
    }
  }

  const enterTransform = direction === "forward" ? "translate-x-[60px]" : "translate-x-[-60px]";
  const exitTransform = direction === "forward" ? "translate-x-[-60px]" : "translate-x-[60px]";

  const contentClass =
    animState === "enter"
      ? `opacity-0 ${enterTransform}`
      : animState === "exit"
      ? `opacity-0 ${exitTransform}`
      : "opacity-100 translate-x-0";

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Progress bar — always visible, no animation */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-text-muted font-medium">
          <span>Pergunta {currentStep} de {totalSteps}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Animated content */}
      <div
        className={`flex flex-col gap-6 transition-all duration-300 ease-out ${contentClass}`}
        onTransitionEnd={onTransitionEnd}
      >
        {/* Back button */}
        {canGoBack && (
          <button
            type="button"
            onClick={handleBack}
            className="self-start flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
        )}

        {/* Question */}
        <h2 className="font-display text-xl sm:text-2xl font-bold text-text uppercase tracking-wide leading-snug">
          {question.text}
        </h2>

        {/* Educational context */}
        {question.context && (
          <ContextCard key={question.id} text={question.context} />
        )}

        {/* Options — staggered entry */}
        <div className="flex flex-col gap-4">
          {question.options.map((option, i) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAnswer(question.id, option.value)}
              className="w-full text-left bg-bg-elevated border border-surface rounded-lg px-5 py-5 text-text font-medium hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,53,0.15)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              style={{
                opacity: animState === "visible" ? 1 : 0,
                transform: animState === "visible" ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.3s ease-out ${0.1 + i * 0.06}s, transform 0.3s ease-out ${0.1 + i * 0.06}s, border-color 0.3s, box-shadow 0.3s`,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
