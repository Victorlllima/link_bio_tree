// ============================================================
// ABA INVESTIDOR — quanto o investidor gastou, quanto já voltou e quanto é lucro, por turma.
//
// Regra do acordo (Red, 11/10/2026):
//   - todo o gasto de mídia é pago pelo investidor;
//   - a receita líquida (comissão da Hotmart) cobre primeiro o investimento, de forma acumulada
//     entre as turmas: o que faltou numa turma continua na dívida da seguinte;
//   - zerado o saldo, o excedente é lucro: 30% investidor, 70% RedPro AI Academy.
// Gasto, receita e janela de cada turma vêm do mesmo `montar` do resto do painel.
// ============================================================
import { ACORDO, TAXAS } from "@/app/dashboard/metas";
import type { BaseSimulador, LinhaInvestidor, RespInvestidor } from "@/app/dashboard/tipos";
import { montar, gastoDepoisDas20, em, type CicloCal } from "./montar";

const DIA = 86400e3;
const r2 = (n: number) => Math.round(n * 100) / 100;

export async function montarInvestidor(cal: CicloCal[]): Promise<RespInvestidor> {
  const agora = Date.now();
  const dados = await Promise.all(cal.map((c) => montar(c.d0, { leve: true, cal })));

  // Corte exato às 20h de segunda (Red, 17/10/2026). A Meta só entrega gasto por dia, então o painel
  // deixa a segunda inteira com a turma que acaba. Aqui o gasto depois das 20h dessa segunda passa
  // para a turma seguinte, pelo breakdown por hora da Meta.
  const pos20 = new Map<string, Promise<number>>();
  const depois20 = (d: string) => (pos20.has(d) ? pos20.get(d)! : (pos20.set(d, gastoDepoisDas20(d).catch(() => 0)), pos20.get(d)!));
  const ajustes = await Promise.all(
    cal.map(async (c, i) => {
      let aj = 0;
      const terminaAs20 = c.captFim.getTime() === em(c.d0, "20:00").getTime() - 1;
      if (terminaAs20) aj -= await depois20(c.d0);
      const ant = cal[i - 1];
      if (ant && c.captIni.getTime() === em(ant.d0, "20:00").getTime()) aj += await depois20(ant.d0);
      return aj;
    }),
  );

  let saldo = 0;
  const linhas: LinhaInvestidor[] = dados.map((d, i) => {
    const c = cal[i];
    const dias = Math.round((c.captFim.getTime() + 1 - c.captIni.getTime()) / DIA);
    const diasDecorridos = Math.min(dias, Math.max(0, (agora - c.captIni.getTime()) / DIA));

    const gastoDistribuicao = d.trafego.campanhas.filter((x) => x.tipo === "distribuicao").reduce((s, x) => s + x.gasto, 0);
    const gastoOutros = d.financeiro.outros;
    // o investidor paga o gasto da Meta mais o imposto que a Meta soma na fatura
    const gastoMeta = d.trafego.gasto + ajustes[i] + gastoOutros;
    const fatorMeta = 1 + TAXAS.metaSobreGastoPct / 100;
    const taxaMeta = gastoMeta * (fatorMeta - 1);
    const gasto = gastoMeta * fatorMeta;
    const gastoCaptacao = (d.trafego.gasto + ajustes[i] - gastoDistribuicao) * fatorMeta;

    // receita do acordo: comissão da Hotmart (já sem a taxa dela), menos reembolsos, menos imposto sobre a receita
    const reembolsos = d.financeiro.reembolsado;
    const baseReceita = d.financeiro.receitaLiquida - reembolsos;
    const impostoReceita = Math.max(0, baseReceita) * (TAXAS.impostoSobreReceitaPct / 100);
    const receita = baseReceita - impostoReceita;
    // Turma anterior à entrada do investidor: a RedPro bancou e fica com tudo, nada entra na conta dele.
    const fora = c.d0 < ACORDO.primeiraTurma;
    const saldoAnterior = fora ? 0 : saldo;
    const devido = saldoAnterior + gasto;
    const devolvido = fora ? 0 : Math.min(receita, devido);
    const saldoDepois = fora ? 0 : devido - devolvido;
    const excedente = fora ? 0 : Math.max(0, receita - devido);
    if (!fora) saldo = saldoDepois;

    const acordoDia = fora ? 0 : ACORDO.captacaoDia + ACORDO.distribuicaoDia;
    return {
      d0: d.ciclo.d0,
      nome: d.ciclo.nome,
      fase: d.ciclo.fase.rotulo,
      emCaptacao: d.ciclo.emCaptacao,
      foraDoAcordo: fora,
      dias,
      diasDecorridos: r2(diasDecorridos),
      acordo: acordoDia * dias,
      acordoCaptacao: fora ? 0 : ACORDO.captacaoDia * dias,
      acordoDistribuicao: fora ? 0 : ACORDO.distribuicaoDia * dias,
      acordoAteHoje: r2(acordoDia * diasDecorridos),
      gasto: r2(gasto),
      gastoMeta: r2(gastoMeta),
      taxaMeta: r2(taxaMeta),
      gastoCaptacao: r2(gastoCaptacao),
      gastoDistribuicao: r2(gastoDistribuicao * fatorMeta),
      gastoOutros: r2(gastoOutros),
      distribuicaoManual: d.financeiro.distribuicao,
      receitaLiquida: r2(receita),
      receitaBruta: r2(d.financeiro.receitaBruta),
      taxaHotmart: r2(d.financeiro.taxaHotmart),
      reembolsos: r2(reembolsos),
      impostoReceita: r2(impostoReceita),
      ingressos: d.vendas.ingressos,
      receitaFront: r2(d.vendas.receitaFront),
      liquidoFront: r2(d.vendas.liquidoFront),
      vendasFormacao: d.backend.vendas ?? 0,
      receitaFormacao: r2(d.backend.receita ?? 0),
      liquidoFormacao: r2(d.backend.liquido ?? 0),
      carrinhoFechado: new Date(d.ciclo.carrinhoFecha).getTime() < agora,
      saldoAnterior: r2(saldoAnterior),
      devolvido: r2(devolvido),
      saldoDepois: r2(saldoDepois),
      excedente: r2(excedente),
      parteInvestidor: r2(excedente * ACORDO.parteInvestidor),
      parteRedpro: r2(excedente * (1 - ACORDO.parteInvestidor)),
    };
  });

  const noAcordo = linhas.filter((l) => !l.foraDoAcordo);
  const soma = (f: (l: LinhaInvestidor) => number) => r2(noAcordo.reduce((s, l) => s + f(l), 0));
  const somaTodas = (f: (l: LinhaInvestidor) => number) => r2(linhas.reduce((s, l) => s + f(l), 0));
  const devolvido = soma((l) => l.devolvido);
  const parteInvestidor = soma((l) => l.parteInvestidor);

  // KPIs de desempenho valem para todas as turmas, inclusive a Turma 1; só o dinheiro do investidor exclui.
  const ingressos = somaTodas((l) => l.ingressos);
  const bruto = somaTodas((l) => l.receitaFront);
  const liquido = somaTodas((l) => l.liquidoFront);
  const gastoTotal = somaTodas((l) => l.gasto);
  const fechadas = linhas.filter((l) => l.carrinhoFechado);
  const convIng = fechadas.reduce((s, l) => s + l.ingressos, 0);
  const convVendas = fechadas.reduce((s, l) => s + l.vendasFormacao, 0);
  const taxa = bruto > 0 ? Math.max(0, 1 - liquido / bruto) : 0.1;
  const preco = dados[dados.length - 1]?.backend.preco ?? 997;
  const formacaoBruta = linhas.reduce((s, l) => s + l.receitaFormacao, 0);
  const formacaoVendas = linhas.reduce((s, l) => s + l.vendasFormacao, 0);
  const formacaoLiq = linhas.reduce((s, l) => s + l.liquidoFormacao, 0);
  const base: BaseSimulador = {
    ingressos,
    gasto: gastoTotal,
    cpa: ingressos > 0 ? r2(gastoTotal / ingressos) : null,
    ticketBruto: ingressos > 0 ? r2(bruto / ingressos) : null,
    ticketLiquido: ingressos > 0 ? r2(liquido / ingressos) : null,
    taxa: r2(taxa * 10000) / 10000,
    convFormacao: convIng > 0 ? r2((convVendas / convIng) * 100) : null,
    convBase: { vendas: convVendas, ingressos: convIng },
    formacaoPreco: preco,
    formacaoLiquida: formacaoVendas > 0 && formacaoBruta > 0 ? r2(formacaoLiq / formacaoVendas) : r2(preco * (1 - taxa)),
  };
  return {
    geradoEm: new Date().toISOString(),
    base,
    acordo: { ...ACORDO },
    taxas: { ...TAXAS },
    linhas,
    total: {
      gasto: soma((l) => l.gasto),
      gastoMeta: soma((l) => l.gastoMeta),
      taxaMeta: soma((l) => l.taxaMeta),
      receitaBruta: soma((l) => l.receitaBruta),
      taxaHotmart: soma((l) => l.taxaHotmart),
      reembolsos: soma((l) => l.reembolsos),
      impostoReceita: soma((l) => l.impostoReceita),
      receitaLiquida: soma((l) => l.receitaLiquida),
      devolvido,
      saldoDevedor: r2(saldo),
      excedente: soma((l) => l.excedente),
      parteInvestidor,
      parteRedpro: soma((l) => l.parteRedpro),
      retornoInvestidor: r2(devolvido + parteInvestidor),
    },
  };
}
