import type { Racket } from "@/lib/types";
import AffiliateButton from "./AffiliateButton";

interface CompareTableProps {
  rackets: Racket[];
  matchSlug?: string;
}

type RowConfig = {
  label: string;
  getValue: (r: Racket) => number | string | null;
  higherIsBetter?: boolean;
  unit?: string;
};

const SPEC_ROWS: RowConfig[] = [
  { label: "Peso", getValue: (r) => r.weight, higherIsBetter: false, unit: "g" },
  { label: "Cabeca", getValue: (r) => r.head_size, higherIsBetter: true, unit: "in²" },
  { label: "Rigidez", getValue: (r) => r.ra, higherIsBetter: false, unit: "RA" },
  { label: "Balanco", getValue: (r) => r.balance_mm, higherIsBetter: false, unit: "mm" },
  { label: "Swingweight", getValue: (r) => r.swingweight, higherIsBetter: false },
  { label: "Encordoamento", getValue: (r) => r.string_pattern, higherIsBetter: undefined },
];

const SCORE_ROWS: RowConfig[] = [
  { label: "Overall", getValue: (r) => r.scores.overall, higherIsBetter: true },
  { label: "Potencia", getValue: (r) => r.scores.power, higherIsBetter: true },
  { label: "Controle", getValue: (r) => r.scores.control, higherIsBetter: true },
  { label: "Conforto", getValue: (r) => r.scores.comfort, higherIsBetter: true },
  { label: "Topspin", getValue: (r) => r.scores.topspin, higherIsBetter: true },
  { label: "Manobrabilidade", getValue: (r) => r.scores.maneuverability, higherIsBetter: true },
  { label: "Estabilidade", getValue: (r) => r.scores.stability, higherIsBetter: true },
];

function getBestIndex(
  rackets: Racket[],
  getValue: (r: Racket) => number | string | null,
  higherIsBetter?: boolean
): number {
  if (higherIsBetter === undefined) return -1;
  const numericValues = rackets.map((r) => {
    const v = getValue(r);
    return typeof v === "number" ? v : null;
  });
  let bestIdx = -1;
  let bestVal: number | null = null;
  for (let i = 0; i < numericValues.length; i++) {
    const v = numericValues[i];
    if (v === null) continue;
    if (bestVal === null || (higherIsBetter && v > bestVal) || (!higherIsBetter && v < bestVal)) {
      bestVal = v;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function formatValue(value: number | string | null, unit?: string): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return unit ? `${value} ${unit}` : String(value);
  return value;
}

/* H2H score bar — two bars growing from center */
function H2HBar({ values, bestIdx }: { values: (number | null)[]; bestIdx: number }) {
  const max = Math.max(...values.filter((v): v is number => v !== null), 1);

  if (values.length === 2) {
    const [left, right] = values;
    const leftPct = left !== null ? (left / max) * 100 : 0;
    const rightPct = right !== null ? (right / max) * 100 : 0;

    return (
      <div className="flex items-center gap-1 h-5">
        {/* Left bar grows right-to-left */}
        <div className="flex-1 flex justify-end">
          <div
            className={`h-3 rounded-l transition-all duration-500 ${bestIdx === 0 ? "bg-primary" : "bg-surface"}`}
            style={{ width: `${leftPct}%` }}
          />
        </div>
        <div className="w-px h-5 bg-text-muted/30 shrink-0" />
        {/* Right bar grows left-to-right */}
        <div className="flex-1">
          <div
            className={`h-3 rounded-r transition-all duration-500 ${bestIdx === 1 ? "bg-primary" : "bg-surface"}`}
            style={{ width: `${rightPct}%` }}
          />
        </div>
      </div>
    );
  }

  return null;
}

export default function CompareTable({ rackets, matchSlug }: CompareTableProps) {
  if (rackets.length === 0) return null;

  const is2way = rackets.length === 2;

  return (
    <div className="flex flex-col gap-8">
      {/* H2H Header — racket images and names */}
      <div className={`grid gap-4 ${rackets.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {rackets.map((r) => (
          <div key={r.slug} className="flex flex-col items-center gap-3">
            {/* Image */}
            <div className="w-full aspect-square max-w-[180px] bg-white rounded-lg overflow-hidden flex items-center justify-center p-4">
              {r.image_url ? (
                <img
                  src={r.image_url}
                  alt={`${r.brand} ${r.model}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            {/* Name */}
            {matchSlug && r.slug === matchSlug && (
              <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded">
                Seu match
              </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{r.brand}</p>
            <p className="font-display text-base sm:text-lg font-bold text-text text-center uppercase tracking-wide leading-tight">
              {r.model}
            </p>
            {r.price_brl !== null && (
              <p className="text-sm font-bold text-accent">
                R$ {r.price_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
            <AffiliateButton brand={r.brand} model={r.model} />
          </div>
        ))}
      </div>

      {/* VS divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-surface" />
        <span className="font-display text-2xl font-bold text-primary uppercase tracking-widest">H2H</span>
        <div className="flex-1 h-px bg-surface" />
      </div>

      {/* Specs comparison */}
      <div className="bg-bg-elevated border border-surface rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-surface">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">Especificacoes</h3>
        </div>
        <div className="flex flex-col">
          {SPEC_ROWS.map((row) => {
            const bestIdx = getBestIndex(rackets, row.getValue, row.higherIsBetter);
            return (
              <div key={row.label} className="border-b border-surface/50 px-4 py-3">
                <p className="text-xs text-text-muted text-center mb-2 uppercase tracking-wide">{row.label}</p>
                <div className={`grid gap-4 ${rackets.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {rackets.map((r, i) => {
                    const value = row.getValue(r);
                    const isBest = i === bestIdx;
                    return (
                      <p
                        key={r.slug}
                        className={`text-center text-sm font-semibold ${isBest ? "text-accent" : "text-text"}`}
                      >
                        {formatValue(value, row.unit)}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scores comparison — H2H bars for 2 rackets, grid for 3 */}
      <div className="bg-bg-elevated border border-surface rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-surface">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">Performance (0–100)</h3>
        </div>
        <div className="flex flex-col">
          {SCORE_ROWS.map((row) => {
            const bestIdx = getBestIndex(rackets, row.getValue, row.higherIsBetter);
            const values = rackets.map((r) => {
              const v = row.getValue(r);
              return typeof v === "number" ? v : null;
            });

            return (
              <div key={row.label} className="border-b border-surface/50 px-4 py-3">
                <p className="text-xs text-text-muted text-center mb-2 uppercase tracking-wide">{row.label}</p>

                {is2way ? (
                  /* H2H layout: value — bar | bar — value */
                  <div className="flex items-center gap-2">
                    <span className={`w-8 text-right text-sm font-bold shrink-0 ${bestIdx === 0 ? "text-accent" : "text-text"}`}>
                      {values[0] !== null ? values[0] : "—"}
                    </span>
                    <div className="flex-1">
                      <H2HBar values={values} bestIdx={bestIdx} />
                    </div>
                    <span className={`w-8 text-left text-sm font-bold shrink-0 ${bestIdx === 1 ? "text-accent" : "text-text"}`}>
                      {values[1] !== null ? values[1] : "—"}
                    </span>
                  </div>
                ) : (
                  /* 3-way: simple grid with values */
                  <div className="grid grid-cols-3 gap-4">
                    {rackets.map((r, i) => {
                      const value = values[i];
                      const isBest = i === bestIdx;
                      return (
                        <div key={r.slug} className="flex flex-col items-center gap-1">
                          <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${isBest ? "bg-gradient-to-r from-primary to-accent" : "bg-text-muted/40"}`}
                              style={{ width: `${value ?? 0}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${isBest ? "text-accent" : "text-text"}`}>
                            {value !== null ? value : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
