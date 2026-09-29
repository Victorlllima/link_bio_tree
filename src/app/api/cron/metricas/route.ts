import { NextResponse } from "next/server";

// ============================================================
// CRON: atualiza as métricas de tráfego automaticamente 2x/dia.
// Chamado pelo Vercel Cron (ver vercel.json). Reusa a mesma lógica
// do botão "Atualizar agora", mas sem depender do cookie de login —
// a proteção aqui é o header Authorization com o CRON_SECRET.
//
// A Vercel envia automaticamente "Authorization: Bearer <CRON_SECRET>"
// nas chamadas de cron quando CRON_SECRET está nas env vars.
//
// IMPORTANTE (corrigido 28/09/2026): antes esta rota lia só UMA campanha
// fixa (o "IAA" antigo). Quando aquela campanha parou de rodar, o snapshot
// diário (traf_snapshots) parou de gravar em silêncio — ninguém percebeu
// porque os criativos (traf_criativos) continuaram vindo por outro caminho.
// Agora a rota descobre sozinha QUALQUER campanha com atividade no dia,
// então o próximo ciclo (nova campanha) entra automaticamente, sem editar código.
// ============================================================

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUPABASE_URL = "https://supabase.redpro.com.br";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const META_TOKEN = process.env.META_ADS_TOKEN;
const CRON_SECRET = process.env.CRON_SECRET;
const AD_ACCOUNT = "961901509283620";
const GRAPH = "https://graph.facebook.com/v21.0";

const sbHeaders = {
  "Content-Type": "application/json",
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
};

function hojeBR(): string {
  const br = new Date(Date.now() - 3 * 60 * 60 * 1000);
  return br.toISOString().slice(0, 10);
}

function acao(actions: Array<{ action_type: string; value: string }> | undefined, tipo: string): number {
  if (!actions) return 0;
  const a = actions.find((x) => x.action_type === tipo);
  return a ? Number(a.value) : 0;
}

// Busca a miniatura de cada anúncio (ad_id → creative_id → image_url).
// As URLs da fbcdn expiram, por isso re-buscamos a cada atualização.
// Resiliente: um creative com erro não derruba os outros.
async function buscarThumbs(adIds: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  if (!adIds.length) return out;
  try {
    const rAds = await fetch(
      `${GRAPH}/act_${AD_ACCOUNT}/ads?fields=id,creative&limit=200&access_token=${META_TOKEN}`,
      { cache: "no-store" }
    );
    const jAds = await rAds.json();
    if (jAds.error) {
      console.error("[CRON thumbs] erro ao listar ads:", jAds.error.message);
      return out;
    }
    const adToCreative: Record<string, string> = {};
    for (const a of jAds.data || []) {
      if (a.creative?.id && adIds.includes(String(a.id))) adToCreative[String(a.id)] = a.creative.id;
    }
    const cids = [...new Set(Object.values(adToCreative))];
    if (!cids.length) return out;

    // batch de até 50 por vez — um lote ruim não zera os outros
    for (let i = 0; i < cids.length; i += 50) {
      const lote = cids.slice(i, i + 50);
      try {
        const rCr = await fetch(
          `${GRAPH}/?ids=${lote.join(",")}&fields=thumbnail_url,image_url&access_token=${META_TOKEN}`,
          { cache: "no-store" }
        );
        const jCr = await rCr.json();
        if (jCr.error) {
          console.error("[CRON thumbs] erro no lote:", jCr.error.message);
          continue;
        }
        for (const [adId, cId] of Object.entries(adToCreative)) {
          const c = jCr[cId];
          if (c) out[adId] = c.image_url || c.thumbnail_url;
        }
      } catch (e) {
        console.error("[CRON thumbs] erro no lote:", e);
      }
    }
  } catch (e) {
    console.error("[CRON thumbs]", e);
  }
  return out;
}

interface ResultadoAtualizacao {
  ok: boolean;
  dia: string;
  campanhas: number;
  criativos: number;
  erro?: string;
}

async function atualizar(): Promise<ResultadoAtualizacao> {
  const dia = hojeBR();
  if (!META_TOKEN) return { ok: false, dia, campanhas: 0, criativos: 0, erro: "sem META_ADS_TOKEN" };

  // 1. TODAS as campanhas com atividade hoje (descoberta automática — não fixa em uma campanha)
  const campoCamp = "campaign_id,campaign_name,impressions,reach,clicks,ctr,cpc,cpm,spend,frequency,actions,action_values";
  const rCamp = await fetch(
    `${GRAPH}/act_${AD_ACCOUNT}/insights?level=campaign&fields=${campoCamp}&date_preset=today&limit=50&access_token=${META_TOKEN}`,
    { cache: "no-store" }
  );
  const jCamp = await rCamp.json();
  if (jCamp.error) {
    console.error("[CRON metricas] erro Meta (campanhas):", jCamp.error.message);
    return { ok: false, dia, campanhas: 0, criativos: 0, erro: `Meta: ${jCamp.error.message}` };
  }

  let campanhasGravadas = 0;
  for (const c of jCamp.data || []) {
    const purchases = acao(c.actions, "omni_purchase") || acao(c.actions, "purchase");
    const receita =
      Number(
        c.action_values?.find((x: { action_type: string; value: string }) => x.action_type === "omni_purchase")?.value ?? 0
      ) || 0;
    const snapshot = {
      dia,
      campanha_id: String(c.campaign_id),
      campanha_nome: c.campaign_name || null,
      gasto: Number(c.spend || 0),
      impressoes: Number(c.impressions || 0),
      alcance: Number(c.reach || 0),
      cliques: Number(c.clicks || 0),
      link_clicks: acao(c.actions, "link_click"),
      ctr: Number(c.ctr || 0),
      cpc: Number(c.cpc || 0),
      cpm: Number(c.cpm || 0),
      frequencia: Number(c.frequency || 0),
      page_views: acao(c.actions, "landing_page_view"),
      view_content: acao(c.actions, "omni_view_content") || acao(c.actions, "view_content"),
      initiate_checkout: acao(c.actions, "omni_initiated_checkout") || acao(c.actions, "initiate_checkout"),
      purchases,
      receita,
      fonte: "api",
    };
    const r = await fetch(`${SUPABASE_URL}/rest/v1/traf_snapshots?on_conflict=dia,campanha_id`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(snapshot),
    });
    if (r.ok) campanhasGravadas++;
    else console.error("[CRON metricas] erro ao gravar snapshot da campanha", c.campaign_id, await r.text());
  }

  // 2. criativos ativos da conta inteira (acumulado — decisão é sobre o total, não sobre o dia)
  const campoAd = "ad_id,ad_name,campaign_id,campaign_name,impressions,clicks,ctr,cpc,spend,actions";
  const rAds = await fetch(
    `${GRAPH}/act_${AD_ACCOUNT}/insights?level=ad&fields=${campoAd}&date_preset=maximum&filtering=${encodeURIComponent(
      JSON.stringify([{ field: "ad.effective_status", operator: "IN", value: ["ACTIVE"] }])
    )}&limit=100&access_token=${META_TOKEN}`,
    { cache: "no-store" }
  );
  const jAds = await rAds.json();
  let criativos = 0;
  if (jAds.error) {
    console.error("[CRON metricas] erro Meta (criativos):", jAds.error.message);
  } else if (jAds.data?.length) {
    const adIds = jAds.data.map((a: Record<string, unknown>) => String(a.ad_id));
    const thumbs = await buscarThumbs(adIds);
    const linhas = jAds.data.map((a: Record<string, unknown>) => {
      const nome = String(a.ad_name || "");
      const adId = String(a.ad_id);
      return {
        dia,
        ad_id: adId,
        nome,
        formato: nome.includes("_VID_") ? "video" : "estatico",
        campanha_id: a.campaign_id ? String(a.campaign_id) : null,
        campanha_nome: a.campaign_name || null,
        impressoes: Number(a.impressions || 0),
        cliques: Number(a.clicks || 0),
        link_clicks: acao(a.actions as never, "link_click"),
        ctr: Number(a.ctr || 0),
        cpc: Number(a.cpc || 0),
        gasto: Number(a.spend || 0),
        purchases: acao(a.actions as never, "omni_purchase") || acao(a.actions as never, "purchase"),
        ...(thumbs[adId] ? { thumb_url: thumbs[adId] } : {}),
      };
    });
    const r = await fetch(`${SUPABASE_URL}/rest/v1/traf_criativos?on_conflict=dia,ad_id`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(linhas),
    });
    if (r.ok) criativos = linhas.length;
    else console.error("[CRON metricas] erro ao gravar criativos:", await r.text());
  }

  return { ok: true, dia, campanhas: campanhasGravadas, criativos };
}

export async function GET(req: Request) {
  // Só a Vercel (com o secret) pode disparar.
  const auth = req.headers.get("authorization");
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const r = await atualizar();
  console.log("[CRON metricas]", JSON.stringify(r));
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}
