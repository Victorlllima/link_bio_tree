import { NextRequest, NextResponse } from "next/server";
import { estadoInstancia } from "@/lib/evolution";

/**
 * HEALTHCHECK da instância Evolution — COM DEBOUNCE.
 *
 * O Baileys (WhatsApp não-oficial) reconecta sozinho a cada ~45-70 min, em 1-2s,
 * sem perder mensagem. Alertar em toda queda spammava o Telegram com falsos
 * positivos ("caiu/voltou" por micro-reconexão). Agora:
 *
 *  - o webhook /api/webhooks/evolution só REGISTRA estado + `caiu_em` (quando saiu
 *    de open), sem alertar.
 *  - este cron consulta o estado real e SÓ alerta queda se a instância estiver
 *    caída há mais de WPP_DEBOUNCE_SEC segundos (queda REAL, não reconexão curta).
 *  - manda "recuperado" só se a queda chegou a ser alertada (flag `alertado`).
 *
 * Autenticação: Bearer <CRON_SECRET> (a Vercel injeta no cron).
 */
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SUPABASE_URL = "https://supabase.redpro.com.br";
const CRON_SECRET = process.env.CRON_SECRET;
const CHAVE = "evolution:academy-suporte";
// Segundos caído antes de alertar. 45s filtra as reconexões curtas do Baileys
// (1-2s) mas ainda pega queda real rápido. Cabe no maxDuration=60 do webhook que
// agenda a re-checagem (limite do plano Hobby, sem cron sub-diário).
const DEBOUNCE_MS = (Number(process.env.WPP_DEBOUNCE_SEC) || 45) * 1000;

function sbHeaders() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

type Health = { estado?: string; caiu_em?: string | null; alertado?: boolean };

async function lerHealth(): Promise<Health> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/wpp_health_state?chave=eq.${encodeURIComponent(CHAVE)}&select=estado,caiu_em,alertado&limit=1`,
            { headers: sbHeaders(), cache: "no-store" },
        );
        if (!res.ok) return {};
        const rows = await res.json();
        return (Array.isArray(rows) && rows[0]) || {};
    } catch {
        return {};
    }
}

async function salvar(patch: Record<string, unknown>) {
    await fetch(`${SUPABASE_URL}/rest/v1/wpp_health_state?on_conflict=chave`, {
        method: "POST",
        headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ chave: CHAVE, checado_em: "now()", ...patch }),
    }).catch(() => {});
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

export async function GET(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const r = await estadoInstancia();
    const atual = r.ok ? (r.estado || "desconhecido") : "erro";
    const prev = await lerHealth();

    // ── Instância SAUDÁVEL ────────────────────────────────────────────────
    if (atual === "open") {
        // Se a queda anterior chegou a ser ALERTADA, avisa a recuperação.
        if (prev.alertado) {
            await telegram(`🟢 *WhatsApp RECUPERADO* — instância \`academy-suporte\` voltou pra *open*.`);
        }
        await salvar({ estado: "open", caiu_em: null, alertado: false });
        return NextResponse.json({ ok: true, estado: "open", recuperou: !!prev.alertado });
    }

    // ── Instância CAÍDA ───────────────────────────────────────────────────
    // Marca o início da queda se ainda não estava marcado.
    const caiuEm = prev.caiu_em || new Date().toISOString();
    const msCaida = Date.now() - new Date(caiuEm).getTime();
    const minCaida = Math.round(msCaida / 60000);

    // Ainda dentro da janela de debounce → só registra, NÃO alerta (é provável
    // reconexão curta do Baileys, que volta sozinha em segundos).
    if (msCaida < DEBOUNCE_MS) {
        await salvar({ estado: atual, caiu_em: caiuEm });
        return NextResponse.json({ ok: true, estado: atual, caida_min: minCaida, alertado: false, motivo: "dentro do debounce" });
    }

    // Passou do debounce e ainda não alertou → queda REAL, avisa uma vez.
    if (!prev.alertado) {
        await telegram(
            `🔴 *WhatsApp FORA DO AR há ${minCaida} min* — instância \`academy-suporte\` em *${atual}*.\n` +
            (atual === "erro" ? `⚠️ Consulta à Evolution falhou: ${r.erro || "sem detalhe"}\n` : "") +
            `\nNão é reconexão curta. *As boas-vindas não estão saindo.*\nReconectar em evo.redpro.com.br/manager.`,
        );
        await salvar({ estado: atual, caiu_em: caiuEm, alertado: true });
        return NextResponse.json({ ok: true, estado: atual, caida_min: minCaida, alertou: true });
    }

    // Já alertou e continua caído → só registra, não repete o alerta.
    await salvar({ estado: atual, caiu_em: caiuEm });
    return NextResponse.json({ ok: true, estado: atual, caida_min: minCaida, motivo: "já alertado" });
}
