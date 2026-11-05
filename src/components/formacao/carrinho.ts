/* ============================================================================
 *  Janela de inscrição da Formação Arquiteto de Agentes
 * ----------------------------------------------------------------------------
 *  Fonte: Starlight/HERMES/2-PRODUTO/imersao/QG-IMERSAO.md §1.1 (aprovado pelo Red
 *  em 02/11/2026). O carrinho abre na noite 2 da Imersão (quinta 26/11, a noite
 *  começa às 19h) e fecha na segunda 30/11 às 23h59. Mudou a data? Troque só
 *  as duas constantes abaixo. Fora da janela, o botão vira lista de espera.
 *  🔴 A janela daqui só é verdade se a oferta da Hotmart abrir e fechar junto.
 * ==========================================================================*/

const ABRE = "2026-11-26T19:00:00-03:00";
const FECHA = "2026-11-30T23:59:00-03:00";

export type Carrinho = {
  aberto: boolean;
  /** já passou do fechamento */
  encerrado: boolean;
  abre: string;
  fecha: string;
};

/** O primeiro argumento ficou por compatibilidade com a página; a janela é fixa. */
export function calcularCarrinho(_dataInicio?: string, agora = Date.now()): Carrinho {
  const a = new Date(ABRE).getTime();
  const f = new Date(FECHA).getTime();
  return { aberto: agora >= a && agora < f, encerrado: agora >= f, abre: ABRE, fecha: FECHA };
}

const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** "quinta, 26/11" no horário de Brasília */
export function dataCurta(iso: string): string {
  const t = new Date(new Date(iso).getTime() - 3 * 3600_000);
  const dd = String(t.getUTCDate()).padStart(2, "0");
  const mm = String(t.getUTCMonth() + 1).padStart(2, "0");
  return `${DIAS[t.getUTCDay()]}, ${dd}/${mm}`;
}
