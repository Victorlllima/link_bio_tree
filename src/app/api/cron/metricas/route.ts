import { NextResponse } from "next/server";

// ============================================================
// CRON: atualiza as métricas de tráfego automaticamente 2x/dia.
// Chamado pelo Vercel Cron (ver vercel.json). Reusa a mesma lógica
// do botão "Atualizar agora", mas sem depender do cookie de login —
// a proteção aqui é o header Authorization com o CRON_SECRET.
//
// A Vercel envia automaticamente "Authorization: Bearer <CRON_SECRET>"
// nas chamadas de cron quando CRON_SECRET está nas env vars.
// ============================================================

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUPABASE_URL = "https://supabase.redpro.com.br";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const META_TOKEN = process.env.META_ADS_TOKEN;
const CRON_SECRET = process.env.CRON_SECRET;
const AD_ACCOUNT = "961901509283620";
const CAMPANHA_IAA = "120248864364630175";
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

async function atualizar(): Promise<{ ok: boolean; dia: string; criativos: number; erro?: string }> {
  const dia = hojeBR();
  if (!META_TOKEN) return { ok: false, dia, criativos: 0, erro: "sem META_ADS_TOKEN" };

  // 1. campanha (hoje)
  const campoCamp = "impressions,reach,clicks,ctr,cpc,cpm,spend,frequency,actions,action_values";
  const rCamp = await fetch(
    `${GRAPH}/${CAMPANHA_IAA}/insights?fields=${campoCamp}&date_preset=today&access_token=${META_TOKEN}`,
    { cache: "no-store" }
  );
  const jCamp = await rCamp.json();
  if (jCamp.error) return { ok: false, dia, criativos: 0, erro: jCamp.error.message };

  const c = jCamp.data?.[0];
  if (c) {
    const purchases = acao(c.actions, "omni_purchase") || acao(c.actions, "purchase");
    const receita =
      Number(
        c.action_values?.find((x: { action_type: string; value: string }) => x.action_type === "omni_purchase")?.value ?? 0
      ) || purchases * 17;
    const snapshot = {
      dia,
      campanha_id: "iaa",
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
    await fetch(`${SUPABASE_URL}/rest/v1/traf_snapshots?on_conflict=dia,campanha_id`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(snapshot),
    });
  }

  // 2. criativos (acumulado)
  const campoAd = "ad_id,ad_name,impressions,clicks,ctr,cpc,spend,actions";
  const rAds = await fetch(
    `${GRAPH}/act_${AD_ACCOUNT}/insights?level=ad&fields=${campoAd}&date_preset=maximum&filtering=[{"field":"campaign.id","operator":"IN","value":["${CAMPANHA_IAA}"]}]&limit=50&access_token=${META_TOKEN}`,
    { cache: "no-store" }
  );
  const jAds = await rAds.json();
  let criativos = 0;
  if (jAds.data?.length) {
    const linhas = jAds.data.map((a: Record<string, unknown>) => {
      const nome = String(a.ad_name || "");
      return {
        dia,
        ad_id: String(a.ad_id),
        nome,
        formato: nome.includes("_VID_") ? "video" : "estatico",
        impressoes: Number(a.impressions || 0),
        cliques: Number(a.clicks || 0),
        link_clicks: acao(a.actions as never, "link_click"),
        ctr: Number(a.ctr || 0),
        cpc: Number(a.cpc || 0),
        gasto: Number(a.spend || 0),
        purchases: acao(a.actions as never, "omni_purchase") || acao(a.actions as never, "purchase"),
      };
    });
    const r = await fetch(`${SUPABASE_URL}/rest/v1/traf_criativos?on_conflict=dia,ad_id`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(linhas),
    });
    if (r.ok) criativos = linhas.length;
  }

  return { ok: true, dia, criativos };
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
