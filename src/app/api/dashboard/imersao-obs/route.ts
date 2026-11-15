import { NextResponse } from "next/server";
import { lpsgAutorizado } from "@/lib/lpsg-auth";

// POST /api/dashboard/imersao-obs  { edicao: "<id>", dia: "YYYY-MM-DD", texto: string }
// Observação do dia no controle diário da aba Imersões (tabela imersao_dash_obs). Texto vazio apaga.
// Mesmo login do /lpsg. Só texto livre do Red; nada de dado de comprador aqui.

export const dynamic = "force-dynamic";
const SB = "https://supabase.redpro.com.br/rest/v1";

export async function POST(req: Request) {
  if (!lpsgAutorizado(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const k = process.env.SUPABASE_SERVICE_KEY!;
  const h = { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" };
  try {
    const { edicao, dia, texto } = (await req.json()) as { edicao: string; dia: string; texto: string };
    if (!/^[a-z0-9-]{1,40}$/.test(edicao || "") || !/^\d{4}-\d{2}-\d{2}$/.test(dia || "")) return NextResponse.json({ error: "edição ou dia inválido" }, { status: 400 });
    const t = String(texto || "").trim().slice(0, 500);
    const r = t
      ? await fetch(`${SB}/imersao_dash_obs?on_conflict=edicao,dia`, {
          method: "POST",
          headers: { ...h, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify([{ edicao, dia, texto: t, atualizado_em: new Date().toISOString() }]),
        })
      : await fetch(`${SB}/imersao_dash_obs?edicao=eq.${edicao}&dia=eq.${dia}`, { method: "DELETE", headers: h });
    if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message || e) }, { status: 500 });
  }
}
