import { NextResponse } from "next/server";

// ============================================================
// Botão "Atualizar agora" do dashboard de tráfego.
// Lê a Meta Marketing API server-side (token nunca vai pro cliente),
// grava o snapshot do dia + o desempenho por criativo, e devolve o resultado.
//
// IMPORTANTE (corrigido 28/09/2026): antes esta rota lia só UMA campanha
// fixa (o "IAA" antigo). Quando aquela campanha parou de rodar, o snapshot
// diário parou de gravar em silêncio (sem erro visível). Agora descobre
// sozinha QUALQUER campanha com atividade no dia, então o próximo ciclo
// (nova campanha) entra automaticamente, sem editar código.
// ============================================================

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const LPSG_PASSWORD = process.env.LPSG_PASSWORD || "lpsg2026";
const META_TOKEN = process.env.META_ADS_TOKEN;
const AD_ACCOUNT = "961901509283620";
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

function hojeBR(): string {
  const agora = new Date();
  const br = new Date(agora.getTime() - 3 * 60 * 60 * 1000);
  return br.toISOString().slice(0, 10);
}

function acao(actions: Array<{ action_type: string; value: string }> | undefined, tipo: string): number {
  if (!actions) return 0;
  const a = actions.find((x) => x.action_type === tipo);
  return a ? Number(a.value) : 0;
}

async function buscarThumbs(adIds: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  if (!adIds.length) return out;
  try {
    const rAds = await fetch(
      `${GRAPH}/act_${AD_ACCOUNT}/ads?fields=id,creative&limit=200&access_token=${META_TOKEN}`,
      { cache: "no-store" }
    );
    const jAds = await rAds.json();
    if (jAds.error) return out;
    const adToCreative: Record<string, string> = {};
    for (const a of jAds.data || []) {
      if (a.creative?.id && adIds.includes(String(a.id))) adToCreative[String(a.id)] = a.creative.id;
    }
    const cids = [...new Set(Object.values(adToCreative))];
    if (!cids.length) return out;
    for (let i = 0; i < cids.length; i += 50) {
      const lote = cids.slice(i, i + 50);
      try {
        const rCr = await fetch(
          `${GRAPH}/?ids=${lote.join(",")}&fields=thumbnail_url,image_url&access_token=${META_TOKEN}`,
          { cache: "no-store" }
        );
        const jCr = await rCr.json();
        if (jCr.error) continue;
        for (const [adId, cId] of Object.entries(adToCreative)) {
          const c = jCr[cId];
          if (c) out[adId] = c.image_url || c.thumbnail_url;
        }
      } catch {
        /* um lote ruim não derruba os outros */
      }
    }
  } catch (e) {
    console.error("[ATUALIZAR thumbs]", e);
  }
  return out;
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
    // ---------- 1. TODAS as campanhas com atividade hoje ----------
    const campoCamp =
      "campaign_id,campaign_name,impressions,reach,clicks,ctr,cpc,cpm,spend,frequency,actions,action_values";
    const urlCamp = `${GRAPH}/act_${AD_ACCOUNT}/insights?level=campaign&fields=${campoCamp}&date_preset=today&limit=50&access_token=${META_TOKEN}`;
    const resCamp = await fetch(urlCamp, { cache: "no-store" });
    const jsonCamp = await resCamp.json();

    if (jsonCamp.error) {
      console.error("[ATUALIZAR] Meta API erro:", jsonCamp.error);
      const expirado =
        jsonCamp.error.code === 190 || /expired|session has expired/i.test(jsonCamp.error.message || "");
      return NextResponse.json(
        {
          success: false,
          tokenExpirado: expirado,
          error: expirado
            ? "O token de acesso à Meta expirou. Peça pro Claude gerar um novo (System User, sem expiração) — os números do painel continuam válidos até lá."
            : `Meta: ${jsonCamp.error.message}`,
        },
        { status: 502 }
      );
    }

    let campanhasGravadas = 0;
    const erros: string[] = [];
    for (const c of jsonCamp.data || []) {
      const purchases = acao(c.actions, "omni_purchase") || acao(c.actions, "purchase");
      const receita =
        Number(
          c.action_values?.find((x: { action_type: string; value: string }) => x.action_type === "omni_purchase")
            ?.value ?? 0
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
        initiate_checkout:
          acao(c.actions, "omni_initiated_checkout") || acao(c.actions, "initiate_checkout"),
        purchases,
        receita: Number(receita),
        fonte: "api",
      };

      const r = await fetch(`${SUPABASE_URL}/rest/v1/traf_snapshots?on_conflict=dia,campanha_id`, {
        method: "POST",
        headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(snapshot),
      });
      if (r.ok) campanhasGravadas++;
      else {
        const t = await r.text();
        console.error("[ATUALIZAR] erro ao gravar snapshot", c.campaign_id, t);
        erros.push(`campanha ${c.campaign_name || c.campaign_id}: ${t}`);
      }
    }

    if (!jsonCamp.data?.length) {
      return NextResponse.json(
        { success: false, error: "A Meta não retornou nenhuma campanha com atividade hoje." },
        { status: 200 }
      );
    }

    // ---------- 2. criativos ativos da conta inteira (acumulado) ----------
    const campoAd = "ad_id,ad_name,campaign_id,campaign_name,impressions,clicks,ctr,cpc,spend,actions";
    const urlAds = `${GRAPH}/act_${AD_ACCOUNT}/insights?level=ad&fields=${campoAd}&date_preset=maximum&filtering=${encodeURIComponent(
      JSON.stringify([{ field: "ad.effective_status", operator: "IN", value: ["ACTIVE"] }])
    )}&limit=100&access_token=${META_TOKEN}`;
    const resAds = await fetch(urlAds, { cache: "no-store" });
    const jsonAds = await resAds.json();

    let criativos = 0;
    const adIds: string[] = (jsonAds.data || []).map((a: Record<string, unknown>) => String(a.ad_id));
    const thumbs = await buscarThumbs(adIds);

    if (jsonAds.error) {
      erros.push(`criativos: ${jsonAds.error.message}`);
    } else if (jsonAds.data?.length) {
      const linhas = jsonAds.data.map((a: Record<string, unknown>) => {
        const nome = String(a.ad_name || "");
        const formato = nome.includes("_VID_") ? "video" : "estatico";
        const adId = String(a.ad_id);
        return {
          dia,
          ad_id: adId,
          nome,
          formato,
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
      const resIns = await fetch(`${SUPABASE_URL}/rest/v1/traf_criativos?on_conflict=dia,ad_id`, {
        method: "POST",
        headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(linhas),
      });
      if (resIns.ok) criativos = linhas.length;
      else {
        const t = await resIns.text();
        console.error("[ATUALIZAR] Erro criativos:", t);
        erros.push(`gravação criativos: ${t}`);
      }
    }

    return NextResponse.json(
      {
        success: campanhasGravadas > 0,
        dia,
        campanhas: campanhasGravadas,
        criativos,
        erros: erros.length ? erros : undefined,
        atualizado_em: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[ATUALIZAR] Erro interno:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
