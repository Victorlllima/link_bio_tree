import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EXECUCAO: Record<string, string> = {
    "no-ar": "CRM já no ar, com link 🔥",
    construindo: "Construindo, acompanhando",
    assistindo: "Só assistindo",
    atrasado: "Ainda não começou",
};

const INTENCAO: Record<string, string> = {
    "viver-disso": "Viver disso — cobrar de empresas 🔥",
    "renda-extra": "Renda extra por fora",
    "minha-empresa": "Usar no próprio negócio",
    "nao-sei": "Ainda não sabe",
};

const QUANDO: Record<string, string> = {
    agora: "AGORA — essa semana 🔥",
    mes: "Próximos 30 dias",
    trimestre: "Próximos 3 meses",
    "sem-pressa": "Sem pressa",
};

// Qualifica o lead em HOT / WARM / COLD a partir das 4 perguntas MQL (padrão Tabari — separa
// curioso de comprador). Os 3 sinais que mais pesam: EXECUÇÃO (quem constrói compra),
// INTENÇÃO (quer viver disso) e URGÊNCIA (quer começar agora).
function qualificar(d: Record<string, string>): "HOT" | "WARM" | "COLD" {
    let score = 0;

    // 1. Execução — quem já pôs a mão na massa é quem compra o próximo passo
    if (d.execucao === "no-ar") score += 3;
    else if (d.execucao === "construindo") score += 2;
    else if (d.execucao === "assistindo") score += 1;

    // 2. Intenção — quer transformar isso em receita
    if (d.intencao === "viver-disso") score += 3;
    else if (d.intencao === "renda-extra") score += 2;
    else if (d.intencao === "minha-empresa") score += 1;

    // 3. Urgência — o sinal mais forte de compra imediata
    if (d.quando === "agora") score += 3;
    else if (d.quando === "mes") score += 2;
    else if (d.quando === "trimestre") score += 1;

    if (score >= 7) return "HOT";
    if (score >= 4) return "WARM";
    return "COLD";
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const tag = qualificar(data);

        const emoji = tag === "HOT" ? "🔥" : tag === "WARM" ? "🟡" : "🔵";
        const msg = [
            `${emoji} *Ficha de interesse LPSG — lead ${tag}*`,
            "",
            `👤 *Nome:* ${data.nome || "—"}`,
            `📧 *Email:* ${data.email || "—"}`,
            `📱 *WhatsApp:* ${data.whatsapp || "—"}`,
            "",
            `🔨 *1. Executou até aqui:* ${EXECUCAO[data.execucao] || data.execucao || "—"}`,
            `🎯 *2. Quer fazer com isso:* ${INTENCAO[data.intencao] || data.intencao || "—"}`,
            `⏱️ *3. Quer começar:* ${QUANDO[data.quando] || data.quando || "—"}`,
            "",
            `😤 *4. O que ainda trava:*\n${data.trava || "—"}`,
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

        // Retorna a tag pro front (pode ser usada pra redirecionar HOT vs COLD depois).
        return NextResponse.json({ ok: true, tag });
    } catch (err) {
        console.error("lpsg-ficha route error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
