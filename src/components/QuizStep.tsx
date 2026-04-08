import type { QuizQuestion } from "@/lib/types";

interface QuizStepProps {
  question: QuizQuestion;
  currentStep: number;
  totalSteps: number;
  onAnswer: (questionId: string, value: string) => void;
}

export default function QuizStep({
  question,
  currentStep,
  totalSteps,
  onAnswer,
}: QuizStepProps) {
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-text-muted font-medium">
          <span>Pergunta {currentStep} de {totalSteps}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-display text-xl sm:text-2xl font-bold text-text uppercase tracking-wide leading-snug">
        {question.text}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-4">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onAnswer(question.id, option.value)}
            className="w-full text-left bg-bg-elevated border border-surface rounded-lg px-5 py-5 text-text font-medium hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,53,0.15)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
