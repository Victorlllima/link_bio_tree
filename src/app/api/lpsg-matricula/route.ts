import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Ficha de MATRÍCULA (passo 2 da mensageria Tabari) — onboarding de quem já comprou o ingresso.
// Sem scoring de lead: aqui não se qualifica ninguém, só se coleta contexto pras aulas.
// A qualificação MQL acontece na ficha de INTERESSE (/api/lpsg-ficha), que abre na aula 4.

const OCUPACAO: Record<string, string> = {
    clt: "Contratado (CLT)",
    autonomo: "Por conta / freelancer",
    empresa: "Tem a própria empresa",
    "entre-empregos": "Entre empregos",
    estudante: "Estudante",
};

const NIVEL: Record<string, string> = {
    nunca: "Nunca usou quase nada",
    basico: "Usa ChatGPT no dia a dia",
    intermediario: "Já testou automações",
    avancado: "Já entregou algo com IA",
};

const CONSTRUIU: Record<string, string> = {
    nunca: "Nunca tentou",
    "tentei-travei": "Tentou e travou",
    terminei: "Já terminou algo",
};

const OBJETIVO: Record<string, string> = {
    "nova-renda": "Nova fonte de renda com IA",
    "atender-empresas": "Atender empresas e cobrar",
    "minha-empresa": "Usar no próprio negócio",
    carreira: "Mudar de carreira",
    aprender: "Aprender e ver onde chega",
};

export async function POST(req: NextRequest) {
    try {
        const d = await req.json();

        const msg = [
            "🎓 *Nova matrícula — Desafio CRM em 5 dias*",
            "",
            `👤 *Nome:* ${d.nome || "—"}`,
            `📧 *Email:* ${d.email || "—"}`,
            `📱 *WhatsApp:* ${d.whatsapp || "—"}`,
            "",
            `💼 *Ocupação:* ${OCUPACAO[d.ocupacao] || d.ocupacao || "—"}`,
            `🤖 *Nível com IA:* ${NIVEL[d.nivel_ia] || d.nivel_ia || "—"}`,
            `🔨 *Já construiu algo?* ${CONSTRUIU[d.ja_construiu] || d.ja_construiu || "—"}`,
            `🎯 *Objetivo:* ${OBJETIVO[d.objetivo] || d.objetivo || "—"}`,
            d.nicho ? `🏢 *Nicho em mente:* ${d.nicho}` : "",
            "",
            d.maior_duvida ? `😰 *Maior dúvida/medo:*\n${d.maior_duvida}` : "",
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

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("lpsg-matricula route error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
