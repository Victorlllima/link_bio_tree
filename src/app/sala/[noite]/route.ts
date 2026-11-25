import { NextRequest, NextResponse } from "next/server";
import { ehNoite, linkDaSala } from "@/lib/sala";

export const dynamic = "force-dynamic";

const CABECALHOS = {
    "Cache-Control": "no-store, max-age=0",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(req: NextRequest, ctx: { params: Promise<{ noite: string }> }) {
    const { noite } = await ctx.params;
    const n = noite.toLowerCase();
    const link = ehNoite(n) ? await linkDaSala(n) : null;
    const destino = link ?? new URL(`/sala/aguarde?n=${ehNoite(n) ? n : ""}`, req.url);
    return NextResponse.redirect(destino, { status: 302, headers: CABECALHOS });
}
