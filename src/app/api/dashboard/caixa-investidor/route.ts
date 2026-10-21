import { NextResponse } from "next/server";
import { montarRecorte } from "../recorte";
import { ACORDO } from "@/app/dashboard/metas";

// GET /api/dashboard/caixa-investidor → quanto o investidor já pagou de tráfego desde a entrada dele (05/10).
// Usado pelo cron diário da VPS (caixa-diario.js), que cruza com o saldo real da carteira Hotmart.
// Auth: Authorization: Bearer <CAIXA_TOKEN>. Sem a variável, ninguém entra.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const token = process.env.CAIXA_TOKEN || "";
  if (!token || req.headers.get("authorization") !== `Bearer ${token}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const r = await montarRecorte("total_baby", null, null);
    const gastoMeta = r.gasto.total;
    const taxaMeta = r.taxas.metaValor;
    return NextResponse.json({
      desde: r.de,
      ate: r.ate,
      gastoMeta,
      taxaMeta,
      gastoInvestidor: Math.round((gastoMeta + taxaMeta) * 100) / 100,
      parteInvestidor: ACORDO.parteInvestidor,
      avisos: r.avisos ?? [],
      geradoEm: r.geradoEm,
    });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message || e) }, { status: 502 });
  }
}
