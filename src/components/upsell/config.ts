// Upsell do EA² (produto Hotmart 8660306). Tudo que muda mora aqui.
// Preços e links NÃO confirmados: enquanto PRECOS_CONFIRMADOS for false, as páginas
// mostram a faixa "rascunho" e não devem ir ao ar.

export const PRECOS_CONFIRMADOS = false;

// ONE TIME OFFER: só é verdade se a Hotmart estiver configurada como upsell de uma
// oferta só, sem esta página linkada em outro lugar. Conferir com a MIRA e a ION.
export const LINK_ACEITAR_1 = "#link-compra-upsell-1"; // MIRA cria na Hotmart
export const LINK_ACEITAR_2 = "#link-compra-upsell-2"; // MIRA cria na Hotmart
export const URL_OBRIGADO = "/obrigado"; // ION define a página de obrigado do EA²
export const URL_UPSELL_2 = "/ea2/oferta-implementacao"; // destino de quem aceita o 1 (ION encaminha)

// Ancoragem: só ligar se o Red confirmar que a mentoria anual existe como oferta.
export const ANCORA_MENTORIA_ANUAL = false;
export const PRECO_MENTORIA_ANUAL = "R$ 20.000";

export const OFERTA_1 = {
  preco: "R$ 6.000", // PENDENTE: total (EA² + Formação) ou adicional ao EA² já pago?
  precoNota: "Você já pagou o EA². O valor é referente ao upgrade para a Formação.",
};

export const OFERTA_2 = {
  implementacao: "R$ 12.500",
  mensal: "R$ 1.500",
  meses: 6,
};
