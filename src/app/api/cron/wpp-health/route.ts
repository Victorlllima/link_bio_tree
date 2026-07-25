import { NextRequest, NextResponse } from "next/server";
import { estadoInstancia } from "@/lib/evolution";

/**
 * HEALTHCHECK PREVENTIVO da instância Evolution.
 *
 * O problema que resolve: quando o WhatsApp cai de "open", as vendas param de
 * receber a mensagem de boas-vindas EM SILÊNCIO — só descobrimos depois que um
 * comprador reclama. Este cron pergunta o estado periodicamente e avisa no
 * Telegram ANTES disso virar prejuízo.
 *
 * Alerta em qualquer estado != "open" (connecting, close, refused...). Também
 * alerta se a própria consulta falhar (servidor Evolution fora do ar).
 *
 * Anti-spam: não repete o alerta enquanto o estado não MUDA. O último estado
 * avisado vive numa linha da tabela wpp_health_state — sem isso, um número caído
 * geraria um alerta a cada tick. Quando volta pra "open", manda um "recuperado".
 *
 * Autenticação: Bearer <CRON_SECRET> (a Vercel injeta no cron).
 */
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SUPABASE_URL = "https://supabase.redpro.com.br";
const CRON_SECRET = process.env.CRON_SECRET;
const CHAVE = "evolution:academy-suporte"; // uma linha de estado por instância

function sbHeaders() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

/** Lê o último estado avisado (para não repetir alerta). */
async function ultimoEstado(): Promise<string | null> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/wpp_health_state?chave=eq.${encodeURIComponent(CHAVE)}&select=estado&limit=1`,
            { headers: sbHeaders(), cache: "no-store" },
        );
        if (!res.ok) return null;
        const rows = await res.json();
        return Array.isArray(rows) && rows[0] ? rows[0].estado : null;
    } catch {
        return null;
    }
}

async function salvarEstado(estado: string) {
    await fetch(`${SUPABASE_URL}/rest/v1/wpp_health_state?on_conflict=chave`, {
        method: "POST",
        headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ chave: CHAVE, estado, checado_em: "now()" }),
    }).catch(() => {});
}

async function telegram(msg: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chat) return;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text: msg, parse_mode: "Markdown" }),
    }).catch(() => {});
}

export async function GET(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const r = await estadoInstancia();
    // estado "real": o valor da Evolution, ou "erro" se a consulta falhou.
    const atual = r.ok ? (r.estado || "desconhecido") : "erro";
    const anterior = await ultimoEstado();

    // Só age quando o estado MUDA (anti-spam).
    if (atual === anterior) {
        return NextResponse.json({ ok: true, estado: atual, mudou: false });
    }

    await salvarEstado(atual);

    if (atual === "open") {
        // Voltou ao ar (ou primeira checagem saudável): avisa só se vinha de um estado ruim.
        if (anterior && anterior !== "open") {
            await telegram(`🟢 *WhatsApp RECUPERADO*\n\nInstância \`academy-suporte\` voltou pra *open*. As boas-vindas voltam a sair.`);
        }
    } else {
        await telegram(
            `🔴 *WhatsApp FORA DO AR*\n\n` +
            `Instância \`academy-suporte\` está em *${atual}* (antes: ${anterior || "?"}).\n` +
            (atual === "erro" ? `⚠️ A consulta à Evolution falhou: ${r.erro || "sem detalhe"}\n` : "") +
            `\n*As vendas do ingresso NÃO estão recebendo a mensagem de boas-vindas.*\n` +
            `Reconectar em evo.redpro.com.br/manager antes que acumule.`,
        );
    }

    return NextResponse.json({ ok: true, estado: atual, anterior, mudou: true });
}
