import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook da Evolution API (instância academy-suporte, o WhatsApp de suporte da Hermes Week).
 *
 * Só monitora a CONEXÃO: registra cada connection.update em wpp_health_state e agenda a
 * re-checagem do /api/cron/wpp-health. As mensagens desse número são atendidas pela Amanda,
 * na VPS (HERMES/automacao-vps/suporte), que lê a Evolution direto, sem passar por aqui.
 *
 * O fluxo de confirmação de e-mail do Desafio CRM que vivia aqui foi apagado em 19/10/2026
 * (Red: o Desafio não existe mais; um "ok" dele disparava a mensagem do grupo do desafio).
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60; // cobre o setTimeout da re-checagem de conexão

const SUPABASE_URL = "https://supabase.redpro.com.br";

const HEALTH_CHAVE = "evolution:academy-suporte";

/**
 * Registra o estado da conexão em wpp_health_state — SEM alertar.
 * Grava `caiu_em` (quando saiu de open) para o cron medir há quanto tempo está
 * caída e decidir o alerta com debounce. Ao voltar pra open, zera `caiu_em`.
 */
async function registrarEstadoConexao(estado: string) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return;
    const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
    // lê o estado anterior pra saber se é transição
    let anterior: { estado?: string; caiu_em?: string | null } = {};
    try {
        const r = await fetch(
            `${SUPABASE_URL}/rest/v1/wpp_health_state?chave=eq.${encodeURIComponent(HEALTH_CHAVE)}&select=estado,caiu_em&limit=1`,
            { headers, cache: "no-store" },
        );
        if (r.ok) { const a = await r.json(); anterior = a?.[0] || {}; }
    } catch { /* segue com anterior vazio */ }

    // caiu_em: marca o instante em que saiu de open; limpa quando volta a open.
    let caiuEm: string | null | undefined;
    if (estado === "open") {
        caiuEm = null; // recuperou
    } else if (anterior.estado === "open" || !anterior.caiu_em) {
        caiuEm = new Date().toISOString(); // acabou de cair (ou primeira vez caído)
    } else {
        caiuEm = anterior.caiu_em; // continua caído — preserva o início da queda
    }

    await fetch(`${SUPABASE_URL}/rest/v1/wpp_health_state?on_conflict=chave`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ chave: HEALTH_CHAVE, estado, caiu_em: caiuEm, checado_em: "now()" }),
    }).catch(() => {});
}

const DEBOUNCE_MS = (Number(process.env.WPP_DEBOUNCE_MIN) || 5) * 60_000;

/**
 * Agenda UMA re-checagem do /api/cron/wpp-health após o debounce. Se a instância
 * já tiver voltado (reconexão curta do Baileys), o cron não faz nada; se ainda
 * estiver caída, ele alerta. Fire-and-forget — supre a falta de cron sub-diário
 * no Hobby. setTimeout dentro da função serverless: dispara o fetch antes da
 * função encerrar (o webhook responde na hora; este timer roda em paralelo).
 */
function agendarRechecagem(req: NextRequest) {
    const secret = process.env.CRON_SECRET;
    if (!secret) return;
    const url = new URL("/api/cron/wpp-health", req.nextUrl.origin).toString();
    setTimeout(() => {
        fetch(url, { headers: { authorization: `Bearer ${secret}` } }).catch(() => {});
    }, DEBOUNCE_MS + 5_000);
}

export async function POST(req: NextRequest) {
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: true, ignorado: "json inválido" });
    }

    const evento = String(body.event ?? "");

    // HEALTHCHECK COM DEBOUNCE: o Baileys (WhatsApp não-oficial) reconecta sozinho
    // a cada ~45-70 min, em 1-2s, SEM perder mensagem. Alertar em toda
    // connection.update spammava o Telegram ("caiu/voltou") por micro-reconexões
    // inofensivas. Agora este webhook só REGISTRA o estado + o instante da queda em
    // wpp_health_state; quem decide alertar é o cron /api/cron/wpp-health, que só
    // avisa se a instância ficar caída por mais de WPP_DEBOUNCE_MIN minutos (queda
    // REAL) — e manda o "recuperado" só se a queda chegou a ser alertada.
    if (evento === "connection.update") {
        const d = body.data as Record<string, unknown> | undefined;
        const estado = String(d?.state ?? d?.connection ?? "desconhecido");
        await registrarEstadoConexao(estado);
        // Caiu? Agenda UMA verificação após o debounce. Se ainda estiver caída lá,
        // o cron alerta; se já reconectou (o caso comum do Baileys), nada acontece.
        // Fire-and-forget: no plano Hobby não há cron sub-diário, então o próprio
        // webhook agenda a re-checagem. Não bloqueia a resposta.
        if (estado !== "open") {
            agendarRechecagem(req);
        }
        return NextResponse.json({ ok: true, connection: estado });
    }

    // mensagens: quem atende é a Amanda na VPS; aqui não há nada a fazer
    return NextResponse.json({ ok: true, ignorado: evento });
}

export async function GET() {
    return NextResponse.json({ ok: true, servico: "webhook evolution · monitor de conexão do WhatsApp de suporte" });
}
