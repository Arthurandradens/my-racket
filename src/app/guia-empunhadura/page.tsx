"use client";

import { useState } from "react";

const GRIP_TABLE = [
  { size: "L0", us: '4"', circumference: "101.6 mm", range: [0, 102], label: "Júnior" },
  { size: "L1", us: '4 1/8"', circumference: "104.8 mm", range: [102, 105], label: "Adulto pequeno / Júnior" },
  { size: "L2", us: '4 1/4"', circumference: "108.0 mm", range: [105, 108], label: "Mais comum entre mulheres" },
  { size: "L3", us: '4 3/8"', circumference: "111.1 mm", range: [108, 111], label: "Mais comum entre homens" },
  { size: "L4", us: '4 1/2"', circumference: "114.3 mm", range: [111, 114], label: "Mãos grandes" },
  { size: "L5", us: '4 5/8"', circumference: "117.5 mm", range: [114, 999], label: "Mãos muito grandes" },
];

function getGripResult(mm: number) {
  const exact = GRIP_TABLE.find((g) => mm >= g.range[0] && mm < g.range[1]);
  if (exact) return { primary: exact, secondary: null };

  if (mm < GRIP_TABLE[0].range[0]) return { primary: GRIP_TABLE[0], secondary: null };
  return { primary: GRIP_TABLE[GRIP_TABLE.length - 1], secondary: null };
}

function getBorderline(mm: number) {
  for (let i = 0; i < GRIP_TABLE.length - 1; i++) {
    const upper = GRIP_TABLE[i].range[1];
    if (mm >= upper - 1 && mm <= upper + 1) {
      return { lower: GRIP_TABLE[i], upper: GRIP_TABLE[i + 1] };
    }
  }
  return null;
}

export default function GuiaEmpunhaduraPage() {
  const [measurement, setMeasurement] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getGripResult> | null>(null);
  const [borderline, setBorderline] = useState<ReturnType<typeof getBorderline>>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const mm = parseFloat(measurement);
    if (isNaN(mm) || mm <= 0) return;
    setResult(getGripResult(mm));
    setBorderline(getBorderline(mm));
  }

  return (
    <main className="min-h-screen bg-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-4">
            Guia de <span className="text-primary">Empunhadura</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Descubra o tamanho ideal de grip para a sua raquete. Uma empunhadura correta melhora o conforto, o controle e previne lesões.
          </p>
        </div>

        {/* Método de Medição */}
        <section className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wide mb-8 text-center">
            Como Medir
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Método da Régua */}
            <div className="bg-bg-elevated border border-surface rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-lg">
                  1
                </div>
                <h3 className="font-display text-xl font-semibold uppercase">Método da Régua</h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                O método mais preciso para determinar seu tamanho de grip.
              </p>
              <ol className="space-y-3 text-sm text-text-secondary">
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">1.</span>
                  <span>Abra sua mão dominante com os dedos estendidos e juntos</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">2.</span>
                  <span>Posicione uma régua na <strong className="text-text">prega lateral inferior da palma</strong> (entre a base da palma e o pulso)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">3.</span>
                  <span>Meça até a <strong className="text-text">ponta do dedo anelar</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">4.</span>
                  <span>Anote o valor em <strong className="text-text">milímetros</strong> e use a calculadora abaixo</span>
                </li>
              </ol>
            </div>

            {/* Método do Dedo */}
            <div className="bg-bg-elevated border border-surface rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display font-bold text-lg">
                  2
                </div>
                <h3 className="font-display text-xl font-semibold uppercase">Teste do Dedo</h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                Para verificar se uma raquete que você já tem está com o grip certo.
              </p>
              <ol className="space-y-3 text-sm text-text-secondary">
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">1.</span>
                  <span>Segure a raquete com grip <strong className="text-text">Eastern de forehand</strong> (palma apoiada na face plana do cabo)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">2.</span>
                  <span>Com a outra mão, tente encaixar o <strong className="text-text">dedo indicador</strong> no espaço entre os dedos e a base da palma</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">3.</span>
                  <span><strong className="text-success">Encaixou justo</strong> = tamanho correto</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">4.</span>
                  <span><strong className="text-danger">Não coube</strong> = grip pequeno demais &middot; <strong className="text-danger">Sobrou espaço</strong> = grip grande demais</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Calculadora */}
        <section className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wide mb-8 text-center">
            Calculadora de Grip
          </h2>

          <div className="bg-bg-elevated border border-surface rounded-lg p-6 sm:p-8 max-w-lg mx-auto">
            <form onSubmit={handleCalculate} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label htmlFor="measurement" className="block text-sm font-medium text-text-secondary mb-2">
                  Medida da sua mão (mm)
                </label>
                <input
                  id="measurement"
                  type="number"
                  min="80"
                  max="140"
                  step="0.5"
                  value={measurement}
                  onChange={(e) => setMeasurement(e.target.value)}
                  placeholder="Ex: 110"
                  className="w-full bg-bg border border-surface rounded-lg px-4 py-3 text-text text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-text-muted"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-bg font-display font-semibold uppercase tracking-wider px-8 py-3 rounded-lg transition-colors text-sm"
              >
                Calcular
              </button>
            </form>

            {result?.primary && (
              <div className="mt-8 text-center" style={{ animation: "fadeInUp 0.4s ease-out" }}>
                <p className="text-text-secondary text-sm mb-2">Tamanho recomendado</p>
                <div className="inline-flex items-baseline gap-3 bg-primary/10 border border-primary/30 rounded-xl px-8 py-4">
                  <span className="font-display text-5xl font-bold text-primary">
                    {result.primary.size}
                  </span>
                  <span className="text-text-secondary text-lg">
                    ({result.primary.us})
                  </span>
                </div>
                <p className="mt-3 text-text-secondary text-sm">
                  Circunferência: {result.primary.circumference} &middot; {result.primary.label}
                </p>

                {borderline && (
                  <div className="mt-4 bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-text-secondary">
                    <p className="text-accent font-semibold mb-1">Você está entre dois tamanhos</p>
                    <p>
                      Sua medida fica entre <strong className="text-text">{borderline.lower.size}</strong> e{" "}
                      <strong className="text-text">{borderline.upper.size}</strong>.
                      Recomendamos escolher o <strong className="text-text">menor ({borderline.lower.size})</strong> e
                      adicionar um overgrip para ajuste fino.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Tabela Completa */}
        <section className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wide mb-8 text-center">
            Tabela de Tamanhos
          </h2>

          <div className="bg-bg-elevated border border-surface rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface">
                  <th className="text-left px-4 py-3 font-display font-semibold uppercase text-text-secondary text-xs tracking-wider">Tamanho</th>
                  <th className="text-left px-4 py-3 font-display font-semibold uppercase text-text-secondary text-xs tracking-wider">US</th>
                  <th className="text-left px-4 py-3 font-display font-semibold uppercase text-text-secondary text-xs tracking-wider">Circunferência</th>
                  <th className="text-left px-4 py-3 font-display font-semibold uppercase text-text-secondary text-xs tracking-wider">Medida da Mão</th>
                  <th className="text-left px-4 py-3 font-display font-semibold uppercase text-text-secondary text-xs tracking-wider hidden sm:table-cell">Perfil</th>
                </tr>
              </thead>
              <tbody>
                {GRIP_TABLE.map((grip, i) => (
                  <tr
                    key={grip.size}
                    className={`border-b border-surface/50 ${
                      result?.primary.size === grip.size ? "bg-primary/10" : ""
                    } ${i % 2 === 0 ? "bg-bg-subtle/30" : ""}`}
                  >
                    <td className="px-4 py-3 font-display font-bold text-primary text-base">{grip.size}</td>
                    <td className="px-4 py-3 text-text">{grip.us}</td>
                    <td className="px-4 py-3 text-text">{grip.circumference}</td>
                    <td className="px-4 py-3 text-text">
                      {grip.range[0] === 0
                        ? `até ${grip.range[1]} mm`
                        : grip.range[1] === 999
                        ? `${grip.range[0]}+ mm`
                        : `${grip.range[0]} – ${grip.range[1]} mm`}
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{grip.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dicas */}
        <section className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wide mb-8 text-center">
            Dicas Importantes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-bg-elevated border border-surface rounded-lg p-5">
              <h4 className="font-display font-semibold uppercase text-sm mb-2 text-primary">Entre dois tamanhos?</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Sempre escolha o menor. É fácil aumentar o grip com um overgrip, mas impossível diminuí-lo.
              </p>
            </div>
            <div className="bg-bg-elevated border border-surface rounded-lg p-5">
              <h4 className="font-display font-semibold uppercase text-sm mb-2 text-primary">Overgrip</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Cada overgrip adiciona ~1,5 mm à circunferência. Não empilhe mais de 2 — você perde o formato octogonal do cabo.
              </p>
            </div>
            <div className="bg-bg-elevated border border-surface rounded-lg p-5">
              <h4 className="font-display font-semibold uppercase text-sm mb-2 text-primary">Grip grande demais</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Dificulta a rotação do pulso, reduz o spin e pode causar dor no cotovelo (tennis elbow).
              </p>
            </div>
            <div className="bg-bg-elevated border border-surface rounded-lg p-5">
              <h4 className="font-display font-semibold uppercase text-sm mb-2 text-primary">Grip pequeno demais</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Faz você apertar demais a raquete para compensar, causando fadiga e tensão no antebraço.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
