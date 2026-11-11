import { loteVigente, dadosDoLote, listaLotes, pctVendido, EVENTO } from "@/components/imersao/lote";
import { checkoutUrl } from "@/components/imersao/checkout";
import { pixelScriptImersao } from "@/components/imersao/pixel";
import { LP_IMERSAO_HTML } from "@/components/imersao/lp-imersao-html";
import { lerImersaoConfig, contarVendidosPorLote } from "@/lib/imersao-config";

/* ============================================================================
 *  /imersao  ·  Imersão Arquiteto de Agentes (ao vivo, duas noites)
 * ----------------------------------------------------------------------------
 *  Mesma técnica da /hermes-week: o HTML pronto é servido por route.ts, porque
 *  traz Three.js, GSAP e Lenis de CDN e não deve passar pelo layout raiz do Next.
 *  Preço, rótulo do lote, próximo preço e oferta do checkout saem todos de
 *  lote.ts (por data), com ajuste opcional pela tabela imersao_config.
 *
 *  Fonte editável do HTML: Starlight/HERMES/4-MARKETING/landing-imersao-3d/build/index.html
 *  (lp-imersao-html.ts é gerado dele pelo gerar-next.py).
 * ==========================================================================*/

const URL_CANONICA = "https://redpro.com.br/imersao";
const TITULO = "Imersão Arquiteto de Agentes | Seu time de IA que não dorme";
const DESCRICAO =
    "Duas noites ao vivo. Um agente com ferramentas, memórias e um servidor só dele. Dia 1: instala o Hermes e vê tudo o que ele faz. Dia 2: o Hermes vai para um servidor e você monta seus squads de agentes.";
const PIXEL_ID = "1543917230170877";

/* Microsoft Clarity: só carrega com NEXT_PUBLIC_CLARITY_ID preenchido (Vercel). Vazio = nada. */
const CLARITY_ID = (process.env.NEXT_PUBLIC_CLARITY_ID ?? "").trim();
const CLARITY = /^[a-z0-9]+$/i.test(CLARITY_ID)
    ? `<script>
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");
</script>`
    : "";

/* O lote muda por data e a config por edição na tabela: 60 s de cache. */
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

export async function GET() {
    const [cfg, vendidos] = await Promise.all([lerImersaoConfig(60), contarVendidosPorLote(60)]);
    const { lote, encerrado } = loteVigente(new Date(), {
        loteForcado: cfg.loteForcado,
        encerrado: cfg.encerrado,
        vendidos,
        limite: cfg.limiteLote,
    });

    // barra de % só com contagem real; 0% não aparece (a página esconde)
    const vendidoPct = pctVendido(lote, vendidos, cfg.limiteLote);

    const dados = {
        evento: { chip: EVENTO.chip, extenso: EVENTO.extenso, horario: EVENTO.horario, noite1: EVENTO.noite1, noite2: EVENTO.noite2 },
        lote: dadosDoLote(lote, vendidoPct),
        ...dadosDoLote(lote, vendidoPct),
        noites: `${EVENTO.noite1} e ${EVENTO.noite2}`,
        lotes: listaLotes(),
        checkout: checkoutUrl(lote),
        encerrado,
    };
    // JSON dentro de <script>: neutraliza "</" pra não fechar a tag por acidente
    const dadosJs = JSON.stringify(dados).replace(/</g, "\\u003c");
    const pixel = pixelScriptImersao(lote);

    // funções como substituto: "$" nos textos (R$) não pode virar padrão de replace
    const html = LP_IMERSAO_HTML.replace("__HEAD_META__", () => HEAD_META)
        .replace("__PIXEL_BASE__", () => PIXEL_BASE + CLARITY)
        .replace("__IM_DADOS__", () => dadosJs)
        .replace("__PIXEL_VARIANTE__", () => pixel);

    return new Response(html, {
        headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, s-maxage=60, stale-while-revalidate=3600",
        },
    });
}
