import type { Metadata } from "next";
import { LpG } from "@/components/hermes-week/lp-g";
import { lerCicloAtual, formatarCiclo } from "@/lib/ciclo-atual";
import { VARIANTES, comDatas } from "@/components/hermes-week/conteudo";

/* /hermes-week/g · variação G (o painel) · preto piano, vidro, champanhe
 *
 * A G NÃO TEM COPY PRÓPRIA. Ela lê a copy da D, que o Red aprovou com nota 10
 * em 11/09/2026 na mesma conversa em que deu nota 1 para o design da D. O que
 * está sendo testado aqui é desenho contra desenho, com o texto fixo — que é
 * a única forma do resultado dizer alguma coisa sobre o desenho.
 *
 * Por isso o SEO também é o da D: mesma promessa, mesma página, outra roupa.
 */

const v = VARIANTES.D;

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
