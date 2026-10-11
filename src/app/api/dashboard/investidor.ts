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
import { ACORDO } from "@/app/dashboard/metas";
import type { BaseSimulador, LinhaInvestidor, RespInvestidor } from "@/app/dashboard/tipos";
import { montar, type CicloCal } from "./montar";

const DIA = 86400e3;
const r2 = (n: number) => Math.round(n * 100) / 100;

export async function montarInvestidor(cal: CicloCal[]): Promise<RespInvestidor> {
  const agora = Date.now();
  const dados = await Promise.all(cal.map((c) => montar(c.d0, { leve: true, cal })));

  let saldo = 0;
  const linhas: LinhaInvestidor[] = dados.map((d, i) => {
    const c = cal[i];
    const dias = Math.round((c.captFim.getTime() + 1 - c.captIni.getTime()) / DIA);
    const diasDecorridos = Math.min(dias, Math.max(0, (agora - c.captIni.getTime()) / DIA));

    const gastoDistribuicao = d.trafego.campanhas.filter((x) => x.tipo === "distribuicao").reduce((s, x) => s + x.gasto, 0);
    const gastoOutros = d.financeiro.outros;
    const gasto = d.trafego.gasto + gastoOutros;
    const gastoCaptacao = d.trafego.gasto - gastoDistribuicao;

    const receita = d.financeiro.receitaLiquida;
    const saldoAnterior = saldo;
    const devido = saldoAnterior + gasto;
    const devolvido = Math.min(receita, devido);
    const saldoDepois = devido - devolvido;
    const excedente = Math.max(0, receita - devido);
    saldo = saldoDepois;

    const acordoDia = ACORDO.captacaoDia + ACORDO.distribuicaoDia;
    return {
      d0: d.ciclo.d0,
      nome: d.ciclo.nome,
      fase: d.ciclo.fase.rotulo,
      emCaptacao: d.ciclo.emCaptacao,
      dias,
      diasDecorridos: r2(diasDecorridos),
      acordo: acordoDia * dias,
      acordoCaptacao: ACORDO.captacaoDia * dias,
      acordoDistribuicao: ACORDO.distribuicaoDia * dias,
      acordoAteHoje: r2(acordoDia * diasDecorridos),
      gasto: r2(gasto),
      gastoCaptacao: r2(gastoCaptacao),
      gastoDistribuicao: r2(gastoDistribuicao),
      gastoOutros: r2(gastoOutros),
      distribuicaoManual: d.financeiro.distribuicao,
      receitaLiquida: r2(receita),
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

  const soma = (f: (l: LinhaInvestidor) => number) => r2(linhas.reduce((s, l) => s + f(l), 0));
  const devolvido = soma((l) => l.devolvido);
  const parteInvestidor = soma((l) => l.parteInvestidor);

  const ingressos = soma((l) => l.ingressos);
  const bruto = soma((l) => l.receitaFront);
  const liquido = soma((l) => l.liquidoFront);
  const gastoTotal = soma((l) => l.gasto);
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
    linhas,
    total: {
      gasto: soma((l) => l.gasto),
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
