import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Encontre a raquete perfeita para o seu jogo
          </h1>
          <p className="text-lg sm:text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Mais de 1000 raquetes avaliadas. Responda algumas perguntas e
            receba recomendacoes personalizadas para o seu nivel e estilo de
            jogo.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-green-700 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-green-50 transition-colors"
          >
            Encontrar minha raquete
          </Link>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Quiz
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Responda perguntas rapidas sobre seu nivel, frequencia de jogo,
                estilo e preferencias fisicas.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Recomendacoes
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Nosso algoritmo analisa mais de 1000 raquetes e apresenta as
                opcoes mais adequadas para voce.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Compare
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Compare as raquetes sugeridas lado a lado por especificacoes,
                scores e preco para tomar a melhor decisao.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para encontrar sua raquete ideal?
          </h2>
          <p className="text-gray-500 mb-10 text-lg">
            Leva menos de 2 minutos. Comece agora.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="inline-block bg-green-600 text-white font-semibold text-base px-8 py-3 rounded-full hover:bg-green-700 transition-colors shadow"
            >
              Fazer o quiz
            </Link>
            <Link
              href="/raquetes"
              className="inline-block border border-gray-300 text-gray-700 font-semibold text-base px-8 py-3 rounded-full hover:border-green-500 hover:text-green-600 transition-colors"
            >
              Ver todas as raquetes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
