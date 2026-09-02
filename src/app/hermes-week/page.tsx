import type { Metadata } from "next";
import { headers } from "next/headers";
import { LpF } from "@/components/hermes-week/lp-f";
import { LpFMobile } from "@/components/hermes-week/lp-f-mobile";

/* ============================================================================
 *  /hermes-week  ·  VARIAÇÃO F (a jornada) — cinemática, a canônica
 * ----------------------------------------------------------------------------
 *  Decisão do Red em 02/09/2026: a F vai ao ar primeiro e recebe o tráfego.
 *  Por isso ela mora na raiz, e não em /f. As irmãs A–E vivem em
 *  /hermes-week/a|b|c|d|e, todas com noindex e canonical apontando para cá,
 *  para o teste não fatiar o tráfego orgânico em seis URLs.
 *
 *  A rota é estática por variação, e não [variante] dinâmica, por um motivo
 *  concreto: cada variação tem seu PRÓPRIO design e suas PRÓPRIAS fontes. Numa
 *  rota dinâmica o Next importaria todas no mesmo módulo e as fontes de todas
 *  entrariam no CSS de cada uma.
 *
 *  Roteiro aprovado: Starlight/HERMES/05-paginas/lp-F-cinematica-ROTEIRO.md
 *
 *  ---------------------------------------------------------------------------
 *  DESVIO POR DISPOSITIVO (02/09/2026) — uma URL, dois componentes
 *  ---------------------------------------------------------------------------
 *  A LP F é um filme conduzido pela rolagem. No celular o scrub não roda, e
 *  traduzir o filme como cinco cenas empilhadas verticalmente produziu um
 *  álbum de fotos: cinco cartões sem relação entre si, que foi o que o Red
 *  reprovou. A tradução correta pro telefone é o gesto que ele já faz cem
 *  vezes por dia, deslizar pro lado. Daí o <LpFMobile/>, com as 5 cenas em
 *  carrossel horizontal.
 *
 *  A escolha é no SERVIDOR, pelo user-agent, e não no cliente por media query,
 *  por três razões:
 *    · o cliente receberia os dois HTMLs e o dobro do CSS, e a Parte 1 desta
 *      página inteira foi desenhada pra não cobrar banda de quem não usa;
 *    · alternar por CSS deixaria os 5 <img> do componente errado no DOM, e o
 *      navegador baixa imagem de elemento display:none em vários casos;
 *    · trocar no cliente depois da hidratação daria um salto visível na
 *      primeira pintura, justamente no tráfego pago onde ele custa caro.
 *
 *  O ENDEREÇO CONTINUA ÚNICO. O pixel da Meta mede uma URL só, o ?v=F&src=hw-F
 *  do teste A/B segue intacto (ele vive no link do checkout, não na rota), e o
 *  canonical não se parte.
 *
 *  CUSTO MEDIDO: ler headers() torna a rota dinâmica, então ela perde o
 *  pré-render estático. TTFB medido em 02/09 na build de produção, localhost,
 *  8 requisições: 4,3ms de mediana estática contra 6,5ms de mediana dinâmica.
 *  São ~2ms de render por request, dentro do ruído de rede de qualquer
 *  visitante real. Para uma LP de tráfego pago o custo é aceitável.
 *
 *  A regex cobre os agentes que a Meta usa no in-app browser do Instagram e do
 *  Facebook, que é de onde vem quase todo o tráfego desta página. Tablet em
 *  retrato cai no mobile de propósito: o layout de carrossel escala bem até
 *  ~900px e o cine-scroll num toque grosso não tem a resolução de rolagem que
 *  o scrub exige. iPad em paisagem se anuncia como Macintosh e recebe o
 *  desktop, que é o certo.
 * ==========================================================================*/

const TITULO = "Hermes Week | Seu Agente do Zero à Produção";
const DESCRICAO =
  "Cinco encontros pra ter um agente de IA instalado na sua máquina, falando com você pelo Telegram e executando tarefa no horário que você mandar. Segunda a sexta, 20h.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "https://redpro.com.br/hermes-week" },
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/hermes-week",
    title: TITULO,
    description: DESCRICAO,
    locale: "pt_BR",
    siteName: "RedPro AI Academy",
    images: [{ url: "/hermes-week/f/keyframes/cena-04.jpg", width: 1920, height: 1080 }],
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRICAO },
};

/* `Android` sem `Mobile` é tablet Android, e ele entra aqui de propósito.
   `Silk` é o navegador do Kindle Fire. `FBAN|FBAV|Instagram` são os in-app
   browsers da Meta, que é a origem do tráfego pago desta página. */
const CELULAR =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk|FBAN|FBAV|Instagram/i;

export default async function Page() {
  const ua = (await headers()).get("user-agent") ?? "";
  return CELULAR.test(ua) ? <LpFMobile /> : <LpF />;
}
