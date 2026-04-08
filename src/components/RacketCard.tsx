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
  const { slug, brand, model, weight, head_size, ra, price_brl, image_url } = racket;

  const specs: { label: string; value: string | null }[] = [
    weight !== null ? { label: `${weight}g`, value: null } : null,
    head_size ? { label: `${head_size} in²`, value: null } : null,
    ra ? { label: `RA ${ra}`, value: null } : null,
  ].filter(Boolean) as { label: string; value: string | null }[];

  return (
    <div className="bg-bg-elevated border border-surface rounded-lg hover:border-primary/30 transition-all duration-300 flex flex-col sm:flex-row hover:shadow-[0_0_20px_rgba(255,107,53,0.1)] overflow-hidden">
      {/* Racket image */}
      <div className="shrink-0 h-52 sm:h-auto sm:w-52 bg-white flex items-center justify-center sm:self-stretch overflow-hidden p-4">
        {image_url ? (
          <img
            src={image_url}
            alt={`${brand} ${model}`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0 p-5">
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
    </div>
  );
}
