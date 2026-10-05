import { lerCicloAtual, formatarCiclo } from "@/lib/ciclo-atual";
import { checkoutUrl, PRECO } from "@/components/hermes-week/checkout";
import { pixelScript } from "@/components/hermes-week/comum";
import { LP_H_HTML } from "@/components/hermes-week/lp-h-html";

/* ============================================================================
 *  /hermes-week  ·  VARIAÇÃO H (landing 3D) — a canônica desde 30/09/2026
 * ----------------------------------------------------------------------------
 *  Decisão do Red em 30/09/2026: a landing 3D (terminal vivo, personagem, mapa
 *  da semana em roda) passa a responder na raiz. A F, que morava aqui, segue
 *  em /hermes-week/f com noindex, junto das irmãs A–E e G.
 *
 *  Por que route.ts e não page.tsx: a H é um HTML inteiro, independente do
 *  React (Three.js + GSAP + Lenis de CDN, import map, scripts inline). Passar
 *  isso pelo layout raiz do Next duplicaria <html>/<head> e o CSS global do
 *  Tailwind brigaria com o dela. Servindo o documento pronto, a página sai
 *  exatamente como foi aprovada — e as subrotas (a–g, matricula, obrigado…)
 *  continuam sendo páginas normais, porque route.ts só ocupa este segmento.
 *
 *  O que o layout raiz fazia e aqui é feito à mão:
 *    · pixel da Meta (init + PageView) — mesmo ID do layout
 *    · favicon
 *  E o que as outras variantes fazem via <Pixel/>, aqui entra como string:
 *    · ViewContent / InitiateCheckout com content_category 'variante-H'
 *    · o sck por criativo carimbado nos .hw-acao (ver comum.tsx)
 *
 *  Fonte editável do HTML: Starlight/HERMES/4-MARKETING/
 *  landing-hermes-week-3d/build/index.html (lp-h-html.ts é gerado dele).
 * ==========================================================================*/

const URL_CANONICA = "https://redpro.com.br/hermes-week";
const TITULO = "Hermes Week | Hermes, seu funcionário que não dorme";
const DESCRICAO =
  "Uma semana. Um agente com mãos, memória e agenda própria. Não é mais um chatbot que só responde: é um agente que decide o melhor caminho, aprende com os erros e trabalha sem você pedir.";
const PIXEL_ID = "1543917230170877";

/* A data do ciclo muda uma vez por semana: 10 min de cache é folga. */
export const revalidate = 600;

const esc = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const HEAD_META = `<title>${esc(TITULO)}</title>
<meta name="description" content="${esc(DESCRICAO)}">
<link rel="canonical" href="${URL_CANONICA}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:url" content="${URL_CANONICA}">
<meta property="og:title" content="${esc(TITULO)}">
<meta property="og:description" content="${esc(DESCRICAO)}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="RedPro AI Academy">
<meta property="og:image" content="https://redpro.com.br/hermes-week/h/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(TITULO)}">
<meta name="twitter:description" content="${esc(DESCRICAO)}">
<meta name="twitter:image" content="https://redpro.com.br/hermes-week/h/og.jpg">
<meta name="theme-color" content="#0A0A0A">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌀</text></svg>">`;

const PIXEL_BASE = `<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1"></noscript>`;

export async function GET() {
  const ciclo = formatarCiclo((await lerCicloAtual({ revalidar: 600 })).dataInicio);
  const dados = {
    proximaTurma: ciclo.inicio,
    faixa: ciclo.faixa,
    preco: `R$ ${PRECO.toFixed(0)}`,
    checkout: checkoutUrl("H"),
  };
  // JSON dentro de <script>: neutraliza "</" pra não fechar a tag por acidente
  const dadosJs = JSON.stringify(dados).replace(/</g, "\\u003c");

  const html = LP_H_HTML.replace("__HEAD_META__", HEAD_META)
    .replace("__PIXEL_BASE__", PIXEL_BASE)
    .replace("__HW_DADOS__", dadosJs)
    .replace("__PROXIMA_TURMA__", esc(ciclo.inicio))
    .replace("__FAIXA__", esc(ciclo.faixa))
    .replace("__PIXEL_VARIANTE__", pixelScript("H"));

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
