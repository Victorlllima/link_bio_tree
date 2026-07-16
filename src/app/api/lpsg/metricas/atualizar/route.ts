import { NextResponse } from "next/server";

// ============================================================
// Botão "Atualizar agora" do dashboard de tráfego.
// Lê a Meta Marketing API server-side (token nunca vai pro cliente),
// grava o snapshot do dia + o desempenho por criativo, e devolve o resultado.
// ============================================================

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const LPSG_PASSWORD = process.env.LPSG_PASSWORD || "lpsg2026";
const META_TOKEN = process.env.META_ADS_TOKEN;
const AD_ACCOUNT = "961901509283620";
const CAMPANHA_IAA = "120248864364630175";
const GRAPH = "https://graph.facebook.com/v21.0";

const sbHeaders = {
  "Content-Type": "application/json",
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
};

function authed(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes(`lpsg_auth=${LPSG_PASSWORD}`);
}

// Data de hoje em GMT-3 (Brasil), formato YYYY-MM-DD
function hojeBR(): string {
  const agora = new Date();
  const br = new Date(agora.getTime() - 3 * 60 * 60 * 1000);
  return br.toISOString().slice(0, 10);
}

// Extrai um valor de actions[] da Meta (ex: link_click, purchase)
function acao(actions: Array<{ action_type: string; value: string }> | undefined, tipo: string): number {
  if (!actions) return 0;
  const a = actions.find((x) => x.action_type === tipo);
  return a ? Number(a.value) : 0;
}

export async function POST(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!META_TOKEN) {
    return NextResponse.json(
      { success: false, error: "META_ADS_TOKEN não configurado no ambiente." },
      { status: 500 }
    );
  }

  const dia = hojeBR();

  try {
    // ---------- 1. INSIGHTS DA CAMPANHA (hoje) ----------
    const campoCamp =
      "impressions,reach,clicks,ctr,cpc,cpm,spend,frequency,actions,action_values";
    const urlCamp = `${GRAPH}/${CAMPANHA_IAA}/insights?fields=${campoCamp}&date_preset=today&access_token=${META_TOKEN}`;
    const resCamp = await fetch(urlCamp, { cache: "no-store" });
    const jsonCamp = await resCamp.json();

    if (jsonCamp.error) {
      console.error("[ATUALIZAR] Meta API erro:", jsonCamp.error);
      return NextResponse.json(
        { success: false, error: `Meta: ${jsonCamp.error.message}` },
        { status: 502 }
      );
    }

    const c = jsonCamp.data?.[0];
    if (!c) {
      return NextResponse.json(
        { success: false, error: "A Meta não retornou dados para hoje (a campanha pode não ter rodado ainda)." },
        { status: 200 }
      );
    }

    const purchases = acao(c.actions, "omni_purchase") || acao(c.actions, "purchase");
    const receita =
      (c.action_values?.find((x: { action_type: string; value: string }) => x.action_type === "omni_purchase")
        ?.value ?? 0) * 1 || purchases * 17; // fallback: ticket do IAA

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
      initiate_checkout:
        acao(c.actions, "omni_initiated_checkout") || acao(c.actions, "initiate_checkout"),
      purchases,
      receita: Number(receita),
      fonte: "api",
    };

    await fetch(`${SUPABASE_URL}/rest/v1/traf_snapshots`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(snapshot),
    });

    // ---------- 2. INSIGHTS POR CRIATIVO (acumulado — decisão é sobre o total) ----------
    const campoAd = "ad_id,ad_name,impressions,clicks,ctr,cpc,spend,actions";
    const urlAds = `${GRAPH}/act_${AD_ACCOUNT}/insights?level=ad&fields=${campoAd}&date_preset=maximum&filtering=[{"field":"campaign.id","operator":"IN","value":["${CAMPANHA_IAA}"]}]&limit=50&access_token=${META_TOKEN}`;
    const resAds = await fetch(urlAds, { cache: "no-store" });
    const jsonAds = await resAds.json();

    let criativos = 0;
    if (jsonAds.data?.length) {
      const linhas = jsonAds.data.map((a: Record<string, unknown>) => {
        const nome = String(a.ad_name || "");
        const formato = nome.includes("_VID_") ? "video" : "estatico";
        return {
          dia,
          ad_id: String(a.ad_id),
          nome,
          formato,
          impressoes: Number(a.impressions || 0),
          cliques: Number(a.clicks || 0),
          link_clicks: acao(a.actions as never, "link_click"),
          ctr: Number(a.ctr || 0),
          cpc: Number(a.cpc || 0),
          gasto: Number(a.spend || 0),
          purchases: acao(a.actions as never, "omni_purchase") || acao(a.actions as never, "purchase"),
        };
      });
      const resIns = await fetch(`${SUPABASE_URL}/rest/v1/traf_criativos`, {
        method: "POST",
        headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(linhas),
      });
      if (resIns.ok) criativos = linhas.length;
      else console.error("[ATUALIZAR] Erro criativos:", await resIns.text());
    }

    return NextResponse.json(
      { success: true, dia, criativos, atualizado_em: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err) {
    console.error("[ATUALIZAR] Erro interno:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
