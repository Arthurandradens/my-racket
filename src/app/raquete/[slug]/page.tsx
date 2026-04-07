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
  if (!racket) {
    return { title: "Raquete nao encontrada | My Racket" };
  }
  const yearStr = racket.year ? ` ${racket.year}` : "";
  return {
    title: `${racket.brand} ${racket.model}${yearStr} — Specs, Review e Preco | My Racket`,
    description:
      racket.expert_summary_pt ??
      `Confira as especificacoes, scores de performance e preco da ${racket.brand} ${racket.model}${yearStr}.`,
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

  if (!racket) {
    notFound();
  }

  const { brand, model, year, price_brl, recommended_levels, scores, expert_summary_pt, atp_players, wta_players } = racket;

  const yearStr = year ? ` ${year}` : "";
  const hasProPlayers = atp_players.length > 0 || wta_players.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
        <Link href="/raquetes" className="hover:text-green-600 transition-colors">
          Raquetes
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">
          {brand} {model}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-600 mb-1">
          {brand}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          {model}{yearStr}
        </h1>

        {recommended_levels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recommended_levels.map((level) => (
              <span
                key={level}
                className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200 capitalize"
              >
                {level}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {price_brl !== null && (
            <p className="text-2xl font-bold text-gray-900">
              R${" "}
              {price_brl.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
          <AffiliateButton brand={brand} model={model} />
        </div>
      </div>

      {/* Two-column grid: Specs + Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Specs table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Especificacoes</h2>
          <SpecsTable racket={racket} />
        </div>

        {/* Performance scores */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Performance</h2>
          <div className="flex flex-col gap-3">
            {SCORE_LABELS.map(({ key, label }) => (
              <ScoresBar key={key} label={label} value={scores[key]} />
            ))}
          </div>
        </div>
      </div>

      {/* Expert summary */}
      {expert_summary_pt && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Analise dos Especialistas</h2>
          <p className="text-gray-700 leading-relaxed">{expert_summary_pt}</p>
        </div>
      )}

      {/* Pro players */}
      {hasProPlayers && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Jogadores Pro</h2>
          <div className="flex flex-col gap-4">
            {atp_players.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">ATP</p>
                <div className="flex flex-wrap gap-2">
                  {atp_players.map((player) => (
                    <span
                      key={player}
                      className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full border border-blue-200"
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {wta_players.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">WTA</p>
                <div className="flex flex-wrap gap-2">
                  {wta_players.map((player) => (
                    <span
                      key={player}
                      className="bg-pink-50 text-pink-700 text-sm font-medium px-3 py-1 rounded-full border border-pink-200"
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom CTAs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
        <Link
          href={`/comparar?slugs=${slug}`}
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-lg hover:border-green-500 hover:text-green-600 transition-colors"
        >
          Comparar com outra raquete
        </Link>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          Fazer o quiz
        </Link>
      </div>
    </div>
  );
}
