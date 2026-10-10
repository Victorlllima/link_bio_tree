import { NextResponse } from "next/server";
import { montar, listarCiclos, resumir } from "./montar";

// GET /api/dashboard?vivos=1            → as turmas ao vivo agora (captação e/ou aula) + lista de turmas
// GET /api/dashboard?ciclo=YYYY-MM-DD   → todos os números de uma turma (D0 = segunda da Aula 1)
// GET /api/dashboard?comparativo=1      → resumo de todas as turmas
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
    const { cal, atual, captacao, aula } = await listarCiclos();
    const lista = cal.map((c) => ({ d0: c.d0, nome: c.nome, indice: c.indice }));

    if (url.searchParams.get("comparativo")) {
      const resumos = await Promise.all(cal.map((c) => montar(c.d0, { leve: true, cal }).then(resumir)));
      return NextResponse.json({ resumos });
    }

    if (url.searchParams.get("vivos")) {
      // captação primeiro, depois a turma em aula; se for a mesma turma, vem uma só
      const ids = [...new Set([captacao, aula].filter((x): x is string => !!x))];
      const alvo = ids.length ? ids : [atual];
      const vivos = await Promise.all(alvo.map((d0) => montar(d0, { cal })));
      return NextResponse.json({ vivos, ciclos: lista, atual });
    }

    const pedido = url.searchParams.get("ciclo");
    const d0 = pedido && /^\d{4}-\d{2}-\d{2}$/.test(pedido) ? pedido : atual;
    return NextResponse.json(await montar(d0, { cal }));
  } catch (e) {
    console.error("[DASHBOARD]", e);
    return NextResponse.json({ error: String((e as Error).message || e) }, { status: 500 });
  }
}
