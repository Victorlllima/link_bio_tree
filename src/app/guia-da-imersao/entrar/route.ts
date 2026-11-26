import { NextResponse } from "next/server";
import { COOKIE, COOKIE_OPCOES, senhaConfere, tokenDaSenha } from "@/lib/configurar-vps/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST da tela de senha do guia. Certo: grava o cookie (site todo, 60 dias) e volta para a âncora que o aluno abriu.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const tentativa = String(form?.get("senha") ?? "").slice(0, 200);
  const ancora = String(form?.get("ancora") ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 80);
  const destino = new URL("/guia-da-imersao", req.url);

  if (!senhaConfere(tentativa)) {
    await new Promise((r) => setTimeout(r, 700)); // freia tentativa em série
    destino.searchParams.set("erro", "1");
    if (ancora) destino.hash = ancora;
    const res = NextResponse.redirect(destino, 303);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (ancora) destino.hash = ancora;
  const res = NextResponse.redirect(destino, 303);
  res.cookies.set(COOKIE, tokenDaSenha(), COOKIE_OPCOES);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export function GET(req: Request) {
  return NextResponse.redirect(new URL("/guia-da-imersao", req.url), 303);
}
