import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/soul/verificar
 *
 * Verifica se um e-mail tem acesso ao gerador de SOUL on-demand.
 * Gate: produto 8551609 ("50 casos de uso do Hermes") na tabela hotmart_compras.
 *
 * Body: { email: string }
 * Resposta: { acesso: boolean }
 *
 * Falha silenciosa: se o Supabase não responder, nega o acesso.
 * Isso protege a API — na dúvida não abre.
 */

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";
const PRODUTO_50_CASOS = "8551609";

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ acesso: false, erro: "json inválido" }, { status: 400 });
  }

  if (!email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ acesso: false, erro: "e-mail inválido" }, { status: 400 });
  }

  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) {
    console.error("[soul/verificar] SUPABASE_SERVICE_KEY ausente");
    return NextResponse.json({ acesso: false, erro: "config" }, { status: 500 });
  }

  try {
    const url =
      `${SUPABASE_URL}/rest/v1/hotmart_compras` +
      `?email=eq.${encodeURIComponent(email)}` +
      `&produto_id=eq.${encodeURIComponent(PRODUTO_50_CASOS)}` +
      `&evento=eq.PURCHASE_APPROVED` +
      `&select=id&limit=1`;

    const res = await fetch(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[soul/verificar] Supabase erro:", res.status, await res.text());
      return NextResponse.json({ acesso: false, erro: "banco" }, { status: 500 });
    }

    const linhas = (await res.json()) as unknown[];
    return NextResponse.json({ acesso: linhas.length > 0 });
  } catch (e) {
    console.error("[soul/verificar] exception:", e);
    return NextResponse.json({ acesso: false, erro: "exceção" }, { status: 500 });
  }
}
