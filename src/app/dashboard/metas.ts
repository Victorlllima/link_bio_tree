// ============================================================
// METAS DO PAINEL DA HERMES WEEK — a régua de cada número do /dashboard.
//
// Origem de cada meta (campo `origem`):
//   "metodo"  → regra dita nas aulas do método de lançamento pago semanal
//   "squad"   → referência complementar de ferramentas do ecossistema
//   "red"     → decisão do Red
//
// Regra: não inventar. Se nenhuma fonte dá número, a métrica aparece sem meta
// (semáforo neutro): o painel mostra o dado e diz que não há régua.
// ============================================================

export type Cor = "verde" | "amarelo" | "vermelho" | "neutro";
export type Origem = "metodo" | "squad" | "red";

export interface Regua {
  chave: string;
  nome: string;
  unidade: "%" | "R$" | "x" | "num" | "min";
  maiorMelhor: boolean;
  // limites: para maiorMelhor, vermelho < min ≤ amarelo < ideal ≤ verde
  //          para menorMelhor, verde ≤ ideal < amarelo ≤ max < vermelho
  min?: number;
  ideal?: number;
  max?: number;
  texto: string; // a regra em uma linha, em português comum
  fonte: string; // arquivo + onde
  origem: Origem;
}

export function avaliar(r: Regua | undefined, v: number | null | undefined): Cor {
  if (!r || v === null || v === undefined || !Number.isFinite(v)) return "neutro";
  if (r.maiorMelhor) {
    if (r.ideal !== undefined && v >= r.ideal) return "verde";
    if (r.min !== undefined && v >= r.min) return r.ideal === undefined ? "verde" : "amarelo";
    if (r.min === undefined && r.ideal !== undefined) return "amarelo";
    return "vermelho";
  }
  if (r.ideal !== undefined && v <= r.ideal) return "verde";
  if (r.max !== undefined && v <= r.max) return r.ideal === undefined ? "verde" : "amarelo";
  return "vermelho";
}

const A4 = "aula 4 do LPSG (otimização)";
const A5 = "aula 5 do LPSG (tráfego)";

export const REGUAS: Record<string, Regua> = {
  // ---------------- TRÁFEGO ----------------
  verba_dia: {
    chave: "verba_dia", nome: "Verba por dia", unidade: "R$", maiorMelhor: true, min: 100,
    texto: "Mínimo R$100/dia por campanha. Com menos, não vende ingresso.",
    fonte: A5, origem: "metodo",
  },
  roas_captacao: {
    chave: "roas_captacao", nome: "ROAS da captação", unidade: "x", maiorMelhor: true, min: 1, ideal: 1.25,
    texto: "Piso 1,25 (cobre imposto e taxa). Positivo nas 10 primeiras semanas. ≥1,8 duplica e escala na cópia.",
    fonte: `${A4} · aula 1`, origem: "metodo",
  },
  cpa_ingresso: {
    chave: "cpa_ingresso", nome: "Custo por ingresso (CPA)", unidade: "R$", maiorMelhor: false, ideal: 62, max: 100,
    texto: "Ingresso de R$62 com teto de R$100 de CPA. O ideal é o CAC não passar do ticket.",
    fonte: "aula 2 do LPSG (correção do brief) · aula 4", origem: "metodo",
  },
  custo_ic: {
    chave: "custo_ic", nome: "Custo por finalização", unidade: "R$", maiorMelhor: false, ideal: 6.2, max: 12.4,
    texto: "Custo por clique em comprar ≈ 10% do ticket (R$6,20). É a bússola antes do ROAS. Amarelo até 2x é leitura do ORION.",
    fonte: "manual do lançador", origem: "metodo",
  },
  cpm: {
    chave: "cpm", nome: "CPM", unidade: "R$", maiorMelhor: false, max: 40,
    texto: "Teto de R$40. Acima disso, alerta amarelo.",
    fonte: "referência complementar", origem: "squad",
  },
  ctr: {
    chave: "ctr", nome: "CTR (todos os cliques)", unidade: "%", maiorMelhor: true, min: 1, ideal: 1.5,
    texto: "Abaixo de 1% pausa o anúncio. Estático e carrossel: mínimo 1,5%, alvo 3%.",
    fonte: `compilado das aulas (funil de entrada) · ${A4}`, origem: "metodo",
  },
  connect_rate: {
    chave: "connect_rate", nome: "Connect rate", unidade: "%", maiorMelhor: true, min: 70,
    texto: "De quem clicou, ≥70% precisa ver a página carregar. Abaixo disso o problema é a página, não o criativo.",
    fonte: "manual do lançador", origem: "metodo",
  },
  conv_pagina: {
    chave: "conv_pagina", nome: "Conversão da página", unidade: "%", maiorMelhor: true, min: 3, ideal: 5,
    texto: "Meta 5%. Página escalada tolera 3-4%. Só julga com 5.000 views.",
    fonte: A4, origem: "metodo",
  },
  pagina_checkout: {
    chave: "pagina_checkout", nome: "Página → checkout", unidade: "%", maiorMelhor: true, min: 10, ideal: 20,
    texto: "De quem viu a página, 10-20% clicam em comprar.",
    fonte: "manual do lançador", origem: "metodo",
  },
  checkout_compra: {
    chave: "checkout_compra", nome: "Checkout → compra", unidade: "%", maiorMelhor: true, min: 10, ideal: 20,
    texto: "~20% de quem chega ao checkout compra (planilha do método: 23% e 31%).",
    fonte: `manual do lançador · ${A4}`, origem: "metodo",
  },
  frequencia: {
    chave: "frequencia", nome: "Frequência", unidade: "x", maiorMelhor: true, min: 3, ideal: 5,
    texto: "Acima de 5, intencional. São ~11 contatos antes da compra.",
    fonte: A4, origem: "metodo",
  },
  distribuicao: {
    chave: "distribuicao", nome: "Verba de distribuição", unidade: "%", maiorMelhor: true, min: 10, ideal: 10, max: 25,
    texto: "10% a 25% da verba vai pra distribuir conteúdo. Ajusta 5 pontos por semana. Desligar derrubou 30% da escala.",
    fonte: "aula 1 do LPSG", origem: "metodo",
  },

  // ---------------- CRIATIVOS ----------------
  hook_rate: {
    chave: "hook_rate", nome: "Hook rate", unidade: "%", maiorMelhor: true, min: 20, ideal: 30,
    texto: "Views de 3s ÷ impressões. Mínimo 20%, busca 30-40%. Abaixo: troca o gancho, mantém o corpo.",
    fonte: A4, origem: "metodo",
  },
  hold_rate: {
    chave: "hold_rate", nome: "Hold rate", unidade: "%", maiorMelhor: true, min: 5, ideal: 10,
    texto: "Views de 75% ÷ views de 3s. Passou de 5-6% tem futuro, ~10% é o topo.",
    fonte: A4, origem: "metodo",
  },
  body_rate: {
    chave: "body_rate", nome: "Body rate", unidade: "%", maiorMelhor: true, min: 1.5, ideal: 2,
    texto: "Vendas ÷ quem viu 75%. Busca 1,5-2%. Baixo: mexe no CTA e no final.",
    fonte: A4, origem: "metodo",
  },
  ctr_estatico: {
    chave: "ctr_estatico", nome: "CTR de estático/carrossel", unidade: "%", maiorMelhor: true, min: 1.5, ideal: 3,
    texto: "Mínimo 1,5%, alvo 3%.",
    fonte: A4, origem: "metodo",
  },
  batelada: {
    chave: "batelada", nome: "Criativos ativos", unidade: "num", maiorMelhor: true, min: 15,
    texto: "15 por campanha: 5 estáticos, 5 vídeos, 5 carrosséis.",
    fonte: A4, origem: "metodo",
  },
  hooks_novos: {
    chave: "hooks_novos", nome: "Criativos novos na semana", unidade: "num", maiorMelhor: true, min: 5, ideal: 10,
    texto: "5 a 10 hooks novos por semana sobre os corpos validados.",
    fonte: A4, origem: "metodo",
  },

  // ---------------- VENDAS DO INGRESSO ----------------
  ingressos: {
    chave: "ingressos", nome: "Ingressos vendidos", unidade: "num", maiorMelhor: true, min: 70, ideal: 100,
    texto: "Meta do ciclo: 100 ingressos (Red, 01/09).",
    fonte: "decisão do Red, 01/09", origem: "red",
  },
  take_bump: {
    chave: "take_bump", nome: "Take rate do bump", unidade: "%", maiorMelhor: true, min: 30,
    texto: "Attach abaixo de 30% depois de 20 vendas acende alerta. O método não dá número.",
    fonte: "referência complementar", origem: "squad",
  },
  reembolso: {
    chave: "reembolso", nome: "Reembolso", unidade: "%", maiorMelhor: false, max: 3,
    texto: "Devolução incondicional ≤3%.",
    fonte: "referência complementar", origem: "squad",
  },

  // ---------------- GRUPO E MENSAGERIA ----------------
  entrega_msg: {
    chave: "entrega_msg", nome: "Mensagens entregues", unidade: "%", maiorMelhor: true, min: 95,
    texto: "≥95% das mensagens programadas precisam sair. Abaixo é vermelho.",
    fonte: "referência complementar", origem: "squad",
  },
  matricula: {
    chave: "matricula", nome: "Ficha de matrícula", unidade: "%", maiorMelhor: true,
    texto: "Passo 1 do onboarding (antes do grupo e do OK). O método não dá taxa-alvo.",
    fonte: "aula 3 do LPSG (mensageria)", origem: "metodo",
  },

  // ---------------- AULAS ----------------
  presenca_a1: {
    chave: "presenca_a1", nome: "Presença ao vivo na Aula 1", unidade: "%", maiorMelhor: true, min: 30, ideal: 50,
    texto: "Mínimo 30% dos compradores ao vivo. À noite o método mede ~50%.",
    fonte: `${A4} · aula 2`, origem: "metodo",
  },
  unicos_a1: {
    chave: "unicos_a1", nome: "Views únicos (A1 e A2)", unidade: "%", maiorMelhor: true, min: 100,
    texto: "Views únicos passam de 100% dos compradores nas aulas 1 e 2. É pós-morte (semana seguinte).",
    fonte: "aula 1 do LPSG", origem: "metodo",
  },
  duracao_aula: {
    chave: "duracao_aula", nome: "Duração da aula", unidade: "min", maiorMelhor: false, ideal: 50, max: 60,
    texto: "40-50 min. Passou de 50 perde retenção. Só a aula 4 vai a 60 + 15 de pré-pitch.",
    fonte: A4, origem: "metodo",
  },

  // ---------------- FICHAS ----------------
  ficha_interesse: {
    chave: "ficha_interesse", nome: "Ficha de interesse", unidade: "%", maiorMelhor: true, min: 25,
    texto: "Mínimo 25% (planilha do método: 40% e 23%, este abaixo).",
    fonte: A4, origem: "metodo",
  },

  // ---------------- PITCH E CARRINHO ----------------
  conv_backend: {
    chave: "conv_backend", nome: "Conversão da Formação", unidade: "%", maiorMelhor: true, min: 7, ideal: 10,
    texto: "Vendas ÷ ingressos. <5% joga o evento fora e regrava. 7% valida. Acima de 10% é o alvo.",
    fonte: `${A4} · manual do lançador`, origem: "metodo",
  },
  hot_compra: {
    chave: "hot_compra", nome: "HOT que compram", unidade: "%", maiorMelhor: true, min: 25, ideal: 40,
    texto: "25-40% das fichas HOT viram venda.",
    fonte: "referência complementar", origem: "squad",
  },
  vendas_d1: {
    chave: "vendas_d1", nome: "Vendas na 1ª hora", unidade: "%", maiorMelhor: true, min: 70, ideal: 90,
    texto: "70% das vendas nos 10 primeiros minutos, 90% na 1ª hora, 90-95% no dia 1.",
    fonte: "referência complementar", origem: "squad",
  },
  recuperacao: {
    chave: "recuperacao", nome: "Recuperação", unidade: "%", maiorMelhor: true, min: 5, ideal: 10,
    texto: "5-15% dos abandonos recuperados (alvo 10%).",
    fonte: "referência complementar", origem: "squad",
  },

  // ---------------- FINANCEIRO ----------------
  lucro: {
    chave: "lucro", nome: "Lucro do lançamento", unidade: "R$", maiorMelhor: true, min: 0, ideal: 20000,
    texto: "A meta do aluno é ≥R$20 mil líquidos por lançamento. Nunca escalar prejuízo.",
    fonte: "aula 2 do LPSG · aula 4", origem: "metodo",
  },
  roas_total: {
    chave: "roas_total", nome: "ROAS do lançamento inteiro", unidade: "x", maiorMelhor: true, min: 1, ideal: 2,
    texto: "Ingresso + Formação ÷ tráfego. O método diz que o do lançamento nunca ficou negativo.",
    fonte: A4, origem: "metodo",
  },
};

// Curva de presença esperada (aula 4): A1 ≥ 30% dos compradores;
// A1→A2 cai 30%; A2→A3, A3→A4, A4→A5 caem 15%; A6 sobe 30% sobre a A5.
export const QUEDA_AULA = [null, 0.7, 0.85, 0.85, 0.85, 1.3] as const;

export const IMPRESSOES_MIN_JULGAR = 5000; // aula 4
export const PRECO_INGRESSO = 62;
export const PRECO_FORMACAO_PADRAO = 997; // Red, 04/10/2026

export const PRODUTOS = {
  ingresso: "8443182",
  bumps: [
    { id: "8551535", nome: "100 plugins", preco: 27 },
    { id: "8551609", nome: "50 casos de uso", preco: 37 },
    { id: "8551624", nome: "Segundo cérebro", preco: 47 },
  ],
} as const;

// As regras que impedem besteira (ficam fixas no rodapé da Leitura).
export const REGRAS_OURO = [
  "Não julgue criativo, página ou campanha antes de 5.000 impressões e 48-72h.",
  "Uma otimização por semana. Mexer em várias apaga o que você aprendeu.",
  "CPA de 24h é ruído. O que vale é a média da semana.",
  "ROAS ≥1,8: duplique a campanha e escale na cópia. Nunca mexa no original.",
  "O que otimizar primeiro é sempre o criativo.",
  "Nunca escale prejuízo.",
];
