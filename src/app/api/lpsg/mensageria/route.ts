import { NextRequest, NextResponse } from "next/server";

/**
 * Mensageria do grupo (aba /lpsg). Texto vive no banco → editável na página.
 *
 * GET   → lista as mensagens do ciclo, em ordem.
 * PATCH → edita uma mensagem (texto / nome_grupo) ou marca como enviada.
 *
 * ⚠️ NÃO existe disparo automático no grupo, por decisão do Red (02/08). A
 * operação é copiar-e-colar: a Gleyce lê o card, copia o texto e cola no grupo
 * ela mesma. Sem botão de "enviar", sem risco de disparo acidental em massa.
 */
export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";

function sb() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function GET() {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return NextResponse.json({ ok: false, erro: "sem service key" }, { status: 500 });
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/mensageria?ciclo=eq.c1&select=*&order=ordem.asc`,
            { headers: sb(), cache: "no-store" },
        );
        const msgs = res.ok ? await res.json() : [];
        return NextResponse.json({ ok: true, msgs });
    } catch (e) {
        return NextResponse.json({ ok: false, erro: String(e) }, { status: 502 });
    }
}

export async function PATCH(req: NextRequest) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return NextResponse.json({ ok: false, erro: "sem service key" }, { status: 500 });

    let body: { id?: number; texto?: string; nome_grupo?: string | null; enviada?: boolean };
    try { body = await req.json(); } catch { return NextResponse.json({ ok: false, erro: "json inválido" }, { status: 400 }); }
    if (!body.id) return NextResponse.json({ ok: false, erro: "id obrigatório" }, { status: 400 });

    const patch: Record<string, unknown> = {};
    if (body.texto !== undefined) patch.texto = body.texto;
    if (body.nome_grupo !== undefined) patch.nome_grupo = body.nome_grupo;
    if (body.enviada !== undefined) {
        patch.enviada = body.enviada;
        patch.enviada_em = body.enviada ? new Date().toISOString() : null;
    }
    if (!Object.keys(patch).length) return NextResponse.json({ ok: false, erro: "nada pra editar" }, { status: 400 });

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/mensageria?id=eq.${body.id}`, {
            method: "PATCH",
            headers: { ...sb(), Prefer: "return=minimal" },
            body: JSON.stringify(patch),
        });
        if (!res.ok) return NextResponse.json({ ok: false, erro: `${res.status} ${await res.text()}` }, { status: 502 });
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ ok: false, erro: String(e) }, { status: 502 });
    }
}

