/* ============================================================================
 *  PONTO UNICO DE TROCA DO CHECKOUT DA HERMES WEEK
 * ----------------------------------------------------------------------------
 *  Checkout ATIVO desde 02/09/2026: pay.hotmart.com/J107439791C
 *
 *  O link sai com DOIS parametros de variante, de proposito:
 *    v=A      -> legivel em qualquer analytics
 *    src=hw-A -> o que a HOTMART mostra no relatorio de vendas
 *  Sem o src, o teste mede clique no botao e nao venda.
 *
 *  ATRIBUICAO POR CRIATIVO (04/09/2026): o `sck` carrega o utm_content que a
 *  Meta injeta no clique do anuncio. Sem ele da pra saber a variante de LP,
 *  mas nao QUAL criativo vendeu — e a engine de analise da skill
 *  `trafego-lpsg-turbo` (regras C-01..C-08, Hook/Hold/Body por criativo) fica
 *  cega fora do painel da Meta.
 *
 *  A pagina e renderizada no servidor, entao `checkoutUrl()` nao enxerga a
 *  query string do visitante. A captura acontece no cliente, dentro do
 *  `pixelScript` de `comum.tsx`, que reescreve o href de todo `.hw-acao`.
 * ==========================================================================*/

export type VarianteId = "A" | "B" | "C" | "D" | "E" | "F";

/** TROCAR AQUI quando o produto existir. Único lugar. */
export const CHECKOUT_BASE = "https://pay.hotmart.com/J107439791C";

/** Vira true junto com a troca acima. Serve de guarda no build. */
export const CHECKOUT_DEFINIDO = true;

export function checkoutUrl(v: VarianteId): string {
  const sep = CHECKOUT_BASE.includes("?") ? "&" : "?";
  return `${CHECKOUT_BASE}${sep}checkoutMode=10&v=${v}&src=hw-${v}`;
}

/** Valor do ingresso, usado no pixel e na página. */
export const PRECO = 62.0;
