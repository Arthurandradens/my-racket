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

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
        {question.text}
      </h2>

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
