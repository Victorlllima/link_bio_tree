import { NextRequest, NextResponse } from "next/server";
import { enviarWhatsApp } from "@/lib/evolution";
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

/** Classifica a resposta para decidir o tratamento. */
function classificar(texto: string): "confirmou" | "email_novo" | "outro" {
    const t = texto.toLowerCase().trim();
    if (/^(email_ok|sim|s|isso|ok|confirmo|correto|certo|é esse|eh esse)\b/.test(t)) return "confirmou";
    if (/^(email_corrigir)\b/.test(t)) return "outro"; // pediu pra corrigir mas ainda não mandou
    if (EMAIL_RE.test(texto)) return "email_novo";
    return "outro";
}

/** Última compra de ingresso deste telefone — para saber se é comprador. */
async function buscarComprador(fone: string) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return null;
    const ultimos8 = fone.slice(-8);
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/hotmart_compras` +
            `?produto_id=eq.8124888&evento=eq.PURCHASE_APPROVED` +
            `&whatsapp=like.*${ultimos8}*&select=nome,email,whatsapp&order=id.desc&limit=1`,
            { headers: { apikey: key, Authorization: `Bearer ${key}` } },
        );
        if (!res.ok) return null;
        const rows = await res.json();
        return Array.isArray(rows) && rows[0] ? rows[0] : null;
    } catch {
        return null;
    }
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

export async function POST(req: NextRequest) {
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: true, ignorado: "json inválido" });
    }

    const evento = String(body.event ?? "");
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
        const r = await enviarWhatsApp(fone, passosRestantes(true));
        await telegram(
            `✅ *E-mail confirmado — Desafio CRM*\n\n👤 ${nome}\n📱 ${fone}\n\n` +
            `${r.ok ? "Passos 2 e 3 enviados." : `⚠️ Falha ao enviar os passos: ${r.erro}`}`,
        );
        return NextResponse.json({ ok: true, tratado: "confirmou", enviou: r.ok });
    }

    if (tipo === "email_novo") {
        const emailNovo = (texto.match(EMAIL_RE) || [""])[0];
        await corrigirEmail(fone, emailNovo);
        const r = await enviarWhatsApp(fone, passosRestantes(false, emailNovo));
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
