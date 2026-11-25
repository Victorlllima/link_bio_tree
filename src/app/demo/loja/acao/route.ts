import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginConfere, sessaoValida, tokenSessao } from "@/lib/demo-cotacoes/auth";
import {
  BASE,
  COOKIE_ADM,
  COOKIE_CARRINHO,
  COOKIE_PEDIDO,
  MAX_QTD,
  PRODUTO,
  avaliarCartao,
  gravarPedido,
  lerQtd,
  limparPedidos,
  novoCodigo,
} from "@/lib/demo-loja/loja";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Todos os formulários da loja postam aqui, com o campo "acao".
   NUNCA logar o form: ele traz o número do cartão e o CVC. */

const corta = (v: FormDataEntryValue | null | undefined, max: number) => String(v ?? "").trim().slice(0, max);
const seguro = process.env.NODE_ENV === "production";

function vai(req: Request, caminho: string, params: Record<string, string> = {}) {
  const u = new URL(caminho, req.url);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const res = NextResponse.redirect(u.toString(), 303);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

const opcoes = { httpOnly: true, secure: seguro, sameSite: "lax" as const, path: BASE };

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const acao = corta(form?.get("acao"), 20);
  const jar = await cookies();
  const qtdAtual = lerQtd(jar.get(COOKIE_CARRINHO)?.value);

  if (acao === "comprar" || acao === "adicionar") {
    const qtd = Math.min(MAX_QTD, Math.max(qtdAtual, 0) + 1);
    const res = vai(req, acao === "comprar" ? `${BASE}/checkout` : `${BASE}/carrinho`);
    res.cookies.set(COOKIE_CARRINHO, String(acao === "comprar" ? Math.max(qtdAtual, 1) : qtd), opcoes);
    return res;
  }

  if (acao === "quantidade") {
    const qtd = Math.min(MAX_QTD, Math.max(0, Number.parseInt(corta(form?.get("qtd"), 2), 10) || 0));
    const res = vai(req, `${BASE}/carrinho`);
    res.cookies.set(COOKIE_CARRINHO, String(qtd), opcoes);
    return res;
  }

  if (acao === "finalizar") {
    if (qtdAtual < 1) return vai(req, `${BASE}/carrinho`);
    const cartao = avaliarCartao(
      corta(form?.get("cc-number"), 40),
      corta(form?.get("cc-exp-month"), 4),
      corta(form?.get("cc-exp-year"), 4),
      corta(form?.get("cc-csc"), 6),
    );
    if (!cartao.ok) return vai(req, `${BASE}/checkout`, { erro: cartao.erro });

    const cliente = corta(form?.get("name"), 120);
    const rua = corta(form?.get("street-address"), 200);
    const cidade = corta(form?.get("address-level2"), 80);
    const uf = corta(form?.get("address-level1"), 30);
    const cep = corta(form?.get("postal-code"), 12);
    if (!cliente || !rua || !cidade || !uf || !cep) return vai(req, `${BASE}/checkout`, { erro: "campos" });

    const base = {
      produto: PRODUTO.nome,
      qtd: qtdAtual,
      total: Math.round(qtdAtual * PRODUTO.preco * 100) / 100,
      cliente,
      endereco: `${rua}, ${cidade} - ${uf}, CEP ${cep}`,
      bandeira: cartao.bandeira,
      final4: cartao.final4,
    };
    let codigo = novoCodigo();
    let ok = await gravarPedido({ ...base, codigo });
    if (!ok) {
      codigo = novoCodigo(); // código repetido (raro): tenta outro
      ok = await gravarPedido({ ...base, codigo });
    }
    if (!ok) return vai(req, `${BASE}/checkout`, { erro: "banco" });

    const res = vai(req, `${BASE}/confirmado`);
    res.cookies.set(COOKIE_CARRINHO, "", { ...opcoes, maxAge: 0 });
    res.cookies.set(COOKIE_PEDIDO, codigo, opcoes);
    return res;
  }

  // área de pedidos: mesmo login de teste do /demo/cotacoes
  if (acao === "entrar") {
    if (!loginConfere(corta(form?.get("email"), 200), corta(form?.get("senha"), 200))) {
      await new Promise((r) => setTimeout(r, 700));
      return vai(req, `${BASE}/pedidos`, { erro: "login" });
    }
    const res = vai(req, `${BASE}/pedidos`);
    res.cookies.set(COOKIE_ADM, tokenSessao(), opcoes);
    return res;
  }

  if (!sessaoValida(jar.get(COOKIE_ADM)?.value)) return vai(req, `${BASE}/pedidos`);

  if (acao === "sair") {
    const res = vai(req, `${BASE}/pedidos`);
    res.cookies.set(COOKIE_ADM, "", { ...opcoes, maxAge: 0 });
    return res;
  }

  if (acao === "limpar") {
    const ok = await limparPedidos();
    return vai(req, `${BASE}/pedidos`, ok ? { limpo: "1" } : { erro: "banco" });
  }

  return vai(req, BASE);
}

export function GET(req: Request) {
  return vai(req, BASE);
}
