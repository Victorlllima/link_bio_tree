import { NextRequest, NextResponse } from "next/server";
import { tokenValido } from "@/lib/aprovacao-disparo";

/**
 * VETO de um disparo de grupo — o Red toca o link do Telegram e cai aqui.
 *
 * ⚠️ Inversão da trava (Red, 22/09/2026): o padrão é ENVIAR. Este endpoint é o
 * freio, não o acelerador. Sem clique nenhum, o disparo sai no horário.
 *
 * Valida o token HMAC e marca status='vetado'. O cron /api/cron/disparos-grupo
 * só considera status in (aguardando, aprovado) — vetado fica de fora e nada é
 * postado. Idempotente: tocar de novo não faz mal.
 *
 * Devolve uma página HTML curtinha (o Red abre no celular), não JSON.
 */
export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";

function sbHeaders() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

function pagina(titulo: string, detalhe: string, icone: string): NextResponse {
    const html = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo}</title></head>
<body style="margin:0;background:#080808;color:#f5f5f5;font-family:-apple-system,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
<div style="text-align:center;padding:32px;max-width:420px">
<div style="font-size:56px;margin-bottom:12px">${icone}</div>
<h1 style="font-size:22px;font-weight:800;margin:0 0 10px">${titulo}</h1>
<p style="font-size:15px;color:#a3a3a3;line-height:1.5;margin:0">${detalhe}</p>
</div></body></html>`;
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(req: NextRequest) {
    const id = Number(req.nextUrl.searchParams.get("id"));
    const token = req.nextUrl.searchParams.get("t") || "";

    if (!id || !tokenValido(id, token)) {
        return pagina("Link inválido", "Esse link não confere. Não segurei nada — o disparo segue de pé.", "🚫");
    }

    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/disparos_grupo?id=eq.${id}&select=ordem,status,novo_nome,agendar_em&limit=1`,
        { headers: sbHeaders(), cache: "no-store" },
    );
    const rows = res.ok ? await res.json() : [];
    const d = Array.isArray(rows) ? rows[0] : null;
    if (!d) return pagina("Não encontrado", "Esse disparo não existe mais.", "❓");

    if (d.status === "enviado") {
        return pagina(
            "Tarde demais",
            `O disparo ${d.ordem} <b>já saiu</b> no grupo. Não dá pra desfazer daqui — apaga direto no WhatsApp se precisar.`,
            "⚠️",
        );
    }
    if (d.status === "vetado") {
        return pagina("Já estava segurado", `O disparo ${d.ordem} já estava vetado. Nada vai sair.`, "✋");
    }

    await fetch(`${SUPABASE_URL}/rest/v1/disparos_grupo?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...sbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({
            aprovado: false,
            status: "vetado",
            vetado_em: "now()",
            atualizado_em: "now()",
        }),
    }).catch(() => {});

    const hora = d.agendar_em
        ? new Date(d.agendar_em).toLocaleTimeString("pt-BR", {
              timeZone: "America/Sao_Paulo",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

    return pagina(
        `Disparo ${d.ordem} segurado`,
        `Não vou postar${hora ? ` às ${hora}` : ""}.<br><br>` +
            `Manda o texto novo pro Alfred que eu reagendo.` +
            (d.novo_nome ? `<br><br><span style="color:#666">${d.novo_nome}</span>` : ""),
        "✋",
    );
}
