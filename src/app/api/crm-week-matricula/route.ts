import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";
// Ciclo atual do CRM Week (data da segunda que abre). Trocar a cada novo ciclo.
const CICLO = "2026-07-27";

// Grava no banco. Nunca derruba a resposta: se o Supabase falhar, o Telegram ainda notifica.
async function salvar(d: Record<string, string>) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return { ok: false, erro: "SUPABASE_SERVICE_KEY ausente" };
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/crm_week_matriculas?on_conflict=ciclo,email`,
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
                    ocupacao: d.ocupacao || null,
                    nivel_ia: d.nivel_ia || null,
                    ja_construiu: d.ja_construiu || null,
                    nicho: d.nicho || null,
                    objetivo: d.objetivo || null,
                    maior_duvida: d.maior_duvida || null,
                }),
            },
        );
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

// Ficha de MATRÍCULA (passo 2 da mensageria Tabari) — onboarding de quem já comprou o ingresso.
// Sem scoring de lead: aqui não se qualifica ninguém, só se coleta contexto pras aulas.
// A qualificação MQL acontece na ficha de INTERESSE (/api/crm-week-status), que abre na aula 4.

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

        // Persistir ANTES de notificar: o dado no banco é o que sobrevive.
        const gravou = await salvar(d);
        if (!gravou.ok) console.error("crm-week-matricula: falha ao gravar —", gravou.erro);

        const msg = [
            "🎓 *Nova matrícula — Desafio CRM em 5 dias*",
            gravou.ok ? "" : "⚠️ _não gravou no banco — ver logs_",
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
        console.error("crm-week-matricula route error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
