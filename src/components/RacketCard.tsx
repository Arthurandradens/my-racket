import Link from "next/link";
import type { Racket } from "@/lib/types";
import AffiliateButton from "./AffiliateButton";

interface RacketCardProps {
  racket: Racket;
  score?: number;
  reasons?: string[];
  showCompareButton?: boolean;
  onAddToCompare?: (racket: Racket) => void;
}

export default function RacketCard({
  racket,
  score,
  reasons,
  showCompareButton = false,
  onAddToCompare,
}: RacketCardProps) {
  const { slug, brand, model, weight, head_size, ra, price_brl } = racket;

  const specs: { label: string; value: string | null }[] = [
    weight !== null ? { label: `${weight}g`, value: null } : null,
    head_size ? { label: `${head_size} in²`, value: null } : null,
    ra ? { label: `RA ${ra}`, value: null } : null,
  ].filter(Boolean) as { label: string; value: string | null }[];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Brand & model */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-0.5">
          {brand}
        </p>
        <Link
          href={`/raquete/${slug}`}
          className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors leading-snug"
        >
          {model}
        </Link>
      </div>

      {/* Match score badge */}
      {score !== undefined && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center bg-green-50 text-green-700 font-bold text-sm px-3 py-1 rounded-full border border-green-200">
            {Math.round(score)}% match
          </span>
        </div>
      )}

      {/* Specs chips */}
      {specs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specs.map((s) => (
            <span
              key={s.label}
              className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
            >
              {s.label}
            </span>
          ))}
        </div>
      )}

      {/* Reasons */}
      {reasons && reasons.length > 0 && (
        <ul className="flex flex-col gap-1">
          {reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
              {reason}
            </li>
          ))}
        </ul>
      )}

      {/* Price */}
      {price_brl !== null && (
        <p className="text-base font-bold text-gray-900">
          R${" "}
          {price_brl.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mt-auto pt-1">
        <AffiliateButton brand={brand} model={model} />

        {showCompareButton && onAddToCompare && (
          <button
            type="button"
            onClick={() => onAddToCompare(racket)}
            className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-lg hover:border-green-500 hover:text-green-600 transition-colors"
          >
            + Comparar
          </button>
        )}
      </div>
    </div>
  );
}
