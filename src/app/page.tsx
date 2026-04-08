import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-bg overflow-hidden px-4 min-h-[calc(100vh-4rem)] flex items-center">
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
          <ScrollReveal>
            <p className="font-display text-xs sm:text-sm uppercase tracking-[4px] text-accent mb-4">
              My Racket
            </p>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase leading-tight mb-6 text-text">
              Encontre sua{" "}
              <span className="text-primary">raquete ideal</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="text-base sm:text-lg text-text-secondary mb-10 max-w-xl leading-relaxed">
              Algoritmo inteligente que analisa seu estilo de jogo e encontra o
              match perfeito entre mais de 1.000 raquetes avaliadas.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={450}>
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
                Ver Catálogo
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Como funciona */}
      <section className="px-4 bg-bg-elevated min-h-screen flex items-center py-16 sm:py-20">
        <div className="max-w-5xl mx-auto w-full">
          <ScrollReveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-text uppercase tracking-wide mb-12 sm:mb-14">
              Como funciona
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                num: "01",
                title: "Quiz",
                desc: "Responda perguntas rápidas sobre seu nível, frequência de jogo, estilo e preferências.",
              },
              {
                num: "02",
                title: "Analise",
                desc: "Nosso algoritmo analisa mais de 1.000 raquetes e calcula compatibilidade com seu perfil.",
              },
              {
                num: "03",
                title: "Compare",
                desc: "Compare as raquetes sugeridas lado a lado por specs, scores e preço.",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 200}>
                <div className="bg-bg border border-surface rounded-lg p-6 flex flex-col gap-4 h-full">
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="px-4 bg-bg relative min-h-screen flex items-center py-12 sm:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center w-full">
          {[
            { value: "1000+", label: "Raquetes avaliadas" },
            { value: "6", label: "Métricas de análise" },
            { value: "3", label: "Níveis de jogador" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 200}>
              <p className="font-display text-4xl sm:text-5xl font-bold text-accent">
                {stat.value}
              </p>
              <p className="text-text-muted text-sm mt-2 uppercase tracking-wide">
                {stat.label}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative px-4 bg-bg-elevated overflow-hidden min-h-screen flex items-center py-16 sm:py-20">
        <div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text uppercase tracking-wide mb-4">
              Pronto para encontrar sua raquete?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="text-text-secondary mb-10 text-base sm:text-lg">
              Leva menos de 2 minutos. Comece agora.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
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
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
