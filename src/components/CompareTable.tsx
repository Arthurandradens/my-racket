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
};

const SPEC_ROWS: RowConfig[] = [
  { label: "Peso (g)", getValue: (r) => r.weight, higherIsBetter: false },
  { label: "Cabeca (in²)", getValue: (r) => r.head_size, higherIsBetter: true },
  { label: "Rigidez (RA)", getValue: (r) => r.ra, higherIsBetter: false },
  { label: "Balanco (mm)", getValue: (r) => r.balance_mm, higherIsBetter: false },
  { label: "Swingweight", getValue: (r) => r.swingweight, higherIsBetter: false },
  { label: "Padrao de corda", getValue: (r) => r.string_pattern, higherIsBetter: undefined },
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

function formatValue(value: number | string | null): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return String(value);
  return value;
}

export default function CompareTable({ rackets, matchSlug }: CompareTableProps) {
  if (rackets.length === 0) return null;

  const sectionHeaderClass = "px-4 py-2 bg-bg-subtle text-xs font-bold uppercase tracking-wide text-text-muted";
  const cellClass = "px-4 py-3 text-center text-text";
  const labelClass = "px-4 py-3 text-text-secondary font-medium sticky left-0 bg-bg-elevated z-10";

  return (
    <div className="overflow-x-auto rounded-lg border border-surface">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-bg-elevated border-b border-surface">
            <th className="text-left px-4 py-3 font-semibold text-text-muted w-40 sticky left-0 bg-bg-elevated z-10">
              Especificacao
            </th>
            {rackets.map((r) => (
              <th key={r.slug} className="px-4 py-3 text-center font-semibold text-text min-w-[180px]">
                <div className="flex flex-col items-center gap-1">
                  {matchSlug && r.slug === matchSlug && (
                    <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">Seu match</span>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">{r.brand}</span>
                  <span className="text-sm font-bold text-text leading-snug">{r.model}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={rackets.length + 1} className={sectionHeaderClass}>Especificacoes</td></tr>
          {SPEC_ROWS.map((row) => {
            const bestIdx = getBestIndex(rackets, row.getValue, row.higherIsBetter);
            return (
              <tr key={row.label} className="border-b border-surface/50 hover:bg-bg-subtle/50">
                <td className={labelClass}>{row.label}</td>
                {rackets.map((r, i) => (
                  <td key={r.slug} className={`${cellClass} ${i === bestIdx ? "text-accent font-bold" : ""}`}>
                    {formatValue(row.getValue(r))}
                  </td>
                ))}
              </tr>
            );
          })}

          <tr><td colSpan={rackets.length + 1} className={sectionHeaderClass}>Pontuacoes (0–100)</td></tr>
          {SCORE_ROWS.map((row) => {
            const bestIdx = getBestIndex(rackets, row.getValue, row.higherIsBetter);
            return (
              <tr key={row.label} className="border-b border-surface/50 hover:bg-bg-subtle/50">
                <td className={labelClass}>{row.label}</td>
                {rackets.map((r, i) => (
                  <td key={r.slug} className={`${cellClass} ${i === bestIdx ? "text-accent font-bold" : ""}`}>
                    {formatValue(row.getValue(r))}
                  </td>
                ))}
              </tr>
            );
          })}

          <tr><td colSpan={rackets.length + 1} className={sectionHeaderClass}>Preco</td></tr>
          <tr className="border-b border-surface/50">
            <td className={labelClass}>Preco (R$)</td>
            {rackets.map((r) => (
              <td key={r.slug} className={`${cellClass} font-semibold`}>
                {r.price_brl !== null ? `R$ ${r.price_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
              </td>
            ))}
          </tr>

          <tr className="bg-bg-subtle">
            <td className="px-4 py-3 text-text-secondary font-medium sticky left-0 bg-bg-subtle z-10">Comprar</td>
            {rackets.map((r) => (
              <td key={r.slug} className="px-4 py-4 text-center">
                <AffiliateButton brand={r.brand} model={r.model} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
