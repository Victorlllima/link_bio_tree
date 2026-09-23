import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// FICHA DE INTERESSE — HERMES WEEK (abre na aula 4, quinta 20h).
// Mesmo motor de /api/crm-week-status: mesma tabela `crm_week_status`, mesmo painel /lpsg.
// O que muda: as opções são do Hermético, e existe uma 5ª resposta — a pergunta de valor
// ancorado (R$1.397, dobro do preço real de R$697), que é o termômetro do Tabari.

const EXECUCAO: Record<string, string> = {
    "no-ar": "Agente de pé, usa todo dia 🔥",
    construindo: "Instalou, construindo junto",
    assistindo: "Só assistindo",
    atrasado: "Ainda não instalou",
};

const INTENCAO: Record<string, string> = {
    "viver-disso": "Montar para outras empresas e cobrar 🔥",
    "minha-empresa": "Time de agentes no próprio negócio",
    "renda-extra": "Tirar trabalho repetitivo das costas",
    "nao-sei": "Ainda não sabe",
};

const QUANDO: Record<string, string> = {
    agora: "AGORA — esta semana 🔥",
    mes: "Próximos 30 dias",
    trimestre: "Próximos 3 meses",
    "sem-pressa": "Sem pressa",
};

const VALOR: Record<string, string> = {
    sim: "Investiria R$1.397 🔥",
    talvez: "Precisa ver o que tem dentro",
    nao: "Não investiria esse valor",
};

// Qualifica em HOT / WARM / COLD. Quatro sinais, 12 pontos: execução (quem constrói compra),
// intenção, urgência e disposição a pagar no valor ancorado. A divisão que o Tabari considera
// saudável na pergunta de valor é 20% sim / 60% talvez / 20% não.
function qualificar(d: Record<string, string>): { tag: "HOT" | "WARM" | "COLD"; score: number } {
    let score = 0;

    if (d.execucao === "no-ar") score += 3;
    else if (d.execucao === "construindo") score += 2;
    else if (d.execucao === "assistindo") score += 1;

    if (d.intencao === "viver-disso") score += 3;
    else if (d.intencao === "minha-empresa") score += 3;
    else if (d.intencao === "renda-extra") score += 2;

    if (d.quando === "agora") score += 3;
    else if (d.quando === "mes") score += 2;
    else if (d.quando === "trimestre") score += 1;

    if (d.valor === "sim") score += 3;
    else if (d.valor === "talvez") score += 1;

    const tag = score >= 9 ? "HOT" : score >= 5 ? "WARM" : "COLD";
    return { tag, score };
}

const SUPABASE_URL = "https://supabase.redpro.com.br";
// Ciclo = a segunda que abre a inscrição. Trocar a cada ciclo novo.
const CICLO = "2026-09-28";

async function salvar(d: Record<string, string>, tag: string, score: number) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return { ok: false, erro: "SUPABASE_SERVICE_KEY ausente" };
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/crm_week_status?on_conflict=ciclo,email`,
            {
                method: "POST",
                headers: {
                    apikey: key,
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                    Prefer: "resolution=merge-duplicates,return=minimal",
                },
                body: JSON.stringify({
                    ciclo: CICLO,
                    nome: d.nome,
                    email: (d.email || "").toLowerCase().trim(),
                    whatsapp: d.whatsapp,
                    execucao: d.execucao || null,
                    intencao: d.intencao || null,
                    quando: d.quando || null,
                    valor: d.valor || null,
                    trava: d.trava || null,
                    tag,
                    score,
                }),
            },
        );
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { tag, score } = qualificar(data);

        // Persistir ANTES de notificar: o dado no banco é o que sobrevive.
        const gravou = await salvar(data, tag, score);
        if (!gravou.ok) console.error("hermes-week-interesse: falha ao gravar —", gravou.erro);

        const emoji = tag === "HOT" ? "🔥" : tag === "WARM" ? "🟡" : "🔵";
        const msg = [
            `${emoji} *Ficha de interesse (Hermes Week) — lead ${tag}* (score ${score}/12)`,
            gravou.ok ? "" : "⚠️ _não gravou no banco — ver logs_",
            "",
            `👤 *Nome:* ${data.nome || "—"}`,
            `📧 *Email:* ${data.email || "—"}`,
            `📱 *WhatsApp:* ${data.whatsapp || "—"}`,
            "",
            `🔨 *1. Construiu até aqui:* ${EXECUCAO[data.execucao] || data.execucao || "—"}`,
            `🎯 *2. Quer fazer com o agente:* ${INTENCAO[data.intencao] || data.intencao || "—"}`,
            `⏱️ *3. Quer dar o passo:* ${QUANDO[data.quando] || data.quando || "—"}`,
            `💰 *4. Valor ancorado:* ${VALOR[data.valor] || data.valor || "—"}`,
            "",
            `😤 *5. O que ainda impede:*\n${data.trava || "—"}`,
        ].filter(Boolean).join("\n");

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" }),
            });
        }

        return NextResponse.json({ ok: true, tag });
    } catch (err) {
        console.error("hermes-week-interesse route error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
