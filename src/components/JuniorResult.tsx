import type { JuniorResult as JuniorResultType } from "@/lib/types";
import RacketCard from "./RacketCard";

interface JuniorResultProps {
  result: JuniorResultType;
}

const SIZE_LABELS: Record<string, string> = {
  "19": "19 polegadas (48cm)",
  "21": "21 polegadas (53cm)",
  "23": "23 polegadas (58cm)",
  "25": "25 polegadas (63cm)",
  "26": "26 polegadas (66cm)",
  "adulta_ul": "Adulta ultralight (transição)",
};

const TYPE_LABELS: Record<string, string> = {
  recreativa: "Recreativa",
  intermediate: "Intermediária",
  performance: "Performance",
};

const INVESTMENT_LABELS: Record<string, string> = {
  baixo: "Investimento baixo — foque em durabilidade e tamanho correto",
  medio: "Investimento moderado — vale considerar qualidade superior",
  alto: "Investimento justificado — raquete de performance faz diferença",
};

export default function JuniorResult({ result }: JuniorResultProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Profile summary */}
      <div
        className="bg-bg-elevated border border-surface rounded-lg p-6 sm:p-8"
        style={{ animation: "fadeInUp 0.6s ease-out" }}
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text uppercase tracking-wide mb-6">
          Resultado do quiz infantil
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileItem label="Tamanho da raquete" value={SIZE_LABELS[result.racketSize] ?? result.racketSize} highlight />
          <ProfileItem label="Tipo" value={TYPE_LABELS[result.racketType] ?? result.racketType} />
          <ProfileItem label="Material recomendado" value={result.material} />
          <ProfileItem label="Estágio de bola" value={result.ballStage} />
          <ProfileItem label="Quadra" value={result.court} />
          <ProfileItem label="Investimento" value={INVESTMENT_LABELS[result.investmentLevel] ?? result.investmentLevel} />
        </div>

        <div className="mt-4 pt-4 border-t border-surface">
          <p className="text-sm text-text-muted">
            Previsão de troca: <span className="text-text-secondary font-medium">{result.trocaPrevisao}</span> — reavalie conforme o crescimento
          </p>
        </div>
      </div>

      {/* Alerts */}
      {result.lesaoAlert && (
        <div
          className="rounded-lg p-5 flex flex-col gap-3 bg-danger/10 border-2 border-danger/30"
          style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
        >
          <h2 className="text-lg font-bold text-danger flex items-center gap-2">
            {result.lesaoAlert.title}
          </h2>
          <p className="text-sm text-danger/80 leading-relaxed">
            {result.lesaoAlert.message}
          </p>
        </div>
      )}

      {result.transicaoAlert && (
        <div
          className="rounded-lg p-5 flex flex-col gap-3 bg-accent/10 border border-accent/20"
          style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
        >
          <h2 className="text-lg font-bold text-accent flex items-center gap-2">
            {result.transicaoAlert.title}
          </h2>
          <p className="text-sm text-accent/80 leading-relaxed">
            {result.transicaoAlert.message}
          </p>
        </div>
      )}

      {/* Racket recommendations */}
      {result.rackets.length > 0 && (
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-text uppercase tracking-wide mb-6 text-center">
            Raquetes recomendadas
          </h2>
          <div className="flex flex-col gap-6">
            {result.rackets.map((racket, i) => (
              <div
                key={racket.slug}
                style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}
              >
                <RacketCard racket={racket} />
              </div>
            ))}
          </div>
        </div>
      )}

      {result.rackets.length === 0 && (
        <div className="bg-bg-elevated border border-surface rounded-lg p-6 text-center">
          <p className="text-text-secondary">
            Ainda não temos raquetes de {SIZE_LABELS[result.racketSize] ?? result.racketSize} no nosso banco de dados.
            O guia abaixo vai te ajudar a escolher a raquete certa.
          </p>
        </div>
      )}

      {/* Education blocks */}
      {result.educationBlocks.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-text uppercase tracking-wide text-center">
            Guia para pais
          </h2>
          {result.educationBlocks.map((block, i) => (
            <div
              key={block.id}
              className="bg-bg-elevated border border-surface rounded-lg p-5"
              style={{ animation: `fadeInUp 0.5s ease-out ${0.3 + i * 0.05}s both` }}
            >
              <h3 className="text-sm font-bold text-accent mb-3">
                {block.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {block.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-accent text-lg" : "text-text-secondary"}`}>
        {value}
      </span>
    </div>
  );
}
