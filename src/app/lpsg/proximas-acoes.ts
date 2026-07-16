// ============================================================
// MOTOR DE PRÓXIMAS AÇÕES
// Lê o estado real da campanha e devolve o que Red e Gleyce devem fazer AGORA —
// inclusive quando a ação certa é "não fazer nada e esperar".
// Todas as regras vêm do método Tabari (fonte citada em cada uma).
// ============================================================

import { IMPRESSOES_MIN_JULGAR } from "./metas-tabari";

export type Urgencia = "agora" | "atencao" | "aguardar" | "ok";
export type Quem = "red" | "gleyce" | "ambos" | "ninguem";

export interface Acao {
  urgencia: Urgencia;
  quem: Quem;
  titulo: string;
  porque: string; // o motivo, em português comum
  comoFazer?: string; // o passo a passo, quando aplicável
  fonte?: string; // a regra do Tabari que embasa
}

export interface EstadoCampanha {
  diasRodando: number;
  gastoTotal: number;
  impressoesTotal: number;
  ctrMedio: number;
  roas: number;
  purchases: number;
  criativos: Array<{ nome: string; ctr: number; impressoes: number; purchases: number }>;
  // marco: quando a campanha começou (pra contar a fase de aprendizado)
  inicioISO: string;
}

const LABEL_URGENCIA: Record<Urgencia, { emoji: string; texto: string; cor: string }> = {
  agora: { emoji: "🔴", texto: "Fazer agora", cor: "#f87171" },
  atencao: { emoji: "🟠", texto: "Fique de olho", cor: "#f59e0b" },
  aguardar: { emoji: "⏳", texto: "Só aguardar", cor: "#38bdf8" },
  ok: { emoji: "🟢", texto: "Tudo certo", cor: "#4ade80" },
};

export const URGENCIA_META = LABEL_URGENCIA;

export const QUEM_LABEL: Record<Quem, string> = {
  red: "Red",
  gleyce: "Gleyce",
  ambos: "Red + Gleyce",
  ninguem: "Ninguém — é só esperar",
};

/**
 * Gera a lista de próximas ações a partir do estado da campanha.
 * Ordenada por urgência: agora → atenção → aguardar → ok.
 */
export function gerarAcoes(e: EstadoCampanha): Acao[] {
  const acoes: Acao[] = [];
  const horasRodando = e.diasRodando * 24;

  // ---------- 1. FASE DE APRENDIZADO (a regra que mais protege) ----------
  if (e.diasRodando < 7) {
    const faltam = 7 - e.diasRodando;
    acoes.push({
      urgencia: "aguardar",
      quem: "ninguem",
      titulo: `Não mexer na campanha por mais ${faltam} dia${faltam > 1 ? "s" : ""}`,
      porque:
        horasRodando < 48
          ? "A Meta ainda está na fase de aprendizado (leva ~48h). Mexer agora mata o aprendizado que ia se estabilizar."
          : "O método pede no mínimo 7 dias rodando pra campanha 'pegar inteligência'. Mudar antes disso te faz decidir com dado imaturo.",
      comoFazer: "Só observar. Não pausar, não mudar orçamento, não trocar criativo.",
      fonte: "compilado_tabari.md:190, 218 · LPSG-engenharia-reversa.md:138",
    });
  }

  // ---------- 2. CRIATIVOS PRA MATAR (só com volume suficiente) ----------
  const matar = e.criativos.filter((c) => c.impressoes >= IMPRESSOES_MIN_JULGAR && c.ctr < 1);
  if (matar.length > 0) {
    acoes.push({
      urgencia: "agora",
      quem: "red",
      titulo: `Pausar ${matar.length} criativo${matar.length > 1 ? "s" : ""} com CTR abaixo de 1%`,
      porque: `${matar.map((c) => c.nome).join(", ")} — já ${
        matar.length > 1 ? "têm" : "tem"
      } dados suficientes e ${matar.length > 1 ? "estão" : "está"} abaixo do piso do método.`,
      comoFazer: "No Gerenciador de Anúncios, pause SÓ esse(s) anúncio(s). Nunca a campanha inteira.",
      fonte: "compilado_tabari.md:185, 206",
    });
  }

  // ---------- 3. ESCALAR (ROAS alto) ----------
  if (e.roas >= 1.8 && e.diasRodando >= 7) {
    acoes.push({
      urgencia: "agora",
      quem: "red",
      titulo: "Duplicar a campanha e escalar na cópia",
      porque: `O ROAS está em ${e.roas.toFixed(2)}x — acima de 1,8. Pelo método, é hora de escalar.`,
      comoFazer:
        "DUPLIQUE a campanha e aumente o orçamento SÓ na cópia (ex: R$100 → R$300). NUNCA mexa no original — ele perde a inteligência acumulada.",
      fonte: "compilado_tabari.md:214",
    });
  } else if (e.roas > 0 && e.roas < 1.25 && e.diasRodando >= 7) {
    acoes.push({
      urgencia: "atencao",
      quem: "red",
      titulo: "ROAS abaixo do piso — otimizar antes de escalar",
      porque: `ROAS em ${e.roas.toFixed(2)}x, abaixo do piso de 1,25 que cobre impostos e taxas.`,
      comoFazer:
        "O que otimizar primeiro é SEMPRE o criativo. Troque os hooks dos criativos que têm CTR bom mas não vendem.",
      fonte: "LPSG-engenharia-reversa.md:142 · compilado_tabari.md:220",
    });
  }

  // ---------- 4. CRIATIVOS VENCEDORES SUBAPROVEITADOS ----------
  const promessas = e.criativos.filter(
    (c) => c.ctr >= 3 && c.impressoes > 0 && c.impressoes < IMPRESSOES_MIN_JULGAR
  );
  if (promessas.length > 0) {
    acoes.push({
      urgencia: "atencao",
      quem: "red",
      titulo: `${promessas.length} criativo${promessas.length > 1 ? "s" : ""} com CTR alto que a Meta mal testou`,
      porque: `${promessas
        .map((c) => `${c.nome} (${c.ctr.toFixed(1)}%)`)
        .join(", ")} — CTR muito acima da média, mas com pouquíssimas impressões. A Meta ainda não deu chance.`,
      comoFazer:
        "Não force agora. A Meta faz rodízio sozinha nos primeiros dias. Se depois de 7 dias ela ainda não testar, considere subir esse criativo numa campanha de teste separada.",
      fonte: "LPSG-engenharia-reversa.md:136",
    });
  }

  // ---------- 5. OXIGENAÇÃO DE CRIATIVO (rotina semanal) ----------
  if (e.diasRodando >= 7) {
    acoes.push({
      urgencia: "atencao",
      quem: "red",
      titulo: "Gravar 5-10 hooks novos desta semana",
      porque:
        "Hooks saturam rápido; o corpo do criativo dura meses. Trocar só os 3-15s iniciais é o jeito mais barato de renovar.",
      comoFazer:
        "Pegue os criativos com Hold bom (gente assiste até o fim) e grave só aberturas novas pra eles.",
      fonte: "LPSG-engenharia-reversa.md:116",
    });
  }

  // ---------- 6. SEM VENDA COM VOLUME ----------
  if (e.purchases === 0 && e.impressoesTotal >= IMPRESSOES_MIN_JULGAR && e.diasRodando >= 2) {
    acoes.push({
      urgencia: "atencao",
      quem: "red",
      titulo: "Ainda sem vendas com volume relevante",
      porque: `${e.impressoesTotal.toLocaleString("pt-BR")} impressões e nenhuma venda. Vale checar se o problema está na página ou no checkout, não no anúncio.`,
      comoFazer:
        "Veja o funil abaixo: se muita gente clica em comprar (InitiateCheckout) mas ninguém compra, o problema é o checkout/oferta. Se ninguém nem clica, é a página.",
      fonte: "compilado_tabari.md:186",
    });
  }

  // ---------- 7. TUDO OK ----------
  if (acoes.filter((a) => a.urgencia === "agora").length === 0 && e.diasRodando >= 7) {
    acoes.push({
      urgencia: "ok",
      quem: "ninguem",
      titulo: "Campanha saudável — nada a fazer hoje",
      porque: "Nenhum criativo abaixo do piso e ROAS dentro do esperado. Deixe rodar.",
      fonte: "—",
    });
  }

  const ordem: Record<Urgencia, number> = { agora: 0, atencao: 1, aguardar: 2, ok: 3 };
  return acoes.sort((a, b) => ordem[a.urgencia] - ordem[b.urgencia]);
}
