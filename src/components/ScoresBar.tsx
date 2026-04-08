interface ScoresBarProps {
  label: string;
  value: number | null;
  animate?: boolean;
}

export default function ScoresBar({ label, value, animate = false }: ScoresBarProps) {
  if (value === null) return null;

  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-text-secondary shrink-0">{label}</span>
      <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
          style={{
            width: `${pct}%`,
            ...(animate ? { animation: "growWidth 1s ease-out forwards" } : {}),
          }}
        />
      </div>
      <span className="w-8 text-xs font-semibold text-text text-right shrink-0">
        {Math.round(value)}
      </span>
    </div>
  );
}
