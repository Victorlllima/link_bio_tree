import { NextRequest, NextResponse } from "next/server";

/**
 * Mensageria do grupo (aba /lpsg). Texto vive no banco → editável na página.
 *
 * GET   → lista as mensagens do ciclo, em ordem.
 * PATCH → edita uma mensagem (texto / nome_grupo) ou marca como enviada.
 * POST (action=disparar) → envia a mensagem no GRUPO via Evolution.
 *
 * ⚠️ Disparar no grupo é ação externa → protegido por CRON_SECRET no header
 * (mesmo gate das rotas sensíveis). A leitura/edição usa o gate de senha do /lpsg.
 */
export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";
const EVO_URL = "https://evo.redpro.com.br";
const CRON_SECRET = process.env.CRON_SECRET;

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

/** POST { id } → dispara a mensagem daquele id NO GRUPO. Requer CRON_SECRET. */
export async function POST(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ ok: false, erro: "unauthorized" }, { status: 401 });
    }

    const key = process.env.SUPABASE_SERVICE_KEY;
    const evoKey = process.env.EVOLUTION_API_KEY;
    const grupoJid = process.env.WPP_GRUPO_JID; // ex: 1203...@g.us
    if (!key || !evoKey) return NextResponse.json({ ok: false, erro: "sem credenciais" }, { status: 500 });
    if (!grupoJid) return NextResponse.json({ ok: false, erro: "WPP_GRUPO_JID não configurado" }, { status: 500 });

    let body: { id?: number };
    try { body = await req.json(); } catch { return NextResponse.json({ ok: false, erro: "json inválido" }, { status: 400 }); }
    if (!body.id) return NextResponse.json({ ok: false, erro: "id obrigatório" }, { status: 400 });

    // Busca o texto atual (pode ter sido editado na página).
    const get = await fetch(`${SUPABASE_URL}/rest/v1/mensageria?id=eq.${body.id}&select=texto`, { headers: sb(), cache: "no-store" });
    const rows = get.ok ? await get.json() : [];
    const texto = rows[0]?.texto;
    if (!texto) return NextResponse.json({ ok: false, erro: "mensagem não encontrada" }, { status: 404 });

    // Envia no grupo. delay aleatório (humaniza), mesmo padrão do 1:1.
    const instancia = process.env.EVOLUTION_INSTANCE || "academy-suporte";
    const delay = 900 + Math.floor(Math.random() * 1700);
    try {
        const res = await fetch(`${EVO_URL}/message/sendText/${instancia}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: evoKey },
            body: JSON.stringify({ number: grupoJid, text: texto, delay, linkPreview: false }),
        });
        if (!res.ok) return NextResponse.json({ ok: false, erro: `${res.status} ${await res.text()}` }, { status: 502 });
        // marca enviada
        await fetch(`${SUPABASE_URL}/rest/v1/mensageria?id=eq.${body.id}`, {
            method: "PATCH", headers: { ...sb(), Prefer: "return=minimal" },
            body: JSON.stringify({ enviada: true, enviada_em: new Date().toISOString() }),
        }).catch(() => {});
        return NextResponse.json({ ok: true, enviada: true });
    } catch (e) {
        return NextResponse.json({ ok: false, erro: String(e) }, { status: 502 });
    }
}
