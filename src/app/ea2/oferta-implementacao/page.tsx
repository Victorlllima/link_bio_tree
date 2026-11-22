import type { Metadata } from "next";
import Oferta from "@/components/upsell/Oferta";
import { LINK_ACEITAR_2, OFERTA_2, URL_OBRIGADO } from "@/components/upsell/config";

export const metadata: Metadata = {
  title: "Consultoria com implementação | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// UPSELL 2: só quem aceitou o 1. Recusar vai à confirmação do EA².
export default function Page() {
  return (
    <Oferta
      nome="implementacao"
      etapa="Mais um passo, opcional"
      titulo="Quer que eu implemente com você, por 6 meses?"
      lead="Consultoria de 6 meses com implementação dos agentes no seu negócio. Esta oferta aparece só aqui."
      itens={[
        "Implementação dos agentes no seu negócio",
        "Acompanhamento durante 6 meses",
        "FA², Formação Arquiteto de Agentes, incluída",
        "EA² incluso",
      ]}
      precoLabel="Implementação"
      preco={OFERTA_2.implementacao}
      precoDetalhe={`mais ${OFERTA_2.mensal} por mês, durante ${OFERTA_2.meses} meses.`}
      aceitarTexto="Sim, quero a consultoria"
      aceitarHref={LINK_ACEITAR_2}
      recusarTexto="Não, obrigado. Ir para a confirmação do EA²"
      recusarHref={URL_OBRIGADO}
      aviso="O resultado depende do seu trabalho e da sua aplicação. Não há promessa de ganho. Seus acessos anteriores continuam valendo, aceitando ou não."
    />
  );
}
