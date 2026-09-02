import type { Metadata } from "next";
import { LpC } from "@/components/hermes-week/lp-c";
import { VARIANTES } from "@/components/hermes-week/conteudo";

/* /hermes-week/c · variação C (o insider) · design DOCUMENTO TÉCNICO */

const v = VARIANTES.C;

export const metadata: Metadata = {
  title: v.seo.titulo,
  description: v.seo.descricao,
  robots: { index: false, follow: true },
  alternates: { canonical: "https://redpro.com.br/hermes-week" },
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/hermes-week/c",
    title: v.seo.titulo,
    description: v.seo.descricao,
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: v.seo.titulo, description: v.seo.descricao },
};

export default function Page() {
  return <LpC v={v} />;
}
