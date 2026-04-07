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
  {
    label: "Peso (g)",
    getValue: (r) => r.weight,
    higherIsBetter: false,
  },
  {
    label: "Cabeça (in²)",
    getValue: (r) => r.head_size,
    higherIsBetter: true,
  },
  {
    label: "Rigidez (RA)",
    getValue: (r) => r.ra,
    higherIsBetter: false,
  },
  {
    label: "Balanço (mm)",
    getValue: (r) => r.balance_mm,
    higherIsBetter: false,
  },
  {
    label: "Swingweight",
    getValue: (r) => r.swingweight,
    higherIsBetter: false,
  },
  {
    label: "Padrão de corda",
    getValue: (r) => r.string_pattern,
    higherIsBetter: undefined,
  },
];

const SCORE_ROWS: RowConfig[] = [
  { label: "Overall", getValue: (r) => r.scores.overall, higherIsBetter: true },
  { label: "Potência", getValue: (r) => r.scores.power, higherIsBetter: true },
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
  const values = rackets.map((r) => getValue(r));
  const numericValues = values.map((v) =>
    typeof v === "number" ? v : null
  );
  let bestIdx = -1;
  let bestVal: number | null = null;
  for (let i = 0; i < numericValues.length; i++) {
    const v = numericValues[i];
    if (v === null) continue;
    if (
      bestVal === null ||
      (higherIsBetter && v > bestVal) ||
      (!higherIsBetter && v < bestVal)
    ) {
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

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 w-40 sticky left-0 bg-gray-50 z-10">
              Especificação
            </th>
            {rackets.map((r, i) => (
              <th
                key={r.slug}
                className="px-4 py-3 text-center font-semibold text-gray-900 min-w-[180px]"
              >
                <div className="flex flex-col items-center gap-1">
                  {matchSlug && r.slug === matchSlug && (
                    <span className="bg-green-600 text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Seu match
                    </span>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                    {r.brand}
                  </span>
                  <span className="text-sm font-bold text-gray-900 leading-snug">
                    {r.model}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Spec rows */}
          <tr>
            <td
              colSpan={rackets.length + 1}
              className="px-4 py-2 bg-gray-100 text-xs font-bold uppercase tracking-wide text-gray-500"
            >
              Especificações
            </td>
          </tr>
          {SPEC_ROWS.map((row) => {
            const bestIdx = getBestIndex(rackets, row.getValue, row.higherIsBetter);
            return (
              <tr key={row.label} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600 font-medium sticky left-0 bg-white hover:bg-gray-50 z-10">
                  {row.label}
                </td>
                {rackets.map((r, i) => {
                  const value = row.getValue(r);
                  const isBest = i === bestIdx;
                  return (
                    <td
                      key={r.slug}
                      className={`px-4 py-3 text-center ${
                        isBest
                          ? "text-green-700 font-bold bg-green-50"
                          : "text-gray-800"
                      }`}
                    >
                      {formatValue(value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {/* Score rows */}
          <tr>
            <td
              colSpan={rackets.length + 1}
              className="px-4 py-2 bg-gray-100 text-xs font-bold uppercase tracking-wide text-gray-500"
            >
              Pontuações (0–100)
            </td>
          </tr>
          {SCORE_ROWS.map((row) => {
            const bestIdx = getBestIndex(rackets, row.getValue, row.higherIsBetter);
            return (
              <tr key={row.label} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600 font-medium sticky left-0 bg-white hover:bg-gray-50 z-10">
                  {row.label}
                </td>
                {rackets.map((r, i) => {
                  const value = row.getValue(r);
                  const isBest = i === bestIdx;
                  return (
                    <td
                      key={r.slug}
                      className={`px-4 py-3 text-center ${
                        isBest
                          ? "text-green-700 font-bold bg-green-50"
                          : "text-gray-800"
                      }`}
                    >
                      {formatValue(value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {/* Price row */}
          <tr>
            <td
              colSpan={rackets.length + 1}
              className="px-4 py-2 bg-gray-100 text-xs font-bold uppercase tracking-wide text-gray-500"
            >
              Preço
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-600 font-medium sticky left-0 bg-white hover:bg-gray-50 z-10">
              Preço (R$)
            </td>
            {rackets.map((r) => {
              const price = r.price_brl;
              return (
                <td key={r.slug} className="px-4 py-3 text-center text-gray-800 font-semibold">
                  {price !== null
                    ? `R$ ${price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </td>
              );
            })}
          </tr>

          {/* Buy row */}
          <tr className="bg-gray-50">
            <td className="px-4 py-3 text-gray-600 font-medium sticky left-0 bg-gray-50 z-10">
              Comprar
            </td>
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
