import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Formulário antigo da /configurar-vps (aba esquecida aberta): manda para o guia, que pede a senha de novo se preciso.
export function POST(req: Request) {
  return NextResponse.redirect(new URL("/guia-da-imersao#dia-2", req.url), 303);
}
export function GET(req: Request) {
  return NextResponse.redirect(new URL("/guia-da-imersao#dia-2", req.url), 301);
}
