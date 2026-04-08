# Pro Spin Affiliate Integration

## Objetivo

Substituir os links genéricos do Google Shopping por links reais de produtos da Pro Spin com cupom de afiliado `NUNES` (`?coupon_code=NUNES`). Raquetes sem correspondência na Pro Spin mantêm o fallback atual (Google Shopping).

## Decisoes de Design

- **Scraping manual sob demanda** (opção B) — script gera JSON bruto, matching feito com assistência de IA, mapeamento commitado no repo
- **Fallback Google Shopping** (opção A) — raquetes sem link Pro Spin continuam com o comportamento atual
- **Desempate no quiz** (opção A) — score do engine inalterado, link Pro Spin usado apenas como critério de desempate entre scores iguais
- **Priorização no catálogo** — ordenação explícita: link Pro Spin primeiro, depois por ano mais recente

---

## 1. Script de Extração — `scripts/scrape-prospin.ts`

Script Node.js (TypeScript) executável via `npx tsx scripts/scrape-prospin.ts`.

### Comportamento

1. Faz `fetch` de `https://www.prospin.com.br/raquetes/tenis` (e páginas subsequentes)
2. Detecta paginação no HTML e itera até a última página
3. Para cada produto na listagem, extrai:
   - `name`: texto do atributo `alt` ou `title` da imagem do produto
   - `url`: href do link do produto
   - `image`: src da imagem
4. Salva resultado em `data/prospin-raw.json`

### Formato de saída (`data/prospin-raw.json`)

```json
[
  {
    "name": "Raquete De Tênis Babolat Pure Strike Lite 100 Gen4 16x19 265g",
    "url": "https://www.prospin.com.br/raquete-de-tenis-babolat-pure-strike-lite-100-gen4-16x19-265g-102528-323",
    "image": "https://static.prospin.com.br/media/catalog/product/..."
  }
]
```

### Paginação

A URL paginada segue o padrão `?p=2`, `?p=3`, etc. O script deve:
- Buscar a primeira página
- Detectar o número total de páginas (via links de paginação no HTML)
- Iterar sequencialmente com delay de 1s entre requests para não sobrecarregar o servidor

### Dependências

Nenhuma dependência externa. Usa `fetch` nativo do Node.js e regex/string parsing para extrair dados do HTML.

---

## 2. Matching Assistido por IA (Workflow Manual)

Não é código — é um processo interativo:

1. Usuário roda `npx tsx scripts/scrape-prospin.ts`
2. Usuário compartilha `data/prospin-raw.json` com a IA na conversa
3. IA compara os nomes dos produtos Pro Spin com os slugs/modelos de `src/data/rackets.json`
4. IA gera o mapeamento e salva em `src/data/prospin-links.json`

### Critérios de matching

- Normalizar acentos, caixa, e variações de nome (ex: "Gen4" vs "Gen 4")
- Considerar brand + model como chave principal
- Ignorar sufixos de SKU e informações redundantes (peso, padrão de cordas) que já estão nos dados
- Em caso de ambiguidade, preferir match exato de ano e specs

---

## 3. Arquivo de Mapeamento — `src/data/prospin-links.json`

```json
{
  "babolat-pure-aero-2023": "https://www.prospin.com.br/raquete-de-tenis-babolat-pure-aero-101479-0370",
  "wilson-blade-98-v9": "https://www.prospin.com.br/raquete-de-tenis-wilson-blade-98-v9-16x19-305g-wr150111u"
}
```

- Chave: slug da raquete (mesmo de `rackets.json`)
- Valor: URL completa do produto na Pro Spin (sem query params — o cupom é adicionado em runtime)
- Commitado no repositório, versionado no git

---

## 4. Atualização de `src/lib/affiliate.ts`

### Interface atualizada

```typescript
import prospinLinks from "@/data/prospin-links.json";

const COUPON_CODE = "NUNES";

export function generateAffiliateLink(slug: string, brand: string, model: string): string {
  const prospinUrl = prospinLinks[slug as keyof typeof prospinLinks];
  if (prospinUrl) {
    return `${prospinUrl}?coupon_code=${COUPON_CODE}`;
  }
  // Fallback: Google Shopping
  const query = encodeURIComponent(`${brand} ${model} raquete tênis`).replace(/%20/g, "+");
  return `https://www.google.com/search?q=${query}&tbm=shop`;
}

export function hasProspinLink(slug: string): boolean {
  return slug in prospinLinks;
}
```

### Mudanças na assinatura

- Adiciona parâmetro `slug` (primeiro argumento)
- `hasProspinLink` exportada separadamente para uso em ordenação e UI

### Chamadores a atualizar

- `src/components/AffiliateButton.tsx` — adicionar prop `slug`
- `src/components/RacketCard.tsx` — passar `slug` ao AffiliateButton
- `src/components/CompareTable.tsx` — passar `slug`
- `src/app/raquetes/page.tsx` — passar `slug` no CatalogCard
- `src/app/raquete/[slug]/page.tsx` — passar `slug`

---

## 5. Ordenação do Catálogo (`/raquetes`)

### Lógica de sort

```typescript
rackets.sort((a, b) => {
  // 1. Raquetes com link Pro Spin primeiro
  const aHasLink = hasProspinLink(a.slug) ? 1 : 0;
  const bHasLink = hasProspinLink(b.slug) ? 1 : 0;
  if (bHasLink !== aHasLink) return bHasLink - aHasLink;

  // 2. Ano mais recente primeiro
  const aYear = a.year ? parseInt(a.year) : 0;
  const bYear = b.year ? parseInt(b.year) : 0;
  if (bYear !== aYear) return bYear - aYear;

  // 3. Ordem original
  return 0;
});
```

Aplicada antes do filtro de busca/marca e do `MAX_DISPLAY`.

---

## 6. Desempate nas Recomendações do Quiz

No `src/lib/engine.ts`, após o cálculo de score, no momento do sort final:

- Score do engine continua sendo o critério primário
- Entre raquetes com mesmo score (inteiro), as que têm link Pro Spin aparecem primeiro

Nenhuma mudança no cálculo de score em si.

---

## 7. Indicador Visual

### Badge "Disponível na loja"

- Exibido no `AffiliateButton` ou próximo a ele quando `hasProspinLink(slug)` é true
- Visual discreto: texto pequeno ou ícone de loja ao lado do botão "Comprar"
- Não altera o layout — apenas adiciona informação

### Diferenciação do botão

- Com link Pro Spin: botão mostra "Comprar na Pro Spin" (ou similar)
- Sem link Pro Spin: botão mostra "Buscar nas lojas" (texto atual "Comprar" pode ser ajustado)

---

## 8. Arquivos Impactados

| Arquivo | Mudança |
|---------|---------|
| `scripts/scrape-prospin.ts` | **Novo** — script de extração |
| `data/prospin-raw.json` | **Novo** — dados brutos do scraping (gitignored) |
| `src/data/prospin-links.json` | **Novo** — mapeamento slug → URL |
| `src/lib/affiliate.ts` | Atualizar para consultar mapeamento + cupom |
| `src/lib/affiliate.test.ts` | Atualizar testes |
| `src/components/AffiliateButton.tsx` | Adicionar prop `slug`, ajustar texto |
| `src/components/RacketCard.tsx` | Passar `slug` |
| `src/components/CompareTable.tsx` | Passar `slug` |
| `src/app/raquetes/page.tsx` | Ordenação + passar `slug` |
| `src/app/raquete/[slug]/page.tsx` | Passar `slug` |
| `src/lib/engine.ts` | Desempate por link Pro Spin |

---

## 9. Fora de Escopo

- Scraping automatizado em CI/CD
- Cache ou API route para dados da Pro Spin
- Tracking de cliques em links de afiliado
- Integração com outras lojas (Empório do Tenista, etc.)
