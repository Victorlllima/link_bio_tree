// ============================================================
// METAS DO TABARI — as réguas de cada métrica do dashboard de tráfego.
// Cada número é LITERAL das transcrições/sínteses do método (fonte citada).
// NÃO inventar valores aqui — se não há benchmark do Tabari, deixar meta = null.
// Ticket do IAA = R$17 (usado nos cálculos de custo de finalização).
// ============================================================

export const TICKET_IAA = 17;

export type Semaforo = "verde" | "amarelo" | "vermelho" | "neutro";

export interface Meta {
  chave: string; // id interno
  nome: string; // nome leigo
  sigla: string; // sigla técnica (Red pediu os dois)
  unidade: "%" | "R$" | "x" | "num" | "";
  // explicação em português comum, pra quem não sabe nada de tráfego
  explica: string;
  // como o número é bom/ruim. Retorna o semáforo dado o valor.
  avaliar: (v: number) => Semaforo;
  // frase que o card mostra conforme o semáforo
  frase: (v: number, s: Semaforo) => string;
  // a regra do Tabari em uma linha (fonte)
  regra: string;
  fonte: string;
  // direção "maior é melhor" (true) ou "menor é melhor" (false) — pro gráfico
  maiorMelhor: boolean;
}

const real = (n: number) => `R$${n.toFixed(2).replace(".", ",")}`;
const pct = (n: number) => `${n.toFixed(2).replace(".", ",")}%`;

export const METAS: Record<string, Meta> = {
  ctr: {
    chave: "ctr",
    nome: "Taxa de clique",
    sigla: "CTR",
    unidade: "%",
    explica:
      "De cada 100 pessoas que veem o anúncio, quantas clicam. Mede se o criativo chama atenção.",
    avaliar: (v) => (v >= 1.5 ? "verde" : v >= 1 ? "amarelo" : "vermelho"),
    frase: (v, s) =>
      s === "verde"
        ? "O anúncio está prendendo atenção. Acima de 1% já é bom; acima de 1,5% é ótimo."
        : s === "amarelo"
        ? "Está no limite aceitável (o piso do Tabari é 1%). Fique de olho."
        : "Abaixo de 1% — pelo método, esse criativo deve ser pausado.",
    regra: "CTR ≥ 1% mantém · < 1% pausa o anúncio",
    fonte: "compilado_tabari.md:185, 206",
    maiorMelhor: true,
  },

  cpc: {
    chave: "cpc",
    nome: "Custo por clique",
    sigla: "CPC",
    unidade: "R$",
    explica: "Quanto você paga cada vez que alguém clica no seu anúncio.",
    avaliar: (v) => (v <= 0 ? "neutro" : v < 0.5 ? "verde" : v <= 1 ? "amarelo" : "vermelho"),
    frase: (v, s) =>
      s === "verde"
        ? `Está barato (${real(v)}). Abaixo de R$0,50 é ótimo pro seu público.`
        : s === "amarelo"
        ? `Aceitável (${real(v)}). O CPC cai sozinho quando o CTR sobe.`
        : `Está caro (${real(v)}). Geralmente sobe quando o criativo tem CTR baixo.`,
    regra: "O CPC cai quando o CTR sobe (sem meta fixa)",
    fonte: "metricas-otimizacao.md:15",
    maiorMelhor: false,
  },

  custo_finalizacao: {
    chave: "custo_finalizacao",
    nome: "Custo por finalização de compra",
    sigla: "Custo/IC",
    unidade: "R$",
    explica:
      "Quanto custa cada pessoa que CLICA no botão de comprar e chega ao checkout. É a bússola antes do lucro.",
    // meta Tabari: ~10% do ticket. IAA R$17 → ~R$1,70. Verde até 1,70; amarelo até 2x; vermelho acima
    avaliar: (v) =>
      v <= 0 ? "neutro" : v <= TICKET_IAA * 0.1 ? "verde" : v <= TICKET_IAA * 0.2 ? "amarelo" : "vermelho",
    frase: (v, s) =>
      s === "verde"
        ? `Saudável (${real(v)}). A meta é ~10% do preço do produto (R$${TICKET_IAA} → ~R$1,70).`
        : s === "amarelo"
        ? `Um pouco alto (${real(v)}). O ideal é ficar perto de R$1,70 (10% do ticket).`
        : `Caro (${real(v)}). Se não sair venda com esse custo, o criativo é candidato a ser pausado.`,
    regra: "Custo de finalização saudável ≈ 10% do ticket",
    fonte: "metricas-otimizacao.md:80",
    maiorMelhor: false,
  },

  roas: {
    chave: "roas",
    nome: "Retorno sobre o investimento em anúncio",
    sigla: "ROAS",
    unidade: "x",
    explica:
      "Pra cada R$1 gasto em anúncio, quantos reais voltaram em venda. 1,00 = empatou; 2,00 = dobrou.",
    // LPSG: piso 1,25 · escalar ≥ 1,8
    avaliar: (v) => (v <= 0 ? "neutro" : v >= 1.8 ? "verde" : v >= 1.25 ? "amarelo" : "vermelho"),
    frase: (v, s) =>
      s === "verde"
        ? `Forte (${v.toFixed(2)}x). Acima de 1,8 o método manda DUPLICAR a campanha e escalar na cópia.`
        : s === "amarelo"
        ? `Positivo (${v.toFixed(2)}x). Está acima do piso de 1,25 que cobre impostos e taxas.`
        : `Abaixo do piso de 1,25 (${v.toFixed(2)}x). Precisa otimizar antes de escalar.`,
    regra: "Piso 1,25 (cobre taxas) · ≥ 1,8 → duplica e escala na cópia",
    fonte: "LPSG-engenharia-reversa.md:142, compilado_tabari.md:214",
    maiorMelhor: true,
  },

  conversao_checkout: {
    chave: "conversao_checkout",
    nome: "Conversão do checkout",
    sigla: "CVR checkout",
    unidade: "%",
    explica:
      "De cada 100 pessoas que chegam ao checkout, quantas compram de verdade.",
    avaliar: (v) => (v <= 0 ? "neutro" : v >= 10 ? "verde" : v >= 6 ? "amarelo" : "vermelho"),
    frase: (v, s) =>
      s === "verde"
        ? `Ótimo (${pct(v)}). O Tabari busca 10%+ no início.`
        : s === "amarelo"
        ? `Na escala o método aceita 6-7% (${pct(v)}). No começo, o ideal é 10%+.`
        : `Baixo (${pct(v)}). Vale revisar o checkout / a oferta.`,
    regra: "10%+ no início · aceita 6-7% na escala",
    fonte: "compilado_tabari.md:186, 208",
    maiorMelhor: true,
  },

  frequencia: {
    chave: "frequencia",
    nome: "Frequência",
    sigla: "Freq.",
    unidade: "x",
    explica:
      "Quantas vezes, em média, a MESMA pessoa viu seus anúncios. Compra costuma vir depois de vários contatos.",
    avaliar: () => "neutro", // Tabari cita alvo >5 mas sem faixa de corte
    frase: (v) =>
      `Cada pessoa viu o anúncio ${v.toFixed(1).replace(".", ",")}x em média. O método mira acima de 5 (leva ~11 contatos até a compra).`,
    regra: "Frequência-alvo > 5 (~11 contatos antes de comprar)",
    fonte: "LPSG-engenharia-reversa.md:118",
    maiorMelhor: true,
  },
};

// ============================================================
// AVALIAÇÃO POR CRIATIVO (a decisão que o Tabari manda tomar).
// "O que você vai otimizar primeiro se está ruim: sempre criativo, sempre."
// (compilado_tabari.md:220)
// ============================================================

export const IMPRESSOES_MIN_JULGAR = 5000; // LPSG-engenharia-reversa.md:136

export interface VeredictoCriativo {
  status: "matar" | "escalar" | "manter" | "cedo";
  cor: Semaforo;
  label: string;
  acao: string;
}

/**
 * Decide o que fazer com um criativo, seguindo o método:
 * - < 5.000 impressões → não julgue ainda (regra dura)
 * - CTR < 1% → pausa esse anúncio
 * - CTR >= 2% → forte, candidato a escalar
 */
export function avaliarCriativo(ctr: number, impressoes: number, purchases: number): VeredictoCriativo {
  if (impressoes < IMPRESSOES_MIN_JULGAR) {
    return {
      status: "cedo",
      cor: "neutro",
      label: "Aguardando dados",
      acao: `Só ${impressoes.toLocaleString("pt-BR")} de ${IMPRESSOES_MIN_JULGAR.toLocaleString("pt-BR")} impressões. O método manda NÃO julgar ainda.`,
    };
  }
  if (ctr < 1) {
    return {
      status: "matar",
      cor: "vermelho",
      label: "Pausar",
      acao: "CTR abaixo de 1% com volume suficiente. Pelo método, pause SÓ este anúncio.",
    };
  }
  if (ctr >= 2) {
    return {
      status: "escalar",
      cor: "verde",
      label: "Forte",
      acao: purchases > 0
        ? "CTR alto E já vendeu. É um vencedor — considere fazer variações de hook dele."
        : "CTR alto. Fique de olho se converte (CTR alto sem venda = entretenimento, não vende).",
    };
  }
  return {
    status: "manter",
    cor: "amarelo",
    label: "Ok",
    acao: "Acima do piso de 1%. Mantenha rodando e observe.",
  };
}

// As regras de ouro que ficam no painel lateral (impedem besteira).
export const REGRAS_OURO = [
  {
    icone: "⛔",
    texto: "Não mexa antes de 5.000 impressões por criativo — a Meta ainda está aprendendo.",
    fonte: "LPSG-engenharia-reversa.md:136",
  },
  {
    icone: "⛔",
    texto: "Não julgue antes de 48-72h. Dia ruim isolado não é sinal.",
    fonte: "LPSG-engenharia-reversa.md:137",
  },
  {
    icone: "⏳",
    texto: "A Meta leva ~48h só pra sair da fase de aprendizado. Pausar cedo mata o aprendizado.",
    fonte: "LPSG-engenharia-reversa.md:138",
  },
  {
    icone: "✅",
    texto: "CTR abaixo de 1% → pause SÓ aquele anúncio (não a campanha inteira).",
    fonte: "compilado_tabari.md:185",
  },
  {
    icone: "🚀",
    texto: "ROAS ≥ 1,8 → DUPLIQUE a campanha e escale na cópia. Nunca mexa no original (perde a inteligência).",
    fonte: "compilado_tabari.md:214",
  },
  {
    icone: "🔧",
    texto: "Mude 1 coisa por semana. Se mexer em várias, não saberá o que funcionou.",
    fonte: "LPSG-engenharia-reversa.md:135",
  },
  {
    icone: "🎨",
    texto: "O que otimizar primeiro é SEMPRE o criativo. Meta de produção: hooks novos toda semana.",
    fonte: "compilado_tabari.md:191, 220",
  },
];
