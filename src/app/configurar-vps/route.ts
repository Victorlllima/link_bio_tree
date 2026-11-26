import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE, COOKIE_OPCOES, cookieValido, tokenDaSenha } from "@/lib/configurar-vps/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* /configurar-vps virou o Dia 2 do Guia da Imersão (Rigel, pedido do Red, 26/11/2026): 301 para /guia-da-imersao#dia-2.
   Quem já tinha entrado aqui tem o cookie com path /configurar-vps, que o guia não enxerga:
   esta rota é a única que ainda o recebe, então regrava o cookie para o site todo e o aluno não digita a senha de novo. */
export async function GET(req: Request) {
  const destino = new URL("/guia-da-imersao#dia-2", req.url);
  const res = NextResponse.redirect(destino, 301);
  const jar = await cookies();
  if (cookieValido(jar.get(COOKIE)?.value)) {
    res.cookies.set(COOKIE, tokenDaSenha(), COOKIE_OPCOES);
    res.headers.set("Cache-Control", "private, no-store");
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
