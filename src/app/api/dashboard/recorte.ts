// ============================================================
// RECORTE — os mesmos números do painel para qualquer janela de datas (ou o total),
// sem depender do calendário das turmas.
//
//   modo "periodo"     : de/ate escolhidos no painel (dias inteiros, horário de Brasília)
//   modo "total_baby"  : desde a entrada do investidor (05/10/2026) até agora
//   modo "total_geral" : desde o primeiro gasto da Hermes Week (08/09/2026) até agora
//
// Gasto: Meta (campanhas HWK_ e boost do Instagram, como no resto do painel; a mentoria avulsa
// e outras ficam de fora e aparecem em "outras campanhas"). Receita: webhook da Hotmart
// (hotmart_compras), primeiro evento aprovado de cada transação, na janela. O líquido é a
// comissão do produtor. A Meta só entrega gasto por dia: o recorte é por dia inteiro.
// ============================================================
import { PRODUTOS, PRECO_INGRESSO, PRECO_FORMACAO_PADRAO } from "@/app/dashboard/metas";
import { ACORDO, TAXAS, LIBERACAO_DIAS } from "@/app/dashboard/metas";
import { caixaDe } from "./investidor";
import type { Recorte, RecorteDia, RecorteBloco, ModoRecorte } from "@/app/dashboard/tipos";
import { sb, meta, ehCampanhaHermesWeek, ehDistribuicao, dia, em, brDia, r2, PRODUTO_FORMACAO, type Compra } from "./montar";

const AD_ACCOUNT = "961901509283620";
export const INICIO_BABY = "2026-10-05"; // 1º dia de tráfego no cartão do investidor
export const INICIO_GERAL = "2026-09-08"; // 1º gasto da Hermes Week (campanha HWK_080926)
const APROV = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);

const div = (a: number, b: number) => (b > 0 ? a / b : null);

export function resolverJanela(modo: ModoRecorte, de?: string | null, ate?: string | null): { de: string; ate: string; rotulo: string } {
  const hoje = brDia(new Date());
  const dm = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
  if (modo === "total_baby") return { de: INICIO_BABY, ate: hoje, rotulo: `Total do investidor · ${dm(INICIO_BABY)} até hoje` };
  if (modo === "total_geral") return { de: INICIO_GERAL, ate: hoje, rotulo: `Total geral · ${dm(INICIO_GERAL)} até hoje` };
  const ok = (x?: string | null) => !!x && /^\d{4}-\d{2}-\d{2}$/.test(x);
  let a = ok(de) ? (de as string) : INICIO_BABY;
  let b = ok(ate) ? (ate as string) : hoje;
  if (b > hoje) b = hoje;
  if (a > b) a = b;
  // trava de segurança: no máximo ~13 meses
  if (dia(a, 400) < b) a = dia(b, -400);
  return { de: a, ate: b, rotulo: a === b ? `Dia ${dm(a)}` : `Período · ${dm(a)} a ${dm(b)}` };
}

export async function montarRecorte(modo: ModoRecorte, deIn?: string | null, ateIn?: string | null): Promise<Recorte> {
  const { de, ate, rotulo } = resolverJanela(modo, deIn, ateIn);
  const avisos: string[] = [];
  const ini = em(de, "00:00");
  const fim = em(dia(ate, 1), "00:00");

  // ---------- Meta ----------
  type LinhaMeta = { campaign_id?: string; campaign_name?: string; spend?: string; date_start?: string };
  let linhas: LinhaMeta[] = [];
  let idsHW: string[] = [];
  try {
    const tr = encodeURIComponent(JSON.stringify({ since: de, until: ate }));
    const j = (await meta(
      `act_${AD_ACCOUNT}/insights?time_range=${tr}&level=campaign&time_increment=1&fields=campaign_id,campaign_name,spend&limit=1000`,
    )) as { data?: LinhaMeta[] };
    linhas = j.data || [];
    idsHW = [...new Set(linhas.filter((l) => ehCampanhaHermesWeek(String(l.campaign_name || ""))).map((l) => String(l.campaign_id)))];
  } catch (e) {
    avisos.push(`Meta indisponível: ${String((e as Error).message || e)}. O gasto aparece zerado.`);
  }

  const porDiaGasto = new Map<string, { venda: number; dist: number }>();
  const outras = new Map<string, number>();
  for (const l of linhas) {
    const nome = String(l.campaign_name || "");
    const v = Number(l.spend || 0);
    if (!ehCampanhaHermesWeek(nome)) {
      outras.set(nome, (outras.get(nome) || 0) + v);
      continue;
    }
    const k = String(l.date_start);
    const x = porDiaGasto.get(k) || { venda: 0, dist: 0 };
    if (ehDistribuicao(nome)) x.dist += v;
    else x.venda += v;
    porDiaGasto.set(k, x);
  }

  let tot: Record<string, string> = {};
  if (idsHW.length) {
    try {
      const tr = encodeURIComponent(JSON.stringify({ since: de, until: ate }));
      const filt = encodeURIComponent(JSON.stringify([{ field: "campaign.id", operator: "IN", value: idsHW }]));
      const j = (await meta(
        `act_${AD_ACCOUNT}/insights?time_range=${tr}&level=account&filtering=${filt}&fields=spend,impressions,reach,cpm,ctr,inline_link_clicks`,
      )) as { data?: Record<string, string>[] };
      tot = j.data?.[0] || {};
    } catch (e) {
      avisos.push(`Alcance e cliques indisponíveis: ${String((e as Error).message || e)}`);
    }
  }

  // ---------- Hotmart (webhook) ----------
  const prodIds: string[] = [PRODUTOS.ingresso, ...PRODUTOS.bumps.map((b) => b.id), PRODUTO_FORMACAO];
  const selCompra = "transacao,evento,produto_id,email,valor,criado_em,origem:payload->data->purchase->origin,comissoes:payload->data->commissions,pagamento:payload->data->purchase->payment->>type";
  let compras: Compra[] = [];
  try {
    compras = await sb<Compra[]>(`hotmart_compras?select=${selCompra}&produto_id=in.(${prodIds.join(",")})&order=criado_em.asc&limit=10000`);
  } catch (e) {
    avisos.push(`Hotmart indisponível: ${String((e as Error).message || e)}. As vendas aparecem zeradas.`);
  }
  // reembolso e chargeback: a venda aprovada sai do líquido
  const reembTx = new Set(
    compras.filter((c) => c.evento === "PURCHASE_REFUNDED" || c.evento === "PURCHASE_CHARGEBACK").map((c) => c.transacao || "").filter(Boolean),
  );
  const aprovadas = (prod: string) => {
    const mapa = new Map<string, Compra>();
    for (const c of compras) {
      if (c.produto_id !== prod || !APROV.has(c.evento)) continue;
      const k = c.transacao || `${c.email}-${c.criado_em}`;
      if (!mapa.has(k)) mapa.set(k, c);
    }
    return [...mapa.values()].filter((c) => {
      const t = new Date(c.criado_em).getTime();
      return t >= ini.getTime() && t < fim.getTime();
    });
  };
  const liquidoDe = (c: Compra, preco: number) => {
    const p = c.comissoes?.find((x) => x.source === "PRODUCER");
    return p ? Number(p.value) : preco * 0.86;
  };
  const bloco = (nome: string, lst: Compra[], preco: number): RecorteBloco => ({
    nome,
    vendas: lst.length,
    receita: r2(lst.reduce((s, c) => s + (Number(c.valor) || preco), 0)),
    liquido: r2(lst.reduce((s, c) => s + liquidoDe(c, preco), 0)),
  });

  const ing = aprovadas(PRODUTOS.ingresso);
  const bIng = bloco("Ingresso", ing, PRECO_INGRESSO);
  const extrasLst = PRODUTOS.bumps.map((b) => ({ b, tx: aprovadas(b.id) }));
  const extras = extrasLst.map(({ b, tx }) => bloco(b.nome, tx, b.preco));
  const forTx = aprovadas(PRODUTO_FORMACAO);
  const bFor = bloco("Formação Arquiteto de Agentes", forTx, PRECO_FORMACAO_PADRAO);

  // origem dos ingressos pelo código de origem (sck) gravado na Hotmart
  const origem = { anuncio: 0, bio: 0, boost: 0, outro: 0, semOrigem: 0 };
  for (const c of ing) {
    const sck = c.origem?.sck || "";
    if (!sck) {
      origem.semOrigem++;
      continue;
    }
    const resto = sck.includes("-") ? sck.slice(sck.indexOf("-") + 1) : sck;
    if (/^\d{10,}$/.test(resto)) origem.anuncio++;
    else if (/bio/i.test(resto)) origem.bio++;
    else if (/^(PAZ|Iw)/.test(resto)) origem.boost++;
    else origem.outro++;
  }

  // ---------- série diária ----------
  const dias: string[] = [];
  for (let d = de; d <= ate; d = dia(d, 1)) dias.push(d);
  const todas = [...ing, ...extrasLst.flatMap((x) => x.tx), ...forTx];
  const liqDia = new Map<string, number>();
  const recDia = new Map<string, number>();
  for (const c of todas) {
    const d = brDia(c.criado_em);
    const prod = c.produto_id;
    const preco = prod === PRODUTOS.ingresso ? PRECO_INGRESSO : prod === PRODUTO_FORMACAO ? PRECO_FORMACAO_PADRAO : PRODUTOS.bumps.find((b) => b.id === prod)?.preco || 0;
    if (!(c.transacao && reembTx.has(c.transacao))) liqDia.set(d, (liqDia.get(d) || 0) + liquidoDe(c, preco));
    recDia.set(d, (recDia.get(d) || 0) + (Number(c.valor) || preco));
  }
  const ingDia = new Map<string, number>();
  for (const c of ing) ingDia.set(brDia(c.criado_em), (ingDia.get(brDia(c.criado_em)) || 0) + 1);
  const serie: RecorteDia[] = dias.map((d) => {
    const g = porDiaGasto.get(d) || { venda: 0, dist: 0 };
    return {
      dia: d,
      gasto: r2(g.venda + g.dist),
      gastoVenda: r2(g.venda),
      gastoDistribuicao: r2(g.dist),
      ingressos: ingDia.get(d) || 0,
      receita: r2(recDia.get(d) || 0),
      liquido: r2(liqDia.get(d) || 0),
    };
  });

  const gVenda = serie.reduce((s, x) => s + x.gastoVenda, 0);
  const gDist = serie.reduce((s, x) => s + x.gastoDistribuicao, 0);
  const gTotal = gVenda + gDist;
  const diasComGasto = serie.filter((x) => x.gasto > 0).length;
  const extrasVendas = extras.reduce((s, x) => s + x.vendas, 0);
  const receitaExtras = extras.reduce((s, x) => s + x.receita, 0);
  const liquidoExtras = extras.reduce((s, x) => s + x.liquido, 0);
  const receitaBruta = bIng.receita + receitaExtras + bFor.receita;
  const receitaLiquida = bIng.liquido + liquidoExtras + bFor.liquido; // comissão da Hotmart (já sem a taxa dela)
  const taxaHotmart = Math.max(0, receitaBruta - receitaLiquida);
  const reembolsos = todas.filter((c) => c.transacao && reembTx.has(c.transacao)).reduce((s, c) => {
    const preco = c.produto_id === PRODUTOS.ingresso ? PRECO_INGRESSO : c.produto_id === PRODUTO_FORMACAO ? PRECO_FORMACAO_PADRAO : PRODUTOS.bumps.find((b) => b.id === c.produto_id)?.preco || 0;
    return s + liquidoDe(c, preco);
  }, 0);
  const cliquesLink = Number(tot.inline_link_clicks || 0);

  // ---------- o que a Hotmart já liberou (cartão D+30; demais formas ao fim da garantia, estimativa) ----------
  const desdeMs = em(ate < INICIO_BABY ? ate : de > INICIO_BABY ? de : INICIO_BABY, "00:00").getTime();
  const liberaEm = (c: Compra) => new Date(c.criado_em).getTime() + (/CREDIT/i.test(c.pagamento || "") ? LIBERACAO_DIAS.cartao : LIBERACAO_DIAS.outros) * 86400e3;
  const vendasInv = todas.filter((c) => new Date(c.criado_em).getTime() >= desdeMs && !(c.transacao && reembTx.has(c.transacao)));
  const precoDe = (c: Compra) => (c.produto_id === PRODUTOS.ingresso ? PRECO_INGRESSO : c.produto_id === PRODUTO_FORMACAO ? PRECO_FORMACAO_PADRAO : PRODUTOS.bumps.find((b) => b.id === c.produto_id)?.preco || 0);
  const liberadoInv = vendasInv.filter((c) => liberaEm(c) <= Date.now()).reduce((s, c) => s + liquidoDe(c, precoDe(c)), 0);
  const proximasLib = vendasInv.map(liberaEm).filter((t) => t > Date.now());
  const proximaLib = proximasLib.length ? new Date(Math.min(...proximasLib)).toISOString() : null;

  // ---------- regra do acordo (30% do lucro) a partir da entrada do investidor ----------
  const desdeInv = ate < INICIO_BABY ? null : de > INICIO_BABY ? de : INICIO_BABY;
  const dentro = serie.filter((x) => desdeInv !== null && x.dia >= desdeInv);
  const antesLst = serie.filter((x) => desdeInv === null || x.dia < desdeInv);
  const gMetaInv = dentro.reduce((s, x) => s + x.gasto, 0);
  const fatorMeta = 1 + TAXAS.metaSobreGastoPct / 100;
  const gInv = gMetaInv * fatorMeta; // o que o investidor paga de verdade: gasto + imposto da Meta na fatura
  const rLiqInv = dentro.reduce((s, x) => s + x.liquido, 0); // já sem reembolsos
  const impostoRec = Math.max(0, rLiqInv) * (TAXAS.impostoSobreReceitaPct / 100);
  const rInv = rLiqInv - impostoRec;
  const devolvido = Math.min(rInv, gInv);
  const excedente = Math.max(0, rInv - gInv);
  const parteInv = excedente * ACORDO.parteInvestidor;
  const antes = antesLst.length && de < INICIO_BABY ? { gasto: r2(antesLst.reduce((s, x) => s + x.gasto, 0)), receitaLiquida: r2(antesLst.reduce((s, x) => s + x.liquido, 0)) } : null;

  if (TAXAS.metaSobreGastoPct === 0) avisos.push("O imposto que a Meta soma à fatura ainda não entrou na conta: a fatura é do investidor. A taxa da Hotmart e os reembolsos já entram sozinhos.");
  if (modo === "periodo") avisos.push("Período sem saldo anterior: o gasto é coberto primeiro e o resto divide 30/70 dentro da janela. O acumulado do acordo, turma a turma, está na aba Investidor.");
  if (de < INICIO_BABY) avisos.push(`Antes de ${INICIO_BABY.slice(8, 10)}/${INICIO_BABY.slice(5, 7)} o tráfego foi pago pela RedPro. A conta do investidor só conta daí em diante.`);
  avisos.push("A Meta entrega gasto por dia: o recorte vai de 00h a 23h59. A divisão por turma (corte às 20h de segunda) está na aba Investidor.");
  if (outras.size) avisos.push("Campanhas que não são da Hermes Week (por exemplo a mentoria avulsa) ficam fora do gasto e aparecem em \"outras campanhas\".");

  return {
    geradoEm: new Date().toISOString(),
    modo,
    de,
    ate,
    rotulo,
    gasto: { total: r2(gTotal), venda: r2(gVenda), distribuicao: r2(gDist), dias: diasComGasto, porDia: diasComGasto ? r2(gTotal / diasComGasto) : null },
    trafego: {
      impressoes: Number(tot.impressions || 0),
      alcance: Number(tot.reach || 0),
      cliquesLink,
      cpm: tot.cpm ? Number(tot.cpm) : null,
      cpcLink: div(gTotal, cliquesLink),
      ctr: tot.ctr ? Number(tot.ctr) : null,
    },
    vendas: {
      ingressos: bIng.vendas,
      receitaIngresso: bIng.receita,
      liquidoIngresso: bIng.liquido,
      extras,
      extrasVendas,
      receitaExtras: r2(receitaExtras),
      liquidoExtras: r2(liquidoExtras),
      extrasPorIngresso: div(extrasVendas, bIng.vendas),
      formacao: bFor,
      convFormacao: bIng.vendas ? (bFor.vendas / bIng.vendas) * 100 : null,
    },
    origem,
    taxas: {
      metaPct: TAXAS.metaSobreGastoPct,
      receitaPct: TAXAS.impostoSobreReceitaPct,
      metaValor: r2(gInv - gMetaInv),
      receitaValor: r2(impostoRec),
      hotmart: r2(taxaHotmart),
      reembolsos: r2(reembolsos),
    },
    totais: {
      receitaBruta: r2(receitaBruta),
      receitaLiquida: r2(receitaLiquida),
      roasIngresso: div(bIng.receita, gTotal),
      roasComExtras: div(bIng.receita + receitaExtras, gTotal),
      roasFunil: div(receitaBruta, gTotal),
      cpa: div(gTotal, bIng.vendas),
      receitaPorIngresso: div(receitaBruta, bIng.vendas),
      lucro: r2(receitaLiquida - reembolsos - gTotal),
    },
    serie,
    outrasCampanhas: [...outras.entries()].map(([nome, gasto]) => ({ nome, gasto: r2(gasto) })).filter((x) => x.gasto > 0),
    investidor: {
      desde: desdeInv,
      caixa: caixaDe(desdeInv ? liberadoInv : 0, rInv, gInv, proximaLib),
      gastoMeta: r2(gMetaInv),
      antes,
      gasto: r2(gInv),
      receitaLiquida: r2(rInv),
      devolvido: r2(devolvido),
      saldoDevedor: r2(Math.max(0, gInv - rInv)),
      excedente: r2(excedente),
      parteInvestidor: r2(parteInv),
      parteRedpro: r2(excedente - parteInv),
      totalInvestidor: r2(devolvido + parteInv),
      multiplo: gInv > 0 ? (devolvido + parteInv) / gInv : null,
    },
    avisos,
    ciclos: [],
  };
}
