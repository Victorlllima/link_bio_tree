import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { LpFormacao } from "@/components/formacao/lp";
import { calcularCarrinho } from "@/components/formacao/carrinho";
import { lerCicloAtual } from "@/lib/ciclo-atual";

/* /formacao · LP da Formação Arquiteto de Agentes (R$997, Hotmart 8660306)
 *
 * Planejamento, decisões do Red e custo do voo: Starlight/HERMES/4-MARKETING/
 * landing-formacao-3d/ (PLANO-DO-VOO.md, FACHADAS.md) e .claude/LOG-DE-ACOES.md,
 * 12/10/2026. A janela do carrinho sai de `ciclo_atual` (ver carrinho.ts).
 */

const titulo = "Formação Arquiteto de Agentes · RedPro AI Academy";
const descricao =
  "Sete módulos e 66 aulas para tirar o seu agente da máquina e montar um time que roda 24 horas. Inscrições na segunda depois de cada Hermes Week.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: "https://redpro.com.br/formacao" },
  openGraph: { type: "website", url: "https://redpro.com.br/formacao", title: titulo, description: descricao, locale: "pt_BR" },
  twitter: { card: "summary_large_image", title: titulo, description: descricao },
};

const sans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--fm-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--fm-mono" });

export const revalidate = 300;

export default async function Page() {
  const { dataInicio } = await lerCicloAtual({ revalidar: 300 });
  return <LpFormacao dataInicio={dataInicio} inicial={calcularCarrinho(dataInicio)} fontes={`${sans.variable} ${mono.variable}`} />;
}
