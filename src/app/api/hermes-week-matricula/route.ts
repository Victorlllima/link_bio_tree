import { NextRequest, NextResponse } from "next/server";
import { lerCicloAtual } from "@/lib/ciclo-atual";

/**
 * Ficha de MATRÍCULA da Hermes Week — passo 2 da mensageria de boas-vindas do
 * Tabari ("1. confirma e-mail · 2. FICHA · 3. grupo").
 *
 * Preenchida por quem JÁ comprou o ingresso. Aqui não se qualifica ninguém:
 * é onboarding + contexto pro Red adaptar os exemplos das aulas. A
 * qualificação MQL acontece na ficha de INTERESSE, que abre na Aula 4 e
 * ainda não existe.
 *
 * Diferença pro /api/crm-week-matricula (funil antigo, em standby): o ciclo
 * NÃO é constante no código. A Hermes Week roda toda semana com a mesma URL,
 * então o ciclo vem de `ciclo_atual.data_inicio`, escrito pelo Alfred toda
 * sexta. Sem isso a ficha do ciclo 2 sobrescreveria a do ciclo 1.
 */

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";

// Grava no banco. Nunca derruba a resposta: se o Supabase falhar, o Telegram
// ainda notifica e o Red não perde a matrícula.
async function salvar(d: Record<string, string>, ciclo: string) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return { ok: false, erro: "SUPABASE_SERVICE_KEY ausente" };
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/hermes_week_matriculas?on_conflict=ciclo,email`,
            {
                method: "POST",
                headers: {
                    apikey: key,
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                    Prefer: "resolution=merge-duplicates,return=minimal",
                },
                body: JSON.stringify({
                    ciclo,
                    nome: d.nome,
                    email: (d.email || "").toLowerCase().trim(),
                    whatsapp: d.whatsapp || null,
                    sistema: d.sistema || null,
                    ja_tentou: d.ja_tentou || null,
                    onde_travou: d.onde_travou || null,
                    conta_ia: d.conta_ia || null,
                    profissao: d.profissao || null,
                    gasto_mes: d.gasto_mes || null,
                    tempo_perdido: d.tempo_perdido || null,
                    o_que_quer: d.o_que_quer || null,
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

// Rótulos legíveis pro Telegram. O valor cru fica no banco; o Red lê o rótulo.
const SISTEMA: Record<string, string> = {
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
    outro: "Outro / não sei",
};

const JA_TENTOU: Record<string, string> = {
    nunca: "Nunca montei agente",
    openclaw: "Já usei OpenClaw",
    hermes: "Já usei Hermes",
    claude_code: "Já usei Claude Code / Codex / Antigravity",
    nocode: "Já usei n8n ou outro no-code",
};

const ONDE_TRAVOU: Record<string, string> = {
    instalacao: "Travou na instalação",
    parou: "Funcionou e parou de funcionar",
    custo: "Parou pelo custo de token",
    sem_uso: "Subiu mas não soube o que fazer com ele",
    nao_travei: "Ainda não travou",
};

const GASTO: Record<string, string> = {
    nada: "nada ainda",
    ate_120: "até R$120",
    "120_400": "R$120 a R$400",
    "400_1000": "R$400 a R$1.000",
    mais_1000: "mais de R$1.000",
    token_sem_saber: "paga por token e não sabe quanto dá",
};

const TEMPO: Record<string, string> = {
    ate_1h: "até 1h",
    "1_3h": "1h a 3h",
    "3_8h": "3h a 8h",
    mais_8h: "mais de 8h",
    nao_medi: "nunca mediu",
};

const CONTA_IA: Record<string, string> = {
    claude: "Assina Claude",
    chatgpt: "Assina ChatGPT",
    gemini: "Assina Gemini",
    api: "Paga API por token",
    nenhuma: "🔴 Não paga nenhuma",
};

export async function POST(req: NextRequest) {
    try {
        const d = await req.json();

        // Ciclo vigente na hora do preenchimento. Se a leitura falhar,
        // lerCicloAtual devolve o fallback — melhor gravar no ciclo errado
        // do que perder a matrícula.
        const { dataInicio } = await lerCicloAtual();

        // Persistir ANTES de notificar: o dado no banco é o que sobrevive.
        const gravou = await salvar(d, dataInicio);
        if (!gravou.ok) console.error("hermes-week-matricula: falha ao gravar —", gravou.erro);

        const msg = [
            "🌀 *Nova matrícula — Hermes Week*",
            gravou.ok ? "" : "⚠️ _não gravou no banco — ver logs_",
            `_ciclo ${dataInicio}_`,
            "",
            `👤 *Nome:* ${d.nome || "—"}`,
            `📧 *Email:* ${d.email || "—"}`,
            `📱 *WhatsApp:* ${d.whatsapp || "—"}`,
            "",
            `💻 *Sistema:* ${SISTEMA[d.sistema] || d.sistema || "—"}`,
            `🔧 *Já tentou:* ${JA_TENTOU[d.ja_tentou] || d.ja_tentou || "—"}`,
            `🧱 *Onde travou:* ${ONDE_TRAVOU[d.onde_travou] || d.onde_travou || "—"}`,
            d.profissao ? `🧑‍💻 *O que faz:* ${d.profissao}` : "",
            `💸 *Gasta por mês com IA:* ${GASTO[d.gasto_mes] || d.gasto_mes || "—"}`,
            `⏳ *Perde por semana:* ${TEMPO[d.tempo_perdido] || d.tempo_perdido || "—"}`,
            "",
            d.o_que_quer ? `🎯 *O que quer que ele faça:*\n${d.o_que_quer}` : "",
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
        console.error("hermes-week-matricula route error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
