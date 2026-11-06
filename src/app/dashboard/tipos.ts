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
  emCaptacao: boolean; // hoje está entre o início e o fim (23h59 da segunda) da captação
  emAula: boolean; // hoje está entre a Aula 1 e o fechamento do carrinho
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
  ciclos: { d0: string; nome: string; indice: number }[];
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
    campanhas: { nome: string; gasto: number; tipo: "captacao" | "distribuicao" }[];
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
    taxaHotmart: number; // bruto menos a comissão do produtor
    reembolsado: number; // líquido das vendas da turma que viraram reembolso ou chargeback
    liberado: number; // líquido que a Hotmart já liberou (cartão D+30, demais ao fim da garantia: estimativa)
    proximaLiberacao: string | null;
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

// ---------- aba Investidor ----------
export interface LinhaInvestidor {
  d0: string;
  nome: string;
  fase: string;
  emCaptacao: boolean;
  foraDoAcordo: boolean; // turma anterior à entrada do investidor: gasto e lucro são da RedPro
  dias: number; // dias de captação da turma (7 ou 8)
  diasDecorridos: number; // fração já passada da captação
  acordo: number; // verba combinada para a captação inteira
  acordoCaptacao: number;
  acordoDistribuicao: number;
  acordoAteHoje: number;
  gasto: number; // o que a Meta cobrou (campanhas HWK + boost do Instagram) mais custos extras lançados
  gastoCaptacao: number;
  gastoDistribuicao: number;
  gastoOutros: number;
  distribuicaoManual: number; // lançado à mão como distribuição, não somado
  receitaLiquida: number; // base do acordo: comissão da Hotmart, menos reembolsos, menos imposto sobre a receita
  receitaBruta: number;
  taxaHotmart: number;
  reembolsos: number;
  impostoReceita: number;
  receitaLiberada: number; // parte da receita que a Hotmart já liberou
  gastoMeta: number; // o que a Meta mostra
  taxaMeta: number; // imposto sobre o gasto na fatura (parâmetro)
  ingressos: number;
  receitaFront: number; // ingresso + bumps, bruto
  liquidoFront: number;
  vendasFormacao: number;
  receitaFormacao: number;
  liquidoFormacao: number;
  carrinhoFechado: boolean; // só as turmas com carrinho encerrado entram na conversão da Formação
  saldoAnterior: number; // o que o investidor ainda tinha a receber antes desta turma
  devolvido: number; // parte da receita desta turma que abateu o saldo
  saldoDepois: number;
  excedente: number; // lucro: o que sobrou depois de zerar o saldo
  parteInvestidor: number;
  parteRedpro: number;
}

// Base do simulador de escala: os KPIs acumulados de todas as turmas.
export interface BaseSimulador {
  ingressos: number;
  gasto: number; // mídia total (captação + distribuição + extras)
  cpa: number | null; // gasto total ÷ ingressos
  ticketBruto: number | null; // ingresso + bumps por ingresso vendido
  ticketLiquido: number | null;
  taxa: number; // fatia que a plataforma retém
  convFormacao: number | null; // % sobre os ingressos das turmas com carrinho encerrado
  convBase: { vendas: number; ingressos: number };
  formacaoPreco: number;
  formacaoLiquida: number; // por venda
}

// Conta pelo caixa: só o que a Hotmart já liberou (o primeiro dinheiro devolve o investimento, o resto divide 30/70).
export interface CaixaInvestidor {
  liberado: number;
  aLiberar: number;
  devolvido: number;
  lucro: number;
  parteInvestidor: number;
  parteRedpro: number;
  transferivelHoje: number; // devolução + parte do lucro, só com o dinheiro já liberado
  proximaLiberacao: string | null;
}

export interface RespInvestidor {
  geradoEm: string;
  base: BaseSimulador;
  acordo: { captacaoDia: number; distribuicaoDia: number; parteInvestidor: number; primeiraTurma: string };
  taxas: { metaSobreGastoPct: number; impostoSobreReceitaPct: number };
  linhas: LinhaInvestidor[];
  total: {
    gasto: number;
    receitaLiquida: number;
    receitaBruta: number;
    taxaHotmart: number;
    reembolsos: number;
    impostoReceita: number;
    gastoMeta: number;
    taxaMeta: number;
    liberado: number;
    caixa: CaixaInvestidor;
    devolvido: number;
    saldoDevedor: number;
    excedente: number;
    parteInvestidor: number;
    parteRedpro: number;
    retornoInvestidor: number; // devolvido + parte do lucro
  };
}

// ============================================================
// RECORTE: números de qualquer janela de datas ou do total (sem depender do calendário das turmas)
// ============================================================
export type ModoRecorte = "periodo" | "total_baby" | "total_geral";

export type RecorteDia = {
  dia: string;
  gasto: number;
  gastoVenda: number;
  gastoDistribuicao: number;
  ingressos: number;
  receita: number;
  liquido: number;
};

export type RecorteBloco = { nome: string; vendas: number; receita: number; liquido: number };

export type Recorte = {
  geradoEm: string;
  modo: ModoRecorte;
  de: string;
  ate: string;
  rotulo: string;
  gasto: { total: number; venda: number; distribuicao: number; dias: number; porDia: number | null };
  trafego: {
    impressoes: number;
    alcance: number;
    cliquesLink: number;
    cpm: number | null;
    cpcLink: number | null;
    ctr: number | null;
  };
  vendas: {
    ingressos: number;
    receitaIngresso: number;
    liquidoIngresso: number;
    extras: RecorteBloco[];
    extrasVendas: number;
    receitaExtras: number;
    liquidoExtras: number;
    extrasPorIngresso: number | null;
    formacao: RecorteBloco;
    convFormacao: number | null;
  };
  origem: { anuncio: number; bio: number; boost: number; outro: number; semOrigem: number };
  taxas: { metaPct: number; receitaPct: number; metaValor: number; receitaValor: number; hotmart: number; reembolsos: number };
  totais: {
    receitaBruta: number;
    receitaLiquida: number;
    roasIngresso: number | null;
    roasComExtras: number | null;
    roasFunil: number | null;
    cpa: number | null;
    receitaPorIngresso: number | null;
    lucro: number;
  };
  serie: RecorteDia[];
  outrasCampanhas: { nome: string; gasto: number }[];
  // regra do acordo aplicada à janela, a partir da entrada do investidor (05/10)
  investidor: {
    desde: string | null;
    caixa: CaixaInvestidor;
    gastoMeta: number;
    antes: { gasto: number; receitaLiquida: number } | null;
    gasto: number;
    receitaLiquida: number;
    devolvido: number;
    saldoDevedor: number;
    excedente: number;
    parteInvestidor: number;
    parteRedpro: number;
    totalInvestidor: number;
    multiplo: number | null;
  };
  avisos: string[];
  ciclos: { d0: string; nome: string; indice: number }[];
};

// ---------- aba Imersões ----------
export interface DiaImersao {
  dia: string;
  dn: number; // dias até a noite 1 (negativo = antes; 0 = noite 1)
  lote: number | null;
  gasto: number;
  impressoes: number;
  cliquesLink: number;
  lpv: number;
  ic: number;
  compraPixel: number;
  vendas: number; // ingressos aprovados na Hotmart (banco)
  vendasAnuncio: number; // dessas, as que o sck liga a um anúncio
  receita: number; // ingresso, bruto
  receitaBumps: number;
  bumps: number; // pedidos de bump
}

export interface LoteImersaoRes {
  n: number;
  preco: number;
  ini: string;
  fim: string | null;
  atual: boolean;
  dias: number;
  gasto: number;
  impressoes: number;
  cliquesLink: number;
  lpv: number;
  ic: number;
  vendas: number;
  receita: number;
  receitaBumps: number;
  bumps: number;
  cpa: number | null;
  roas: number | null;
  taxaBump: number | null;
  convPagina: number | null;
}

export interface CriativoImersao {
  adId: string;
  nome: string;
  conjunto: string;
  status: string;
  thumb: string | null;
  gasto: number;
  impressoes: number;
  cliquesLink: number;
  ctr: number | null; // link
  cpc: number | null; // link
  lpv: number;
  custoLpv: number | null;
  ic: number;
  vendas: number; // Hotmart, pelo sck, só quando o sck nomeia este anúncio (forma nova: im-A-Q_nome_sp)
  chave: string; // chave do criativo: nome sem prefixo de conjunto (Q_/F_) nem _sp
  vendasPixel: number;
  cpa: number | null;
  cortar: boolean;
  motivos: string[];
}

// Criativo = anúncios de mesmo nome em conjuntos diferentes (Q+F) somados.
export interface GrupoCriativo {
  chave: string;
  nome: string;
  anuncios: number;
  ativos: number;
  gasto: number;
  impressoes: number;
  cliquesLink: number;
  lpv: number;
  ic: number;
  vendas: number; // por anúncio + por criativo
  vendasPorAnuncio: number; // sck nova: nomeia o anúncio (separa conjunto)
  vendasPorCriativo: number; // sck antiga: só o criativo (soma Q+F)
  cpa: number | null;
  custoLpv: number | null;
}

export interface DadosImersao {
  geradoEm: string;
  edicao: { id: string; nome: string; numero: number; noite1: string; noite2: string; carrinhoFecha: string };
  edicoes: { id: string; nome: string; numero: number }[];
  fontes: { meta: Fonte; hotmart: Fonte };
  metas: { cpaMeta: number; cpaCorte: number; ctrMinLink: number; impMinJulgar: number; verbaDia: number; ingressosMeta: number | null };
  fase: { rotulo: string; detalhe: string; dnHoje: number };
  total: {
    gasto: number;
    impressoes: number;
    cliquesLink: number;
    lpv: number;
    ic: number;
    compraPixel: number;
    vendas: number;
    vendasAnuncio: number;
    vendasAnuncioSemCriativo: number;
    vendasOutras: number;
    receita: number;
    receitaBumps: number;
    receitaTotal: number;
    liquido: number;
    cpa: number | null;
    cpaAnuncio: number | null;
    roas: number | null;
    roasAnuncio: number | null;
    ctr: number | null;
    cpm: number | null;
    connect: number | null;
    convPagina: number | null;
    pagCheckout: number | null;
    checkoutCompra: number | null;
    taxaBump: number | null;
    pendentes: number;
    reembolsos: number;
  };
  bumps: { id: string; nome: string; preco: number; vendas: number; take: number | null; receita: number }[];
  serie: DiaImersao[];
  lotes: LoteImersaoRes[];
  conjuntos: { id: string; nome: string; gasto: number; impressoes: number; cliquesLink: number; lpv: number; ic: number; vendas: number; cpa: number | null }[];
  criativos: CriativoImersao[];
  criativosAgrupados: GrupoCriativo[];
}

export interface EventoSerie {
  id: string;
  nome: string;
  tipo: "imersao" | "hermes-week";
  d0: string; // dia do evento (noite 1 / Aula 1)
  atual: boolean;
  dias: { dn: number; gasto: number; impressoes: number; cliquesLink: number; lpv: number; ic: number; ingressos: number; receita: number }[];
}

export interface RespComparacaoEventos {
  geradoEm: string;
  dnHoje: number | null; // D-n de hoje na edição em curso
  eventos: EventoSerie[];
}
