import type { Metadata } from "next";
import { LpC } from "@/components/hermes-week/lp-c";
import { lerCicloAtual, formatarCiclo } from "@/lib/ciclo-atual";
import { VARIANTES, comDatas } from "@/components/hermes-week/conteudo";

/* /hermes-week/c · variação C (o insider) · design DOCUMENTO TÉCNICO */

const v = VARIANTES.C;

/* A descrição desta variação cita a semana do ciclo, então a metadata é
   resolvida em runtime — `export const metadata` congelaria a data do build. */
export async function generateMetadata(): Promise<Metadata> {
  const ciclo = formatarCiclo((await lerCicloAtual({ revalidar: 600 })).dataInicio);
  const seo = comDatas(v.seo, ciclo);
  return {
    title: seo.titulo,
    description: seo.descricao,
    robots: { index: false, follow: true },
    alternates: { canonical: "https://redpro.com.br/hermes-week" },
    openGraph: {
      type: "website",
      url: "https://redpro.com.br/hermes-week/c",
      title: seo.titulo,
      description: seo.descricao,
      locale: "pt_BR",
    },
    twitter: { card: "summary_large_image", title: seo.titulo, description: seo.descricao },
  };
}

/* A data do ciclo muda uma vez por semana: 10 min de cache é folga. */
export const revalidate = 600;

export default async function Page() {
  const ciclo = formatarCiclo((await lerCicloAtual({ revalidar: 600 })).dataInicio);
  return <LpC v={comDatas(v, ciclo)} ciclo={ciclo} />;
}
