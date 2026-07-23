import { NextRequest, NextResponse } from "next/server";
import { enfileirar } from "@/lib/wpp-fila";
import { CAMPANHAS_DISPONIVEIS } from "@/lib/campanhas-crmweek";

/**
 * Enfileira os compradores do ingresso numa campanha de disparo 1:1 em massa.
 *
 * APPROVAL GATE (regra do Red): disparo em massa nunca é automático. Este
 * endpoint só ENFILEIRA — o cron `/api/cron/wpp-fila` é quem envia, no ritmo
 * humano, e só para as campanhas listadas em WPP_CAMPANHAS_ATIVAS. Ou seja, o
 * Red controla o gatilho por env var: enfileira agora, ativa o envio quando quiser.
 *
 * Protegido por CRON_SECRET no header (mesma chave do cron). Sem front público —
 * é chamado por script/curl pelo Red ou por um agente autorizado.
 *
 * Fonte dos destinatários: compradores do ingresso (produto 8124888) com
 * PURCHASE_APPROVED e telefone, direto do banco. Idempotente por telefone.
 */
export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    let body: { campanha?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "json inválido" }, { status: 400 });
    }

    const campanha = body.campanha || "";
    if (!CAMPANHAS_DISPONIVEIS.includes(campanha)) {
        return NextResponse.json(
            { error: "campanha inválida", disponiveis: CAMPANHAS_DISPONIVEIS },
            { status: 400 },
        );
    }

    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return NextResponse.json({ error: "SUPABASE_SERVICE_KEY ausente" }, { status: 500 });

    // Compradores do ingresso com telefone. distinct por telefone no app.
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/hotmart_compras` +
        `?produto_id=eq.8124888&evento=eq.PURCHASE_APPROVED&whatsapp=not.is.null` +
        `&select=nome,whatsapp`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) {
        return NextResponse.json({ error: `banco: ${res.status}` }, { status: 502 });
    }

    const rows: Array<{ nome: string; whatsapp: string }> = await res.json();
    const vistos = new Set<string>();
    const destinatarios = rows
        .map((r) => ({ telefone: (r.whatsapp || "").replace(/\D/g, ""), nome: r.nome || "" }))
        .filter((d) => {
            if (!d.telefone || vistos.has(d.telefone)) return false;
            vistos.add(d.telefone);
            return true;
        });

    const r = await enfileirar(campanha, destinatarios);
    if (!r.ok) return NextResponse.json({ error: r.erro }, { status: 502 });

    return NextResponse.json({
        ok: true,
        campanha,
        compradores_com_telefone: destinatarios.length,
        enfileirados: r.inseridos,
        aviso: `Para o envio começar, adicione "${campanha}" em WPP_CAMPANHAS_ATIVAS na Vercel. O cron dispara no ritmo humano, dentro de 8h-21h.`,
    });
}
