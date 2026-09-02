import type { Metadata } from "next";
import { LpF } from "@/components/hermes-week/lp-f";

/* /hermes-week/f · variação F (a jornada) · cinemática, skill cine-scroll
   Roteiro aprovado: Starlight/HERMES/05-paginas/lp-F-cinematica-ROTEIRO.md */

const TITULO = "Hermes Week · Seu Agente do Zero à Produção";
const DESCRICAO =
  "Cinco dias pra ter um agente de IA instalado na sua máquina, falando com você pelo Telegram e executando tarefa no horário que você mandar. segunda a sexta, 20h.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  robots: { index: false, follow: true },
  alternates: { canonical: "https://redpro.com.br/hermes-week" },
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/hermes-week/f",
    title: TITULO,
    description: DESCRICAO,
    locale: "pt_BR",
    images: [{ url: "/hermes-week/f/keyframes/cena-04.jpg", width: 1920, height: 1080 }],
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRICAO },
};

export default function Page() {
  return <LpF />;
}
