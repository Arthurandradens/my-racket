# Quiz Infantil — Spec de Implementacao

## Objetivo

Adicionar uma trilha de quiz para pais que buscam a raquete certa para o filho. Integrada ao quiz existente como nova opcao de nivel (`level: "junior"`), reutilizando a mesma arquitetura de perguntas e resultado.

## Decisoes de Design

- **Integrada ao quiz existente** — nova opcao "Para o meu filho(a)" no seletor de nivel, nao uma pagina separada
- **Engine separado** — logica deterministica em `junior-engine.ts`, nao usa scoring do `engine.ts` adulto
- **Resultado na mesma rota** — `/resultado` com branch condicional por `level === "junior"`
- **Raquetes do banco** — filtra `rackets.json` por slugs junior (jr/junior), sem entries manuais
- **Guia educativo sempre presente** — blocos condicionais baseados nas respostas

---

## 1. Filosofia

O quiz adulto parte de estilo de jogo e preferencias. O quiz infantil parte de dados fisicos objetivos — **altura e idade** — porque para criancas o tamanho correto da raquete NAO e opcional: e a variavel mais importante, com impacto direto em lesoes, tecnica e motivacao.

| Aspecto | Quiz Adulto | Quiz Infantil |
|---|---|---|
| Pergunta mais importante | Estilo de jogo | Altura da crianca |
| Logica primaria | Performance + preferencia | Seguranca + desenvolvimento |
| Quem responde | O proprio jogador | O pai/responsavel |
| Tom | Tecnico e direto | Parental, didatico, tranquilizador |
| Objetivo do resultado | Spec de performance | Tamanho correto + o que esperar |

### Principios inviolaveis

- Nunca recomendar "comprar grande para durar mais"
- Altura tem precedencia sobre idade
- Nunca recomendar raquete adulta para crianca abaixo de 150cm
- Nunca recomendar polyester para qualquer crianca
- Queixas fisicas sempre geram alerta em destaque

---

## 2. Tabela Mestra

Tabela central da logica. Integrada diretamente ao codigo.

| Altura | Tamanho | Faixa etaria tipica | Estagio de bola | Quadra |
|---|---|---|---|---|
| Abaixo de 110cm | 19" | 3-5 anos | Vermelha (espuma/Stage 3) | Mini quadra (11m) |
| 110-120cm | 21" | 5-6 anos | Vermelha (Stage 3) | Mini quadra (11m) |
| 120-130cm | 23" | 7-8 anos | Vermelha / comecando laranja | Quadra reduzida (18m) |
| 130-140cm | 23"-25" | 8-10 anos | Laranja (Stage 2) | Quadra 60 pes (18m) |
| 140-150cm | 25" | 9-11 anos | Laranja -> verde | Quadra 60-78 pes |
| 150-157cm | 26" | 11-13 anos | Verde (Stage 1) | Quadra adulta (78 pes) |
| Acima de 157cm | 26" ou adulta UL | 12-14 anos | Amarela adulta | Quadra adulta |

---

## 3. Entrada no Quiz

Nova opcao na pergunta de nivel em `quiz-config.ts`:

```typescript
{
  value: "junior",
  label: "Para o meu filho(a) — Busco a raquete certa para uma crianca ou adolescente"
}
```

Ao selecionar `"junior"`, o quiz desvia para `JUNIOR_QUESTIONS` (5 perguntas).

---

## 4. Perguntas

### Pergunta 1 — Altura da Crianca

```typescript
{
  id: "altura",
  text: "Qual e a altura aproximada do seu filho(a)?",
  context: "A altura e o fator mais importante para escolher a raquete certa — mais importante ate que a idade. Raquetes muito grandes causam vicios tecnicos e podem lesionar o pulso e o cotovelo. Raquetes muito pequenas limitam o desenvolvimento. A medida certa transforma o aprendizado.",
  options: [
    { value: "abaixo_110", label: "Abaixo de 110cm" },
    { value: "110_120", label: "110-120cm" },
    { value: "120_130", label: "120-130cm" },
    { value: "130_140", label: "130-140cm" },
    { value: "140_150", label: "140-150cm" },
    { value: "150_157", label: "150-157cm" },
    { value: "acima_157", label: "Acima de 157cm" },
  ]
}
```

### Pergunta 2 — Idade da Crianca

```typescript
{
  id: "idade",
  text: "Quantos anos tem seu filho(a)?",
  context: "A idade ajuda a contextualizar o estagio de desenvolvimento motor e o tipo de jogo esperado. Criancas altas para a idade podem usar raquetes maiores — mas o resultado sempre prioriza a altura que voce informou antes.",
  options: [
    { value: "3_4", label: "3-4 anos" },
    { value: "5_6", label: "5-6 anos" },
    { value: "7_8", label: "7-8 anos" },
    { value: "9_10", label: "9-10 anos" },
    { value: "11_12", label: "11-12 anos" },
    { value: "13_mais", label: "13 anos ou mais" },
  ]
}
```

### Pergunta 3 — Nivel e Frequencia

```typescript
{
  id: "nivel_junior",
  text: "Como voce descreveria o envolvimento do seu filho(a) com o tenis?",
  context: "Isso define o tipo de raquete — e o quanto vale investir. Um iniciante que joga 1x por semana precisa de algo diferente de quem treina 4x e participa de torneios.",
  options: [
    { value: "primeiro_contato", label: "Experimentando pela primeira vez — nunca jogou" },
    { value: "recreativo", label: "Aulas recreativas — 1-2x por semana" },
    { value: "regular", label: "Joga regularmente — 3-4x por semana, escolinhas" },
    { value: "competitivo", label: "Jogador competitivo — treina diariamente ou participa de torneios" },
  ]
}
```

### Pergunta 4 — Queixas Fisicas

```typescript
{
  id: "queixa",
  text: "Seu filho(a) ja reclamou de alguma dor ou desconforto jogando tenis?",
  context: "Criancas raramente verbalizam dores ate ficarem serias. Dores no pulso, cotovelo ou ombro apos jogar podem ser sinais de que a raquete esta grande demais, pesada demais, ou que o encordoamento esta errado.",
  options: [
    { value: "sem_queixa", label: "Nao, nunca reclamou de dor" },
    { value: "queixa_braco", label: "As vezes reclama do pulso ou cotovelo depois de jogar" },
    { value: "fadiga_braco", label: "Reclama que a raquete e dificil de mover — fica com o braco cansado" },
    { value: "sem_historico", label: "Nunca jogou o suficiente para avaliar" },
  ]
}
```

### Pergunta 5 — Objetivo dos Pais

```typescript
{
  id: "objetivo_junior",
  text: "Qual e o principal objetivo de voces com o tenis agora?",
  context: "Isso afeta o quanto vale investir e qual aspecto priorizar na recomendacao.",
  options: [
    { value: "experimentar", label: "Experimentar o esporte, ver se curte — sem compromisso" },
    { value: "saude_diversao", label: "Atividade saudavel, diversao e exercicio" },
    { value: "tecnica_futuro", label: "Aprender bem a tecnica — possibilidade de competir no futuro" },
    { value: "competicao", label: "Levar o tenis a serio — treinos regulares e competicoes" },
  ]
}
```

---

## 5. Engine de Recomendacao — `src/lib/junior-engine.ts`

Modulo separado do `engine.ts`. Logica deterministica, sem scoring.

### 5.1 Tamanho da raquete

```typescript
function getRacketSize(altura: string, nivel: string): string {
  switch (altura) {
    case "abaixo_110": return "19";
    case "110_120":    return "21";
    case "120_130":    return "23";
    case "130_140":    return nivel === "competitivo" ? "25" : "23";
    case "140_150":    return "25";
    case "150_157":    return "26";
    case "acima_157":  return nivel === "competitivo" ? "adulta_ul" : "26";
    default:           return "23";
  }
}
```

### 5.2 Tipo de raquete

```typescript
function getRacketType(nivel: string, objetivo: string): "recreativa" | "intermediate" | "performance" {
  if (nivel === "primeiro_contato" || nivel === "recreativo" || objetivo === "experimentar") {
    return "recreativa";
  }
  if (nivel === "regular" || objetivo === "tecnica_futuro") {
    return "intermediate";
  }
  if (nivel === "competitivo" || objetivo === "competicao") {
    return "performance";
  }
  return "recreativa";
}
```

### 5.3 Estagio de bola

```typescript
function getBallStage(altura: string, idade: string): string {
  if (altura === "abaixo_110" || idade === "3_4") return "Vermelha (espuma)";
  if (altura === "110_120" || idade === "5_6")    return "Vermelha (Stage 3)";
  if (altura === "120_130" || idade === "7_8")    return "Vermelha / comecando laranja";
  if (altura === "130_140" || idade === "9_10")   return "Laranja (Stage 2)";
  if (altura === "140_150")                        return "Laranja -> Verde";
  if (altura === "150_157" || idade === "11_12")  return "Verde (Stage 1)";
  if (altura === "acima_157" || idade === "13_mais") return "Amarela adulta";
  return "Laranja";
}
```

### 5.4 Material recomendado

```typescript
function getMaterial(racketType: string, tamanho: string): string {
  const size = parseInt(tamanho) || 27;
  if (racketType === "recreativa" && size <= 21) return "Aluminio";
  if (racketType === "recreativa") return "Aluminio ou composite basico";
  if (racketType === "intermediate") return "Composite aluminio-grafite ou grafite";
  if (racketType === "performance") return "Grafite completo (100%)";
  return "Aluminio ou composite basico";
}
```

### 5.5 Quadra recomendada

```typescript
function getCourtSize(altura: string): string {
  if (altura === "abaixo_110" || altura === "110_120") return "Mini quadra (11m)";
  if (altura === "120_130" || altura === "130_140") return "Quadra reduzida (18m)";
  if (altura === "140_150") return "Quadra 60-78 pes";
  return "Quadra adulta (78 pes)";
}
```

### 5.6 Alerta de queixa fisica

```typescript
function getLesaoAlert(queixa: string): JuniorAlert | null {
  if (queixa === "sem_queixa" || queixa === "sem_historico") return null;
  return {
    severity: "urgent",
    title: "Atencao: sinais de sobrecarga no braco",
    message: "Dores no pulso ou cotovelo apos jogar sao um sinal de alerta importante. As causas mais comuns em criancas sao: (1) raquete grande ou pesada demais para a estatura/forca atual, (2) muitas horas de jogo sem pausas, (3) tecnica sendo forcada antes do tempo. Verifique se o tamanho que recomendamos esta sendo respeitado. Em caso de dor persistente, consulte um pediatra ortopedista antes de continuar jogando."
  };
}
```

### 5.7 Alerta de transicao prematura

```typescript
function getTransicaoAlert(altura: string, nivel: string, objetivo: string): JuniorAlert | null {
  const alturaValues: Record<string, number> = {
    abaixo_110: 105, "110_120": 115, "120_130": 125,
    "130_140": 135, "140_150": 145, "150_157": 153, acima_157: 160
  };
  const alturaMedia = alturaValues[altura] || 140;
  if (alturaMedia < 150 && (nivel === "competitivo" || objetivo === "competicao")) {
    return {
      severity: "info",
      title: "Sobre a transicao para raquete adulta",
      message: "Sabemos que criancas competitivas as vezes sentem que precisam de raquete adulta. Mas a transicao prematura — antes de 150cm de altura — cria problemas biomecanicos reais: o lever maior obriga a crianca a se posicionar de forma errada, deforma o swing e pode lesionar ombro e cotovelo. A raquete 26\" de performance (grafite) e genuinamente competitiva. Aguardar o crescimento e sempre a decisao certa."
    };
  }
  return null;
}
```

### 5.8 Blocos educativos

Cada bloco tem um `id`, `titulo` e `texto`. Condicoes de exibicao:

| Bloco | Condicao |
|---|---|
| `sistema_bolas` | Sempre (idade <= 11_12) |
| `nao_comprar_grande` | objetivo === "experimentar" OU nivel === "primeiro_contato" |
| `encordoamento_iniciante` | nivel === "recreativo" OU nivel === "primeiro_contato" |
| `teste_tamanho` | Sempre |
| `transicao_adulta` | altura >= "150_157" |
| `material_raquete` | nivel === "regular" OU nivel === "competitivo" |

Conteudo completo dos blocos definido no documento do usuario (secao 9).

### 5.9 Selecao de raquetes do banco

```typescript
function getJuniorRackets(allRackets: Racket[], size: string, racketType: string): Racket[] {
  if (size === "adulta_ul") {
    // Transicao: raquetes adultas leves
    return allRackets
      .filter(r =>
        !r.slug.includes("jr") && !r.slug.includes("junior") &&
        r.weight !== null && r.weight <= 275 &&
        r.head_size >= 100 &&
        r.ra <= 65
      )
      .sort(/* prospin link + year */);
  }

  // Filtrar junior pelo tamanho (25 ou 26 no slug)
  const sizeStr = size.replace('"', '');
  return allRackets
    .filter(r =>
      (r.slug.includes("jr") || r.slug.includes("junior")) &&
      r.slug.includes(sizeStr)
    )
    .sort(/* prospin link + year */);
}
```

Nota: para tamanhos 17"-23", o filtro pode retornar vazio se essas raquetes nao estiverem no banco ainda. O resultado mostra "nenhuma raquete no banco ainda" mas o guia educativo sempre aparece.

### 5.10 Funcao principal

```typescript
function recommendJunior(allRackets: Racket[], answers: JuniorAnswers): JuniorResult {
  const size = getRacketSize(answers.altura, answers.nivel_junior);
  const type = getRacketType(answers.nivel_junior, answers.objetivo_junior);
  const ballStage = getBallStage(answers.altura, answers.idade);
  const material = getMaterial(type, size);
  const court = getCourtSize(answers.altura);
  const lesaoAlert = getLesaoAlert(answers.queixa);
  const transicaoAlert = getTransicaoAlert(answers.altura, answers.nivel_junior, answers.objetivo_junior);
  const educationBlocks = getEducationBlocks(answers);
  const rackets = getJuniorRackets(allRackets, size, type);

  return {
    racketSize: size,
    racketType: type,
    material,
    ballStage,
    court,
    lesaoAlert,
    transicaoAlert,
    educationBlocks,
    rackets,
    investmentLevel: getInvestmentLevel(type),
    trocaPrevisao: "12-18 meses",
  };
}
```

---

## 6. Tipos — `src/lib/types.ts`

### Adicionar ao PlayerLevel

```typescript
type PlayerLevel = "iniciante" | "basico-intermediario" | "intermediario" | "avancado" | "junior";
```

### Novas interfaces

```typescript
interface JuniorAnswers {
  level: "junior";
  altura: string;
  idade: string;
  nivel_junior: string;
  queixa: string;
  objetivo_junior: string;
}

interface JuniorAlert {
  severity: "urgent" | "info";
  title: string;
  message: string;
}

interface JuniorResult {
  racketSize: string;
  racketType: "recreativa" | "intermediate" | "performance";
  material: string;
  ballStage: string;
  court: string;
  lesaoAlert: JuniorAlert | null;
  transicaoAlert: JuniorAlert | null;
  educationBlocks: EducationBlock[];
  rackets: Racket[];
  investmentLevel: "baixo" | "medio" | "alto";
  trocaPrevisao: string;
}
```

---

## 7. Pagina de Resultado

Reutiliza `/resultado`. Branch condicional:

```typescript
if (answers.level === "junior") {
  // Render JuniorResultView
} else {
  // Render adult result (existing)
}
```

### Layout do resultado infantil

1. **Perfil da crianca** — card resumo com: tamanho recomendado, tipo, estagio de bola, material, quadra
2. **Alertas** — lesao (severity: urgent, fundo vermelho) e/ou transicao prematura (severity: info, fundo amarelo). Sempre acima das raquetes, nunca enterrados.
3. **Raquetes recomendadas** — cards do banco, reutilizando `RacketCard` existente. Ordenados por Pro Spin link + ano. Maximo 6.
4. **Blocos educativos** — accordion/expandable sections com titulo + texto. Condicionais baseados nas respostas.
5. **Previsao de troca** — "Em 12-18 meses, reavalie conforme o crescimento"
6. **Disclaimer** — "Antes de comprar, faca o teste do braco estendido para confirmar o tamanho em casa"

### Tom e linguagem

- Usa "seu filho(a)" em vez de "voce"
- Parental e tranquilizador
- Direto sobre riscos de lesao (sem alarmismo)
- Positivo sobre a fase de desenvolvimento

---

## 8. Conteudo dos Blocos Educativos

### 8.1 Sistema de bolas coloridas

**Condicao:** sempre (idade <= 11_12)

**Titulo:** "O sistema de bolas coloridas — o que e e por que importa"

**Texto:** O ITF e a USTA criaram um sistema de bolas progressivas:

- Bola Vermelha (Stage 3): 75% mais lenta. Quique baixo e lento. Quadra de 11m. Para criancas ate ~8 anos.
- Bola Laranja (Stage 2): ~50% mais lenta. Quadra de 18m. Para 7-10 anos. Tecnica comeca a se desenvolver.
- Bola Verde (Stage 1): ~25% mais lenta. Quadra adulta completa. Para 9-12 anos.
- Bola Amarela (adulta): A partir de 11+ anos.

Cada estagio tem um tamanho maximo de raquete recomendado.

### 8.2 Nao comprar grande

**Condicao:** objetivo === "experimentar" OU nivel === "primeiro_contato"

**Titulo:** "Resistir a tentacao de comprar a raquete 'grande para durar'"

**Texto:** Raquete grande demais e um dos erros mais comuns e prejudiciais. A crianca vai encurtar o swing, desenvolver vicios tecnicos dificeis de corrigir, cansar mais rapido e ter mais risco de dores. A raquete certa para HOJE e sempre a melhor escolha, mesmo que dure so 12-18 meses.

### 8.3 Encordoamento para iniciantes

**Condicao:** nivel === "recreativo" OU nivel === "primeiro_contato"

**Titulo:** "Sobre o encordoamento — o que os pais precisam saber"

**Texto:** Para criancas iniciantes: a corda de fabrica que vem na raquete esta otima. NUNCA usar polyester em criancas. Quando comecar a reencordar: quando a crianca joga 3+ vezes por semana. Usar multifilamento em tensao baixa (44-48 lbs).

### 8.4 Teste de tamanho em casa

**Condicao:** sempre

**Titulo:** "Como confirmar em casa se a raquete esta no tamanho certo"

**Texto:**
- Teste 1 (Braco estendido): segurar a raquete com o braco estendido horizontalmente por 10-15 segundos sem tremer.
- Teste 2 (Ao lado do corpo): cabeca da raquete NAO deve arrastar no chao.
- Teste 3 (Swing): observar se a crianca encurta os movimentos — sinal de raquete grande demais.

### 8.5 Transicao para raquete adulta

**Condicao:** altura >= "150_157"

**Titulo:** "Quando e como fazer a transicao para raquete adulta"

**Texto:** Sinais de prontidao: altura acima de 150cm, controle da 26" com swing completo, treina 3+x/semana, tecnica basica desenvolvida. Como fazer: comecar com modelos UL (230-265g), manter cabeca grande (105-110 in2), encordoamento multifilamento, nunca polyester na transicao.

### 8.6 Material da raquete

**Condicao:** nivel === "regular" OU nivel === "competitivo"

**Titulo:** "Aluminio vs. grafite — quando faz diferenca real"

**Texto:** Para iniciantes/recreativos: aluminio esta otimo. A partir de 3-4x/semana ou competitivo: grafite. Grafite e mais leve por cm, transmite melhor a energia, mais feeling. Grafite composto: boa opcao intermediaria. Grafite 100%: raquetes de performance junior.

---

## 9. Validacoes Criticas

1. Nunca recomendar adulta para crianca < 150cm → forcar 26" e emitir alerta
2. Qualquer queixa de dor → sempre emitir alerta em destaque
3. Crianca competitiva < 130cm → nivel nao muda o tamanho (23" apenas)
4. Discrepancia idade vs altura → mensagem educativa no resultado

---

## 10. Arquivos Impactados

| Arquivo | Mudanca |
|---|---|
| `src/lib/types.ts` | Adicionar "junior" ao PlayerLevel, JuniorAnswers, JuniorAlert, JuniorResult |
| `src/lib/quiz-config.ts` | Adicionar opcao "junior" no LEVEL_QUESTION, criar JUNIOR_QUESTIONS |
| `src/lib/junior-engine.ts` | **Novo** — logica deterministica completa |
| `src/lib/__tests__/junior-engine.test.ts` | **Novo** — testes do engine |
| `src/app/resultado/page.tsx` | Branch condicional para resultado infantil |
| `src/components/JuniorResult.tsx` | **Novo** — componente de resultado infantil |

---

## 11. Fora de Escopo

- Adicionar raquetes 17"-23" ao banco de dados
- Modificar o engine adulto (`engine.ts`)
- Nova pagina separada para quiz infantil
- Tracking de analytics
- i18n / traducoes
