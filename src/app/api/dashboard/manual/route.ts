import { NextResponse } from "next/server";

// POST /api/dashboard/manual  { ciclo: "YYYY-MM-DD", valores: { chave: número | null } }
// Grava os números que não têm API (presença ao vivo, únicos, verba de
// distribuição...) na tabela hw_dash_manual. null apaga a chave.

export const dynamic = "force-dynamic";

const SB = "https://supabase.redpro.com.br/rest/v1";
const LPSG_PASSWORD = process.env.LPSG_PASSWORD || "lpsg2026";

const CHAVES_MANUAIS = new Set([
  ...[1, 2, 3, 4, 5, 6].flatMap((n) => [`presenca_a${n}`, `unicos_a${n}`, `duracao_a${n}`]),
  "membros_grupo",
  "verba_distribuicao",
  "custos_extras",
  "meta_ingressos",
  "produto_formacao_id",
  "preco_formacao",
  "vendas_formacao",
  "roas_alvo",
]);

function authed(req: Request): boolean {
  return (req.headers.get("cookie") || "").includes(`lpsg_auth=${LPSG_PASSWORD}`);
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const k = process.env.SUPABASE_SERVICE_KEY!;
  const h = { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" };
  try {
    const { ciclo, valores } = (await req.json()) as { ciclo: string; valores: Record<string, number | null> };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ciclo || "")) return NextResponse.json({ error: "ciclo inválido" }, { status: 400 });

    const gravar: { ciclo: string; chave: string; valor: number; atualizado_em: string }[] = [];
    const apagar: string[] = [];
    for (const [chave, v] of Object.entries(valores || {})) {
      if (!CHAVES_MANUAIS.has(chave)) continue;
      if (v === null || v === undefined || Number.isNaN(Number(v))) apagar.push(chave);
      else gravar.push({ ciclo, chave, valor: Number(v), atualizado_em: new Date().toISOString() });
    }
    if (gravar.length) {
      const r = await fetch(`${SB}/hw_dash_manual?on_conflict=ciclo,chave`, {
        method: "POST",
        headers: { ...h, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(gravar),
      });
      if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: 500 });
    }
    if (apagar.length) {
      await fetch(`${SB}/hw_dash_manual?ciclo=eq.${ciclo}&chave=in.(${apagar.join(",")})`, { method: "DELETE", headers: h });
    }
    return NextResponse.json({ ok: true, gravados: gravar.length, apagados: apagar.length });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message || e) }, { status: 500 });
  }
}
