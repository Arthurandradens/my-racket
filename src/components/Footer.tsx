import { RACQIX_ATTRIBUTION } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-text-secondary mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-sm">
            <p className="font-display text-xl font-bold text-accent uppercase tracking-wider mb-2">
              My Racket
            </p>
            <p className="text-sm leading-relaxed text-text-muted">
              Encontre a raquete de tenis ideal para o seu jogo com base no seu
              nivel, estilo de jogo e preferencias pessoais.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold text-text mb-1">Navegacao</p>
            <a href="/quiz" className="hover:text-primary transition-colors">Quiz</a>
            <a href="/raquetes" className="hover:text-primary transition-colors">Raquetes</a>
            <a href="/comparar" className="hover:text-primary transition-colors">Comparar</a>
          </div>
        </div>

        <div className="border-t border-surface mt-8 pt-6 flex flex-col gap-3 text-xs text-text-muted">
          <p>
            <strong className="text-text-secondary">Aviso de afiliados:</strong> Alguns
            links neste site sao links de afiliados. Isso significa que podemos
            receber uma comissao sem custo adicional para voce se voce fizer uma
            compra atraves desses links. Nossas recomendacoes sao sempre
            baseadas em analises imparciais.
          </p>
          <p>{RACQIX_ATTRIBUTION}</p>
          <p>
            &copy; {new Date().getFullYear()} My Racket. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
