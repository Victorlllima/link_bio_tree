import { NextRequest, NextResponse } from "next/server";
import { disparar, planejar, type Pedido } from "@/lib/wpp-oficial-campanha";

/** Plano (GET/POST sem confirmar) nunca envia. Envio só com POST { confirmar:true, transacoes:[…] } + 3 travas. Auth: Bearer CRON_SECRET. */
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const ok = (r: NextRequest) => !!process.env.CRON_SECRET && r.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;

export async function POST(req: NextRequest) {
    if (!ok(req)) return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
    const b = (await req.json()) as Pedido & { confirmar?: boolean };
    try {
        if (b.confirmar === true) return NextResponse.json(await disparar({ ...b, transacoes: b.transacoes || [] }, true));
        return NextResponse.json(await planejar(b));
    } catch (e) {
        return NextResponse.json({ erro: String(e instanceof Error ? e.message : e) }, { status: 400 });
    }
}
