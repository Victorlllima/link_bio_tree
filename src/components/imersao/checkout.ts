import type { Lote } from "./lote";

/* Checkout da Imersão: produto 8852419, página B108278232D. O botão sempre leva a oferta do
   lote vigente (off=), para o preço da página e o do checkout saírem da mesma fonte. */
export const CHECKOUT_BASE = "https://pay.hotmart.com/B108278232D";

export const checkoutUrl = (l: Lote) => `${CHECKOUT_BASE}?checkoutMode=10&off=${l.oferta}&src=im-A`;
