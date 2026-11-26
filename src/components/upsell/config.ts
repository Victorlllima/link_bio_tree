// Upsell do EA² (produto Hotmart 8660306). Tudo que muda mora aqui.
// Preços e links NÃO confirmados: enquanto PRECOS_CONFIRMADOS for false, as páginas
// mostram a faixa "rascunho" e não devem ir ao ar.

export const PRECOS_CONFIRMADOS = true;

// ONE TIME OFFER: só é verdade se a Hotmart estiver configurada como upsell de uma
// oferta só, sem esta página linkada em outro lugar. Conferir com a MIRA e a ION.
export const LINK_ACEITAR_1 = "https://pay.hotmart.com/N108608837C?off=ioehae1s"; // Mentoria Empresa Agêntica (ex-FA²), upsell EA²+Mentoria, R$ 4.750 (MIRA, 22/11)
export const LINK_ACEITAR_2 = "https://pay.hotmart.com/R108608890P?off=gig2ersp"; // Sua empresa no automático (6 meses), entrada R$ 12.500 (MIRA). Mensal à parte (LINK_MENSALIDADE)
// Mensalidade da consultoria: assinatura separada (MIRA, produto 9041032, aprovado pelo Red 22/11).
// A Hotmart não junta entrada e assinatura: o passo 2 aparece no obrigado com ?aceitou=consultoria.
export const LINK_MENSALIDADE = "https://pay.hotmart.com/Y108611671X?off=7inbqv2l";
export const URL_OBRIGADO = "/ea2/obrigado"; // página final do EA² (recusar nos dois upsells)
export const URL_UPSELL_2 = "/ea2/oferta-implementacao"; // destino de quem aceita o 1 (ION encaminha)

// Mentoria anual de R$ 20.000 NÃO existe (Red, 21/11): sem ancoragem nela.

export const OFERTA_1 = {
  preco: "R$ 6.000", // total EA² + Mentoria (Red, 21/11)
  detalhe: "no total. Você já pagou R$ 1.250 no EA²: falta R$ 4.750.",
  ancora: "Separado seria R$ 9.250: EA² R$ 1.250 + Mentoria avulsa R$ 8.000.",
};

export const OFERTA_2 = {
  implementacao: "R$ 12.500",
  mensal: "R$ 1.500",
  meses: 6,
};

// Mentoria Empresa Agêntica (ex-FA²): texto aprovado pelo Red em 22/11 (d82c07f).
// Usado no upsell 1 (/ea2/oferta-formacao) e na oferta do obrigado do EA² (/ea2/obrigado).
export const MENTORIA = {
  nome: "Mentoria Empresa Agêntica",
  promessa: "Um time inteiro trabalhando para você, sem contratar ninguém.",
  itens: [
    "Os sistemas prontos, instalados na sua empresa: 2 Squads com 19 agentes, Genix OS, painel de acompanhamento, Esteira de conteúdo e instalador",
    "As 4 aulas do EA² viram implantação guiada, no caso real da sua empresa: diagnóstico, primeiro Squad trabalhando até o mês 2, mais frentes, produção segura com custo sob controle",
    "6 meses de acompanhamento comigo: 1 encontro ao vivo por semana, às terças, 15h, a partir de 01/12",
    "Amanda e os agentes no suporte do dia a dia",
    "Comunidade aberta entre os alunos",
    "Genix OS enquanto você for aluno. Para clientes, se quiser vender o serviço: licença de R$ 150/mês, o 1º cliente sem custo",
    "Modelos de proposta e contrato, como extra para quem quiser vender implementação",
    "10 vagas novas por mês",
  ],
  garantia:
    "Se você fizer todos os passos da jornada até o fim do mês 2 e não tiver o primeiro Squad trabalhando na sua empresa, nós fazemos uma call de alinhamento e ações para os próximos 2 meses. Se ainda assim não tiver, eu devolvo seu dinheiro + R$ 500 do meu bolso.",
};

// Checkout da oferta no obrigado do EA² (oferta Hotmart ioehae1s, R$ 4.750).
// A MIRA confirma o link exato; até lá vale a variável EA2_OBRIGADO_CHECKOUT_MENTORIA ou o link do upsell 1.
export const linkCheckoutMentoria = () => process.env.EA2_OBRIGADO_CHECKOUT_MENTORIA || LINK_ACEITAR_1;

// Agenda da call da consultoria (obrigado da Mentoria, /fa2/obrigado). O link vem do Rigel.
// Sem a variável FA2_LINK_AGENDA a página mostra a faixa de rascunho.
export const linkAgendaCall = () => process.env.FA2_LINK_AGENDA || "";
