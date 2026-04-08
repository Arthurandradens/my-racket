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
    <div className="bg-bg-elevated border border-surface rounded-lg hover:border-primary/30 transition-all duration-300 p-5 flex flex-col gap-4 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-0.5">
          {brand}
        </p>
        <Link
          href={`/raquete/${slug}`}
          className="text-lg font-bold text-text hover:text-primary transition-colors leading-snug"
        >
          {model}
        </Link>
      </div>

      {score !== undefined && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center bg-primary/10 text-accent font-bold text-sm px-3 py-1 rounded border border-primary/20">
            {Math.round(score)}% match
          </span>
        </div>
      )}

      {specs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specs.map((s) => (
            <span key={s.label} className="bg-bg-subtle text-text-secondary text-xs font-medium px-3 py-1 rounded">
              {s.label}
            </span>
          ))}
        </div>
      )}

      {reasons && reasons.length > 0 && (
        <ul className="flex flex-col gap-1">
          {reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="text-primary mt-0.5 shrink-0">&#10003;</span>
              {reason}
            </li>
          ))}
        </ul>
      )}

      {price_brl !== null && (
        <p className="text-base font-bold text-text">
          R${" "}
          {price_brl.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-auto pt-1">
        <AffiliateButton brand={brand} model={model} />

        {showCompareButton && onAddToCompare && (
          <button
            type="button"
            onClick={() => onAddToCompare(racket)}
            className="inline-flex items-center justify-center border border-surface text-text-secondary font-semibold text-sm px-4 py-2.5 rounded hover:border-primary hover:text-primary transition-colors"
          >
            + Comparar
          </button>
        )}
      </div>
    </div>
  );
}
