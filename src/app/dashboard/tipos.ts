// Formato da resposta de /api/dashboard — compartilhado entre a rota e o painel.

export type Nivel = "ruim" | "atencao" | "bom" | "info";

export interface Leitura {
  nivel: Nivel;
  area: string;
  titulo: string;
  texto: string;
  acao?: string;
}

export interface Fase {
  id: "captacao" | "aulas" | "sabado" | "pitch" | "carrinho" | "pos";
  rotulo: string;
  detalhe: string;
}

export interface CicloInfo {
  d0: string;
  nome: string; // "Turma 2 · 12/out"
  indice: number;
  captIni: string;
  captFim: string;
  pitch: string;
  carrinhoAbre: string;
  carrinhoFecha: string;
  fase: Fase;
  proximo: { rotulo: string; quando: string } | null;
}

export interface Fonte {
  ok: boolean;
  erro?: string;
  obs?: string;
}

export interface DiaTrafego {
  dia: string;
  gasto: number;
  impressoes: number;
  cliquesLink: number;
  lpv: number;
  ic: number;
  ingressos: number;
  receita: number;
}

export interface Criativo {
  adId: string;
  nome: string;
  formato: "video" | "estatico" | "carrossel" | "outro";
  status: string;
  criadoEm: string | null;
  thumb: string | null;
  gasto: number;
  impressoes: number;
  cliquesLink: number;
  ctr: number;
  views3s: number;
  p75: number;
  hook: number | null;
  hold: number | null;
  body: number | null;
  vendas: number; // ingressos reais (Hotmart, pelo sck)
  vendasPixel: number;
  cpa: number | null;
  veredito: { rotulo: string; cor: "verde" | "amarelo" | "vermelho" | "neutro"; acao: string };
}

export interface Bump {
  id: string;
  nome: string;
  preco: number;
  vendas: number;
  take: number | null;
  receita: number;
  liquido: number;
}

export interface Aula {
  n: number;
  rotulo: string;
  data: string;
  presenca: number | null;
  esperado: number | null;
  presencaPct: number | null;
  unicos: number | null;
  unicosPct: number | null;
  duracao: number | null;
  retencao: number | null; // presença ÷ presença da aula anterior
  retencaoMeta: number | null;
}

export interface Resumo {
  d0: string;
  nome: string;
  ingressos: number;
  gasto: number;
  roas: number | null;
  roasPago: number | null;
  cpa: number | null;
  cpm: number | null;
  ctr: number | null;
  connect: number | null;
  pagCheckout: number | null;
  checkoutCompra: number | null;
  convPagina: number | null;
  presencaA1: number | null;
  ficha: number | null;
  convBackend: number | null;
  lucro: number | null;
}

export interface Dados {
  geradoEm: string;
  ciclo: CicloInfo;
  ciclos: { d0: string; nome: string }[];
  fontes: { meta: Fonte; hotmart: Fonte; evolution: Fonte };
  manual: Record<string, number>;
  trafego: {
    gasto: number;
    impressoes: number;
    alcance: number;
    frequencia: number | null;
    cpm: number | null;
    ctr: number | null;
    cliquesLink: number;
    cpcLink: number | null;
    lpv: number;
    ic: number;
    compraPixel: number;
    dias: number;
    verbaDia: number | null;
    connect: number | null;
    pagCheckout: number | null;
    checkoutCompra: number | null;
    convPagina: number | null;
    custoIc: number | null;
    vendasPagas: number;
    cpaPago: number | null;
    outrasCampanhas: { nome: string; gasto: number }[];
    distribuicaoPct: number | null;
    serie: DiaTrafego[];
  };
  criativos: Criativo[];
  batelada: { ativos: number; video: number; estatico: number; carrossel: number; novos7d: number };
  vendas: {
    ingressos: number;
    meta: number;
    receitaIngresso: number;
    liquidoIngresso: number;
    bumps: Bump[];
    receitaFront: number;
    liquidoFront: number;
    ticketMedio: number | null;
    ticketMedioLiquido: number | null;
    taxaPlataforma: number | null;
    pendentes: number;
    expirados: number;
    abandonos: number;
    recuperados: number;
    reembolsos: number;
    pedidosReembolso: number;
    chargebacks: number;
    cancelados: number;
    primeiroAcesso: number;
    porDia: { dia: string; dow: number; ingressos: number }[];
    porHora: number[][]; // [dow 0-6][hora 0-23]
    porPagina: { variante: string; vendas: number }[];
    origem: { anuncio: number; bio: number; outro: number };
    pagamento: Record<string, number>;
    roas: number | null;
    roasPago: number | null;
    receitaPaga: number;
    roasLiquido: number | null;
    cpa: number | null;
  };
  grupo: {
    nome: string | null;
    jid: string | null;
    membros: number | null;
    fonte: "evolution" | "manual" | null;
    entradaPct: number | null;
    disparos: { total: number; enviados: number; atrasados: number; vetados: number; pendentes: number; expirados: number };
  };
  fichas: {
    matriculas: number;
    matriculaPct: number | null;
    interesse: { total: number; hot: number; warm: number; cold: number };
    interessePct: number | null;
    interesseBase: string;
  };
  aulas: Aula[];
  backend: {
    produtoId: string | null;
    fonte: "hotmart" | "manual" | null;
    preco: number;
    vendas: number | null;
    receita: number | null;
    liquido: number | null;
    conv: number | null;
    convPresentes: number | null;
    convFichas: number | null;
    hotCompraram: number | null;
    curva: { ate10min: number; ate1h: number; d1: number; total: number } | null;
    porHora: { hora: string; vendas: number }[];
  };
  financeiro: {
    investimento: number;
    trafego: number;
    distribuicao: number;
    outros: number;
    receitaBruta: number;
    receitaLiquida: number;
    lucro: number;
    roasTotal: number | null;
    margem: number | null;
    cacMax: number | null;
    cacMaxBase: string;
    roasAlvo: number;
  };
  leitura: Leitura[];
  saude: { total: number; areas: { area: string; nota: number; vermelhos: number; amarelos: number }[] };
}
