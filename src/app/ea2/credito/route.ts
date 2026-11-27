// Crédito da gravação no EA² (Red, 27/11): quem comprou a gravação paga R$ 1.303
// até segunda, 30/11, às 23h59 (Brasília). Oferta 220xv2wg passada pela Mira.
// Depois do prazo, o botão do template leva ao WhatsApp da Amanda.
const OFERTA = "https://pay.hotmart.com/J107893534P?off=220xv2wg&checkoutMode=10";
const FIM = Date.parse("2026-12-01T02:59:59Z"); // 30/11 23h59 em Brasília

export const dynamic = "force-dynamic";

export function GET() {
  const destino =
    Date.now() <= FIM ? OFERTA : process.env.AMANDA_WA_URL || "https://www.redpro.com.br/";
  return Response.redirect(destino, 307);
}
