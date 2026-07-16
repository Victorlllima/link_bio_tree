import { NextResponse } from "next/server";

// ============================================================
// API de métricas do tráfego (dashboard /lpsg → aba Métricas).
// Mesmo padrão do /api/lpsg: service key do Supabase self-hosted + auth por cookie.
// - GET  → devolve o histórico dia-a-dia (todos os snapshots)
// - POST → grava/atualiza o snapshot de um dia (upsert por dia+campanha)
// A leitura ao vivo da Meta (Marketing API) é feita pelo Claude via MCP e enviada
// pra cá no POST — token da Meta NÃO fica exposto no cliente.
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

// GET → histórico de snapshots + desempenho por criativo (o mais recente de cada anúncio)
export async function GET(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const [resSnaps, resCrt] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/traf_snapshots?select=*&order=dia.desc`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${SUPABASE_URL}/rest/v1/traf_criativos?select=*&order=dia.desc,ctr.desc`, {
        headers,
        cache: "no-store",
      }),
    ]);

    const items = resSnaps.ok ? await resSnaps.json() : [];
    const todosCriativos = resCrt.ok ? await resCrt.json() : [];

    // fica só a linha mais recente de cada ad_id (o acumulado atual)
    const vistos = new Set<string>();
    const criativos = (todosCriativos as Array<{ ad_id: string }>).filter((c) => {
      if (vistos.has(c.ad_id)) return false;
      vistos.add(c.ad_id);
      return true;
    });

    return NextResponse.json({ items, criativos }, { status: 200 });
  } catch (err) {
    console.error("[METRICAS] Erro interno GET:", err);
    return NextResponse.json({ items: [], criativos: [] }, { status: 200 });
  }
}

// Campos numéricos aceitos no snapshot (whitelist — evita injeção de coluna)
const CAMPOS_NUM = [
  "gasto", "impressoes", "alcance", "cliques", "link_clicks",
  "ctr", "cpc", "cpm", "frequencia",
  "page_views", "view_content", "initiate_checkout", "purchases", "receita",
];

// POST → upsert do snapshot de um dia. Body: { dia, campanha_id?, fonte?, ...métricas }
export async function POST(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.dia) {
      return NextResponse.json({ success: false, error: "dia ausente" }, { status: 400 });
    }

    const row: Record<string, unknown> = {
      dia: body.dia,
      campanha_id: body.campanha_id || "iaa",
      fonte: body.fonte === "api" ? "api" : "manual",
    };
    for (const c of CAMPOS_NUM) {
      if (c in body) row[c] = body[c];
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/traf_snapshots`, {
      method: "POST",
      headers: {
        ...headers,
        // upsert: se já existe (dia, campanha_id), atualiza
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[METRICAS] Erro ao gravar:", err);
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[METRICAS] Erro interno POST:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
