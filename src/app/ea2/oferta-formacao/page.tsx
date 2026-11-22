import type { Metadata } from "next";
import Oferta from "@/components/upsell/Oferta";
import { LINK_ACEITAR_1, OFERTA_1, URL_OBRIGADO, ANCORA_MENTORIA_ANUAL, PRECO_MENTORIA_ANUAL } from "@/components/upsell/config";

export const metadata: Metadata = {
  title: "Formação Arquiteto de Agentes | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// UPSELL 1 do EA²: aparece só aqui, depois da compra. Aceitar vai ao checkout da Formação.
export default function Page() {
  return (
    <Oferta
      nome="formacao"
      etapa="Sua vaga no EA² está garantida"
      titulo="Quer ir além com a Formação Arquiteto de Agentes?"
      lead="Esta oferta aparece só nesta página, agora, depois da sua compra do EA². Se não for para você, é só seguir sem ela."
      itens={[
        "EA², Estudos Avançados em Agentes",
        "Formação Arquiteto de Agentes, a mentoria de 6 meses",
        "Mesma linha de trabalho, com acompanhamento até o fim",
      ]}
      precoLabel="EA² + Formação"
      preco={OFERTA_1.preco}
      nota={OFERTA_1.precoNota}
      ancora={ANCORA_MENTORIA_ANUAL ? `A mentoria anual custa ${PRECO_MENTORIA_ANUAL}.` : undefined}
      aceitarTexto="Sim, quero a Formação"
      aceitarHref={LINK_ACEITAR_1}
      recusarTexto="Não, obrigado. Ir para a confirmação do EA²"
      recusarHref={URL_OBRIGADO}
      aviso="O resultado depende do seu trabalho e da sua aplicação. Não há promessa de ganho. Seu EA² já está garantido, aceitando ou não."
    />
  );
}
