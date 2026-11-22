import type { Metadata } from "next";
import Oferta from "@/components/upsell/Oferta";
import { LINK_ACEITAR_1, OFERTA_1, URL_OBRIGADO } from "@/components/upsell/config";

export const metadata: Metadata = {
  title: "FA² | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// UPSELL 1 do EA²: aparece só aqui, depois da compra. Aceitar vai ao checkout da FA².
// Conteúdo: FA2-DEFINICAO.md (imersao-arquiteto-qg/03-baldan). Garantia: texto literal aprovado pelo Red em 22/11 (virada).
export default function Page() {
  return (
    <Oferta
      nome="formacao"
      etapa="Sua vaga no EA² está garantida"
      titulo="Quer continuar com a FA², a Formação Arquiteto de Agentes?"
      lead="Esta oferta aparece só nesta página, agora, depois da sua compra do EA². Se não for para você, é só seguir sem ela."
      itens={[
        "Um time inteiro trabalhando para você, sem contratar ninguém",
        "Acompanhamento ao vivo da implementação dos Squads na sua empresa: diagnóstico, primeiro Squad trabalhando até o mês 2, mais frentes, produção segura com custo sob controle",
        "Terças, 15h, ao vivo, com análise da operação de cada aluno, a partir de 01/12",
        "2 sessões individuais, liberadas por marco",
        "Comunidade aberta entre os alunos",
        "Genix OS enquanto você for aluno. Para clientes, se quiser vender o serviço: licença de R$ 150/mês, o 1º cliente sem custo",
        "Modelos de proposta e contrato, como extra para quem quiser vender implementação",
        "10 vagas novas por mês",
      ]}
      precoLabel="EA² + FA²"
      preco={OFERTA_1.preco}
      precoDetalhe={OFERTA_1.detalhe}
      ancora={OFERTA_1.ancora}
      garantia="Se você fizer todos os passos da jornada até o fim do mês 2 e não tiver o primeiro Squad trabalhando na sua empresa, nós fazemos uma call de alinhamento e ações para os próximos 2 meses. Se ainda assim não tiver, eu devolvo seu dinheiro + R$ 500 do meu bolso."
      aceitarTexto="Sim, quero a FA²"
      aceitarHref={LINK_ACEITAR_1}
      recusarTexto="Não, obrigado. Ir para a confirmação do EA²"
      recusarHref={URL_OBRIGADO}
      aviso="O resultado depende da sua execução e da sua aplicação. Seu EA² já está garantido, aceitando ou não."
    />
  );
}
