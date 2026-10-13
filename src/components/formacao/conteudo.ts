/* ============================================================================
 *  /formacao · conteúdo da LP da Formação Arquiteto de Agentes
 * ----------------------------------------------------------------------------
 *  Fonte dos módulos e aulas: Starlight/HERMES/2-PRODUTO/formacao-titulos-aprovados-12-10.md
 *  (aprovado pelo Red em 12/10/2026, igual ao que está na Hotmart, produto 8660306).
 *  Fachadas: Starlight/HERMES/4-MARKETING/landing-formacao-3d/FACHADAS.md. O texto da
 *  fachada é o da placa da porta no vídeo; o nome oficial vai no painel.
 *
 *  Renomear aula aqui não regera vídeo nenhum: todo texto legível da página é DOM.
 * ==========================================================================*/

export const CHECKOUT_FORMACAO = "https://pay.hotmart.com/J107893534P";
export const PRECO_FORMACAO = 997;
export const SUPORTE = "suporte@redpro.com.br";

export type Modulo = {
  n: number;
  nome: string;
  fachada: string;
  cor: string;
  aulas: string[];
};

export const MODULOS: Modulo[] = [
  {
    n: 1,
    nome: "O que acontece dentro de um agente",
    fachada: "Por dentro de um Agente",
    cor: "#5fd3e6",
    aulas: [
      "O que você vai construir até o fim da Formação",
      "O mapa completo de um agente de IA",
      "Como o agente entende o que você pediu e o que ele não pode fazer",
      "Como o agente quebra a tarefa, escolhe a ferramenta e sabe que terminou",
      "Como o agente lembra, com memória, RAG e estado",
      "Como o modelo decide a próxima ação",
      "As mãos do agente, de busca e API a banco de dados e MCP",
      "Como o agente lê o resultado e percebe o próprio erro",
      "O loop planejar, raciocinar, agir e observar",
      "Como saber se o agente acertou, e quando confiar nele",
      "Os três jeitos de um agente entregar o resultado",
      "Codex, Claude Code e Antigravity lado a lado, e qual escolher pra cada trabalho",
      "Contrato de prompt e prompt reverso",
      "Contexto que não estoura",
    ],
  },
  {
    n: 2,
    nome: "Seu agente ligado 24 horas, sem o seu PC",
    fachada: "Seu agente 24h no ar",
    cor: "#f2b24c",
    aulas: [
      "A primeira resposta vindo de fora da sua casa",
      "Qual VPS comprar sem pagar mais do que precisa",
      "Blindar antes de ligar qualquer canal",
      "Acesso remoto sem abrir a porta pro mundo, com Tailscale",
      "Manter o gateway no ar",
      "Os erros que emperram a instalação",
    ],
  },
  {
    n: 3,
    nome: "De um agente a um squad",
    fachada: "De um Agente a um Squad",
    cor: "#6ee38a",
    aulas: [
      "A memória que não pode virar bagunça",
      "Qual modelo usar em cada função do seu agente",
      "A skill que resolve o erro que se repete",
      "Dez skills que valem instalar hoje",
      "Construindo a sua própria skill em quinze minutos",
      "Tarefa que roda sem você lembrar",
      "A instrução que se corrige sozinha",
    ],
  },
  {
    n: 4,
    nome: "Agentes tocando o seu negócio",
    fachada: "Agentes no seu Negócio",
    cor: "#f3d9a4",
    aulas: [
      "O chefe de gabinete que nunca dorme",
      "O sistema completo de um funcionário de IA",
      "Montando o seu primeiro funcionário digital",
      "Sua empresa inteira dentro do Hermes",
      "Instalar o agente e ensinar o seu negócio a ele",
      "Quanto custa seu squad rodando",
    ],
  },
  {
    n: 5,
    nome: "Seu Squad de desenvolvimento",
    fachada: "Seu Squad de desenvolvimento",
    cor: "#ff8a3d",
    aulas: [
      "Os três estágios de um sistema, do rascunho ao ar",
      "Git e GitHub, sem decorar comando",
      "Supabase como o banco de dados do squad",
      "Do código ao ar",
      "O Squad de desenvolvimento por dentro, em operação de verdade",
      "Como delegar para subagentes",
      "Perfis e o quadro de tarefas",
      "O fluxo multiagente montado do zero",
      "As ferramentas que o time usa",
      "Segurança do esquadrão",
      "MCP ou skill, qual resolve o seu problema",
      "Vários agentes, o mesmo problema, um consenso",
      "Agentes que discordam antes de decidir",
      "Um agente que confere o trabalho do outro",
    ],
  },
  {
    n: 6,
    nome: "Sua equipe de Marketing e Conteúdo",
    fachada: "Sua equipe de Marketing e Conteúdo",
    cor: "#e472e8",
    aulas: [
      "O estúdio de conteúdo com cinco agentes",
      "O pipeline de conteúdo no quadro de tarefas",
      "Postar, responder e captar lead nas redes",
      "Tráfego pago no piloto automático",
      "O resto do marketing no automático",
      "Carrossel no automático",
      "Comentário que vira DM, no lugar do ManyChat",
      "Publicar sem abrir o aplicativo",
    ],
  },
  {
    n: 7,
    nome: "Projetos prontos pra você copiar",
    fachada: "Projetos prontos pra você copiar",
    cor: "#f4f4f0",
    aulas: [
      "Briefing matinal automático",
      "Preparação de reunião",
      "Triagem de e-mail com resposta rascunhada",
      "Pesquisa de prospect",
      "Segundo cérebro de notas e documentos",
      "Revisão semanal automática",
      "Pesquisa de investimentos automatizada",
      "Atendimento ao cliente de verdade",
      "Seis fluxos prontos pra roubar",
      "O agente assiste a um vídeo e monta o plano",
      "O agente que opera o navegador por você",
    ],
  },
];

export const TOTAL_AULAS = MODULOS.reduce((s, m) => s + m.aulas.length, 0);

/* ============================================================================
 *  LINHA DO TEMPO DO VOO
 * ----------------------------------------------------------------------------
 *  O master tem 80 s (8 clipes, Seedance 2.5, 720p) e virou 1.201 quadros a
 *  15 fps em /public/formacao/voo/{d,m}/0001.webp. Cada trecho liga uma
 *  distância de rolagem (vh) a um intervalo de tempo do vídeo. Trecho com
 *  t0 == t1 é pausa (quadro parado).
 *
 *  Tempos do master (conferidos na folha de contato):
 *   0-8     fachada, saguão, porta da sala 1
 *   8+10k   cada clipe k (1..6): entra na sala k, voa 6 s, corredor e porta k+1
 *   68-80   galeria, saída, giro e revelação com o título
 * ==========================================================================*/

export const FPS = 15;
export const TOTAL_QUADROS = 1201;
export const DURACAO = 80;

export type Trecho = {
  t0: number;
  t1: number;
  vh: number;
  /** índice do módulo cujo painel aparece neste trecho */
  modulo?: number;
  /** índice do módulo cuja placa está na porta (só o celular repete em texto) */
  placa?: number;
  tipo?: "hero" | "fim";
};

function sala(k: number, vhPainel: number): Trecho[] {
  const s = 8 + 10 * k;
  const fim: Trecho[] = [
    { t0: s, t1: s + 1, vh: 30 },
    { t0: s + 1, t1: s + 7, vh: vhPainel, modulo: k },
  ];
  if (k < 6) fim.push({ t0: s + 7, t1: s + 10, vh: 60, placa: k + 1 });
  return fim;
}

export const TRECHOS: Trecho[] = [
  { t0: 0, t1: 0, vh: 45, tipo: "hero" },
  { t0: 0, t1: 5, vh: 70 },
  { t0: 5, t1: 8, vh: 60, placa: 0 },
  ...sala(0, 170),
  ...sala(1, 100),
  ...sala(2, 110),
  ...sala(3, 100),
  ...sala(4, 170),
  ...sala(5, 120),
  { t0: 68, t1: 69, vh: 30 },
  { t0: 69, t1: 72, vh: 150, modulo: 6 },
  { t0: 72, t1: 77, vh: 110 },
  { t0: 77, t1: 79.9, vh: 70, tipo: "fim" },
  { t0: 79.9, t1: 79.9, vh: 50, tipo: "fim" },
];
