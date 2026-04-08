import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import type { Racket } from "@/lib/types";
import { getRacketBySlug, getAllRackets } from "@/lib/rackets";
import racketData from "@/data/rackets.json";
import SpecsTable from "@/components/SpecsTable";
import ScoresBar from "@/components/ScoresBar";
import AffiliateButton from "@/components/AffiliateButton";

const rackets = racketData as Racket[];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRackets(rackets).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const racket = getRacketBySlug(rackets, slug);
  if (!racket) return { title: "Raquete nao encontrada | My Racket" };
  const yearStr = racket.year ? ` ${racket.year}` : "";
  return {
    title: `${racket.brand} ${racket.model}${yearStr} — Specs, Review e Preco | My Racket`,
    description: racket.expert_summary_pt ?? `Confira as especificacoes, scores de performance e preco da ${racket.brand} ${racket.model}${yearStr}.`,
  };
}

const SCORE_LABELS: { key: keyof Racket["scores"]; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "groundstrokes", label: "Groundstrokes" },
  { key: "volleys", label: "Volleys" },
  { key: "serves", label: "Saques" },
  { key: "returns", label: "Devolucoes" },
  { key: "power", label: "Potencia" },
  { key: "control", label: "Controle" },
  { key: "maneuverability", label: "Manobrabilidade" },
  { key: "stability", label: "Estabilidade" },
  { key: "comfort", label: "Conforto" },
  { key: "touch_feel", label: "Toque" },
  { key: "topspin", label: "Topspin" },
  { key: "slice", label: "Slice" },
];

export default async function RaquetePage({ params }: PageProps) {
  const { slug } = await params;
  const racket = getRacketBySlug(rackets, slug);

  if (!racket) notFound();

  const { brand, model, year, price_brl, recommended_levels, scores, expert_summary_pt, atp_players, wta_players, image_url } = racket;
  const yearStr = year ? ` ${year}` : "";
  const hasProPlayers = atp_players.length > 0 || wta_players.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-text-muted mb-6 flex items-center gap-1.5">
        <Link href="/raquetes" className="hover:text-primary transition-colors">Raquetes</Link>
        <span>/</span>
        <span className="text-text-secondary font-medium">{brand} {model}</span>
      </nav>

      <div className="mb-8 flex flex-col sm:flex-row gap-6">
        {/* Racket image */}
        {image_url && (
          <div className="shrink-0 w-48 h-56 bg-white rounded-lg overflow-hidden flex items-center justify-center p-4">
            <img src={image_url} alt={`${brand} ${model}`} className="w-full h-full object-contain" />
          </div>
        )}
        <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">{brand}</p>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-text uppercase tracking-wide mb-3">{model}{yearStr}</h1>

        {recommended_levels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recommended_levels.map((level) => (
              <span key={level} className="bg-primary/10 text-accent text-xs font-semibold px-3 py-1 rounded border border-primary/20 capitalize">
                {level}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {price_brl !== null && (
            <p className="text-2xl font-bold text-text">
              R$ {price_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
          <AffiliateButton brand={brand} model={model} />
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-bg-elevated border border-surface rounded-lg p-6">
          <h2 className="text-lg font-bold text-text mb-4">Especificacoes</h2>
          <SpecsTable racket={racket} />
        </div>
        <div className="bg-bg-elevated border border-surface rounded-lg p-6">
          <h2 className="text-lg font-bold text-text mb-4">Performance</h2>
          <div className="flex flex-col gap-3">
            {SCORE_LABELS.map(({ key, label }) => (
              <ScoresBar key={key} label={label} value={scores[key]} />
            ))}
          </div>
        </div>
      </div>

      {expert_summary_pt && (
        <div className="bg-bg-elevated border border-surface rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-text mb-3">Analise dos Especialistas</h2>
          <p className="text-text-secondary leading-relaxed">{expert_summary_pt}</p>
        </div>
      )}

      {hasProPlayers && (
        <div className="bg-bg-elevated border border-surface rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-text mb-4">Jogadores Pro</h2>
          <div className="flex flex-col gap-4">
            {atp_players.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">ATP</p>
                <div className="flex flex-wrap gap-2">
                  {atp_players.map((player) => (
                    <span key={player} className="bg-bg-subtle text-text-secondary text-sm font-medium px-3 py-1 rounded border border-surface">{player}</span>
                  ))}
                </div>
              </div>
            )}
            {wta_players.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">WTA</p>
                <div className="flex flex-wrap gap-2">
                  {wta_players.map((player) => (
                    <span key={player} className="bg-bg-subtle text-text-secondary text-sm font-medium px-3 py-1 rounded border border-surface">{player}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-surface">
        <Link href={`/comparar?slugs=${slug}`} className="inline-flex items-center gap-2 border border-surface text-text-secondary font-semibold text-sm px-5 py-2.5 rounded hover:border-primary hover:text-primary transition-colors">
          Comparar com outra raquete
        </Link>
        <Link href="/quiz" className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors">
          Fazer o quiz
        </Link>
      </div>
    </div>
  );
}
