# Quiz Educativo de Raquete de Tenis — Design Spec

**Data:** 2026-04-07
**Status:** Aprovado
**Base:** docs/superpowers/tennis_quiz_conhecimento_completo.docx

---

## 1. Visao Geral

Reescrever o quiz de recomendacao de raquetes para seguir a especificacao completa do documento de pesquisa. Mudancas principais:

- 4 niveis em vez de 3 (adicionar "basico-intermediario")
- Perguntas novas com contexto educativo visivel antes das opcoes
- Logica de resultado com perfil de specs explicado, blocos educativos e alertas de lesao
- Engine atualizado com scoring de string_pattern e swingweight

## 2. Estrutura do Quiz — 4 Niveis

### 2.1 Pergunta de nivel (primeira pergunta)

| Valor | Label | NTRP | Nº perguntas |
|-------|-------|------|--------------|
| `iniciante` | Nunca jogou ou menos de 3 meses | 1.0-2.0 | 5 |
| `basico-intermediario` | 3 meses a 2 anos, joga regularmente | 2.5-3.0 | 6 |
| `intermediario` | 2+ anos, estilo definido, busca performance | 3.5-4.5 | 6 |
| `avancado` | Competitivo ou 5+ anos intensos | 5.0+ | 6 |

### 2.2 Perguntas — Nivel Iniciante (5 perguntas)

**P1: lesao**
- Contexto: "Isso e crucial. Raquetes com frame rigido (RA alto) transferem mais vibracao para o braco — o que pode causar ou agravar lesoes como o 'cotovelo do tenista'. Uma raquete com frame mais flexivel pode fazer grande diferenca na sua saude."
- Opcoes:
  - `sem_lesao` — "Nao, estou sem dores"
  - `cotovelo_leve` — "Dor leve ou ocasional no cotovelo"
  - `cotovelo_forte` — "Dor frequente no cotovelo ou punho"
  - `ombro` — "Dor no ombro ou problemas no manguito"

**P2: fisico**
- Contexto: "O peso da raquete afeta diretamente o quanto de energia voce precisa gastar para cada tacada. Para iniciantes, uma raquete leve (260-280g) e mais segura e reduz fadiga — mas deve ser pesada o suficiente para estabilizar o impacto da bola."
- Opcoes:
  - `fraco` — "Tenho pouca forca e me canso rapido"
  - `medio` — "Forca media, jogo por prazer"
  - `atletico` — "Sou atletico(a), tenho boa resistencia"

**P3: objetivo**
- Contexto: "Iniciantes se beneficiam de raquetes com maior area de cabeca (105-115 in²) — o sweet spot maior perdoa mais erros de centro. Isso permite focar na tecnica, nao na precisao do contato."
- Opcoes:
  - `aprender` — "Quero aprender do zero, sem me frustrar"
  - `diversao` — "Quero me divertir e fazer exercicio"
  - `evolucao` — "Quero evoluir rapido e jogar bem logo"

**P4: frequencia**
- Contexto: "Jogar 1-2x por semana como lazer tem exigencias muito diferentes de quem quer jogar 4-5x. Frequencia maior significa mais desgaste da corda, mais fadiga muscular e maior necessidade de equipamento de qualidade."
- Opcoes:
  - `lazer` — "1-2x por semana como lazer"
  - `regular` — "3-4x por semana"
  - `intenso` — "Todo dia ou quase isso"

**P5: estilo_basico**
- Contexto: "Mesmo sem ter um estilo definido, sua preferencia natural ja diz muito sobre que tipo de raquete vai te motivar mais. Quem quer bater forte precisa de mais controle; quem quer trocar bolas quer mais perdao nos erros."
- Opcoes:
  - `fundo` — "Quero trocar bolas do fundo da quadra"
  - `rede` — "Quero subir a rede e fazer voleys"
  - `indefinido` — "Ainda nao sei — quero experimentar"

### 2.3 Perguntas — Nivel Basico-Intermediario (6 perguntas)

**P1: tempo**
- Contexto: "O tempo de jogo influencia diretamente a capacidade de gerar potencia propria. Quem joga ha menos de 6 meses ainda depende muito da raquete para criar velocidade de bola."
- Opcoes:
  - `menos6` — "Menos de 6 meses"
  - `6a12` — "6 meses a 1 ano"
  - `1a2` — "1 a 2 anos"

**P2: lesao**
- Contexto: "A rigidez do frame (RA rating) e o fator mais direto para o cotovelo. Frames com RA acima de 68 transferem muito choque para o braco. Para jogadores ainda desenvolvendo tecnica, a combinacao rigido + poly e especialmente perigosa."
- Opcoes:
  - `sem_lesao` — "Nao tenho dores"
  - `leve` — "Dor leve, aparece depois de muito jogo"
  - `forte` — "Sinto dor frequente no cotovelo"

**P3: encordoamento**
- Contexto: "O encordoamento pode ser mais importante que a propria raquete para o braco e o jogo. Cordas de polyester sao duras, geram mais spin mas sao as mais agressivas para o cotovelo. Muitas raquetes de fabrica vem com corda sintetica de baixa qualidade."
- Opcoes:
  - `nao_sei` — "Nao sei / vem da fabrica"
  - `poly` — "Polyester (dura, comum em raquetes modernas)"
  - `multi` — "Multifilamento ou gut natural (mais macia)"

**P4: padrao**
- Contexto: "Isso revela se sua raquete esta te ajudando ou atrapalhando. Se a bola sempre sai, voce pode precisar de mais controle. Se cai curta demais, precisa de mais potencia ou spin."
- Opcoes:
  - `sai_muito` — "Saem muito — erro pra fora com frequencia"
  - `curta` — "Caem curtas — o adversario ataca facilmente"
  - `consistente` — "Tenho boa consistencia no fundo"

**P5: padrao_encordoamento**
- Contexto: "O padrao de encordoamento define quantas cordas principais x cruzadas a raquete tem. 16x19 = espacos maiores = mais spin e potencia automatica. 18x20 = cordas mais juntas = mais controle e precisao."
- Opcoes:
  - `desconhece` — "Nunca ouvi falar nisso"
  - `vago` — "Ja ouvi, mas nao entendo bem"
  - `conhece` — "Conheco e uso isso como criterio"

**P6: estilo**
- Contexto: "Seu estilo atual define o tipo de raquete que vai amplificar seus pontos fortes. Mesmo que voce ainda esteja desenvolvendo, ja e possivel identificar tendencias."
- Opcoes:
  - `fundo` — "Fico no fundo e troco muitas bolas"
  - `rede` — "Gosto de subir a rede e finalizar"
  - `misto` — "Misto — depende do ponto"

### 2.4 Perguntas — Nivel Intermediario (6 perguntas)

**P1: estilo**
- Contexto: "O estilo define quase tudo. Baseliners com topspin pesado se beneficiam de raquetes com cabeca de 97-100 in², padrao 16x19 e swingweight medio-alto. Jogadores de rede precisam de frames mais leves e mais manobra."
- Opcoes:
  - `baseliner_spin` — "Baseliner com muito topspin"
  - `baseliner_flat` — "Baseliner flat — bato limpo e direto"
  - `counter` — "Contra-puncher — devolvo tudo e espero o erro"
  - `rede` — "Serve & Volley / Rede"
  - `allcourt` — "All-court — mudo conforme o ponto"

**P2: lesao**
- Contexto: "Para intermediarios, esse e o momento mais critico para lesoes — o volume de jogo aumenta mas a tecnica ainda nao e perfeita. Frames RA abaixo de 65, padrao aberto 16x19 e cordas multifilamento sao muito mais seguros."
- Opcoes:
  - `sem` — "Nenhuma dor ou historico"
  - `cotovelo` — "Cotovelo do tenista leve ou historico"
  - `ombro` — "Dor no ombro ou manguito rotador"
  - `punho` — "Punho ou dedo — lesao recente"

**P3: padrao_enc**
- Contexto: "16x19 (aberto): as cordas se movem, 'mordem' a bola e criam mais spin e potencia. 18x20 (fechado): mais cordas, menos movimento, trajetoria plana e precisa. 16x20 (hibrido): mais controle que 16x19, mais spin que 18x20 — crescendo em popularidade (Alcaraz usa)."
- Opcoes:
  - `16x19` — "16x19 — quero maximizar spin e potencia"
  - `18x20` — "18x20 — quero controle e jogo plano"
  - `16x20` — "16x20 — quero equilibrio entre os dois"
  - `nao_sei` — "Nao sei ainda — me orienta"

**P4: peso**
- Contexto: "Raquetes mais pesadas (300-320g) oferecem mais estabilidade e potencia. Raquetes mais leves (270-290g) sao mais faceis de acelerar. O swingweight (sensacao ao balancar) e tao importante quanto o peso estatico."
- Opcoes:
  - `leve` — "Prefiro leveza — facil de balancar rapido"
  - `pesado` — "Prefiro peso — quero estabilidade e penetracao"
  - `neutro` — "Neutro — depende da sensacao na mao"

**P5: problema_atual**
- Contexto: "A raquete certa nao resolve problemas tecnicos, mas pode compensar limitacoes e ampliar pontos fortes. Saber o que falta guia a escolha de forma muito mais precisa."
- Opcoes:
  - `curta` — "Minha bola cai curta — quero mais fundo e penetracao"
  - `erro` — "Erro muito — quero mais controle e consistencia"
  - `sem_spin` — "Nao consigo gerar spin — bola sempre sai reta"
  - `vibracao` — "Sinto vibracao / desconforto no braco"
  - `feeling` — "Minha raquete nao tem feeling — nao sinto a bola"

**P6: rigidez**
- Contexto: "RA e a escala de rigidez. RA acima de 68: mais potencia, mais choque — Babolat Pure Drive/Aero. RA 63-67: equilibrio popular, Head Radical/Speed e Yonex Ezone. RA abaixo de 62: muito flexivel, muito feeling — Wilson Clash (RA 55)."
- Opcoes:
  - `rigido` — "Mais rigido — quero potencia e resposta rapida"
  - `flexivel` — "Mais flexivel — quero conforto e feeling"
  - `neutro` — "Nao tenho preferencia definida"

### 2.5 Perguntas — Nivel Avancado (6 perguntas)

**P1: necessidade**
- Contexto: "Jogadores avancados raramente mudam por modismo. Geralmente e porque o jogo evoluiu e a raquete nao acompanhou, ou porque surgiu uma necessidade fisica. Identificar a necessidade real filtra todas as escolhas seguintes."
- Opcoes:
  - `controle` — "Evolui e preciso de mais controle/precisao"
  - `spin` — "Quero mais spin — jogo ficou mais ofensivo"
  - `lesao` — "Dor no braco — preciso de algo mais amigavel"
  - `potencia` — "Jogo ficou mais potente e quero uma raquete que aguente"
  - `exploracao` — "Curiosidade — quero explorar specs diferentes"

**P2: estilo_avancado**
- Contexto: "No nivel avancado, a distincao entre estilos e muito mais tecnica. Baseliners com topspin pesado preferem frames leves de 295-315g com swingweight alto (325+). Flat hitters precisam de raquetes estaveis e pesadas."
- Opcoes:
  - `heavy_baseliner` — "Baseliner pesado — topspin e profundidade constantes"
  - `flat` — "Flat hitter — velocidade e trajetoria plana"
  - `counter` — "Counter-puncher — uso o ritmo do adversario"
  - `allcourt` — "All-court completo — sirvo bem, sou versatil"
  - `rede` — "Net rusher / doubles specialist"

**P3: padrao_enc_avancado**
- Contexto: "No nivel avancado, a diferenca entre 16x19 e 18x20 e imediatamente perceptivel. Djokovic usa 18x19 — jogo de redirecionamento preciso. Nadal usava 16x19 — topspin pesado. Alcaraz usa 16x20 — hibrido."
- Opcoes:
  - `16x19` — "Uso 16x19 e quero continuar"
  - `18x20_para_aberto` — "Uso 18x20 e quero mais spin (abrir padrao)"
  - `16x19_para_fechado` — "Uso 16x19 e quero mais controle (fechar padrao)"
  - `16x20` — "Quero explorar o 16x20 como meio-termo"

**P4: swingweight**
- Contexto: "Swingweight e a sensacao de peso ao balancar — nao o peso estatico. Acima de 325: muito estavel, exige condicionamento. 310-325: equilibrio classico. Abaixo de 305: muito facil de acelerar, otimo para spin pesado."
- Opcoes:
  - `longo` — "Swing longo e pesado — bato com muita rotacao"
  - `compacto` — "Swing compacto e explosivo — prefiro velocidade de cabeca"
  - `equilibrado` — "Swing equilibrado — adapto conforme a situacao"

**P5: lesao_avancado**
- Contexto: "Jogadores avancados frequentemente ignoram sinais do corpo. RA acima de 68 + polyester cheio + tensao alta pode estar silenciosamente destruindo os tendoes."
- Opcoes:
  - `sem` — "Nenhuma — estou 100% saudavel"
  - `cotovelo` — "Tendinite ou historico de cotovelo"
  - `ombro` — "Ombro — manguito rotador ou impingement"
  - `costas` — "Costas ou joelhos — preciso de raquete leve"

**P6: corda_atual**
- Contexto: "Para avancados: polyester cheio em tensao baixa (44-50 lbs) e o setup moderno mais popular — gera muito spin e dura mais. Mas e o mais agressivo para o cotovelo a longo prazo. Hybrid equilibra spin e conforto."
- Opcoes:
  - `poly` — "Polyester cheio (Luxilon, Solinco, etc.)"
  - `hybrid` — "Hybrid — poly nas mains + multi nas crosses"
  - `multi_gut` — "Multifilamento ou gut natural"
  - `nao_sei` — "Nao tenho controle do que colocam"

## 3. UI — Componente QuizStep com Contexto Educativo

### 3.1 QuizQuestion type atualizado

```typescript
interface QuizQuestion {
  id: string;
  text: string;
  context?: string;          // texto educativo (novo)
  options: {
    value: string;
    label: string;
  }[];
}
```

### 3.2 Layout do QuizStep

```
┌─────────────────────────────────┐
│  Pergunta 2 de 6          33%  │
│  ████████░░░░░░░░░░░░░░░░░░░░  │
│                                 │
│  Texto da pergunta (bold)       │
│                                 │
│  ┌─ 💡 Por que isso importa? ─┐│
│  │ Texto educativo explicando  ││
│  │ o conceito tecnico...       ││
│  │                  [Fechar ▲] ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ Opcao A                     ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Opcao B                     ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Opcao C                     ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

- Card educativo comeca **aberto** e pode ser colapsado
- Fundo sutil (bg-green-50 ou bg-amber-50), borda leve
- Icone de lampada, texto em tamanho menor (text-sm)
- Ao trocar de pergunta, o card reabre automaticamente

### 3.3 Botao de voltar

Adicionar botao "Voltar" para permitir o usuario mudar respostas anteriores (nao existe hoje).

## 4. Resultado — Perfil de Specs + Blocos Educativos

### 4.1 Estrutura do resultado

O resultado passa a ter 3 secoes antes das raquetes recomendadas:

1. **Perfil de especificacoes recomendado** — tabela com:
   - Spec (Head size, Peso, RA, Balance, Padrao enc., Corda, Tensao)
   - Valor recomendado (ex: "100-105 in²")
   - Por que (ex: "Seu estilo baseliner spin se beneficia de...")

2. **Alerta de lesao** (condicional) — bloco de destaque vermelho/amarelo:
   - Aparece se qualquer lesao foi indicada
   - Mostra protocolo de protecao do documento (RA + corda + tensao)

3. **Blocos educativos personalizados** (condicionais):
   - `curta`: explicacao sobre bola caindo curta
   - `sem_spin`: explicacao sobre geracao de spin
   - `cotovelo/lesao`: protocolo completo
   - `feeling`: explicacao sobre falta de feeling
   - `transicao_padrao`: o que esperar ao mudar de padrao
   - Cada bloco so aparece se relevante para as respostas

4. **Top 3 raquetes** — mantem o sistema existente com score + reasons

### 4.2 Funcoes novas no engine

```typescript
// Gera o perfil de specs com explicacao por spec
function generateSpecProfile(answers: QuizAnswers): SpecRecommendation[]

// Gera blocos educativos relevantes para as respostas
function generateEducationBlocks(answers: QuizAnswers): EducationBlock[]

// Gera alerta de lesao se aplicavel
function generateInjuryAlert(answers: QuizAnswers): InjuryAlert | null
```

### 4.3 Tipos novos

```typescript
interface SpecRecommendation {
  spec: string;        // ex: "Head size"
  value: string;       // ex: "100-105 in²"
  reason: string;      // ex: "Seu estilo baseliner spin..."
}

interface EducationBlock {
  id: string;          // ex: "curta", "sem_spin"
  title: string;
  content: string;
}

interface InjuryAlert {
  severity: "warning" | "urgent";
  title: string;
  recommendations: string[];
}
```

## 5. Engine — Atualizacoes

### 5.1 PlayerLevel atualizado

```typescript
type PlayerLevel = "iniciante" | "basico-intermediario" | "intermediario" | "avancado";
```

### 5.2 Novo nivel de defaults

```typescript
const BASIC_INTERMEDIATE_DEFAULTS: IdealProfile = {
  weight: { min: 270, max: 295, importance: 0.2 },
  head_size: { min: 100, max: 110, importance: 0.25 },
  ra: { min: 60, max: 67, importance: 0.3 },
  balance_mm: { min: 320, max: 345, importance: 0.15 },
  swingweight: { min: 305, max: 320, importance: 0.1 },
};
```

### 5.3 String pattern scoring

Adicionar scoring por string_pattern ao IdealProfile:

```typescript
interface IdealProfile {
  weight: SpecRange;
  head_size: SpecRange;
  ra: SpecRange;
  balance_mm: SpecRange;
  preferred_patterns?: string[];   // ex: ["16x19"]
  pattern_importance?: number;     // 0-1
}
```

Rackets com string_pattern matching recebem bonus; non-matching recebem penalidade proporcional.

### 5.4 Swingweight scoring

Adicionar swingweight range ao IdealProfile (mesma mecanica de scoreSpec existente).

### 5.5 QuizAnswers atualizado

Novos campos para suportar todas as perguntas dos 4 niveis:

```typescript
interface QuizAnswers {
  level: PlayerLevel;
  // Iniciante
  lesao?: string;
  fisico?: string;
  objetivo?: string;
  frequencia?: string;
  estilo_basico?: string;
  // Basico-Intermediario
  tempo?: string;
  encordoamento?: string;
  padrao?: string;
  padrao_encordoamento?: string;
  estilo?: string;
  // Intermediario
  padrao_enc?: string;
  peso?: string;
  problema_atual?: string;
  rigidez?: string;
  // Avancado
  necessidade?: string;
  estilo_avancado?: string;
  padrao_enc_avancado?: string;
  swingweight?: string;
  lesao_avancado?: string;
  corda_atual?: string;
}
```

### 5.6 Validacoes criticas (do documento)

1. Se nivel = iniciante ou basico + qualquer lesao: NUNCA recomendar poly cheio
2. Se RA recomendado > 67 + lesao identificada: sobrescrever para RA 60-65
3. Se lesao_avancado = cotovelo + corda_atual = poly: bloco de urgencia

## 6. Arquivos afetados

| Arquivo | Mudanca |
|---------|---------|
| `src/lib/types.ts` | Novos tipos: PlayerLevel, QuizAnswers, SpecRecommendation, EducationBlock, InjuryAlert |
| `src/lib/quiz-config.ts` | Reescrever com 4 niveis, todas as perguntas + contexto educativo |
| `src/lib/engine.ts` | Novo nivel, swingweight/pattern scoring, generateSpecProfile, generateEducationBlocks, generateInjuryAlert |
| `src/components/QuizStep.tsx` | Contexto educativo colapsavel, botao voltar |
| `src/app/quiz/page.tsx` | Suportar 4 niveis, botao voltar |
| `src/app/resultado/page.tsx` | Perfil de specs, alertas de lesao, blocos educativos |
| `src/lib/__tests__/` | Atualizar testes existentes + novos testes |
