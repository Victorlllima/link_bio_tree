// Fonte única de verdade das tarefas do 1º ciclo LPSG.
// O banco guarda APENAS o estado (responsável + done) por task_id.
// Editar a lista aqui não exige migração — só manter os ids estáveis.

export type Responsavel = "victor" | "gleyce" | "ambos" | null;

export interface TutorialPasso {
  titulo: string;
  passos: string[];
}

export interface Task {
  id: string;
  label: string;
  detalhe?: string;
  sugestao: Exclude<Responsavel, null>;
  frente: string;
  ordem?: number; // prioridade dentro da frente (menor = mais prioritário)
  pendencia?: boolean; // marca visual de pendência crítica
  tutorial?: TutorialPasso; // passo a passo (modal) — usado na frente Hotmart
}

export interface Frente {
  id: string;
  titulo: string;
  // 3 níveis do método
  estrategico: string;
  tatico: string;
}

export const FRENTES: Frente[] = [
  {
    id: "gravacao",
    titulo: "🎬 Gravação",
    estrategico:
      "É o único bloqueio real do cronograma. Nenhuma outra frente entrega valor sem as gravações prontas. Prioridade absoluta e em ordem: a captação (aula 12 do IAA + criativos) vem antes das aulas do evento, porque é o que enche a lista.",
    tatico:
      "4 entregas, todas do Victor, em ordem de prioridade: (1) regravar a aula 12 do IAA para apontar pro evento, (2) criativos do curso de entrada para o tráfego, (3) as 5 aulas do evento — que já incluem a construção do CRM ao vivo, (4) o roteiro do pitch de domingo que vende a Formação.",
  },
  {
    id: "hotmart",
    titulo: "🛒 Hotmart / Comercial",
    estrategico:
      "É o primeiro dominó da operação. Criar os produtos no Hotmart destrava e-mails, checkout e automações. Se atrasa, tudo atrasa. Cada tarefa tem um tutorial passo a passo para a Gleyce executar sem erro.",
    tatico:
      "6 tarefas operacionais da Gleyce + 1 pendência do Victor (prova social). Ordem importa: reprecificar e criar o ingresso antes das páginas; criar a Formação antes do carrinho de 27/jul.",
  },
  {
    id: "paginas",
    titulo: "📄 Páginas e Automação",
    estrategico:
      "Toda a comunicação com o inscrito, do cadastro ao carrinho. Os rascunhos já estão prontos — o trabalho é montar e programar, não criar do zero.",
    tatico:
      "Frente conduzida pelo Victor. Dependem do Hotmart (precisam dos IDs dos produtos) para ligar checkout e automações.",
  },
  {
    id: "trafego",
    titulo: "📣 Tráfego e Captação",
    estrategico:
      "Enche a lista antes do evento — meta de 30% de presença na Aula 1. Pelo método Tabari o LPSG é lançamento PAGO: o ingresso recebe tráfego pago (ROAS piso 1,25, o lucro vem no pitch de domingo).",
    tatico:
      "Frente conduzida pelo Victor. Começa com a lista do IAA + orgânico e liga tráfego pago leve assim que os criativos ficarem prontos.",
  },
  {
    id: "gestao",
    titulo: "📋 Gestão de Projeto",
    estrategico:
      "O chapéu da Gleyce. Garante que a ordem certa seja seguida (Hotmart primeiro) e que nenhum bloqueio passe despercebido.",
    tatico:
      "Coordenação contínua até o evento. Cobra prazos, mantém o cronograma vivo e reporta status.",
  },
];

export const TASKS: Task[] = [
  // ---------- FRENTE 1 — GRAVAÇÃO (ordem de prioridade) ----------
  { id: "grav-aula12", frente: "gravacao", ordem: 1, sugestao: "victor", label: "Regravar a aula 12 do IAA (Introdução à Automação)", detalhe: "Nova ponte final aponta pro evento, não pro S.H.A.R.K. genérico" },
  { id: "grav-criativos", frente: "gravacao", ordem: 2, sugestao: "victor", label: "Produzir criativos do curso de entrada (IAA)", detalhe: "Reel 'quanto cobrar' + UGC casual — desbloqueia o tráfego" },
  { id: "grav-5aulas", frente: "gravacao", ordem: 3, sugestao: "victor", label: "Gravar as 5 aulas do evento", detalhe: "CRM ao vivo com Claude Code, 40-50min cada (a construção do CRM faz parte das aulas)" },
  { id: "grav-pitch", frente: "gravacao", ordem: 4, sugestao: "victor", label: "Escrever o pitch de domingo (Aula 6)", detalhe: "Vende a Formação S.H.A.R.K. R$998" },

  // ---------- FRENTE 2 — HOTMART (com tutoriais) ----------
  {
    id: "hot-ingresso", frente: "hotmart", sugestao: "gleyce",
    label: "Criar produto 'Ingresso do evento' R$44", detalhe: "Produto próprio no Hotmart",
    tutorial: {
      titulo: "Criar o produto do Ingresso R$44",
      passos: [
        "Entrar em app.hotmart.com → Produtos → Novo Produto.",
        "Tipo: 'Curso Online / Área de Membros' (as aulas gravadas ficam aqui).",
        "Nome do produto: 'Ingresso — Como Construir um CRM Customizado em 5 Dias'.",
        "Definir preço: R$44 à vista. Em Precificação e Ofertas, criar a oferta principal.",
        "Imagem do produto: 600×600px, PNG/JPG, máx 5MB.",
        "Preencher 'Descrição para compradores' e 'Perfil para compradores' (esse é o campo do checkout — não deixar Lorem ipsum).",
        "Salvar e publicar. Anotar o ID numérico do produto e o código de checkout (aparece ao lado do nome).",
      ],
    },
  },
  {
    id: "hot-reprecificar", frente: "hotmart", sugestao: "gleyce",
    label: "Reajustar preços do IAA e dos bumps", detalhe: "IAA R$97→R$17 · Bump 1 R$37→R$26 · Bump 2 R$27→R$35 (soma 8)",
    tutorial: {
      titulo: "Reajustar preços (clube da soma 8)",
      passos: [
        "Produtos → Sou Produtor(a) → 'Introdução à Automação' (ID 8039631) → Precificação e Ofertas.",
        "Editar a oferta principal: trocar R$97 por R$17.",
        "Abrir o Bump 1 'Kit Captação — Seus 5 Primeiros Clientes' (ID 8052251): trocar R$37 por R$26.",
        "Abrir o Bump 2 'Quanto Cobrar — Manual de Precificação' (ID 8052292): trocar R$27 por R$35.",
        "Salvar cada um. ⚠️ Preço em produção — confirmar com o Victor antes de aplicar (approval gate).",
      ],
    },
  },
  {
    id: "hot-capas", frente: "hotmart", sugestao: "gleyce",
    label: "Trocar as capas dos bumps após reajustar",
    tutorial: {
      titulo: "Trocar as capas dos bumps",
      passos: [
        "Gerar as novas capas com os preços atualizados (script bumps/capas/gerar-curso.js, se disponível — senão pedir ao Victor).",
        "Produtos → cada bump → Página do Produto → Imagem do produto → substituir (600×600px).",
        "Salvar e conferir no checkout se a capa nova aparece.",
      ],
    },
  },
  {
    id: "hot-formacao", frente: "hotmart", sugestao: "gleyce",
    label: "Criar produto Formação S.H.A.R.K. R$998", detalhe: "12x R$97 · carrinho abre 27/jul",
    tutorial: {
      titulo: "Criar o produto da Formação S.H.A.R.K.",
      passos: [
        "Produtos → Novo Produto → tipo 'Curso Online / Área de Membros'.",
        "Nome: 'Formação S.H.A.R.K.'.",
        "Precificação: R$998 à vista + parcelamento em 12x (Parcelado com taxas, até 12x).",
        "Configurar 'Parcelado' para exibir 12x como padrão no checkout (parâmetro ?split=12).",
        "Garantia: configurar 7 dias.",
        "NÃO abrir o carrinho ainda — deixar pronto para ativar em 27/jul às 6h50.",
        "Anotar o ID do produto e o código de checkout.",
      ],
    },
  },
  {
    id: "hot-checkout", frente: "hotmart", sugestao: "gleyce",
    label: "Configurar checkout do ingresso + área de entrega", detalhe: "Onde as aulas gravadas ficam disponíveis",
    tutorial: {
      titulo: "Checkout do ingresso + área de membros",
      passos: [
        "Produtos → Área de Membros → área do 'Ingresso' → Conteúdo → Criar módulo (uma aula por dia do evento).",
        "Fazer upload das 5 aulas gravadas (mp4, máx 20GB cada) conforme o Victor entregar.",
        "Ferramentas → Aparência da Página de Pagamento → produto Ingresso → configurar Página de Obrigado (redireciona pro grupo de WhatsApp).",
        "Testar o fluxo com cupom de ~99% (deixa em R$1,00) — comprar e conferir se o acesso libera.",
      ],
    },
  },
  {
    id: "hot-limpar", frente: "hotmart", sugestao: "gleyce",
    label: "Limpar o Hotmart deixando só a RedPro AI Academy",
    tutorial: {
      titulo: "Limpar o Club",
      passos: [
        "Produtos → Área de Membros: revisar quais áreas/produtos ainda estão ativos.",
        "Arquivar ou remover o que não pertence à RedPro AI Academy (produtos de teste, versões antigas).",
        "Confirmar com o Victor antes de remover qualquer produto com vendas.",
      ],
    },
  },
  { id: "hot-provasocial", frente: "hotmart", sugestao: "victor", pendencia: true, label: "Fornecer prova social real (nome + resultado)", detalhe: "Depoimentos para os e-mails e o carrinho — só o Victor tem os casos. PENDÊNCIA." },

  // ---------- FRENTE 3 — PÁGINAS E AUTOMAÇÃO (Victor) ----------
  { id: "pag-ingresso", frente: "paginas", sugestao: "victor", label: "Página de venda do ingresso", detalhe: "Só narrativa, sem formulário/pop-up (regra Tabari)" },
  { id: "pag-formacao", frente: "paginas", sugestao: "victor", label: "Página de venda da Formação S.H.A.R.K.", detalhe: "Para o carrinho de 27/jul" },
  { id: "pag-obrigado", frente: "paginas", sugestao: "victor", label: "Página de obrigado com link do grupo de WhatsApp" },
  { id: "aut-grupo", frente: "paginas", sugestao: "victor", label: "Grupo de WhatsApp + automação que libera acesso pós-compra", detalhe: "Rascunho pronto" },
  { id: "aut-ficha", frente: "paginas", sugestao: "victor", label: "Ficha de interesse (abre na aula de quinta, 23/jul)", detalhe: "Spec pronta" },
  { id: "aut-emails", frente: "paginas", sugestao: "victor", label: "Programar a sequência de e-mails", detalhe: "12 e-mails já escritos" },
  { id: "aut-lista", frente: "paginas", sugestao: "victor", label: "Criar a lista de e-mail dos inscritos" },
  { id: "aut-recuperacao", frente: "paginas", sugestao: "victor", label: "Automação de recuperação de carrinho abandonado", detalhe: "3 mensagens prontas" },
  { id: "aut-plataforma", frente: "paginas", sugestao: "victor", label: "Definir a plataforma onde as aulas gravadas vão rodar" },

  // ---------- FRENTE 4 — TRÁFEGO E CAPTAÇÃO (Victor) ----------
  { id: "traf-anuncios", frente: "trafego", sugestao: "victor", label: "Montar os anúncios de venda do ingresso", detalhe: "5 variações, máx. 60% de texto na imagem" },
  { id: "traf-curso", frente: "trafego", sugestao: "victor", label: "Subir o tráfego do curso de entrada (IAA)", detalhe: "Assim que os 2 criativos ficarem prontos" },
  { id: "traf-ingresso", frente: "trafego", sugestao: "victor", label: "Ligar tráfego pago do ingresso R$44", detalhe: "Método Tabari: ROAS piso 1,25 · começa com lista IAA + orgânico, liga pago com os criativos" },
  { id: "traf-meta", frente: "trafego", sugestao: "victor", label: "Configurar meta de lista até 19/jul", detalhe: "Referência: 30% de presença na Aula 1" },

  // ---------- FRENTE 5 — GESTÃO (Gleyce) ----------
  { id: "ges-cronograma", frente: "gestao", sugestao: "gleyce", label: "Manter o cronograma vivo e cobrar cada prazo" },
  { id: "ges-ordem", frente: "gestao", sugestao: "gleyce", label: "Garantir a ordem certa: Hotmart primeiro", detalhe: "Destrava e-mails, páginas e automações" },
  { id: "ges-status", frente: "gestao", sugestao: "gleyce", label: "Relatório de status diário até o evento" },
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
    data: "20 → 24/jul · 7h",
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
