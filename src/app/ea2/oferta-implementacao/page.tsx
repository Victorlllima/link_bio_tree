import type { Metadata } from "next";
import Oferta from "@/components/upsell/Oferta";
import { LINK_ACEITAR_2, OFERTA_2, URL_OBRIGADO } from "@/components/upsell/config";

export const metadata: Metadata = {
  title: "Sua empresa no automático | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// UPSELL 2: só quem aceitou o 1. Recusar vai à confirmação do EA².
export default function Page() {
  return (
    <Oferta
      nome="implementacao"
      etapa="Mais um passo, opcional"
      titulo="Sua empresa no automático"
      lead="Eu e o Genix Lab implantamos os Squads na sua empresa e acompanhamos a operação por 6 meses. Esta oferta aparece só aqui."
      itens={[
        "Implantação dos 2 Squads, marketing e desenvolvimento, na sua empresa, feita por mim e pelo Genix Lab",
        "6 meses de operação acompanhada",
        "EA² e FA² (Formação Arquiteto de Agentes) inclusos",
        "Genix OS ativo durante todo o contrato",
      ]}
      precoLabel="Implantação"
      preco={OFERTA_2.implementacao}
      precoDetalhe={`mais ${OFERTA_2.mensal} por mês, durante ${OFERTA_2.meses} meses.`}
      aceitarTexto="Sim, quero minha empresa no automático"
      aceitarHref={LINK_ACEITAR_2}
      recusarTexto="Não, obrigado. Ir para a confirmação do EA²"
      recusarHref={URL_OBRIGADO}
      aviso="O resultado depende do seu trabalho e da sua aplicação. Não há promessa de ganho. Seus acessos anteriores continuam valendo, aceitando ou não."
    />
  );
}
