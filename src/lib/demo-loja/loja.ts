import { randomInt } from "node:crypto";

/* /demo/loja · "RedPro Commerce", loja de DEMONSTRAÇÃO da noite 1 da Imersão (Rigel/Red, 25/11/2026).
   Só aceita cartão de teste. Qualquer outro número é recusado ANTES de gravar.
   Nunca grava, loga nem devolve o número completo ou o CVC: o pedido guarda bandeira e 4 últimos.
   Pedidos: tabela public.demo_loja_pedidos no Supabase (service key, só pelo servidor). */

export const BASE = "/demo/loja";
export const ACAO = "/demo/loja/acao";
export const COOKIE_CARRINHO = "demo_loja_carrinho";
export const COOKIE_PEDIDO = "demo_loja_pedido";
export const COOKIE_ADM = "demo_loja_adm";

export const PRODUTO = {
  id: "ps5",
  nome: "PlayStation 5",
  subtitulo: "Console com leitor de disco, 1 controle sem fio, SSD de 1 TB",
  preco: 2999.9,
  precoDe: 3999.9,
};
export const MAX_QTD = 3;

export const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function lerQtd(v: string | undefined): number {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, MAX_QTD) : 0;
}

/* Cartões aceitos (todos de teste, públicos). Qualquer outro: "use o cartão de teste". */
const CARTOES_TESTE: Record<string, { bandeira: string; aprova: boolean }> = {
  "4242424242424242": { bandeira: "Visa", aprova: true },
  "5555555555554444": { bandeira: "Mastercard", aprova: true },
  "4000000000000002": { bandeira: "Visa", aprova: false },
};

export type ResultadoCartao =
  | { ok: true; bandeira: string; final4: string }
  | { ok: false; erro: "cartao" | "recusado" | "validade" | "cvc" };

export function avaliarCartao(numero: string, mes: string, ano: string, cvc: string): ResultadoCartao {
  const n = numero.replace(/[\s.-]/g, "");
  const teste = /^\d{12,19}$/.test(n) ? CARTOES_TESTE[n] : undefined;
  if (!teste) return { ok: false, erro: "cartao" };

  const m = Number.parseInt(mes, 10);
  let a = Number.parseInt(ano, 10);
  if (a < 100) a += 2000;
  const agora = new Date();
  const vencido = a < agora.getFullYear() || (a === agora.getFullYear() && m < agora.getMonth() + 1);
  if (!(m >= 1 && m <= 12) || !(a >= 2000 && a <= 2100) || vencido) return { ok: false, erro: "validade" };
  if (!/^\d{3,4}$/.test(cvc.trim())) return { ok: false, erro: "cvc" };

  if (!teste.aprova) return { ok: false, erro: "recusado" };
  return { ok: true, bandeira: teste.bandeira, final4: n.slice(-4) };
}

export type Pedido = {
  id: number;
  codigo: string;
  produto: string;
  qtd: number;
  total: number;
  cliente: string;
  endereco: string;
  bandeira: string;
  final4: string;
  criado_em: string;
};

const SUPABASE_URL = "https://supabase.redpro.com.br";
const TABELA = "demo_loja_pedidos";
const chave = () => process.env.SUPABASE_SERVICE_KEY ?? "";
const memoria: Pedido[] = [];
let proxId = 1;

function headers(extra: Record<string, string> = {}) {
  const k = chave();
  return { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json", ...extra };
}

export const novoCodigo = () => `RC-${randomInt(1000, 10000)}`;

export async function gravarPedido(p: Omit<Pedido, "id" | "criado_em">): Promise<boolean> {
  if (!chave()) {
    memoria.push({ ...p, id: proxId++, criado_em: new Date().toISOString() });
    if (memoria.length > 200) memoria.shift();
    return true;
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}`, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(p),
  }).catch(() => null);
  return !!r?.ok;
}

export async function buscarPedido(codigo: string): Promise<Pedido | null> {
  if (!/^RC-\d{4}$/.test(codigo)) return null;
  if (!chave()) return memoria.find((p) => p.codigo === codigo) ?? null;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?select=*&codigo=eq.${codigo}&limit=1`, {
    headers: headers(),
    cache: "no-store",
  }).catch(() => null);
  if (!r?.ok) return null;
  const itens = (await r.json()) as Pedido[];
  return itens[0] ?? null;
}

export async function listarPedidos(): Promise<{ itens: Pedido[]; erro?: string }> {
  if (!chave()) return { itens: [...memoria].reverse().slice(0, 50) };
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?select=*&order=criado_em.desc&limit=50`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!r.ok) return { itens: [], erro: `Banco respondeu ${r.status}` };
    return { itens: (await r.json()) as Pedido[] };
  } catch {
    return { itens: [], erro: "Banco fora do ar" };
  }
}

export async function limparPedidos(): Promise<boolean> {
  if (!chave()) {
    memoria.length = 0;
    return true;
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=gt.0`, { method: "DELETE", headers: headers() }).catch(
    () => null,
  );
  return !!r?.ok;
}
