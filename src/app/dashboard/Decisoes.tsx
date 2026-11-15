"use client";

// "O que fazer hoje": o método de leitura do Baldan (11/11) escrito no painel, com os números da edição.
// Três andares: 1) ingressos e conversão do produto; 2) CPA, página, bump e ritmo; 3) CTR, carregamento, checkout e CPM.
// Se o andar 1 vai bem, não se mexe em nada. Se vai mal, desce até achar o vazamento.
// Faixas de CPA contra o teto: até teto −20% escala; até teto +20% segura; acima pausa.

import type { DadosImersao, CriativoImersao } from "./tipos";
import { Bloco, fN, fR, fP } from "./ui";

// Taxa da Hotmart conferida nas comissões reais (15/11): 9,9% + R$ 2,49 por venda (R$ 44 → R$ 37,15; R$ 197 → R$ 175,01).
const liq = (preco: number) => preco * 0.901 - 2.49;
const BUMP_PADRAO = 0.1 * liq(197); // antes de ter 10 ingressos: 1 em 10 leva a gravação

export type Teto = { valor: number; ingresso: number; bump: number; preco: number; escala: number; pausa: number; bumpReal: boolean };

export function tetoCpa(d: DadosImersao): Teto {
  const lote = d.lotes.find((l) => l.atual) ?? d.lotes[d.lotes.length - 1];
  const preco = lote?.preco ?? 44;
  const nBumps = d.lotes.reduce((s, l) => s + l.bumps, 0);
  const bumpReal = d.total.vendas >= 10;
  const bump = bumpReal ? Math.max(0, (d.total.receitaBumps * 0.901 - 2.49 * nBumps) / d.total.vendas) : BUMP_PADRAO;
  const ingresso = liq(preco);
  const valor = ingresso + bump;
  return { valor, ingresso, bump, preco, escala: valor * 0.8, pausa: valor * 1.2, bumpReal };
}

type Cor = "verde" | "amarelo" | "vermelho" | "neutro";
type Linha = { rot: string; valor: string; cor: Cor; leitura: string; acao?: string };

const hojeBR = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const dias = (a: string, b: string) => Math.round((Date.parse(`${a}T12:00:00Z`) - Date.parse(`${b}T12:00:00Z`)) / 86400e3);
const ddmm = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}`;

function andares(d: DadosImersao, teto: Teto) {
  const t = d.total;
  const hoje = hojeBR();
  const alvo = d.metas.ingressosMeta ?? 0;
  const restam = Math.max(0, dias(d.edicao.noite1, hoje));
  const passados = d.serie.filter((s) => s.dia < hoje);
  const ult3 = passados.slice(-3);
  const ritmo = ult3.length ? ult3.reduce((s, x) => s + x.vendas, 0) / ult3.length : 0;
  const precisa = restam > 0 ? Math.max(0, (alvo - t.vendas) / restam) : 0;
  const projecao = t.vendas + ritmo * restam;

  const a1: Linha[] = [];
  if (alvo) {
    const ok = projecao >= alvo;
    a1.push({
      rot: "Ingressos",
      valor: `${fN(t.vendas)} de ${fN(alvo)}`,
      cor: t.vendas >= alvo ? "verde" : ok ? "verde" : projecao >= alvo * 0.8 ? "amarelo" : "vermelho",
      leitura: restam > 0
        ? `Faltam ${restam} dias de venda. Precisa de ${fN(precisa, 1)} por dia; os últimos 3 dias deram ${fN(ritmo, 1)} por dia. Nesse ritmo fecha com uns ${fN(projecao)}.`
        : "Vendas do ingresso encerradas.",
    });
  }
  a1.push(d.carrinho && hoje >= d.edicao.noite2
    ? { rot: `Conversão em ${d.carrinho.nome}`, valor: fP(d.carrinho.conversao), cor: d.carrinho.conversao === null ? "neutro" : d.carrinho.conversao >= 8 ? "verde" : d.carrinho.conversao >= 6 ? "amarelo" : "vermelho", leitura: "Baldan: 8 a 12% é o normal; abaixo de 6% a oferta ou o pitch estão fracos." }
    : { rot: "Conversão do produto", valor: "—", cor: "neutro", leitura: "Só existe depois do pitch da noite 2." });

  const cpa = t.cpa;
  const a2: Linha[] = [
    {
      rot: "CPA (custo por ingresso)",
      valor: fR(cpa, 0),
      cor: cpa === null ? "neutro" : cpa <= teto.escala ? "verde" : cpa <= teto.pausa ? "amarelo" : "vermelho",
      leitura: `Teto de ${fR(teto.valor, 0)}: o que entra limpo por ingresso no lote de ${fR(teto.preco, 0)} (${fR(teto.ingresso, 2)} do ingresso + ${fR(teto.bump, 2)} da gravação em média${teto.bumpReal ? "" : ", estimado"}).`,
      acao: cpa === null ? undefined : cpa <= teto.escala ? "Cada ingresso sai bem abaixo do teto: dá para pôr mais verba." : cpa <= teto.pausa ? "Perto do teto: segure, não mexa." : "Pagando mais do que entra. Desça para o 3º andar e ache o anúncio que puxa o custo para cima.",
    },
    {
      rot: "Conversão da página",
      valor: fP(t.convPagina, 2),
      cor: t.convPagina === null ? "neutro" : t.convPagina >= 5 ? "verde" : t.convPagina >= 2.5 ? "amarelo" : "vermelho",
      leitura: "Compras ÷ visitas. Baldan: 5 a 6% bom; abaixo de 2,5% ruim.",
      acao: t.convPagina !== null && t.convPagina < 2.5 ? "A página não convence: rever a primeira dobra, a promessa e o preço à vista (IRIS e VEGA)." : undefined,
    },
    {
      rot: "Taxa da gravação (bump)",
      valor: fP(t.taxaBump, 0),
      cor: t.taxaBump === null ? "neutro" : t.taxaBump >= 8 ? "verde" : "vermelho",
      leitura: "Quem leva a gravação ÷ ingressos. Baldan: 8 a 20%.",
      acao: t.taxaBump !== null && t.taxaBump < 8 ? "Oferta da gravação fraca: rever o texto do bump no checkout (MIRA)." : undefined,
    },
  ];

  const ck = t.checkoutCompra;
  const a3: Linha[] = [
    {
      rot: "CTR do link",
      valor: fP(t.ctr, 2),
      cor: t.ctr === null ? "neutro" : t.ctr >= 1.2 ? "verde" : t.ctr >= 0.7 ? "amarelo" : "vermelho",
      leitura: "Cliques ÷ impressões. Baldan: 1,8%+ Oscar; 1,2 a 1,7 ótimo; 0,9 a 1,1 bom; até 0,6 ruim.",
      acao: t.ctr !== null && t.ctr < 0.9 ? "Os anúncios não fazem clicar: tire verba dos de CTR baixo e ponha nos de CTR alto (aba Criativos)." : undefined,
    },
    {
      rot: "Carregamento (connect rate)",
      valor: fP(t.connect),
      cor: t.connect === null ? "neutro" : t.connect >= 69 ? "verde" : t.connect >= 61 ? "amarelo" : "vermelho",
      leitura: "Visitas ÷ cliques. Baldan: 69%+ bom; abaixo de 60% ruim.",
      acao: t.connect !== null && t.connect < 61 ? "Muita gente clica e não vê a página: conferir velocidade e o link do anúncio (IRIS)." : undefined,
    },
    {
      rot: "Checkout (compra ÷ checkout iniciado)",
      valor: fP(ck),
      cor: ck === null ? "neutro" : ck > 60 ? "amarelo" : ck >= 26 ? "verde" : ck >= 21 ? "amarelo" : "vermelho",
      leitura: "Baldan: 26 a 31% bom; 40%+ excelente; abaixo de 21% tem atrito. Acima de 60% quer dizer que poucos chegam ao checkout: o problema está antes, na página.",
      acao: ck !== null && ck < 21 ? "Atrito no checkout: conferir preço, parcelamento e o passo de pagamento (MIRA)." : ck !== null && ck > 60 ? "Quem chega ao checkout compra. Falta gente chegar: o gargalo é a página." : undefined,
    },
    { rot: "CPM", valor: fR(t.cpm), cor: "neutro", leitura: "Custo de mil impressões. Só pesa quando o CTR está bom e o CPA, ruim: aí o leilão está caro." },
  ];
  return { a1, a2, a3, ritmo, precisa, restam };
}

function veredito(d: DadosImersao, teto: Teto, a: ReturnType<typeof andares>): { titulo: string; cor: Cor; passos: string[] } {
  const ruim = (l: Linha[]) => l.filter((x) => x.cor === "vermelho");
  const a1ok = a.a1.every((x) => x.cor !== "vermelho" && x.cor !== "amarelo");
  if (d.total.vendas === 0) return { titulo: "Sem venda ainda: deixe rodar e olhe só o 3º andar (o anúncio faz clicar?)", cor: "neutro", passos: [] };
  if (a1ok) {
    const passos = d.total.cpa !== null && d.total.cpa <= teto.escala ? ["CPA bem abaixo do teto: suba a verba dos conjuntos que vendem em até 20% (não mais que isso por vez)."] : [];
    return { titulo: "Primeiro andar vai bem: não mexa em nada", cor: "verde", passos };
  }
  const passos = [...ruim(a.a2), ...ruim(a.a3), ...a.a2.filter((x) => x.cor === "amarelo" && x.acao)].map((x) => `${x.rot}: ${x.acao ?? x.leitura}`);
  const uniq = Array.from(new Set(passos)).slice(0, 4);
  if (!uniq.length) uniq.push("Nenhum número de baixo está ruim sozinho: o problema é volume. Mais verba nos anúncios com CPA dentro do teto.");
  return { titulo: "Ingressos abaixo do ritmo: o vazamento está aqui", cor: "vermelho", passos: uniq };
}

const corCls = (c: Cor) => (c === "neutro" ? "" : `c-${c}`);
const bolinha = (c: Cor) => (c === "verde" ? "●" : c === "amarelo" ? "●" : c === "vermelho" ? "●" : "○");

function Andar({ n, titulo, linhas }: { n: number; titulo: string; linhas: Linha[] }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{n}º andar · {titulo}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {linhas.map((l) => (
          <div key={l.rot} style={{ borderLeft: "3px solid var(--borda, rgba(255,255,255,.12))", paddingLeft: 10 }}>
            <div><span className={corCls(l.cor)}>{bolinha(l.cor)}</span> <b>{l.rot}</b>: <span className={`num ${corCls(l.cor)}`}>{l.valor}</span></div>
            <div className="dim3" style={{ fontSize: 12 }}>{l.leitura}</div>
            {l.acao && <div style={{ fontSize: 12.5, marginTop: 2 }}>→ {l.acao}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Campanhas do método (8 campanhas do Baldan), com o que cada uma pede hoje.
function campanhasHoje(d: DadosImersao): { nome: string; funcao: string; quando: string; hoje?: string }[] {
  const hoje = hojeBR();
  const prox = d.lotes.filter((l) => l.n > 1 && l.ini > hoje).sort((a, b) => a.ini.localeCompare(b.ini))[0];
  const virou = d.lotes.find((l) => l.n > 1 && dias(hoje, l.ini) === 0);
  const vespera = prox && dias(prox.ini, hoje) === 1;
  const noite2 = d.edicao.noite2;
  return [
    { nome: "Vendas", funcao: "Vende uns 60% dos ingressos, para frio e quente. Anúncio sem preço e sem data, para não envelhecer na virada.", quando: "Do primeiro ao último dia.", hoje: "Rotina 2x por dia (manhã e fim da tarde): escala, segura ou pausa pelo CPA." },
    { nome: "Remarketing", funcao: "Fala com quem visitou a página ou o checkout e não comprou. Uns 30% das vendas. Vários anúncios, um por objeção, e o single shot.", quando: "A partir de 17/11; sobe para 30 a 40% da verba de 22 a 25/11.", hoje: hoje >= "2026-11-17" ? "Deve estar ligada." : undefined },
    { nome: "Escassez", funcao: "\"O preço sobe amanhã\". Uns 10% das vendas. Aqui o anúncio tem preço.", quando: "Liga na véspera da virada e desliga 24 h depois.", hoje: vespera ? `Véspera da virada (lote ${prox!.n} em ${ddmm(prox!.ini)}): ligar hoje.` : virou ? "Virou hoje: desligar depois de 24 h." : undefined },
    { nome: "Teste", funcao: "Todo criativo novo entra aqui isolado. O que vence é copiado para a Vendas, e o Teste continua.", quando: "Sempre que houver criativo novo." },
    { nome: "Corredor polonês", funcao: "Visualização de vídeo que esconde cada vídeo de quem já viu metade. Barato; quem atravessa vira público quente.", quando: "Só com 3 vídeos ou mais." },
    { nome: "Ingressos", funcao: "Fala com quem já comprou, para a pessoa aparecer no evento. Quem falta não compra o produto caro.", quando: "Da primeira venda até a noite 1." },
    { nome: "Carrinho", funcao: "Vende o produto caro depois do pitch.", quando: `Liga na noite 2 (${ddmm(noite2)}).`, hoje: hoje === noite2 ? "Hoje: ligar na hora do pitch." : undefined },
    { nome: "Atração e Qualificação", funcao: "Seguidores e conteúdo entre uma turma e outra.", quando: "Depois da Imersão." },
  ];
}

export function OQueFazer({ d }: { d: DadosImersao }) {
  const teto = tetoCpa(d);
  const a = andares(d, teto);
  const v = veredito(d, teto, a);
  const camp = campanhasHoje(d);
  return (
    <>
      <Bloco
        titulo="O que fazer hoje"
        sub="Leia de cima para baixo. Se o 1º andar vai bem, não mexa. Se vai mal, desça até achar a peça quebrada."
      >
        <div className={v.cor === "verde" ? "aviso info" : v.cor === "vermelho" ? "aviso ruim" : "aviso"} role="status" style={{ display: "block" }}>
          <b>{v.titulo}</b>
          {v.passos.length > 0 && <ol style={{ margin: "6px 0 0", paddingLeft: 20 }}>{v.passos.map((p) => <li key={p}>{p}</li>)}</ol>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 14 }}>
          <Andar n={1} titulo="o que paga a conta" linhas={a.a1} />
          <Andar n={2} titulo="o porquê" linhas={a.a2} />
          <Andar n={3} titulo="a peça quebrada" linhas={a.a3} />
        </div>
        <div className="dica" style={{ marginTop: 12 }}>
          <b>Régua do CPA (por anúncio, 2x por dia):</b> até {fR(teto.escala, 0)} escala (mais verba, no máximo +20% por vez) · de {fR(teto.escala, 0)} a {fR(teto.pausa, 0)} segura · acima de {fR(teto.pausa, 0)}, ou {fR(teto.pausa, 0)} gastos sem venda, pausa. O teto sobe a cada lote, porque o ingresso fica mais caro. A decisão de cada anúncio está na aba Criativos.
        </div>
      </Bloco>
      <Bloco titulo="As 8 campanhas" sub="Três vendem (Vendas, Remarketing, Escassez). As outras preparam público ou trabalham depois da venda. Ligar ou desligar é decisão do Red.">
        <div className="tab-wrap">
          <table className="tab">
            <thead><tr><th>Campanha</th><th>Para que serve</th><th>Quando</th><th>Hoje</th></tr></thead>
            <tbody>
              {camp.map((c) => (
                <tr key={c.nome} className={c.hoje ? "atual" : ""}>
                  <td><b>{c.nome}</b></td>
                  <td style={{ whiteSpace: "normal", minWidth: 220 }}>{c.funcao}</td>
                  <td style={{ whiteSpace: "normal", minWidth: 140 }}>{c.quando}</td>
                  <td style={{ whiteSpace: "normal", minWidth: 160 }}>{c.hoje ?? <span className="dim3">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloco>
    </>
  );
}

// Decisão por anúncio: CPA contra o teto e, sem venda, gasto e criativo (hook × CTR).
export function decisaoAnuncio(c: CriativoImersao, teto: Teto, impMin: number): { rot: string; cor: Cor; porque: string } {
  if (c.status !== "ACTIVE") return { rot: "Pausado", cor: "neutro", porque: "" };
  if (c.vendas > 0 && c.cpa !== null) {
    if (c.cpa <= teto.escala) return { rot: "Escalar", cor: "verde", porque: `CPA ${fR(c.cpa, 0)} abaixo de ${fR(teto.escala, 0)}: +20% de verba no conjunto.` };
    if (c.cpa <= teto.pausa) return { rot: "Segurar", cor: "amarelo", porque: `CPA ${fR(c.cpa, 0)} perto do teto: não mexer.` };
    return { rot: "Pausar", cor: "vermelho", porque: `CPA ${fR(c.cpa, 0)} acima de ${fR(teto.pausa, 0)}. Antes de apagar, testar no Remarketing.` };
  }
  if (c.gasto >= teto.pausa) return { rot: "Pausar", cor: "vermelho", porque: `Gastou ${fR(c.gasto, 0)} sem vender. Antes de apagar, testar no Remarketing.` };
  if (c.impressoes < impMin) return { rot: "Esperar", cor: "neutro", porque: `Poucas impressões (${fN(c.impressoes)}); julgar com ${fN(impMin)}.` };
  if (c.hook !== null && c.hook < 12) return { rot: "Trocar abertura", cor: "amarelo", porque: `Hook ${fP(c.hook, 0)}: os 3 primeiros segundos não seguram. Trocar só a abertura.` };
  if (c.hook !== null && c.hook >= 25 && c.ctr !== null && c.ctr < 0.9) return { rot: "Refazer meio", cor: "amarelo", porque: `Hook ${fP(c.hook, 0)} bom, CTR ${fP(c.ctr, 2)} baixo: abre bem e não faz clicar. Mexer no corpo, na chamada e na tela final.` };
  if (c.ctr !== null && c.ctr < 0.7) return { rot: "Fraco", cor: "amarelo", porque: `CTR ${fP(c.ctr, 2)} ruim: candidato a perder verba para os de CTR alto.` };
  return { rot: "Esperar", cor: "neutro", porque: "Ainda sem venda, sem sinal ruim." };
}
