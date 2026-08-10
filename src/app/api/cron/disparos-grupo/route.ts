import { NextRequest, NextResponse } from "next/server";
import { enviarTextoGrupo, trocarNomeGrupo } from "@/lib/evolution-grupo";
import { linkAprovacao } from "@/lib/aprovacao-disparo";

/**
 * Disparos em GRUPO do carrinho — agendados, COM APROVAÇÃO por link (Red 09/08).
 *
 * Espelha o auto-chain de wpp-fila (Vercel Hobby: cron 1x/dia + função ~60s).
 * O cron diário só REARMA a cadeia; uma vez rodando, a rota se re-chama a cada
 * ~3 min e cobre o dia todo, sem depender de cron sub-diário.
 *
 * Por tick, para cada disparo pendente:
 *   - faltam ≤30 min e ainda não pedi aprovação → manda o LINK no Telegram.
 *   - chegou a hora E aprovado=true              → troca nome + posta no grupo.
 *   - chegou a hora e NÃO aprovado               → NÃO envia; alerta que passou.
 *
 * ⚠️ NADA sai sem aprovado=true. É a trava absoluta.
 * Autenticação: Bearer <CRON_SECRET>.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUPABASE_URL = "https://supabase.redpro.com.br";
const CRON_SECRET = process.env.CRON_SECRET;
const ANTECEDENCIA_MS = 30 * 60_000; // pede aprovação 30 min antes
const RECHAMADA_MS = 3 * 60_000;     // re-tick a cada 3 min
const TOLERANCIA_ATRASO_MS = 15 * 60_000; // depois disso, marca 'expirado'

function sbHeaders() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function telegram(msg: string, botoes?: Array<{ text: string; url: string }>) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chat) return;
    const body: Record<string, unknown> = { chat_id: chat, text: msg, parse_mode: "Markdown", disable_web_page_preview: true };
    if (botoes?.length) body.reply_markup = { inline_keyboard: [botoes.map((b) => ({ text: b.text, url: b.url }))] };
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).catch(() => {});
}

type Disparo = {
    id: number;
    ciclo: string;
    tipo_grupo: string;
    jid: string;
    agendar_em: string;
    novo_nome: string | null;
    texto: string | null;
    ordem: number;
    aprovado: boolean;
    aprov_pedido_em: string | null;
    status: string;
};

/** Disparos que ainda podem acontecer (aguardando/aprovado), ordenados. */
async function pendentes(): Promise<Disparo[]> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/disparos_grupo` +
        `?status=in.(aguardando,aprovado)&select=*&order=agendar_em.asc`,
        { headers: sbHeaders(), cache: "no-store" },
    );
    if (!res.ok) return [];
    return (await res.json()) as Disparo[];
}

async function patch(id: number, campos: Record<string, unknown>) {
    await fetch(`${SUPABASE_URL}/rest/v1/disparos_grupo?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...sbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ ...campos, atualizado_em: "now()" }),
    }).catch(() => {});
}

function selfUrl(req: NextRequest): string {
    return new URL("/api/cron/disparos-grupo", req.nextUrl.origin).toString();
}

function reacionar(url: string, ms: number) {
    setTimeout(() => {
        fetch(url, { headers: { authorization: `Bearer ${CRON_SECRET}` } }).catch(() => {});
    }, ms);
}

/** Agenda a verificação de ENTREGA ~4 min após um envio (fire-and-forget). */
function agendarRecheck(req: NextRequest) {
    const url = new URL("/api/cron/disparos-recheck", req.nextUrl.origin).toString();
    setTimeout(() => {
        fetch(url, { headers: { authorization: `Bearer ${CRON_SECRET}` } }).catch(() => {});
    }, 4 * 60_000);
}

/** Executa um disparo aprovado: troca o nome do grupo e posta o texto. */
async function executar(d: Disparo, req: NextRequest): Promise<void> {
    // 1) troca o nome do grupo (se houver)
    let nomeOk = true;
    if (d.novo_nome) {
        const r = await trocarNomeGrupo(d.jid, d.novo_nome);
        nomeOk = r.ok;
        if (!r.ok) {
            await telegram(`⚠️ *Disparo ${d.ordem}* — falhou ao trocar o nome do grupo: ${r.erro}`);
        }
    }

    // 2) posta o texto (se houver)
    if (d.texto) {
        const r = await enviarTextoGrupo(d.jid, d.texto);
        if (!r.ok) {
            // FALHA DE ENVIO — alerta imediato (verificação canal grupo).
            await patch(d.id, { status: "falhou", erro: r.erro, nome_trocado: nomeOk });
            await telegram(
                `🔴 *FALHA no disparo ${d.ordem} do carrinho* (${d.tipo_grupo}).\n\n` +
                `Não consegui postar no grupo.\nErro: \`${r.erro}\`\n\n` +
                `_Postar manualmente agora, se ainda for a hora._`,
            );
            return;
        }
        // Sucesso: guarda o key.id pra checar a ENTREGA depois.
        await patch(d.id, {
            status: "enviado",
            key_id: r.keyId,
            nome_trocado: nomeOk,
            enviado_em: "now()",
        });
        await telegram(`✅ *Disparo ${d.ordem}* postado no grupo (${d.tipo_grupo}).${r.keyId ? "" : "\n⚠️ Sem key.id — não vou conseguir checar a entrega."}`);
        if (r.keyId) agendarRecheck(req); // 2ª camada: confirma a entrega ~4 min depois
    } else {
        // Só troca de nome, sem texto.
        await patch(d.id, { status: "enviado", nome_trocado: nomeOk, enviado_em: "now()" });
        await telegram(`✅ *Disparo ${d.ordem}* — nome do grupo trocado (${d.tipo_grupo}).`);
    }
}

async function tick(req: NextRequest): Promise<NextResponse> {
    const origin = req.nextUrl.origin; // usado no pedido de aprovação (linkAprovacao)
    const agora = Date.now();
    const lista = await pendentes();
    if (!lista.length) {
        return NextResponse.json({ ok: true, pendentes: 0 });
    }

    let houveAcao = false;

    for (const d of lista) {
        const quando = new Date(d.agendar_em).getTime();
        const faltam = quando - agora;

        // ── Chegou a hora ────────────────────────────────────────────────
        if (faltam <= 0) {
            if (d.aprovado) {
                await executar(d, req);
                houveAcao = true;
            } else if (-faltam > TOLERANCIA_ATRASO_MS) {
                // Passou muito e não foi aprovado → expira e avisa.
                await patch(d.id, { status: "expirado" });
                await telegram(
                    `⏱️ *Disparo ${d.ordem} do carrinho EXPIROU sem aprovação.*\n\n` +
                    `A hora (${new Date(quando).toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" })}) passou e você não liberou.\n` +
                    `_Não postei nada. Se ainda quiser, posta manualmente._`,
                );
                houveAcao = true;
            }
            // dentro da tolerância e não aprovado: aguarda (você ainda pode liberar)
            continue;
        }

        // ── Faltam ≤30 min e ainda não pedi aprovação → pede agora ────────
        if (faltam <= ANTECEDENCIA_MS && !d.aprov_pedido_em) {
            const horaBRT = new Date(quando).toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" });
            const preview = (d.texto || "(só troca o nome do grupo)").slice(0, 500);
            const rotulo = d.tipo_grupo === "carrinho" ? "🛒 CARRINHO" : "📚 GRUPO SEMANA";
            await telegram(
                `${rotulo} — *disparo ${d.ordem}* (${horaBRT})\n\n` +
                `*Nome do grupo vira:* ${d.novo_nome || "(mantém)"}\n` +
                `─────────\n${preview}\n─────────\n\n` +
                `Toca pra *liberar*. Sem clique, não posto.`,
                [{ text: `✅ Aprovar disparo ${d.ordem} (${horaBRT})`, url: linkAprovacao(d.id, origin) }],
            );
            await patch(d.id, { aprov_pedido_em: "now()" });
            houveAcao = true;
        }
    }

    // Auto-chain: se ainda há disparos pendentes hoje, re-tick em 3 min.
    const aindaPendentes = (await pendentes()).length;
    if (aindaPendentes > 0) {
        reacionar(selfUrl(req), RECHAMADA_MS);
    }

    return NextResponse.json({ ok: true, pendentes: aindaPendentes, houveAcao });
}

export async function GET(req: NextRequest) {
    // Aceita o segredo por header (Vercel cron) OU por ?key= (start manual do
    // celular, caso a cadeia auto-chain morra e o Red precise reiniciar).
    const auth = req.headers.get("authorization");
    const keyQuery = req.nextUrl.searchParams.get("key");
    const ok = !CRON_SECRET || auth === `Bearer ${CRON_SECRET}` || keyQuery === CRON_SECRET;
    if (!ok) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return tick(req);
}
