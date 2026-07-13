import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Qualifica o lead em HOT / WARM / COLD a partir das respostas (padrão Tabari — separa curioso de comprador).
function qualificar(d: Record<string, string>): "HOT" | "WARM" | "COLD" {
    let score = 0;
    if (d.tem_crm === "sim") score += 2;                       // já publicou o CRM = mão na massa
    if (d.objetivo === "prestar-servico") score += 2;          // quer virar prestador (não hobby)
    if (d.ja_cobrou === "sim") score += 1;                     // já tentou cobrar
    const meta = parseInt(d.meta_faturamento || "0", 10);
    if (meta >= 3000) score += 1;                              // ambição real
    const prontidao = parseInt(d.prontidao || "0", 10);
    if (prontidao >= 8) score += 2;
    else if (prontidao >= 5) score += 1;

    if (score >= 5) return "HOT";
    if (score >= 3) return "WARM";
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
            `🖥️ *CRM do evento publicado?* ${data.tem_crm || "—"}`,
            `🎯 *Objetivo com IA:* ${data.objetivo || "—"}`,
            `💰 *Meta de faturamento (90d):* R$${data.meta_faturamento || "—"}`,
            `💵 *Já tentou cobrar por IA?* ${data.ja_cobrou || "—"}`,
            "",
            `😤 *O que mais trava hoje:*\n${data.trava || "—"}`,
            `⚡ *Prontidão pra começar (0-10):* ${data.prontidao || "—"}`,
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
