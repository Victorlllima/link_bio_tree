import type { Metadata } from "next";
import Oferta from "@/components/upsell/Oferta";
import { LINK_ACEITAR_1, OFERTA_1, URL_OBRIGADO } from "@/components/upsell/config";

export const metadata: Metadata = {
  title: "Mentoria Empresa Agêntica | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// UPSELL 1 do EA²: Mentoria Empresa Agêntica (ex-FA², nome final do Red em 22/11). URL e nome="formacao" mantidos (redirect da Hotmart e eventos).
// Conteúdo: FA2-DEFINICAO.md (imersao-arquiteto-qg/03-baldan). Garantia: texto literal aprovado pelo Red em 22/11 (virada).
export default function Page() {
  return (
    <Oferta
      nome="formacao"
      etapa="Sua vaga no EA² está garantida"
      titulo="Quer continuar com a Mentoria Empresa Agêntica?"
      lead="Um time inteiro trabalhando para você, sem contratar ninguém. Esta oferta aparece só nesta página, agora, depois da sua compra do EA². Se não for para você, é só seguir sem ela."
      itens={[
        "Os sistemas prontos, instalados na sua empresa: 2 Squads com 19 agentes, Genix OS, painel de acompanhamento, Esteira de conteúdo e instalador",
        "As 4 aulas do EA² viram implantação guiada, no caso real da sua empresa: diagnóstico, primeiro Squad trabalhando até o mês 2, mais frentes, produção segura com custo sob controle",
        "6 meses de acompanhamento comigo: 1 encontro ao vivo por semana, às terças, 15h, a partir de 01/12",
        "Amanda e os agentes no suporte do dia a dia",
        "Comunidade aberta entre os alunos",
        "Genix OS enquanto você for aluno. Para clientes, se quiser vender o serviço: licença de R$ 150/mês, o 1º cliente sem custo",
        "Modelos de proposta e contrato, como extra para quem quiser vender implementação",
        "10 vagas novas por mês",
      ]}
      precoLabel="EA² + Mentoria"
      preco={OFERTA_1.preco}
      precoDetalhe={OFERTA_1.detalhe}
      ancora={OFERTA_1.ancora}
      garantia="Se você fizer todos os passos da jornada até o fim do mês 2 e não tiver o primeiro Squad trabalhando na sua empresa, nós fazemos uma call de alinhamento e ações para os próximos 2 meses. Se ainda assim não tiver, eu devolvo seu dinheiro + R$ 500 do meu bolso."
      aceitarTexto="Sim, quero a Mentoria"
      aceitarHref={LINK_ACEITAR_1}
      recusarTexto="Não, obrigado. Ir para a confirmação do EA²"
      recusarHref={URL_OBRIGADO}
      aviso="O resultado depende da sua execução e da sua aplicação. Seu EA² já está garantido, aceitando ou não."
    />
  );
}
