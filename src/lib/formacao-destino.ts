/* Destino do botão da Formação (QG 2.6, linha de 13/11). Hora de Brasília (GMT-3, sem horário de verão).
   Produto 8660306, checkout J107893534P (CHECKOUT_FORMACAO em components/formacao/conteudo.ts).
   Ao vivo: até 23h59 de 26/11, oferta 4vj21bfg (R$ 1.250). Cheia: 27/11 00h até 23h59 de 10/12, oferta 24mnfz2e (R$ 1.500).
   Depois: carrinho fechado. A Hotmart não agenda o fim da oferta; esta data é a fonte do botão. */
export const CHECKOUT_FORMACAO_BASE = "https://pay.hotmart.com/J107893534P";
export const VIRA_CHEIA = Date.parse("2026-11-27T00:00:00-03:00");
export const FECHA = Date.parse("2026-12-11T00:00:00-03:00");
const PASSAM = ["fbclid", "sck", "src", "xcod", "gclid"];

export type DestinoFormacao = { tipo: "checkout"; oferta: string } | { tipo: "fechado" };

export function destinoFormacao(agora: number): DestinoFormacao {
  if (agora < VIRA_CHEIA) return { tipo: "checkout", oferta: "4vj21bfg" };
  if (agora < FECHA) return { tipo: "checkout", oferta: "24mnfz2e" };
  return { tipo: "fechado" };
}

export function urlCheckout(oferta: string, entrada: URLSearchParams): string {
  const u = new URL(CHECKOUT_FORMACAO_BASE);
  u.searchParams.set("off", oferta);
  entrada.forEach((v, k) => {
    if (k.startsWith("utm_") || PASSAM.includes(k)) u.searchParams.set(k, v);
  });
  return u.toString();
}
