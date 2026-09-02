import type { Metadata } from "next";
import { LpF } from "@/components/hermes-week/lp-f";

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

export default function Page() {
  return <LpF />;
}
