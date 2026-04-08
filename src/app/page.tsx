import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-bg overflow-hidden py-20 sm:py-28 px-4">
        {/* Diagonal decorative elements */}
        <div
          className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-bl from-primary to-accent opacity-80"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-tr from-primary to-primary-hover opacity-50"
          style={{ clipPath: "polygon(0 100%, 0 0, 100% 100%)" }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-display text-xs sm:text-sm uppercase tracking-[4px] text-accent mb-4">
            My Racket
          </p>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase leading-tight mb-6 text-text">
            Encontre sua{" "}
            <span className="text-primary">raquete ideal</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary mb-10 max-w-xl leading-relaxed">
            Algoritmo inteligente que analisa seu estilo de jogo e encontra o
            match perfeito entre mais de 1.000 raquetes avaliadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/quiz"
              className="inline-block bg-primary text-white font-bold text-sm sm:text-base px-8 py-4 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors text-center"
            >
              Fazer Quiz
            </Link>
            <Link
              href="/raquetes"
              className="inline-block border border-surface text-text-secondary font-semibold text-sm sm:text-base px-8 py-4 rounded hover:border-primary hover:text-primary transition-colors text-center"
            >
              Ver Catalogo
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 sm:py-20 px-4 bg-bg-elevated">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-text uppercase tracking-wide mb-12 sm:mb-14">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                num: "01",
                title: "Quiz",
                desc: "Responda perguntas rapidas sobre seu nivel, frequencia de jogo, estilo e preferencias.",
              },
              {
                num: "02",
                title: "Analise",
                desc: "Nosso algoritmo analisa mais de 1.000 raquetes e calcula compatibilidade com seu perfil.",
              },
              {
                num: "03",
                title: "Compare",
                desc: "Compare as raquetes sugeridas lado a lado por specs, scores e preco.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-bg border border-surface rounded-lg p-6 flex flex-col gap-4"
              >
                <span className="font-display text-3xl font-bold text-accent">
                  {step.num}
                </span>
                <h3 className="font-display text-lg font-semibold text-text uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 sm:py-16 px-4 bg-bg relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {[
            { value: "1000+", label: "Raquetes avaliadas" },
            { value: "6", label: "Metricas de analise" },
            { value: "3", label: "Niveis de jogador" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl sm:text-5xl font-bold text-accent">
                {stat.value}
              </p>
              <p className="text-text-muted text-sm mt-2 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-16 sm:py-20 px-4 bg-bg-elevated overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-text uppercase tracking-wide mb-4">
            Pronto para encontrar sua raquete?
          </h2>
          <p className="text-text-secondary mb-10 text-base sm:text-lg">
            Leva menos de 2 minutos. Comece agora.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="inline-block bg-primary text-white font-bold text-sm sm:text-base px-8 py-4 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
            >
              Fazer o quiz
            </Link>
            <Link
              href="/raquetes"
              className="inline-block border border-surface text-text-secondary font-semibold text-sm sm:text-base px-8 py-4 rounded hover:border-primary hover:text-primary transition-colors"
            >
              Ver todas as raquetes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
