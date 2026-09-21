import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { enviarMensagem } from "@/lib/whatsapp";
import { estadoInstancia } from "@/lib/evolution";
import { confirmarEmail, emailBoasVindas } from "@/lib/mensagens-crmweek";
import { emailConfirmacao as emailConfirmacaoHermesWeek, emailBoasVindas as emailBoasVindasHermesWeek, emailRecuperacao as emailRecuperacaoHermesWeek } from "@/lib/mensagens-hermesweek";
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
 *   RESEND_API_KEY ✅ (conferido na API da Vercel em 06/09/2026 — o aviso antigo de que
 *     não estava lá era falso e induzia erro em quem lia)
 *   RESEND_CRMWEEK_AUDIENCE_ID ✅ · RESEND_IAA_AUDIENCE_ID ✅ · RESEND_HERMESWEEK_AUDIENCE_ID ✅
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
    "8551535": "Oferta extra — 100 plugins do Hermes (R$27)",
    "8551609": "Oferta extra — 50 casos de uso do Hermes (R$37)",
    "8551624": "Oferta extra — Segundo cérebro com o Hermes (R$47)",
    "8552026": "De Um Agente a Um Squad (R$697)",
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

/* ----------------------------------------------------------------------------
 * RECUPERAÇÃO DE CARRINHO (ORION, 11/09/2026)
 * ----------------------------------------------------------------------------
 * Perda real que originou isto: em 10/09 um comprador gerou o Pix da Hermes
 * Week e o `PURCHASE_EXPIRED` entrou na madrugada seguinte. Os dois eventos
 * foram gravados e nada disparou.
 * -------------------------------------------------------------------------*/

/** Já existe compra APROVADA desse e-mail neste produto?
 *
 * Existe pra evitar o pior e-mail possível: dizer "seu pagamento não foi
 * concluído" pra quem gerou um Pix, deixou expirar e pagou de outro jeito (ou
 * comprou de novo). Na dúvida — se a consulta falhar — devolve `true` e o
 * e-mail NÃO sai: é melhor perder uma recuperação do que acusar um cliente. */
async function jaComprou(email: string, produtoId: string): Promise<boolean> {
    if (!email) return true;
    try {
        const url =
            `${SUPABASE_URL}/rest/v1/hotmart_compras` +
            `?email=eq.${encodeURIComponent(email)}` +
            `&produto_id=eq.${encodeURIComponent(produtoId)}` +
            `&evento=eq.PURCHASE_APPROVED&select=id&limit=1`;
        const key = process.env.SUPABASE_SERVICE_KEY;
        if (!key) return true;
        const res = await fetch(url, {
            headers: { apikey: key, Authorization: `Bearer ${key}` },
            cache: "no-store",
        });
        if (!res.ok) return true;
        const linhas = (await res.json()) as unknown[];
        return linhas.length > 0;
    } catch {
        return true;
    }
}

/** E-mail de recuperação. Lê o ciclo na hora, como os outros. */
async function enviarEmailRecuperacao(email: string, nome: string, motivo: "expirado" | "abandono" = "expirado") {
    const key = process.env.RESEND_API_KEY;
    if (!key || !email) return { ok: false, erro: "sem RESEND_API_KEY ou email" };
    const ciclo = await lerCicloAtual();
    const { subject, html } = emailRecuperacaoHermesWeek(nome, ciclo, motivo);
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from: REMETENTE, to: [email], subject, html }),
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

// Remetente único de todo e-mail transacional da Academy.
// O NOME é o que aparece na caixa de entrada; o endereço continua o mesmo
// (red@redpro.com.br, domínio verificado no Resend em sa-east-1).
// ⚠️ A FOTO do remetente não se define aqui: o Gmail puxa de Gravatar no
// endereço, ou de um registro BIMI no DNS. Trocar esta string não muda o avatar.
/* Remetente único de toda a operação (Red, 11/09/2026): centralizado em
 * `suporte@`, que é o ÚNICO endereço do domínio que também RECEBE.
 * Teste SMTP em 11/09 contra mx1.hostinger.com: `suporte@` e `victor.lima@`
 * aceitam (250); `red@`, `noreply@` e `contato@` rejeitam com 550 5.1.1.
 * Enquanto o remetente era `red@`, toda resposta de comprador voltava com
 * erro e ninguém ficava sabendo. */
const REMETENTE = "RedPro AI Academy <suporte@redpro.com.br>";

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
            body: JSON.stringify({ from: REMETENTE, to: [email], subject, html }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

/**
 * Data/hora do e-mail D+1: 09h BRT do dia seguinte à compra.
 *
 * Não é "agora + 24h" de propósito. Quem compra 3h da manhã receberia o
 * segundo e-mail 3h da manhã seguinte, no pior horário possível de abertura.
 * Ancorar num horário fixo protege a taxa de abertura e mantém a cadência
 * previsível independente da hora da venda.
 *
 * Formato: ISO 8601 com offset -03:00, que é o que o `scheduled_at` do Resend
 * aceita. O Brasil não tem horário de verão desde 2019, então o offset é fixo.
 */
function agendamentoD1(): string {
    const agoraBrt = new Date(Date.now() - 3 * 3600_000); // desloca UTC → BRT
    const amanha = new Date(agoraBrt);
    amanha.setUTCDate(amanha.getUTCDate() + 1);
    const y = amanha.getUTCFullYear();
    const m = String(amanha.getUTCMonth() + 1).padStart(2, "0");
    const d = String(amanha.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}T09:00:00-03:00`;
}

// E-MAIL 1 da Hermes Week — confirmação de compra, IMEDIATA no PURCHASE_APPROVED.
// Leva a ficha de matrícula (ação 1) e o grupo (ação 2), nessa ordem.
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
            body: JSON.stringify({ from: REMETENTE, to: [email], subject, html }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

// E-MAIL 2 da Hermes Week — boas-vindas + contexto, AGENDADO para D+1 09h BRT.
// Até 06/09/2026 saía junto com o e-mail 1 e chegava fora de ordem (o teste
// daquele dia registrou o e-mail 2 saindo 54ms antes do 1). Agora usa o
// `scheduled_at` nativo do Resend: nada de cron nem de fila própria.
async function enviarEmailBoasVindasHermesWeek(email: string, nome: string) {
    const key = process.env.RESEND_API_KEY;
    if (!key || !email) return { ok: false, erro: "sem RESEND_API_KEY ou email" };
    const ciclo = await lerCicloAtual();
    const { subject, html } = emailBoasVindasHermesWeek(nome, ciclo);
    const quando = agendamentoD1();
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from: REMETENTE, to: [email], subject, html, scheduled_at: quando }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true, agendado_para: quando };
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

        // 🔴 GATE DE PRODUTO NO CAPI (08/09/2026). O botão "testar" do painel da
        // Hotmart manda um PURCHASE_APPROVED completo, com produto id "0", e-mail
        // @example.com e valor R$1.500. Sem este gate, esse teste vira um evento
        // Purchase de R$1.500 no pixel — foi o que aconteceu hoje às 15h03, e um
        // evento de compra falso envenena justamente o sinal que a campanha usa
        // pra otimizar. O CAPI agora só dispara pra produto que existe no mapa.
        const produtoConhecido = Boolean(PRODUTOS[produtoId]);

        const [capi, lista, wpp, mail] = await Promise.all([
            produtoConhecido
                ? metaCapi(email, nome, fone, valor, moeda, transacao)
                : Promise.resolve({ ok: true as const }),
            resend(email, nome, produtoId),
            enviarWpp
                ? enviarMensagem(fone, confirmarEmail(nome, email, fone))
                : Promise.resolve(null),
            // E-mail de boas-vindas (rede de segurança grupo+ficha) só pro ingresso.
            ehIngresso ? enviarEmailBoasVindas(email, nome) : Promise.resolve(null),
        ]);

        /* ------------------------------------------------------------------
         * OS DOIS E-MAILS DA HERMES WEEK SAEM EM SÉRIE, NÃO EM PARALELO.
         * ------------------------------------------------------------------
         * O e-mail 2 já é agendado pra D+1 09h (`scheduled_at`), então em
         * condições normais nem competiria com o 1. Mas enquanto os dois
         * viviam no mesmo Promise.all, quem chegava primeiro na fila do Resend
         * era sorteio, e isso já mordeu duas vezes: em 06/09 o e-mail 2 saiu
         * 54ms antes do 1, e na simulação de 08/09 saiu 29ms antes. O comprador
         * recebia "O que esperar da Hermes Week" antes de "Você tá dentro".
         *
         * Em série, o e-mail 1 só é dado por enviado quando o Resend confirma,
         * e só então o 2 é agendado. Custa uma ida e volta a mais no webhook
         * (a Hotmart aceita bem: a resposta inteira leva ~3s), e em troca a
         * ordem deixa de depender de sorte ou de o agendamento funcionar.
         * ---------------------------------------------------------------- */
        const mailHW1 = ehHermesWeek ? await enviarEmailConfirmacaoHermesWeek(email, nome) : null;
        const mailHW2 = ehHermesWeek ? await enviarEmailBoasVindasHermesWeek(email, nome) : null;
        if (!produtoConhecido) {
            console.warn(`[hotmart] produto ${produtoId} fora do mapa — CAPI ignorado (evento de teste?)`);
        }
        if (!capi.ok) console.error("[hotmart] CAPI:", "erro" in capi ? capi.erro : "");
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

        // O e-mail 2 é AGENDADO pra D+1 09h BRT, não enviado agora — o texto precisa
        // dizer isso, senão o Red procura na caixa de entrada uma coisa que só sai amanhã.
        const statusEmailHW = !ehHermesWeek
            ? ""
            : ` · ${mailHW1?.ok ? "✅" : "⚠️"} e-mail 1 · ${mailHW2?.ok ? `🗓️ e-mail 2 agendado ${(mailHW2 as { agendado_para?: string }).agendado_para ?? "D+1"}` : "⚠️ e-mail 2 não agendou"}`;

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

        /* 🔴 CORRIGIDO 14/09/2026 (ZENITH): este return era incondicional e matava a
         * recuperação da Hermes Week. O bloco abaixo trata
         * `PURCHASE_OUT_OF_SHOPPING_CART && PRODUTO_HERMES_WEEK`, mas nunca era
         * alcançado — o abandono da Week caía aqui, não batia em nenhum `if`
         * (a condição compara com PRODUTO_INGRESSO, que é a CRM Week) e retornava
         * em silêncio. Custou pelo menos uma recuperação: Gustavo Monteiro
         * abandonou em 12/09 14:07 e não recebeu e-mail nenhum.
         * A Week agora NÃO retorna aqui — cai no bloco de recuperação por e-mail. */
        if (produtoId !== PRODUTO_HERMES_WEEK) {
            return NextResponse.json({ ok: true, evento, gravou: gravou.ok, enfileirado: ehIngressoAbandono && Boolean(fone) });
        }
    }

    /* ------------------------------------------------------------------
     * CARRINHO QUE NÃO FECHOU — Hermes Week
     * ------------------------------------------------------------------
     * Dois eventos entram aqui:
     *   PURCHASE_EXPIRED            → gerou Pix/boleto e o código venceu
     *   PURCHASE_OUT_OF_SHOPPING_CART → abandonou o checkout (Hermes Week)
     *
     * O abandono do ingresso da CRM Week continua no bloco abaixo, por
     * WhatsApp. Aqui é e-mail, porque a instância da Evolution está
     * desconectada e e-mail é o único canal da Hermes Week que está provado.
     * ---------------------------------------------------------------- */
    const recuperavel =
        evento === "PURCHASE_EXPIRED" ||
        (evento === "PURCHASE_OUT_OF_SHOPPING_CART" && produtoId === PRODUTO_HERMES_WEEK);

    if (recuperavel && produtoId === PRODUTO_HERMES_WEEK) {
        const comprou = await jaComprou(email, produtoId);

        if (comprou) {
            // Já pagou (ou a consulta falhou). Não manda nada: dizer "você não
            // concluiu" pra quem concluiu é pior que não mandar.
            await telegram(
                `🟡 *${evento}* — ${produtoNome}\n\n👤 ${nome || "—"}\n📧 ${email || "—"}\n\n` +
                `↩️ recuperação NÃO enviada: já existe compra aprovada desse e-mail (ou a checagem falhou)`,
            );
            return NextResponse.json({ ok: true, evento, gravou: gravou.ok, recuperacao: "ignorada" });
        }

        const rec = await enviarEmailRecuperacao(
            email,
            nome,
            evento === "PURCHASE_OUT_OF_SHOPPING_CART" ? "abandono" : "expirado",
        );
        if (!rec.ok) console.error("[hotmart] e-mail de recuperação:", rec.erro);

        await telegram(
            `🛒 *Carrinho não fechou* — ${produtoNome}\n\n` +
            `👤 ${nome || "—"}\n📧 ${email || "—"}\n💵 ${moeda} ${valor.toFixed(2)}\n` +
            `📌 evento: ${evento}\n\n` +
            `${rec.ok ? "✅ e-mail de recuperação enviado" : `⚠️ falha no e-mail: ${rec.erro}`}`,
        );

        return NextResponse.json({ ok: true, evento, gravou: gravou.ok, recuperacao: rec.ok });
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
