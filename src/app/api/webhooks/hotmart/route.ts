import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { enviarMensagem } from "@/lib/whatsapp";
import { estadoInstancia } from "@/lib/evolution";
import { confirmarEmail, emailBoasVindas } from "@/lib/mensagens-crmweek";
import { emailConfirmacao as emailConfirmacaoHermesWeek, emailBoasVindas as emailBoasVindasHermesWeek } from "@/lib/mensagens-hermesweek";
import { lerCicloAtual } from "@/lib/ciclo-atual";
import { enfileirar } from "@/lib/wpp-fila";

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
    "8443182": "Ingresso — Hermes Week (R$62)",
};

// Quem compra o ingresso recebe as boas-vindas por WhatsApp (3 passos do Tabari).
const PRODUTO_INGRESSO = "8124888";
const PRODUTO_HERMES_WEEK = "8443182";

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

// Cada produto tem sua audiência no Resend — segmentação por produto, igual ao
// WhatsApp. Antes TODO comprador caía na lista do CRM Week (bug): quem comprava
// só o IAA recebia o e-mail de aluno do evento. IDs verificados na API 23/07.
const AUDIENCIA_POR_PRODUTO: Record<string, string | undefined> = {
    "8124888": process.env.RESEND_CRMWEEK_AUDIENCE_ID,   // Ingresso → crm-week-ingresso
    "8039631": process.env.RESEND_IAA_AUDIENCE_ID,       // IAA → compradores-r17
    "8443182": process.env.RESEND_HERMESWEEK_AUDIENCE_ID, // Ingresso → Hermes Week (criar audiência nova no Resend, ver HERMES/CHECKLIST-VIRADA-CICLO.md)
};

async function resend(email: string, nome: string, produtoId: string) {
    const key = process.env.RESEND_API_KEY;
    // Audiência do produto. Sem mapa → não inscreve em lista nenhuma (melhor não
    // inscrever do que inscrever na lista errada e mandar a mensagem errada).
    const audiencia = AUDIENCIA_POR_PRODUTO[produtoId];
    if (!key) return { ok: false, erro: "RESEND_API_KEY ausente" };
    if (!audiencia) return { ok: false, erro: `sem audiência mapeada pro produto ${produtoId}` };
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

// ENVIA o e-mail de boas-vindas (rede de segurança: grupo + ficha). Diferente de resend(),
// que só inscreve na audiência sem disparar nada.
async function enviarEmailBoasVindas(email: string, nome: string) {
    const key = process.env.RESEND_API_KEY;
    if (!key || !email) return { ok: false, erro: "sem RESEND_API_KEY ou email" };
    const { subject, html } = emailBoasVindas(nome);
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from: "Red · RedPro Academy <red@redpro.com.br>", to: [email], subject, html }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

// E-MAIL 1 da Hermes Week — confirmação de compra (disparado no PURCHASE_APPROVED).
// Lê data_inicio/link_grupo da tabela ciclo_atual (Alfred escreve toda sexta).
async function enviarEmailConfirmacaoHermesWeek(email: string, nome: string) {
    const key = process.env.RESEND_API_KEY;
    if (!key || !email) return { ok: false, erro: "sem RESEND_API_KEY ou email" };
    const ciclo = await lerCicloAtual();
    const { subject, html } = emailConfirmacaoHermesWeek(nome, ciclo);
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from: "Red · RedPro Academy <red@redpro.com.br>", to: [email], subject, html }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

// E-MAIL 2 da Hermes Week — boas-vindas + contexto, D+1 após compra.
// Hoje disparado junto com o e-mail 1 no PURCHASE_APPROVED (sem scheduler de
// D+1 implementado ainda) — ver pendência no CHECKLIST-VIRADA-CICLO.md.
async function enviarEmailBoasVindasHermesWeek(email: string, nome: string) {
    const key = process.env.RESEND_API_KEY;
    if (!key || !email) return { ok: false, erro: "sem RESEND_API_KEY ou email" };
    const ciclo = await lerCicloAtual();
    const { subject, html } = emailBoasVindasHermesWeek(nome, ciclo);
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from: "Red · RedPro Academy <red@redpro.com.br>", to: [email], subject, html }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
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
    // ⚠️ A Hotmart manda o telefone em buyer.checkout_phone, NÃO em phone/cellphone
    // (esses não existem no payload real — verificado 23/07 nas compras de Gleyce e
    // Emidio, que ficaram sem o WhatsApp da RedPro por isso). E ATENÇÃO:
    // checkout_phone JÁ inclui o DDD (ex: "87992052920"), então NÃO concatenar com
    // checkout_phone_code — isso duplicaria o DDD. normalizarDestino acrescenta o 55.
    const fone = String(
        buyer?.checkout_phone ?? buyer?.phone ?? buyer?.cellphone ?? "",
    );
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
        const ehHermesWeek = produtoId === PRODUTO_HERMES_WEEK;
        const enviarWpp = ehIngresso && Boolean(fone);

        const [capi, lista, wpp, mail, mailHW1, mailHW2] = await Promise.all([
            metaCapi(email, nome, fone, valor, moeda, transacao),
            resend(email, nome, produtoId),
            enviarWpp
                ? enviarMensagem(fone, confirmarEmail(nome, email, fone))
                : Promise.resolve(null),
            // E-mail de boas-vindas (rede de segurança grupo+ficha) só pro ingresso.
            ehIngresso ? enviarEmailBoasVindas(email, nome) : Promise.resolve(null),
            // Hermes Week — e-mail 1 (confirmação) e e-mail 2 (boas-vindas) juntos por
            // enquanto: sem scheduler de D+1 implementado ainda, ver CHECKLIST-VIRADA-CICLO.md.
            ehHermesWeek ? enviarEmailConfirmacaoHermesWeek(email, nome) : Promise.resolve(null),
            ehHermesWeek ? enviarEmailBoasVindasHermesWeek(email, nome) : Promise.resolve(null),
        ]);
        if (!capi.ok) console.error("[hotmart] CAPI:", capi.erro);
        if (!lista.ok) console.error("[hotmart] Resend audiência:", lista.erro);
        if (wpp && !wpp.ok) console.error("[hotmart] WhatsApp:", wpp.erro);
        if (mail && !mail.ok) console.error("[hotmart] e-mail boas-vindas:", mail.erro);
        if (mailHW1 && !mailHW1.ok) console.error("[hotmart] e-mail 1 Hermes Week:", mailHW1.erro);
        if (mailHW2 && !mailHW2.ok) console.error("[hotmart] e-mail 2 Hermes Week:", mailHW2.erro);

        // 🔴 ALERTA ANTI-SILÊNCIO — dispara ANTES do resumo de venda e SEPARADO dele.
        // Contexto (25/07/2026, ION): a 1ª venda real do CRM Week saiu, mas o WhatsApp
        // de boas-vindas NÃO foi entregue — a instância Evolution estava `close` e a
        // falha só virava um "⚠️ WhatsApp falhou" perdido no rodapé da msg de sucesso.
        // Ninguém percebeu. Agora, se o WhatsApp do ingresso falhar (ou o comprador vier
        // sem telefone), o Red recebe um alerta próprio, chamativo, com o estado real da
        // instância — pra saber na hora se precisa reconectar (ler o QR no celular).
        if (ehIngresso && (!fone || (wpp && !wpp.ok))) {
            // Consulta o estado real da instância na fonte — não adianta chutar.
            const estado = fone ? await estadoInstancia() : null;
            const diagInstancia = estado
                ? estado.ok
                    ? estado.estado === "open"
                        ? "🟢 instância `open` (conectada) — a falha NÃO é de conexão, investigar o número/mensagem"
                        : `🔴 instância *${estado.estado ?? "?"}* — WhatsApp DESCONECTADO, precisa reconectar (ler o QR no celular)`
                    : `⚠️ não consegui checar o estado da instância: ${estado.erro}`
                : "";

            await telegram([
                "🔴🔴 *WHATSAPP DE BOAS-VINDAS NÃO SAIU* 🔴🔴",
                "",
                `Comprou o *ingresso* mas NÃO recebeu a mensagem 1:`,
                `👤 ${nome || "—"}`,
                fone ? `📱 ${fone}` : "📱 🔴 comprador SEM telefone no cadastro",
                `📧 ${email || "—"}`,
                "",
                fone ? `Erro do envio: \`${wpp?.erro ?? "—"}\`` : "",
                diagInstancia,
                "",
                "➡️ *Ação:* reconecta a `academy-suporte` (QR no WhatsApp) e, se quiser, reenvia a msg 1 manualmente.",
            ].filter(Boolean).join("\n"));
        }

        // Sem telefone no ingresso o comprador fica órfão da mensageria — precisa
        // aparecer no alerta, senão passa despercebido até o dia da aula.
        const statusWpp = !ehIngresso
            ? ""
            : !fone
                ? " · 🔴 WhatsApp: comprador SEM telefone"
                : wpp?.ok
                    ? " · ✅ WhatsApp"
                    : " · ⚠️ WhatsApp falhou";

        const statusEmailHW = !ehHermesWeek
            ? ""
            : ` · ${mailHW1?.ok ? "✅" : "⚠️"} e-mail 1 · ${mailHW2?.ok ? "✅" : "⚠️"} e-mail 2`;

        await telegram([
            `💰 *VENDA — ${produtoNome}*`,
            "",
            `👤 ${nome}`,
            `📧 ${email}`,
            fone ? `📱 ${fone}` : "",
            `💵 ${moeda} ${valor.toFixed(2)}`,
            "",
            `${gravou.ok ? "✅" : "⚠️"} banco · ${capi.ok ? "✅" : "⚠️"} Meta CAPI · ${lista.ok ? "✅" : "⚠️"} Resend${statusWpp}${ehIngresso ? ` · ${mail?.ok ? "✅" : "⚠️"} e-mail` : ""}${statusEmailHW}`,
        ].filter(Boolean).join("\n"));

        return NextResponse.json({
            ok: true, evento, gravou: gravou.ok, capi: capi.ok, resend: lista.ok,
            email_boas_vindas: ehIngresso ? (mail?.ok ?? false) : null,
            email_hermes_week: ehHermesWeek ? { e1: mailHW1?.ok ?? false, e2: mailHW2?.ok ?? false } : null,
            whatsapp: wpp ? wpp.ok : null,
        });
    }

    if (evento === "PURCHASE_OUT_OF_SHOPPING_CART") {
        // Abandono de checkout. Payload diferente do de compra: sem
        // purchase/price (ninguém pagou ainda) — `fone` já cobre buyer.phone
        // como fallback (linha acima). Ver developers.hotmart.com/.../cart-abandonment-webhook.
        const ehIngressoAbandono = produtoId === PRODUTO_INGRESSO;

        if (ehIngressoAbandono && fone) {
            // Approval gate: só enfileira. O envio de verdade depende de
            // "crmweek-c1-abandono" estar em WPP_CAMPANHAS_ATIVAS (Vercel) — a
            // mesma trava que protege as outras campanhas de disparo em massa.
            const r = await enfileirar("crmweek-c1-abandono", [
                { telefone: fone.replace(/\D/g, ""), nome },
            ]);
            if (!r.ok) console.error("[hotmart] enfileirar abandono:", r.erro);
            await telegram(
                `🟡 *Abandono de checkout* — ${produtoNome}\n\n` +
                `👤 ${nome || "—"}\n📱 ${fone || "—"}\n📧 ${email || "—"}\n\n` +
                `${r.ok ? "✅ enfileirado pra recuperação (crmweek-c1-abandono)" : `⚠️ falha ao enfileirar: ${r.erro}`}`,
            );
        } else if (ehIngressoAbandono) {
            // Abandonou mas a Hotmart não mandou telefone — não dá pra recuperar por WhatsApp.
            await telegram(`🟡 *Abandono de checkout* — ${produtoNome}\n\n👤 ${nome || "—"}\n📧 ${email || "—"}\n\n📱 sem telefone — recuperação por WhatsApp não é possível.`);
        }

        return NextResponse.json({ ok: true, evento, gravou: gravou.ok, enfileirado: ehIngressoAbandono && Boolean(fone) });
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
