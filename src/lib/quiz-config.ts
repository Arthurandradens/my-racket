import type { QuizQuestion, PlayerLevel } from "./types";

const LEVEL_QUESTION: QuizQuestion = {
  id: "level",
  text: "Qual é o seu nível de tênis?",
  options: [
    { value: "iniciante", label: "Iniciante — Nunca joguei ou jogo há menos de 3 meses" },
    { value: "basico-intermediario", label: "Básico-Intermediário — 3 meses a 2 anos, jogo regularmente" },
    { value: "intermediario", label: "Intermediário — 2+ anos, estilo definido, busco performance" },
    { value: "avancado", label: "Avançado — Competitivo ou 5+ anos intensos" },
    { value: "junior", label: "Para o meu filho(a) — Busco a raquete certa para uma criança ou adolescente" },
  ],
};

const BEGINNER_QUESTIONS: QuizQuestion[] = [
  {
    id: "lesao",
    text: "Você tem ou já teve dor no cotovelo, punho ou ombro?",
    context: "Isso é crucial. Raquetes com frame rígido (RA alto) transferem mais vibração para o braço — o que pode causar ou agravar lesões como o 'cotovelo do tenista'. Uma raquete com frame mais flexível pode fazer grande diferença na sua saúde.",
    options: [
      { value: "sem_lesao", label: "Não, estou sem dores" },
      { value: "cotovelo_leve", label: "Dor leve ou ocasional no cotovelo" },
      { value: "cotovelo_forte", label: "Dor frequente no cotovelo ou punho" },
      { value: "ombro", label: "Dor no ombro ou problemas no manguito" },
    ],
  },
  {
    id: "fisico",
    text: "Como você descreveria seu condicionamento físico e força no braço?",
    context: "O peso da raquete afeta diretamente o quanto de energia você precisa gastar para cada tacada. Para iniciantes, uma raquete leve (260–280g) é mais segura e reduz fadiga — mas deve ser pesada o suficiente para estabilizar o impacto da bola.",
    options: [
      { value: "fraco", label: "Tenho pouca força e me canso rápido" },
      { value: "medio", label: "Força média, jogo por prazer" },
      { value: "atletico", label: "Sou atlético(a), tenho boa resistência" },
    ],
  },
  {
    id: "objetivo",
    text: "Qual é o seu principal objetivo agora no tênis?",
    context: "Iniciantes se beneficiam de raquetes com maior área de cabeça (105–115 in²) — o sweet spot maior perdoa mais erros de centro. Isso permite focar na técnica, não na precisão do contato. Só depois de ganhar consistência vale pensar em raquetes menores.",
    options: [
      { value: "aprender", label: "Quero aprender do zero, sem me frustrar" },
      { value: "diversao", label: "Quero me divertir e fazer exercício" },
      { value: "evolucao", label: "Quero evoluir rápido e jogar bem logo" },
    ],
  },
  {
    id: "frequencia",
    text: "Com que frequência você pretende jogar?",
    context: "Jogar 1–2x por semana como lazer tem exigências muito diferentes de quem quer jogar 4–5x. Frequência maior significa mais desgaste da corda (especialmente poly), mais fadiga muscular e maior necessidade de equipamento de qualidade.",
    options: [
      { value: "lazer", label: "1–2x por semana como lazer" },
      { value: "regular", label: "3–4x por semana" },
      { value: "intenso", label: "Todo dia ou quase isso" },
    ],
  },
  {
    id: "estilo_basico",
    text: "Mesmo sem experiência, qual tipo de jogo mais te atrai?",
    context: "Mesmo sem ter um estilo definido, sua preferência natural já diz muito sobre que tipo de raquete vai te motivar mais. Quem quer bater forte precisa de mais controle; quem quer trocar bolas quer mais perdão nos erros.",
    options: [
      { value: "fundo", label: "Quero trocar bolas do fundo da quadra" },
      { value: "rede", label: "Quero subir à rede e fazer voleys" },
      { value: "indefinido", label: "Ainda não sei — quero experimentar" },
    ],
  },
];

const BASIC_INTERMEDIATE_QUESTIONS: QuizQuestion[] = [
  {
    id: "tempo",
    text: "Há quanto tempo você joga tênis?",
    context: "O tempo de jogo influencia diretamente a capacidade de gerar potência própria. Quem joga há menos de 6 meses ainda depende muito da raquete para criar velocidade de bola e precisa de mais 'ajuda' do equipamento.",
    options: [
      { value: "menos6", label: "Menos de 6 meses" },
      { value: "6a12", label: "6 meses a 1 ano" },
      { value: "1a2", label: "1 a 2 anos" },
    ],
  },
  {
    id: "lesao",
    text: "Você tem ou já teve dor no cotovelo, punho ou ombro jogando tênis?",
    context: "A rigidez do frame (RA rating) é o fator mais direto para o cotovelo. Frames com RA acima de 68 transferem muito choque para o braço. Para jogadores ainda desenvolvendo técnica, a combinação rígido + poly é especialmente perigosa.",
    options: [
      { value: "sem_lesao", label: "Não tenho dores" },
      { value: "leve", label: "Dor leve, aparece depois de muito jogo" },
      { value: "forte", label: "Sinto dor frequente no cotovelo" },
    ],
  },
  {
    id: "encordoamento",
    text: "Você sabe que tipo de encordoamento sua raquete atual usa?",
    context: "O encordoamento pode ser mais importante que a própria raquete para o braço e o jogo. Cordas de polyester são duras, geram mais spin mas são as mais agressivas para o cotovelo. Muitas raquetes de fábrica vêm com corda sintética de baixa qualidade que é rígida E sem durabilidade.",
    options: [
      { value: "nao_sei", label: "Não sei / vem da fábrica" },
      { value: "poly", label: "Polyester (dura, comum em raquetes modernas)" },
      { value: "multi", label: "Multifilamento ou gut natural (mais macia)" },
    ],
  },
  {
    id: "padrao",
    text: "Onde a maioria das suas bolas cai na quadra adversária?",
    context: "Isso revela se sua raquete está te ajudando ou atrapalhando. Se a bola sempre sai, você pode precisar de mais controle (padrão mais fechado ou tensão mais alta). Se cai curta demais, precisa de mais potência ou spin para levar a bola mais fundo — e a raquete pode ajudar nisso.",
    options: [
      { value: "sai_muito", label: "Saem muito — erro pra fora com frequência" },
      { value: "curta", label: "Caem curtas — o adversário ataca facilmente" },
      { value: "consistente", label: "Tenho boa consistência no fundo" },
    ],
  },
  {
    id: "padrao_encordoamento",
    text: "Você sabe o que é o padrão de encordoamento (16x19, 18x20)?",
    context: "O padrão de encordoamento define quantas cordas principais (verticais) x cruzadas (horizontais) a raquete tem. 16x19 = espaços maiores = mais spin e potência automática, mais amigável ao braço. 18x20 = cordas mais juntas = mais controle e precisão, mas você precisa gerar toda a velocidade sozinho.",
    options: [
      { value: "desconhece", label: "Nunca ouvi falar nisso" },
      { value: "vago", label: "Já ouvi, mas não entendo bem" },
      { value: "conhece", label: "Conheço e uso isso como critério" },
    ],
  },
  {
    id: "estilo",
    text: "Qual melhor descreve como você joga hoje?",
    context: "Seu estilo atual define o tipo de raquete que vai amplificar seus pontos fortes. Mesmo que você ainda esteja desenvolvendo, já é possível identificar tendências.",
    options: [
      { value: "fundo", label: "Fico no fundo e troco muitas bolas" },
      { value: "rede", label: "Gosto de subir à rede e finalizar" },
      { value: "misto", label: "Misto — depende do ponto" },
    ],
  },
];

const INTERMEDIATE_QUESTIONS: QuizQuestion[] = [
  {
    id: "estilo",
    text: "Qual é o seu estilo de jogo predominante?",
    context: "O estilo define quase tudo. Baseliners com topspin pesado se beneficiam de raquetes com cabeça de 97–100 in², padrão 16x19 e swingweight médio-alto. Jogadores de rede precisam de frames mais leves, head-light e mais manobrabilidade.",
    options: [
      { value: "baseliner_spin", label: "Fundo de quadra com topspin — jogo com muito efeito" },
      { value: "baseliner_flat", label: "Fundo de quadra chapado — bato limpo e direto" },
      { value: "counter", label: "Defensivo — devolvo tudo e espero o erro do adversário" },
      { value: "rede", label: "Saque e voleio — gosto de subir à rede" },
      { value: "allcourt", label: "Versátil — mudo o estilo conforme o ponto" },
    ],
  },
  {
    id: "lesao",
    text: "Você tem histórico de lesão ou desconforto no braço?",
    context: "Para intermediários, esse é o momento mais crítico para lesões — o volume de jogo aumenta significativamente mas a técnica ainda não é perfeita. Frames RA abaixo de 65, padrão aberto 16x19 e cordas multifilamento são uma combinação muito mais segura para o cotovelo.",
    options: [
      { value: "sem", label: "Nenhuma dor ou histórico" },
      { value: "cotovelo", label: "Cotovelo do tenista leve ou histórico" },
      { value: "ombro", label: "Dor no ombro ou manguito rotador" },
      { value: "punho", label: "Punho ou dedo — lesão recente" },
    ],
  },
  {
    id: "padrao_enc",
    text: "Qual padrão de encordoamento você prefere ou quer experimentar?",
    context: "16x19 (aberto): as cordas se movem, 'mordem' a bola e criam mais spin e potência. 18x20 (fechado): mais cordas, menos movimento, trajetória plana e precisa. 16x20 (híbrido): mais controle que 16x19, mais spin que 18x20 — crescendo em popularidade (Alcaraz usa).",
    options: [
      { value: "16x19", label: "16x19 — quero maximizar spin e potência" },
      { value: "18x20", label: "18x20 — quero controle e jogo plano" },
      { value: "16x20", label: "16x20 — quero equilíbrio entre os dois" },
      { value: "nao_sei", label: "Não sei ainda — me orienta" },
    ],
  },
  {
    id: "peso",
    text: "Qual é a sua relação com o peso da raquete?",
    context: "Raquetes mais pesadas (300–320g) oferecem mais estabilidade no impacto e mais potência em trocas difíceis. Raquetes mais leves (270–290g) são mais fáceis de acelerar — essenciais para jogadores de rede ou com swing mais curto. O swingweight (sensação ao balançar) é tão importante quanto o peso estático.",
    options: [
      { value: "leve", label: "Prefiro leveza — fácil de balançar rápido" },
      { value: "pesado", label: "Prefiro peso — quero estabilidade e penetração" },
      { value: "neutro", label: "Neutro — depende da sensação na mão" },
    ],
  },
  {
    id: "problema_atual",
    text: "Qual é o maior problema no seu jogo hoje que você quer resolver com a raquete?",
    context: "A raquete certa não resolve problemas técnicos, mas pode compensar limitações e ampliar pontos fortes. Saber o que falta guia a escolha de especificações de forma muito mais precisa do que qualquer outra pergunta.",
    options: [
      { value: "curta", label: "Minha bola cai curta — quero mais fundo e penetração" },
      { value: "erro", label: "Erro muito — quero mais controle e consistência" },
      { value: "sem_spin", label: "Não consigo gerar spin — bola sempre sai reta" },
      { value: "vibracao", label: "Sinto vibração / desconforto no braço" },
      { value: "feeling", label: "Minha raquete não tem feeling — não sinto a bola" },
    ],
  },
  {
    id: "rigidez",
    text: "Você prefere frame mais rígido ou mais flexível?",
    context: "RA é a escala de rigidez. RA acima de 68: mais potência, mais transmissão de choque — Babolat Pure Drive/Aero ficam nessa faixa. RA 63–67: equilíbrio popular, Head Radical/Speed e Yonex Ezone ficam aqui. RA abaixo de 62: muito flexível, muito feeling — Wilson Clash (RA 55) é a referência.",
    options: [
      { value: "rigido", label: "Mais rígido — quero potência e resposta rápida" },
      { value: "flexivel", label: "Mais flexível — quero conforto e feeling" },
      { value: "neutro", label: "Não tenho preferência definida" },
    ],
  },
];

const ADVANCED_QUESTIONS: QuizQuestion[] = [
  {
    id: "necessidade",
    text: "O que te faz querer mudar de raquete agora?",
    context: "Jogadores avançados raramente mudam por modismo. Geralmente é porque o jogo evoluiu e a raquete não acompanhou, ou porque surgiu uma necessidade física. Identificar a necessidade real é o passo mais importante — ele filtra todas as escolhas seguintes.",
    options: [
      { value: "controle", label: "Evolui e preciso de mais controle/precisão" },
      { value: "spin", label: "Quero mais spin — jogo ficou mais ofensivo" },
      { value: "lesao", label: "Dor no braço — preciso de algo mais amigável" },
      { value: "potencia", label: "Jogo ficou mais potente e quero uma raquete que aguente" },
      { value: "exploracao", label: "Curiosidade — quero explorar specs diferentes" },
    ],
  },
  {
    id: "estilo_avancado",
    text: "Qual descreve melhor seu jogo atual?",
    context: "No nível avançado, a distinção entre estilos é muito mais técnica. Jogadores de fundo com topspin pesado costumam preferir frames leves de 295–315g com swingweight alto (325+). Quem joga chapado precisa de raquetes estáveis e pesadas para manter a trajetória limpa.",
    options: [
      { value: "heavy_baseliner", label: "Fundo pesado — topspin e profundidade constantes" },
      { value: "flat", label: "Jogo chapado — velocidade e trajetória plana" },
      { value: "counter", label: "Defensivo — uso o ritmo do adversário contra ele" },
      { value: "allcourt", label: "Completo — sirvo bem, sou versátil em todas as áreas" },
      { value: "rede", label: "Especialista em rede / duplas" },
    ],
  },
  {
    id: "padrao_enc_avancado",
    text: "Qual padrão de encordoamento você usa e está considerando?",
    context: "No nível avançado, a diferença entre 16x19 e 18x20 é imediatamente perceptível. Djokovic usa 18x19 no Head Speed Pro — jogo de redirecionamento preciso. Nadal usava 16x19 — topspin pesado. Alcaraz usa 16x20 no Pure Aero VS — híbrido. Cada transição tem implicações no jogo.",
    options: [
      { value: "16x19", label: "Uso 16x19 e quero continuar nessa linha" },
      { value: "18x20_para_aberto", label: "Uso 18x20 e quero mais spin (abrir padrão)" },
      { value: "16x19_para_fechado", label: "Uso 16x19 e quero mais controle (fechar padrão)" },
      { value: "16x20", label: "Quero explorar o 16x20 como meio-termo" },
    ],
  },
  {
    id: "swingweight",
    text: "Como você descreve o seu swing?",
    context: "Swingweight é a sensação de peso ao balançar — não o peso estático. Swingweight acima de 325: muito estável, ótimo para redirecionar bolas pesadas, mas exige condicionamento físico. 310–325: equilíbrio clássico. Abaixo de 305: muito fácil de acelerar, ótimo para spin pesado com técnica vertical.",
    options: [
      { value: "longo", label: "Swing longo e pesado — bato com muita rotação" },
      { value: "compacto", label: "Swing compacto e explosivo — prefiro velocidade de cabeça" },
      { value: "equilibrado", label: "Swing equilibrado — adapto conforme a situação" },
    ],
  },
  {
    id: "lesao_avancado",
    text: "Você tem alguma condição física que afeta seu jogo?",
    context: "Jogadores avançados frequentemente ignoram sinais do corpo. RA acima de 68 + polyester cheio + tensão alta pode estar silenciosamente destruindo os tendões, mesmo sem dor imediata. A combinação mais agressiva para o cotovelo no nível avançado: raquete rígida + poly cheio + swing pesado.",
    options: [
      { value: "sem", label: "Nenhuma — estou 100% saudável" },
      { value: "cotovelo", label: "Tendinite ou histórico de cotovelo" },
      { value: "ombro", label: "Ombro — manguito rotador ou impingement" },
      { value: "costas", label: "Costas ou joelhos — preciso de raquete leve" },
    ],
  },
  {
    id: "corda_atual",
    text: "Que tipo de corda você usa atualmente e em qual tensão?",
    context: "Para avançados: polyester cheio em tensão baixa (44–50 lbs) é o setup moderno mais popular — gera muito spin e dura mais. Mas é o mais agressivo para o cotovelo a longo prazo. Hybrid (poly nas mains + multi nas crosses) equilibra spin e conforto. Gut natural continua sendo a melhor para o braço mas tem custo alto.",
    options: [
      { value: "poly", label: "Polyester cheio (Luxilon, Solinco, etc.)" },
      { value: "hybrid", label: "Hybrid — poly nas mains + multi nas crosses" },
      { value: "multi_gut", label: "Multifilamento ou gut natural" },
      { value: "nao_sei", label: "Não tenho controle do que colocam" },
    ],
  },
];

const JUNIOR_QUESTIONS: QuizQuestion[] = [
  {
    id: "altura",
    text: "Qual é a altura aproximada do seu filho(a)?",
    context: "A altura é o fator mais importante para escolher a raquete certa — mais importante até que a idade. Raquetes muito grandes causam vícios técnicos e podem lesionar o pulso e o cotovelo. Raquetes muito pequenas limitam o desenvolvimento. A medida certa transforma o aprendizado.",
    options: [
      { value: "abaixo_110", label: "Abaixo de 110cm" },
      { value: "110_120", label: "110–120cm" },
      { value: "120_130", label: "120–130cm" },
      { value: "130_140", label: "130–140cm" },
      { value: "140_150", label: "140–150cm" },
      { value: "150_157", label: "150–157cm" },
      { value: "acima_157", label: "Acima de 157cm" },
    ],
  },
  {
    id: "idade",
    text: "Quantos anos tem seu filho(a)?",
    context: "A idade ajuda a contextualizar o estágio de desenvolvimento motor e o tipo de jogo esperado. Crianças altas para a idade podem usar raquetes maiores — mas o resultado sempre prioriza a altura que você informou antes.",
    options: [
      { value: "3_4", label: "3–4 anos" },
      { value: "5_6", label: "5–6 anos" },
      { value: "7_8", label: "7–8 anos" },
      { value: "9_10", label: "9–10 anos" },
      { value: "11_12", label: "11–12 anos" },
      { value: "13_mais", label: "13 anos ou mais" },
    ],
  },
  {
    id: "nivel_junior",
    text: "Como você descreveria o envolvimento do seu filho(a) com o tênis?",
    context: "Isso define o tipo de raquete — e o quanto vale investir. Um iniciante que joga 1x por semana precisa de algo diferente de quem treina 4x e participa de torneios. E não adianta comprar a raquete \"de competição\" se a criança ainda está aprendendo a rebater — pode até atrapalhar.",
    options: [
      { value: "primeiro_contato", label: "Experimentando pela primeira vez — nunca jogou" },
      { value: "recreativo", label: "Aulas recreativas — 1–2x por semana" },
      { value: "regular", label: "Joga regularmente — 3–4x por semana, escolinhas" },
      { value: "competitivo", label: "Jogador competitivo — treina diariamente ou participa de torneios" },
    ],
  },
  {
    id: "queixa",
    text: "Seu filho(a) já reclamou de alguma dor ou desconforto jogando tênis?",
    context: "Crianças raramente verbalizam dores até ficarem sérias. Dores no pulso, cotovelo ou ombro após jogar podem ser sinais de que a raquete está grande demais, pesada demais, ou que o encordoamento está errado. Identifique isso cedo — na criança, esses problemas se desenvolvem rapidamente.",
    options: [
      { value: "sem_queixa", label: "Não, nunca reclamou de dor" },
      { value: "queixa_braco", label: "Às vezes reclama do pulso ou cotovelo depois de jogar" },
      { value: "fadiga_braco", label: "Reclama que a raquete é difícil de mover — fica com o braço cansado" },
      { value: "sem_historico", label: "Nunca jogou o suficiente para avaliar" },
    ],
  },
  {
    id: "objetivo_junior",
    text: "Qual é o principal objetivo de vocês com o tênis agora?",
    context: "Isso afeta o quanto vale investir e qual aspecto priorizar na recomendação — diversão e motor skills para os menores, ou técnica e progressão para os que querem levar o esporte a sério.",
    options: [
      { value: "experimentar", label: "Experimentar o esporte, ver se curte — sem compromisso" },
      { value: "saude_diversao", label: "Atividade saudável, diversão e exercício" },
      { value: "tecnica_futuro", label: "Aprender bem a técnica — possibilidade de competir no futuro" },
      { value: "competicao", label: "Levar o tênis a sério — treinos regulares e competições" },
    ],
  },
];

export function getQuizFlow(level: PlayerLevel): QuizQuestion[] {
  switch (level) {
    case "iniciante":
      return [LEVEL_QUESTION, ...BEGINNER_QUESTIONS];
    case "basico-intermediario":
      return [LEVEL_QUESTION, ...BASIC_INTERMEDIATE_QUESTIONS];
    case "intermediario":
      return [LEVEL_QUESTION, ...INTERMEDIATE_QUESTIONS];
    case "avancado":
      return [LEVEL_QUESTION, ...ADVANCED_QUESTIONS];
    case "junior":
      return [LEVEL_QUESTION, ...JUNIOR_QUESTIONS];
  }
}
