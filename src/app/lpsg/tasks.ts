// Fonte única de verdade das tarefas do 1º ciclo LPSG.
// O banco guarda APENAS o estado (responsável + done) por task_id.
// Editar a lista aqui não exige migração — só manter os ids estáveis.

export type Responsavel = "victor" | "gleyce" | null;

export interface Task {
  id: string;
  label: string;
  detalhe?: string;
  // sugestão de dono — o usuário pode sobrescrever no painel
  sugestao: Exclude<Responsavel, null>;
  frente: string;
}

export interface Frente {
  id: string;
  titulo: string;
  descricao: string;
}

export const FRENTES: Frente[] = [
  {
    id: "gravacao",
    titulo: "🎬 Gravação (gargalo)",
    descricao: "Exige a cara e a voz do Red. Nada avança sem isso.",
  },
  {
    id: "decisoes",
    titulo: "🧭 Decisões do Red",
    descricao: "Só o Red decide. Levar resolvido para a reunião.",
  },
  {
    id: "hotmart",
    titulo: "🛒 Hotmart / Comercial",
    descricao: "Cria produtos, preços e checkout. Destrava e-mails, páginas e automações.",
  },
  {
    id: "paginas",
    titulo: "📄 Páginas e Automação",
    descricao: "Landing pages, e-mails, WhatsApp, ficha de interesse. Rascunhos já prontos.",
  },
  {
    id: "trafego",
    titulo: "📣 Tráfego e Captação",
    descricao: "Anúncios do curso de entrada e do ingresso.",
  },
  {
    id: "gestao",
    titulo: "📋 Gestão de Projeto",
    descricao: "Cronograma, cobrança de prazos, coordenação geral.",
  },
];

export const TASKS: Task[] = [
  // Gravação — Red
  { id: "grav-5aulas", frente: "gravacao", sugestao: "victor", label: "Gravar as 5 aulas do evento", detalhe: "CRM ao vivo com Claude Code, 40-50min cada" },
  { id: "grav-pitch", frente: "gravacao", sugestao: "victor", label: "Gravar o pitch de domingo (Aula 6)", detalhe: "Vende a Formação S.H.A.R.K." },
  { id: "grav-ponte", frente: "gravacao", sugestao: "victor", label: "Gravar a aula-ponte do curso de entrada", detalhe: "Redireciona para o evento" },
  { id: "grav-criativos", frente: "gravacao", sugestao: "victor", label: "Gravar 2 criativos do curso de entrada", detalhe: "Reel 'quanto cobrar' + bastidor casual" },

  // Decisões — Red
  { id: "dec-data", frente: "decisoes", sugestao: "victor", label: "Travar a data do evento", detalhe: "20/jul se mantém ou empurra?" },
  { id: "dec-horario", frente: "decisoes", sugestao: "victor", label: "Travar o horário das aulas", detalhe: "7h (padrão do método) ou 20h (público CLT)?" },
  { id: "dec-precos", frente: "decisoes", sugestao: "victor", label: "Aprovar os preços no Hotmart", detalhe: "Curso R$17, ingresso R$44, Formação R$998" },
  { id: "dec-carrinho", frente: "decisoes", sugestao: "victor", label: "Definir a hora de fechamento do carrinho", detalhe: "Janela curta de urgência" },
  { id: "dec-trafego", frente: "decisoes", sugestao: "victor", label: "Decidir se o ingresso R$44 recebe tráfego pago", detalhe: "Ou só orgânico no 1º ciclo" },
  { id: "dec-bonus", frente: "decisoes", sugestao: "victor", label: "Revalidar os bônus do pitch", detalhe: "Não repetir o que o público já ganhou no curso de entrada" },
  { id: "dec-provasocial", frente: "decisoes", sugestao: "victor", label: "Fornecer prova social real", detalhe: "Nome + resultado — os depoimentos dependem dos casos" },

  // Hotmart — Gleyce
  { id: "hot-ingresso", frente: "hotmart", sugestao: "gleyce", label: "Criar produto 'Ingresso do evento' R$44", detalhe: "Produto próprio no Hotmart" },
  { id: "hot-reprecificar", frente: "hotmart", sugestao: "gleyce", label: "Reajustar preços do curso de entrada e bumps", detalhe: "Curso R$17 · bumps R$26 / R$35 (aguarda OK do Red)" },
  { id: "hot-capas", frente: "hotmart", sugestao: "gleyce", label: "Trocar as capas dos bumps após reajustar" },
  { id: "hot-formacao", frente: "hotmart", sugestao: "gleyce", label: "Criar produto Formação S.H.A.R.K. R$998", detalhe: "Carrinho abre 27/jul" },
  { id: "hot-checkout", frente: "hotmart", sugestao: "gleyce", label: "Configurar checkout do ingresso + área de entrega", detalhe: "Onde as aulas gravadas ficam disponíveis" },
  { id: "hot-limpar", frente: "hotmart", sugestao: "gleyce", label: "Limpar o Hotmart deixando só a RedPro AI Academy" },

  // Páginas e Automação — Gleyce
  { id: "pag-ingresso", frente: "paginas", sugestao: "gleyce", label: "Página de venda do ingresso", detalhe: "Só narrativa, sem formulário/pop-up (aguarda OK do Red)" },
  { id: "pag-formacao", frente: "paginas", sugestao: "gleyce", label: "Página de venda da Formação S.H.A.R.K.", detalhe: "Para o carrinho de 27/jul" },
  { id: "pag-obrigado", frente: "paginas", sugestao: "gleyce", label: "Página de obrigado com link do grupo de WhatsApp" },
  { id: "aut-grupo", frente: "paginas", sugestao: "gleyce", label: "Grupo de WhatsApp + automação que libera acesso pós-compra", detalhe: "Rascunho pronto" },
  { id: "aut-ficha", frente: "paginas", sugestao: "gleyce", label: "Ficha de interesse (abre na aula de quinta, 23/jul)", detalhe: "Spec pronta" },
  { id: "aut-emails", frente: "paginas", sugestao: "gleyce", label: "Programar a sequência de e-mails", detalhe: "12 e-mails já escritos, aguardam aprovação do Red" },
  { id: "aut-lista", frente: "paginas", sugestao: "gleyce", label: "Criar a lista de e-mail dos inscritos" },
  { id: "aut-recuperacao", frente: "paginas", sugestao: "gleyce", label: "Automação de recuperação de carrinho abandonado", detalhe: "3 mensagens prontas" },
  { id: "aut-plataforma", frente: "paginas", sugestao: "gleyce", label: "Definir a plataforma onde as aulas gravadas vão rodar" },

  // Tráfego — Gleyce
  { id: "traf-anuncios", frente: "trafego", sugestao: "gleyce", label: "Montar os anúncios de venda do ingresso", detalhe: "5 variações, máx. 60% de texto na imagem" },
  { id: "traf-curso", frente: "trafego", sugestao: "gleyce", label: "Subir o tráfego do curso de entrada", detalhe: "Assim que o Red entregar os 2 criativos" },
  { id: "traf-meta", frente: "trafego", sugestao: "gleyce", label: "Configurar meta de lista até 19/jul", detalhe: "Referência: 30% de presença na Aula 1" },

  // Gestão — Gleyce
  { id: "ges-cronograma", frente: "gestao", sugestao: "gleyce", label: "Manter o cronograma vivo e cobrar cada prazo" },
  { id: "ges-ordem", frente: "gestao", sugestao: "gleyce", label: "Garantir a ordem certa: Hotmart primeiro", detalhe: "Destrava e-mails, páginas e automações" },
  { id: "ges-status", frente: "gestao", sugestao: "gleyce", label: "Relatório de status diário até o evento" },
  { id: "ges-roteiro", frente: "gestao", sugestao: "gleyce", label: "Quebrar o conteúdo do CRM nas 5 aulas + roteiro do pitch", detalhe: "O Red grava, ela estrutura os roteiros" },
];

// Fases do método Tabari com as datas reais do 1º ciclo.
export interface Fase {
  num: string;
  titulo: string;
  data: string;
  descricao: string;
  cor: string;
}

export const FASES_TABARI: Fase[] = [
  {
    num: "1",
    titulo: "Captação (Curso de Entrada)",
    data: "Agora → contínuo",
    descricao: "Curso de R$17 com tráfego pago traz leads a custo quase zero. Quem compra entra na lista do evento.",
    cor: "#f97316",
  },
  {
    num: "2",
    titulo: "Aquecimento da Lista",
    data: "10 → 19/jul",
    descricao: "Conteúdo orgânico + e-mails preparam a lista para o evento. Meta: 30% de presença na 1ª aula.",
    cor: "#fb923c",
  },
  {
    num: "3",
    titulo: "Evento 5+1 (Aulas 1-5)",
    data: "20 → 24/jul",
    descricao: "5 dias entregando valor real: a pessoa constrói um CRM funcional. Marcos de vitória na quarta e na sexta.",
    cor: "#f59e0b",
  },
  {
    num: "4",
    titulo: "Pitch de Domingo (Aula 6)",
    data: "26/jul · 20h",
    descricao: "A oferta da Formação S.H.A.R.K. R$998. Ancoragem, bônus escalonados, escassez real.",
    cor: "#ef4444",
  },
  {
    num: "5",
    titulo: "Abertura do Carrinho",
    data: "27/jul · 6h50",
    descricao: "Carrinho abre com janela curta. Prova social intercalada + recuperação de abandono até fechar.",
    cor: "#dc2626",
  },
];
