"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Megaphone, Image as ImageIcon, ShoppingCart, Users, PlayCircle, GraduationCap, Wallet,
  GitCompare, PencilLine, Ruler, RefreshCw, Eye, EyeOff, Menu, CalendarDays, Target, MousePointerClick,
  Ticket, TrendingUp, Activity, Clock, FileText, Flame, CircleDollarSign, Percent, Gauge,
} from "lucide-react";
import "./painel.css";
import type { Dados, Resumo } from "./tipos";
import { REGUAS, REGRAS_OURO, avaliar } from "./metas";
import { Kpi, LinhaRegua, Bloco, Alerta, Funil, Area, Barras, Calor, Ponto, ReguaDica, fN, fR, fP, fX, metaTexto } from "./ui";

type Aba = "geral" | "trafego" | "criativos" | "vendas" | "grupo" | "aulas" | "formacao" | "financeiro" | "comparativo" | "lancar" | "reguas";

const NAV: { grupo: number; id: Aba; rot: string; ico: typeof LayoutDashboard }[] = [
  { grupo: 0, id: "geral", rot: "Visão geral", ico: LayoutDashboard },
  { grupo: 1, id: "trafego", rot: "Tráfego e página", ico: Megaphone },
  { grupo: 1, id: "criativos", rot: "Criativos", ico: ImageIcon },
  { grupo: 1, id: "vendas", rot: "Ingressos e bumps", ico: ShoppingCart },
  { grupo: 2, id: "grupo", rot: "Grupo e fichas", ico: Users },
  { grupo: 2, id: "aulas", rot: "Aulas", ico: PlayCircle },
  { grupo: 2, id: "formacao", rot: "Domingo e carrinho", ico: GraduationCap },
  { grupo: 3, id: "financeiro", rot: "Financeiro", ico: Wallet },
  { grupo: 3, id: "comparativo", rot: "Semana a semana", ico: GitCompare },
  { grupo: 4, id: "lancar", rot: "Lançar números", ico: PencilLine },
  { grupo: 4, id: "reguas", rot: "Réguas do método", ico: Ruler },
];

const dm = (iso: string) => {
  const d = new Date(new Date(iso).getTime() - 3 * 3600e3);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};
const dmh = (iso: string) => {
  const d = new Date(new Date(iso).getTime() - 3 * 3600e3);
  return `${dm(iso)} ${String(d.getUTCHours()).padStart(2, "0")}h${String(d.getUTCMinutes()).padStart(2, "0")}`;
};
const DOW = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function saudacao() {
  const h = new Date(Date.now() - 3 * 3600e3).getUTCHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function falta(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "agora";
  const h = Math.floor(ms / 3600e3);
  if (h >= 48) return `em ${Math.floor(h / 24)} dias`;
  if (h >= 1) return `em ${h}h${String(Math.floor((ms % 3600e3) / 60e3)).padStart(2, "0")}`;
  return `em ${Math.floor(ms / 60e3)} min`;
}

export default function Painel() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);
  const [ciclo, setCiclo] = useState<string>("");
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [aba, setAba] = useState<Aba>("geral");
  const [privado, setPrivado] = useState(false);
  const [menu, setMenu] = useState(false);

  const carregar = useCallback(async (c?: string) => {
    setCarregando(true);
    setErro(null);
    try {
      const r = await fetch(`/api/dashboard${c ? `?ciclo=${c}` : ""}`, { cache: "no-store" });
      if (r.status === 401) {
        setAuth(false);
        return;
      }
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setDados(j);
      setCiclo(j.ciclo.d0);
      setAuth(true);
    } catch (e) {
      setErro(String((e as Error).message || e));
      setAuth((a) => (a === null ? true : a));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    try {
      const a = localStorage.getItem("hwd_aba") as Aba | null;
      if (a && NAV.some((n) => n.id === a)) setAba(a);
    } catch {}
    carregar();
  }, [carregar]);

  // atualiza sozinho a cada 2 min (30s no carrinho), pausa com a aba escondida
  useEffect(() => {
    if (!dados) return;
    const ms = dados.ciclo.fase.id === "carrinho" ? 30e3 : 120e3;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") carregar(ciclo);
    }, ms);
    const vis = () => document.visibilityState === "visible" && Date.now() - new Date(dados.geradoEm).getTime() > ms && carregar(ciclo);
    document.addEventListener("visibilitychange", vis);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [dados, ciclo, carregar]);

  function irPara(a: Aba) {
    setAba(a);
    setMenu(false);
    try {
      localStorage.setItem("hwd_aba", a);
    } catch {}
    window.scrollTo({ top: 0 });
  }

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha(false);
    const r = await fetch("/api/lpsg/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: senha }) });
    if (r.ok) carregar();
    else setErroSenha(true);
  }

  if (auth === false) {
    return (
      <div className="hwd-login">
        <form onSubmit={entrar}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🌀</div>
          <h1>Painel da Hermes Week</h1>
          <p>Todas as réguas do Tabari, ciclo a ciclo.</p>
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} autoFocus />
          {erroSenha && <div className="erro">Senha errada.</div>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  const alertasRuins = dados?.leitura.filter((l) => l.nivel === "ruim").length || 0;

  return (
    <div className={`hwd ${privado ? "privado" : ""}`}>
      <aside className={`lado ${menu ? "aberto" : ""}`}>
        <div className="marca">
          <div className="marca-ico">🌀</div>
          <div>
            <b>Hermes Week</b>
            <small>Painel do lançamento</small>
          </div>
        </div>
        {[0, 1, 2, 3, 4].map((g) => (
          <div className="nav-grupo" key={g}>
            {NAV.filter((n) => n.grupo === g).map((n) => (
              <button key={n.id} className={`nav-item ${aba === n.id ? "ativo" : ""}`} onClick={() => irPara(n.id)}>
                <n.ico size={17} />
                {n.rot}
                {n.id === "geral" && alertasRuins > 0 && <span className="badge">{alertasRuins}</span>}
              </button>
            ))}
          </div>
        ))}
        {dados && (
          <div className="lado-rodape">
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Fontes</div>
            <div className="linha-fonte"><Ponto cor={dados.fontes.meta.ok ? "verde" : "vermelho"} /> Meta Ads</div>
            <div className="linha-fonte"><Ponto cor={dados.fontes.hotmart.ok ? "verde" : "vermelho"} /> Hotmart</div>
            <div className="linha-fonte"><Ponto cor={dados.fontes.evolution.ok ? (dados.grupo.fonte ? "verde" : "neutro") : "amarelo"} /> WhatsApp do grupo</div>
            <div className="linha-fonte"><Ponto cor={Object.keys(dados.manual).length ? "verde" : "neutro"} /> {Object.keys(dados.manual).length} números lançados</div>
          </div>
        )}
      </aside>

      <div className="principal">
        <header className="topo">
          <button className="icone-btn menu-btn" onClick={() => setMenu(!menu)} aria-label="Menu">
            <Menu size={18} />
          </button>
          <div className="seletor">
            <CalendarDays size={16} className="t-gray" />
            <select value={ciclo} onChange={(e) => { setCiclo(e.target.value); carregar(e.target.value); }}>
              {(dados?.ciclos || []).map((c) => (
                <option key={c.d0} value={c.d0}>{c.nome}</option>
              ))}
            </select>
          </div>
          {dados && <div className="pilula-fase"><Activity size={15} />{dados.ciclo.fase.rotulo}</div>}
          {dados?.ciclo.proximo && (
            <div className="proximo">
              Próximo: <b>{dados.ciclo.proximo.rotulo}</b> {falta(dados.ciclo.proximo.quando)}
            </div>
          )}
          <div className="esp" />
          {dados && (
            <div className="selo-atual">
              <Ponto cor={erro ? "amarelo" : "verde"} />
              <span>{carregando ? "atualizando…" : `atualizado ${dmh(dados.geradoEm).split(" ")[1]}`}</span>
            </div>
          )}
          <button className="icone-btn" onClick={() => carregar(ciclo)} aria-label="Atualizar" disabled={carregando}>
            <RefreshCw size={17} className={carregando ? "girando" : ""} />
          </button>
          <button className="icone-btn" onClick={() => setPrivado(!privado)} aria-label="Modo privado">
            {privado ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </header>

        <main className="conteudo">
          {erro && (
            <div className="aviso bg-verm">Não consegui montar o painel: {erro}</div>
          )}
          {!dados ? (
            <div className="vazio">Carregando os números do ciclo…</div>
          ) : (
            <>
              {aba === "geral" && <Geral d={dados} ir={irPara} />}
              {aba === "trafego" && <Trafego d={dados} />}
              {aba === "criativos" && <Criativos d={dados} />}
              {aba === "vendas" && <Vendas d={dados} />}
              {aba === "grupo" && <Grupo d={dados} />}
              {aba === "aulas" && <Aulas d={dados} ir={irPara} />}
              {aba === "formacao" && <Formacao d={dados} ir={irPara} />}
              {aba === "financeiro" && <Financeiro d={dados} />}
              {aba === "comparativo" && <Comparativo atual={dados.ciclo.d0} />}
              {aba === "lancar" && <Lancar d={dados} salvo={() => carregar(ciclo)} />}
              {aba === "reguas" && <Reguas />}
            </>
          )}
        </main>
      </div>
      <style>{`.girando{animation:hwgira 1s linear infinite}@keyframes hwgira{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Cab({ rot, titulo, sub, citacao }: { rot: string; titulo: string; sub: string; citacao?: string }) {
  return (
    <div className="cab">
      <div>
        <div className="rot">{rot}</div>
        <h1>{titulo}</h1>
        <p>{sub}</p>
      </div>
      {citacao && <div className="citacao">“{citacao}”<br /><span style={{ fontStyle: "normal", fontSize: 12 }}>— Leo Tabari</span></div>}
    </div>
  );
}

const janela = (d: Dados) => `Captação de ${dm(d.ciclo.captIni)} a ${dm(d.ciclo.captFim)} · Aula 1 em ${dm(d.ciclo.captFim)} · carrinho ${dm(d.ciclo.carrinhoAbre)}`;

// ============================================================
// VISÃO GERAL
// ============================================================
function Geral({ d, ir }: { d: Dados; ir: (a: Aba) => void }) {
  const v = d.vendas;
  const t = d.trafego;
  const serieIng = t.serie.map((s) => s.ingressos);
  const serieGasto = t.serie.map((s) => s.gasto);
  const notaCor = d.saude.total >= 80 ? "verde" : d.saude.total >= 60 ? "amarelo" : "vermelho";
  return (
    <>
      <Cab rot={`${d.ciclo.nome} · ${d.ciclo.fase.detalhe}`} titulo={`${saudacao()}, Red`} sub={janela(d)} citacao="Quem tá bom fica, quem tá ruim sai." />

      <div className="grade-kpi">
        <Kpi icone={<Ticket size={18} />} rotulo="Ingressos vendidos" valor={`${fN(v.ingressos)} / ${fN(v.meta)}`} regua="ingressos" valorNum={v.ingressos} spark={serieIng} sub={`${fN(t.vendasPagas)} pelo anúncio · ${fN(v.origem.bio)} pela bio`} />
        <Kpi icone={<CircleDollarSign size={18} />} tom="azul" rotulo="Faturamento do front" valor={fR(v.receitaFront)} sub={`${fR(v.liquidoFront)} líquido · ticket médio ${fR(v.ticketMedio)}`} />
        <Kpi icone={<Megaphone size={18} />} tom="roxo" rotulo="Investido em tráfego" valor={fR(t.gasto)} spark={serieGasto} sub={`${fR(t.verbaDia)}/dia em ${t.dias} dias`} />
        <Kpi icone={<TrendingUp size={18} />} tom="ambar" rotulo="ROAS do anúncio" valor={fX(v.roasPago)} regua="roas_captacao" valorNum={v.roasPago} sub={`com a bio ${fX(v.roas)} · líquido ${fX(v.roasLiquido)}`} />
        <Kpi icone={<Target size={18} />} tom="verm" rotulo="Custo por ingresso" valor={fR(v.cpa)} regua="cpa_ingresso" valorNum={v.cpa} sub={`só anúncio: ${fR(t.cpaPago)}`} />
        <Kpi icone={<Gauge size={18} />} tom={notaCor === "verde" ? "menta" : notaCor === "amarelo" ? "ambar" : "verm"} rotulo="Saúde do lançamento" valor={`${d.saude.total}/100`} sub={d.saude.areas.map((a) => `${a.area} ${a.nota}`).join(" · ")} />
      </div>

      <div className="duas">
        <div>
          <Bloco titulo="O funil inteiro" sub="Do anúncio à Formação. Cada passagem com a régua do Tabari." className="" acao={<button className="btn-sec" onClick={() => ir("trafego")}>Detalhar</button>}>
            <Funil
              etapas={[
                { nome: "Impressões", valor: t.impressoes, sub: `CPM ${fR(t.cpm)} · frequência ${fN(t.frequencia, 1)}` },
                { nome: "Cliques no link", valor: t.cliquesLink, taxa: t.impressoes ? (t.cliquesLink / t.impressoes) * 100 : null, sub: `CTR ${fP(t.ctr, 2)} · CPC ${fR(t.cpcLink)}` },
                { nome: "Viram a página", valor: t.lpv, taxa: t.connect, regua: "connect_rate", sub: "connect rate" },
                { nome: "Foram ao checkout", valor: t.ic, taxa: t.pagCheckout, regua: "pagina_checkout", sub: `custo por finalização ${fR(t.custoIc)}` },
                { nome: "Compraram pelo anúncio", valor: t.vendasPagas, taxa: t.checkoutCompra, regua: "checkout_compra", sub: `conversão da página ${fP(t.convPagina)}` },
                { nome: "Ingressos no total", valor: v.ingressos, sub: `+${v.origem.bio} pela bio · +${v.origem.outro} outros` },
                { nome: "Fizeram a matrícula", valor: d.fichas.matriculas, taxa: d.fichas.matriculaPct, sub: "passo 1 do onboarding" },
                { nome: "Ao vivo na Aula 1", valor: d.aulas[0].presenca, taxa: d.aulas[0].presencaPct, regua: "presenca_a1", sub: d.aulas[0].presenca === null ? "lance em Lançar números" : "pico ao vivo" },
                { nome: "Ficha de interesse", valor: d.fichas.interesse.total, taxa: d.fichas.interessePct, regua: "ficha_interesse", sub: `HOT ${d.fichas.interesse.hot} · WARM ${d.fichas.interesse.warm} · COLD ${d.fichas.interesse.cold}` },
                { nome: "Compraram a Formação", valor: d.backend.vendas, taxa: d.backend.conv, regua: "conv_backend", sub: "sobre o total de ingressos" },
              ]}
            />
          </Bloco>
          <div style={{ height: 14 }} />
          <Bloco titulo="Vendas e verba, dia a dia" sub="Linha: gasto em tráfego. Barras: ingressos vendidos.">
            <Area pontos={t.serie.map((s) => ({ x: dm(`${s.dia}T15:00:00Z`), y: s.gasto }))} barras={t.serie.map((s) => ({ x: s.dia, y: s.ingressos }))} fmt={(n) => `R$${fN(n)}`} />
          </Bloco>
        </div>
        <Bloco titulo="Leitura do ORION" sub="O que está pegando e o que fazer agora.">
          {d.leitura.length === 0 ? <div className="vazio">Nada fora da régua.</div> : d.leitura.map((a, i) => <Alerta key={i} a={a} />)}
          <div className="dica" style={{ marginTop: 6 }}>
            <b>Regras que impedem besteira</b>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              {REGRAS_OURO.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        </Bloco>
      </div>
    </>
  );
}

// ============================================================
// TRÁFEGO E PÁGINA
// ============================================================
function Trafego({ d }: { d: Dados }) {
  const t = d.trafego;
  const v = d.vendas;
  const [met, setMet] = useState<"gasto" | "ingressos" | "cpa" | "lpv">("gasto");
  const pontos = t.serie.map((s) => ({
    x: dm(`${s.dia}T15:00:00Z`),
    y: met === "gasto" ? s.gasto : met === "ingressos" ? s.ingressos : met === "lpv" ? s.lpv : s.ingressos ? s.gasto / s.ingressos : 0,
  }));
  const fmt = met === "ingressos" || met === "lpv" ? (n: number) => fN(n) : (n: number) => `R$${fN(n)}`;
  const cacMax = d.financeiro.cacMax;
  return (
    <>
      <Cab rot="Tráfego" titulo="Captação na Meta" sub={`Campanhas HWK · ${janela(d)}`} citacao="O que você vai otimizar primeiro se está ruim: sempre criativo, sempre." />
      {!d.fontes.meta.ok && <div className="aviso bg-verm">Meta: {d.fontes.meta.erro}</div>}
      <div className="grade-kpi">
        <Kpi icone={<Megaphone size={18} />} tom="roxo" rotulo="Investido" valor={fR(t.gasto)} sub={`${t.dias} dias com gasto`} />
        <Kpi icone={<CircleDollarSign size={18} />} rotulo="Verba média por dia" valor={fR(t.verbaDia)} regua="verba_dia" valorNum={t.verbaDia} />
        <Kpi icone={<TrendingUp size={18} />} tom="ambar" rotulo="ROAS do anúncio" valor={fX(v.roasPago)} regua="roas_captacao" valorNum={v.roasPago} sub={`${fR(v.receitaPaga, 0)} vindos do anúncio · com a bio ${fX(v.roas)}`} />
        <Kpi icone={<Target size={18} />} tom="verm" rotulo="CPA do ingresso" valor={fR(v.cpa)} regua="cpa_ingresso" valorNum={v.cpa} sub={cacMax !== null ? `CAC máximo pela fórmula: ${fR(cacMax)}` : undefined} />
      </div>
      <div className="duas">
        <Bloco titulo="Desempenho no período" sub="A métrica que importa, dia a dia." acao={
          <div className="seg">
            {(["gasto", "ingressos", "cpa", "lpv"] as const).map((m) => (
              <button key={m} className={met === m ? "on" : ""} onClick={() => setMet(m)}>{{ gasto: "Investido", ingressos: "Ingressos", cpa: "CPA", lpv: "Visitas" }[m]}</button>
            ))}
          </div>
        }>
          <Area pontos={pontos} fmt={fmt} tom={met === "cpa" ? "verm" : met === "ingressos" ? "azul" : "menta"} />
        </Bloco>
        <Bloco titulo="Anúncio → página → checkout" sub="Se isto está ruim, o problema NÃO é o criativo.">
          <LinhaRegua chave="ctr" valor={t.ctr} sub={`${fN(t.impressoes)} impressões`} />
          <LinhaRegua chave="cpm" valor={t.cpm} sub={`alcance ${fN(t.alcance)}`} />
          <LinhaRegua chave="frequencia" valor={t.frequencia} sub="~11 contatos antes da compra" />
          <LinhaRegua chave="connect_rate" valor={t.connect} sub={`${fN(t.lpv)} de ${fN(t.cliquesLink)} cliques`} />
          <LinhaRegua chave="pagina_checkout" valor={t.pagCheckout} sub={`${fN(t.ic)} finalizações`} />
          <LinhaRegua chave="custo_ic" valor={t.custoIc} />
          <LinhaRegua chave="checkout_compra" valor={t.checkoutCompra} sub={`${fN(t.vendasPagas)} compras pelo anúncio`} />
          <LinhaRegua chave="conv_pagina" valor={t.convPagina} sub={t.lpv < 5000 ? `${fN(t.lpv)} de 5.000 views pra julgar` : "amostra suficiente"} />
        </Bloco>
      </div>
      <div className="metade">
        <Bloco titulo="Distribuição de conteúdo" sub="Verba fora da captação, pra aquecer o público (C1/C2/C3).">
          <LinhaRegua chave="distribuicao" valor={t.distribuicaoPct} sub={t.distribuicaoPct === null ? "lance o gasto do impulsionamento em Lançar números" : `${fR(d.financeiro.distribuicao)} na distribuição`} />
          {t.outrasCampanhas.length > 0 && (
            <div className="dica">
              <b>Outras campanhas na conta no mesmo período</b> (não entram no ROAS da captação):
              {t.outrasCampanhas.map((c) => <div key={c.nome} className="num">{c.nome}: {fR(c.gasto)}</div>)}
            </div>
          )}
        </Bloco>
        <Bloco titulo="Vendas por variação de página" sub="Pela letra do sck da Hotmart (A, B, C… = /hermes-week/a, /b…).">
          <Barras itens={v.porPagina.map((p) => ({ x: p.variante === "?" ? "sem sck" : `/${p.variante.toLowerCase()}`, y: p.vendas }))} tom="azul" />
          <div className="dica">Para julgar uma página o Tabari espera <b>5.000 views</b> nela. Testar 2 páginas novas por semana já é nível bom.</div>
        </Bloco>
      </div>
    </>
  );
}

// ============================================================
// CRIATIVOS
// ============================================================
function Criativos({ d }: { d: Dados }) {
  const [filtro, setFiltro] = useState<"todos" | "video" | "estatico" | "carrossel" | "vendendo" | "parados">("todos");
  const lista = d.criativos.filter((c) =>
    filtro === "todos" ? true : filtro === "vendendo" ? c.vendas > 0 : filtro === "parados" ? c.vendas === 0 && c.impressoes >= 5000 : c.formato === filtro,
  );
  const cont = (f: typeof filtro) => d.criativos.filter((c) => (f === "vendendo" ? c.vendas > 0 : f === "parados" ? c.vendas === 0 && c.impressoes >= 5000 : f === "todos" ? true : c.formato === f)).length;
  const videos = d.criativos.filter((c) => c.formato === "video" && c.impressoes > 0);
  const media = (k: "hook" | "hold" | "body") => {
    const xs = videos.map((c) => c[k]).filter((x): x is number => x !== null);
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
  };
  const ranking = [...d.criativos].filter((c) => c.vendas > 0).sort((a, b) => (a.cpa || 1e9) - (b.cpa || 1e9)).slice(0, 5);
  const corVer = (c: string) => (c === "verde" ? "bg-menta" : c === "amarelo" ? "bg-ambar" : c === "vermelho" ? "bg-verm" : "bg-azul");
  return (
    <>
      <Cab rot="Criativos" titulo="O que repetir e o que trocar" sub="Vendas reais da Hotmart atribuídas pelo ID do anúncio no sck, não pelo pixel (o pixel conta cada bump como uma compra)." citacao="Para eu ter cinco criativos muito escalados, tive que testar quase 300." />
      <div className="grade-kpi">
        <Kpi icone={<ImageIcon size={18} />} rotulo="Criativos ativos" valor={fN(d.batelada.ativos)} regua="batelada" valorNum={d.batelada.ativos} sub={`${d.batelada.estatico} estáticos · ${d.batelada.video} vídeos · ${d.batelada.carrossel} carrosséis`} />
        <Kpi icone={<Flame size={18} />} tom="ambar" rotulo="Novos em 7 dias" valor={fN(d.batelada.novos7d)} regua="hooks_novos" valorNum={d.batelada.novos7d} />
        <Kpi icone={<Eye size={18} />} tom="azul" rotulo="Hook rate médio (vídeos)" valor={fP(media("hook"))} regua="hook_rate" valorNum={media("hook")} />
        <Kpi icone={<Clock size={18} />} tom="roxo" rotulo="Hold rate médio (vídeos)" valor={fP(media("hold"))} regua="hold_rate" valorNum={media("hold")} />
      </div>
      <div className="duas">
        <div>
          <div className="pilulas">
            {(["todos", "video", "estatico", "carrossel", "vendendo", "parados"] as const).map((f) => (
              <button key={f} className={`pil ${filtro === f ? "on" : ""}`} onClick={() => setFiltro(f)}>
                {{ todos: "Todos", video: "Vídeos", estatico: "Estáticos", carrossel: "Carrosséis", vendendo: "Vendendo", parados: "Sem venda c/ volume" }[f]} <b>{cont(f)}</b>
              </button>
            ))}
          </div>
          {lista.length === 0 ? <div className="card vazio">Nenhum criativo neste filtro.</div> : (
            <div className="grade-crt">
              {lista.map((c) => (
                <div className="card crt" key={c.adId}>
                  <div className="crt-capa">
                    {c.thumb && <img src={c.thumb} alt="" referrerPolicy="no-referrer" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
                    <span className={`selo ${corVer(c.veredito.cor)}`}>{c.veredito.rotulo}</span>
                    <span className="fmt">{{ video: "▶ vídeo", estatico: "estático", carrossel: "carrossel", outro: "outro" }[c.formato]}{c.status !== "ACTIVE" ? " · pausado" : ""}</span>
                  </div>
                  <div className="crt-corpo">
                    <div className="crt-nome" title={c.nome}>{c.nome}</div>
                    <div className="crt-meta">
                      <div><small>Gasto</small><b className="num">{fR(c.gasto, 0)}</b></div>
                      <div><small>Vendas</small><b className="num t-menta">{c.vendas}</b></div>
                      <div><small>CPA</small><b className="num">{fR(c.cpa, 0)}</b></div>
                      <div><small>CTR</small><b className={`num cor-${avaliar(REGUAS[c.formato === "video" ? "ctr" : "ctr_estatico"], c.ctr)}`}>{fP(c.ctr, 2)}</b></div>
                      {c.formato === "video" ? (
                        <>
                          <div><small>Hook</small><b className={`num cor-${avaliar(REGUAS.hook_rate, c.hook)}`}>{fP(c.hook)}</b></div>
                          <div><small>Hold</small><b className={`num cor-${avaliar(REGUAS.hold_rate, c.hold)}`}>{fP(c.hold)}</b></div>
                        </>
                      ) : (
                        <>
                          <div><small>Impr.</small><b className="num">{fN(c.impressoes)}</b></div>
                          <div><small>Cliques</small><b className="num">{fN(c.cliquesLink)}</b></div>
                        </>
                      )}
                    </div>
                    <div className="crt-acao">{c.veredito.acao}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Bloco titulo="Leitura dos criativos" sub="Os que entregam ingresso mais barato.">
            {ranking.length === 0 ? <div className="vazio">Nenhum criativo com venda atribuída ainda.</div> : ranking.map((c, i) => (
              <div key={c.adId} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderTop: i ? "1px solid var(--linha)" : 0 }}>
                <b style={{ width: 18 }} className="t-menta">{i + 1}</b>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--elevado)", overflow: "hidden", flex: "none" }}>
                  {c.thumb && <img src={c.thumb} alt="" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="crt-nome">{c.nome}</div>
                  <div className="t-gray num" style={{ fontSize: 12 }}>{c.vendas} ingressos · {fR(c.cpa)} cada</div>
                </div>
              </div>
            ))}
          </Bloco>
          <div style={{ height: 14 }} />
          <Bloco titulo="As 3 taxas do vídeo" sub="Fórmulas da aula 4.">
            <LinhaRegua chave="hook_rate" valor={media("hook")} sub="views de 3s ÷ impressões" />
            <LinhaRegua chave="hold_rate" valor={media("hold")} sub="views de 75% ÷ views de 3s" />
            <LinhaRegua chave="body_rate" valor={media("body")} sub="vendas ÷ views de 75%" />
            <div className="dica">Hook baixo: troca o gancho e mantém o corpo. Hold baixo: mexe no meio. Body baixo: mexe no CTA e no final. Vídeo de <b>1 a 3 minutos</b>.</div>
          </Bloco>
        </div>
      </div>
    </>
  );
}

// ============================================================
// INGRESSOS E BUMPS
// ============================================================
function Vendas({ d }: { d: Dados }) {
  const v = d.vendas;
  const pior = Math.min(...v.porDia.filter((x) => x.ingressos > 0).map((x) => x.ingressos), Infinity);
  const domingos = v.porDia.filter((x) => x.dow === 0 && x.ingressos > 0);
  const pagamentos = Object.entries(v.pagamento).sort((a, b) => b[1] - a[1]);
  return (
    <>
      <Cab rot="Vendas" titulo="Ingressos e order bumps" sub={`Hotmart · ${janela(d)}`} citacao="Eu não gosto de 47, eu gosto de 62." />
      <div className="grade-kpi">
        <Kpi icone={<Ticket size={18} />} rotulo="Ingressos" valor={`${fN(v.ingressos)} / ${fN(v.meta)}`} regua="ingressos" valorNum={v.ingressos} sub={`${fP(v.meta ? (v.ingressos / v.meta) * 100 : null, 0)} da meta`} />
        <Kpi icone={<CircleDollarSign size={18} />} tom="azul" rotulo="Ticket médio" valor={fR(v.ticketMedio)} sub={`líquido ${fR(v.ticketMedioLiquido)} · taxa Hotmart ${fP(v.taxaPlataforma !== null ? v.taxaPlataforma * 100 : null)}`} />
        <Kpi icone={<Clock size={18} />} tom="ambar" rotulo="Pix/boleto em aberto" valor={fN(v.pendentes)} sub={`${v.expirados} expiraram · Pix não dispara bump`} />
        <Kpi icone={<RefreshCw size={18} />} tom="roxo" rotulo="Abandonos recuperados" valor={`${v.recuperados} / ${v.abandonos}`} regua="recuperacao" valorNum={v.abandonos ? (v.recuperados / v.abandonos) * 100 : null} />
      </div>
      <div className="metade">
        <Bloco titulo="Order bumps" sub="Take rate = quantos compradores do ingresso levaram o bump.">
          {v.bumps.map((b) => (
            <LinhaRegua key={b.id} chave="take_bump" nome={`${b.nome} (R$${b.preco})`} valor={b.take} sub={`${b.vendas} vendas · ${fR(b.receita)}`} />
          ))}
          <div className="dica">O Tabari não dá meta de take rate. A régua de 30% é do squad e só vale depois de 20 vendas.</div>
        </Bloco>
        <Bloco titulo="Saúde da venda" sub="O que voltou depois de vendido.">
          <LinhaRegua chave="reembolso" valor={v.ingressos ? (v.reembolsos / v.ingressos) * 100 : null} sub={`${v.reembolsos} reembolsos · ${v.pedidosReembolso} pedidos em aberto · ${v.chargebacks} chargebacks · ${v.cancelados} cancelados`} />
          <div className="regua-linha">
            <div className="regua-top"><div className="regua-nome">Origem do comprador</div></div>
            <div className="num">Anúncio <b>{v.origem.anuncio}</b> · Link da bio <b>{v.origem.bio}</b> · Outro <b>{v.origem.outro}</b></div>
          </div>
          <div className="regua-linha">
            <div className="regua-top"><div className="regua-nome">Forma de pagamento</div></div>
            <div className="num">{pagamentos.map(([k, n]) => `${k.replace("_", " ").toLowerCase()} ${n}`).join(" · ") || "—"}</div>
          </div>
          <div className="regua-linha">
            <div className="regua-top"><div className="regua-nome">Entraram na área de membros</div><div className="regua-val num">{v.primeiroAcesso}</div></div>
          </div>
        </Bloco>
      </div>
      <div className="metade">
        <Bloco titulo="Ingressos por dia" sub="Com evento na segunda, o domingo vende quase o dobro do pior dia.">
          <Barras itens={v.porDia.map((x) => ({ x: `${DOW[x.dow]} ${x.dia.slice(8)}`, y: x.ingressos }))} destaque={(i) => v.porDia[i].dow === 0} tom="menta" />
          {domingos.length > 0 && pior < Infinity && (
            <div className="dica">Domingo: <b>{domingos.map((x) => x.ingressos).join(", ")}</b> · pior dia com venda: <b>{pior}</b>. Régua do Tabari: domingo ≈ 2x o pior dia.</div>
          )}
        </Bloco>
        <Bloco titulo="Quando as pessoas compram" sub="Dia da semana × hora (Brasília).">
          <Calor matriz={v.porHora} />
        </Bloco>
      </div>
    </>
  );
}

// ============================================================
// GRUPO E FICHAS
// ============================================================
function Grupo({ d }: { d: Dados }) {
  const g = d.grupo;
  const f = d.fichas;
  const entregues = g.disparos.total ? (g.disparos.enviados / Math.max(1, g.disparos.enviados + g.disparos.atrasados + g.disparos.expirados)) * 100 : null;
  return (
    <>
      <Cab rot="Onboarding" titulo="Grupo, mensageria e fichas" sub="Passos do Tabari depois da compra: 1) ficha, 2) grupo, 3) responder OK." citacao="Se você manda isso antes, ela já não lê mais nada." />
      {!d.fontes.evolution.ok && <div className="aviso bg-ambar">WhatsApp: {d.fontes.evolution.erro}. Lance o número de membros em Lançar números.</div>}
      <div className="grade-kpi">
        <Kpi icone={<FileText size={18} />} rotulo="Ficha de matrícula" valor={`${f.matriculas} / ${d.vendas.ingressos}`} sub={`${fP(f.matriculaPct)} dos compradores · o Tabari não dá taxa-alvo`} />
        <Kpi icone={<Users size={18} />} tom="azul" rotulo="No grupo da turma" valor={g.membros === null ? "—" : fN(g.membros)} sub={g.membros === null ? "sem leitura do WhatsApp" : `${fP(g.entradaPct)} dos compradores · ${g.fonte === "manual" ? "lançado à mão" : "ao vivo"}`} />
        <Kpi icone={<MousePointerClick size={18} />} tom="ambar" rotulo="Ficha de interesse" valor={fN(f.interesse.total)} regua="ficha_interesse" valorNum={f.interesse.total ? f.interessePct : null} sub={`${fP(f.interessePct)} ${f.interesseBase}`} />
        <Kpi icone={<Flame size={18} />} tom="verm" rotulo="Fichas HOT" valor={fN(f.interesse.hot)} sub={`WARM ${f.interesse.warm} · COLD ${f.interesse.cold}`} />
      </div>
      <div className="metade">
        <Bloco titulo="Mensageria do grupo" sub={g.nome ? `${g.nome}` : "Grupo do ciclo não cadastrado em grupos_ciclo"}>
          <LinhaRegua chave="entrega_msg" valor={entregues} sub={`${g.disparos.enviados} enviadas · ${g.disparos.atrasados} atrasadas · ${g.disparos.expirados} expiradas`} />
          <div className="regua-linha num">
            Programadas <b>{g.disparos.total}</b> · aguardando <b>{g.disparos.pendentes}</b> · vetadas pelo Red <b>{g.disparos.vetados}</b>
          </div>
          <div className="dica">Cadência do Tabari: T-24, T-1, link 15 min antes, recap, replay, gancho da próxima aula. Teto de 4 mensagens no grupo por dia. Mais mensagem na semana = menos abertura na segunda.</div>
        </Bloco>
        <Bloco titulo="Ficha de interesse" sub="Abre no pré-pitch da Aula 4, repitch na Aula 5, fecha domingo.">
          <LinhaRegua chave="ficha_interesse" valor={f.interesse.total ? f.interessePct : null} sub={f.interesseBase} />
          <Barras itens={[{ x: "HOT", y: f.interesse.hot }, { x: "WARM", y: f.interesse.warm }, { x: "COLD", y: f.interesse.cold }]} tom="ambar" />
          <div className="dica">Benefício de quem preenche: carrinho às <b>6h50</b>, 10 min antes do geral. A planilha do Tabari mostra 40% (bom) e 23% (abaixo).</div>
        </Bloco>
      </div>
    </>
  );
}

// ============================================================
// AULAS
// ============================================================
function Aulas({ d, ir }: { d: Dados; ir: (a: Aba) => void }) {
  const lancado = d.aulas.some((a) => a.presenca !== null);
  return (
    <>
      <Cab rot="Comparecimento" titulo="As 5 aulas e a apresentação" sub="Presença ao vivo durante a semana. Views únicos só na semana seguinte (pós-morte)." citacao="Presença na aula um tem que dar no mínimo 30%." />
      {!lancado && (
        <div className="aviso bg-azul">As aulas ficam no YouTube não listado e a presença não tem API ligada. Lance o pico ao vivo de cada aula em <button className="btn-sec" style={{ height: 28, marginLeft: 6 }} onClick={() => ir("lancar")}>Lançar números</button></div>
      )}
      <div className="duas">
        <Bloco titulo="Curva de presença" sub="Barra: ao vivo · tracejado: esperado pela régua (A1 30% · −30% · −15% · −15% · −15% · domingo +30%).">
          <Barras itens={d.aulas.map((a) => ({ x: a.rotulo.replace("Apresentação (dom)", "Dom"), y: a.presenca || 0, meta: a.esperado }))} tom="azul" />
          <div className="legenda"><span><i style={{ background: "#4A9BFF" }} />ao vivo</span><span><i style={{ background: "#E9EFEC", height: 2 }} />esperado</span></div>
        </Bloco>
        <Bloco titulo="Réguas da semana">
          <LinhaRegua chave="presenca_a1" valor={d.aulas[0].presencaPct} sub={`${fN(d.aulas[0].presenca)} ao vivo de ${d.vendas.ingressos} compradores`} />
          <LinhaRegua chave="unicos_a1" valor={d.aulas[0].unicosPct} nome="Views únicos da Aula 1" sub="pós-morte" />
          <LinhaRegua chave="unicos_a1" valor={d.aulas[1].unicosPct} nome="Views únicos da Aula 2" sub="pós-morte" />
        </Bloco>
      </div>
      <div className="card tab-wrap">
        <table className="tab">
          <thead>
            <tr><th>Aula</th><th>Data</th><th className="dir">Ao vivo</th><th className="dir">% compradores</th><th className="dir">Esperado</th><th className="dir">Retenção</th><th className="dir">Meta retenção</th><th className="dir">Únicos</th><th className="dir">Duração</th></tr>
          </thead>
          <tbody>
            {d.aulas.map((a) => {
              const corRet = a.retencao === null || a.retencaoMeta === null ? "neutro" : a.retencao >= a.retencaoMeta - 5 ? "verde" : "vermelho";
              const corDur = a.duracao === null ? "neutro" : a.duracao <= (a.n === 4 ? 75 : 50) ? "verde" : "amarelo";
              return (
                <tr key={a.n}>
                  <td><b>{a.rotulo}</b></td>
                  <td>{a.data.slice(8)}/{a.data.slice(5, 7)}</td>
                  <td className="dir num">{fN(a.presenca)}</td>
                  <td className="dir num">{fP(a.presencaPct)}</td>
                  <td className="dir num t-gray">{fN(a.esperado)}</td>
                  <td className={`dir num cor-${corRet}`}>{fP(a.retencao)}</td>
                  <td className="dir num t-gray">{a.retencaoMeta ? fP(a.retencaoMeta, 0) : "—"}</td>
                  <td className="dir num">{fN(a.unicos)} {a.unicosPct !== null && <span className="t-gray">({fP(a.unicosPct, 0)})</span>}</td>
                  <td className={`dir num cor-${corDur}`}>{a.duracao !== null ? `${a.duracao} min` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="dica" style={{ marginTop: 14 }}>
        Marcos de vitória: <b>Aula 3</b> (marco 1) e <b>Aula 5</b> (marco 2). Aula 4 = pré-pitch sem preço, abre a ficha. Aula de 40-50 min (a 4 vai a 60 + 15). À noite o Tabari mede ~50% de presença na Aula 1; de manhã ~35%, mas converte mais.
      </div>
    </>
  );
}

// ============================================================
// DOMINGO E CARRINHO
// ============================================================
function Formacao({ d, ir }: { d: Dados; ir: (a: Aba) => void }) {
  const b = d.backend;
  const c = b.curva;
  return (
    <>
      <Cab rot="Backend" titulo="Formação Arquiteto de Agentes" sub={`Apresentação ${dmh(d.ciclo.pitch)} · carrinho ${dmh(d.ciclo.carrinhoAbre)} às ${dmh(d.ciclo.carrinhoFecha).split(" ")[1]} · R$${fN(b.preco)}`} citacao="É 7% do total de venda de tickets." />
      {b.fonte === null && (
        <div className="aviso bg-azul">A Formação ainda não tem produto ligado ao painel. Quando existir na Hotmart, informe o ID em <button className="btn-sec" style={{ height: 28, marginLeft: 6 }} onClick={() => ir("lancar")}>Lançar números</button> e as vendas entram sozinhas, com a curva do carrinho.</div>
      )}
      <div className="grade-kpi">
        <Kpi icone={<GraduationCap size={18} />} rotulo="Vendas da Formação" valor={fN(b.vendas)} sub={b.fonte === "manual" ? "lançado à mão" : b.fonte === "hotmart" ? "Hotmart, ao vivo" : "sem fonte"} />
        <Kpi icone={<Percent size={18} />} tom="ambar" rotulo="Conversão sobre ingressos" valor={fP(b.conv)} regua="conv_backend" valorNum={b.conv} sub="<5% regrava o evento" />
        <Kpi icone={<Users size={18} />} tom="azul" rotulo="Presentes no domingo" valor={fN(d.aulas[5].presenca)} sub={`esperado ${fN(d.aulas[5].esperado)} (A5 + 30%) · conversão sobre presentes ${fP(b.convPresentes)}`} />
        <Kpi icone={<Flame size={18} />} tom="verm" rotulo="HOT que compraram" valor={fP(b.hotCompraram)} regua="hot_compra" valorNum={b.hotCompraram} sub={`conversão sobre fichas ${fP(b.convFichas)}`} />
      </div>
      <div className="metade">
        <Bloco titulo="Curva do carrinho" sub="70% nos 10 primeiros minutos · 90% na 1ª hora · 90-95% no dia 1.">
          {c ? (
            <>
              <LinhaRegua chave="vendas_d1" nome="Vendas na 1ª hora" valor={(c.ate1h / c.total) * 100} sub={`${c.ate1h} de ${c.total}`} />
              <div className="regua-linha num">Janela da ficha (6h50-7h): <b>{c.ate10min}</b> · dia 1: <b>{c.d1}</b> ({fP((c.d1 / c.total) * 100, 0)}) · depois do dia 1: <b>{c.total - c.d1}</b></div>
              <Barras itens={b.porHora.map((h) => ({ x: h.hora, y: h.vendas }))} tom="menta" />
            </>
          ) : (
            <div className="vazio">A curva aparece quando as vendas vierem da Hotmart.</div>
          )}
        </Bloco>
        <Bloco titulo="Escada de bônus da segunda" sub="Como o Tabari monta a urgência real.">
          <div className="tab-wrap">
            <table className="tab">
              <tbody>
                <tr><td><b>6h50 – 7h</b></td><td>Só quem preencheu a ficha. Melhor bônus (no dele, call individual).</td></tr>
                <tr><td><b>7h – 8h</b></td><td>Abre pra todos com o pacote mais forte.</td></tr>
                <tr><td><b>8h – 10h</b></td><td>Cai um bônus.</td></tr>
                <tr><td><b>10h – fecha</b></td><td>Preço do carrinho, sem bônus de janela.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="dica">Desconto de 10-50% sobre a âncora em ticket baixo. Link só pela Hotmart, mandado pelo mesmo número do grupo. Prova social a cada 2-3h.</div>
        </Bloco>
      </div>
    </>
  );
}

// ============================================================
// FINANCEIRO
// ============================================================
function Financeiro({ d }: { d: Dados }) {
  const f = d.financeiro;
  const v = d.vendas;
  return (
    <>
      <Cab rot="Financeiro" titulo="O lançamento fecha a conta?" sub="Front (ingresso + bumps) + Formação, contra tráfego + distribuição + custos." citacao="Eu não vou escalar prejuízo nunca." />
      <div className="grade-kpi">
        <Kpi icone={<Wallet size={18} />} tom="roxo" rotulo="Investimento total" valor={fR(f.investimento)} sub={`tráfego ${fR(f.trafego, 0)} · distribuição ${fR(f.distribuicao, 0)} · outros ${fR(f.outros, 0)}`} />
        <Kpi icone={<CircleDollarSign size={18} />} tom="azul" rotulo="Receita líquida" valor={fR(f.receitaLiquida)} sub={`bruta ${fR(f.receitaBruta)}`} />
        <Kpi icone={<TrendingUp size={18} />} rotulo="Lucro" valor={fR(f.lucro)} regua="lucro" valorNum={f.lucro} sub={`margem ${fP(f.margem)}`} />
        <Kpi icone={<Gauge size={18} />} tom="ambar" rotulo="ROAS do lançamento" valor={fX(f.roasTotal)} regua="roas_total" valorNum={f.roasTotal} />
      </div>
      <div className="metade">
        <Bloco titulo="De onde vem o dinheiro">
          <div className="tab-wrap">
            <table className="tab">
              <thead><tr><th>Linha</th><th className="dir">Vendas</th><th className="dir">Bruto</th><th className="dir">Líquido</th></tr></thead>
              <tbody>
                <tr><td>Ingresso R$62</td><td className="dir num">{v.ingressos}</td><td className="dir num">{fR(v.receitaIngresso)}</td><td className="dir num">{fR(v.liquidoIngresso)}</td></tr>
                {v.bumps.map((b) => <tr key={b.id}><td>{b.nome}</td><td className="dir num">{b.vendas}</td><td className="dir num">{fR(b.receita)}</td><td className="dir num">{fR(b.liquido)}</td></tr>)}
                <tr><td>Formação R${fN(d.backend.preco)}</td><td className="dir num">{fN(d.backend.vendas)}</td><td className="dir num">{fR(d.backend.receita)}</td><td className="dir num">{fR(d.backend.liquido)}</td></tr>
                <tr><td><b>Total</b></td><td /><td className="dir num"><b>{fR(f.receitaBruta)}</b></td><td className="dir num"><b>{fR(f.receitaLiquida)}</b></td></tr>
              </tbody>
            </table>
          </div>
          <div className="dica">Líquido = comissão do produtor que a Hotmart informa no webhook. Taxa média observada: {fP(v.taxaPlataforma !== null ? v.taxaPlataforma * 100 : null)}.</div>
        </Bloco>
        <Bloco titulo="Até quanto dá pra pagar por ingresso" sub="Fórmula do CAC máximo da aula 4.">
          <div className="kpi-val num" style={{ fontSize: 32 }}>{fR(f.cacMax)}</div>
          <div className="t-gray" style={{ fontSize: 13 }}>{f.cacMaxBase}</div>
          <LinhaRegua chave="cpa_ingresso" valor={v.cpa} nome="CPA atual" sub={f.cacMax !== null && v.cpa !== null ? (v.cpa <= f.cacMax ? "abaixo do CAC máximo: pode escalar" : "acima do CAC máximo: não escale") : undefined} />
          <div className="dica">O Tabari aceita ROAS de captação perto de 1 porque quem paga o lançamento é a Formação. Mas a meta do aluno é <b>≥R$20 mil líquidos por lançamento</b>, e o ROAS do lançamento inteiro nunca pode ser negativo.</div>
        </Bloco>
      </div>
    </>
  );
}

// ============================================================
// SEMANA A SEMANA
// ============================================================
function Comparativo({ atual }: { atual: string }) {
  const [res, setRes] = useState<Resumo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/dashboard?comparativo=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => (j.error ? setErro(j.error) : setRes(j.resumos)))
      .catch((e) => setErro(String(e)));
  }, []);
  const colunas: { k: keyof Resumo; rot: string; fmt: (n: number | null) => string; regua?: string }[] = [
    { k: "ingressos", rot: "Ingressos", fmt: (n) => fN(n), regua: "ingressos" },
    { k: "gasto", rot: "Investido", fmt: (n) => fR(n, 0) },
    { k: "roasPago", rot: "ROAS anúncio", fmt: fX, regua: "roas_captacao" },
    { k: "cpa", rot: "CPA", fmt: (n) => fR(n), regua: "cpa_ingresso" },
    { k: "cpm", rot: "CPM", fmt: (n) => fR(n), regua: "cpm" },
    { k: "ctr", rot: "CTR", fmt: (n) => fP(n, 2), regua: "ctr" },
    { k: "connect", rot: "Carregamento", fmt: (n) => fP(n), regua: "connect_rate" },
    { k: "pagCheckout", rot: "Taxa checkout", fmt: (n) => fP(n), regua: "pagina_checkout" },
    { k: "checkoutCompra", rot: "Conv. checkout", fmt: (n) => fP(n), regua: "checkout_compra" },
    { k: "convPagina", rot: "Conv. página", fmt: (n) => fP(n), regua: "conv_pagina" },
    { k: "presencaA1", rot: "Aula 1", fmt: (n) => fP(n), regua: "presenca_a1" },
    { k: "ficha", rot: "Ficha", fmt: (n) => fP(n), regua: "ficha_interesse" },
    { k: "convBackend", rot: "Conversão", fmt: (n) => fP(n), regua: "conv_backend" },
    { k: "lucro", rot: "Lucro", fmt: (n) => fR(n, 0), regua: "lucro" },
  ];
  return (
    <>
      <Cab rot="Comparativo" titulo="Semana a semana" sub="As colunas da planilha do Tabari. Máquina madura varia ±5% entre semanas." citacao="Olha que reloginho." />
      {erro && <div className="aviso bg-verm">{erro}</div>}
      {!res ? <div className="vazio">Montando o histórico dos ciclos…</div> : (
        <div className="card tab-wrap">
          <table className="tab">
            <thead><tr><th>Ciclo</th>{colunas.map((c) => <th key={c.k} className="dir">{c.rot}</th>)}</tr></thead>
            <tbody>
              {res.map((r, i) => (
                <tr key={r.d0} style={r.d0 === atual ? { background: "var(--mentaTint)" } : undefined}>
                  <td><b>{r.nome}</b></td>
                  {colunas.map((c) => {
                    const val = r[c.k] as number | null;
                    const ant = i > 0 ? (res[i - 1][c.k] as number | null) : null;
                    const delta = val !== null && ant ? ((val - ant) / Math.abs(ant)) * 100 : null;
                    return (
                      <td key={c.k} className={`dir num cor-${c.regua ? avaliar(REGUAS[c.regua], val) : "neutro"}`}>
                        {c.fmt(val)}
                        {delta !== null && Math.abs(delta) >= 0.5 && <div style={{ fontSize: 10.5, color: Math.abs(delta) <= 5 ? "var(--gray)" : "var(--grayLight)" }}>{delta > 0 ? "▲" : "▼"} {fN(Math.abs(delta), 0)}%</div>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="dica" style={{ marginTop: 14 }}>Confirmar tendência pede 2 lançamentos com a mesma variável. Uma otimização por semana: o ganho composto de 1-2% por semana mais que dobra em um ano.</div>
    </>
  );
}

// ============================================================
// LANÇAR NÚMEROS
// ============================================================
function Lancar({ d, salvo }: { d: Dados; salvo: () => void }) {
  const [vals, setVals] = useState<Record<string, string>>(() => Object.fromEntries(Object.entries(d.manual).map(([k, v]) => [k, String(v)])));
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const grupos: { titulo: string; sub: string; campos: { k: string; rot: string; ph?: string }[] }[] = useMemo(
    () => [
      { titulo: "Presença ao vivo", sub: "Pico simultâneo no YouTube durante a aula.", campos: [1, 2, 3, 4, 5].map((n) => ({ k: `presenca_a${n}`, rot: `Aula ${n}` })).concat([{ k: "presenca_a6", rot: "Apresentação (dom)" }]) },
      { titulo: "Views únicos (pós-morte)", sub: "Espectadores únicos do vídeo, na semana seguinte.", campos: [1, 2, 3, 4, 5].map((n) => ({ k: `unicos_a${n}`, rot: `Aula ${n}` })).concat([{ k: "unicos_a6", rot: "Apresentação" }]) },
      { titulo: "Duração das aulas (min)", sub: "Meta 40-50 min.", campos: [1, 2, 3, 4, 5, 6].map((n) => ({ k: `duracao_a${n}`, rot: n === 6 ? "Apresentação" : `Aula ${n}` })) },
      { titulo: "Dinheiro e metas", sub: "O que a Meta e a Hotmart não informam sozinhas.", campos: [
        { k: "verba_distribuicao", rot: "Verba de distribuição (R$)", ph: "impulsionamentos C1/C2/C3" },
        { k: "custos_extras", rot: "Outros custos (R$)", ph: "ferramentas, equipe" },
        { k: "meta_ingressos", rot: "Meta de ingressos", ph: "100" },
        { k: "roas_alvo", rot: "ROAS-alvo do CAC máx.", ph: "3" },
        { k: "membros_grupo", rot: "Membros no grupo", ph: "se o WhatsApp não ler" },
      ] },
      { titulo: "Formação Arquiteto de Agentes", sub: "Com o ID da Hotmart as vendas entram sozinhas.", campos: [
        { k: "produto_formacao_id", rot: "ID do produto na Hotmart" },
        { k: "preco_formacao", rot: "Preço (R$)", ph: "997" },
        { k: "vendas_formacao", rot: "Vendas (se não houver ID)" },
      ] },
    ],
    [],
  );
  async function salvar() {
    setSalvando(true);
    const valores: Record<string, number | null> = {};
    for (const g of grupos) for (const c of g.campos) {
      const raw = (vals[c.k] ?? "").replace(/\./g, "").replace(",", ".").trim();
      valores[c.k] = raw === "" ? null : Number(raw);
    }
    const r = await fetch("/api/dashboard/manual", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ciclo: d.ciclo.d0, valores }) });
    const j = await r.json();
    setSalvando(false);
    setToast(j.ok ? "Números salvos." : `Erro: ${j.error}`);
    setTimeout(() => setToast(null), 2500);
    if (j.ok) salvo();
  }
  return (
    <>
      <Cab rot="Lançamento manual" titulo="Lançar números" sub={`Só o que não tem API. Vale para ${d.ciclo.nome}.`} />
      {grupos.map((g) => (
        <div key={g.titulo} style={{ marginBottom: 14 }}>
          <Bloco titulo={g.titulo} sub={g.sub}>
            <div className="form-grade">
              {g.campos.map((c) => (
                <div className="campo" key={c.k}>
                  <label>{c.rot}</label>
                  <input inputMode="decimal" value={vals[c.k] ?? ""} placeholder={c.ph || ""} onChange={(e) => setVals({ ...vals, [c.k]: e.target.value })} />
                </div>
              ))}
            </div>
          </Bloco>
        </div>
      ))}
      <button className="btn" onClick={salvar} disabled={salvando}>{salvando ? "Salvando…" : "Salvar números do ciclo"}</button>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ============================================================
// RÉGUAS DO MÉTODO
// ============================================================
function Reguas() {
  const lista = Object.values(REGUAS);
  const [origem, setOrigem] = useState<"todas" | "tabari" | "squad" | "red">("todas");
  return (
    <>
      <Cab rot="Método" titulo="Réguas do método" sub="Cada meta do painel, de onde ela veio e o que ela quer dizer." />
      <div className="pilulas">
        {(["todas", "tabari", "squad", "red"] as const).map((o) => (
          <button key={o} className={`pil ${origem === o ? "on" : ""}`} onClick={() => setOrigem(o)}>
            {{ todas: "Todas", tabari: "Ditas pelo Tabari", squad: "Squad Turbo", red: "Decisão do Red" }[o]} <b>{lista.filter((r) => o === "todas" || r.origem === o).length}</b>
          </button>
        ))}
      </div>
      <div className="grade-crt" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))" }}>
        {lista.filter((r) => origem === "todas" || r.origem === origem).map((r) => (
          <div className="card" key={r.chave} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <b>{r.nome}</b>
              <span className={`selo ${r.origem === "tabari" ? "bg-menta" : r.origem === "red" ? "bg-azul" : "bg-roxo"}`}>{r.origem === "tabari" ? "Tabari" : r.origem === "red" ? "Red" : "Squad"}</span>
            </div>
            <div className="t-menta num" style={{ fontWeight: 600, margin: "6px 0" }}>{metaTexto(r) || "sem número"}</div>
            <ReguaDica r={r} />
          </div>
        ))}
      </div>
      <div className="dica" style={{ marginTop: 14 }}>
        <b>Sem número em nenhuma fonte</b> (o painel mostra o dado, sem semáforo): CPC, take rate de cada bump pelo Tabari, entrada no grupo, preenchimento da ficha de matrícula, vendas por hora, chargeback, LTV.
      </div>
    </>
  );
}
