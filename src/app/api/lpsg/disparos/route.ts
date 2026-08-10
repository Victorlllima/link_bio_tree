import { NextRequest, NextResponse } from "next/server";

/**
 * Disparos de grupo (aba Mensageria do /lpsg) — FONTE ÚNICA.
 *
 * Substitui a antiga /api/lpsg/mensageria: o painel agora lê e edita EXATAMENTE
 * a mesma tabela que a automação dispara (disparos_grupo). Sem tabela paralela,
 * sem divergência entre "o que o painel mostra" e "o que sai no grupo".
 *
 * GET   → lista os disparos por ciclo/grupo, com status real e horário.
 * PATCH → edita texto/novo_nome, ou aprova/desaprova, ou reagenda.
 *
 * A aprovação pelo painel é equivalente ao link do Telegram: marca aprovado=true.
 * O cron /api/cron/disparos-grupo é quem efetivamente posta (com os guardrails).
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
        // Exclui o ciclo 'teste'. Ordena por horário do disparo.
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/disparos_grupo?ciclo=neq.teste&select=*&order=agendar_em.asc`,
            { headers: sb(), cache: "no-store" },
        );
        const disparos = res.ok ? await res.json() : [];
        return NextResponse.json({ ok: true, disparos });
    } catch (e) {
        return NextResponse.json({ ok: false, erro: String(e) }, { status: 502 });
    }
}

export async function PATCH(req: NextRequest) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return NextResponse.json({ ok: false, erro: "sem service key" }, { status: 500 });

    let body: {
        id?: number;
        texto?: string;
        novo_nome?: string | null;
        aprovado?: boolean;
        agendar_em?: string;
    };
    try { body = await req.json(); } catch { return NextResponse.json({ ok: false, erro: "json inválido" }, { status: 400 }); }
    if (!body.id) return NextResponse.json({ ok: false, erro: "id obrigatório" }, { status: 400 });

    const patch: Record<string, unknown> = { atualizado_em: new Date().toISOString() };
    if (body.texto !== undefined) patch.texto = body.texto;
    if (body.novo_nome !== undefined) patch.novo_nome = body.novo_nome;
    if (body.agendar_em !== undefined) patch.agendar_em = body.agendar_em;
    if (body.aprovado !== undefined) {
        patch.aprovado = body.aprovado;
        patch.aprovado_em = body.aprovado ? new Date().toISOString() : null;
        // Espelha no status: aprovar move p/ 'aprovado', desaprovar volta p/ 'aguardando'.
        // Nunca mexe em disparos já 'enviado'/'falhou'/'expirado'.
        patch.status = body.aprovado ? "aprovado" : "aguardando";
    }

    try {
        // Trava: só edita disparos que ainda não saíram (evita reabrir enviados).
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/disparos_grupo?id=eq.${body.id}&status=in.(aguardando,aprovado)`,
            {
                method: "PATCH",
                headers: { ...sb(), Prefer: "return=minimal" },
                body: JSON.stringify(patch),
            },
        );
        if (!res.ok) return NextResponse.json({ ok: false, erro: `${res.status} ${await res.text()}` }, { status: 502 });
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ ok: false, erro: String(e) }, { status: 502 });
    }
}
