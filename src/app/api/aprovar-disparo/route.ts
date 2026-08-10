import { NextRequest, NextResponse } from "next/server";
import { tokenValido } from "@/lib/aprovacao-disparo";

/**
 * Aprovação de um disparo de grupo — o Red toca o link do Telegram e cai aqui.
 *
 * Valida o token HMAC e marca aprovado=true. O próximo tick do cron
 * /api/cron/disparos-grupo então executa (troca nome + posta). Idempotente:
 * tocar de novo não faz mal.
 *
 * Devolve uma página HTML curtinha (o Red abre no celular), não JSON.
 */
export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";

function sbHeaders() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

function pagina(titulo: string, detalhe: string, cor: string): NextResponse {
    const html = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo}</title></head>
<body style="margin:0;background:#080808;color:#f5f5f5;font-family:-apple-system,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
<div style="text-align:center;padding:32px;max-width:420px">
<div style="font-size:56px;margin-bottom:12px">${cor}</div>
<h1 style="font-size:22px;font-weight:800;margin:0 0 10px">${titulo}</h1>
<p style="font-size:15px;color:#a3a3a3;line-height:1.5;margin:0">${detalhe}</p>
</div></body></html>`;
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(req: NextRequest) {
    const id = Number(req.nextUrl.searchParams.get("id"));
    const token = req.nextUrl.searchParams.get("t") || "";

    if (!id || !tokenValido(id, token)) {
        return pagina("Link inválido", "Esse link de aprovação não confere. Não liberei nada.", "🚫");
    }

    // Lê o disparo pra dar um retorno claro (e não aprovar algo já enviado).
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/disparos_grupo?id=eq.${id}&select=ordem,status,novo_nome&limit=1`,
        { headers: sbHeaders(), cache: "no-store" },
    );
    const rows = res.ok ? await res.json() : [];
    const d = Array.isArray(rows) ? rows[0] : null;
    if (!d) return pagina("Não encontrado", "Esse disparo não existe mais.", "❓");

    if (d.status === "enviado") {
        return pagina("Já foi postado", `O disparo ${d.ordem} já saiu no grupo. Nada a fazer.`, "✅");
    }
    if (d.status === "expirado") {
        return pagina("Expirou", `O disparo ${d.ordem} passou da hora sem aprovação e foi cancelado.`, "⏱️");
    }

    // Marca aprovado. O cron cuida do envio no próximo tick (ou já, se na hora).
    await fetch(`${SUPABASE_URL}/rest/v1/disparos_grupo?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...sbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ aprovado: true, aprovado_em: "now()", status: "aprovado", atualizado_em: "now()" }),
    }).catch(() => {});

    return pagina(
        `Disparo ${d.ordem} liberado`,
        `Vou postar no grupo no horário certo.<br><br><span style="color:#666">${d.novo_nome || ""}</span>`,
        "🦈",
    );
}
