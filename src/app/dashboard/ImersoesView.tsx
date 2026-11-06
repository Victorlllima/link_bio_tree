"use client";

// Aba "Imersões": funil por dia e acumulado, lotes, criativos e comparação evento a evento.
// Os números vêm de /api/dashboard?imersao=<id> e ?eventos=1 (servidor lê Meta e Hotmart; nada secreto aqui).

import { useEffect, useMemo, useState } from "react";
import type { DadosImersao, CriativoImersao, RespComparacaoEventos, EventoSerie } from "./tipos";
import { Kpi, Bloco, Area, fN, fR, fP, fX } from "./ui";

const ddmm = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
const dnRot = (n: number) => (n === 0 ? "D0" : n < 0 ? `D${n}` : `D+${n}`);
type Sub = "funil" | "criativos" | "eventos";

function Cab({ d, ed, setEd, sub, setSub }: { d: DadosImersao; ed: string; setEd: (s: string) => void; sub: Sub; setSub: (s: Sub) => void }) {
  return (
    <div className="cab" style={{ alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
      <div>
        <div className="eyebrow">Imersões<span className="turma-chip">{d.fase.rotulo} · {d.fase.detalhe}</span></div>
        <h1>{d.edicao.nome}</h1>
        <p>Noites {ddmm(d.edicao.noite1)} e {ddmm(d.edicao.noite2)}. Carrinho fecha {ddmm(d.edicao.carrinhoFecha.slice(0, 10))} às 23h59. Vendas vêm da Hotmart (banco); gasto e cliques, da Meta.</p>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <select className="sel" value={ed} onChange={(e) => setEd(e.target.value)} aria-label="Edição da Imersão">
          {d.edicoes.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
        </select>
        <div className="seg">
          {(["funil", "criativos", "eventos"] as const).map((s) => (
            <button key={s} className={sub === s ? "on" : ""} onClick={() => setSub(s)}>{{ funil: "Funil", criativos: "Criativos", eventos: "Evento a evento" }[s]}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const corCpa = (v: number | null, meta: number, corte: number) => (v === null ? "" : v <= meta ? "" : v <= corte ? "c-amarelo" : "c-vermelho");

export default function Imersoes() {
  const [ed, setEd] = useState("");
  const [d, setD] = useState<DadosImersao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sub, setSub] = useState<Sub>("funil");

  useEffect(() => {
    let vivo = true;
    setErro(null);
    fetch(`/api/dashboard?imersao=${encodeURIComponent(ed || "ultima")}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => { if (!vivo) return; if (j.error) setErro(j.error); else { setD(j); if (!ed) setEd(j.edicao.id); } })
      .catch((e) => vivo && setErro(String(e)));
    return () => { vivo = false; };
  }, [ed]);

  if (erro) return <div className="aviso ruim">Não consegui montar as Imersões: {erro}</div>;
  if (!d) return <div className="vazio">Lendo a Meta e a Hotmart da edição.</div>;
  return (
    <>
      <Cab d={d} ed={ed || d.edicao.id} setEd={setEd} sub={sub} setSub={setSub} />
      {!d.fontes.meta.ok && <div className="aviso ruim">Meta: {d.fontes.meta.erro}</div>}
      {!d.fontes.hotmart.ok && <div className="aviso ruim">Hotmart (banco): {d.fontes.hotmart.erro}</div>}
      {sub === "funil" && <Funil d={d} />}
      {sub === "criativos" && <Criativos d={d} />}
      {sub === "eventos" && <Eventos d={d} />}
    </>
  );
}

// ============================================================
function Funil({ d }: { d: DadosImersao }) {
  const t = d.total, m = d.metas;
  const [modo, setModo] = useState<"dia" | "acum">("dia");
  const [met, setMet] = useState<"gasto" | "vendas" | "cpa" | "lpv">("vendas");
  const linhas = useMemo(() => {
    let a = { gasto: 0, impressoes: 0, cliquesLink: 0, lpv: 0, ic: 0, vendas: 0, receita: 0, receitaBumps: 0, bumps: 0 };
    return d.serie.map((s) => {
      a = { gasto: a.gasto + s.gasto, impressoes: a.impressoes + s.impressoes, cliquesLink: a.cliquesLink + s.cliquesLink, lpv: a.lpv + s.lpv, ic: a.ic + s.ic, vendas: a.vendas + s.vendas, receita: a.receita + s.receita, receitaBumps: a.receitaBumps + s.receitaBumps, bumps: a.bumps + s.bumps };
      return { s, v: modo === "dia" ? s : a };
    });
  }, [d.serie, modo]);
  const pontos = linhas.map(({ s, v }) => ({ x: ddmm(s.dia), y: met === "gasto" ? v.gasto : met === "vendas" ? v.vendas : met === "lpv" ? v.lpv : v.vendas ? v.gasto / v.vendas : 0 }));
  const fmt = met === "gasto" || met === "cpa" ? (n: number) => `R$${fN(n)}` : (n: number) => fN(n);
  const semVenda = t.vendas === 0;
  return (
    <>
      <div className="g4">
        <Kpi rotulo="Investido" valor={fR(t.gasto)} sub={`${d.serie.filter((s) => s.gasto > 0).length} dias · meta de verba R$ ${m.verbaDia}/dia`} />
        <Kpi rotulo="Ingressos (Hotmart)" valor={fN(t.vendas)} sub={`${t.vendasAnuncio + t.vendasAnuncioSemCriativo} do anúncio · ${t.vendasOutras} outras origens · pixel ${fN(t.compraPixel)}`} />
        <Kpi rotulo="CPA (gasto ÷ ingressos)" valor={fR(t.cpa)} sub={`meta R$ ${m.cpaMeta} · corte R$ ${m.cpaCorte}`} />
        <Kpi rotulo="ROAS (ingresso + bumps)" valor={fX(t.roas)} sub={`${fR(t.receitaTotal, 0)} brutos · ${fR(t.liquido, 0)} líquidos`} />
      </div>
      <div className="g4" style={{ marginTop: 14 }}>
        <Kpi rotulo="Taxa de bump" valor={fP(t.taxaBump)} sub="pedidos de bump ÷ ingressos" />
        <Kpi rotulo="CTR do link · CPM" valor={`${fP(t.ctr, 2)} · ${fR(t.cpm)}`} sub={`${fN(t.impressoes)} impressões · ${fN(t.cliquesLink)} cliques`} />
        <Kpi rotulo="Visitas da LP · carregamento" valor={`${fN(t.lpv)} · ${fP(t.connect)}`} sub="visitas ÷ cliques no link" />
        <Kpi rotulo="Checkout · conversão da página" valor={`${fN(t.ic)} · ${fP(t.convPagina)}`} sub={`IC ÷ visitas ${fP(t.pagCheckout)} · compra ÷ IC ${fP(t.checkoutCompra)}`} />
      </div>
      {semVenda && <div className="aviso">Ainda não há ingresso aprovado no banco para esta edição. Gasto e funil da Meta já aparecem; vendas, receita, CPA e ROAS entram com a primeira compra aprovada.</div>}
      <Bloco
        titulo="Desempenho por dia"
        sub="Dia a dia ou acumulado desde a abertura das vendas."
        acao={<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div className="seg">{(["dia", "acum"] as const).map((x) => <button key={x} className={modo === x ? "on" : ""} onClick={() => setModo(x)}>{x === "dia" ? "Por dia" : "Acumulado"}</button>)}</div>
          <div className="seg">{(["vendas", "gasto", "cpa", "lpv"] as const).map((x) => <button key={x} className={met === x ? "on" : ""} onClick={() => setMet(x)}>{{ vendas: "Ingressos", gasto: "Investido", cpa: "CPA", lpv: "Visitas" }[x]}</button>)}</div>
        </div>}
      >
        <Area pontos={pontos} fmt={fmt} />
        <div className="tab-wrap" style={{ marginTop: 14 }}>
          <table className="tab">
            <thead><tr><th>Dia</th><th>Lote</th><th className="dir">Investido</th><th className="dir">Impr.</th><th className="dir">Cliques</th><th className="dir">Visitas</th><th className="dir">IC</th><th className="dir">Ingressos</th><th className="dir">Receita</th><th className="dir">Bumps</th><th className="dir">Taxa bump</th><th className="dir">CPA</th><th className="dir">ROAS</th></tr></thead>
            <tbody>
              {[...linhas].reverse().map(({ s, v }) => {
                const cpa = v.vendas ? v.gasto / v.vendas : null;
                return (
                  <tr key={s.dia}>
                    <td><b>{ddmm(s.dia)}</b> <span className="dim3">{dnRot(s.dn)}</span></td>
                    <td>{s.lote ?? "—"}</td>
                    <td className="dir num">{fR(v.gasto, 0)}</td><td className="dir num">{fN(v.impressoes)}</td><td className="dir num">{fN(v.cliquesLink)}</td>
                    <td className="dir num">{fN(v.lpv)}</td><td className="dir num">{fN(v.ic)}</td><td className="dir num"><b>{fN(v.vendas)}</b></td>
                    <td className="dir num">{fR(v.receita + v.receitaBumps, 0)}</td><td className="dir num">{fN(v.bumps)}</td>
                    <td className="dir num">{v.vendas ? fP((v.bumps / v.vendas) * 100, 0) : "—"}</td>
                    <td className={`dir num ${corCpa(cpa, m.cpaMeta, m.cpaCorte)}`}>{fR(cpa, 0)}</td>
                    <td className="dir num">{v.gasto ? fX((v.receita + v.receitaBumps) / v.gasto) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Bloco>
      <Bloco titulo="Por lote" sub="Gasto e vendas do dia caem no lote vigente nele (viradas à 00h de 13/11 e 20/11).">
        <div className="tab-wrap">
          <table className="tab">
            <thead><tr><th>Lote</th><th>Janela</th><th className="dir">Preço</th><th className="dir">Investido</th><th className="dir">Visitas</th><th className="dir">Ingressos</th><th className="dir">Conv. página</th><th className="dir">Receita</th><th className="dir">Taxa bump</th><th className="dir">CPA</th><th className="dir">ROAS</th></tr></thead>
            <tbody>
              {d.lotes.map((l) => (
                <tr key={l.n} className={l.atual ? "atual" : ""}>
                  <td><b>Lote {l.n}</b>{l.atual && <span className="turma-chip">agora</span>}</td>
                  <td>{ddmm(l.ini)} a {l.fim ? ddmm(l.fim) : "evento"}</td>
                  <td className="dir num">{fR(l.preco, 0)}</td><td className="dir num">{fR(l.gasto, 0)}</td><td className="dir num">{fN(l.lpv)}</td>
                  <td className="dir num"><b>{fN(l.vendas)}</b></td><td className="dir num">{fP(l.convPagina, 2)}</td>
                  <td className="dir num">{fR(l.receita + l.receitaBumps, 0)}</td><td className="dir num">{fP(l.taxaBump, 0)}</td>
                  <td className={`dir num ${corCpa(l.cpa, m.cpaMeta, m.cpaCorte)}`}>{fR(l.cpa, 0)}</td><td className="dir num">{fX(l.roas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloco>
      <div className="g-8-4">
        <Bloco titulo="Conjuntos" sub="Quente (engajou no perfil) contra Frio (aberto Brasil).">
          <div className="tab-wrap"><table className="tab">
            <thead><tr><th>Conjunto</th><th className="dir">Investido</th><th className="dir">Visitas</th><th className="dir">IC</th><th className="dir">Ingressos</th><th className="dir">CPA</th></tr></thead>
            <tbody>{d.conjuntos.map((c) => <tr key={c.id}><td><b>{c.nome}</b></td><td className="dir num">{fR(c.gasto, 0)}</td><td className="dir num">{fN(c.lpv)}</td><td className="dir num">{fN(c.ic)}</td><td className="dir num">{fN(c.vendas)}</td><td className={`dir num ${corCpa(c.cpa, m.cpaMeta, m.cpaCorte)}`}>{fR(c.cpa, 0)}</td></tr>)}</tbody>
          </table></div>
          <div className="dica">Ingressos por conjunto só contam as vendas que o sck liga a um anúncio.</div>
        </Bloco>
        <Bloco titulo="Order bumps" sub="Aceite por bump sobre os ingressos.">
          <div className="tab-wrap"><table className="tab">
            <thead><tr><th>Bump</th><th className="dir">Preço</th><th className="dir">Vendas</th><th className="dir">Aceite</th></tr></thead>
            <tbody>{d.bumps.map((b) => <tr key={b.id}><td>{b.nome}</td><td className="dir num">{fR(b.preco, 0)}</td><td className="dir num">{fN(b.vendas)}</td><td className="dir num">{fP(b.take, 0)}</td></tr>)}</tbody>
          </table></div>
        </Bloco>
      </div>
    </>
  );
}

// ============================================================
type Col = { k: string; rot: string; val: (c: CriativoImersao) => number | string | null; fmt: (c: CriativoImersao) => string; cor?: (c: CriativoImersao, d: DadosImersao) => string };
function Criativos({ d }: { d: DadosImersao }) {
  const m = d.metas;
  const [ord, setOrd] = useState<{ k: string; asc: boolean }>({ k: "gasto", asc: false });
  const [so, setSo] = useState<"todos" | "ativos" | "cortar">("todos");
  const cols: Col[] = [
    { k: "nome", rot: "Anúncio", val: (c) => c.nome, fmt: (c) => c.nome },
    { k: "conjunto", rot: "Conjunto", val: (c) => c.conjunto, fmt: (c) => c.conjunto.replace(/\s*\|.*/, "") },
    { k: "status", rot: "Status", val: (c) => c.status, fmt: (c) => (c.status === "ACTIVE" ? "Ativo" : c.status === "PAUSED" ? "Pausado" : c.status) },
    { k: "gasto", rot: "Gasto", val: (c) => c.gasto, fmt: (c) => fR(c.gasto, 0) },
    { k: "impressoes", rot: "Impr.", val: (c) => c.impressoes, fmt: (c) => fN(c.impressoes) },
    { k: "ctr", rot: "CTR link", val: (c) => c.ctr, fmt: (c) => fP(c.ctr, 2), cor: (c) => (c.ctr !== null && c.impressoes >= m.impMinJulgar && c.ctr < m.ctrMinLink ? "c-vermelho" : "") },
    { k: "cpc", rot: "CPC link", val: (c) => c.cpc, fmt: (c) => fR(c.cpc) },
    { k: "custoLpv", rot: "Custo/visita", val: (c) => c.custoLpv, fmt: (c) => fR(c.custoLpv) },
    { k: "ic", rot: "IC", val: (c) => c.ic, fmt: (c) => fN(c.ic) },
    { k: "vendas", rot: "Vendas (sck)", val: (c) => c.vendas, fmt: (c) => fN(c.vendas) },
    { k: "cpa", rot: "CPA", val: (c) => c.cpa, fmt: (c) => fR(c.cpa, 0), cor: (c) => corCpa(c.cpa, m.cpaMeta, m.cpaCorte) },
  ];
  const lista = useMemo(() => {
    const base = d.criativos.filter((c) => (so === "ativos" ? c.status === "ACTIVE" : so === "cortar" ? c.cortar : true));
    const col = cols.find((x) => x.k === ord.k)!;
    return [...base].sort((a, b) => {
      const x = col.val(a), y = col.val(b);
      if (x === null && y === null) return 0;
      if (x === null) return 1; // sem valor vai sempre ao fim
      if (y === null) return -1;
      const r = typeof x === "string" ? x.localeCompare(String(y)) : (x as number) - (y as number);
      return ord.asc ? r : -r;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.criativos, ord, so]);
  const nCortar = d.criativos.filter((c) => c.cortar).length;
  const nAtivos = d.criativos.filter((c) => c.status === "ACTIVE").length;
  const vendasLigadas = d.criativos.reduce((s, c) => s + c.vendas, 0);
  return (
    <>
      <div className="g4">
        <Kpi rotulo="Anúncios ativos" valor={fN(nAtivos)} sub={`${d.criativos.length} com gasto ou ativos`} />
        <Kpi rotulo="Pelo critério de corte" valor={fN(nCortar)} sub="ativos que a ZENITH cortaria" />
        <Kpi rotulo="Vendas ligadas a anúncio" valor={fN(vendasLigadas)} sub={`${d.total.vendasAnuncioSemCriativo} do anúncio sem criativo identificado`} />
        <Kpi rotulo="Custo por visita (campanha)" valor={fR(d.total.lpv ? d.total.gasto / d.total.lpv : null)} sub={`CPC link ${fR(d.total.cliquesLink ? d.total.gasto / d.total.cliquesLink : null)}`} />
      </div>
      <Bloco
        titulo="Criativos"
        sub={`Clique no cabeçalho para ordenar. Corte (régua da ZENITH): anúncio ativo reprovado ou sem entrega; CTR do link abaixo de ${m.ctrMinLink}% com ${fN(m.impMinJulgar)}+ impressões; gasto de R$ ${m.cpaCorte} sem venda; CPA acima de R$ ${m.cpaCorte}.`}
        acao={<div className="seg">{(["todos", "ativos", "cortar"] as const).map((x) => <button key={x} className={so === x ? "on" : ""} onClick={() => setSo(x)}>{{ todos: "Todos", ativos: "Ativos", cortar: `Cortar (${nCortar})` }[x]}</button>)}</div>}
      >
        <div className="tab-wrap">
          <table className="tab">
            <thead><tr>{cols.map((c) => (
              <th key={c.k} className={c.k === "nome" || c.k === "conjunto" || c.k === "status" ? "" : "dir"} style={{ cursor: "pointer" }} onClick={() => setOrd((o) => ({ k: c.k, asc: o.k === c.k ? !o.asc : false }))} aria-sort={ord.k === c.k ? (ord.asc ? "ascending" : "descending") : "none"}>
                {c.rot}{ord.k === c.k ? (ord.asc ? " ▲" : " ▼") : ""}
              </th>))}</tr></thead>
            <tbody>
              {lista.length === 0 && <tr><td colSpan={cols.length} className="vazio">Nenhum anúncio neste filtro.</td></tr>}
              {lista.map((c) => (
                <tr key={c.adId} style={c.cortar ? { background: "rgba(220,70,70,.10)" } : undefined}>
                  {cols.map((col) => (
                    <td key={col.k} className={`${col.k === "nome" || col.k === "conjunto" || col.k === "status" ? "" : "dir num"} ${col.cor ? col.cor(c, d) : ""}`}>
                      {col.fmt(c)}
                      {col.k === "nome" && c.cortar && <div className="c-vermelho" style={{ fontSize: 11 }}>{c.motivos.join("; ")}</div>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dica">CTR abaixo de 2% é alerta, não veredito; só vale julgar com 5 mil impressões. A venda vem do banco da Hotmart, ligada ao anúncio pelo sck/utm. O pixel não serve aqui: ele conta cada bump como compra (pixel total na campanha: {fN(d.total.compraPixel)}).</div>
      </Bloco>
    </>
  );
}

// ============================================================
function acumulado(e: EventoSerie, dn: number) {
  const xs = e.dias.filter((x) => x.dn <= dn);
  const s = (k: "gasto" | "impressoes" | "cliquesLink" | "lpv" | "ic" | "ingressos" | "receita") => xs.reduce((t, x) => t + x[k], 0);
  return { n: xs.length, gasto: s("gasto"), imp: s("impressoes"), cl: s("cliquesLink"), lpv: s("lpv"), ic: s("ic"), ing: s("ingressos"), rec: s("receita") };
}

function Eventos({ d }: { d: DadosImersao }) {
  const [r, setR] = useState<RespComparacaoEventos | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [dn, setDn] = useState<number | null>(null);
  const [met, setMet] = useState<"ing" | "gasto" | "cpa">("ing");
  useEffect(() => {
    fetch(`/api/dashboard?eventos=1&imersao=${encodeURIComponent(d.edicao.id)}`, { cache: "no-store" })
      .then((x) => x.json())
      .then((j) => (j.error ? setErro(j.error) : setR(j)))
      .catch((e) => setErro(String(e)));
  }, [d.edicao.id]);
  if (erro) return <div className="aviso ruim">{erro}</div>;
  if (!r) return <div className="vazio">Montando o histórico de cada evento. Leva alguns segundos.</div>;
  const minDn = Math.min(...r.eventos.flatMap((e) => e.dias.map((x) => x.dn)), -1);
  const hoje = Math.max(minDn, Math.min(0, r.dnHoje ?? 0));
  const corte = dn ?? hoje;
  const linhas = r.eventos.map((e) => ({ e, a: acumulado(e, corte) }));
  const curva = Array.from({ length: Math.min(0, 0) - minDn + 1 }, (_, i) => minDn + i);
  const val = (e: EventoSerie, n: number) => {
    if (e.atual && r && r.dnHoje !== null && n > r.dnHoje) return null; // dia que ainda não aconteceu
    const a = acumulado(e, n);
    if (!a.n) return null;
    return met === "ing" ? a.ing : met === "gasto" ? a.gasto : a.ing ? a.gasto / a.ing : null;
  };
  const ult = (e: EventoSerie) => Math.max(...e.dias.map((x) => x.dn));
  return (
    <>
      <Bloco titulo="Mesmo dia relativo" sub={`Tudo acumulado até ${dnRot(corte)} (dias antes da noite 1 da Imersão ou da Aula 1 da Hermes Week). Escolha o dia.`}
        acao={<div style={{ display: "flex", gap: 8, alignItems: "center" }}><span className="dim3">{dnRot(minDn)}</span><input type="range" min={minDn} max={0} value={corte} onChange={(x) => setDn(Number(x.target.value))} aria-label="Dia relativo ao evento" /><b className="num">{dnRot(corte)}</b>{dn !== null && <button className="filtro" onClick={() => setDn(null)}>hoje ({dnRot(hoje)})</button>}</div>}>
        <div className="tab-wrap">
          <table className="tab">
            <thead><tr><th>Evento</th><th className="dir">Ingressos</th><th className="dir">Investido</th><th className="dir">CPA</th><th className="dir">Receita ingresso</th><th className="dir">ROAS</th><th className="dir">CTR link</th><th className="dir">CPM</th><th className="dir">Carregamento</th><th className="dir">Conv. página</th></tr></thead>
            <tbody>
              {linhas.map(({ e, a }, i) => {
                const prev = i > 0 ? linhas[i - 1].a : null;
                const cpa = a.ing ? a.gasto / a.ing : null;
                const delta = (x: number | null, y: number | null) => (x !== null && y ? ((x - y) / Math.abs(y)) * 100 : null);
                const dl = (x: number | null, y: number | null) => { const v = delta(x, y); return v !== null && Math.abs(v) >= 0.5 ? <div className="dim3" style={{ fontSize: 10.5 }}>{v > 0 ? "+" : "−"}{fN(Math.abs(v), 0)}%</div> : null; };
                const pCpa = prev && prev.ing ? prev.gasto / prev.ing : null;
                return (
                  <tr key={e.id} className={e.atual ? "atual" : ""}>
                    <td><b>{e.nome}</b>{!a.n ? <div className="dim3" style={{ fontSize: 10.5 }}>sem dados neste dia (começa em {dnRot(Math.min(...e.dias.map((x) => x.dn)))})</div> : ult(e) < corte ? <div className="dim3" style={{ fontSize: 10.5 }}>dados até {dnRot(ult(e))}</div> : null}</td>
                    <td className="dir num">{a.n ? fN(a.ing) : "—"}{a.n ? dl(a.ing, prev?.ing ?? null) : null}</td>
                    <td className="dir num">{a.n ? fR(a.gasto, 0) : "—"}{a.n ? dl(a.gasto, prev?.gasto ?? null) : null}</td>
                    <td className="dir num">{a.n ? fR(cpa, 0) : "—"}{a.n ? dl(cpa, pCpa) : null}</td>
                    <td className="dir num">{a.n ? fR(a.rec, 0) : "—"}</td>
                    <td className="dir num">{a.gasto ? fX(a.rec / a.gasto) : "—"}</td>
                    <td className="dir num">{a.imp ? fP((100 * a.cl) / a.imp, 2) : "—"}</td>
                    <td className="dir num">{a.imp ? fR((a.gasto / a.imp) * 1000) : "—"}</td>
                    <td className="dir num">{a.cl ? fP((100 * a.lpv) / a.cl) : "—"}</td>
                    <td className="dir num">{a.lpv ? fP((100 * a.ing) / a.lpv, 2) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="dica">A Hermes Week não tem bumps nesta receita: o ROAS aqui é só do ingresso, nos dois lados, para comparar igual. A Hermes Week tem captação de cerca de 8 dias; a Imersão, de cerca de 3 semanas.</div>
      </Bloco>
      <Bloco titulo="Curva dia a dia" sub="Acumulado em cada D-n, um evento por coluna."
        acao={<div className="seg">{(["ing", "gasto", "cpa"] as const).map((x) => <button key={x} className={met === x ? "on" : ""} onClick={() => setMet(x)}>{{ ing: "Ingressos", gasto: "Investido", cpa: "CPA" }[x]}</button>)}</div>}>
        <div className="tab-wrap">
          <table className="tab">
            <thead><tr><th>Dia</th>{r.eventos.map((e) => <th key={e.id} className="dir">{e.nome.replace("Hermes Week · ", "HW ")}</th>)}</tr></thead>
            <tbody>
              {curva.map((n) => (
                <tr key={n} className={n === hoje ? "atual" : ""}>
                  <td><b>{dnRot(n)}</b></td>
                  {r.eventos.map((e) => { const v = val(e, n); return <td key={e.id} className="dir num">{v === null ? "—" : met === "ing" ? fN(v) : fR(v, 0)}</td>; })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloco>
    </>
  );
}
