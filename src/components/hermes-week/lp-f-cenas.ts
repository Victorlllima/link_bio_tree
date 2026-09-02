/* ============================================================================
 *  LP F · AS 5 CENAS E A OFERTA
 * ----------------------------------------------------------------------------
 *  Separado do componente porque o roteiro é a fonte da verdade da skill
 *  cine-scroll: ele foi aprovado no PORTÃO 1 (ver
 *  Starlight/HERMES/05-paginas/lp-F-cinematica-ROTEIRO.md) e as imagens e os
 *  vídeos foram gerados a partir dele. Mudar texto de cena aqui sem mudar lá
 *  quebra o contrato entre a copy e a mídia que já custou crédito.
 *
 *  A oferta é IDÊNTICA às LPs A-E por desenho. O que muda é só o ângulo, que
 *  aqui é a jornada contada em cena.
 * ==========================================================================*/

export type Cena = {
  n: number;
  /** keyframe 16:9, também usado no fallback estático */
  img: string;
  /** hora do dia. Não é decoração: é o eixo que conta a história. */
  hora: string;
  /** o texto que entra por cima. HTML real, nunca queimado na imagem. */
  titulo: string;
  /** faixa de scroll da cena, em % do progresso total da sequência */
  de: number;
  ate: number;
  /** alt real, para leitor de tela e para quando a imagem não carrega */
  alt: string;
};

export const CENAS: Cena[] = [
  {
    n: 1,
    img: "/hermes-week/f/keyframes/cena-01.jpg",
    hora: "03h47",
    titulo: "São 3h47 e você ainda está fazendo isso na mão",
    de: 0,
    ate: 20,
    alt: "Homem sozinho na bancada de madeira de madrugada, luz branca da planilha no rosto, apartamento no escuro.",
  },
  {
    n: 2,
    img: "/hermes-week/f/keyframes/cena-02.jpg",
    hora: "03h51",
    titulo: "Existe um jeito de isso não depender mais de você",
    de: 23,
    ate: 44,
    alt: "Mesmo homem, mesma bancada, a tela agora âmbar com um terminal. Ele se inclina para frente.",
  },
  {
    n: 3,
    img: "/hermes-week/f/keyframes/cena-03.jpg",
    hora: "05h20",
    titulo: "Cinco noites pra montar o seu Agente",
    de: 48,
    ate: 69,
    alt: "Ele montando o agente em duas telas âmbar, luminária acesa, o azul do amanhecer começando na janela.",
  },
  {
    n: 4,
    img: "/hermes-week/f/keyframes/cena-04.jpg",
    hora: "06h05",
    titulo: "Ele me entregou às 6h05. Eu nem estava lá",
    de: 73,
    ate: 90,
    alt: "A mesma bancada com a cadeira vazia. As telas seguem acesas em âmbar, janela em azul de amanhecer.",
  },
  {
    n: 5,
    img: "/hermes-week/f/keyframes/cena-05.jpg",
    hora: "09h30",
    titulo: "Hermes Week · Seu Hermes Agent do zero à produção",
    de: 93,
    ate: 100,
    alt: "Ele de pé perto da janela com café, sol da manhã, e ao fundo desfocada a bancada com a tela ainda acesa.",
  },
];

/* --------------------------------------------------------------------------
 *  A OFERTA (idêntica às LPs A-E)
 * ------------------------------------------------------------------------*/

export const OFERTA = {
  produto: "Hermes Week | Seu Agente do Zero à Produção",
  preco: "R$62",
  /* Sem data: a Hermes Week é evento SEMANAL. Uma data fixa aqui envelhece a
     página em sete dias e contradiz o "segunda que vem" do resto da copy. */
  evento: "Hermes Week · Seu Hermes Agent do zero à produção · segunda a sexta, 20h",
  ctaTopo: "QUERO MEU AGENTE POR R$62",
  ctaOferta: "GARANTIR MEU INGRESSO POR R$62",
  dias: [
    { dia: "Segunda", saida: "agente instalado e conversando com você pelo Telegram" },
    { dia: "Terça", saida: "ele sobe sozinho quando você liga o computador, e te avisa quando cai" },
    { dia: "Quarta", saida: "memória funcionando: ele lembra de você, do seu trabalho, do seu jeito" },
    { dia: "Quinta", saida: "ele escrevendo as próprias habilidades, sem você pedir" },
    { dia: "Sexta", saida: "rotina automática rodando e uma ferramenta externa conectada" },
  ],
  sabado: "Sábado 10h tem uma sessão só de dúvidas, ao vivo, pra destravar quem travou.",
  prova: [
    {
      numero: "184",
      texto:
        "vezes que o Alfred escreveu um manual pra si mesmo. Ele terminou uma tarefa, olhou o caminho que percorreu, e anotou como refazer. Eu não pedi nenhuma das 184 vezes.",
    },
    {
      numero: "R$0",
      texto:
        "é quanto eu pago de API por mês. Configurei o Alfred pra usar assinaturas que eu já tinha em vez de pagar por uso. Mostro como na semana.",
    },
    {
      numero: "0",
      texto:
        "plataformas de integração no meio. Ele lê meu Gmail e minha agenda direto, com a credencial parada na minha máquina. Tem gente cobrando assinatura mensal por essa ponte.",
    },
  ],

  /* ---- O VÍDEO DA SEÇÃO "A PROVA" -------------------------------------
     Gravação de tela do Telegram feita em 02/09/2026, 10h36. Vertical
     640x1250, 14,5s, sem áudio (por isso o autoplay é permitido pelo
     navegador). O poster é o primeiro quadro em 720x1406.
     O aria-label existe porque o conteúdo é 100% visual e sem legenda. */
  video: {
    src: "/hermes-week/prova/alfred-triagem.mp4",
    poster: "/hermes-week/prova/alfred-triagem-poster.jpg",
    largura: 640,
    altura: 1250,
    carimbo: "02/09/2026, 10h36",
    aria:
      "Gravação de tela do Telegram: o Alfred responde ao pedido de olhar a caixa de e-mail. Ele roda um comando no terminal, separa três mensagens que pedem ação, resume o resto como newsletter e pergunta se deve escrever algum rascunho de resposta.",
  },
  /* Os bumps foram reescritos em 02/09 a pedido do Red: quem chega aqui ainda
     não sabe o que é um SOUL nem por que auditar um agente. Cada texto agora
     abre com o problema que o leitor reconhece, e só depois nomeia a solução. */
  bumps: [
    {
      nome: "Kit Primeira Semana",
      preco: "R$27",
      problema: "Você instala o agente e fica olhando pra ele sem saber o que pedir.",
      texto:
        "São dez tarefas prontas, uma pra cada dia da semana seguinte. Cada uma vem com o texto exato pra colar e com o resultado que você deve esperar ver. Triagem da caixa de e-mail, organizar a pasta de downloads, tirar os dados de dentro de um PDF, uma rotina que roda sozinha toda manhã.",
    },
    {
      nome: "Gerador de SOUL",
      preco: "R$37",
      problema: "Sem uma identidade escrita, seu agente responde igual ao de todo mundo.",
      texto:
        "SOUL é o arquivo que define quem ele é: o que ele sabe sobre o seu trabalho, como ele fala com você, e o que ele tem autonomia pra decidir sem perguntar. Escrever um do zero é difícil quando você nunca viu um pronto. Aqui você responde algumas perguntas sobre o seu ofício e o sistema escreve o seu.",
    },
    {
      nome: "Auditoria do seu agente",
      preco: "R$47",
      problema: "Você monta tudo e fica com a dúvida de sempre: está certo isso?",
      texto:
        "Você me manda a configuração que fez. Eu abro, leio, e te devolvo por escrito o que está errado, o que dá pra melhorar e o que priorizar primeiro. São dez por ciclo, porque quem lê sou eu.",
    },
  ],
  faq: [
    {
      q: "Preciso saber programar?",
      a: "Precisa saber seguir um passo a passo e ter paciência com computador. A instalação da segunda é feita com o agente executando os comandos enquanto eu explico o que cada um faz.",
    },
    {
      q: "Funciona no Windows?",
      a: "Funciona. Tem um passo a mais, que é ativar o Linux dentro do Windows, e a gente faz junto na primeira aula.",
    },
    {
      q: "E se eu perder uma aula?",
      a: "Elas ficam no ar por um ano. Mas o formato assume que você fez a anterior, então quem chega na quarta sem ter feito segunda e terça vai remar.",
    },
    {
      q: "Isso é golpe?",
      a: "O Hermes é aberto e gratuito, criado pela NOUS RESEARCH, um laboratório de pesquisa. Você pode baixar sozinho agora e não me pagar nada. O que eu te entrego é o atalho: o que eu levei meses pra descobrir, você faz em cinco noites, e a semana inteira comigo pra destravar o que travar.",
    },
  ],
  garantia: "7 dias. Pediu, devolvo. Sem pergunta, sem você ter que me explicar nada.",
  rodape: {
    razao: "BUENO LIMA LTDA",
    cnpj: "CNPJ 59.015.480/0001-07",
    suporte: "suporte@redpro.com.br",
  },
} as const;

/* --------------------------------------------------------------------------
 *  HERMES × ALFRED
 * ----------------------------------------------------------------------------
 *  Red pediu a distinção explícita na página (02/09). O erro que ela corrige é
 *  o leitor achar que "Alfred" é outro produto, mais caro, que ele não vai ter.
 *  Não são dois programas: é o MESMO programa em dois estados, o recém-instalado
 *  e o mesmo depois de meses de uso. Por isso os dois cartões são idênticos em
 *  estrutura e o que muda é só o conteúdo — a forma carrega o argumento.
 * ------------------------------------------------------------------------*/

export const DUPLA = {
  rotulo: "Hermes e Alfred",
  titulo: "O mesmo programa, em dois momentos",
  intro:
    "O Hermes é o agente original: aberto, gratuito, feito pela NOUS RESEARCH, um laboratório de pesquisa. É o que você instala na segunda-feira.",
  lados: [
    {
      chave: "hermes",
      img: "/hermes-week/hermes.webp",
      alt: "Marca do Hermes, o agente aberto da NOUS RESEARCH.",
      nome: "Hermes",
      estado: "Recém-instalado",
      linhas: [
        "Aberto e gratuito, da NOUS RESEARCH",
        "Sai igual pra todo mundo que baixa",
        "Não sabe nada sobre você ainda",
      ],
    },
    {
      chave: "alfred",
      img: "/hermes-week/alfred.webp",
      alt: "Ilustração do Alfred, o mordomo com o pin da RedPro na lapela.",
      nome: "Alfred",
      estado: "Depois de meses de uso",
      linhas: [
        "O mesmo Hermes, o meu, customizado",
        "Conhece meu trabalho e o meu jeito",
        "Tem memória e habilidades que escreveu sozinho",
      ],
    },
  ],
  fecho: "O seu vai ter o nome que você quiser.",
} as const;
