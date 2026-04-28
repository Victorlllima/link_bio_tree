import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Formata mensagem para o Telegram de Red
        const msg = [
            "📋 *Nova ficha de onboarding — Mentoria RedPro*",
            "",
            `👤 *Nome:* ${data.nome || "—"}`,
            `📧 *Email:* ${data.email || "—"}`,
            `📱 *WhatsApp:* ${data.whatsapp || "—"}`,
            `💼 *Cargo:* ${data.cargo || "—"}`,
            `🏢 *Segmento:* ${data.segmento || "—"}`,
            "",
            `💰 *Faturamento:* ${data.receita || "—"}`,
            `👥 *Equipe:* ${data.equipe || "—"}`,
            "",
            `⚡ *Processos críticos:*\n${data.processos || "—"}`,
            "",
            `😤 *Maior dor:*\n${data.maior_dor || "—"}`,
            "",
            `🤖 *Relação com IA:* ${data.tentou_ia || "—"}`,
            `🛠️ *Ferramentas:* ${data.ferramentas || "—"}`,
            `🚧 *Onde travou:*\n${data.trava || "—"}`,
            "",
            `🎯 *Resultado ideal:*\n${data.resultado_ideal || "—"}`,
            `⏱️ *Prazo:* ${data.prazo || "—"}`,
            `🔥 *Por que agora:*\n${data.urgencia || "—"}`,
            "",
            `📅 *Disponibilidade:* ${Array.isArray(data.disponibilidade) ? data.disponibilidade.join(", ") : "—"}`,
            `🕐 *Horário preferido:* ${data.horario || "—"}`,
            `📆 *Agendamento:* ${data.calendly || "—"}`,
            "",
            data.obs ? `📝 *Obs:*\n${data.obs}` : null
        ].filter(Boolean).join("\n");

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: msg,
                    parse_mode: "Markdown"
                })
            });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("mentoria-ficha route error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
