/**
 * Qual evento o webhook da Hotmart manda à Meta (CAPI) para cada produto.
 *
 * Problema (09/10/2026): cada order bump chegava como um `Purchase` próprio. Um comprador
 * que levava o ingresso e 3 bumps virava 4 compras na Meta, com o CPA enxergado pela
 * campanha cerca de 1/3 do real, e o algoritmo otimizava em cima de "compras" que eram bumps
 * (a análise de 07/10 achou 12 compras na Meta contra 4 ingressos reais).
 *
 * Decisão do Red (09/10/2026), valendo a partir de 13/10 às 00h de Brasília, junto com a
 * virada para a turma 3: `Purchase` só para o ingresso; o bump vai como o evento
 * personalizado `OrderBump`, com valor. Aparece no Events Manager, não entra na contagem
 * de compras da campanha.
 *
 * A virada é por data, de propósito: o ajuste muda o sinal de uma campanha em andamento
 * e não deve acontecer no meio da captação da turma 2.
 */

// Ofertas adicionais (order bumps) da Hermes Week na Hotmart.
export const BUMPS_HERMES_WEEK: ReadonlySet<string> = new Set(["8551535", "8551609", "8551624"]);

export const VIRADA_CAPI_BUMP = Date.parse("2026-10-13T00:00:00-03:00");

export type EventoCapi = "Purchase" | "OrderBump";

export function eventoCapi(produtoId: string, agora: number = Date.now()): EventoCapi {
  return BUMPS_HERMES_WEEK.has(produtoId) && agora >= VIRADA_CAPI_BUMP ? "OrderBump" : "Purchase";
}
