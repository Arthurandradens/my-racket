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

    // Handle tech_preferences_* questions — merge into tech_preferences object
    if (questionId.startsWith("tech_preferences_")) {
      const key = questionId.replace("tech_preferences_", "") as keyof import("@/lib/types").TechPreferences;
      const prevTechPrefs = answers.tech_preferences ?? { weight: "media", balance: "equilibrada", stiffness: "media" };
      updatedAnswers = {
        ...answers,
        tech_preferences: {
          ...prevTechPrefs,
          [key]: value,
        },
      };
    } else if (questionId === "level") {
      const lvl = value as PlayerLevel;
      setLevel(lvl);
      updatedAnswers = { ...answers, level: lvl };
    } else {
      updatedAnswers = { ...answers, [questionId]: value };
    }

    setAnswers(updatedAnswers);

    const nextIndex = stepIndex + 1;
    if (nextIndex >= totalSteps) {
      // Last question — store answers and navigate to results
      sessionStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
      router.push("/resultado");
    } else {
      setStepIndex(nextIndex);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <QuizStep
          question={currentQuestion}
          currentStep={stepIndex + 1}
          totalSteps={totalSteps}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
