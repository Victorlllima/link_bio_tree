import type { Metadata } from "next";
import { LpD } from "@/components/hermes-week/lp-d";
import { VARIANTES } from "@/components/hermes-week/conteudo";

/* /hermes-week/d · variação D (o degrau) · design ESCADA / brutalist */

const v = VARIANTES.D;

export const metadata: Metadata = {
  title: v.seo.titulo,
  description: v.seo.descricao,
  robots: { index: false, follow: true },
  alternates: { canonical: "https://redpro.com.br/hermes-week" },
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/hermes-week/d",
    title: v.seo.titulo,
    description: v.seo.descricao,
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: v.seo.titulo, description: v.seo.descricao },
};

export default function Page() {
  return <LpD v={v} />;
}
