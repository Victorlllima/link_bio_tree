import type { Metadata } from "next";
import { LpE } from "@/components/hermes-week/lp-e";
import { VARIANTES } from "@/components/hermes-week/conteudo";

/* /hermes-week/e · variação E (o feriado) · design CLARO E AREJADO */

const v = VARIANTES.E;

export const metadata: Metadata = {
  title: v.seo.titulo,
  description: v.seo.descricao,
  robots: { index: false, follow: true },
  alternates: { canonical: "https://redpro.com.br/hermes-week" },
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/hermes-week/e",
    title: v.seo.titulo,
    description: v.seo.descricao,
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: v.seo.titulo, description: v.seo.descricao },
};

export default function Page() {
  return <LpE v={v} />;
}
