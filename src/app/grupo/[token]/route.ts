import { NextRequest, NextResponse } from "next/server";
import { resolverGrupo } from "@/lib/imersao-grupo";

/* /grupo/<token>  ·  redirecionador do convite do grupo da Imersão (ION, Pedido 9).
   Token válido → 302 para o convite. Qualquer outra coisa (inválido, reembolsado, banco fora,
   grupos lotados) → /grupo/nao-encontrado, sem o convite. Falha fechada. */
export const dynamic = "force-dynamic";

const CABECALHOS = { "Cache-Control": "no-store, max-age=0", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
    let destino = new URL("/grupo/nao-encontrado", req.nextUrl.origin).toString();
    try {
        const { token } = await ctx.params;
        const r = await resolverGrupo(token);
        if (r.ok) destino = r.link;
        else console.warn(`[grupo] negado: ${r.motivo}`);
    } catch (e) {
        console.error("[grupo] falha, vai para o suporte:", e);
    }
    return NextResponse.redirect(destino, { status: 302, headers: CABECALHOS });
}
