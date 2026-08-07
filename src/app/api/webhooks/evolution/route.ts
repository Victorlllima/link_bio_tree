import { NextRequest, NextResponse } from "next/server";
import { enviarMensagem } from "@/lib/whatsapp";
import { passosRestantes } from "@/lib/mensagens-crmweek";

/**
 * Webhook da Evolution API — recebe as respostas de quem comprou o ingresso.
 *
 * Por que existe: a mensagem 1 (confirmação de e-mail) pede resposta ANTES de
 * qualquer tarefa. Isso abre a janela de 24h do WhatsApp e marca conversa
 * bidirecional — o WhatsApp mantém desde 2026 um contador cumulativo de
 * mensagens sem resposta em 48h, numa janela móvel de 30 dias. Número que só
 * envia e nunca recebe entra na fila de banimento.
 *
 * ⚠️ Provocar resposta e não responder é PIOR que não provocar. Toda resposta
 * cai aqui e recebe tratamento: reconhecida (SIM / e-mail novo) ou encaminhada
 * ao Red no Telegram.
 *
 * Substituiu o webhook do n8n de cotação do IAA (Red confirmou em 22/07 que não
 * estava mais em uso). Valor antigo guardado no vault `starlight`.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60; // cobre o setTimeout da re-checagem de conexão

const SUPABASE_URL = "https://supabase.redpro.com.br";

/** Extrai o texto da resposta, seja digitada ou clique em botão. */
function extrairTexto(msg: Record<string, unknown>): string {
    const m = (msg?.message ?? {}) as Record<string, unknown>;

    const conv = m.conversation;
    if (typeof conv === "string" && conv.trim()) return conv.trim();

    const ext = m.extendedTextMessage as Record<string, unknown> | undefined;
    if (typeof ext?.text === "string" && ext.text.trim()) return ext.text.trim();

    // Clique em botão nativo (interactiveMessage / nativeFlow).
    const btn = m.buttonsResponseMessage as Record<string, unknown> | undefined;
    if (typeof btn?.selectedDisplayText === "string") return btn.selectedDisplayText.trim();

    const tmpl = m.templateButtonReplyMessage as Record<string, unknown> | undefined;
    if (typeof tmpl?.selectedDisplayText === "string") return tmpl.selectedDisplayText.trim();

    const inter = m.interactiveResponseMessage as Record<string, unknown> | undefined;
    const nativeResp = inter?.nativeFlowResponseMessage as Record<string, unknown> | undefined;
    if (typeof nativeResp?.paramsJson === "string") {
        try {
            const p = JSON.parse(nativeResp.paramsJson) as Record<string, unknown>;
            const id = p.id;
            if (typeof id === "string") return id;
        } catch { /* ignora json malformado */ }
    }

    return "";
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;

/**
 * Classifica a resposta para decidir o tratamento.
 *
 * E-mail vem PRIMEIRO na ordem: se a pessoa escreve "confirmo, mas usa
 * outro@email.com", o que vale é o e-mail novo. Confirmar antes trataria como
 * "está certo" e o acesso iria pro endereço errado.
 */
function classificar(texto: string): "confirmou" | "email_novo" | "outro" {
    if (EMAIL_RE.test(texto)) return "email_novo";
    const t = texto.toLowerCase().trim();
    // "confirmo" é a palavra pedida; as demais cobrem quem responde à sua maneira.
    if (/^(confirmo|confirmado|sim|isso|ok|correto|certo|é esse|eh esse|esse mesmo|tá certo|ta certo)\b/.test(t)) {
        return "confirmou";
    }
    return "outro";
}

/**
 * Última compra de ingresso deste telefone — para saber se é comprador.
 *
 * ⚠️ Casa pelos últimos 8 dígitos porque o formato varia (com/sem DDI 55, com/sem
 * o 9º dígito). A busca por 8 dígitos absorve essas diferenças. Se ainda não
 * achar, tenta os últimos 8 SEM o nono dígito (celulares antigos gravados sem o 9).
 *
 * Bug histórico (23/07): compras gravadas ANTES do fix do checkout_phone ficaram
 * com whatsapp vazio no banco, então quem respondia CONFIRMO não era reconhecido
 * e o fluxo travava (caía em "encaminhado"). O fix do webhook da Hotmart resolve
 * pra frente; os registros antigos foram populados à mão.
 */
async function buscarComprador(fone: string) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return null;

    const so = fone.replace(/\D/g, "");
    // Chaves de busca em ordem de precisão: 8 últimos, e (fallback) sem o 9º dígito.
    const chaves = new Set<string>();
    if (so.length >= 8) chaves.add(so.slice(-8));
    if (so.length >= 9) chaves.add(so.slice(-11, -9) + so.slice(-8)); // DDD + 8 sem o 9

    for (const chave of chaves) {
        try {
            const res = await fetch(
                `${SUPABASE_URL}/rest/v1/hotmart_compras` +
                `?produto_id=eq.8124888&evento=eq.PURCHASE_APPROVED` +
                `&whatsapp=like.*${chave}*&select=nome,email,whatsapp&order=id.desc&limit=1`,
                { headers: { apikey: key, Authorization: `Bearer ${key}` } },
            );
            if (!res.ok) continue;
            const rows = await res.json();
            if (Array.isArray(rows) && rows[0]) return rows[0];
        } catch {
            /* tenta a próxima chave */
        }
    }
    return null;
}

/**
 * Registra o e-mail corrigido no banco. A coluna `email_corrigido` ainda NÃO
 * existe em `hotmart_compras` (verificado 22/07) — enquanto não existir, o PATCH
 * falha com PGRST204 e a correção vive só no alerta do Telegram, que é o que o
 * Red usa pra corrigir na Hotmart. Falhar aqui não pode travar o envio dos
 * passos 2 e 3, então o erro é apenas logado.
 *
 * Para ativar: ALTER TABLE hotmart_compras ADD COLUMN email_corrigido text;
 */
async function corrigirEmail(fone: string, emailNovo: string) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return;
    const ultimos8 = fone.slice(-8);
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/hotmart_compras` +
            `?produto_id=eq.8124888&evento=eq.PURCHASE_APPROVED&whatsapp=like.*${ultimos8}*`,
            {
                method: "PATCH",
                headers: {
                    apikey: key,
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                    Prefer: "return=minimal",
                },
                body: JSON.stringify({ email_corrigido: emailNovo.toLowerCase() }),
            },
        );
        if (!res.ok) console.error("[evolution] corrigirEmail:", res.status, await res.text());
    } catch (e) {
        console.error("[evolution] corrigirEmail:", e);
    }
}

async function telegram(msg: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chat) return;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text: msg, parse_mode: "Markdown" }),
    }).catch((e) => console.error("[evolution] telegram:", e));
}

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

    if (evento !== "messages.upsert") return NextResponse.json({ ok: true, ignorado: evento });

    const data = body.data as Record<string, unknown> | undefined;
    if (!data) return NextResponse.json({ ok: true, ignorado: "sem data" });

    const key = data.key as Record<string, unknown> | undefined;
    // fromMe = mensagem que NÓS enviamos ecoando de volta. Ignorar, senão o bot
    // responde a si mesmo em loop.
    if (key?.fromMe === true) return NextResponse.json({ ok: true, ignorado: "fromMe" });

    const remoteJid = String(key?.remoteJid ?? "");
    // Grupos (@g.us) não entram aqui — este fluxo é 1:1.
    if (!remoteJid.endsWith("@s.whatsapp.net")) {
        return NextResponse.json({ ok: true, ignorado: "não é 1:1" });
    }

    const fone = remoteJid.split("@")[0];
    const texto = extrairTexto(data);
    if (!texto) return NextResponse.json({ ok: true, ignorado: "sem texto" });

    const comprador = await buscarComprador(fone);
    // Não é comprador do ingresso → só avisa o Red, não automatiza nada.
    if (!comprador) {
        await telegram(`💬 *WhatsApp* (não é comprador do ingresso)\n\n📱 ${fone}\n\n"${texto.slice(0, 300)}"`);
        return NextResponse.json({ ok: true, tratado: "encaminhado" });
    }

    const nome = String(comprador.nome ?? "");
    const tipo = classificar(texto);

    if (tipo === "confirmou") {
        const r = await enviarMensagem(fone, passosRestantes(true, undefined, fone));
        await telegram(
            `✅ *E-mail confirmado — Desafio CRM*\n\n👤 ${nome}\n📱 ${fone}\n\n` +
            `${r.ok ? "Passos 2 e 3 enviados." : `⚠️ Falha ao enviar os passos: ${r.erro}`}`,
        );
        return NextResponse.json({ ok: true, tratado: "confirmou", enviou: r.ok });
    }

    if (tipo === "email_novo") {
        const emailNovo = (texto.match(EMAIL_RE) || [""])[0];
        await corrigirEmail(fone, emailNovo);
        const r = await enviarMensagem(fone, passosRestantes(false, emailNovo, fone));
        await telegram(
            `📧 *E-mail CORRIGIDO — Desafio CRM*\n\n👤 ${nome}\n📱 ${fone}\n` +
            `De: ${comprador.email}\nPara: *${emailNovo}*\n\n` +
            `⚠️ Corrigir também na Hotmart (o acesso vai pro e-mail da compra).\n` +
            `${r.ok ? "Passos 2 e 3 enviados." : `⚠️ Falha ao enviar: ${r.erro}`}`,
        );
        return NextResponse.json({ ok: true, tratado: "email_novo", enviou: r.ok });
    }

    // Qualquer outra coisa (dúvida, áudio, "não") → humano decide.
    await telegram(
        `💬 *Resposta de comprador — Desafio CRM*\n\n👤 ${nome}\n📱 ${fone}\n📧 ${comprador.email}\n\n` +
        `"${texto.slice(0, 400)}"\n\n_Responder manualmente._`,
    );
    return NextResponse.json({ ok: true, tratado: "encaminhado" });
}

export async function GET() {
    return NextResponse.json({ ok: true, servico: "webhook evolution · respostas do Desafio CRM" });
}
