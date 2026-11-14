import { destinoFormacao, urlCheckout } from "@/lib/formacao-destino";

/* /formacao  ·  redirect do botão da Formação (QG 2.6, 13/11; pedido do RIGEL).
   Decide pela hora no servidor, sem cache: ao vivo -> oferta 4vj21bfg, 27/11 -> 24mnfz2e, 11/12 -> carrinho fechado.
   Preserva utm_*, fbclid, sck, src, xcod, gclid. A LP antiga da Formação foi movida para /formacao/lp (noindex). */

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEM_CACHE = { "Cache-Control": "no-store, max-age=0", "CDN-Cache-Control": "no-store", "Vercel-CDN-Cache-Control": "no-store" };

export async function GET(req: Request) {
  const url = new URL(req.url);
  // ?simular=<ISO> só funciona fora de produção (teste das três datas)
  const sim = process.env.VERCEL_ENV === "production" ? NaN : Date.parse(url.searchParams.get("simular") ?? "");
  const d = destinoFormacao(Number.isNaN(sim) ? Date.now() : sim);

  if (d.tipo === "checkout") {
    return new Response(null, { status: 307, headers: { Location: urlCheckout(d.oferta, url.searchParams), ...SEM_CACHE } });
  }
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Carrinho fechado | Formação Arquiteto de Agentes</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0b0f;color:#f4f4f5;font-family:system-ui,sans-serif;text-align:center;padding:24px}main{max-width:420px}h1{font-size:28px;margin:0 0 12px}p{color:#a1a1aa;line-height:1.5}a{color:#f4f4f5}</style></head><body><main><h1>Carrinho fechado</h1><p>As inscrições da Formação Arquiteto de Agentes encerraram em 10/12. Quer ser avisado da próxima turma? Fale com a gente em <a href="mailto:suporte@redpro.com.br">suporte@redpro.com.br</a>.</p></main></body></html>`;
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", ...SEM_CACHE } });
}
