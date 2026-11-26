/* /demo/cotacoes · onde as cotações ficam.
   Produção: tabela public.demo_cotacoes no Supabase (só a service key, pelo servidor).
   Sem a chave (teste local): memória do processo. Nada pessoal é gravado. */

export type Cotacao = {
  id: number;
  produto: string;
  loja: string;
  preco: number;
  link: string | null;
  observacao: string | null;
  criado_em: string;
};

const SUPABASE_URL = "https://supabase.redpro.com.br";
const TABELA = "demo_cotacoes";
const chave = () => process.env.SUPABASE_SERVICE_KEY ?? "";

const memoria: Cotacao[] = [];
let proxId = 1;

function headers(extra: Record<string, string> = {}) {
  const k = chave();
  return { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json", ...extra };
}

export async function listar(): Promise<{ itens: Cotacao[]; erro?: string }> {
  if (!chave()) return { itens: [...memoria].reverse().slice(0, 50) };
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?select=*&order=criado_em.desc&limit=50`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!r.ok) return { itens: [], erro: `Banco respondeu ${r.status}` };
    return { itens: (await r.json()) as Cotacao[] };
  } catch {
    return { itens: [], erro: "Banco fora do ar" };
  }
}

export async function inserir(c: Omit<Cotacao, "id" | "criado_em">): Promise<boolean> {
  if (!chave()) {
    memoria.push({ ...c, id: proxId++, criado_em: new Date().toISOString() });
    if (memoria.length > 200) memoria.shift();
    return true;
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}`, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(c),
  }).catch(() => null);
  return !!r?.ok;
}

export async function limpar(): Promise<boolean> {
  if (!chave()) {
    memoria.length = 0;
    return true;
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=gt.0`, { method: "DELETE", headers: headers() }).catch(
    () => null,
  );
  return !!r?.ok;
}

// "R$ 4.299,90", "4299.90", "4.299" → número. Inválido = NaN.
export function lerPreco(bruto: string): number {
  let s = bruto.replace(/[^\d.,]/g, "");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = Number(s);
  return s && Number.isFinite(n) && n > 0 && n < 10_000_000 ? Math.round(n * 100) / 100 : NaN;
}
