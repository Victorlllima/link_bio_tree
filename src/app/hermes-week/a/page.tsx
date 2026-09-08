import type { Metadata } from "next";
import { LpA } from "@/components/hermes-week/lp-a";
import { lerCicloAtual, formatarCiclo } from "@/lib/ciclo-atual";
import { VARIANTES, comDatas } from "@/components/hermes-week/conteudo";

/* ============================================================================
 *  /hermes-week/a  ·  VARIAÇÃO A (a cena)
 * ----------------------------------------------------------------------------
 *  As irmãs vivem em /hermes-week/b|c|d|e, cada uma com rota estática própria.
 *  A rota é estática, e não [variante] dinâmica, por um motivo concreto: cada
 *  variação tem seu PRÓPRIO design e suas PRÓPRIAS fontes. Numa rota dinâmica o
 *  Next precisaria importar as cinco páginas no mesmo módulo, e as fontes das
 *  cinco entrariam no CSS de todas. Rota estática por variação = cada URL baixa
 *  só as duas ou três fontes que usa.
 *
 *  Só esta é indexável: as variantes carregam noindex e canonical apontando
 *  para cá, para o teste não fatiar o tráfego orgânico em cinco URLs.
 * ==========================================================================*/

const v = VARIANTES.A;

export const metadata: Metadata = {
  title: v.seo.titulo,
  description: v.seo.descricao,
  robots: { index: false, follow: true },
  alternates: { canonical: "https://redpro.com.br/hermes-week" },
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/hermes-week/a",
    title: v.seo.titulo,
    description: v.seo.descricao,
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: v.seo.titulo, description: v.seo.descricao },
};

/* A data do ciclo muda uma vez por semana: 10 min de cache é folga. */
export const revalidate = 600;

export default async function Page() {
  const ciclo = formatarCiclo((await lerCicloAtual({ revalidar: 600 })).dataInicio);
  return <LpA v={comDatas(v, ciclo)} ciclo={ciclo} />;
}
