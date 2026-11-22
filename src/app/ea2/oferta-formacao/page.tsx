import type { Metadata } from "next";
import Oferta from "@/components/upsell/Oferta";
import { LINK_ACEITAR_1, OFERTA_1, URL_OBRIGADO } from "@/components/upsell/config";

export const metadata: Metadata = {
  title: "FA² | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// UPSELL 1 do EA²: aparece só aqui, depois da compra. Aceitar vai ao checkout da FA².
// Conteúdo: FA2-DEFINICAO.md (imersao-arquiteto-qg/03-baldan). Garantia: texto literal aprovado pelo Red em 21/11.
export default function Page() {
  return (
    <Oferta
      nome="formacao"
      etapa="Sua vaga no EA² está garantida"
      titulo="Quer continuar com a FA², a Formação Arquiteto de Agentes?"
      lead="Esta oferta aparece só nesta página, agora, depois da sua compra do EA². Se não for para você, é só seguir sem ela."
      itens={[
        "Mentoria em grupo por 6 meses, com encontro às terças, 15h, a partir de 01/12",
        "A meta do programa: 3 clientes pagando mensalidade em 6 meses, vendendo Squad de marketing para pequenas empresas locais",
        "Arsenal: Squads, Genix OS (licença por cliente, o 1º cliente sem custo), proposta e contrato, roteiro de venda e playbook de entrega",
        "2 sessões individuais, liberadas conforme você executa os passos",
        "Comunidade aberta entre os alunos",
        "10 vagas novas por mês",
      ]}
      precoLabel="EA² + FA²"
      preco={OFERTA_1.preco}
      precoDetalhe={OFERTA_1.detalhe}
      ancora={OFERTA_1.ancora}
      garantia="Se você fizer todos os passos da jornada até o fim do mês 2 e não fechar o primeiro cliente, nós fazemos uma call de alinhamento e ações para os próximos 2 meses. Se ainda assim não fechar, eu devolvo seu dinheiro + R$ 500 do meu bolso."
      aceitarTexto="Sim, quero a FA²"
      aceitarHref={LINK_ACEITAR_1}
      recusarTexto="Não, obrigado. Ir para a confirmação do EA²"
      recusarHref={URL_OBRIGADO}
      aviso="A meta é o objetivo do programa, não uma promessa: o resultado depende da sua execução e da sua aplicação. Seu EA² já está garantido, aceitando ou não."
    />
  );
}
