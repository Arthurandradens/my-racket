# My Racket — Design Spec

**Data:** 2026-04-07
**Objetivo:** Web app que ajuda jogadores de todos os niveis a encontrar a raquete de tenis ideal atraves de um quiz adaptativo, com monetizacao via links de afiliado.

---

## 1. Visao Geral

Plataforma web que guia o usuario por um quiz adaptativo baseado no seu perfil (nivel, estilo de jogo, fisico, lesoes, orcamento) e recomenda as melhores raquetes usando um sistema de pontuacao ponderada. Inclui comparador de raquetes e paginas individuais otimizadas para SEO.

**Publico-alvo:** Todos os niveis — de iniciantes comprando a primeira raquete a jogadores avancados fazendo upgrade. Foco especial em proteger iniciantes de escolhas ruins (raquete pesada demais, cabeca pequena, rigidez alta).

**Monetizacao:** Links de afiliado nas recomendacoes e paginas de raquete. Programas: Tennis Warehouse (internacional), lojas brasileiras (ProSpin, Emporio do Tenista — a confirmar). Fallback: link de busca no Google Shopping.

---

## 2. Stack Tecnica

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS
- **Dados:** JSON estatico no build (sem banco de dados na v1)
- **Deploy:** A definir (Vercel recomendado)
- **SEO:** SSG (Static Site Generation) para paginas de raquete

---

## 3. Fontes de Dados

### 3.1 Racqix API (specs tecnicas)
- **Endpoint:** `GET https://www.racqix.com/api/racquets?mode=minimal`
- **Dados:** 1.147 raquetes, 18 marcas
- **Campos:** slug, brand, model, year, weight, swingweight, ra (rigidez), balance_mm, head_size, string_pattern, summaries_expert_en, atp_players, wta_players
- **Acesso:** API aberta, requer citacao "Source: Racqix Tennis Racquet Dataset v2026.1"

### 3.2 Tennis Warehouse Reviews (scores de performance)
- **Fonte:** CSV extraido de planilha publica do TWU
- **Dados:** ~152 raquetes com reviews
- **Campos:** Overall, Groundstrokes, Volleys, Serves, Returns, Power, Control, Maneuverability, Stability, Comfort, Touch/Feel, Topspin, Slice, Price (USD)
- **Observacao:** Dados em duas escalas — raquetes com breakdown completo usam escala 0-100, raquetes com apenas nota geral usam escala ~1-10. O pipeline deve normalizar para escala unica (0-100) antes do merge.

### 3.3 Pipeline de merge
1. Script puxa dados da API Racqix
2. Script le o CSV do TWU
3. Match por similaridade de nome (fuzzy match) com revisao manual para casos ambiguos
4. Merge em um unico `rackets.json`
5. Conversao de precos USD → BRL (taxa fixa como placeholder, futuramente vem da plataforma de afiliado)
6. JSON importado no build do Next.js

**Resultado:** 1.147 raquetes do Racqix, ~100-120 enriquecidas com scores do TWU.

---

## 4. Modelo de Dados

```typescript
interface Racket {
  slug: string
  brand: string
  model: string
  year: string | null

  // Specs tecnicas (Racqix)
  weight: number | null       // gramas
  swingweight: number | null
  ra: number                  // rigidez
  balance_mm: number | null
  head_size: number           // sq inches
  string_pattern: string      // "16x19"

  // Performance (TWU)
  scores: {
    overall: number | null
    groundstrokes: number | null
    volleys: number | null
    serves: number | null
    returns: number | null
    power: number | null
    control: number | null
    maneuverability: number | null
    stability: number | null
    comfort: number | null
    touch_feel: number | null
    topspin: number | null
    slice: number | null
  }

  // Metadados
  price_brl: number | null
  expert_summary_pt: string | null
  atp_players: string[]
  wta_players: string[]
  recommended_levels: string[]  // ["iniciante", "intermediario"]
}
```

---

## 5. Quiz Adaptativo

### 5.1 Fluxo por nivel

**Pergunta inicial (todos):** Qual seu nivel de jogo?

**Iniciante:**
1. Frequencia de jogo
2. Porte fisico (altura/forca)
3. Tem alguma lesao? (cotovelo, ombro)
4. Orcamento

**Intermediario:**
1. Tempo de pratica
2. Estilo de jogo (baseline, serve&volley, all-court)
3. O que busca melhorar? (potencia, controle, spin)
4. Raquete atual (opcional — ajuda a calibrar)
5. Tem alguma lesao?
6. Orcamento

**Avancado:**
1. Estilo de jogo
2. Golpe principal (forehand, backhand, saque)
3. Preferencias tecnicas (peso, balance, rigidez)
4. Raquete atual
5. O que quer mudar na raquete atual?
6. Orcamento

### 5.2 Motor de recomendacao

**Abordagem:** Sistema de regras com pontuacao ponderada.

Cada resposta do quiz gera um "perfil ideal" — faixas de specs que a raquete ideal deveria ter. O sistema calcula um score de compatibilidade (0-100) entre o perfil ideal e cada raquete da base.

**Faixas default por nivel:**

| Spec | Iniciante | Intermediario | Avancado |
|------|-----------|---------------|----------|
| Peso (g) | 260-285 | 280-305 | 295-340 |
| Head size (sq in) | 100-110 | 98-105 | 95-100 |
| RA (rigidez) | < 66 | 62-70 | qualquer |
| Balance (mm) | > 325 (head heavy) | 315-330 | < 325 (head light) |

Essas faixas sao defaults ajustados pelas demais respostas. Exemplo: intermediario com lesao no cotovelo → RA desce para < 65 e peso sobe (mais estabilidade, menos vibracao).

**Pesos por spec variam por nivel:**
- Iniciante: head size e rigidez pesam mais
- Avancado: peso e balance pesam mais

**Nota:** As faixas e pesos serao calibrados pelo especialista (dono do projeto) antes do lancamento.

---

## 6. Paginas e Navegacao

### 6.1 Estrutura de rotas

| Rota | Descricao | Renderizacao |
|------|-----------|-------------|
| `/` | Landing page — proposta de valor + CTA "Encontrar minha raquete" | SSG |
| `/quiz` | Quiz adaptativo passo a passo | Client-side |
| `/resultado` | Top 3 + lista expandida | Client-side (pos-quiz) |
| `/comparar` | Comparador lado a lado (aceita query params) | Client-side |
| `/raquete/[slug]` | Pagina individual da raquete | SSG |
| `/raquetes` | Catalogo com busca e filtros (marca, nivel) | SSG + client-side filters |

### 6.2 Navegacao

- **Header fixo:** Logo + "Quiz" + "Raquetes" + "Comparar"
- **Footer:** Sobre, contato, disclaimer de afiliados
- **Mobile-first:** Quiz com uma pergunta por tela, botoes grandes

### 6.3 Fluxo principal

```
Landing → Quiz → Resultado → Compra (afiliado)
                     |
               Comparador ← Catalogo
                     |
              Pagina da raquete → Compra (afiliado)
```

---

## 7. Pagina de Resultado

Exibida apos o quiz. Conteudo:

**Top 3 raquetes recomendadas, cada uma com:**
- Nome + marca + foto (placeholder na v1)
- Score de compatibilidade (ex: "92% match")
- Specs principais (peso, head size, RA, balance, string pattern)
- Resumo curto de por que foi recomendada
- Scores de performance do TWU (quando disponiveis)
- Botao de compra com link de afiliado
- Botao "Adicionar ao comparador"

**Abaixo do top 3:**
- Lista expandivel com mais 5-7 raquetes compativeis
- Botao "Refazer quiz"

---

## 8. Comparador de Raquetes

- Usuario seleciona 2-3 raquetes para comparar lado a lado
- Pode adicionar raquetes vindas do resultado ou buscar por nome/marca
- Tabela comparativa com todas as specs e scores
- Melhor valor de cada spec destacado visualmente
- Selo "Seu match" na raquete que veio do resultado do quiz
- Botao de compra com link de afiliado em cada coluna
- URL compartilhavel (ex: `/comparar?r=pure-aero-2023,clash-100,speed-mp`)

---

## 9. Paginas Individuais de Raquete (SEO)

**URL:** `/raquete/[slug]`

**Conteudo:**
- Nome, marca, foto
- Todas as specs tecnicas
- Scores de performance (quando disponiveis)
- Resumo do expert (traduzido para PT-BR)
- Jogadores profissionais que usam (ATP/WTA)
- Preco em R$
- Botao de compra com link de afiliado
- Botao "Comparar com outra raquete"
- Indicacao de perfil: "Recomendada para: intermediarios que buscam spin"

**SEO:** Paginas geradas via SSG. Titulos otimizados (ex: "Babolat Pure Aero 2023 — Specs, Review e Preco").

---

## 10. Monetizacao

**Modelo:** Links de afiliado em todos os pontos de conversao.

**Pontos de conversao:**
- Pagina de resultado (botao de compra por raquete)
- Comparador (botao de compra por coluna)
- Pagina individual da raquete (botao de compra)
- Catalogo (link na listagem)

**Parceiros (v1):**
- Tennis Warehouse (programa de afiliados internacional)
- ProSpin / Emporio do Tenista (a confirmar — mercado brasileiro)
- Fallback: link de busca no Google Shopping

**Precos:** Exibidos em BRL. Na v1, conversao por taxa fixa. Futuramente, precos vindos diretamente da plataforma de afiliado.

---

## 11. Fora de Escopo (v1)

- Login / cadastro / perfil salvo
- App mobile nativo
- Banco de dados (usa JSON estatico)
- Precos em tempo real (usa conversao fixa)
- Filtros avancados no catalogo (apenas marca e nivel na v1)
- Reviews de usuarios
- Integracao direta com APIs de lojas para preco/estoque
