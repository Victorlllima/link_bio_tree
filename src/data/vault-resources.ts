// RedVault — fonte de dados dos resources. Espelha .claude/REDVAULT-RESOURCES.md do Starlight.
// Cada resource vira um card no vault + uma página /vault/[slug] com blocos copy-paste (nada pra baixar).

export type BlocoTipo = "texto" | "codigo";
export interface Bloco {
  titulo?: string;
  tipo: BlocoTipo;
  conteudo: string;
}
export interface Resource {
  slug: string;
  titulo: string;
  categoria: "Prompts" | "Skills" | "Guias" | "Clones" | "Agentes" | "Automação";
  destaque?: boolean;
  novo?: boolean;
  resumo: string;      // aparece no card
  intro: string;       // 1-2 parágrafos no topo da página
  blocos: Bloco[];     // os blocos copy-paste
}

export const CATEGORIAS = ["Tudo", "Prompts", "Skills", "Guias", "Clones", "Agentes", "Automação"] as const;

export const RESOURCES: Resource[] = [
  {
    slug: "context-engineering",
    titulo: "Context Engineering em 5 minutos",
    categoria: "Guias",
    destaque: true,
    novo: true,
    resumo: "A skill que o Karpathy diz valer mais que \"saber programar\". As 3 peças do contexto e como aplicar hoje.",
    intro: "Você aprendeu a fazer \"prompt\". Funciona. Mas tem um nível acima, e é onde mora a diferença entre quem usa IA e quem faz IA trabalhar de verdade: context engineering. Prompt é a pergunta que você faz. Contexto é tudo que o agente sabe quando vai responder. Quem controla o contexto, controla a qualidade.",
    blocos: [
      { titulo: "As 3 peças do contexto", tipo: "texto", conteudo: "1. INSTRUÇÃO — o que o agente deve fazer, seu papel, suas regras. (o \"quem você é\")\n2. MEMÓRIA — o que ele já sabe de você e da conversa. Curto prazo (essa sessão) e longo prazo (histórico, preferências).\n3. BUSCA (retrieval/RAG) — trazer os dados certos na hora certa. Seu manual, sua tabela, seus documentos." },
      { titulo: "Como aplicar hoje (3 passos)", tipo: "texto", conteudo: "1. Antes de pedir algo à IA, pergunte: \"ela tem TODA a informação que um humano precisaria pra fazer isso?\"\n2. Se falta, dê o contexto: cole o documento, explique a regra, dê o exemplo.\n3. Estruture: instrução clara + dados relevantes + exemplo do resultado esperado." },
      { titulo: "Por que isso importa", tipo: "texto", conteudo: "Um prompt bom com contexto ruim dá resposta genérica. Um prompt simples com contexto certo dá resposta cirúrgica. A maioria briga com o prompt quando o problema é o contexto. Context engineering é a base de todo agente de verdade." },
    ],
  },
  {
    slug: "memoria-agente",
    titulo: "Como dar memória ao seu agente",
    categoria: "Guias",
    novo: true,
    resumo: "Por que seu GPT esquece tudo e o passo a passo pra dar memória de longo prazo. Vira funcionário, não papagaio.",
    intro: "A reclamação nº1 de quem mexe com IA: \"configurei tudo, fechei, abri de novo e ele não lembra de nada\". Isso não é defeito. É falta de memória de longo prazo. E dá pra resolver.",
    blocos: [
      { titulo: "As 2 memórias de um agente", tipo: "texto", conteudo: "CURTO PRAZO: o que rolou nessa conversa. Todo chatbot tem. Fecha a aba, perde.\nLONGO PRAZO: o que persiste entre conversas. Suas preferências, seu histórico, o que já deu certo. É isso que faz o agente te conhecer." },
      { titulo: "O passo a passo (memória de longo prazo)", tipo: "texto", conteudo: "1. Escolha o que vale lembrar: nem tudo. Preferências, decisões, fatos sobre você/seu negócio.\n2. Um lugar pra guardar: um arquivo, um banco simples, ou a memória nativa da ferramenta.\n3. Regra de escrita: o agente registra o que é novo e estrutural, não cada mensagem.\n4. Regra de leitura: no começo de cada conversa, ele lê o que já sabe de você.\n5. Manutenção: revisar o que virou desatualizado." },
      { titulo: "O resultado", tipo: "texto", conteudo: "Você volta semana que vem e ele já sabe quem você é, o que você faz, como você gosta. Deixa de recomeçar do zero. Vira funcionário, não papagaio." },
    ],
  },
  {
    slug: "primeiro-agente",
    titulo: "Checklist: seu primeiro agente",
    categoria: "Skills",
    novo: true,
    resumo: "Os 8 passos pra escolher e montar o primeiro agente que te liberta da tarefa mais repetitiva.",
    intro: "Todo mundo quer começar pelo agente mais impressionante. Erro. Você começa pelo mais chato: o que tira de você a tarefa que você mais repete. É onde você aprende rápido.",
    blocos: [
      { titulo: "O checklist (8 passos)", tipo: "texto", conteudo: "☐ 1. Ache a tarefa certa. Não a mais impressionante. A que você MAIS repete e mais te cansa.\n☐ 2. Descreva o que é \"feito\". Como saberia que o agente fez certo?\n☐ 3. Liste as regras. O que ele NUNCA pode fazer? Onde deve te perguntar antes?\n☐ 4. Escolha a ferramenta. Comece simples.\n☐ 5. Escreva a instrução. Quem ele é + o que faz + tom + regras.\n☐ 6. Teste com casos reais que você conhece de cor.\n☐ 7. Corrija e repita. Errou? Ajusta a instrução, não o código.\n☐ 8. Solte pequeno. Deixa fazer a tarefa real com você conferindo, antes de confiar sozinho." },
      { titulo: "A regra de ouro", tipo: "texto", conteudo: "Você vai errar no começo. Por isso escolhe uma tarefa que você conhece, pra corrigir rápido. Quando esse primeiro funciona, você entendeu o mecanismo. Aí monta o time." },
    ],
  },
  {
    slug: "arquiteto-agentes",
    titulo: "Mapa: virar Arquiteto de Soluções Agênticas",
    categoria: "Guias",
    novo: true,
    resumo: "Os 4 níveis (de \"usa IA\" a \"orquestra sistemas\") e o caminho pra subir. A profissão que o Karpathy descreveu.",
    intro: "Karpathy disse: o melhor engenheiro não escreve cada linha, lidera os agentes que escrevem. Essa profissão tem nome e um caminho. Aqui está o mapa.",
    blocos: [
      { titulo: "Os 4 níveis", tipo: "texto", conteudo: "1. USA IA — você pergunta, ela responde. (a maioria para aqui)\n2. AUTOMATIZA — você monta fluxos fixos (se isso, faça aquilo).\n3. CONSTRÓI AGENTES — sistemas que agem, lembram e decidem sozinhos.\n4. ORQUESTRA SISTEMAS — um time de agentes operando um negócio. (o Arquiteto)" },
      { titulo: "O caminho", tipo: "texto", conteudo: "Nível 3 primeiro: monte UM agente que resolve UMA dor sua. Domine o mecanismo. Depois escale pro time. Não pule pro nível 4 sem passar pelo 3." },
      { titulo: "O que NÃO é preciso", tipo: "texto", conteudo: "Não é preciso escrever código do zero nem virar dev. É preciso saber orquestrar. A ferramenta faz o código; você faz a decisão." },
    ],
  },
  {
    slug: "o-caminho",
    titulo: "O caminho (do 1º agente ao time)",
    categoria: "Guias",
    novo: true,
    resumo: "O caminho que eu segui de verdade, sem romantizar. Do primeiro agente feio ao time inteiro.",
    intro: "Comecei respondendo a mesma mensagem pela milésima vez, às 11 da noite. Montei um agente feio que funcionava. E não parei mais. Aqui está o caminho, pra você seguir o seu.",
    blocos: [
      { titulo: "As 5 fases", tipo: "texto", conteudo: "1. O INCÔMODO (a faísca). Ache a tarefa que te faz pensar \"por que EU tô fazendo isso?\".\n2. O PRIMEIRO AGENTE (feio e funcional). Não tente fazer bonito. Faça funcionar.\n3. O LOOP DE MELHORIA. Você usa, vê onde falha, ajusta. Cada semana ele fica melhor.\n4. O SEGUNDO AGENTE. Quando o primeiro funciona, o segundo é mais fácil.\n5. O TIME. Um agente chama outro. Aí você tem uma operação, não uma ferramenta." },
      { titulo: "A verdade que ninguém conta", tipo: "texto", conteudo: "Não começou bonito nem rápido. Começou com uma tarefa chata e teimosia. Se você espera o momento perfeito, não começa. Comece feio." },
    ],
  },
  {
    slug: "hormozi-coach",
    titulo: "Alex Hormozi Business Coach",
    categoria: "Clones",
    destaque: true,
    resumo: "Transforma o Claude num coach estilo Hormozi. O prompt + os frameworks dos livros dele num knowledge pack pra colar no projeto.",
    intro: "Transforma o Claude no Alex Hormozi — o coach que corta a enrolação e te diz a UMA coisa pra arrumar. E não é só o estilo: você carrega os frameworks dos livros dele, então ele te orienta como ele realmente faria. Nada pra baixar: copia cada bloco, cola num doc, salva. Esse é o arquivo.",
    blocos: [
      { titulo: "Passo 1 — o prompt (cole nas instruções do Projeto Claude)", tipo: "codigo", conteudo: "# Papel\nVocê é Alex Hormozi — coach de negócios, autor de $100M Offers, $100M Leads e $100M Money Models.\n\n# Voz\nDireto. Sem rodeio. Frases curtas. Cita frameworks pelo nome. Fala o que a pessoa não quer ouvir. Usa matemática, não conselho vago.\n\n# Regras\n1. SEMPRE diagnostique antes de prescrever — faça 3 a 5 perguntas primeiro.\n2. Use o framework 6M (Métricas, Modelo, Dinheiro, Time, Gestão, Mercado) pra achar a UMA restrição.\n3. Cite frameworks pelo nome — Equação de Valor, Grand Slam Offer, Core Four.\n4. Use matemática. Dê números específicos.\n5. Termine toda resposta com UMA ação específica pras próximas 48 horas." },
      { titulo: "Passo 2 — a Equação de Valor (knowledge doc)", tipo: "codigo", conteudo: "Valor = (Resultado dos Sonhos × Probabilidade Percebida de Conquista) / (Tempo de Espera × Esforço e Sacrifício)\n\nMaximize o topo. Minimize a base. É o jogo inteiro.\n- Resultado dos Sonhos (AUMENTAR): torne o estado final mais vívido, maior, mais status.\n- Probabilidade (AUMENTAR): prova social, cases, garantias, mecanismo explicado.\n- Tempo de Espera (DIMINUIR): crie vitórias rápidas no começo.\n- Esforço (DIMINUIR): feito-por-você > feito-com-você > faça-você-mesmo." },
      { titulo: "Passo 3 — as perguntas de diagnóstico", tipo: "codigo", conteudo: "Antes de qualquer conselho, pergunte:\n1. Qual sua receita mensal atual?\n2. Qual sua margem bruta?\n3. Quantos clientes você tem?\n4. Pra quanto quer crescer, e até quando?\n5. Qual você acha que é sua restrição nº1 agora?\n\nNão prescreva sem isso. Sempre diagnostique primeiro. Termine com UMA ação pras próximas 48h." },
    ],
  },
  {
    slug: "5-prompts-claude",
    titulo: "5 Prompts pro Claude",
    categoria: "Prompts",
    resumo: "Os 5 prompts que eu mais uso no dia a dia, prontos pra colar. Copy-paste, sem enrolação.",
    intro: "Cinco prompts que resolvem o grosso do que você precisa no Claude. Copia, cola, usa. (Guia completo já publicado em /guias/5-prompts-claude — este card leva pra lá.)",
    blocos: [
      { titulo: "Onde pegar", tipo: "texto", conteudo: "Este resource já tem guia publicado. Acesse a versão completa em redpro.com.br/guias/5-prompts-claude." },
    ],
  },
];

export const getResource = (slug: string) => RESOURCES.find((r) => r.slug === slug);
