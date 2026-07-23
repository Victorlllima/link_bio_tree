import { NextRequest, NextResponse } from "next/server";
import { processarProximo, contarPendentes, dentroDaJanela, dormir, type ItemFila } from "@/lib/wpp-fila";
import { renderCampanha } from "@/lib/campanhas-crmweek";

/**
 * Processa a fila de WhatsApp — AUTO-ENCADEADO (Vercel Hobby).
 *
 * O plano Hobby impõe duas coisas: cron só 1x/dia e função ~10-60s. Um disparo
 * em massa com intervalo de 45-90s por pessoa leva HORAS — não cabe. Solução:
 * cada execução processa UM envio (não um lote inteiro), espera o intervalo, e
 * então CHAMA A SI MESMA (fire-and-forget) pra continuar. A "fila" avança em
 * mini-requests encadeadas, cada uma curtinha, respeitando o ritmo humano sem
 * depender de função longa nem de cron sub-diário.
 *
 * O cron 1x/dia (vercel.json) é só o REARME: reinicia a cadeia caso ela tenha
 * parado no meio (deploy, erro transitório). O gatilho real é a rota
 * /api/wpp/enfileirar, que enfileira e chama esta rota uma vez.
 *
 * Janela de horário (8h-21h GMT-3) e circuit breaker vivem em wpp-fila.ts.
 * Autenticação: Bearer <CRON_SECRET>.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET;

// Campanhas que a fila deve varrer a cada tick. Adicionar aqui conforme criar.
const CAMPANHAS_ATIVAS = (process.env.WPP_CAMPANHAS_ATIVAS || "").split(",").map((s) => s.trim()).filter(Boolean);

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

/** URL própria, para a auto-chamada encadeada. */
function selfUrl(req: NextRequest): string {
    return new URL("/api/cron/wpp-fila", req.nextUrl.origin).toString();
}

/** Reaciona esta rota depois de `ms` (fire-and-forget; não bloqueia a resposta). */
function reacionar(url: string, ms: number) {
    // waitUntil não está garantido no Hobby; um fetch solto com timeout curto
    // basta pra disparar a próxima função. O setTimeout roda dentro da janela
    // de execução atual (o intervalo é < maxDuration).
    setTimeout(() => {
        fetch(url, { headers: { authorization: `Bearer ${CRON_SECRET}` } }).catch(() => {});
    }, ms);
}

async function tick(req: NextRequest) {
    if (!dentroDaJanela()) {
        return NextResponse.json({ ok: true, pulou: "fora da janela 8h-21h GMT-3" });
    }
    if (!CAMPANHAS_ATIVAS.length) {
        return NextResponse.json({ ok: true, pulou: "nenhuma campanha ativa (WPP_CAMPANHAS_ATIVAS vazio)" });
    }

    // Processa uma campanha por tick (a primeira com pendentes).
    for (const campanha of CAMPANHAS_ATIVAS) {
        if ((await contarPendentes(campanha)) === 0) continue;

        const r = await processarProximo(campanha, (item: ItemFila) => renderCampanha(campanha, item));

        if (r.parou === "circuit_breaker") {
            await telegram(
                `🔴 *WhatsApp — circuit breaker* em \`${campanha}\`\n\n` +
                `Falhas seguidas demais. Disparo PAUSADO pra proteger o número.\n` +
                `Restam: ${r.restam}\n\n_Verificar a instância antes de religar._`,
            );
            return NextResponse.json({ ok: true, campanha, parou: r.parou });
        }

        if (r.restam === 0) {
            await telegram(`✅ *WhatsApp* — campanha \`${campanha}\` concluída.`);
            return NextResponse.json({ ok: true, campanha, concluida: true });
        }

        // Ainda há fila: agenda o próximo envio dentro desta mesma função.
        if (r.proximoEmMs != null) {
            // Se o intervalo cabe no teto da função, espera aqui e reaciona por
            // dentro; senão, dispara a auto-chamada e retorna.
            if (r.proximoEmMs < 55_000) {
                await dormir(r.proximoEmMs);
                return tick(req); // recursão: próximo envio na mesma execução
            }
            reacionar(selfUrl(req), r.proximoEmMs);
        }
        return NextResponse.json({ ok: true, campanha, restam: r.restam });
    }

    return NextResponse.json({ ok: true, pulou: "todas as campanhas vazias" });
}

export async function GET(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return tick(req);
}
