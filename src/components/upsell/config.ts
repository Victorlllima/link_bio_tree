// Upsell do EA² (produto Hotmart 8660306). Tudo que muda mora aqui.
// Preços e links NÃO confirmados: enquanto PRECOS_CONFIRMADOS for false, as páginas
// mostram a faixa "rascunho" e não devem ir ao ar.

export const PRECOS_CONFIRMADOS = false;

// ONE TIME OFFER: só é verdade se a Hotmart estiver configurada como upsell de uma
// oferta só, sem esta página linkada em outro lugar. Conferir com a MIRA e a ION.
export const LINK_ACEITAR_1 = "https://pay.hotmart.com/N108608837C?off=ioehae1s"; // FA² upsell EA²+FA², R$ 4.750 (MIRA, 22/11)
export const LINK_ACEITAR_2 = "https://pay.hotmart.com/R108608890P?off=gig2ersp"; // Sua empresa no automático (6 meses), entrada R$ 12.500 (MIRA). Mensal à parte (LINK_MENSALIDADE)
// Mensalidade da consultoria: assinatura separada (MIRA, produto 9041032, aprovado pelo Red 22/11).
// A Hotmart não junta entrada e assinatura: o passo 2 aparece no obrigado com ?aceitou=consultoria.
export const LINK_MENSALIDADE = "https://pay.hotmart.com/Y108611671X?off=7inbqv2l";
export const URL_OBRIGADO = "/ea2/obrigado"; // página final do EA² (recusar nos dois upsells)
export const URL_UPSELL_2 = "/ea2/oferta-implementacao"; // destino de quem aceita o 1 (ION encaminha)

// Mentoria anual de R$ 20.000 NÃO existe (Red, 21/11): sem ancoragem nela.

export const OFERTA_1 = {
  preco: "R$ 6.000", // total EA² + FA² (Red, 21/11)
  detalhe: "no total. Você já pagou R$ 1.250 no EA²: falta R$ 4.750.",
  ancora: "Separado seria R$ 9.250: EA² R$ 1.250 + FA² avulsa R$ 8.000.",
};

export const OFERTA_2 = {
  implementacao: "R$ 12.500",
  mensal: "R$ 1.500",
  meses: 6,
};
