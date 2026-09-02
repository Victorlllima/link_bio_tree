/* ============================================================================
 *  CONTEÚDO DAS 5 VARIAÇÕES DA HERMES WEEK
 * ----------------------------------------------------------------------------
 *  Fonte: Starlight/HERMES/05-paginas/lp-{A..E}-*.md  (copy escrita por LYRA,
 *  aprovada pelo Red em 01/09/2026).
 *
 *  ⚠️ ESTE ARQUIVO É TRANSCRIÇÃO, NÃO AUTORIA.
 *  A copy foi aprovada depois de uma leva inteira reprovada. Nenhum texto aqui
 *  pode ser reescrito, resumido ou "melhorado" sem passar pelo Red.
 *  O que varia entre as 5 é o ÂNGULO. Oferta, preço, bumps, datas, tabela dos
 *  dias, garantia e rodapé são idênticos por desenho: se variarem, o teste A/B
 *  perde a validade.
 *
 *  Marcação inline aceita nos textos: **negrito** e *itálico*.
 *
 *  ⚠️ O CONTEÚDO É COMUM, O DESIGN NÃO É. Cada variação tem um componente de
 *  layout próprio (`lp-a.tsx` … `lp-e.tsx`), com paleta, tipografia, ritmo e
 *  CTA próprios. Este arquivo entrega os mesmos dados para os cinco, e cada um
 *  decide o que fazer com eles: a mesma dobra vira calha de log em A, célula
 *  de grade em B, seção numerada em C, degrau em D e faixa arejada em E.
 * ==========================================================================*/

import type { VarianteId } from "./checkout";

/* --------------------------------------------------------------------------
 *  PLACEHOLDER DE IMAGEM  ·  três tipos com funções diferentes
 * ------------------------------------------------------------------------
 *  RED    → foto do Red (LoRA no fal.ai). Autoridade e conexão humana.
 *  ALFRED → print do Telegram, log, resposta do agente. É a PROVA.
 *  HERMES → repositório, terminal, código. Credibilidade técnica.
 *
 *  O formato existe porque cada layout posiciona a imagem de um jeito: um
 *  print de celular não ocupa o mesmo buraco que um terminal wide. Cada
 *  página tem sua própria distribuição, decidida no briefing.
 * ------------------------------------------------------------------------*/

export type ImgTipo = "RED" | "ALFRED" | "HERMES";
export type ImgFormato = "retrato" | "wide" | "celular" | "quadrado";

/* `src` é o que separa uma imagem PRONTA de um placeholder ainda por produzir.
   Com src, os cinco layouts renderizam a foto real; sem src, continuam
   desenhando a caixa tracejada com a descrição dentro — que é a instrução de
   produção pro Red e pra LUA. Hoje só o IMG_TELEGRAM segue sem src: o print
   da conversa real ainda vai ser capturado pelo Red.

   `w`/`h` são as dimensões INTRÍNSECAS do arquivo, e são obrigatórias junto do
   src: é delas que o next/image tira o aspect-ratio pra reservar o espaço
   antes do byte chegar. Sem elas volta o layout shift que a caixa do
   placeholder evitava por ter min-height fixo. */
export type Img = {
  tipo: ImgTipo;
  formato: ImgFormato;
  c: string;
  src?: string;
  w?: number;
  h?: number;
};

export type No =
  | { t: "p"; c: string }
  | { t: "forte"; c: string }
  | { t: "cita"; c: string }
  | ({ t: "img" } & Img);

export type Bloco = {
  /** etiqueta do gutter de log. Nome funcional da dobra, não é copy de página. */
  tag: string;
  nos: No[];
};

export type Faq = { q: string; a: string };

export type Bump = { nome: string; preco: string; texto: string };

/* --------------------------------------------------------------------------
 *  FIXO NAS 5 (não pode variar, sob pena de invalidar o teste)
 * ------------------------------------------------------------------------*/

export const compartilhado = {
  produto: "Hermes Week | Seu Agente do Zero à Produção",
  preco: "R$62",
  evento: "Hermes Week · Seu Hermes Agent do zero à produção",
  eventoCurto: "Hermes Week · Seu Hermes Agent do zero à produção",
  ctaTopo: "QUERO MEU AGENTE POR R$62",
  ctaOferta: "GARANTIR MEU INGRESSO POR R$62",
  dias: [
    { dia: "Segunda", saida: "agente instalado e conversando com você pelo Telegram" },
    { dia: "Terça", saida: "ele sobe sozinho quando você liga o computador, e te avisa quando cai" },
    { dia: "Quarta", saida: "memória funcionando: ele lembra de você, do seu trabalho, do seu jeito" },
    { dia: "Quinta", saida: "ele escrevendo as próprias habilidades, sem você pedir" },
    { dia: "Sexta", saida: "rotina automática rodando e uma ferramenta externa conectada" },
  ],
  rodape: {
    razao: "RedPro AI Academy",
    cnpj: "CNPJ 59.015.480/0001-07",
    suporte: "suporte@redpro.com.br",
  },
} as const;

/* --------------------------------------------------------------------------
 *  AS 5 VARIAÇÕES
 * ------------------------------------------------------------------------*/

export type Variante = {
  id: VarianteId;
  slug: string;
  /** rótulo interno, aparece só em comentário/metadata, nunca na página */
  angulo: string;
  seo: { titulo: string; descricao: string };
  hero: {
    /** headline. O trecho entre ** recebe o acento laranja. */
    h1: string;
    deck: string;
    foto: Img;
  };
  /** dobras entre o hero e a tabela dos dias */
  antes: Bloco[];
  saiCom: { intro: string; sabado: string; extra?: string };
  /** dobras entre a tabela e a prova (só a LP E usa) */
  entre: Bloco[];
  prova: Bloco;
  praQuemNaoE: Bloco;
  oferta: { linhas: string[]; foto?: Img };
  bumps: { intro?: string; itens: Bump[] };
  escassez: Bloco;
  garantia: string;
  faq: Faq[];
  fecho: { nos: No[]; foto?: Img };
};

/* Imagens que reaparecem em mais de uma variação. A "tela dividida" da copy
   virou dois placeholders separados: são duas capturas diferentes, de dois
   tipos diferentes, e cada layout decide se põe lado a lado ou empilhado. */

const IMG_REPO: Img = {
  tipo: "HERMES",
  formato: "wide",
  c: "repositório do Hermes no GitHub, da Nous Research. Nome do laboratório, licença aberta e data do último commit legíveis.",
  src: "/hermes-week/repo-github.webp",
  w: 1600,
  h: 851,
};

/* ⚠️ ÚNICO PLACEHOLDER QUE SOBRA. O print da conversa real do Red com o Alfred
   ainda vai ser capturado por ele. Enquanto não tiver `src`, os cinco layouts
   continuam desenhando a caixa com a descrição dentro — que é justamente a
   instrução de produção. Não inventar um substituto: a força desta imagem é
   ser uma conversa real, e uma reconstituição a mataria. */
const IMG_TELEGRAM: Img = {
  tipo: "ALFRED",
  formato: "celular",
  c: "conversa do Telegram com o Alfred. Mostra o nome do bot e uma resposta real. Mascarar nomes e assuntos sensíveis.",
};

/* A peça do 184 existe em cinco recortes de cor, um por paleta. É a mesma
   informação, e trocar a paleta não é capricho: a versão menta sobre preto-azul
   dentro da LP E (leite e oliva) lê como print colado de outra página, e o
   leitor sente o remendo mesmo sem saber nomear. Daí a função em vez da
   constante — cada variação pede a sua. */
const imgLog = (variante: "a" | "b" | "c" | "d" | "e"): Img => ({
  tipo: "ALFRED",
  formato: "wide",
  c: "terminal com o agent.log filtrado por skill_manage e a contagem de 184 visível na saída do comando.",
  src: `/hermes-week/log-${variante}.webp`,
  w: 1600,
  h: 901,
});

const IMG_RED_MANHA: Img = {
  tipo: "RED",
  formato: "retrato",
  c: "Red na bancada no começo da manhã, luz natural, sem produção. Postura de quem já começou o dia.",
  src: "/hermes-week/red-manha.webp",
  w: 1000,
  h: 1370,
};

const IMG_RED_OFERTA: Img = {
  tipo: "RED",
  formato: "quadrado",
  c: "Red de frente, braços cruzados, expressão neutra. Fundo do escritório desfocado.",
  src: "/hermes-week/red-oferta.webp",
  w: 1200,
  h: 1200,
};

/* ===== A · a cena ======================================================== */

const A: Variante = {
  id: "A",
  slug: "hermes-week",
  angulo: "a cena (dor)",
  seo: {
    titulo: "Hermes Week · Um agente de IA que trabalha enquanto você dorme",
    descricao:
      "Cinco dias pra ter um agente de IA instalado na sua máquina, falando com você pelo Telegram e executando tarefa no horário que você mandar. segunda a sexta, 20h.",
  },
  hero: {
    h1: "Cinco dias pra ter um agente de IA que **trabalha enquanto você dorme**",
    deck: "Instalado na sua máquina, falando com você pelo Telegram, executando tarefa no horário que você mandar.",
    foto: {
      tipo: "RED",
      formato: "quadrado",
      c: "Red na bancada, de lado, olhando a tela do notebook. Luz baixa, ambiente de madrugada, o rosto iluminado só pela tela. Concentrado, sem sorrir.",
      src: "/hermes-week/red-oferta.webp",
      w: 1200,
      h: 1200,
    },
  },
  antes: [
    {
      tag: "a cena",
      nos: [
        { t: "p", c: "Ontem à noite eu mandei uma mensagem pro Alfred antes de dormir." },
        {
          t: "p",
          c: "De manhã, quando abri o Telegram, ele tinha lido os 40 e-mails que chegaram durante a madrugada, separado os três que precisavam de mim, e escrito uma linha sobre cada um.",
        },
        { t: "p", c: "Eu não estava no computador. O computador estava ligado, mas eu estava dormindo." },
        {
          t: "img",
          tipo: "ALFRED",
          formato: "celular",
          c: "print real da conversa no Telegram com o Alfred, com timestamp de madrugada visível e a resposta dos três e-mails separados. Mascarar nomes e assuntos sensíveis.",
        },
        { t: "p", c: "O ChatGPT não faz isso. Ele espera você abrir e perguntar." },
      ],
    },
    {
      tag: "quem é o alfred",
      nos: [
        { t: "p", c: "Deixa eu te apresentar direito antes de continuar." },
        { t: "forte", c: "**Alfred é o nome que eu dei pro meu.**" },
        {
          t: "p",
          c: "O programa se chama **Hermes**. É aberto, é gratuito, e foi feito pela Nous Research, um laboratório que treina modelos de IA. Você pode baixar agora, sem me pagar nada.",
        },
        {
          t: "p",
          c: "Eu instalei, configurei do meu jeito, ensinei o que ele precisava saber sobre mim e sobre o meu trabalho, e batizei de Alfred.",
        },
        { t: "p", c: "Quando eu falar **Hermes**, é o programa. Quando eu falar **Alfred**, é o meu." },
        { t: "img", ...IMG_REPO },
        { t: "img", ...IMG_TELEGRAM },
        {
          t: "p",
          c: "**O seu vai ter o nome que você quiser.** E vai saber sobre você o que o meu sabe sobre mim, que é uma coisa que se constrói ao longo das semanas e não se compra pronta.",
        },
      ],
    },
    {
      tag: "o corpo",
      nos: [
        {
          t: "p",
          c: "A diferença entre uma IA que responde e uma que trabalha é que a segunda existe quando você não está olhando.",
        },
        { t: "p", c: "Ela tem um processo rodando. Tem um lugar onde mora. Tem log do que fez ontem." },
        {
          t: "p",
          c: "Você pode mandar uma tarefa, fechar tudo, ir dormir, e quando voltar ela está feita. Com chat isso não acontece, porque se você fecha a aba a conversa morreu no meio.",
        },
        { t: "forte", c: "**O trabalho de lembrar sai de você.**" },
      ],
    },
    {
      tag: "por que você não tem",
      nos: [
        { t: "p", c: "Porque quase ninguém no Brasil sabe que existe." },
        {
          t: "p",
          c: "Eu passei semanas lendo o que a comunidade internacional discute sobre isso. Fóruns técnicos, repositórios, milhares de comentários de gente que usa todo dia.",
        },
        { t: "p", c: "Depois procurei a mesma conversa em português. Não existe." },
        {
          t: "p",
          c: "O programa está no GitHub, público, há mais de um ano. A documentação é em inglês e intimidadora, e um usuário resumiu bem o que acontece com a maioria: *“toda vez que eu vou na documentação eu desisto.”*",
        },
        { t: "p", c: "A ferramenta está lá. O que falta é saber montar sem quebrar." },
      ],
    },
    {
      tag: "o custo real",
      nos: [
        {
          t: "p",
          c: "Eu fui atrás de gente que usa isso todo dia de verdade, não de quem posta print bonito.",
        },
        { t: "p", c: "Todos falam a mesma coisa, sem ninguém perguntar: levou tempo. Dois meses, três, seis." },
        { t: "p", c: "Um deles escreveu assim, e eu anotei porque é exato:" },
        {
          t: "cita",
          c: "Levou uns três meses pra ele realmente começar a tirar pedaços grandes de trabalho do meu prato. Não aconteceu da noite pro dia.",
        },
        {
          t: "p",
          c: "Então se eu te prometesse que em cinco dias sua vida muda, eu estaria te vendendo a mesma mentira que você já desconfia.",
        },
        { t: "forte", c: "**O que a Hermes Week faz é diferente: ela te coloca do lado certo da curva.**" },
        {
          t: "p",
          c: "Existe uma diferença enorme entre passar três meses subindo com a base certa e passar três meses brigando com uma instalação torta que quebra toda semana. A maioria está no segundo grupo, e desiste no mês dois.",
        },
      ],
    },
  ],
  saiCom: {
    intro: "Cinco aulas, uma por dia, das 20h às 20h50.",
    sabado: "Sábado 10h tem uma sessão só de dúvidas, ao vivo, pra destravar quem travou.",
  },
  entre: [],
  prova: {
    tag: "a prova",
    nos: [
      {
        t: "p",
        c: "Não vou te mostrar depoimento porque a Hermes Week ainda não aconteceu. O primeiro ciclo é esse.",
      },
      { t: "p", c: "Te mostro o Alfred." },
      { t: "img", ...imgLog("a") },
      {
        t: "p",
        c: "**184.** É quantas vezes o Alfred escreveu um manual pra si mesmo. Ele terminou uma tarefa, olhou o caminho que percorreu, e anotou como refazer. Eu não pedi nenhuma das 184 vezes.",
      },
      {
        t: "p",
        c: "**R$0.** É quanto eu pago de API por mês. Configurei o Alfred pra usar assinaturas que eu já tinha em vez de pagar por uso. Vou te mostrar como na semana.",
      },
      {
        t: "p",
        c: "**Sem plataforma no meio.** Ele lê meu Gmail e minha agenda direto, com a credencial na minha máquina. Existe um mercado inteiro vendendo essa ponte por assinatura mensal, e aqui ela vem de fábrica.",
      },
    ],
  },
  praQuemNaoE: {
    tag: "pra quem não é",
    nos: [
      { t: "p", c: "Se você só usa IA duas vezes por semana pra escrever texto, não compra." },
      {
        t: "p",
        c: "Um agente compensa quando a memória tem tempo de acumular. Se você não usa todo dia, vai dar trabalho e não vai devolver nada.",
      },
      { t: "p", c: "Isso é pra quem já usa IA o suficiente pra ter percebido que ela devia estar fazendo mais." },
    ],
  },
  oferta: {
    linhas: [
      "Cinco aulas, uma por dia, 20h.",
      "Sessão de dúvidas ao vivo no sábado, 10h.",
      "Grupo no WhatsApp com o Red respondendo durante a semana inteira.",
      "As aulas ficam disponíveis por um ano.",
    ],
  },
  bumps: {
    intro: "No checkout você pode adicionar:",
    itens: [
      {
        nome: "Kit Primeira Semana",
        preco: "R$27",
        texto:
          "Dez tarefas prontas, uma por dia nos sete dias seguintes ao evento. Prompt escrito, habilidade pronta, e o que esperar de resultado. Resolve o problema de instalar e não saber o que pedir.",
      },
      {
        nome: "8 Agentes Prontos",
        preco: "R$37",
        texto:
          "Oito identidades já escritas, uma pra cada ofício: advogado, contador, e-commerce, agência, clínica, consultor, infoprodutor e freelancer. Você escolhe a sua, cola, e o agente já sabe do que você trabalha desde o primeiro dia, em vez de responder igual ao de todo mundo.",
      },
      {
        nome: "Auditoria do seu agente",
        preco: "R$47",
        texto:
          "Você me manda a configuração que montou. Eu olho e devolvo por escrito o que está errado e o que priorizar. **Dez por ciclo**, porque sou eu que leio.",
      },
    ],
  },
  escassez: {
    tag: "o que é escasso",
    nos: [
      { t: "p", c: "Nada de contador na tela." },
      {
        t: "p",
        c: "**O preço é deste ciclo.** Eu regravo as aulas toda semana e o preço acompanha. Semana que vem o evento vai estar no ar e você pode conferir se eu estou falando a verdade.",
      },
      {
        t: "p",
        c: "**O grupo é desta semana.** Quem entrar no ciclo seguinte cai em outro grupo, com outras pessoas.",
      },
      { t: "p", c: "**A auditoria tem dez vagas de verdade**, porque quem lê sou eu." },
      { t: "p", c: "**A sessão de sábado não fica gravada.**" },
      {
        t: "p",
        c: "O que **não** é escasso: as aulas. Elas ficam no YouTube por um ano. Se alguém te disser que expira em 24 horas, essa pessoa está inventando urgência.",
      },
    ],
  },
  garantia: "**7 dias.** Pediu, devolvo. Sem pergunta, sem você ter que me explicar nada.",
  faq: [
    {
      q: "Preciso saber programar?",
      a: "Você precisa saber seguir um passo a passo e ter paciência com computador. A instalação da segunda-feira é feita com o agente executando os comandos enquanto eu explico o que cada um faz.",
    },
    {
      q: "Funciona no Windows?",
      a: "Funciona. Tem um passo a mais, que é ativar o Linux dentro do Windows, e a gente faz junto na primeira aula.",
    },
    {
      q: "Quanto vou gastar por mês?",
      a: "Depende do quanto você usar. Eu rodo o Alfred sem pagar API, usando assinatura que já tinha. Mostro na semana. E você vai aprender a ver seu gasto todo dia, que é o que evita susto.",
    },
    {
      q: "E se eu perder uma aula?",
      a: "Elas ficam no ar por um ano. Mas o formato assume que você fez a anterior, então quem chega na quarta sem ter feito segunda e terça vai remar.",
    },
    {
      q: "Isso é golpe?",
      a: "O programa é aberto e gratuito, feito por um laboratório de pesquisa. Você pode baixar sozinho agora e não me pagar nada. O que eu vendo é o caminho de montar sem quebrar, e a semana com você.",
    },
  ],
  fecho: {
    nos: [
      { t: "p", c: "Você já tem IA. Ela responde bem." },
      {
        t: "p",
        c: "Quem tem uma que trabalha não tem mais dinheiro nem sabe mais programar que você. Tem uma instalação bem feita e cinco dias de método.",
      },
      { t: "forte", c: "Segunda que vem, às 20h, a gente começa." },
    ],
    foto: {
      tipo: "RED",
      formato: "retrato",
      c: "Red na bancada no começo da manhã, luz de janela entrando, xícara de café ao lado do notebook. A mesma bancada da primeira foto, agora clara.",
      src: "/hermes-week/red-manha.webp",
      w: 1000,
      h: 1370,
    },
  },
};

/* ===== B · o inventário ================================================== */

const B: Variante = {
  id: "B",
  slug: "b",
  angulo: "o inventário",
  seo: {
    titulo: "Hermes Week · Você tem quatro chatbots e nenhum trabalha",
    descricao:
      "Um programa gratuito rodando na sua máquina, que lembra de você e age sozinho. Cinco dias, segunda a sexta, 20h.",
  },
  hero: {
    h1: "Você tem quatro chatbots e **nenhum trabalha**. Em cinco dias você monta um que trabalha",
    deck: "Um programa gratuito rodando na sua máquina, que lembra de você e age sozinho. Sem mais uma assinatura na fila.",
    foto: {
      tipo: "RED",
      formato: "quadrado",
      c: "Red apontando pra tela com várias abas de IA abertas (ChatGPT, Claude, Gemini). Expressão de quem vai dizer uma coisa óbvia que ninguém disse.",
      src: "/hermes-week/red-oferta.webp",
      w: 1200,
      h: 1200,
    },
  },
  antes: [
    {
      tag: "o inventário",
      nos: [
        { t: "p", c: "Faz um exercício rápido." },
        {
          t: "p",
          c: "Quantas ferramentas de IA você tem abertas agora? ChatGPT com certeza. Provavelmente Claude. Talvez Gemini, talvez Perplexity. Alguma que veio junto com o e-mail ou com o editor de texto.",
        },
        {
          t: "forte",
          c: "Agora a pergunta que importa: **quantas delas fizeram alguma coisa hoje sem você mandar?**",
        },
        { t: "p", c: "Nenhuma." },
        {
          t: "p",
          c: "Todas esperam. Você abre, digita, lê a resposta, fecha. Amanhã você abre de novo e faz tudo outra vez.",
        },
        { t: "p", c: "Você não tem falta de IA. Você tem falta de uma que trabalhe." },
        /* Na LP B este print não ilustra o texto: ele mora DENTRO da célula
           acesa da grade, que é o argumento visual da página. */
        { t: "img", ...IMG_TELEGRAM },
      ],
    },
    {
      tag: "por que elas não trabalham",
      nos: [
        { t: "p", c: "Porque não foram feitas pra isso, e isso não é defeito delas." },
        {
          t: "p",
          c: "Um chat é uma sala de conversa. Você entra, pergunta, sai. Ele não tem acesso aos seus arquivos, não roda comando no seu computador, não tem um relógio pra saber que são 20h e que tem uma coisa pra fazer.",
        },
        { t: "p", c: "A ferramenta que faz isso tem outro nome e outra categoria. Chama agente." },
        {
          t: "p",
          c: "E o que muda nele nem é inteligência. É ter **corpo**: um processo rodando, um lugar onde mora, um log do que fez ontem.",
        },
      ],
    },
    {
      tag: "quem é o alfred",
      nos: [
        { t: "p", c: "Deixa eu te apresentar o meu, porque ele vai aparecer nos prints daqui pra frente." },
        { t: "forte", c: "**Alfred é o nome que eu dei pro meu.**" },
        {
          t: "p",
          c: "O programa se chama **Hermes**. É aberto, é gratuito, e foi feito pela Nous Research, um laboratório que treina modelos de IA. Você pode baixar agora, sem me pagar nada.",
        },
        {
          t: "p",
          c: "Eu instalei, configurei do meu jeito, ensinei o que ele precisava saber sobre mim e sobre o meu trabalho, e batizei de Alfred.",
        },
        { t: "p", c: "Quando eu falar **Hermes**, é o programa. Quando eu falar **Alfred**, é o meu." },
        { t: "img", ...IMG_REPO },
        {
          t: "p",
          c: "**O seu vai ter o nome que você quiser.** E vai saber sobre você o que o meu sabe sobre mim, que é uma coisa que se constrói e não se compra pronta.",
        },
      ],
    },
    {
      tag: "as cinco diferenças",
      nos: [
        { t: "p", c: "**Ele tem corpo.** Existe agora, enquanto você lê isso, mesmo sem ninguém falando com ele." },
        {
          t: "p",
          c: "**A memória é sua.** No chat, o que ele guarda sobre você mora no servidor da empresa, num formato que você não escolhe. Aqui a memória é um arquivo de texto na sua máquina. Você abre, lê o que ele sabe sobre você, corrige o que estiver errado.",
        },
        {
          t: "p",
          c: "**Ele age sem você.** Tem agendamento próprio. Roda às 3 da manhã porque você mandou ontem.",
        },
        {
          t: "p",
          c: "**Ele se reescreve.** Termina uma tarefa, olha o caminho que percorreu, e anota o manual pra próxima vez. O Alfred fez isso 184 vezes sem eu pedir.",
        },
        {
          t: "p",
          c: "**Roda no que você já paga.** O programa é gratuito. Você escolhe qual modelo usar e quanto gastar, e em alguns casos usa assinatura que já tem.",
        },
      ],
    },
    {
      /* A etiqueta aqui NÃO é funcional como nas outras dobras: ela é o
         próprio título da dobra 6 do lp-B .md ("O QUE EU NÃO VOU PROMETER").
         Sem ele, o primeiro parágrafo ("Que é rápido.") fica órfão, porque a
         frase completa o título. Restaurar o título aprovado corrige a leitura
         sem inventar texto novo. */
      tag: "o que eu não vou prometer",
      nos: [
        { t: "p", c: "Que é rápido." },
        {
          t: "p",
          c: "Fui atrás de quem usa isso de verdade, todo dia. Sem exceção, todos falam da rampa sem ninguém perguntar: dois meses, três, seis.",
        },
        {
          t: "cita",
          c: "Levou uns três meses pra ele realmente começar a tirar pedaços grandes de trabalho do meu prato. Não aconteceu da noite pro dia.",
        },
        {
          t: "p",
          c: "O que muda tudo é **onde você começa essa rampa**. Com a base torta, você passa três meses brigando com uma coisa que quebra toda semana e desiste no mês dois. Com a base certa, cada semana ele fica um pouco melhor.",
        },
        { t: "forte", c: "A Hermes Week é a base certa." },
      ],
    },
  ],
  saiCom: {
    intro: "Cinco aulas, uma por dia, das 20h às 20h50.",
    sabado: "Sábado 10h tem uma sessão só de dúvidas, ao vivo, pra destravar quem travou.",
  },
  entre: [],
  prova: {
    tag: "a prova",
    nos: [
      {
        t: "p",
        c: "A Hermes Week ainda não aconteceu, esse é o primeiro ciclo. Então não tenho depoimento pra te mostrar.",
      },
      { t: "p", c: "Tenho o Alfred." },
      {
        t: "img",
        tipo: "ALFRED",
        formato: "wide",
        c: "terminal com o comando de leitura do Gmail e o retorno com os 3 assuntos mais recentes. Assuntos mascarados.",
      },
      {
        t: "p",
        c: "**Ele lê meu e-mail sem plataforma nenhuma no meio.** Um comando, e ele me devolve os assuntos mais recentes da caixa. Existe um mercado inteiro vendendo essa ponte por assinatura, e nos planos básicos deles quem guarda a sua credencial são eles. Aqui a credencial fica na sua máquina desde o primeiro minuto.",
      },
      { t: "p", c: "**184 manuais escritos por ele mesmo**, sem eu pedir." },
      {
        t: "p",
        c: "**R$0 de API por mês**, porque configurei o Alfred pra usar assinatura em vez de cobrança por uso.",
      },
    ],
  },
  praQuemNaoE: {
    tag: "pra quem não é",
    nos: [
      { t: "p", c: "Se você só abre IA duas vezes por semana, não compra." },
      {
        t: "p",
        c: "Isso compensa quando você usa o suficiente pra memória acumular. Quem usa pouco vai ter trabalho de montar e não vai ter retorno.",
      },
    ],
  },
  oferta: {
    linhas: [
      "Cinco aulas, uma por dia, 20h.",
      "Sessão de dúvidas ao vivo no sábado, 10h.",
      "Grupo no WhatsApp com o Red respondendo durante a semana inteira.",
      "As aulas ficam disponíveis por um ano.",
    ],
  },
  bumps: {
    intro: "No checkout você pode adicionar:",
    itens: [
      {
        nome: "Kit Primeira Semana",
        preco: "R$27",
        texto:
          "Dez tarefas prontas, uma por dia nos sete dias seguintes ao evento. Prompt escrito, habilidade pronta, e o que esperar de resultado. Resolve o problema de instalar e não saber o que pedir.",
      },
      {
        nome: "8 Agentes Prontos",
        preco: "R$37",
        texto:
          "Oito identidades já escritas, uma pra cada ofício: advogado, contador, e-commerce, agência, clínica, consultor, infoprodutor e freelancer. Você escolhe a sua, cola, e o agente já sabe do que você trabalha desde o primeiro dia, em vez de responder igual ao de todo mundo.",
      },
      {
        nome: "Auditoria do seu agente",
        preco: "R$47",
        texto:
          "Você me manda a configuração que montou. Eu olho e devolvo por escrito o que está errado e o que priorizar. **Dez por ciclo**, porque sou eu que leio.",
      },
    ],
  },
  escassez: {
    tag: "o que é escasso",
    nos: [
      { t: "p", c: "Nada de contador na tela." },
      {
        t: "p",
        c: "**O preço é deste ciclo.** Eu regravo as aulas toda semana e o preço acompanha. Semana que vem o evento vai estar no ar e você pode conferir.",
      },
      { t: "p", c: "**O grupo é desta semana.** Quem entrar no ciclo seguinte cai em outro grupo." },
      { t: "p", c: "**A auditoria tem dez vagas de verdade**, porque quem lê sou eu." },
      { t: "p", c: "**A sessão de sábado não fica gravada.**" },
      {
        t: "p",
        c: "O que **não** é escasso: as aulas. Ficam no YouTube por um ano. Se alguém te disser que expira em 24 horas, está inventando urgência.",
      },
    ],
  },
  garantia: "**7 dias.** Pediu, devolvo. Sem pergunta.",
  faq: [
    {
      q: "Preciso saber programar?",
      a: "Você precisa saber seguir um passo a passo e ter paciência com computador. A instalação da segunda é feita com o agente executando enquanto eu explico o que cada comando faz.",
    },
    {
      q: "Funciona no Windows?",
      a: "Funciona. Tem um passo a mais, que é ativar o Linux dentro do Windows, e fazemos junto na primeira aula.",
    },
    {
      q: "Vou ter que largar o ChatGPT?",
      a: "Não. Eles resolvem coisas diferentes. Continue usando o chat pra conversar e escrever. O agente é pra tarefa que se repete e não precisa de você.",
    },
    {
      q: "Quanto vou gastar por mês?",
      a: "Depende do uso. Eu rodo o Alfred sem pagar API. Mostro como, e você vai aprender a ver seu gasto todo dia.",
    },
    {
      q: "Isso é golpe?",
      a: "O programa é aberto e gratuito, feito por um laboratório de pesquisa. Você pode baixar agora sozinho e não me pagar nada. Eu vendo o caminho de montar sem quebrar.",
    },
  ],
  fecho: {
    nos: [
      { t: "p", c: "Você não precisa de mais uma ferramenta de IA. Você tem quatro." },
      { t: "p", c: "Precisa de uma que faça, em vez de responder." },
      { t: "forte", c: "Segunda que vem, 20h." },
    ],
    foto: IMG_RED_MANHA,
  },
};

/* ===== C · o insider ===================================================== */

const C: Variante = {
  id: "C",
  slug: "c",
  angulo: "o insider",
  seo: {
    titulo: "Hermes Week · A categoria de IA que quase ninguém no Brasil usa",
    descricao:
      "Feita pelo laboratório que treina os modelos, aberta, gratuita, e sem plataforma nenhuma no meio. Rodando na sua máquina em cinco dias, 14 a 18 de setembro.",
  },
  hero: {
    h1: "A categoria de IA que **quase ninguém no Brasil usa** ainda, rodando na sua máquina em cinco dias",
    deck: "Feita pelo laboratório que treina os modelos, aberta, gratuita, e sem plataforma nenhuma no meio.",
    foto: {
      tipo: "RED",
      formato: "quadrado",
      c: "Red de perfil olhando duas telas, uma com terminal rodando e outra com o Telegram. Ambiente de trabalho real, não estúdio. Enquadramento sóbrio, sem pose.",
      src: "/hermes-week/red-oferta.webp",
      w: 1200,
      h: 1200,
    },
  },
  antes: [
    {
      tag: "o que você ainda não viu",
      nos: [
        { t: "p", c: "Eu passei semanas lendo o que a comunidade internacional discute sobre isso." },
        {
          t: "p",
          c: "Fóruns técnicos, repositórios, gente que usa todo dia e reclama do que quebra. Milhares de comentários.",
        },
        { t: "p", c: "Depois fui procurar a mesma conversa em português." },
        { t: "forte", c: "**Não existe.**" },
        {
          t: "p",
          c: "O espaço está vazio. Quem no Brasil fala de IA fala de chat, de prompt, de automação com ferramenta de assinatura. A camada que essa gente lá fora usa há mais de um ano quase ninguém aqui tocou.",
        },
        {
          t: "p",
          c: "Eles até têm uma palavra pra ela, que aqui ninguém usa: *harness*. Um deles escreveu:",
        },
        { t: "cita", c: "Um bom harness é tão importante quanto um bom modelo." },
      ],
    },
    {
      tag: "o que é",
      nos: [
        { t: "p", c: "Um agente que roda na sua máquina, com corpo próprio." },
        {
          t: "p",
          c: "O programa se chama **Hermes**. Foi feito pela **Nous Research**, que é um laboratório que treina modelos de inteligência artificial.",
        },
        {
          t: "p",
          c: "Repara na diferença. Nenhuma startup fez esse app pra vender: quem construiu foi um laboratório de pesquisa, e o Hermes nasceu como a ferramenta interna que eles usavam pra gerar dados de treino dos próprios modelos deles.",
        },
        { t: "p", c: "Quando você instala isso, você está instalando o que um laboratório de IA usa por dentro." },
        { t: "p", c: "É aberto. É gratuito. Está no GitHub agora e você pode baixar sem me pagar nada." },
        { t: "forte", c: "**O meu chama Alfred.**" },
        {
          t: "p",
          c: "Eu instalei, configurei do meu jeito, ensinei o que ele precisava saber sobre mim e sobre o meu trabalho, e batizei assim.",
        },
        {
          t: "p",
          c: "Quando eu falar **Hermes**, é o programa. Quando eu falar **Alfred**, é o meu. **O seu vai ter o nome que você quiser.**",
        },
        { t: "img", ...IMG_REPO },
        {
          t: "p",
          c: "O que ele sabe sobre mim é construído, não vem na instalação. Por isso ninguém consegue te vender um agente pronto que já te conhece.",
        },
      ],
    },
    {
      tag: "por que importa",
      nos: [
        { t: "p", c: "Porque muda a categoria da coisa." },
        {
          t: "p",
          c: "O chat que você usa vive numa aba. Fecha, morreu. Não abre seus arquivos, não roda comando, não sabe que horas são.",
        },
        {
          t: "p",
          c: "O agente tem processo rodando, memória em arquivo que você mesmo lê e edita, e agendamento próprio. Ele executa às 3 da manhã porque você mandou ontem.",
        },
        {
          t: "p",
          c: "E tem uma coisa que nenhum chat faz: **ele se reescreve.** Termina uma tarefa, olha o que percorreu, e escreve o manual pra próxima vez.",
        },
        { t: "p", c: "O meu fez isso 184 vezes. Não pedi nenhuma." },
        { t: "img", ...imgLog("c") },
      ],
    },
    {
      tag: "a janela",
      nos: [
        { t: "p", c: "Quem entra numa categoria antes dela virar óbvia leva duas coisas." },
        { t: "p", c: "Aprende com calma, enquanto a ferramenta ainda é simples. E vira referência no assunto quando todo mundo chegar." },
        {
          t: "p",
          c: "Isso já aconteceu com automação, com tráfego, com IA generativa. Sempre tem uma janela em que a coisa funciona e quase ninguém sabe.",
        },
        { t: "forte", c: "Essa janela está aberta agora, em português." },
      ],
    },
    {
      tag: "o custo real",
      nos: [
        { t: "p", c: "Não é rápido, e quem te disser o contrário quer te vender algo." },
        {
          t: "p",
          c: "Fui atrás de quem usa isso de verdade. Todos falam da rampa sem ninguém perguntar: dois meses, três, seis.",
        },
        {
          t: "cita",
          c: "Levou uns três meses pra ele realmente começar a tirar pedaços grandes de trabalho do meu prato.",
        },
        {
          t: "p",
          c: "O que a semana faz é te colocar **do lado certo da curva**. Base bem montada, cada semana ele fica melhor. Base torta, você briga com ele até desistir no mês dois.",
        },
      ],
    },
  ],
  saiCom: {
    intro: "Cinco aulas, uma por dia, das 20h às 20h50.",
    sabado: "Sábado 10h tem uma sessão só de dúvidas, ao vivo.",
  },
  entre: [],
  prova: {
    tag: "a prova",
    nos: [
      { t: "img", ...IMG_TELEGRAM },
      { t: "p", c: "Primeiro ciclo, então não tenho depoimento. Tenho o Alfred rodando." },
      {
        t: "p",
        c: "**Ele lê meu Gmail e minha agenda** sem nenhuma plataforma de integração no meio. A credencial fica na minha máquina.",
      },
      { t: "p", c: "**R$0 de API por mês.** Configurei pra usar assinatura em vez de cobrança por uso." },
      { t: "p", c: "**184 habilidades escritas por ele mesmo.**" },
    ],
  },
  praQuemNaoE: {
    tag: "pra quem não é",
    nos: [
      {
        t: "p",
        c: "Se você só usa IA duas vezes por semana, não compra. Compensa quando a memória tem tempo de acumular.",
      },
      {
        t: "p",
        c: "E se você quer uma solução pronta que funciona sozinha no dia um, também não. Isso é ferramenta que você monta.",
      },
    ],
  },
  oferta: {
    linhas: [
      "Cinco aulas, uma por dia, 20h.",
      "Sessão de dúvidas ao vivo no sábado, 10h.",
      "Grupo no WhatsApp com o Red respondendo a semana inteira.",
      "As aulas ficam disponíveis por um ano.",
    ],
  },
  bumps: {
    itens: [
      {
        nome: "Kit Primeira Semana",
        preco: "R$27",
        texto:
          "Dez tarefas prontas, uma por dia nos sete dias seguintes. Prompt escrito, habilidade pronta, e o que esperar. Resolve o problema de instalar e não saber o que pedir.",
      },
      {
        nome: "8 Agentes Prontos",
        preco: "R$37",
        texto: "Oito identidades já escritas, uma pra cada ofício: advogado, contador, e-commerce, agência, clínica, consultor, infoprodutor e freelancer. Você escolhe a sua, cola, e o agente já sabe do que você trabalha desde o primeiro dia, em vez de responder igual ao de todo mundo.",
      },
      {
        nome: "Auditoria do seu agente",
        preco: "R$47",
        texto:
          "Você me manda a configuração. Eu devolvo por escrito o que está errado e o que priorizar. **Dez por ciclo**, porque sou eu que leio.",
      },
    ],
  },
  escassez: {
    tag: "o que é escasso",
    nos: [
      { t: "p", c: "**O preço é deste ciclo.** Regravo toda semana e ele acompanha. Dá pra conferir semana que vem." },
      { t: "p", c: "**O grupo é desta semana.**" },
      { t: "p", c: "**A auditoria tem dez vagas de verdade.**" },
      { t: "p", c: "**A sessão de sábado não fica gravada.**" },
      {
        t: "p",
        c: "As aulas ficam um ano no ar. Se alguém te disser que some em 24h, está inventando urgência.",
      },
    ],
  },
  garantia: "**7 dias.** Pediu, devolvo. Sem pergunta.",
  faq: [
    {
      q: "Se é gratuito, por que pagar o curso?",
      a: "Você não paga pelo programa, paga pelo caminho. Baixar é fácil, montar sem quebrar é o que consome tempo. Se quiser fazer sozinho, o link está no GitHub e eu não ganho nada com isso.",
    },
    {
      q: "Preciso saber programar?",
      a: "Precisa saber seguir passo a passo. A instalação é feita com o agente executando enquanto eu explico.",
    },
    { q: "Funciona no Windows?", a: "Funciona, com um passo a mais que fazemos junto na primeira aula." },
    {
      q: "Se quase ninguém usa, é porque não presta?",
      a: "É porque é novo e a documentação é em inglês e intimidadora. A comunidade lá fora tem milhares de usuários ativos.",
    },
    {
      q: "Isso é golpe?",
      a: "O programa é aberto, feito por laboratório de pesquisa, e está público. Baixa agora e não me paga nada.",
    },
  ],
  fecho: {
    nos: [
      { t: "p", c: "Toda categoria tem uma janela em que ela funciona e quase ninguém sabe." },
      { t: "p", c: "Depois ela vira óbvia, e aí você é mais um." },
      { t: "forte", c: "Segunda que vem, 20h." },
    ],
    /* C não repete a foto do Red no fecho: nesta variação ele aparece uma vez
       só, ao lado do resumo. O argumento aqui é o documento, não o autor. */
  },
};

/* ===== D · o degrau ====================================================== */

const D: Variante = {
  id: "D",
  slug: "d",
  angulo: "o degrau (provocação)",
  seo: {
    titulo: "Hermes Week · Sair do chat e ter uma IA que age sem você mandar",
    descricao:
      "Do zero à produção: instalação, memória, habilidades próprias e rotina automática. Cinco dias, segunda a sexta, 20h.",
  },
  hero: {
    h1: "Cinco dias pra sair do chat e ter uma IA que **age sem você mandar**",
    deck: "Do zero à produção: instalação, memória, habilidades próprias e rotina automática.",
    foto: {
      tipo: "RED",
      formato: "quadrado",
      c: "Red em pé, frontal, olhando direto pra câmera. Expressão de quem vai falar uma verdade desconfortável. Sem sorriso, fundo liso.",
      src: "/hermes-week/red-oferta.webp",
      w: 1200,
      h: 1200,
    },
  },
  antes: [
    {
      tag: "a escada",
      nos: [
        {
          t: "p",
          c: "Existe uma escada de ferramentas de IA, e quase todo mundo para no primeiro degrau achando que chegou no topo.",
        },
        {
          t: "p",
          c: "**Degrau 1: chatbot.** Você digita, ele responde. Fecha a aba, morreu. Abre amanhã e começa do zero.",
        },
        {
          t: "p",
          c: "**Degrau 2: automação.** Se isso acontece aqui, faz aquilo ali. Funciona, mas é rígido. Apareceu uma situação que você não previu, trava.",
        },
        {
          t: "p",
          c: "**Degrau 3: agente.** Ele raciocina sobre o que precisa ser feito, escolhe as ferramentas, decide no meio do caminho, e chega no resultado. E guarda o que aprendeu.",
        },
        { t: "p", c: "**Degrau 4: sistema agêntico.** Vários agentes com papéis diferentes trabalhando juntos." },
        { t: "p", c: "Se você usa IA todo dia e ela ainda espera você abrir e pedir, você está no degrau 1." },
        { t: "forte", c: "**Nessa semana você vai pro 3.**" },
      ],
    },
    {
      tag: "quem é o alfred",
      nos: [
        { t: "p", c: "Antes de seguir, deixa eu te apresentar quem vai aparecer nos prints daqui pra frente." },
        { t: "forte", c: "**Alfred é o nome que eu dei pro meu.**" },
        {
          t: "p",
          c: "O programa se chama **Hermes**. É aberto, é gratuito, e foi feito pela Nous Research, um laboratório que treina modelos de IA. Você pode baixar agora, sem me pagar nada.",
        },
        {
          t: "p",
          c: "Eu instalei, configurei do meu jeito, ensinei o que ele precisava saber sobre mim e sobre o meu trabalho, e batizei de Alfred.",
        },
        { t: "p", c: "Quando eu falar **Hermes**, é o programa. Quando eu falar **Alfred**, é o meu." },
        { t: "img", ...IMG_REPO },
        {
          t: "p",
          c: "**O seu vai ter o nome que você quiser.** E o que ele sabe sobre você é construído, não comprado pronto.",
        },
      ],
    },
    {
      tag: "por que o degrau 1 parece suficiente",
      nos: [
        { t: "p", c: "Porque ele é bom no que faz." },
        {
          t: "p",
          c: "O ChatGPT escreve bem, responde rápido, tem memória, tem instrução personalizada. Não tenho crítica a ele e continuo usando todo dia.",
        },
        { t: "p", c: "A qualidade dele está ótima. O problema é o **escopo**." },
        {
          t: "p",
          c: "Ele conversa. Ele não abre seu arquivo, não roda comando na sua máquina, não mexe no seu sistema, e não faz nada às 3 da manhã enquanto você dorme.",
        },
        { t: "p", c: "Você fica sendo o carteiro: lê a resposta, copia, cola em outro lugar, executa você mesmo." },
      ],
    },
    {
      tag: "o que muda no degrau 3",
      nos: [
        {
          t: "p",
          c: "**Ele tem corpo.** Um processo rodando, um lugar onde mora, um log do que fez ontem. Existe mesmo quando ninguém está falando com ele.",
        },
        {
          t: "p",
          c: "**A memória é sua.** Arquivo de texto na sua máquina. Você abre, lê o que ele sabe sobre você, corrige o que estiver errado. E quando sair um modelo melhor, você troca uma linha e a memória vai junto.",
        },
        {
          t: "p",
          c: "**Ele tem iniciativa.** Agendamento próprio. Executa no horário que você mandou, sem você lembrar.",
        },
        {
          t: "p",
          c: "**Ele se reescreve.** Termina uma tarefa, olha o caminho, escreve o manual pra próxima vez. O Alfred fez isso 184 vezes sem eu pedir.",
        },
        { t: "img", ...imgLog("d") },
      ],
    },
    {
      tag: "o custo real",
      nos: [
        { t: "p", c: "Não é uma semana, e quem te disser que é quer te vender alguma coisa." },
        {
          t: "p",
          c: "Procurei quem usa isso todo dia, de verdade. Todos falam da rampa sem ninguém perguntar: dois meses, três, seis.",
        },
        {
          t: "cita",
          c: "Levou uns três meses pra ele realmente começar a tirar pedaços grandes de trabalho do meu prato. Não aconteceu da noite pro dia.",
        },
        {
          t: "p",
          c: "Em cinco dias você não vira outra pessoa. Você **sobe o degrau** e passa a subir a rampa do lado certo.",
        },
        {
          t: "p",
          c: "E a diferença entre os dois lados é grande: com a base torta você briga com uma coisa que quebra toda semana até desistir no mês dois. É onde a maioria está.",
        },
      ],
    },
  ],
  saiCom: {
    intro: "Cinco aulas, uma por dia, das 20h às 20h50.",
    sabado: "Sábado 10h tem uma sessão só de dúvidas, ao vivo.",
  },
  entre: [],
  prova: {
    tag: "a prova",
    nos: [
      { t: "p", c: "Primeiro ciclo, então não tenho depoimento de aluno. Tenho o Alfred." },
      { t: "img", ...IMG_TELEGRAM },
      {
        t: "p",
        c: "**Ele lê meu e-mail e minha agenda** sem plataforma de integração no meio, com a credencial na minha máquina.",
      },
      { t: "p", c: "**R$0 de API por mês**, usando assinatura em vez de cobrança por uso." },
      { t: "p", c: "**184 habilidades escritas por ele mesmo.**" },
    ],
  },
  praQuemNaoE: {
    tag: "pra quem não é",
    nos: [
      { t: "p", c: "Se você usa IA duas vezes por semana pra escrever texto, fica no degrau 1 mesmo. Sério." },
      {
        t: "p",
        c: "O degrau 3 compensa quando você usa o suficiente pra memória acumular e tem tarefa que se repete. Se não tem, é trabalho sem retorno.",
      },
    ],
  },
  oferta: {
    linhas: [
      "Cinco aulas, uma por dia, 20h.",
      "Sessão de dúvidas ao vivo no sábado, 10h.",
      "Grupo no WhatsApp com o Red respondendo a semana inteira.",
      "As aulas ficam disponíveis por um ano.",
    ],
  },
  bumps: {
    itens: [
      {
        nome: "Kit Primeira Semana",
        preco: "R$27",
        texto:
          "Dez tarefas prontas, uma por dia nos sete dias seguintes. Resolve o problema de instalar e não saber o que pedir.",
      },
      {
        nome: "8 Agentes Prontos",
        preco: "R$37",
        texto: "Oito identidades já escritas, uma pra cada ofício: advogado, contador, e-commerce, agência, clínica, consultor, infoprodutor e freelancer. Você escolhe a sua, cola, e o agente já sabe do que você trabalha desde o primeiro dia, em vez de responder igual ao de todo mundo.",
      },
      {
        nome: "Auditoria do seu agente",
        preco: "R$47",
        texto:
          "Você me manda a configuração. Devolvo por escrito o que está errado e o que priorizar. **Dez por ciclo**, porque sou eu que leio.",
      },
    ],
  },
  escassez: {
    tag: "o que é escasso",
    nos: [
      { t: "p", c: "**O preço é deste ciclo.** Regravo toda semana e ele acompanha. Confira semana que vem." },
      { t: "p", c: "**O grupo é desta semana.**" },
      { t: "p", c: "**A auditoria tem dez vagas de verdade.**" },
      { t: "p", c: "**A sessão de sábado não fica gravada.**" },
      { t: "p", c: "As aulas ficam um ano no ar. Se alguém disser que some em 24h, está inventando urgência." },
    ],
  },
  garantia: "**7 dias.** Pediu, devolvo. Sem pergunta.",
  faq: [
    {
      q: "Vou ter que largar o ChatGPT?",
      a: "Não. Degraus diferentes resolvem coisas diferentes. Continue conversando com o chat. O agente é pra tarefa que se repete e não precisa de você.",
    },
    {
      q: "Preciso saber programar?",
      a: "Precisa saber seguir passo a passo. A instalação é feita com o agente executando enquanto eu explico cada comando.",
    },
    { q: "Funciona no Windows?", a: "Funciona, com um passo a mais que fazemos junto na primeira aula." },
    {
      q: "Quanto vou gastar por mês?",
      a: "Depende do uso. Eu rodo o Alfred sem pagar API e mostro como. Você vai aprender a ver o gasto todo dia, que é o que evita susto.",
    },
    {
      q: "Isso é golpe?",
      a: "O programa é aberto e gratuito, feito por um laboratório de pesquisa. Baixa agora sozinho e não me paga nada. Eu vendo o caminho.",
    },
  ],
  fecho: {
    nos: [
      {
        t: "p",
        c: "Quem tem IA trabalhando não tem mais dinheiro que você e não sabe mais programar que você.",
      },
      { t: "p", c: "O que essa pessoa tem é um degrau de distância, e uma semana de método." },
      { t: "forte", c: "Segunda que vem, 20h." },
    ],
    foto: IMG_RED_MANHA,
  },
};

/* ===== E · o feriado (desejo) ============================================ */

const E: Variante = {
  id: "E",
  slug: "e",
  angulo: "o feriado (desejo)",
  seo: {
    titulo: "Hermes Week · O agente que vai trabalhar no seu próximo feriado",
    descricao:
      "Ele lê seu e-mail, organiza seus arquivos e roda suas rotinas. Monte em cinco dias, segunda a sexta, 20h.",
  },
  hero: {
    h1: "Monte em cinco dias o agente que vai **trabalhar no seu próximo feriado**",
    deck: "Ele lê seu e-mail, organiza seus arquivos e roda suas rotinas. Você não precisa estar na frente do computador.",
    /* ⚠️ SEM src DE PROPÓSITO. As duas fotos do Red que existem hoje são de
       dentro do ambiente de trabalho (bancada, monitores). Esta pede o
       contrário — Red FORA do escritório, plano aberto, sem notebook — porque
       é ela que prova a promessa da página: o agente trabalha no feriado, e
       quem montou não está na frente da tela. Enfiar aqui a foto de braços
       cruzados diante dos monitores contradiz a headline na mesma dobra.
       Fica placeholder até o Red produzir a foto certa. */
    foto: {
      tipo: "RED",
      formato: "wide",
      c: "Red fora do escritório, ambiente de descanso (varanda, café, rua), enquadramento largo com muito ar em volta. Celular na mão, notebook em lugar nenhum. Relaxado, sem sorriso posado.",
    },
  },
  antes: [
    {
      tag: "a cena",
      nos: [
        { t: "forte", c: "O Alfred trabalhou no feriado." },
        { t: "forte", c: "Eu não." },
        {
          t: "img",
          tipo: "ALFRED",
          formato: "celular",
          c: "print do Telegram com mensagens do Alfred ao longo de um dia sem nenhuma atividade do Red. Timestamps visíveis, conteúdo mascarado.",
        },
        {
          t: "p",
          c: "Ele rodou a rotina da manhã, leu o que chegou, separou o que importava, e deixou tudo esperando. Quando eu abri o celular no fim do dia, o resumo estava lá.",
        },
        { t: "p", c: "Não foi mágica e não foi sorte. Foi uma coisa que eu montei uma vez e não mexo mais." },
      ],
    },
    {
      tag: "quem é o alfred",
      nos: [
        { t: "p", c: "Antes de continuar, deixa eu te apresentar direito." },
        { t: "forte", c: "**Alfred é o nome que eu dei pro meu.**" },
        {
          t: "p",
          c: "O programa se chama **Hermes**. É aberto, é gratuito, e foi feito pela Nous Research, que é um laboratório que treina modelos de IA. Você pode baixar agora, sem me pagar nada.",
        },
        {
          t: "p",
          c: "Eu instalei, configurei do meu jeito, ensinei o que ele precisava saber sobre mim e sobre o meu trabalho, e batizei de Alfred.",
        },
        { t: "p", c: "Quando eu falar **Hermes**, é o programa. Quando eu falar **Alfred**, é o meu." },
        { t: "img", ...IMG_REPO },
        {
          t: "p",
          c: "**O seu vai ter o nome que você quiser.** E vai saber sobre você o que o meu sabe sobre mim, que é uma coisa que se constrói e não se compra pronta.",
        },
      ],
    },
    {
      tag: "o que essas pessoas celebram",
      nos: [
        { t: "p", c: "Quando você lê quem usa isso de verdade, o que eles comemoram nunca é grandioso." },
        { t: "p", c: "É sempre pequeno e doméstico:" },
        { t: "cita", c: "Consigo levar meus filhos na Disneylândia e trabalhar do iPhone." },
        {
          t: "cita",
          c: "Ele varre meus e-mails procurando os da escola. Três filhos, três escolas, formatos diferentes.",
        },
        {
          t: "cita",
          c: "A maior melhora foi nas coisas triviais. Mandar e-mail pra prestador, pra contador. Dois minutos em vez de vinte.",
        },
        {
          t: "p",
          c: "Ninguém posta que virou CEO de um exército de robôs. Eles postam que recuperaram a terça-feira.",
        },
        { t: "forte", c: "**É isso que eu vou te ajudar a montar.**" },
      ],
    },
    {
      tag: "por que o seu chat não faz isso",
      nos: [
        { t: "p", c: "Porque ele espera." },
        {
          t: "p",
          c: "O ChatGPT é bom, tem memória, escreve bem. Mas ele só age quando você abre e pede. Se você está na praia, ele está parado.",
        },
        {
          t: "p",
          c: "O que trabalha no feriado tem três coisas que o chat não tem: **corpo** (um processo rodando numa máquina), **memória sua** (arquivo que você abre e edita, não caixa preta de fornecedor) e **iniciativa** (agendamento próprio, executa no horário que você mandou).",
        },
        {
          t: "p",
          c: "E uma quarta que é a mais estranha de explicar: **ele se reescreve.** Termina uma tarefa, olha o caminho que percorreu, e anota o manual pra próxima vez. O Alfred fez isso 184 vezes sem eu pedir nenhuma.",
        },
      ],
    },
    {
      tag: "o custo real",
      nos: [
        { t: "p", c: "Isso não acontece na primeira semana." },
        {
          t: "p",
          c: "Fui atrás de quem usa todo dia, e todos falam da rampa sem ninguém perguntar. Dois meses, três, seis.",
        },
        {
          t: "cita",
          c: "Levou uns três meses pra ele realmente começar a tirar pedaços grandes de trabalho do meu prato.",
        },
        {
          t: "p",
          c: "Em cinco dias você monta a base. O feriado tranquilo vem depois, quando você tiver ensinado a ele as suas cinco ou seis tarefas chatas.",
        },
        {
          t: "p",
          c: "O que a semana garante é que você começa **do lado certo da curva**, e não brigando com uma instalação torta que quebra toda semana.",
        },
      ],
    },
  ],
  saiCom: {
    intro: "Cinco aulas, uma por dia, das 20h às 20h50.",
    sabado: "Sábado 10h tem uma sessão só de dúvidas, ao vivo.",
    extra: "**A sexta é a aula do feriado.** É onde ele passa a trabalhar sem você mandar.",
  },
  entre: [
    {
      tag: "a primeira tarefa",
      nos: [
        { t: "p", c: "Não vai ser a mais difícil que você faz. Vai ser a mais chata." },
        { t: "p", c: "A comunidade tem uma pergunta que resolve isso melhor que qualquer teoria:" },
        {
          t: "cita",
          c: "Qual é a coisa mais demorada que você faz no computador e que não exige quase nenhum pensamento? Esse é o melhor caso de uso.",
        },
        {
          t: "p",
          c: "Demorada e sem pensamento. Aquela que come quarenta minutos por semana e que você adia até não dar mais.",
        },
        {
          t: "p",
          c: "Quem aponta o primeiro agente pra tarefa mais complexa se frustra e desiste. Quem aponta pra mais burra ganha tempo de verdade e aprende a confiar.",
        },
      ],
    },
  ],
  prova: {
    tag: "a prova",
    nos: [
      { t: "p", c: "Primeiro ciclo, então não tenho depoimento de aluno. Tenho o Alfred." },
      {
        t: "p",
        c: "**Ele lê meu Gmail e minha agenda** sem plataforma de integração no meio, credencial na minha máquina.",
      },
      { t: "p", c: "**R$0 de API por mês**, usando assinatura em vez de cobrança por uso." },
      { t: "p", c: "**184 habilidades escritas por ele mesmo.**" },
    ],
  },
  praQuemNaoE: {
    tag: "pra quem não é",
    nos: [
      {
        t: "p",
        c: "Se você não tem tarefa que se repete, isso não serve. O ganho aqui vem de repetição, e sem repetição não tem o que delegar.",
      },
      { t: "p", c: "E se você abre IA duas vezes por semana, também não. A memória precisa de uso pra acumular." },
    ],
  },
  oferta: {
    linhas: [
      "Cinco aulas, uma por dia, 20h.",
      "Sessão de dúvidas ao vivo no sábado, 10h.",
      "Grupo no WhatsApp com o Red respondendo a semana inteira.",
      "As aulas ficam disponíveis por um ano.",
    ],
    /* E é a variação em que o Red domina visualmente. Aqui a foto entra no
       quadro da oferta, que nas outras quatro é puro tipo. */
    foto: IMG_RED_OFERTA,
  },
  bumps: {
    itens: [
      {
        nome: "Kit Primeira Semana",
        preco: "R$27",
        texto:
          "Dez tarefas prontas, uma por dia nos sete dias seguintes ao evento. Prompt escrito, habilidade pronta, e o que esperar. É literalmente a lista do que delegar primeiro.",
      },
      {
        nome: "8 Agentes Prontos",
        preco: "R$37",
        texto: "Oito identidades já escritas, uma pra cada ofício: advogado, contador, e-commerce, agência, clínica, consultor, infoprodutor e freelancer. Você escolhe a sua, cola, e o agente já sabe do que você trabalha desde o primeiro dia, em vez de responder igual ao de todo mundo.",
      },
      {
        nome: "Auditoria do seu agente",
        preco: "R$47",
        texto:
          "Você me manda a configuração. Devolvo por escrito o que está errado e o que priorizar. **Dez por ciclo**, porque sou eu que leio.",
      },
    ],
  },
  escassez: {
    tag: "o que é escasso",
    nos: [
      { t: "p", c: "**O preço é deste ciclo.** Regravo toda semana e ele acompanha. Confira semana que vem." },
      { t: "p", c: "**O grupo é desta semana.**" },
      { t: "p", c: "**A auditoria tem dez vagas de verdade.**" },
      { t: "p", c: "**A sessão de sábado não fica gravada.**" },
      { t: "p", c: "As aulas ficam um ano no ar. Se alguém disser que some em 24h, está inventando urgência." },
    ],
  },
  garantia: "**7 dias.** Pediu, devolvo. Sem pergunta.",
  faq: [
    {
      q: "Meu computador precisa ficar ligado?",
      a: "Nessa semana, sim. O agente roda na sua máquina, então ele trabalha enquanto ela estiver ligada. Muita gente usa assim pra sempre e resolve. Existe caminho pra ele viver fora da sua máquina, e isso é assunto de outro lugar.",
    },
    {
      q: "Preciso saber programar?",
      a: "Precisa saber seguir passo a passo. A instalação é feita com o agente executando enquanto eu explico.",
    },
    { q: "Funciona no Windows?", a: "Funciona, com um passo a mais que fazemos junto na primeira aula." },
    { q: "Quanto vou gastar por mês?", a: "Depende do uso. Eu rodo o Alfred sem pagar API e mostro como." },
    {
      q: "Isso é golpe?",
      a: "O programa é aberto e gratuito, feito por um laboratório de pesquisa. Baixa agora sozinho e não me paga nada.",
    },
  ],
  fecho: {
    nos: [
      { t: "p", c: "O próximo feriado vem aí." },
      {
        t: "p",
        c: "Você pode passar ele checando e-mail no celular, ou pode passar ele fazendo outra coisa enquanto alguém checa por você.",
      },
      { t: "forte", c: "Segunda que vem, 20h." },
    ],
    /* ⚠️ SEM src, mesmo motivo do hero desta página: não existe foto do Red
       fora do ambiente de trabalho. Ver nota no hero da LP E. */
    foto: {
      tipo: "RED",
      formato: "wide",
      c: "Red fora do ambiente de trabalho, plano aberto, celular na mão e atenção em outra coisa. Fim de tarde, luz quente.",
    },
  },
};

/* ------------------------------------------------------------------------ */

/* A LP F não entra aqui: ela é cinemática e tem estrutura de CENA, não de
   dobra de texto (roteiro em Starlight/HERMES/05-paginas/lp-F-cinematica-ROTEIRO.md,
   conteúdo em ./lp-f-cenas.ts). Forçá-la neste Record obrigaria a inventar
   campos que ela não usa. Por isso o tipo aqui é o subconjunto A-E. */
export type VarianteTextualId = Exclude<VarianteId, "F">;

export const VARIANTES: Record<VarianteTextualId, Variante> = { A, B, C, D, E };
