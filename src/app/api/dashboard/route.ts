import { NextResponse } from "next/server";
import { montar, listarCiclos, resumir } from "./montar";

// GET /api/dashboard?ciclo=YYYY-MM-DD          → todos os números do ciclo
// GET /api/dashboard?comparativo=1             → resumo de todos os ciclos
// Mesmo login do /lpsg (cookie lpsg_auth).

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LPSG_PASSWORD = process.env.LPSG_PASSWORD || "lpsg2026";

function authed(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes(`lpsg_auth=${LPSG_PASSWORD}`);
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  try {
    if (url.searchParams.get("comparativo")) {
      const { ciclos } = await listarCiclos();
      const resumos = await Promise.all(ciclos.map((c) => montar(c, { leve: true }).then(resumir)));
      return NextResponse.json({ resumos });
    }
    const pedido = url.searchParams.get("ciclo");
    const d0 = pedido && /^\d{4}-\d{2}-\d{2}$/.test(pedido) ? pedido : (await listarCiclos()).atual;
    return NextResponse.json(await montar(d0));
  } catch (e) {
    console.error("[DASHBOARD]", e);
    return NextResponse.json({ error: String((e as Error).message || e) }, { status: 500 });
  }
}
