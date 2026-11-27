import { LP_EA2_HTML } from "@/components/ea2/lp-ea2-html";

/* ============================================================================
 *  /ea2  ·  EA² · Estudos Avançados em Agentes (4 aulas ao vivo, dezembro)
 * ----------------------------------------------------------------------------
 *  Mesma técnica da /imersao: o HTML pronto é servido por route.ts, porque
 *  traz Three.js, GSAP e Lenis de CDN e não deve passar pelo layout raiz do Next.
 *  A condição de quem comprou a gravação (R$ 1.303) sai da página sozinha
 *  depois de 30/11 às 23h59 (Brasília): tudo entre <!--GRAV--> e <!--/GRAV-->.
 *  Sem Purchase no navegador: a compra sai do servidor (CAPI).
 * ==========================================================================*/

const URL_CANONICA = "https://redpro.com.br/ea2";
const TITULO = "EA² · Estudos Avançados em Agentes | Coloque os seus agentes para trabalhar juntos";
const DESCRICAO =
    "4 aulas ao vivo com o Red: um orquestrador no comando, um Squad de marketing de 8 agentes, um Squad de desenvolvimento de 11 e uma central no celular onde você só aprova. 03, 10, 17 e 21/12, das 15h às 19h.";
const PIXEL_ID = "1543917230170877";

const CHECKOUT = "https://pay.hotmart.com/J107893534P?off=24mnfz2e&checkoutMode=10&src=ea2-lp";
const CHECKOUT_GRAVACAO = "https://pay.hotmart.com/J107893534P?off=220xv2wg&checkoutMode=10&src=ea2-lp";
const FIM_GRAVACAO = Date.parse("2026-12-01T02:59:59Z"); // 30/11 23h59 em Brasília

/* Microsoft Clarity: só carrega com NEXT_PUBLIC_CLARITY_ID preenchido (Vercel). Vazio = nada. */
const CLARITY_ID = (process.env.NEXT_PUBLIC_CLARITY_ID ?? "").trim();
const CLARITY = /^[a-z0-9]+$/i.test(CLARITY_ID)
    ? `<script>
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");
</script>`
    : "";

/* A condição da gravação vence por data: 60 s de cache. */
export const revalidate = 60;

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const HEAD_META = `<title>${esc(TITULO)}</title>
<meta name="description" content="${esc(DESCRICAO)}">
<link rel="canonical" href="${URL_CANONICA}">
<meta name="robots" content="noindex,nofollow">
<meta property="og:type" content="website">
<meta property="og:url" content="${URL_CANONICA}">
<meta property="og:title" content="${esc(TITULO)}">
<meta property="og:description" content="${esc(DESCRICAO)}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="RedPro AI Academy">
<meta property="og:image" content="https://redpro.com.br/imersao/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(TITULO)}">
<meta name="twitter:description" content="${esc(DESCRICAO)}">
<meta name="twitter:image" content="https://redpro.com.br/imersao/og.jpg">
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

/* ViewContent ao abrir e InitiateCheckout no clique de qualquer botão de compra (.im-acao).
   O valor do clique vem do data-valor do botão (1500 ou 1303). Nada de Purchase aqui. */
const PIXEL_EVENTOS = `(function(){
  var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
  function base(v){ return { content_name: 'EA2 Estudos Avancados em Agentes', content_ids: ['ea2'], content_type: 'product', value: v, currency: 'BRL', content_category: 'curso' }; }
  var n = 0;
  (function vc(){ if (typeof window.fbq === 'function') { fbq('track', 'ViewContent', base(1500), { eventID: 'vc-' + id }); } else if (n++ < 20) { setTimeout(vc, 250); } })();
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a.im-acao') : null;
    if (!a || typeof window.fbq !== 'function') return;
    var v = Number(a.getAttribute('data-valor')) || 1500;
    fbq('track', 'InitiateCheckout', base(v), { eventID: 'ic-' + id });
  });
})();`;

export async function GET() {
    const mostraGravacao = Date.now() <= FIM_GRAVACAO;
    const dados = mostraGravacao
        ? { checkout: CHECKOUT, checkoutGravacao: CHECKOUT_GRAVACAO }
        : { checkout: CHECKOUT };
    // JSON dentro de <script>: neutraliza "</" pra não fechar a tag por acidente
    const dadosJs = JSON.stringify(dados).replace(/</g, "\\u003c");

    let base = LP_EA2_HTML;
    if (!mostraGravacao) base = base.replace(/<!--GRAV-->[\s\S]*?<!--\/GRAV-->/g, "");

    // funções como substituto: "$" nos textos (R$) não pode virar padrão de replace
    const html = base
        .replace("__HEAD_META__", () => HEAD_META)
        .replace("__PIXEL_BASE__", () => PIXEL_BASE + CLARITY)
        .replace("__EA_DADOS__", () => dadosJs)
        .replace("__PIXEL_VARIANTE__", () => PIXEL_EVENTOS);

    return new Response(html, {
        headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, s-maxage=60, stale-while-revalidate=3600",
        },
    });
}
