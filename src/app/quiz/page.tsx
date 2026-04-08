"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PlayerLevel, QuizAnswers } from "@/lib/types";
import { getQuizFlow } from "@/lib/quiz-config";
import QuizStep from "@/components/QuizStep";

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [level, setLevel] = useState<PlayerLevel | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const flow = getQuizFlow(level ?? "iniciante");
  const currentQuestion = flow[stepIndex];
  const totalSteps = flow.length;

  function handleAnswer(questionId: string, value: string) {
    let updatedAnswers: Partial<QuizAnswers>;

    if (questionId === "level") {
      const lvl = value as PlayerLevel;
      setLevel(lvl);
      updatedAnswers = { ...answers, level: lvl };
    } else {
      updatedAnswers = { ...answers, [questionId]: value };
    }

    setAnswers(updatedAnswers);

    const nextIndex = stepIndex + 1;
    if (nextIndex >= totalSteps) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
      router.push("/resultado");
    } else {
      setStepIndex(nextIndex);
    }
  }

  function handleBack() {
    if (stepIndex <= 0) return;
    const prevIndex = stepIndex - 1;
    const prevQuestion = flow[prevIndex];

    const updatedAnswers = { ...answers };
    delete (updatedAnswers as Record<string, unknown>)[currentQuestion.id];

    if (prevQuestion.id === "level") {
      setLevel(null);
    }

    setAnswers(updatedAnswers);
    setStepIndex(prevIndex);
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <QuizStep
          question={currentQuestion}
          currentStep={stepIndex + 1}
          totalSteps={totalSteps}
          onAnswer={handleAnswer}
          onBack={handleBack}
          canGoBack={stepIndex > 0}
        />
      </div>
    </div>
  );
}
