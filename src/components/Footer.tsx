import { RACQIX_ATTRIBUTION } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Site name & description */}
          <div className="max-w-sm">
            <p className="text-xl font-bold text-white mb-2">My Racket</p>
            <p className="text-sm leading-relaxed text-gray-400">
              Encontre a raquete de tenis ideal para o seu jogo com base no seu
              nivel, estilo de jogo e preferencias pessoais.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold text-white mb-1">Navegacao</p>
            <a
              href="/quiz"
              className="hover:text-green-400 transition-colors"
            >
              Quiz
            </a>
            <a
              href="/raquetes"
              className="hover:text-green-400 transition-colors"
            >
              Raquetes
            </a>
            <a
              href="/comparar"
              className="hover:text-green-400 transition-colors"
            >
              Comparar
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col gap-3 text-xs text-gray-500">
          {/* Affiliate disclaimer */}
          <p>
            <strong className="text-gray-400">Aviso de afiliados:</strong> Alguns
            links neste site sao links de afiliados. Isso significa que podemos
            receber uma comissao sem custo adicional para voce se voce fizer uma
            compra atraves desses links. Nossas recomendacoes sao sempre
            baseadas em analises imparciais.
          </p>

          {/* Attribution */}
          <p className="text-gray-600">{RACQIX_ATTRIBUTION}</p>

          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} My Racket. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
