import { NextResponse } from "next/server";
import { COOKIE, COOKIE_MAX_AGE, senhaConfere, tokenDaSenha } from "@/lib/configurar-vps/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST do formulário da tela de senha. Certo: grava o cookie e volta para a página. Errado: volta com ?erro=1.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const tentativa = String(form?.get("senha") ?? "").slice(0, 200);
  const destino = new URL("/configurar-vps", req.url);

  if (!senhaConfere(tentativa)) {
    await new Promise((r) => setTimeout(r, 700)); // freia tentativa em série
    destino.searchParams.set("erro", "1");
    const res = NextResponse.redirect(destino, 303);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const res = NextResponse.redirect(destino, 303);
  res.cookies.set(COOKIE, tokenDaSenha(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/configurar-vps",
    maxAge: COOKIE_MAX_AGE,
  });
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export function GET(req: Request) {
  return NextResponse.redirect(new URL("/configurar-vps", req.url), 303);
}
