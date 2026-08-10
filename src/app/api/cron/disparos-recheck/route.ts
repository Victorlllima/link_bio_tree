import { NextRequest, NextResponse } from "next/server";
import { statusMensagemGrupo } from "@/lib/evolution-grupo";

/**
 * Verificação de ENTREGA dos disparos de grupo (2ª camada da verificação de falha).
 *
 * A 1ª camada vive no cron de disparo: se a Evolution não aceita o POST (sem
 * key.id), é FALHA DE ENVIO e alerta na hora. Esta 2ª camada cuida da ENTREGA:
 * o ACK do WhatsApp chega assíncrono, então alguns minutos depois a gente
 * confirma que a mensagem consta no histórico com status de entrega, não presa
 * em PENDING (sinal de número com problema).
 *
 * ⚠️ Limite honesto: em GRUPO o WhatsApp não dá "entregue a todos" confiável.
 * O que dá pra afirmar é: a mensagem EXISTE no servidor (key.id rastreável) e
 * saiu de PENDING. Se sumiu ou travou em PENDING, algo está errado no número.
 *
 * Chamada pelo próprio cron de disparo (fire-and-forget) alguns minutos após
 * cada envio, e também disponível como cron diário de varredura.
 * Autenticação: Bearer <CRON_SECRET>.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUPABASE_URL = "https://supabase.redpro.com.br";
const CRON_SECRET = process.env.CRON_SECRET;
// Status que contam como "entregue de verdade" (saiu de PENDING).
const ENTREGUES = new Set(["SERVER_ACK", "DELIVERY_ACK", "READ", "PLAYED"]);

function sbHeaders() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function telegram(msg: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chat) return;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text: msg, parse_mode: "Markdown" }),
    }).catch(() => {});
}

type Enviado = { id: number; ordem: number; jid: string; key_id: string | null; entrega: string | null };

/** Disparos enviados que ainda não foram confirmados como entregues. */
async function pendentesDeConfirmacao(): Promise<Enviado[]> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/disparos_grupo` +
        `?status=eq.enviado&key_id=not.is.null&entrega=is.null&select=id,ordem,jid,key_id,entrega` +
        `&enviado_em=lt.${new Date(Date.now() - 3 * 60_000).toISOString()}`, // ao menos 3 min atrás
        { headers: sbHeaders(), cache: "no-store" },
    );
    if (!res.ok) return [];
    return (await res.json()) as Enviado[];
}

async function patch(id: number, campos: Record<string, unknown>) {
    await fetch(`${SUPABASE_URL}/rest/v1/disparos_grupo?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...sbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ ...campos, atualizado_em: "now()" }),
    }).catch(() => {});
}

export async function GET(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const lista = await pendentesDeConfirmacao();
    let confirmados = 0;
    let presos = 0;

    for (const d of lista) {
        const status = await statusMensagemGrupo(d.jid, d.key_id!);
        if (status && ENTREGUES.has(status)) {
            await patch(d.id, { entrega: status });
            confirmados++;
        } else if (status === "PENDING" || status == null) {
            // Ainda não confirmou. Só alerta se já faz tempo (o cron re-varre).
            await patch(d.id, { entrega: status || "SEM_STATUS" });
            presos++;
            await telegram(
                `🟠 *Disparo ${d.ordem}* postado, mas *entrega não confirmada*.\n\n` +
                `Status: \`${status || "sem status"}\`.\n` +
                `A mensagem saiu do sistema, mas o WhatsApp ainda não confirmou a entrega. ` +
                `Se persistir, checar a instância em evo.redpro.com.br/manager.`,
            );
        }
    }

    return NextResponse.json({ ok: true, verificados: lista.length, confirmados, presos });
}
