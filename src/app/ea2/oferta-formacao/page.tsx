import type { Metadata } from "next";
import Oferta from "@/components/upsell/Oferta";
import { LINK_ACEITAR_1, MENTORIA, OFERTA_1, URL_OBRIGADO } from "@/components/upsell/config";

export const metadata: Metadata = {
  title: "Formação Arquiteto de Agentes | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// UPSELL 1 do EA²: FA², Formação Arquiteto de Agentes (nome de volta, Red 26/11). URL e nome="formacao" mantidos (redirect da Hotmart e eventos).
// Conteúdo: FA2-DEFINICAO.md (imersao-arquiteto-qg/03-baldan). Garantia: texto literal aprovado pelo Red em 22/11 (virada).
export default function Page() {
  return (
    <Oferta
      nome="formacao"
      etapa="Sua vaga no EA² está garantida"
      titulo="Upgrade para a Formação Arquiteto de Agentes"
      lead="Seis meses comigo, ao vivo, até cada área da sua empresa rodar com agentes. Esta oferta aparece só nesta página, agora, depois da sua compra do EA². Se não for para você, é só seguir sem ela."
      itens={MENTORIA.itens}
      precoLabel="EA² + FA²"
      preco={OFERTA_1.preco}
      precoDetalhe={OFERTA_1.detalhe}
      ancora={OFERTA_1.ancora}
      garantia={MENTORIA.garantia}
      aceitarTexto="Sim, quero o upgrade para a FA²"
      aceitarHref={LINK_ACEITAR_1}
      recusarTexto="Não, obrigado. Ir para a confirmação do EA²"
      recusarHref={URL_OBRIGADO}
      aviso="O resultado depende da sua execução e da sua aplicação. Seu EA² já está garantido, aceitando ou não."
    />
  );
}
