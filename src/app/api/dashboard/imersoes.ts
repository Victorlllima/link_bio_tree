// ============================================================
// IMERSÕES — números de uma edição (Meta ao vivo + Hotmart pelo banco) e comparação evento a evento.
// Config por edição em src/app/dashboard/imersoes.ts. Tudo roda no servidor: o token nunca vai ao cliente.
// ============================================================
import { EDICOES, type EdicaoCfg } from "@/app/dashboard/imersoes";
import type { GrupoCriativo, CriativoImersao, DadosImersao, DiaImersao, EventoSerie, LoteImersaoRes, RespComparacaoEventos, Fonte } from "@/app/dashboard/tipos";
import { montar, type CicloCal } from "./montar";

const SB = "https://supabase.redpro.com.br/rest/v1";
const GRAPH = "https://graph.facebook.com/v21.0";
const AD_ACCOUNT = "961901509283620";
const APROV = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);

const num = (v: unknown) => (v === undefined || v === null || v === "" ? 0 : Number(v) || 0);
const dia = (d: string, n: number) => {
  const x = new Date(`${d}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
const diff = (a: string, b: string) => Math.round((Date.parse(`${a}T12:00:00Z`) - Date.parse(`${b}T12:00:00Z`)) / 86400e3);
const brDia = (iso: string | Date) => new Date(new Date(iso).getTime() - 3 * 3600e3).toISOString().slice(0, 10);
const div = (a: number, b: number) => (b > 0 ? a / b : null);

async function sb<T>(path: string): Promise<T> {
  const k = process.env.SUPABASE_SERVICE_KEY!;
  const r = await fetch(`${SB}/${path}`, { headers: { apikey: k, Authorization: `Bearer ${k}` }, cache: "no-store" });
  if (!r.ok) throw new Error(`${path.split("?")[0]}: ${r.status}`);
  return r.json();
}

type Linha = Record<string, unknown>;
async function graph(path: string): Promise<Linha[]> {
  const token = process.env.META_ADS_TOKEN;
  if (!token) throw new Error("META_ADS_TOKEN não configurado");
  const out: Linha[] = [];
  let url: string | undefined = `${GRAPH}/${path}${path.includes("?") ? "&" : "?"}access_token=${token}`;
  for (let i = 0; url && i < 10; i++) {
    const r: Response = await fetch(url, { next: { revalidate: 90 } });
    const j = await r.json();
    if (j.error) throw new Error(j.error.code === 190 ? "o token da Meta expirou" : `Meta: ${j.error.message}`);
    out.push(...(j.data || []));
    url = j.paging?.next;
  }
  return out;
}
const acao = (r: Linha, tipo: string) => num(((r.actions as { action_type: string; value: string }[] | undefined) || []).find((a) => a.action_type === tipo)?.value);
const LPV = "landing_page_view";
const IC = "offsite_conversion.fb_pixel_initiate_checkout";
const COMPRA = "offsite_conversion.fb_pixel_purchase";

interface Compra {
  transacao: string;
  evento: string;
  produto_id: string;
  email: string | null;
  valor: number | null;
  criado_em: string;
  origem: Record<string, unknown> | null;
  comissoes: { source: string; value: number }[] | null;
}

export function edicaoPorId(id: string | null): EdicaoCfg {
  return EDICOES.find((e) => e.id === id) ?? EDICOES[EDICOES.length - 1];
}

const loteDoDia = (ed: EdicaoCfg, d: string) => ed.lotes.find((l) => d >= l.ini && (l.fim === null || d <= l.fim))?.n ?? null;

// O sck do ingresso tem duas formas (decisão do Red, 06/11):
//  - antiga: im-A-<nome do criativo> (ex.: im-A-car-case-ao-vivo). Soma conjuntos (Q+F): vira venda de CRIATIVO.
//  - nova (a partir de 13/11): im-A-<ad.name> (ex.: im-A-Q_car-case-ao-vivo_sp). Casa com UM anúncio: vira venda de ANÚNCIO.
// Fallback legado: ID numérico do anúncio em qualquer campo da origem. Sem casar, fica "anúncio sem criativo".
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
// chave do criativo: tira o prefixo de conjunto (Q_, F_) e o sufixo _sp do nome do anúncio
export const chaveCriativo = (nome: string) => norm(nome.toLowerCase().replace(/^im-a-/, "").replace(/^[a-z]_/, "").replace(/_sp$/, ""));

type Atrib = { tipo: "anuncio" | "criativo" | "anuncio-sem-criativo" | "outra"; adId: string | null; chave: string | null };
function atribuir(origem: Record<string, unknown> | null, ads: Map<string, string>, porNome: Map<string, string[]>, grupos: Set<string>, campanhaId: string): Atrib {
  if (!origem) return { tipo: "outra", adId: null, chave: null };
  const valores = Object.values(origem).filter((v): v is string => typeof v === "string" && !!v);
  const texto = valores.join(" ");
  for (const m of texto.match(/\d{12,}/g) || []) if (ads.has(m)) return { tipo: "anuncio", adId: m, chave: null };
  for (const v of valores) {
    let cru = v;
    try { cru = decodeURIComponent(v.replace(/\+/g, " ")); } catch {}
    const hit = porNome.get(norm(cru.replace(/^im-a-/i, "")));
    if (hit?.length === 1) return { tipo: "anuncio", adId: hit[0], chave: null }; // nome do anúncio único: venda do anúncio
    const ch = chaveCriativo(cru);
    if (ch && grupos.has(ch)) return { tipo: "criativo", adId: null, chave: ch }; // nome repetido em conjuntos ou forma antiga
  }
  const sck = String(origem.sck || "");
  if (/^im-/i.test(sck) || texto.includes(campanhaId)) return { tipo: "anuncio-sem-criativo", adId: null, chave: null };
  return { tipo: "outra", adId: null, chave: null };
}

export async function montarImersao(id: string | null): Promise<DadosImersao> {
  const ed = edicaoPorId(id);
  const agora = new Date();
  const hoje = brDia(agora);
  const fechaDia = brDia(ed.carrinhoFecha);
  const until = hoje < fechaDia ? hoje : fechaDia;
  const fontes: { meta: Fonte; hotmart: Fonte } = { meta: { ok: true }, hotmart: { ok: true } };

  const prodIds = [ed.produtos.ingresso, ...ed.produtos.bumps.map((b) => b.id)];
  const sel =
    "transacao,evento,produto_id,email,valor,criado_em,origem:payload->data->purchase->origin,comissoes:payload->data->commissions";
  const tr = encodeURIComponent(JSON.stringify({ since: ed.gastoIni, until }));
  const filtroCamp = encodeURIComponent(JSON.stringify([{ field: "campaign.id", operator: "EQUAL", value: ed.campanha.id }]));
  const insAd = `act_${AD_ACCOUNT}/insights?level=ad&time_range=${tr}&filtering=${filtroCamp}&fields=ad_id,ad_name,adset_id,adset_name,spend,impressions,inline_link_clicks,actions&limit=500`;

  const [compras, diarioRaw, adsInsRaw, adsInfoRaw] = await Promise.all([
    sb<Compra[]>(`hotmart_compras?select=${sel}&produto_id=in.(${prodIds.join(",")})&criado_em=gte.${encodeURIComponent(`${dia(ed.captacaoIni, -1)}T00:00:00Z`)}&order=criado_em.asc&limit=10000`).catch((e) => {
      fontes.hotmart = { ok: false, erro: String(e.message || e) };
      return [] as Compra[];
    }),
    ed.gastoIni <= until
      ? graph(`act_${AD_ACCOUNT}/insights?level=campaign&time_increment=1&time_range=${tr}&fields=campaign_id,spend,impressions,inline_link_clicks,actions&limit=1000`).catch((e) => {
          fontes.meta = { ok: false, erro: String(e.message || e) };
          return [] as Linha[];
        })
      : Promise.resolve([] as Linha[]),
    ed.gastoIni <= until ? graph(insAd).catch(() => [] as Linha[]) : Promise.resolve([] as Linha[]),
    graph(`${ed.campanha.id}/ads?fields=id,name,effective_status,adset%7Bid,name%7D,creative.thumbnail_width(300).thumbnail_height(300)%7Bthumbnail_url%7D&limit=200`).catch(() => [] as Linha[]),
  ]);

  // ---------- anúncios ----------
  const nomeAd = new Map<string, string>();
  const porNome = new Map<string, string[]>();
  const regNome = (id: string, nome: string) => {
    nomeAd.set(id, nome);
    const k = norm(nome);
    const l = porNome.get(k) ?? [];
    if (!l.includes(id)) porNome.set(k, [...l, id]);
  };
  for (const a of adsInfoRaw) regNome(String(a.id), String(a.name));
  for (const r of adsInsRaw) regNome(String(r.ad_id), String(r.ad_name));
  const grupos = new Set([...nomeAd.values()].map(chaveCriativo));

  // ---------- vendas (Hotmart) ----------
  const aprov = (prod: string) => {
    const m = new Map<string, Compra>();
    for (const c of compras) {
      if (c.produto_id !== prod || !APROV.has(c.evento)) continue;
      const k = c.transacao || `${c.email}-${c.criado_em}`;
      if (!m.has(k)) m.set(k, c);
    }
    return [...m.values()].filter((c) => brDia(c.criado_em) >= ed.captacaoIni && brDia(c.criado_em) <= fechaDia);
  };
  const ingressosTx = aprov(ed.produtos.ingresso);
  // Os bumps 50 casos, Segundo cérebro e 100 plugins também são vendidos em outros produtos. Só entram os pedidos
  // de quem comprou o ingresso desta edição (mesmo e-mail, até 1 dia de diferença). A Gravação é exclusiva da edição.
  const compradores = new Map<string, number[]>();
  for (const c of ingressosTx) {
    const e = (c.email || "").toLowerCase();
    if (e) compradores.set(e, [...(compradores.get(e) || []), Date.parse(c.criado_em)]);
  }
  const doIngresso = (c: Compra) => (compradores.get((c.email || "").toLowerCase()) || []).some((ts) => Math.abs(Date.parse(c.criado_em) - ts) <= 86400e3);
  const bumpsTx = ed.produtos.bumps.map((b) => ({ b, tx: aprov(b.id).filter((c) => (b.exclusivo ? true : doIngresso(c))) }));
  const liq = (c: Compra, preco: number) => {
    const p = c.comissoes?.find((x) => x.source === "PRODUCER");
    return p ? Number(p.value) : preco * 0.86;
  };

  const vendasPorAd = new Map<string, number>();
  const vendasPorGrupo = new Map<string, number>(); // venda só de criativo (forma antiga ou nome repetido): não separa conjunto
  let vendasAnuncio = 0;
  let semCriativo = 0;
  const tipoDe = new Map<string, "anuncio" | "anuncio-sem-criativo" | "outra">();
  for (const c of ingressosTx) {
    const a = atribuir(c.origem, nomeAd, porNome, grupos, ed.campanha.id);
    tipoDe.set(c.transacao, a.tipo === "criativo" ? "anuncio" : a.tipo);
    if (a.tipo === "anuncio" && a.adId) {
      vendasAnuncio++;
      vendasPorAd.set(a.adId, (vendasPorAd.get(a.adId) || 0) + 1);
    } else if (a.tipo === "criativo" && a.chave) {
      vendasAnuncio++;
      vendasPorGrupo.set(a.chave, (vendasPorGrupo.get(a.chave) || 0) + 1);
    } else if (a.tipo === "anuncio-sem-criativo") semCriativo++;
  }

  // ---------- série por dia ----------
  const dias = new Map<string, DiaImersao>();
  const novoDia = (d: string): DiaImersao => ({
    dia: d, dn: diff(d, ed.noite1), lote: loteDoDia(ed, d),
    gasto: 0, impressoes: 0, cliquesLink: 0, lpv: 0, ic: 0, compraPixel: 0,
    vendas: 0, vendasAnuncio: 0, receita: 0, receitaBumps: 0, bumps: 0,
  });
  const pega = (d: string) => dias.get(d) ?? (dias.set(d, novoDia(d)), dias.get(d)!);
  for (let d = ed.captacaoIni; d <= until; d = dia(d, 1)) pega(d);
  for (const r of diarioRaw) {
    if (String(r.campaign_id) !== ed.campanha.id) continue;
    const x = pega(String(r.date_start));
    x.gasto += num(r.spend);
    x.impressoes += num(r.impressions);
    x.cliquesLink += num(r.inline_link_clicks);
    x.lpv += acao(r, LPV);
    x.ic += acao(r, IC);
    x.compraPixel += acao(r, COMPRA);
  }
  for (const c of ingressosTx) {
    const x = pega(brDia(c.criado_em));
    x.vendas++;
    if (tipoDe.get(c.transacao) !== "outra") x.vendasAnuncio++;
    x.receita += num(c.valor) || ed.precoIngressoPadrao;
  }
  for (const { b, tx } of bumpsTx) {
    for (const c of tx) {
      const x = pega(brDia(c.criado_em));
      x.bumps++;
      x.receitaBumps += num(c.valor) || b.preco;
    }
  }
  const serie = [...dias.values()].sort((a, b) => a.dia.localeCompare(b.dia));

  // ---------- lotes ----------
  const lotes: LoteImersaoRes[] = ed.lotes.map((l) => {
    const xs = serie.filter((s) => s.lote === l.n);
    const soma = (k: keyof DiaImersao) => xs.reduce((s, x) => s + (x[k] as number), 0);
    const gasto = soma("gasto"), vendas = soma("vendas"), receita = soma("receita"), rb = soma("receitaBumps"), lpv = soma("lpv");
    return {
      n: l.n, preco: l.preco, ini: l.ini, fim: l.fim, atual: hoje >= l.ini && (l.fim === null || hoje <= l.fim),
      dias: xs.length, gasto, impressoes: soma("impressoes"), cliquesLink: soma("cliquesLink"), lpv, ic: soma("ic"),
      vendas, receita, receitaBumps: rb, bumps: soma("bumps"),
      cpa: div(gasto, vendas), roas: div(receita + rb, gasto), taxaBump: vendas ? (soma("bumps") / vendas) * 100 : null,
      convPagina: lpv ? (vendas / lpv) * 100 : null,
    };
  });

  // ---------- criativos ----------
  const m = ed.metas;
  const infoPorId = new Map(adsInfoRaw.map((a) => [String(a.id), a]));
  const ids = new Set<string>([...adsInsRaw.map((r) => String(r.ad_id)), ...adsInfoRaw.map((a) => String(a.id))]);
  const insPorId = new Map(adsInsRaw.map((r) => [String(r.ad_id), r]));
  const criativos: CriativoImersao[] = [...ids].map((adId) => {
    const r = insPorId.get(adId) ?? {};
    const info = infoPorId.get(adId) as Linha | undefined;
    const adset = (info?.adset as Linha | undefined)?.name ?? r.adset_name ?? "?";
    const thumb = ((info?.creative as Linha | undefined)?.thumbnail_url as string | undefined) ?? null;
    const status = String(info?.effective_status ?? "?");
    const gasto = num(r.spend), imp = num(r.impressions), cl = num(r.inline_link_clicks);
    const lpv = acao(r, LPV), ic = acao(r, IC), vp = acao(r, COMPRA);
    const vendas = vendasPorAd.get(adId) || 0;
    const chave = chaveCriativo(nomeAd.get(adId) ?? adId);
    const naoSep = vendasPorGrupo.get(chave) || 0; // venda do criativo que não dá para separar por anúncio
    const ctr = imp ? (100 * cl) / imp : null;
    const motivos: string[] = [];
    const ativo = status === "ACTIVE";
    if (status === "DISAPPROVED" || status === "WITH_ISSUES") motivos.push(`reprovado ou com problema (${status})`);
    else if (ativo && imp === 0) motivos.push("sem entrega (0 impressões)");
    else if (imp >= m.impMinJulgar && ctr !== null && ctr < m.ctrMinLink) motivos.push(`CTR do link ${ctr.toFixed(2)}% abaixo de ${m.ctrMinLink}% com ${Math.round(imp)} impressões`);
    if (naoSep > 0) { /* venda do criativo não separa o anúncio: o corte por venda vale só no criativo */ }
    else if (gasto >= m.cpaCorte && vendas === 0) motivos.push(`gastou R$ ${gasto.toFixed(0)} (corte R$ ${m.cpaCorte}) sem venda no banco`);
    else if (vendas > 0 && gasto / vendas > m.cpaCorte) motivos.push(`CPA R$ ${(gasto / vendas).toFixed(0)} acima do corte de R$ ${m.cpaCorte}`);
    return {
      adId, nome: nomeAd.get(adId) ?? adId, conjunto: String(adset), status, thumb, gasto, impressoes: imp, cliquesLink: cl,
      ctr, cpc: div(gasto, cl), lpv, custoLpv: div(gasto, lpv), ic, vendas, chave, vendasPixel: vp, cpa: div(gasto, vendas),
      cortar: ativo && motivos.length > 0, motivos,
    };
  }).filter((c) => c.gasto > 0 || c.status === "ACTIVE");

  // ---------- criativos agrupados (Q+F somados) ----------
  const porChave = new Map<string, CriativoImersao[]>();
  for (const c of criativos) porChave.set(c.chave, [...(porChave.get(c.chave) || []), c]);
  const criativosAgrupados: GrupoCriativo[] = [...porChave.entries()].map(([chave, ads]) => {
    const soma = (f: (c: CriativoImersao) => number) => ads.reduce((t, c) => t + f(c), 0);
    const gasto = soma((c) => c.gasto), lpv = soma((c) => c.lpv);
    const vendasAd = soma((c) => c.vendas), vendasCriativo = vendasPorGrupo.get(chave) || 0, vendas = vendasAd + vendasCriativo;
    return {
      chave, nome: ads.map((c) => c.nome.replace(/^[A-Za-z]_/, "").replace(/_sp$/i, "")).sort((a, b) => a.length - b.length)[0],
      anuncios: ads.length, ativos: ads.filter((c) => c.status === "ACTIVE").length, gasto, impressoes: soma((c) => c.impressoes),
      cliquesLink: soma((c) => c.cliquesLink), lpv, ic: soma((c) => c.ic), vendas, vendasPorAnuncio: vendasAd, vendasPorCriativo: vendasCriativo,
      cpa: div(gasto, vendas), custoLpv: div(gasto, lpv),
    };
  }).sort((a, b) => b.gasto - a.gasto);

  // ---------- conjuntos ----------
  const conjuntos = ed.campanha.conjuntos.map((cj) => {
    const rs = adsInsRaw.filter((r) => String(r.adset_id) === cj.id);
    const s = (f: (r: Linha) => number) => rs.reduce((t, r) => t + f(r), 0);
    const gasto = s((r) => num(r.spend));
    const vendas = criativos.filter((c) => rs.some((r) => String(r.ad_id) === c.adId)).reduce((t, c) => t + c.vendas, 0); // só venda separada por anúncio
    return { id: cj.id, nome: cj.nome, gasto, impressoes: s((r) => num(r.impressions)), cliquesLink: s((r) => num(r.inline_link_clicks)), lpv: s((r) => acao(r, LPV)), ic: s((r) => acao(r, IC)), vendas, cpa: div(gasto, vendas) };
  });

  // ---------- totais ----------
  const T = (k: keyof DiaImersao) => serie.reduce((s, x) => s + (x[k] as number), 0);
  const gasto = T("gasto"), imp = T("impressoes"), cl = T("cliquesLink"), lpv = T("lpv"), ic = T("ic");
  const vendas = ingressosTx.length;
  const receita = T("receita"), receitaBumps = T("receitaBumps");
  const liquido = ingressosTx.reduce((s, c) => s + liq(c, ed.precoIngressoPadrao), 0) + bumpsTx.reduce((s, { b, tx }) => s + tx.reduce((t, c) => t + liq(c, b.preco), 0), 0);
  const ev = (nome: string) => new Set(compras.filter((c) => c.produto_id === ed.produtos.ingresso && c.evento === nome).map((c) => c.transacao));
  const aprovTx = new Set(ingressosTx.map((c) => c.transacao));
  const reembolsos = [...ev("PURCHASE_REFUNDED")].filter((t) => aprovTx.has(t)).length;
  const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : null);
  const bumps = bumpsTx.map(({ b, tx }) => ({ id: b.id, nome: b.nome, preco: b.preco, vendas: tx.length, take: pct(tx.length, vendas), receita: tx.reduce((s, c) => s + (num(c.valor) || b.preco), 0) }));

  const ate = (d: string) => (d < ed.noite1 ? "captação" : d <= ed.noite2 ? "evento" : hoje <= fechaDia ? "carrinho" : "encerrado");
  const dnHoje = diff(hoje, ed.noite1);
  const fase = hoje < ed.captacaoIni
    ? { rotulo: "Antes da captação", detalhe: `venda do ingresso abre em ${ed.captacaoIni.slice(8)}/${ed.captacaoIni.slice(5, 7)}` }
    : { rotulo: ate(hoje) === "captação" ? "Captação" : ate(hoje) === "evento" ? "Evento" : ate(hoje) === "carrinho" ? "Carrinho aberto" : "Encerrada", detalhe: dnHoje < 0 ? `faltam ${-dnHoje} dias para a noite 1` : dnHoje === 0 ? "noite 1 hoje" : `D+${dnHoje}` };

  return {
    geradoEm: agora.toISOString(),
    edicao: { id: ed.id, nome: ed.nome, numero: ed.numero, noite1: ed.noite1, noite2: ed.noite2, carrinhoFecha: ed.carrinhoFecha },
    edicoes: EDICOES.map((e) => ({ id: e.id, nome: e.nome, numero: e.numero })),
    fontes,
    metas: ed.metas,
    fase: { ...fase, dnHoje },
    total: {
      gasto, impressoes: imp, cliquesLink: cl, lpv, ic, compraPixel: T("compraPixel"), vendas, vendasAnuncio, vendasAnuncioSemCriativo: semCriativo,
      vendasOutras: vendas - vendasAnuncio - semCriativo, receita, receitaBumps, receitaTotal: receita + receitaBumps, liquido,
      cpa: div(gasto, vendas), cpaAnuncio: div(gasto, vendasAnuncio + semCriativo), roas: div(receita + receitaBumps, gasto),
      roasAnuncio: div(ingressosTx.filter((c) => tipoDe.get(c.transacao) !== "outra").reduce((s, c) => s + (num(c.valor) || ed.precoIngressoPadrao), 0), gasto), ctr: pct(cl, imp), cpm: imp ? (gasto / imp) * 1000 : null, connect: pct(lpv, cl), convPagina: pct(vendas, lpv),
      pagCheckout: pct(ic, lpv), checkoutCompra: pct(vendas, ic), taxaBump: pct(bumps.reduce((s, b) => s + b.vendas, 0), vendas),
      pendentes: new Set(compras.filter((c) => c.produto_id === ed.produtos.ingresso && c.evento === "PURCHASE_BILLET_PRINTED" && !aprovTx.has(c.transacao)).map((c) => c.transacao)).size,
      reembolsos,
    },
    bumps, serie, lotes, conjuntos,
    criativos: criativos.sort((a, b) => b.gasto - a.gasto),
    criativosAgrupados,
  };
}

// ---------- comparação evento a evento ----------
export async function compararEventos(cal: CicloCal[], edicaoAtual: string | null): Promise<RespComparacaoEventos> {
  const eds = await Promise.all(EDICOES.map((e) => montarImersao(e.id)));
  const eventos: EventoSerie[] = eds.map((d) => ({
    id: d.edicao.id, nome: d.edicao.nome, tipo: "imersao", d0: d.edicao.noite1, atual: d.edicao.id === edicaoAtual,
    dias: d.serie.map((s) => ({ dn: s.dn, gasto: s.gasto, impressoes: s.impressoes, cliquesLink: s.cliquesLink, lpv: s.lpv, ic: s.ic, ingressos: s.vendas, receita: s.receita })),
  }));
  const hws = await Promise.all(cal.map((c) => montar(c.d0, { leve: true, cal })));
  for (const h of hws) {
    eventos.push({
      id: `hw-${h.ciclo.d0}`, nome: `Hermes Week · ${h.ciclo.nome}`, tipo: "hermes-week", d0: h.ciclo.d0, atual: false,
      dias: h.trafego.serie.map((s) => ({ dn: diff(s.dia, h.ciclo.d0), gasto: s.gasto, impressoes: s.impressoes, cliquesLink: s.cliquesLink, lpv: s.lpv, ic: s.ic, ingressos: s.ingressos, receita: s.receita })),
    });
  }
  const atual = eds.find((d) => d.edicao.id === edicaoAtual) ?? eds[eds.length - 1];
  return { geradoEm: new Date().toISOString(), dnHoje: atual ? atual.fase.dnHoje : null, eventos };
}
