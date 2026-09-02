/* ============================================================================
 *  PONTO ÚNICO DE TROCA DO CHECKOUT DA HERMES WEEK
 * ----------------------------------------------------------------------------
 *  O produto da Hermes Week ainda NÃO existe na Hotmart (situação em 01/09/2026).
 *  Quando MIRA criar o produto, trocar SOMENTE a linha CHECKOUT_BASE abaixo e
 *  virar CHECKOUT_DEFINIDO para true. As 5 variações leem daqui: não existe
 *  nenhuma URL de checkout escrita solta dentro de página.
 *
 *  O link sai com DOIS parâmetros de variante, de propósito:
 *    v=A    → o parâmetro pedido no briefing, legível em qualquer analytics
 *    src=hw-A → o parâmetro que a HOTMART realmente mostra no relatório de vendas
 *  Sem o src, o teste mede clique no botão e não venda.
 *  MIRA: confirmar se a conta usa `src` ou `sck` no relatório e ajustar aqui.
 * ==========================================================================*/

export type VarianteId = "A" | "B" | "C" | "D" | "E" | "F";

/** TROCAR AQUI quando o produto existir. Único lugar. */
export const CHECKOUT_BASE = "https://pay.hotmart.com/J107439791C";

/** Vira true junto com a troca acima. Serve de guarda no build. */
export const CHECKOUT_DEFINIDO = false;

export function checkoutUrl(v: VarianteId): string {
  const sep = CHECKOUT_BASE.includes("?") ? "&" : "?";
  return `${CHECKOUT_BASE}${sep}checkoutMode=10&v=${v}&src=hw-${v}`;
}

/** Valor do ingresso, usado no pixel e na página. */
export const PRECO = 62.0;
