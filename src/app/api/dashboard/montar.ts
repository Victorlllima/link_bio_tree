// ============================================================
// Monta TODOS os números do painel /dashboard para um ciclo da Hermes Week.
//
// Fontes:
//   Meta Marketing API (ao vivo, cache de 90s) → tráfego, criativos
//   Supabase hotmart_compras (webhook)         → ingressos, bumps, Formação,
//                                                abandono, reembolso, origem
//   Supabase hermes_week_matriculas / crm_week_status (ciclo = D0 + 7) → fichas
//   Supabase grupos_ciclo + disparos_grupo + Evolution → grupo e mensageria
//   Supabase hw_dash_manual                     → o que não tem API (presença
//                                                ao vivo, únicos, verba de
//                                                distribuição, metas)
//
// Janela do ciclo (D0 = segunda da Aula 1, sempre em horário de Brasília):
//   captação  = [D0 do ciclo anterior 20h, D0 20h)
//   aulas     = D0..D0+4 20h · sábado D0+5 · pitch D0+6 20h
//   carrinho  = D0+7 06h50 → 21h · vendas da Formação contam até D0+14
// ============================================================

import { REGUAS, avaliar, QUEDA_AULA, PRODUTOS, PRECO_INGRESSO, PRECO_FORMACAO_PADRAO, IMPRESSOES_MIN_JULGAR, type Cor } from "@/app/dashboard/metas";
import type { Dados, Criativo, Leitura, Aula, Resumo, DiaTrafego, Fase } from "@/app/dashboard/tipos";

const SB = "https://supabase.redpro.com.br/rest/v1";
const GRAPH = "https://graph.facebook.com/v21.0";
const AD_ACCOUNT = "961901509283620";
const FILTRO_CAMPANHA = "HWK"; // toda campanha da Hermes Week começa com HWK_
// Boost feito direto do app do Instagram ("Promover"): a Meta nomeia a campanha sozinha a
// partir do texto do post, nunca com o prefixo HWK_. É a distribuição orgânica turbinada que o
// método Tabari prevê (25% do budget diário) — decisão do Red (10/10/2026): conta como gasto
// da Hermes Week, não fica separado em "outras campanhas".
const PREFIXOS_BOOST_IG = ["Post do Instagram", "Publicação do Instagram", "Reel do Instagram"];
function ehCampanhaHermesWeek(nome: string): boolean {
  return nome.includes(FILTRO_CAMPANHA) || PREFIXOS_BOOST_IG.some((p) => nome.startsWith(p));
}
const PRIMEIRO_D0 = "2026-09-21";

function sbH() {
  const k = process.env.SUPABASE_SERVICE_KEY!;
  return { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" };
}

async function sb<T>(path: string): Promise<T> {
  const r = await fetch(`${SB}/${path}`, { headers: sbH(), cache: "no-store" });
  if (!r.ok) throw new Error(`${path.split("?")[0]}: ${r.status} ${await r.text()}`);
  return r.json();
}

// ---------- datas em Brasília ----------
const dia = (d: string, n: number) => {
  const x = new Date(`${d}T12:00:00-03:00`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
const em = (d: string, hhmm: string) => new Date(`${d}T${hhmm}:00-03:00`);
const brDia = (iso: string | Date) => new Date(new Date(iso).getTime() - 3 * 3600e3).toISOString().slice(0, 10);
const brHora = (iso: string | Date) => new Date(new Date(iso).getTime() - 3 * 3600e3).getUTCHours();
const brDow = (iso: string | Date) => new Date(new Date(iso).getTime() - 3 * 3600e3).getUTCDay();
const dm = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;

const div = (a: number, b: number) => (b > 0 ? a / b : null);
const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : null);
const r2 = (n: number) => Math.round(n * 100) / 100;

// ---------- tipos crus ----------
type Compra = {
  transacao: string | null;
  evento: string;
  produto_id: string;
  email: string | null;
  valor: number | null;
  criado_em: string;
  origem: { sck?: string; src?: string } | null;
  comissoes: { value: number; source: string }[] | null;
  pagamento: string | null;
  email_membro?: string | null;
};
type MetaAction = { action_type: string; value: string };
const act = (a: MetaAction[] | undefined, ...tipos: string[]) => {
  if (!a) return 0;
  for (const t of tipos) {
    const x = a.find((y) => y.action_type === t);
    if (x) return Number(x.value) || 0;
  }
  return 0;
};

// ============================================================
// CICLOS
// ============================================================
export type CicloCal = {
  d0: string; // segunda-feira da Aula 1
  indice: number; // posição entre as turmas reais (as semanas puladas não contam)
  nome: string;
  captIni: Date; // 00h00 do primeiro dia de captação
  captFim: Date; // 23h59 da segunda da Aula 1 (a segunda ainda é captação)
  aulaIni: Date; // segunda 20h
  carrinhoFim: Date; // segunda seguinte 21h
};

// Semanas puladas até 09/10/2026, usadas se a tabela de exceções não responder.
const PULADAS_PADRAO = ["2026-09-28", "2026-10-05"];

/**
 * Calendário das turmas, gerado a cada segunda-feira (D0 = Aula 1) a partir de 21/09.
 *  - A captação dura até 7 dias e termina às 23h59 da segunda da Aula 1.
 *  - Ela nunca invade a segunda da turma anterior: começa na terça seguinte a ela.
 *    Por isso a turma 2 (05/10) tem 8 dias e a turma 3 (13/10) tem 7.
 *  - Semana pulada ou captação fora do padrão vêm de hw_ciclos_excecoes.
 *  - Só aparecem turmas cuja captação já começou.
 */
export async function calendario(): Promise<CicloCal[]> {
  const exc = await sb<{ d0: string; pular: boolean; capt_ini: string | null }[]>("hw_ciclos_excecoes?select=d0,pular,capt_ini").catch(() => null);
  const puladas = new Set((exc ?? PULADAS_PADRAO.map((d0) => ({ d0, pular: true, capt_ini: null }))).filter((e) => e.pular).map((e) => e.d0));
  const inicios = new Map((exc ?? []).filter((e) => e.capt_ini).map((e) => [e.d0, e.capt_ini as string]));
  const agora = Date.now();
  const lista: CicloCal[] = [];
  let anterior: string | null = null;
  for (let d0 = PRIMEIRO_D0; d0 <= brDia(new Date(agora + 30 * 86400e3)); d0 = dia(d0, 7)) {
    if (puladas.has(d0)) continue;
    const padrao = dia(d0, -7);
    const iniStr = inicios.get(d0) ?? (anterior && dia(anterior, 1) > padrao ? dia(anterior, 1) : padrao);
    const captIni = em(iniStr, "00:00");
    if (captIni.getTime() > agora) break;
    const indice = lista.length + 1;
    lista.push({
      d0,
      indice,
      nome: `Turma ${indice} · ${dm(d0)}`,
      captIni,
      captFim: new Date(em(dia(d0, 1), "00:00").getTime() - 1),
      aulaIni: em(d0, "20:00"),
      carrinhoFim: em(dia(d0, 7), "21:00"),
    });
    anterior = d0;
  }
  return lista;
}

/** Quais turmas estão vivas agora: em captação, em aula ou carrinho, ou as duas ao mesmo tempo. */
export async function listarCiclos(): Promise<{ cal: CicloCal[]; atual: string; captacao: string | null; aula: string | null }> {
  const cal = await calendario();
  const t = Date.now();
  const ultima = <T,>(xs: T[]) => (xs.length ? xs[xs.length - 1] : null);
  const cap = ultima(cal.filter((c) => t >= c.captIni.getTime() && t <= c.captFim.getTime()));
  const aula = ultima(cal.filter((c) => t >= c.aulaIni.getTime() && t < c.carrinhoFim.getTime()));
  const atual = (cap ?? aula ?? ultima(cal))?.d0 ?? PRIMEIRO_D0;
  return { cal, atual, captacao: cap?.d0 ?? null, aula: aula?.d0 ?? null };
}

function faseDo(d0: string, agora: Date): { fase: Fase; proximo: { rotulo: string; quando: string } | null } {
  const marcos: { rotulo: string; quando: Date }[] = [
    ...[0, 1, 2, 3, 4].map((n) => ({ rotulo: `Aula ${n + 1}`, quando: em(dia(d0, n), "20:00") })),
    { rotulo: "Grupo aberto pra dúvida", quando: em(dia(d0, 5), "10:00") },
    { rotulo: "Apresentação da Formação", quando: em(dia(d0, 6), "20:00") },
    { rotulo: "Carrinho abre (fichas)", quando: em(dia(d0, 7), "06:50") },
    { rotulo: "Carrinho fecha", quando: em(dia(d0, 7), "21:00") },
  ];
  const prox = marcos.find((m) => m.quando > agora) || null;
  const proximo = prox ? { rotulo: prox.rotulo, quando: prox.quando.toISOString() } : null;
  const t = agora.getTime();
  let fase: Fase;
  if (t < em(d0, "20:00").getTime()) {
    fase = { id: "captacao", rotulo: "Captação", detalhe: `Aula 1 na segunda, ${dm(d0)}, às 20h` };
  } else if (t < em(dia(d0, 5), "00:00").getTime()) {
    const n = Math.min(5, Math.floor((t - em(d0, "00:00").getTime()) / 86400e3) + 1);
    fase = { id: "aulas", rotulo: "Semana de aulas", detalhe: `Dia da Aula ${n}` };
  } else if (t < em(dia(d0, 6), "00:00").getTime()) {
    fase = { id: "sabado", rotulo: "Sábado de dúvidas", detalhe: "Grupo aberto das 10h às 12h" };
  } else if (t < em(dia(d0, 7), "00:00").getTime()) {
    fase = { id: "pitch", rotulo: "Domingo de apresentação", detalhe: "Formação Arquiteto de Agentes às 20h" };
  } else if (t < em(dia(d0, 7), "21:00").getTime()) {
    fase = { id: "carrinho", rotulo: "Carrinho aberto", detalhe: "Fecha hoje às 21h" };
  } else {
    fase = { id: "pos", rotulo: "Pós-evento", detalhe: "Hora do pós-morte: views únicos e recuperação" };
  }
  return { fase, proximo };
}

// ============================================================
// META
// ============================================================
async function meta(path: string) {
  const token = process.env.META_ADS_TOKEN;
  if (!token) throw new Error("META_ADS_TOKEN não configurado");
  const sep = path.includes("?") ? "&" : "?";
  const r = await fetch(`${GRAPH}/${path}${sep}access_token=${token}`, { next: { revalidate: 90 } });
  const j = await r.json();
  if (j.error) {
    const exp = j.error.code === 190 || /expired/i.test(j.error.message || "");
    throw new Error(exp ? "o token da Meta expirou" : `Meta: ${j.error.message}`);
  }
  return j;
}

async function lerMeta(since: string, until: string, comAnuncios: boolean) {
  const tr = encodeURIComponent(JSON.stringify({ since, until }));
  const base = `act_${AD_ACCOUNT}/insights?time_range=${tr}`;
  const fBase = "spend,impressions,inline_link_clicks,actions,action_values";

  // Fase 1: lista TODA campanha com gasto na janela (sem filtro), pra decidir — pelo nome —
  // quais contam como Hermes Week. Campanha de boost do Instagram não tem prefixo HWK_, então
  // o filtro do Meta não dá conta sozinho; a decisão é feita aqui, em código.
  const campsBrutos = (await meta(`${base}&level=campaign&fields=campaign_id,campaign_name,spend&limit=200`)) as {
    data?: { campaign_id?: string; campaign_name?: string; spend?: string }[];
  };
  const todasCamps = campsBrutos.data || [];
  const idsHermesWeek = todasCamps
    .filter((c) => ehCampanhaHermesWeek(String(c.campaign_name || "")))
    .map((c) => c.campaign_id)
    .filter((id): id is string => !!id);

  // Sem nenhuma campanha reconhecida na janela: filtra por um id inexistente pra devolver zerado
  // em vez de cair sem filtro nenhum (que somaria a conta inteira, de qualquer campanha antiga).
  const filtroIds = idsHermesWeek.length ? idsHermesWeek : ["0"];
  const filt = encodeURIComponent(JSON.stringify([{ field: "campaign.id", operator: "IN", value: filtroIds }]));

  const reqs: Promise<Record<string, unknown>>[] = [
    meta(`${base}&level=account&filtering=${filt}&fields=${fBase},reach,frequency,cpm,ctr,clicks`),
    meta(`${base}&level=account&filtering=${filt}&time_increment=1&fields=${fBase}&limit=100`),
    Promise.resolve(campsBrutos as Record<string, unknown>),
  ];
  if (comAnuncios) {
    reqs.push(
      meta(
        `${base}&level=ad&filtering=${filt}&fields=ad_id,ad_name,spend,impressions,inline_link_clicks,ctr,actions,video_p75_watched_actions&limit=300`,
      ),
      meta(
        `act_${AD_ACCOUNT}/ads?filtering=${filt}&fields=id,name,effective_status,created_time,creative.thumbnail_width(600).thumbnail_height(600)%7Bthumbnail_url,image_url%7D&limit=300`,
      ),
    );
  }
  const [tot, serie, camps, ads, adsMeta] = await Promise.all(reqs);
  return { tot, serie, camps, ads, adsMeta } as Record<string, { data?: Record<string, unknown>[] } | undefined>;
}

// ============================================================
// MONTAGEM
// ============================================================
export async function montar(pedido: string, opts: { leve?: boolean; cal?: CicloCal[] } = {}): Promise<Dados> {
  const agora = new Date();
  const cal = opts.cal ?? (await calendario());
  const ciclo = cal.find((c) => c.d0 === pedido) ?? cal[cal.length - 1];
  if (!ciclo) throw new Error("nenhuma turma com captação iniciada");
  const d0 = ciclo.d0;
  const idx = ciclo.indice - 1;

  const captIni = ciclo.captIni;
  const captFim = ciclo.captFim;
  const carrinhoAbre = em(dia(d0, 7), "06:50");
  const carrinhoFecha = em(dia(d0, 7), "21:00");
  // o carrinho só fica aberto na segunda: as vendas da Formação vão da apresentação até o fim dessa segunda
  const backendIni = em(dia(d0, 6), "20:00");
  const backendFim = em(dia(d0, 8), "00:00");
  const { fase, proximo } = faseDo(d0, agora);

  // ---------- leituras do banco em paralelo ----------
  const prodIds: string[] = [PRODUTOS.ingresso, ...PRODUTOS.bumps.map((b) => b.id)];
  const manualRows = await sb<{ chave: string; valor: number | null }[]>(`hw_dash_manual?ciclo=eq.${d0}&select=chave,valor`).catch(
    () => [],
  );
  const manual: Record<string, number> = {};
  for (const r of manualRows) if (r.valor !== null) manual[r.chave] = Number(r.valor);
  const produtoBackend = manual.produto_formacao_id
    ? String(manual.produto_formacao_id)
    : process.env.HW_PRODUTO_FORMACAO || null;
  if (produtoBackend) prodIds.push(produtoBackend);

  // O histórico inteiro é carregado de propósito: a Hotmart manda PURCHASE_COMPLETE 7 dias depois
  // da aprovação (fim da garantia). Sem a aprovação original na lista, a compra antiga pareceria
  // uma venda nova e entraria na turma errada.
  const desde = new Date(captIni.getTime() - 86400e3).toISOString();
  const selCompra =
    "transacao,evento,produto_id,email,valor,criado_em,origem:payload->data->purchase->origin,comissoes:payload->data->commissions,pagamento:payload->data->purchase->payment->>type,email_membro:payload->data->user->>email";
  const fontes: Dados["fontes"] = { meta: { ok: true }, hotmart: { ok: true }, evolution: { ok: true } };

  const [compras, mats, interesse, grupos, disparos] = await Promise.all([
    sb<Compra[]>(
      `hotmart_compras?select=${selCompra}&produto_id=in.(${prodIds.join(",")})&order=criado_em.asc&limit=10000`,
    ).catch((e) => {
      fontes.hotmart = { ok: false, erro: String(e.message || e) };
      return [] as Compra[];
    }),
    sb<{ email: string }[]>(`hermes_week_matriculas?select=email&criado_em=gte.${encodeURIComponent(desde)}`).catch(() => []),
    sb<{ email: string; tag: string; criado_em: string }[]>(
      `crm_week_status?select=email,tag,criado_em&criado_em=gte.${encodeURIComponent(em(dia(d0, 3), "00:00").toISOString())}&criado_em=lt.${encodeURIComponent(em(dia(d0, 7), "21:00").toISOString())}`,
    ).catch(() => []),
    sb<{ ciclo: string; tipo_grupo: string; jid: string; nome_grupo: string }[]>(
      `grupos_ciclo?ciclo=eq.hermes-week-${idx + 1}&tipo_grupo=eq.semana&select=ciclo,tipo_grupo,jid,nome_grupo`,
    ).catch(() => []),
    sb<{ status: string }[]>(`disparos_grupo?ciclo=in.(${d0},hermes-week-${idx + 1})&select=status`).catch(() => []),
  ]);

  // ---------- Meta ----------
  const since = brDia(captIni);
  const hoje = brDia(agora);
  const fimCapt = brDia(captFim);
  const until = fimCapt < hoje ? fimCapt : hoje;
  let m: Awaited<ReturnType<typeof lerMeta>> | null = null;
  if (since <= until) {
    try {
      m = await lerMeta(since, until, !opts.leve);
    } catch (e) {
      fontes.meta = { ok: false, erro: String((e as Error).message || e) };
    }
  } else {
    fontes.meta = { ok: true, obs: "a captação deste ciclo ainda não começou" };
  }

  // ============================================================
  // VENDAS (Hotmart)
  // ============================================================
  const naJanela = (c: Compra, ini: Date, fim: Date) => {
    const t = new Date(c.criado_em).getTime();
    return t >= ini.getTime() && t < fim.getTime();
  };
  const APROV = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
  const liquidoDe = (c: Compra) => {
    const p = c.comissoes?.find((x) => x.source === "PRODUCER");
    return p ? Number(p.value) : null;
  };

  // transações aprovadas por produto, na janela (primeiro evento aprovado)
  function aprovadas(prod: string, ini: Date, fim: Date) {
    const mapa = new Map<string, Compra>();
    for (const c of compras) {
      if (c.produto_id !== prod || !APROV.has(c.evento)) continue;
      const k = c.transacao || `${c.email}-${c.criado_em}`;
      if (!mapa.has(k)) mapa.set(k, c);
    }
    return [...mapa.values()].filter((c) => naJanela(c, ini, fim));
  }
  const eventosDe = (prod: string, ev: string) => compras.filter((c) => c.produto_id === prod && c.evento === ev);

  const ingressosTx = aprovadas(PRODUTOS.ingresso, captIni, captFim);
  const txIngresso = new Set(ingressosTx.map((c) => c.transacao));
  const emailsIngresso = new Set(ingressosTx.map((c) => (c.email || "").toLowerCase()).filter(Boolean));
  const ingressos = ingressosTx.length;

  const taxaObs: number[] = [];
  const somaLiq = (lst: Compra[], preco: number) =>
    lst.reduce((s, c) => {
      const l = liquidoDe(c);
      if (l !== null && c.valor) taxaObs.push(l / Number(c.valor));
      return s + (l ?? preco * 0.86);
    }, 0);

  const receitaIngresso = ingressosTx.reduce((s, c) => s + (Number(c.valor) || PRECO_INGRESSO), 0);
  const liquidoIngresso = somaLiq(ingressosTx, PRECO_INGRESSO);

  const bumps = PRODUTOS.bumps.map((b) => {
    const tx = aprovadas(b.id, captIni, captFim);
    return {
      id: b.id,
      nome: b.nome,
      preco: b.preco,
      vendas: tx.length,
      take: pct(tx.length, ingressos),
      receita: tx.reduce((s, c) => s + (Number(c.valor) || b.preco), 0),
      liquido: somaLiq(tx, b.preco),
    };
  });
  const receitaFront = receitaIngresso + bumps.reduce((s, b) => s + b.receita, 0);
  const liquidoFront = liquidoIngresso + bumps.reduce((s, b) => s + b.liquido, 0);
  const taxaPlataforma = taxaObs.length ? 1 - taxaObs.reduce((a, b) => a + b, 0) / taxaObs.length : null;

  // pendentes, expirados, abandono, reembolso
  const todosAprovados = new Set(compras.filter((c) => APROV.has(c.evento)).map((c) => c.transacao));
  const nosPrint = eventosDe(PRODUTOS.ingresso, "PURCHASE_BILLET_PRINTED").filter((c) => naJanela(c, captIni, captFim));
  const expiradosTx = new Set(eventosDe(PRODUTOS.ingresso, "PURCHASE_EXPIRED").map((c) => c.transacao));
  const canceladosTx = new Set(eventosDe(PRODUTOS.ingresso, "PURCHASE_CANCELED").map((c) => c.transacao));
  const pendentes = new Set(
    nosPrint
      .filter((c) => !todosAprovados.has(c.transacao) && !expiradosTx.has(c.transacao) && !canceladosTx.has(c.transacao))
      .map((c) => c.transacao),
  ).size;
  const expirados = new Set(
    eventosDe(PRODUTOS.ingresso, "PURCHASE_EXPIRED")
      .filter((c) => naJanela(c, captIni, captFim))
      .map((c) => c.transacao),
  ).size;
  const abandonoEmails = new Set(
    eventosDe(PRODUTOS.ingresso, "PURCHASE_OUT_OF_SHOPPING_CART")
      .filter((c) => naJanela(c, captIni, captFim))
      .map((c) => (c.email || "").toLowerCase())
      .filter(Boolean),
  );
  const recuperados = [...abandonoEmails].filter((e) => emailsIngresso.has(e)).length;
  const contaTx = (ev: string) => new Set(eventosDe(PRODUTOS.ingresso, ev).filter((c) => txIngresso.has(c.transacao)).map((c) => c.transacao)).size;
  const reembolsos = contaTx("PURCHASE_REFUNDED");
  const chargebacks = contaTx("PURCHASE_CHARGEBACK");
  const pedidosReembolso = contaTx("PURCHASE_PROTEST");
  const cancelados = contaTx("PURCHASE_CANCELED");
  const primeiroAcesso = new Set(
    eventosDe(PRODUTOS.ingresso, "CLUB_FIRST_ACCESS")
      .map((c) => (c.email || c.email_membro || "").toLowerCase())
      .filter((e) => emailsIngresso.has(e)),
  ).size;

  // por dia, por hora, por página, por origem, por pagamento
  const porDiaMap = new Map<string, number>();
  for (let d = brDia(captIni); d <= brDia(captFim); d = dia(d, 1)) porDiaMap.set(d, 0);
  const porHora = Array.from({ length: 7 }, () => Array(24).fill(0));
  const porPagina = new Map<string, number>();
  const porAnuncio = new Map<string, number>();
  const origem = { anuncio: 0, bio: 0, outro: 0 };
  const emailsPagos = new Set<string>();
  const pagamento: Record<string, number> = {};
  for (const c of ingressosTx) {
    const d = brDia(c.criado_em);
    porDiaMap.set(d, (porDiaMap.get(d) || 0) + 1);
    porHora[brDow(c.criado_em)][brHora(c.criado_em)]++;
    const sck = c.origem?.sck || "";
    const [variante, resto] = sck.includes("-") ? [sck.split("-")[0], sck.slice(sck.indexOf("-") + 1)] : ["?", sck];
    porPagina.set(variante || "?", (porPagina.get(variante || "?") || 0) + 1);
    if (/^\d{10,}$/.test(resto)) {
      origem.anuncio++;
      if (c.email) emailsPagos.add(c.email.toLowerCase());
      porAnuncio.set(resto, (porAnuncio.get(resto) || 0) + 1);
    } else if (/bio/i.test(resto)) origem.bio++;
    else origem.outro++;
    const pg = (c.pagamento || "outro").toUpperCase();
    pagamento[pg] = (pagamento[pg] || 0) + 1;
  }

  const receitaPaga =
    ingressosTx.filter((c) => emailsPagos.has((c.email || "").toLowerCase())).reduce((s, c) => s + (Number(c.valor) || PRECO_INGRESSO), 0) +
    PRODUTOS.bumps.reduce(
      (s, b) => s + aprovadas(b.id, captIni, captFim).filter((c) => emailsPagos.has((c.email || "").toLowerCase())).reduce((x, c) => x + (Number(c.valor) || b.preco), 0),
      0,
    );

  // ============================================================
  // TRÁFEGO (Meta)
  // ============================================================
  const tot = (m?.tot?.data?.[0] || {}) as Record<string, unknown>;
  const acts = tot.actions as MetaAction[] | undefined;
  const gasto = Number(tot.spend || 0);
  const impressoes = Number(tot.impressions || 0);
  const cliquesLink = Number(tot.inline_link_clicks || 0) || act(acts, "link_click");
  const lpv = act(acts, "landing_page_view", "omni_landing_page_view");
  const ic = act(acts, "omni_initiated_checkout", "initiate_checkout", "offsite_conversion.fb_pixel_initiate_checkout");
  const compraPixel = act(acts, "omni_purchase", "purchase", "offsite_conversion.fb_pixel_purchase");

  const serieMeta = new Map<string, Record<string, unknown>>();
  for (const r of m?.serie?.data || []) serieMeta.set(String(r.date_start), r);
  const serie: DiaTrafego[] = [...porDiaMap.keys()].map((d) => {
    const r = serieMeta.get(d) || {};
    const a = r.actions as MetaAction[] | undefined;
    const vendasDia = ingressosTx.filter((c) => brDia(c.criado_em) === d);
    return {
      dia: d,
      gasto: Number(r.spend || 0),
      impressoes: Number(r.impressions || 0),
      cliquesLink: Number(r.inline_link_clicks || 0),
      lpv: act(a, "landing_page_view", "omni_landing_page_view"),
      ic: act(a, "omni_initiated_checkout", "initiate_checkout"),
      ingressos: vendasDia.length,
      receita: vendasDia.reduce((s, c) => s + (Number(c.valor) || 0), 0),
    };
  });
  const diasComGasto = serie.filter((s) => s.gasto > 0).length;
  const outrasCampanhas = ((m?.camps?.data || []) as Record<string, unknown>[])
    .filter((c) => !ehCampanhaHermesWeek(String(c.campaign_name || "")) && Number(c.spend) > 0)
    .map((c) => ({ nome: String(c.campaign_name), gasto: Number(c.spend) }));
  const verbaDistrib = manual.verba_distribuicao ?? 0;

  const vendasPagas = origem.anuncio;
  const trafego: Dados["trafego"] = {
    gasto,
    impressoes,
    alcance: Number(tot.reach || 0),
    frequencia: tot.frequency ? Number(tot.frequency) : null,
    cpm: tot.cpm ? Number(tot.cpm) : null,
    ctr: tot.ctr ? Number(tot.ctr) : null,
    cliquesLink,
    cpcLink: div(gasto, cliquesLink),
    lpv,
    ic,
    compraPixel,
    dias: diasComGasto,
    verbaDia: diasComGasto ? gasto / diasComGasto : null,
    connect: pct(lpv, cliquesLink),
    pagCheckout: pct(ic, lpv),
    checkoutCompra: pct(vendasPagas, ic),
    convPagina: pct(vendasPagas, lpv),
    custoIc: div(gasto, ic),
    vendasPagas,
    cpaPago: div(gasto, vendasPagas),
    outrasCampanhas,
    distribuicaoPct: verbaDistrib > 0 ? pct(verbaDistrib, gasto + verbaDistrib) : null,
    serie,
  };

  // ============================================================
  // CRIATIVOS
  // ============================================================
  const metaAds = new Map<string, Record<string, unknown>>();
  for (const a of (m?.adsMeta?.data || []) as Record<string, unknown>[]) metaAds.set(String(a.id), a);
  const criativos: Criativo[] = ((m?.ads?.data || []) as Record<string, unknown>[]).map((a) => {
    const id = String(a.ad_id);
    const info = metaAds.get(id) || {};
    const nome = String(a.ad_name || "");
    const formato: Criativo["formato"] = /_vid_/i.test(nome)
      ? "video"
      : /_car_/i.test(nome)
        ? "carrossel"
        : /_est_/i.test(nome)
          ? "estatico"
          : "outro";
    const acoes = a.actions as MetaAction[] | undefined;
    const imp = Number(a.impressions || 0);
    const v3 = act(acoes, "video_view");
    const p75 = act(a.video_p75_watched_actions as MetaAction[] | undefined, "video_view");
    const vendas = porAnuncio.get(id) || 0;
    const g = Number(a.spend || 0);
    const ctr = Number(a.ctr || 0);
    const hook = formato === "video" && imp ? (v3 / imp) * 100 : null;
    const hold = formato === "video" && v3 ? (p75 / v3) * 100 : null;
    const body = formato === "video" && p75 ? (vendas / p75) * 100 : null;
    const cr = (info.creative || {}) as Record<string, string>;
    return {
      adId: id,
      nome,
      formato,
      status: String(info.effective_status || ""),
      criadoEm: info.created_time ? String(info.created_time) : null,
      thumb: cr.thumbnail_url || cr.image_url || null,
      gasto: g,
      impressoes: imp,
      cliquesLink: Number(a.inline_link_clicks || 0),
      ctr,
      views3s: v3,
      p75,
      hook,
      hold,
      body,
      vendas,
      vendasPixel: act(acoes, "omni_purchase", "purchase"),
      cpa: vendas ? g / vendas : null,
      veredito: veredito({ formato, imp, ctr, hook, hold, body, vendas, gasto: g }),
    };
  });
  criativos.sort((a, b) => b.vendas - a.vendas || b.gasto - a.gasto);
  const ativos = [...metaAds.values()].filter((a) => a.effective_status === "ACTIVE");
  const fmt = (n: string) => (/_vid_/i.test(n) ? "video" : /_car_/i.test(n) ? "carrossel" : /_est_/i.test(n) ? "estatico" : "outro");
  const batelada = {
    ativos: ativos.length,
    video: ativos.filter((a) => fmt(String(a.name)) === "video").length,
    estatico: ativos.filter((a) => fmt(String(a.name)) === "estatico").length,
    carrossel: ativos.filter((a) => fmt(String(a.name)) === "carrossel").length,
    novos7d: [...metaAds.values()].filter(
      (a) => a.created_time && agora.getTime() - new Date(String(a.created_time)).getTime() < 7 * 86400e3,
    ).length,
  };

  // ============================================================
  // GRUPO
  // ============================================================
  const g0 = grupos[0];
  let membros: number | null = null;
  let fonteGrupo: "evolution" | "manual" | null = null;
  if (g0?.jid && !opts.leve) {
    try {
      const base = process.env.EVOLUTION_API_URL || "https://evo.redpro.com.br";
      const inst = process.env.EVOLUTION_INSTANCE || "academy-suporte";
      const r = await fetch(`${base}/group/findGroupInfos/${inst}?groupJid=${encodeURIComponent(g0.jid)}`, {
        headers: { apikey: process.env.EVOLUTION_API_KEY || "" },
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 300 },
      });
      const j = await r.json();
      if (Array.isArray(j?.participants)) {
        const admins = j.participants.filter((p: { admin?: string | null }) => p.admin).length;
        membros = j.participants.length - admins;
        fonteGrupo = "evolution";
      } else {
        fontes.evolution = { ok: false, erro: "a instância do WhatsApp não respondeu (desconectada)" };
      }
    } catch {
      fontes.evolution = { ok: false, erro: "a Evolution não respondeu a tempo" };
    }
  }
  if (manual.membros_grupo !== undefined) {
    membros = manual.membros_grupo;
    fonteGrupo = "manual";
  }
  const cont = (s: string) => disparos.filter((d) => d.status === s).length;
  const grupo: Dados["grupo"] = {
    nome: g0?.nome_grupo || null,
    jid: g0?.jid || null,
    membros,
    fonte: fonteGrupo,
    entradaPct: membros !== null ? pct(membros, ingressos) : null,
    disparos: {
      total: disparos.length,
      enviados: cont("enviado"),
      atrasados: cont("atrasado"),
      vetados: cont("vetado"),
      pendentes: disparos.filter((d) => ["pendente", "aprovado", "agendado"].includes(d.status)).length,
      expirados: cont("expirado"),
    },
  };

  // ============================================================
  // AULAS (manual: presença ao vivo, únicos, duração)
  // ============================================================
  const aulas: Aula[] = [];
  for (let n = 1; n <= 6; n++) {
    const pres = manual[`presenca_a${n}`] ?? null;
    const ant = n > 1 ? aulas[n - 2] : null;
    const fator = QUEDA_AULA[n - 1];
    const baseAnt = ant ? (ant.presenca ?? ant.esperado) : null;
    const esperado = n === 1 ? (ingressos ? ingressos * 0.3 : null) : baseAnt !== null && fator ? baseAnt * fator : null;
    const unic = manual[`unicos_a${n}`] ?? null;
    aulas.push({
      n,
      rotulo: n === 6 ? "Apresentação (dom)" : `Aula ${n}`,
      data: dia(d0, n === 6 ? 6 : n - 1),
      presenca: pres,
      esperado: esperado !== null ? Math.round(esperado) : null,
      presencaPct: pres !== null ? pct(pres, ingressos) : null,
      unicos: unic,
      unicosPct: unic !== null ? pct(unic, ingressos) : null,
      duracao: manual[`duracao_a${n}`] ?? null,
      retencao: pres !== null && ant?.presenca ? (pres / ant.presenca) * 100 : null,
      retencaoMeta: fator ? fator * 100 : null,
    });
  }

  // ============================================================
  // FICHAS
  // ============================================================
  // a ficha é da turma de quem comprou o ingresso nela; o campo `ciclo` da tabela depende de quando o Alfred vira a data
  const matEmails = new Set(mats.map((x) => (x.email || "").toLowerCase()).filter((e) => emailsIngresso.has(e)));
  const intEmails = new Map<string, string>();
  for (const r of interesse) {
    const e = (r.email || "").toLowerCase();
    if (emailsIngresso.has(e)) intEmails.set(e, (r.tag || "").toUpperCase());
  }
  const tags = [...intEmails.values()];
  const presA4 = manual.presenca_a4 ?? null;
  const fichas: Dados["fichas"] = {
    matriculas: matEmails.size,
    matriculaPct: pct(matEmails.size, ingressos),
    interesse: {
      total: intEmails.size,
      hot: tags.filter((t) => t === "HOT").length,
      warm: tags.filter((t) => t === "WARM").length,
      cold: tags.filter((t) => t === "COLD").length,
    },
    interessePct: presA4 ? pct(intEmails.size, presA4) : pct(intEmails.size, ingressos),
    interesseBase: presA4 ? "dos presentes na Aula 4" : "dos compradores (lance a presença da Aula 4 pra medir sobre os presentes)",
  };

  // ============================================================
  // FORMAÇÃO (backend)
  // ============================================================
  const preco = manual.preco_formacao ?? PRECO_FORMACAO_PADRAO;
  let backendTx: Compra[] = [];
  let fonteBackend: "hotmart" | "manual" | null = null;
  if (produtoBackend) {
    backendTx = aprovadas(produtoBackend, backendIni, backendFim);
    fonteBackend = "hotmart";
  }
  const vendasBackend = fonteBackend === "hotmart" ? backendTx.length : (manual.vendas_formacao ?? null);
  if (fonteBackend === null && vendasBackend !== null) fonteBackend = "manual";
  const taxaMedia = taxaPlataforma ?? 0.14;
  const receitaBackend = vendasBackend !== null ? (fonteBackend === "hotmart" ? backendTx.reduce((s, c) => s + (Number(c.valor) || preco), 0) : vendasBackend * preco) : null;
  const liquidoBackend =
    vendasBackend !== null
      ? fonteBackend === "hotmart"
        ? somaLiq(backendTx, preco)
        : vendasBackend * preco * (1 - taxaMedia)
      : null;
  let curva: Dados["backend"]["curva"] = null;
  const porHoraBackend: { hora: string; vendas: number }[] = [];
  if (fonteBackend === "hotmart" && backendTx.length) {
    const t0 = carrinhoAbre.getTime();
    const ts = backendTx.map((c) => new Date(c.criado_em).getTime());
    curva = {
      ate10min: ts.filter((t) => t >= t0 && t < t0 + 10 * 60e3).length,
      ate1h: ts.filter((t) => t >= t0 && t < t0 + 60 * 60e3).length,
      d1: ts.filter((t) => t >= t0 && t < carrinhoFecha.getTime()).length,
      total: ts.length,
    };
    for (let h = 6; h <= 21; h++) {
      porHoraBackend.push({
        hora: `${String(h).padStart(2, "0")}h`,
        vendas: backendTx.filter((c) => brDia(c.criado_em) === dia(d0, 7) && brHora(c.criado_em) === h).length,
      });
    }
  }
  const compradoresBackend = new Set(backendTx.map((c) => (c.email || "").toLowerCase()));
  const hots = [...intEmails.entries()].filter(([, t]) => t === "HOT").map(([e]) => e);
  const backend: Dados["backend"] = {
    produtoId: produtoBackend,
    fonte: fonteBackend,
    preco,
    vendas: vendasBackend,
    receita: receitaBackend,
    liquido: liquidoBackend,
    conv: vendasBackend !== null ? pct(vendasBackend, ingressos) : null,
    convPresentes: vendasBackend !== null && manual.presenca_a6 ? pct(vendasBackend, manual.presenca_a6) : null,
    convFichas: vendasBackend !== null && intEmails.size ? pct(vendasBackend, intEmails.size) : null,
    hotCompraram: fonteBackend === "hotmart" && hots.length ? pct(hots.filter((e) => compradoresBackend.has(e)).length, hots.length) : null,
    curva,
    porHora: porHoraBackend,
  };

  // ============================================================
  // FINANCEIRO
  // ============================================================
  const outros = manual.custos_extras ?? 0;
  const investimento = gasto + verbaDistrib + outros;
  const receitaBruta = receitaFront + (receitaBackend ?? 0);
  const receitaLiquida = liquidoFront + (liquidoBackend ?? 0);
  const roasAlvo = manual.roas_alvo ?? 3;
  const ticketMedioLiquido = div(liquidoFront, ingressos);
  const convBase = backend.conv !== null ? backend.conv / 100 : 0.07;
  const financeiro: Dados["financeiro"] = {
    investimento,
    trafego: gasto,
    distribuicao: verbaDistrib,
    outros,
    receitaBruta,
    receitaLiquida,
    lucro: receitaLiquida - investimento,
    roasTotal: div(receitaBruta, investimento),
    margem: pct(receitaLiquida - investimento, receitaBruta),
    cacMax: ticketMedioLiquido !== null ? (ticketMedioLiquido + convBase * preco) / roasAlvo : null,
    cacMaxBase: `(ticket médio líquido + ${(convBase * 100).toFixed(1).replace(".", ",")}% × R$${preco}) ÷ ROAS-alvo ${roasAlvo}${backend.conv === null ? " · conversão no piso de 7% até o carrinho abrir" : ""}`,
    roasAlvo,
  };

  const vendas: Dados["vendas"] = {
    ingressos,
    meta: manual.meta_ingressos ?? 100,
    receitaIngresso,
    liquidoIngresso,
    bumps,
    receitaFront,
    liquidoFront,
    ticketMedio: div(receitaFront, ingressos),
    ticketMedioLiquido,
    taxaPlataforma,
    pendentes,
    expirados,
    abandonos: abandonoEmails.size,
    recuperados,
    reembolsos,
    pedidosReembolso,
    chargebacks,
    cancelados,
    primeiroAcesso,
    porDia: [...porDiaMap.entries()].map(([d, n]) => ({ dia: d, dow: new Date(`${d}T12:00:00-03:00`).getUTCDay(), ingressos: n })),
    porHora,
    porPagina: [...porPagina.entries()].map(([variante, n]) => ({ variante, vendas: n })).sort((a, b) => b.vendas - a.vendas),
    origem,
    pagamento,
    roas: div(receitaFront, gasto),
    roasPago: div(receitaPaga, gasto),
    receitaPaga,
    roasLiquido: div(liquidoFront, gasto),
    cpa: div(gasto, ingressos),
  };

  const dados: Dados = {
    geradoEm: agora.toISOString(),
    ciclo: {
      d0,
      nome: ciclo.nome,
      indice: ciclo.indice,
      captIni: captIni.toISOString(),
      captFim: captFim.toISOString(),
      pitch: em(dia(d0, 6), "20:00").toISOString(),
      emCaptacao: agora >= captIni && agora <= captFim,
      emAula: agora >= ciclo.aulaIni && agora < ciclo.carrinhoFim,
      carrinhoAbre: carrinhoAbre.toISOString(),
      carrinhoFecha: carrinhoFecha.toISOString(),
      fase,
      proximo,
    },
    ciclos: cal.map((c) => ({ d0: c.d0, nome: c.nome, indice: c.indice })),
    fontes,
    manual,
    trafego,
    criativos,
    batelada,
    vendas,
    grupo,
    fichas,
    aulas,
    backend,
    financeiro,
    leitura: [],
    saude: { total: 0, areas: [] },
  };
  dados.leitura = ler(dados);
  dados.saude = saude(dados);
  return dados;
}

// ============================================================
// VEREDITO POR CRIATIVO (regras da aula 4)
// ============================================================
function veredito(c: {
  formato: string;
  imp: number;
  ctr: number;
  hook: number | null;
  hold: number | null;
  body: number | null;
  vendas: number;
  gasto: number;
}): Criativo["veredito"] {
  if (c.imp < IMPRESSOES_MIN_JULGAR) {
    return { rotulo: "Cedo", cor: "neutro", acao: `${c.imp.toLocaleString("pt-BR")} de 5.000 impressões. Não julgue ainda.` };
  }
  if (c.formato === "video") {
    const h = avaliar(REGUAS.hook_rate, c.hook);
    const ho = avaliar(REGUAS.hold_rate, c.hold);
    const b = avaliar(REGUAS.body_rate, c.body);
    const verm = [h, ho, b].filter((x) => x === "vermelho").length;
    if (c.vendas > 0 && verm === 0) return { rotulo: "Campeão", cor: "verde", acao: "Bate as 3 réguas e vende. Faça 5-10 hooks novos sobre este corpo." };
    if (h === "vermelho") return { rotulo: "Trocar gancho", cor: "vermelho", acao: "Hook abaixo de 20%. Troque só os primeiros segundos, mantenha o corpo." };
    if (ho === "vermelho") return { rotulo: "Mexer no corpo", cor: "vermelho", acao: "Hold abaixo de 5%. O meio do vídeo não segura." };
    if (b === "vermelho") return { rotulo: "Mexer no CTA", cor: "amarelo", acao: "Prende, mas não vende. Ajuste o final e o CTA." };
    return { rotulo: "Manter", cor: "amarelo", acao: "Dentro do piso. Deixe rodar e observe a média da semana." };
  }
  const ct = avaliar(REGUAS.ctr_estatico, c.ctr);
  if (c.vendas > 0 && ct !== "vermelho") return { rotulo: "Vendendo", cor: "verde", acao: "CTR no piso e já vendeu. Mantém." };
  if (c.ctr < 1) return { rotulo: "Pausar", cor: "vermelho", acao: "CTR abaixo de 1% com volume. Pause só este anúncio." };
  if (ct === "vermelho") return { rotulo: "Fraco", cor: "amarelo", acao: "CTR abaixo de 1,5% (piso do estático e carrossel)." };
  if (c.vendas === 0 && c.gasto > 60) return { rotulo: "Clica e não compra", cor: "amarelo", acao: "Gastou mais que um ingresso sem venda. Olhe a promessa contra a página." };
  return { rotulo: "Manter", cor: "verde", acao: "CTR saudável. Observe se converte." };
}

// ============================================================
// LEITURA DO ORION — o que está pegando e o que fazer
// ============================================================
function ler(d: Dados): Leitura[] {
  const L: Leitura[] = [];
  const f = d.ciclo.fase.id;
  const t = d.trafego;
  const v = d.vendas;
  const brl = (n: number) => `R$${n.toFixed(2).replace(".", ",")}`;
  const p = (n: number) => `${n.toFixed(1).replace(".", ",")}%`;

  if (!d.fontes.meta.ok) L.push({ nivel: "ruim", area: "Fontes", titulo: "Sem leitura da Meta", texto: d.fontes.meta.erro || "", acao: "Gerar um token novo de System User e atualizar o META_ADS_TOKEN na Vercel." });

  // meta de ingressos com projeção
  if (f === "captacao") {
    const restante = (new Date(d.ciclo.captFim).getTime() - Date.now()) / 86400e3;
    const ultimos = v.porDia.slice(-4, -1);
    const ritmo = ultimos.length ? ultimos.reduce((s, x) => s + x.ingressos, 0) / ultimos.length : 0;
    const proj = Math.round(v.ingressos + ritmo * Math.max(0, restante));
    const c = proj >= v.meta ? "bom" : proj >= v.meta * 0.7 ? "atencao" : "ruim";
    L.push({
      nivel: c,
      area: "Vendas",
      titulo: `Projeção: ~${proj} de ${v.meta} ingressos`,
      texto: `${v.ingressos} vendidos. No ritmo dos últimos 3 dias (${ritmo.toFixed(1).replace(".", ",")}/dia) o ciclo fecha em ~${proj}.`,
      acao: c === "bom" ? undefined : "Domingo vende ~2x o pior dia. Garanta verba e criativo vivo pro fim de semana.",
    });
  }

  if (t.gasto > 0 && v.roasPago !== null) {
    const r = v.roasPago;
    const rs = r.toFixed(2).replace(".", ",");
    const obs = `Só o que o anúncio trouxe (${t.vendasPagas} ingressos + bumps deles). Com a bio junto: ${(v.roas ?? 0).toFixed(2).replace(".", ",")}.`;
    const c = avaliar(REGUAS.roas_captacao, r);
    if (c === "vermelho") L.push({ nivel: "ruim", area: "Tráfego", titulo: `ROAS do anúncio em ${rs}`, texto: `Abaixo de 1: o ingresso não está pagando o tráfego. ${obs}`, acao: "Nunca escale prejuízo. Olhe primeiro o criativo, depois a página." });
    else if (c === "amarelo") L.push({ nivel: "atencao", area: "Tráfego", titulo: `ROAS do anúncio em ${rs}, abaixo do piso de 1,25`, texto: `O piso do método cobre imposto e taxa a partir de 1,25. ${obs}`, acao: "Uma otimização por semana: comece pelo criativo." });
    else if (r >= 1.8) L.push({ nivel: "bom", area: "Tráfego", titulo: `ROAS do anúncio em ${rs}: hora de escalar`, texto: `Acima de 1,8 o método manda duplicar a campanha. ${obs}`, acao: "Duplique e escale na cópia. Não mexa no original." });
    else L.push({ nivel: "bom", area: "Tráfego", titulo: `ROAS do anúncio em ${rs}`, texto: `Acima do piso de 1,25. ${obs}` });
  }
  if (t.verbaDia !== null && t.verbaDia < 100) L.push({ nivel: "atencao", area: "Tráfego", titulo: `Verba média de ${brl(t.verbaDia)}/dia`, texto: "O mínimo do método é R$100/dia por campanha.", acao: "Abaixo disso a Meta não acha comprador de ingresso." });
  if (t.connect !== null && t.cliquesLink > 100 && t.connect < 70) L.push({ nivel: "ruim", area: "Página", titulo: `Connect rate de ${p(t.connect)}`, texto: "De quem clica, menos de 70% vê a página. O problema não é o criativo.", acao: "Verifique velocidade e o redirecionamento da página." });
  if (t.convPagina !== null && t.lpv >= 300 && t.convPagina < 3) L.push({ nivel: "ruim", area: "Página", titulo: `Página convertendo ${p(t.convPagina)}`, texto: `Meta 5%. ${t.lpv} visitas pagas ${t.lpv < 5000 ? "(ainda abaixo das 5.000 que o método pede pra julgar)" : ""}.`, acao: "Teste 2 páginas novas por semana." });
  if (t.frequencia !== null && t.frequencia < 3 && t.gasto > 200) L.push({ nivel: "info", area: "Tráfego", titulo: `Frequência ${t.frequencia.toFixed(1).replace(".", ",")}`, texto: "O método busca acima de 5: são ~11 contatos antes de comprar.", acao: "Normal no começo. Se a escala travar, é a distribuição de conteúdo que sobe a frequência." });
  if (t.distribuicaoPct === null && t.gasto > 0) L.push({ nivel: "atencao", area: "Tráfego", titulo: "Verba de distribuição não lançada", texto: "O método põe 10-25% da verba em distribuir conteúdo. Desligar derrubou 30% da escala e 2 pontos de conversão.", acao: "Lance o gasto do impulsionamento em Lançar números." });
  else if (t.distribuicaoPct !== null && (t.distribuicaoPct < 10 || t.distribuicaoPct > 25)) L.push({ nivel: "atencao", area: "Tráfego", titulo: `Distribuição em ${p(t.distribuicaoPct)} da verba`, texto: "A faixa do método é 10% a 25%.", acao: "Ajuste 5 pontos por semana até achar o equilíbrio." });

  // criativos
  const dinheiroParado = d.criativos.filter((c) => c.impressoes >= IMPRESSOES_MIN_JULGAR && c.vendas === 0 && c.status === "ACTIVE");
  const gastoParado = dinheiroParado.reduce((s, c) => s + c.gasto, 0);
  const total = d.criativos.reduce((s, c) => s + c.gasto, 0);
  if (dinheiroParado.length && total > 0) L.push({ nivel: gastoParado / total > 0.4 ? "ruim" : "atencao", area: "Criativos", titulo: `${dinheiroParado.length} anúncios ativos sem venda`, texto: `Queimaram ${brl(gastoParado)} (${p((gastoParado / total) * 100)} da verba) já com volume pra julgar.`, acao: "Quem tá ruim sai. Puxe a verba pros campeões e faça variações de gancho deles." });
  const campeoes = d.criativos.filter((c) => c.veredito.rotulo === "Campeão" || c.veredito.rotulo === "Vendendo");
  if (campeoes.length) L.push({ nivel: "bom", area: "Criativos", titulo: `${campeoes.length} criativo${campeoes.length > 1 ? "s" : ""} vendendo`, texto: campeoes.slice(0, 3).map((c) => `${c.nome} (${c.vendas})`).join(" · "), acao: "1-2 campeões trazem 80% do resultado. Grave 5-10 hooks novos sobre eles." });
  if (d.batelada.ativos > 0 && d.batelada.ativos < 15) L.push({ nivel: "atencao", area: "Criativos", titulo: `${d.batelada.ativos} criativos ativos`, texto: `A batelada do método é 15 (5 estáticos, 5 vídeos, 5 carrosséis). Hoje: ${d.batelada.estatico} est · ${d.batelada.video} vid · ${d.batelada.carrossel} car.` });
  if (d.batelada.novos7d < 5 && f === "captacao") L.push({ nivel: "atencao", area: "Criativos", titulo: `${d.batelada.novos7d} criativos novos em 7 dias`, texto: "O método sobe 5 a 10 hooks novos por semana sobre os corpos validados." });

  // bumps
  for (const b of v.bumps) if (v.ingressos >= 20 && b.take !== null && b.take < 30) L.push({ nivel: "atencao", area: "Vendas", titulo: `Bump "${b.nome}" com ${p(b.take)} de take`, texto: "Abaixo de 30% depois de 20 vendas (referência complementar)." });
  if (v.pendentes > 0) L.push({ nivel: "info", area: "Vendas", titulo: `${v.pendentes} Pix/boleto gerado e não pago`, texto: "Pix não dispara bump nem upsell sozinho.", acao: "Recupere pelo WhatsApp em 15-40 min." });

  // grupo e fichas
  if (d.grupo.entradaPct !== null && d.grupo.entradaPct < 80 && v.ingressos > 0) L.push({ nivel: "atencao", area: "Grupo", titulo: `${p(d.grupo.entradaPct)} dos compradores no grupo`, texto: `${d.grupo.membros} no grupo para ${v.ingressos} ingressos. Quem não está no grupo não recebe o link da aula.`, acao: "Reenvie o passo 2 do onboarding a quem comprou e não entrou." });
  if (!d.fontes.evolution.ok && d.grupo.jid) L.push({ nivel: "atencao", area: "Grupo", titulo: "WhatsApp do grupo sem leitura", texto: d.fontes.evolution.erro || "", acao: "Reconectar a instância academy-suporte. Enquanto isso, lance o número de membros à mão." });
  if (d.fichas.matriculaPct !== null && v.ingressos >= 5 && d.fichas.matriculaPct < 50) L.push({ nivel: "atencao", area: "Fichas", titulo: `Ficha de matrícula em ${p(d.fichas.matriculaPct)}`, texto: `${d.fichas.matriculas} de ${v.ingressos} compradores. É o passo 1 do onboarding, antes do grupo.`, acao: "Mande a ficha antes de explicar o evento: explicar primeiro faz a pessoa ignorar o resto." });
  if (["aulas", "sabado", "pitch", "carrinho", "pos"].includes(f) && d.fichas.interessePct !== null && d.fichas.interesse.total > 0) {
    const c = avaliar(REGUAS.ficha_interesse, d.fichas.interessePct);
    L.push({ nivel: c === "verde" ? "bom" : "ruim", area: "Fichas", titulo: `Ficha de interesse em ${p(d.fichas.interessePct)}`, texto: `${d.fichas.interesse.total} fichas ${d.fichas.interesseBase}. Mínimo 25%. HOT ${d.fichas.interesse.hot} · WARM ${d.fichas.interesse.warm} · COLD ${d.fichas.interesse.cold}.`, acao: c === "verde" ? undefined : "Repitch da ficha na Aula 5, com o benefício do carrinho às 6h50." });
  }

  // aulas
  const a1 = d.aulas[0];
  if (a1.presencaPct !== null) {
    const c = avaliar(REGUAS.presenca_a1, a1.presencaPct);
    L.push({ nivel: c === "verde" ? "bom" : c === "amarelo" ? "info" : "ruim", area: "Aulas", titulo: `Aula 1 com ${p(a1.presencaPct)} ao vivo`, texto: "O mínimo é 30% dos compradores (à noite o método mede ~50%)." });
  } else if (["aulas", "sabado", "pitch", "carrinho", "pos"].includes(f)) {
    L.push({ nivel: "atencao", area: "Aulas", titulo: "Presença da Aula 1 não lançada", texto: "Sem esse número não dá pra ler a curva da semana.", acao: "Lance o pico ao vivo do YouTube em Lançar números." });
  }
  for (const a of d.aulas.slice(1)) {
    if (a.retencao !== null && a.retencaoMeta !== null && a.retencao < a.retencaoMeta - 5) L.push({ nivel: "atencao", area: "Aulas", titulo: `${a.rotulo}: retenção de ${p(a.retencao)}`, texto: `Esperado ~${p(a.retencaoMeta)} da aula anterior.` });
    if (a.duracao !== null && a.duracao > (a.n === 4 ? 75 : 50)) L.push({ nivel: "atencao", area: "Aulas", titulo: `${a.rotulo} com ${a.duracao} min`, texto: "Passou de 50 min perde retenção e replay (a Aula 4 vai até 60 + 15)." });
  }

  // backend
  if (d.backend.conv !== null) {
    const cv = d.backend.conv;
    L.push(
      cv < 5
        ? { nivel: "ruim", area: "Formação", titulo: `Conversão de ${p(cv)}`, texto: "Abaixo de 5% o método manda jogar o evento fora.", acao: "Regrave as aulas (comece pela 4 e pela apresentação)." }
        : cv < 7
          ? { nivel: "atencao", area: "Formação", titulo: `Conversão de ${p(cv)}`, texto: "Entre 5% e 7%: ainda não valida a gravação." }
          : { nivel: "bom", area: "Formação", titulo: `Conversão de ${p(cv)}`, texto: cv >= 10 ? "Acima de 10%: o alvo do método." : "Acima do piso de 7%: gravação validada." },
    );
  } else if (f === "carrinho" || f === "pos") {
    L.push({ nivel: "atencao", area: "Formação", titulo: "Vendas da Formação sem fonte", texto: "O produto ainda não está ligado ao painel.", acao: "Informe o ID do produto na Hotmart (ou as vendas) em Lançar números." });
  }
  if (d.backend.curva && d.backend.curva.total >= 5) {
    const h1 = (d.backend.curva.ate1h / d.backend.curva.total) * 100;
    if (h1 < 70) L.push({ nivel: "atencao", area: "Formação", titulo: `${p(h1)} das vendas na 1ª hora`, texto: "O carrinho bom faz 70% nos 10 primeiros minutos e 90% na 1ª hora.", acao: "A escada de bônus (6h50 / 7h / 8h / 10h) não está gerando urgência." });
  }

  // financeiro
  if (f === "pos" && d.financeiro.lucro < 0) L.push({ nivel: "ruim", area: "Financeiro", titulo: `Prejuízo de ${brl(-d.financeiro.lucro)}`, texto: "O ROAS do lançamento inteiro ficou negativo." });

  const ordem = { ruim: 0, atencao: 1, info: 2, bom: 3 };
  return L.sort((a, b) => ordem[a.nivel] - ordem[b.nivel]);
}

// Score de saúde (fórmula complementar: 100 − 15 por vermelho − 5 por amarelo, por área)
function saude(d: Dados): Dados["saude"] {
  const areas: Record<string, Cor[]> = {
    Tráfego: [
      avaliar(REGUAS.roas_captacao, d.vendas.roasPago),
      avaliar(REGUAS.cpa_ingresso, d.vendas.cpa),
      avaliar(REGUAS.cpm, d.trafego.cpm),
      avaliar(REGUAS.verba_dia, d.trafego.verbaDia),
    ],
    Página: [
      avaliar(REGUAS.connect_rate, d.trafego.connect),
      avaliar(REGUAS.conv_pagina, d.trafego.convPagina),
      avaliar(REGUAS.pagina_checkout, d.trafego.pagCheckout),
    ],
    Criativos: [avaliar(REGUAS.batelada, d.batelada.ativos), avaliar(REGUAS.hooks_novos, d.batelada.novos7d)],
    Vendas: [avaliar(REGUAS.ingressos, d.vendas.ingressos), ...d.vendas.bumps.map((b) => (d.vendas.ingressos >= 20 ? avaliar(REGUAS.take_bump, b.take) : "neutro" as Cor))],
    Aulas: [avaliar(REGUAS.presenca_a1, d.aulas[0].presencaPct)],
    Fichas: [avaliar(REGUAS.ficha_interesse, d.fichas.interesse.total ? d.fichas.interessePct : null)],
    Formação: [avaliar(REGUAS.conv_backend, d.backend.conv)],
  };
  const lista = Object.entries(areas)
    .map(([area, cores]) => {
      const avaliadas = cores.filter((c) => c !== "neutro");
      const vermelhos = cores.filter((c) => c === "vermelho").length;
      const amarelos = cores.filter((c) => c === "amarelo").length;
      return { area, nota: avaliadas.length ? Math.max(0, 100 - vermelhos * 15 - amarelos * 5) : -1, vermelhos, amarelos };
    })
    .filter((a) => a.nota >= 0);
  const total = lista.length ? Math.round(lista.reduce((s, a) => s + a.nota, 0) / lista.length) : 0;
  return { total, areas: lista };
}

// Resumo de um ciclo para a aba Comparativo (planilha de semanas do método)
export function resumir(d: Dados): Resumo {
  return {
    d0: d.ciclo.d0,
    nome: d.ciclo.nome,
    ingressos: d.vendas.ingressos,
    gasto: r2(d.trafego.gasto),
    roas: d.vendas.roas,
    roasPago: d.vendas.roasPago,
    cpa: d.vendas.cpa,
    cpm: d.trafego.cpm,
    ctr: d.trafego.ctr,
    connect: d.trafego.connect,
    pagCheckout: d.trafego.pagCheckout,
    checkoutCompra: d.trafego.checkoutCompra,
    convPagina: d.trafego.convPagina,
    presencaA1: d.aulas[0].presencaPct,
    ficha: d.fichas.interesse.total ? d.fichas.interessePct : null,
    convBackend: d.backend.conv,
    lucro: d.financeiro.investimento > 0 ? d.financeiro.lucro : null,
  };
}
