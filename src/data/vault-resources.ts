// RedVault — fonte de dados dos resources. Espelha .claude/REDVAULT-RESOURCES.md do Starlight.
// Cada resource vira um card no vault + uma página /vault/[slug].
//
// MODELO (decidido por Red, 28/08/2026): as skills são ARQUIVOS .md PARA BAIXAR.
// A página explica o que a skill faz, como usar e o que esperar; o arquivo é o entregável.
// (Antes era copy-paste; mudou porque skill de Claude Code precisa virar arquivo mesmo.)

export interface Secao {
  titulo: string;
  texto: string;
}
export interface Resource {
  slug: string;
  titulo: string;
  categoria: "Skills" | "Guias";
  destaque?: boolean;
  novo?: boolean;
  resumo: string;        // aparece no card
  intro: string;         // 1-2 parágrafos no topo da página
  arquivo: string;       // caminho do .md para download
  comando?: string;      // o comando que roda a skill (ex: /raio-x-custo)
  secoes: Secao[];       // explicação didática do que a skill faz
}

export const CATEGORIAS = ["Tudo", "Skills", "Guias"] as const;

const COMO_INSTALAR: Secao = {
  titulo: "Como instalar (1 minuto)",
  texto:
    "1. Baixa o arquivo .md no botão acima.\n" +
    "2. Na pasta do teu projeto, cria (ou abre) a pasta .claude/skills/\n" +
    "3. Joga o arquivo lá dentro.\n" +
    "4. Abre o Claude Code nessa pasta e digita o comando da skill.\n\n" +
    "Não precisa instalar nada, não precisa configurar. O Claude Code lê a pasta .claude/skills/ sozinho.",
};

export const RESOURCES: Resource[] = [
  {
    slug: "auditoria-seguranca",
    titulo: "Auditoria de Segurança",
    categoria: "Skills",
    destaque: true,
    novo: true,
    resumo: "Varre o projeto e encontra o que está exposto: RLS aberto, chave no código, rota sem proteção.",
    intro:
      "Sistema que funciona não é sistema seguro. A maioria das falhas que derrubam projeto pequeno são as mesmas cinco ou seis, e todas dá pra achar antes de alguém achar por você. Esta skill faz essa varredura e explica o risco de cada achado em português, sem jargão.",
    arquivo: "/redreply/skills/auditoria-seguranca.md",
    comando: "/auditoria-seguranca",
    secoes: [
      {
        titulo: "O que ela procura",
        texto:
          "• RLS desligado ou mal configurado no Supabase (o erro nº1 de quem constrói rápido)\n" +
          "• Chave de API, token e senha no código ou no repositório\n" +
          "• Rota sem autenticação que devia ter\n" +
          "• Endpoint caro sem rate limit (qualquer um roda sua cota)\n" +
          "• Dado sensível em log e em resposta de erro\n" +
          "• Dependência com CVE conhecido",
      },
      {
        titulo: "O que você recebe",
        texto:
          "Um relatório por severidade (crítico → baixo), e para cada achado: o arquivo e a linha, o que dá errado na prática, e a correção. Não é lista genérica de boas práticas: é o que está no SEU código.",
      },
      {
        titulo: "Quando rodar",
        texto:
          "Antes do primeiro deploy. Antes de colocar dado de cliente. E de novo depois de qualquer mudança grande de arquitetura. Leva alguns minutos e é a diferença entre descobrir você ou descobrir na conta.",
      },
      COMO_INSTALAR,
    ],
  },
  {
    slug: "raio-x-custo",
    titulo: "Raio-X de Custo",
    categoria: "Skills",
    novo: true,
    resumo: "Descobre quanto custa manter seu sistema de IA rodando e onde o dinheiro está vazando, antes da fatura chegar.",
    intro:
      "Você sabe quanto custou construir. Sabe quanto custa manter? A maioria descobre quando a fatura chega, porque o custo de IA é agregado: vem tudo somado, sem dizer qual chamada gastou o quê. Esta skill abre esse número.",
    arquivo: "/redreply/skills/raio-x-custo.md",
    comando: "/raio-x-custo",
    secoes: [
      {
        titulo: "Os 8 pontos onde o dinheiro vaza",
        texto:
          "Chamada de LLM sem teto de tokens · retry sem limite (cada tentativa é cobrada) · rota cara sem rate limit · histórico inteiro reenviado a cada mensagem · falta de cache em pergunta repetida · modelo caro em tarefa mecânica · e mais dois que só aparecem em escala.",
      },
      {
        titulo: "O que você recebe",
        texto:
          "Custo estimado por request, por usuário e por mês. E o mapa de onde cortar, com arquivo e linha. O relatório é ordenado pelo que mais pesa, não pelo que é mais fácil de arrumar.",
      },
      {
        titulo: "Por que isso é dívida, não falha",
        texto:
          "Custo não medido cresce com o uso. Cada mês sem medir aumenta o buraco, e refatorar contexto num agente com 3 ferramentas é uma tarde; com 30, é uma reescrita.",
      },
      COMO_INSTALAR,
    ],
  },
  {
    slug: "teste-de-carga",
    titulo: "Teste de Carga",
    categoria: "Skills",
    novo: true,
    resumo: "Descobre em que ponto seu sistema quebra, antes que ele quebre com cliente dentro.",
    intro:
      "Funciona com você testando sozinho. E com 200 pessoas ao mesmo tempo? A resposta quase nunca é 'escala igual' — tem sempre um ponto que cede primeiro, e ele raramente é o que você imagina.",
    arquivo: "/redreply/skills/teste-de-carga.md",
    comando: "/teste-de-carga",
    secoes: [
      {
        titulo: "O que ela testa",
        texto:
          "Simula carga real crescente e observa onde a curva quebra: conexões do banco, timeout de chamada externa, memória, fila que não drena, e limite de rate da API que você consome.",
      },
      {
        titulo: "O que você recebe",
        texto:
          "O número de usuários simultâneos que o sistema aguenta hoje, qual componente cede primeiro, e o que fazer para subir esse teto. Com o gargalo apontado no código, não em tese.",
      },
      {
        titulo: "Quando rodar",
        texto:
          "Antes de qualquer divulgação grande: lançamento, live, campanha de tráfego. Descobrir o teto na véspera é bem mais barato que descobrir durante.",
      },
      COMO_INSTALAR,
    ],
  },
  {
    slug: "mapa-do-sistema",
    titulo: "Mapa do Sistema",
    categoria: "Skills",
    novo: true,
    resumo: "Gera o desenho real do que você construiu: o que conversa com o quê e onde estão os pontos únicos de falha.",
    intro:
      "Sistema que você não consegue explicar é sistema que você não controla. Depois de umas semanas construindo rápido, ninguém lembra de tudo que está conectado com tudo. Esta skill lê o projeto inteiro e devolve o mapa.",
    arquivo: "/redreply/skills/mapa-do-sistema.md",
    comando: "/mapa-do-sistema",
    secoes: [
      {
        titulo: "O que ela mapeia",
        texto:
          "Todos os serviços e integrações · o que depende do quê · fluxo de dado do início ao fim · onde estão os pontos únicos de falha (se isso cair, o que para junto) · e o que está no sistema mas ninguém usa mais.",
      },
      {
        titulo: "O que você recebe",
        texto:
          "Um documento navegável com o desenho da arquitetura real (não a que você planejou), a lista de dependências críticas, e os pontos que derrubam mais de uma coisa se falharem.",
      },
      {
        titulo: "Pra que serve na prática",
        texto:
          "Explicar seu sistema para outra pessoa. Decidir onde mexer sem quebrar o resto. E ter clareza do que existe antes de escalar em cima.",
      },
      COMO_INSTALAR,
    ],
  },
  {
    slug: "checklist-deploy",
    titulo: "Checklist de Deploy",
    categoria: "Skills",
    novo: true,
    resumo: "A verificação que roda antes de subir, não depois de apanhar.",
    intro:
      "Subir para produção sem checklist é apostar. Não porque você é descuidado, mas porque a lista do que conferir cresce junto com o sistema e ninguém guarda tudo de cabeça. Esta skill roda a verificação completa antes do deploy.",
    arquivo: "/redreply/skills/checklist-deploy.md",
    comando: "/checklist-deploy",
    secoes: [
      {
        titulo: "O que ela confere",
        texto:
          "Variáveis de ambiente que faltam em produção · migration não aplicada · build que passa local mas quebra no CI · segredo commitado sem querer · rota nova sem proteção · e o que mudou desde o último deploy que merece atenção.",
      },
      {
        titulo: "O que você recebe",
        texto:
          "Um veredito: pronto ou não pronto. E se não, exatamente o que falta, em ordem. Sem 'talvez seja bom verificar' — ou está resolvido ou não está.",
      },
      {
        titulo: "Quando rodar",
        texto: "Toda vez, antes de todo deploy em produção. Leva menos tempo que reverter um deploy quebrado.",
      },
      COMO_INSTALAR,
    ],
  },
  {
    slug: "auditoria-reversibilidade",
    titulo: "Auditoria de Reversibilidade",
    categoria: "Skills",
    novo: true,
    resumo: "Mostra quais ações dos seus agentes rodam sem ninguém conferir, e quais delas você não consegue desfazer.",
    intro:
      "Seu agente funciona. A pergunta é outra: quando ele erra, você consegue desfazer? Um agente que verifica o próprio trabalho carrega o mesmo viés que produziu o erro — ele já decidiu que estava certo quando escreveu. Esta skill separa o que dá pra desfazer do que não dá.",
    arquivo: "/redreply/skills/auditoria-reversibilidade.md",
    comando: "/auditoria-reversibilidade",
    secoes: [
      {
        titulo: "O que ela mapeia",
        texto:
          "Toda ação que o agente executa além de gerar texto:\n\n" +
          "• Escrita em banco (INSERT, UPDATE, DELETE, migrations)\n" +
          "• Chamadas externas que mudam estado (POST, PUT, PATCH, DELETE)\n" +
          "• Comunicação com terceiros (e-mail, WhatsApp, SMS, DM, push)\n" +
          "• Dinheiro (cobrança, reembolso, mudança de plano, nota fiscal)\n" +
          "• Arquivos (escrever, sobrescrever, apagar, mover, upload)\n" +
          "• Deploy e infra (push, merge, restart, env var)\n" +
          "• Permissão e acesso (criar usuário, mudar role, revogar)\n\n" +
          "Leitura pura fica de fora. Ler não quebra nada.",
      },
      {
        titulo: "O critério que ela aplica",
        texto:
          "Ação reversível o agente faz sozinho. Ação irreversível nunca sem um segundo par de olhos. " +
          "É o que separa demo de operação: numa demo todo erro é desfazível porque não tem ninguém do outro lado.",
      },
      {
        titulo: "O que você recebe",
        texto:
          "A lista de ações classificadas por reversibilidade, com arquivo e linha, quem dispara cada uma " +
          "(usuário, cron, webhook, outro agente) e se existe verificação antes. As irreversíveis sem gate " +
          "vêm primeiro, porque são as que cobram a conta.",
      },
      {
        titulo: "Por que isso é dívida, não falha",
        texto:
          "Cada semana que passa, mais ação irreversível entra no sistema sem verificação. E mais caro fica " +
          "separar depois o que precisa de gate do que não precisa.",
      },
      COMO_INSTALAR,
    ],
  },
  {
    slug: "caveman-mode",
    titulo: "Caveman Mode",
    categoria: "Guias",
    resumo: "O ajuste de instrução que faz a IA parar de responder bonito e passar a responder direto.",
    intro:
      "A IA responde no registro em que você escreve. Prompt cheio de rodeio devolve resposta cheia de rodeio. Caveman Mode é um bloco de instrução que corta advérbio, adjetivo de venda e oferta de ajuda no final.",
    arquivo: "/redreply/skills/caveman-mode.md",
    secoes: [
      {
        titulo: "O que muda",
        texto:
          "Antes: 'Ótima pergunta! Basicamente, o que acontece é que o sistema funciona de uma maneira bastante interessante. Deixa eu te explicar...'\n\n" +
          "Depois: 'O cache guarda a resposta pela hash da entrada. Entrada idêntica não vai pro modelo de novo.'",
      },
      {
        titulo: "Por que funciona",
        texto:
          "Instrução vaga ('seja objetivo') não muda nada, porque 'objetivo' é subjetivo para o modelo. O bloco funciona porque nomeia o que cortar, item por item — vira regra verificável em vez de qualidade abstrata.",
      },
      {
        titulo: "Onde colar",
        texto:
          "Custom Instructions no ChatGPT, CLAUDE.md no Claude Code, ou no começo da conversa. Funciona em qualquer modelo.",
      },
    ],
  },
  {
    slug: "mcp-vs-a2a",
    titulo: "MCP vs A2A",
    categoria: "Guias",
    novo: true,
    resumo: "Os dois protocolos que todo mundo confunde. Um dá mãos pro seu agente, o outro dá colegas.",
    intro:
      "Seu agente sabe usar ferramenta. Ele lê arquivo, chama API, mexe no banco. O que ele não sabe é pedir ajuda para outro agente. São dois encanamentos diferentes, e quase todo mundo instalou só o primeiro achando que tinha os dois.",
    arquivo: "/redreply/skills/mcp-vs-a2a.md",
    secoes: [
      {
        titulo: "A diferença em uma linha",
        texto:
          "MCP conecta agente a ferramenta e dado (banco, API, arquivo). A2A conecta agente a agente.\n\n" +
          "O teste pra saber qual você precisa: o outro lado da conexão toma alguma decisão?\n" +
          "• Não (banco, API, planilha) → MCP\n" +
          "• Sim (avalia, recusa, pede mais informação) → A2A",
      },
      {
        titulo: "O que o guia cobre",
        texto:
          "• O Agent Card: como um agente descobre o outro antes de mandar trabalho\n" +
          "• As operações reais da spec 1.0 (SendMessage, GetTask, CancelTask, SubscribeToTask)\n" +
          "• Os 8 estados de uma tarefa, e os 2 que não existem no mundo MCP\n" +
          "• Transporte (JSON-RPC 2.0, gRPC, HTTP+REST) e os SDKs nas 6 linguagens\n" +
          "• Por que com 2 agentes você é o carteiro e com 5 vira o gargalo",
      },
      {
        titulo: "A parte que quase ninguém escreve",
        texto:
          "O guia diz também o que NÃO dá pra fazer hoje: não existe app store de agentes A2A, " +
          "a maioria das ferramentas ainda não fala A2A, e ele não substitui o MCP (agente A2A sem " +
          "MCP tem com quem conversar, mas não tem mãos).\n\n" +
          "E a ordem certa de aprender: MCP primeiro, depois escopo e permissão, só então A2A. " +
          "Pular direto pra A2A é montar organograma antes de ter funcionário.",
      },
      {
        titulo: "Como usar",
        texto:
          "Baixa o .md e lê. É guia de entendimento, não skill de rodar: serve pra você decidir " +
          "qual protocolo resolve o problema que você tem agora, sem perder tempo no que ainda não " +
          "está maduro.",
      },
    ],
  },
  {
    slug: "migrar-chatgpt-claude",
    titulo: "Migrar do ChatGPT pro Claude",
    categoria: "Guias",
    resumo: "O que muda de verdade, o que levar junto e o que fazer diferente, sem recomeçar do zero.",
    intro:
      "Quem migra costuma repetir o mesmo erro: usar o Claude como se fosse ChatGPT com outro nome. Funciona, mas você perde o que ele faz melhor. Este guia é sobre o que muda de verdade, não sobre qual é melhor.",
    arquivo: "/redreply/skills/migrar-chatgpt-claude.md",
    secoes: [
      {
        titulo: "O que você leva junto",
        texto:
          "Suas Custom Instructions (com ajuste: o Claude segue regra nomeada com mais rigor que regra vaga) e o hábito de dar contexto. O resto muda.",
      },
      {
        titulo: "O que muda de verdade",
        texto:
          "Conversa infinita vira Projects (contexto fixo que vale para todas as conversas dentro dele). Colar o documento rende mais que descrever o documento. E se você programa, o Claude Code lê os arquivos de verdade em vez de você colar trecho por trecho.",
      },
      {
        titulo: "O que você vai sentir falta",
        texto:
          "Geração de imagem nativa (não tem) e o ecossistema de GPTs prontos (o equivalente exige montar o seu). Vale saber antes de migrar.",
      },
    ],
  },
  {
    slug: "entrevista-memoria-hermes",
    titulo: "Entrevista de memória do Hermes",
    categoria: "Guias",
    destaque: true,
    novo: true,
    resumo: "Uma página que faz o seu agente te entrevistar em dez perguntas e gravar, hoje, as memórias que ele levaria meses para construir sozinho.",
    intro:
      "O seu agente aprende sozinho, mas aprende no tranco: ele descobre que você odeia texto longo depois de te entregar texto longo cinco vezes, e cada uma dessas vezes custou o seu tempo. A memória dele são dois arquivos de texto que somados não chegam a quatro mil caracteres. Esta página é o texto que você cola numa conversa nova para inverter a ordem: em vez de esperar ele descobrir, ele te pergunta.",
    arquivo: "/redreply/pdfs/entrevista-memoria-hermes.pdf",
    secoes: [
      {
        titulo: "Como usar (1 minuto)",
        texto:
          "1. Baixa o PDF no botão acima.\n" +
          "2. Abre uma conversa NOVA com o seu agente. Conversa antiga não serve, e o motivo está no fim desta página.\n" +
          "3. Cola o texto do prompt, ou manda o print da página inteira.\n" +
          "4. Responde as dez perguntas. Leva uns dez minutos.\n" +
          "5. Abre outra conversa nova quando terminar, senão o que ele gravou ainda não vale.",
      },
      {
        titulo: "Os dois arquivos, e por que eles não se misturam",
        texto:
          "O USER.md guarda quem VOCÊ é: seu papel, como você quer ser tratado, seu nível técnico, o que ele nunca deve fazer. Teto de 1.375 caracteres.\n\n" +
          "O MEMORY.md guarda como o TRABALHO funciona: seus projetos, seu ambiente, suas convenções, as correções que você já teve que fazer nele. Teto de 2.200 caracteres.\n\n" +
          "A entrevista roteia cada resposta sua para o arquivo certo. Sem isso, identidade e trabalho viram uma papa só e o agente perde a referência de qual é qual.",
      },
      {
        titulo: "O teto apertado é a funcionalidade",
        texto:
          "Quando o arquivo enche, a ferramenta de escrita dá erro e o agente é obrigado a decidir o que ali dentro vale menos que a coisa nova. Aí ele funde entradas parecidas, apaga duplicata e condensa. O arquivo fica melhor com o tempo em vez de inchar.\n\n" +
          "Memória sem limite vira gaveta de bagunça e, pior, entope o começo de toda conversa com lixo, gastando janela e dinheiro. Por isso o prompt manda condensar em vez de truncar, e manda parar e perguntar quando não couber.",
      },
      {
        titulo: "A pergunta 5 é a que paga a entrevista",
        texto:
          "As dez perguntas estão em ordem de valor, de propósito: se você abandonar na metade, o que ficou gravado já é o que mais importa.\n\n" +
          "A de maior retorno é a quinta, que pergunta quais correções você já teve que fazer nele mais de uma vez. Esse é o fato que mais se perde, porque nasce no meio de uma conversa irritada e nunca é formalizado. Cada correção que vira linha de memória é um erro que não volta.",
      },
      {
        titulo: "Por que ele parece esquecer o que acabou de aprender",
        texto:
          "Quando uma conversa começa, os dois arquivos são lidos e colocados no bloco de instruções. Uma vez. Se ele anotar algo no meio da conversa, aquilo grava no disco na hora, mas só aparece na conversa seguinte.\n\n" +
          "O motivo é custo: o bloco de instruções é o trecho que se repete a cada mensagem e é justamente ele que recebe desconto de cache. Se mudasse a cada anotação, conversa longa custaria várias vezes mais. Por isso a última instrução do prompt manda ele te lembrar de abrir uma conversa nova no fim.",
      },
      {
        titulo: "O que ele não pode tocar",
        texto:
          "O prompt trava o agente nesses dois arquivos e em mais nada. Nada de SOUL.md, config, skills ou agendamentos.\n\n" +
          "O SOUL.md fica de fora por um motivo específico: ele é a identidade do agente, é escrito por você à mão, e é a primeira coisa que o modelo lê em toda sessão. Agente que reescreve a própria alma deixa de ser previsível.",
      },
    ],
  },
  {
    slug: "hermes-para-estudos",
    titulo: "Hermes para estudos",
    categoria: "Guias",
    destaque: true,
    novo: true,
    resumo: "18 capacidades de um agente que roda na sua máquina, com o comando de cada uma e o jeito de conferir se funcionou.",
    intro:
      "Você provavelmente já comprou um curso que não terminou. O problema quase nunca é o conteúdo: é que ninguém aparece às 6h50 para cobrar. Este guia mostra como um agente instalado na sua máquina abre o seu material, monta a sessão do dia, corrige o que você errou e volta a cobrar no sábado. Cada capacidade vem com o comando em português e com o jeito de conferir se funcionou.",
    arquivo: "/redreply/pdfs/hermes-para-estudos.pdf",
    secoes: [
      {
        titulo: "As 8 que montam a rotina",
        texto:
          "• O plano de estudos vira arquivo, não conversa (skills)\n" +
          "• Ele descobre o seu nível e guarda isso (USER.md)\n" +
          "• O estudo de hoje sai do seu próprio material (workdir + AGENTS.md)\n" +
          "• O seu professor é outro agente, não o do dia a dia (profile)\n" +
          "• A sessão do dia chega em áudio, no horário que você não escolheria (cron + tts)\n" +
          "• Seu boletim de desempenho sobrevive à conversa (cron notepad)\n" +
          "• A prova é corrigida por quem não te viu estudar (subagente)\n" +
          "• A revisão volta sozinha, sabendo o que já cobrou (cron com continuity)",
      },
      {
        titulo: "As 10 que entram depois",
        texto:
          "Terminal para rodar o seu projeto e ver o erro junto com você, vision para corrigir a foto do exercício feito no papel, stt para escutar você explicando a matéria, browser para ler a documentação oficial e citar a página, kanban para o projeto final, journey para a linha do tempo do que você aprendeu, moa para o mesmo conceito explicado por vários modelos, mcp para conectar Notion e Drive, sessions import para trazer a conversa de outro agente, e memória com curator para guardar o que ficou.",
      },
      {
        titulo: "O que você precisa antes de começar",
        texto:
          "O Hermes instalado e um provedor de modelo autenticado, por assinatura ou por chave de API. O gateway rodando, que é o processo que faz os agendamentos dispararem sozinhos. E uma pasta sua para estudo, sempre a mesma.",
      },
      {
        titulo: "Como usar este guia",
        texto:
          "Ligue uma capacidade por semana, na ordem em que estão. Ligar as cinco no primeiro dia é a forma mais rápida de abandonar tudo na quinta-feira. Comece pelo agendamento da manhã, viva uma semana com ele, e só então acrescente a próxima. Cada capacidade tem um bloco de verificação para você saber se funcionou de verdade, em vez de descobrir três dias depois que nada disparou.",
      },
    ],
  },
];

export function getResource(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
