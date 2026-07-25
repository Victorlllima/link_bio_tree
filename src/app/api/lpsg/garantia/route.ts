import { NextRequest, NextResponse } from "next/server";

/**
 * Registro dos 6 marcos da Garantia "Primeiro cliente em 90 dias" — por aluno.
 *
 * GET  → lê o resumo (view garantia_resumo) + os marcos detalhados, pro painel.
 * POST → registra/atualiza UM marco de UM aluno (upsert por email+marco_id).
 *
 * Segue o padrão de /api/lpsg/leads: service key, sem lógica de negócio no banco.
 * Protegido pelo mesmo gate de senha do painel /lpsg (cookie LPSG_PASSWORD).
 *
 * ⚠️ marco_id é ESTÁVEL (1..6, ver garantia_marcos.sql). Nunca remapear:
 *   1=nicho+oferta · 2=material prospecção · 3=abordou 30 · 4=follow-ups
 *   5=≥3 propostas · 6=encontros ao vivo
 */
export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";

function headers() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function GET() {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return NextResponse.json({ ok: false, erro: "sem service key" }, { status: 500 });

    try {
        const [resumoRes, marcosRes] = await Promise.all([
            fetch(`${SUPABASE_URL}/rest/v1/garantia_resumo?select=*&order=marcos_concluidos.desc,ultima_atividade.desc`, {
                headers: headers(), cache: "no-store",
            }),
            fetch(`${SUPABASE_URL}/rest/v1/garantia_marcos?select=email,nome,marco_id,done,prova_url,observacao,updated_at&order=email.asc,marco_id.asc`, {
                headers: headers(), cache: "no-store",
            }),
        ]);
        const resumo = resumoRes.ok ? await resumoRes.json() : [];
        const marcos = marcosRes.ok ? await marcosRes.json() : [];
        return NextResponse.json({ ok: true, resumo, marcos });
    } catch (e) {
        return NextResponse.json({ ok: false, erro: String(e) }, { status: 502 });
    }
}

export async function POST(req: NextRequest) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return NextResponse.json({ ok: false, erro: "sem service key" }, { status: 500 });

    let body: { email?: string; nome?: string; marco_id?: number; done?: boolean; prova_url?: string; observacao?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, erro: "json inválido" }, { status: 400 });
    }

    const email = (body.email || "").trim().toLowerCase();
    const marcoId = Number(body.marco_id);
    if (!email || !(marcoId >= 1 && marcoId <= 6)) {
        return NextResponse.json({ ok: false, erro: "email e marco_id (1..6) obrigatórios" }, { status: 400 });
    }

    const row: Record<string, unknown> = { email, marco_id: marcoId, done: Boolean(body.done) };
    if (body.nome !== undefined) row.nome = body.nome;
    if (body.prova_url !== undefined) row.prova_url = body.prova_url;
    if (body.observacao !== undefined) row.observacao = body.observacao;

    try {
        // upsert por (email, marco_id) — mesmo padrão merge-duplicates do lpsg_checklist.
        const res = await fetch(`${SUPABASE_URL}/rest/v1/garantia_marcos?on_conflict=email,marco_id`, {
            method: "POST",
            headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify(row),
        });
        if (!res.ok) {
            return NextResponse.json({ ok: false, erro: `${res.status} ${await res.text()}` }, { status: 502 });
        }
        return NextResponse.json({ ok: true, email, marco_id: marcoId, done: Boolean(body.done) });
    } catch (e) {
        return NextResponse.json({ ok: false, erro: String(e) }, { status: 502 });
    }
}
