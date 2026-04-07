interface ScoresBarProps {
  label: string;
  value: number | null;
}

export default function ScoresBar({ label, value }: ScoresBarProps) {
  if (value === null) return null;

  // Scores are expected 0–100
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-gray-600 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs font-semibold text-gray-700 text-right shrink-0">
        {Math.round(value)}
      </span>
    </div>
  );
}
