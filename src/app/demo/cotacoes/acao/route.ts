import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CAMINHO, COOKIE, loginConfere, sessaoValida, tokenSessao } from "@/lib/demo-cotacoes/auth";
import { inserir, lerPreco, limpar } from "@/lib/demo-cotacoes/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corta = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

function volta(req: Request, params: Record<string, string> = {}, hash = "") {
  const u = new URL(CAMINHO, req.url);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const res = NextResponse.redirect(u.toString() + hash, 303);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

// Todos os formulários da demo postam aqui, com o campo "acao": entrar, sair, salvar ou limpar.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const acao = corta(form?.get("acao") ?? null, 20);

  if (acao === "entrar") {
    if (!loginConfere(corta(form?.get("email") ?? null, 200), corta(form?.get("senha") ?? null, 200))) {
      await new Promise((r) => setTimeout(r, 700)); // freia tentativa em série
      return volta(req, { erro: "login" });
    }
    const res = volta(req);
    // cookie de sessão: some ao fechar o navegador
    res.cookies.set(COOKIE, tokenSessao(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: CAMINHO,
    });
    return res;
  }

  const jar = await cookies();
  if (!sessaoValida(jar.get(COOKIE)?.value)) return volta(req);

  if (acao === "sair") {
    const res = volta(req);
    res.cookies.set(COOKIE, "", { path: CAMINHO, maxAge: 0 });
    return res;
  }

  if (acao === "limpar") {
    const ok = await limpar();
    return volta(req, ok ? { limpo: "1" } : { erro: "banco" });
  }

  if (acao === "salvar") {
    const produto = corta(form!.get("produto"), 120);
    const loja = corta(form!.get("loja"), 80);
    const preco = lerPreco(corta(form!.get("preco"), 30));
    let link: string | null = corta(form!.get("link"), 500) || null;
    if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;
    const observacao = corta(form!.get("observacao"), 500) || null;
    if (!produto || !loja || Number.isNaN(preco)) return volta(req, { erro: "campos" }, "#registrar");
    const ok = await inserir({ produto, loja, preco, link, observacao });
    return volta(req, ok ? { ok: "1" } : { erro: "banco" }, "#lista");
  }

  return volta(req);
}

export function GET(req: Request) {
  return volta(req);
}
