/* ============================================================================
 *  Janela de inscrição da Formação Arquiteto de Agentes
 * ----------------------------------------------------------------------------
 *  A Formação só vende na segunda do carrinho, das 7h às 21h (Brasília). Todo
 *  ciclo vai de segunda a segunda: o carrinho de uma turma cai no mesmo dia da
 *  Aula 1 da turma seguinte. Como o Alfred vira `ciclo_atual` para a próxima
 *  turma logo que a atual começa (em 12/10/2026 a linha já dizia 19/10), a
 *  próxima segunda de carrinho é a primeira de D0, D0+7, D0+14... que ainda
 *  não fechou. Regra do ciclo 2 em diante, registrada em
 *  Starlight/HERMES/3-ECOSSISTEMA/mensageria-ciclo-2.md ("abre seg às 07h para
 *  todo mundo e fecha às 21h").
 *
 *  Se a linha ficar velha, a conta anda de 7 em 7 dias, para a página nunca
 *  anunciar data passada.
 *
 *  Fora da janela, o botão vira lista de espera (decisão do Red, 12/10/2026).
 *  🔴 A janela daqui só é verdade se a oferta for pausada na Hotmart às 21h.
 * ==========================================================================*/

export type Carrinho = {
  aberto: boolean;
  /** ISO da abertura (a atual, se aberto; a próxima, se fechado) */
  abre: string;
  fecha: string;
};

const BRT = 3 * 3600_000; // Brasil é GMT-3 fixo
const DIA = 86400_000;

export function calcularCarrinho(dataInicio: string, agora = Date.now()): Carrinho {
  const [a, m, d] = dataInicio.split("-").map(Number);
  // segunda do carrinho às 00h de Brasília, em UTC
  let segunda = Date.UTC(a, m - 1, d) + BRT;
  let abre = segunda + 7 * 3600_000;
  let fecha = segunda + 21 * 3600_000;
  while (agora >= fecha) {
    segunda += 7 * DIA;
    abre += 7 * DIA;
    fecha += 7 * DIA;
  }
  return {
    aberto: agora >= abre && agora < fecha,
    abre: new Date(abre).toISOString(),
    fecha: new Date(fecha).toISOString(),
  };
}

/** "segunda, 19/10" no horário de Brasília */
export function dataCurta(iso: string): string {
  const t = new Date(new Date(iso).getTime() - BRT);
  const dd = String(t.getUTCDate()).padStart(2, "0");
  const mm = String(t.getUTCMonth() + 1).padStart(2, "0");
  return `segunda, ${dd}/${mm}`;
}
