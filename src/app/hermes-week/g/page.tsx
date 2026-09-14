import type { Metadata } from "next";
import { LpG } from "@/components/hermes-week/lp-g";
import { lerCicloAtual, formatarCiclo } from "@/lib/ciclo-atual";
import { VARIANTES, comDatas } from "@/components/hermes-week/conteudo";

/* /hermes-week/g · variação G (o painel) · preto piano, vidro, champanhe
 *
 * Copy PRÓPRIA desde 13/09/2026. A G nasceu servindo a copy da D, e deixou de
 * servir quando a auditoria independente da VEGA mostrou que o eixo da D tinha
 * sido revogado pelo Red em 03/09, dois dias depois de a copy ser escrita.
 *
 * A espinha da G é a conta: a objeção real do ICP não está em "não sei fazer",
 * está em "não vale o custo e o trabalho" (`curriculo-week-e-squad.md`). O
 * detalhe do que mudou e por quê está no bloco da G em `conteudo.ts`.
 */

const v = VARIANTES.G;

export const metadata: Metadata = {
  title: v.seo.titulo,
  description: v.seo.descricao,
  robots: { index: false, follow: true },
  alternates: { canonical: "https://redpro.com.br/hermes-week" },
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/hermes-week/g",
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
  return <LpG v={comDatas(v, ciclo)} ciclo={ciclo} />;
}
