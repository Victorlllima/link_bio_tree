import type { Metadata } from "next";
import { LpB } from "@/components/hermes-week/lp-b";
import { lerCicloAtual, formatarCiclo } from "@/lib/ciclo-atual";
import { VARIANTES, comDatas } from "@/components/hermes-week/conteudo";

/* /hermes-week/b · variação B (o inventário) · design BENTO
   noindex: é variação de teste, não concorre no orgânico com a canônica. */

const v = VARIANTES.B;

export const metadata: Metadata = {
  title: v.seo.titulo,
  description: v.seo.descricao,
  robots: { index: false, follow: true },
  alternates: { canonical: "https://redpro.com.br/hermes-week" },
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/hermes-week/b",
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
  return <LpB v={comDatas(v, ciclo)} ciclo={ciclo} />;
}
