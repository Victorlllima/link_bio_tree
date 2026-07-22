import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { enviarWhatsApp } from "@/lib/evolution";
import { confirmarEmail } from "@/lib/mensagens-crmweek";

/**
 * Webhook da Hotmart — hub de pós-compra.
 *
 * ⚠️ CONTEXTO: existia uma versão disso em `Starlight/starlight-ai/onboarding/` (commit 645d412),
 * que MORREU quando a VPS foi descontinuada em 01/06/2026. Esta é a reescrita em link_bio_tree
 * (Vercel), enxuta: sem o sistema de score do produto Starlight, que não existe mais.
 *
 * O que faz em PURCHASE_APPROVED:
 *   1. Grava a compra no Supabase (idempotente por transação+evento)
 *   2. Dispara Purchase para a Meta CAPI (fecha o rastreamento do tráfego pago)
 *   3. Inscreve o comprador na audiência do Resend
 *   4. Notifica o Red no Telegram
 *
 * Cancelamento/reembolso: grava e avisa (sem CAPI — a Meta não recebe estorno por aqui).
 *
 * ENV (nomes alinhados com o que já existe na Vercel — ver /api/meta-capi):
 *   HOTMART_HOTTOK ✅ · SUPABASE_SERVICE_KEY ✅ · TELEGRAM_BOT_TOKEN ✅ · TELEGRAM_CHAT_ID ✅
 *   META_CAPI_ACCESS_TOKEN ✅ (pixel é hardcoded, igual /api/meta-capi)
 *   RESEND_API_KEY ⚠️ não está na Vercel — sem ela o comprador não entra na lista
 *   RESEND_CRMWEEK_AUDIENCE_ID → RESEND_AUDIENCE_ID → RESEND_SHARK_AUDIENCE_ID (fallback)
 *
 * Nada disso derruba o webhook: cada serviço falha isolado, loga, e o Telegram avisa com ⚠️.
 */

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";

// Pixel [Vibecoding] — fixo, mesmo valor usado em /api/meta-capi.
const PIXEL_ID = "1543917230170877";

// Produtos (ver .claude/workspace/hotmart_doc.md)
const PRODUTOS: Record<string, string> = {
    "8039631": "IAA — Introdução à Automação (R$17)",
    "8124888": "Ingresso — Desafio CRM em 5 Dias (R$44)",
    "7646318": "Claude for Business",
};

// Quem compra o ingresso recebe as boas-vindas por WhatsApp (3 passos do Tabari).
const PRODUTO_INGRESSO = "8124888";

const sha256 = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

// Só dígitos, com DDI 55 — formato que a Meta espera no telefone.
function normalizarFone(f: string) {
    const d = (f || "").replace(/\D/g, "");
    if (!d) return "";
    return d.startsWith("55") ? d : `55${d}`;
}

async function gravar(row: Record<string, unknown>) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return { ok: false, erro: "SUPABASE_SERVICE_KEY ausente" };
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/hotmart_compras?on_conflict=transacao,evento`, {
            method: "POST",
            headers: {
                apikey: key,
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                Prefer: "resolution=merge-duplicates,return=minimal",
            },
            body: JSON.stringify(row),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

// event_id = transação da Hotmart → a Meta deduplica contra o Purchase do pixel no browser.
async function metaCapi(email: string, nome: string, fone: string, valor: number, moeda: string, eventId: string) {
    // Nome da var alinhado com /api/meta-capi, que já roda em produção.
    const token = process.env.META_CAPI_ACCESS_TOKEN || process.env.META_CAPI_TOKEN;
    const pixel = PIXEL_ID;
    if (!token) return { ok: false, erro: "META_CAPI_ACCESS_TOKEN ausente" };

    const user_data: Record<string, string[]> = {};
    if (email) user_data.em = [sha256(email)];
    if (nome) user_data.fn = [sha256(nome.split(" ")[0])];
    const ph = normalizarFone(fone);
    if (ph) user_data.ph = [sha256(ph)];

    try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: [{
                    event_name: "Purchase",
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    event_id: eventId,
                    user_data,
                    custom_data: { value: valor, currency: moeda },
                }],
            }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

async function resend(email: string, nome: string) {
    const key = process.env.RESEND_API_KEY;
    // Ordem de preferência: audiência própria do CRM Week → genérica → a da Formação (fallback).
    const audiencia =
        process.env.RESEND_CRMWEEK_AUDIENCE_ID ||
        process.env.RESEND_AUDIENCE_ID ||
        process.env.RESEND_SHARK_AUDIENCE_ID;
    if (!key) return { ok: false, erro: "RESEND_API_KEY ausente" };
    if (!audiencia) return { ok: false, erro: "nenhuma RESEND_*_AUDIENCE_ID configurada" };
    if (!email) return { ok: false, erro: "sem email" };
    try {
        const res = await fetch(`https://api.resend.com/audiences/${audiencia}/contacts`, {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ email, first_name: nome.split(" ")[0] || "", unsubscribed: false }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
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
    }).catch((e) => console.error("[hotmart] telegram:", e));
}

export async function POST(req: NextRequest) {
    const HOTTOK = process.env.HOTMART_HOTTOK;
    const recebido = req.headers.get("x-hotmart-hottok") || req.headers.get("x-hotmart-webhook-token");

    // Sem token configurado em produção = recusa (não aceita webhook não autenticado).
    if (!HOTTOK) {
        console.error("[hotmart] HOTMART_HOTTOK não configurado");
        return NextResponse.json({ error: "webhook token not configured" }, { status: 401 });
    }
    if (recebido !== HOTTOK) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    const evento = String(body.event ?? "");
    const data = body.data as Record<string, unknown> | undefined;
    const buyer = data?.buyer as Record<string, unknown> | undefined;
    const product = data?.product as Record<string, unknown> | undefined;
    const purchase = data?.purchase as Record<string, unknown> | undefined;
    const price = purchase?.price as Record<string, unknown> | undefined;

    const email = String(buyer?.email ?? "");
    const nome = String(buyer?.name ?? "");
    const fone = String(buyer?.phone ?? buyer?.cellphone ?? "");
    const produtoId = String(product?.id ?? "");
    const produtoNome = PRODUTOS[produtoId] || String(product?.name ?? "—");
    const valor = Number(price?.value ?? 0);
    const moeda = String(price?.currency_value ?? "BRL");
    const transacao = String(purchase?.transaction ?? `sem-tx-${Date.now()}`);

    console.log(`[hotmart] ${evento} · produto=${produtoId} · email=${email} · tx=${transacao}`);

    // Grava sempre — qualquer evento vira histórico. Idempotente por (transacao, evento).
    const gravou = await gravar({
        transacao,
        evento,
        produto_id: produtoId,
        produto_nome: produtoNome,
        nome,
        email: email.toLowerCase(),
        whatsapp: fone,
        valor,
        moeda,
        payload: body,
    });
    if (!gravou.ok) console.error("[hotmart] falha ao gravar:", gravou.erro);

    if (evento === "PURCHASE_APPROVED") {
        // WhatsApp só pro ingresso do Desafio, e só se a Hotmart mandou telefone.
        // Aqui vai a MENSAGEM 1: uma pergunta de um toque (confirma o e-mail).
        // Os passos 2 e 3 saem em /api/webhooks/evolution, quando a pessoa responde —
        // resposta primeiro abre a janela de 24h e protege o número do banimento.
        const ehIngresso = produtoId === PRODUTO_INGRESSO;
        const enviarWpp = ehIngresso && Boolean(fone);

        const [capi, lista, wpp] = await Promise.all([
            metaCapi(email, nome, fone, valor, moeda, transacao),
            resend(email, nome),
            enviarWpp
                ? enviarWhatsApp(fone, confirmarEmail(nome, email))
                : Promise.resolve(null),
        ]);
        if (!capi.ok) console.error("[hotmart] CAPI:", capi.erro);
        if (!lista.ok) console.error("[hotmart] Resend:", lista.erro);
        if (wpp && !wpp.ok) console.error("[hotmart] WhatsApp:", wpp.erro);

        // Sem telefone no ingresso o comprador fica órfão da mensageria — precisa
        // aparecer no alerta, senão passa despercebido até o dia da aula.
        const statusWpp = !ehIngresso
            ? ""
            : !fone
                ? " · 🔴 WhatsApp: comprador SEM telefone"
                : wpp?.ok
                    ? " · ✅ WhatsApp"
                    : " · ⚠️ WhatsApp falhou";

        await telegram([
            `💰 *VENDA — ${produtoNome}*`,
            "",
            `👤 ${nome}`,
            `📧 ${email}`,
            fone ? `📱 ${fone}` : "",
            `💵 ${moeda} ${valor.toFixed(2)}`,
            "",
            `${gravou.ok ? "✅" : "⚠️"} banco · ${capi.ok ? "✅" : "⚠️"} Meta CAPI · ${lista.ok ? "✅" : "⚠️"} Resend${statusWpp}`,
        ].filter(Boolean).join("\n"));

        return NextResponse.json({
            ok: true, evento, gravou: gravou.ok, capi: capi.ok, resend: lista.ok,
            whatsapp: wpp ? wpp.ok : null,
        });
    }

    if (evento === "PURCHASE_CANCELED" || evento === "PURCHASE_REFUNDED" || evento === "PURCHASE_CHARGEBACK") {
        await telegram(`🔴 *${evento}* — ${produtoNome}\n\n👤 ${nome}\n📧 ${email}\n💵 ${moeda} ${valor.toFixed(2)}`);
        return NextResponse.json({ ok: true, evento, gravou: gravou.ok });
    }

    // Demais eventos (PURCHASE_COMPLETE, PURCHASE_BILLET_PRINTED, etc): só registra.
    return NextResponse.json({ ok: true, evento, gravou: gravou.ok });
}

// A Hotmart faz um GET de verificação ao cadastrar a URL.
export async function GET() {
    return NextResponse.json({ ok: true, servico: "webhook hotmart · redpro" });
}
