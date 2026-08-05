import { NextResponse } from "next/server";

// ============================================================
// API do painel de criativos (dashboard /lpsg/criativos).
// Mesmo padrão do /api/lpsg/metricas: service key do Supabase self-hosted + auth por cookie.
// - GET  → devolve os criativos ativos com classificação automática + breakdown por temperatura
// - POST → grava/atualiza o snapshot diário de um criativo (vem da routine zenith-criativos-diario)
// Inspirado no dashboard que a Tatá (@tata) mostrou em reel do IG (05/08/2026).
// ============================================================

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const LPSG_PASSWORD = process.env.LPSG_PASSWORD || "lpsg2026";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
};

function authed(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes(`lpsg_auth=${LPSG_PASSWORD}`);
}

type Criativo = {
  ad_id: string;
  nome: string;
  gasto: number;
  purchases: number;
  receita: number;
  roas: number;
  ctr: number;
  cpc: number;
  status: string;
};

// Regras de classificação — mesmo raciocínio do Modo 1/3 da skill meta-ads-copilot.
// Volume mínimo de 10 compras pra confiar no ROAS (abaixo disso é ruído estatístico).
const VOLUME_MINIMO = 10;
const ROAS_BOM = 1.8;
const ROAS_RUIM = 0.8;
const GASTO_BAIXO = 50; // R$ — abaixo disso, mesmo ROAS bom pode ser sorte de amostra pequena

function classificar(c: Criativo): { label: string; cor: string } {
  if (c.purchases < VOLUME_MINIMO) {
    return { label: "Aguardando dados", cor: "cinza" };
  }
  if (c.roas >= ROAS_BOM && c.gasto >= GASTO_BAIXO) {
    return { label: "Pronto pra escalar", cor: "verde" };
  }
  if (c.roas >= ROAS_BOM && c.gasto < GASTO_BAIXO) {
    return { label: "Sub-investido", cor: "azul" };
  }
  if (c.roas <= ROAS_RUIM) {
    return { label: "Queimando dinheiro", cor: "vermelho" };
  }
  return { label: "Estável", cor: "amarelo" };
}

// GET → criativos ativos + classificação + breakdown por temperatura de público
export async function GET(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const [resCrt, resPub] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/traf_criativos?select=*&order=dia.desc,roas.desc`,
        { headers, cache: "no-store" }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/traf_criativos_publico?select=*&order=dia.desc`,
        { headers, cache: "no-store" }
      ),
    ]);

    const todosCriativos = resCrt.ok ? await resCrt.json() : [];
    const todosPublico = resPub.ok ? await resPub.json() : [];

    // fica só a linha mais recente de cada ad_id (snapshot atual)
    const vistos = new Set<string>();
    const criativos = (todosCriativos as Criativo[])
      .filter((c) => {
        if (vistos.has(c.ad_id)) return false;
        vistos.add(c.ad_id);
        return true;
      })
      .map((c) => ({ ...c, classificacao: classificar(c) }));

    // agrupa o cruzamento por ad_id → { frio, morno, quente, quentissimo }
    const publicoPorAd: Record<string, Record<string, unknown>> = {};
    for (const p of todosPublico as Array<{
      ad_id: string;
      temperatura: string;
      gasto: number;
      purchases: number;
      roas: number;
    }>) {
      if (!publicoPorAd[p.ad_id]) publicoPorAd[p.ad_id] = {};
      // só a entrada mais recente por temperatura (já vem ordenado por dia.desc)
      if (!publicoPorAd[p.ad_id][p.temperatura]) {
        publicoPorAd[p.ad_id][p.temperatura] = {
          gasto: p.gasto,
          purchases: p.purchases,
          roas: p.roas,
        };
      }
    }

    return NextResponse.json({ criativos, publicoPorAd }, { status: 200 });
  } catch (err) {
    console.error("[CRIATIVOS] Erro interno GET:", err);
    return NextResponse.json({ criativos: [], publicoPorAd: {} }, { status: 200 });
  }
}

// Campos numéricos aceitos no snapshot de criativo (whitelist — evita injeção de coluna)
const CAMPOS_CRIATIVO = [
  "impressoes", "cliques", "link_clicks", "ctr", "cpc", "gasto",
  "purchases", "receita", "roas",
];
const CAMPOS_PUBLICO = ["gasto", "purchases", "receita", "roas"];

// POST → upsert do snapshot diário. Body: { dia, ad_id, adset_id?, nome?, formato?, campanha_id?,
//   status?, temperatura?, ...métricas }
// Se "temperatura" vier no body, grava em traf_criativos_publico (cruzamento).
// Senão, grava o agregado geral em traf_criativos.
export async function POST(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.dia || !body.ad_id) {
      return NextResponse.json(
        { success: false, error: "dia ou ad_id ausente" },
        { status: 400 }
      );
    }

    if (body.temperatura) {
      const row: Record<string, unknown> = {
        dia: body.dia,
        ad_id: body.ad_id,
        adset_id: body.adset_id || "",
        temperatura: body.temperatura,
      };
      for (const c of CAMPOS_PUBLICO) {
        if (c in body) row[c] = body[c];
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/traf_criativos_publico`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(row),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("[CRIATIVOS] Erro ao gravar público:", err);
        return NextResponse.json({ success: false, error: err }, { status: 500 });
      }
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const row: Record<string, unknown> = {
      dia: body.dia,
      ad_id: body.ad_id,
      nome: body.nome || body.ad_id,
      formato: body.formato || "desconhecido",
      adset_id: body.adset_id || null,
      campanha_id: body.campanha_id || null,
      status: body.status || "ACTIVE",
    };
    for (const c of CAMPOS_CRIATIVO) {
      if (c in body) row[c] = body[c];
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/traf_criativos`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[CRIATIVOS] Erro ao gravar:", err);
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[CRIATIVOS] Erro interno POST:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
