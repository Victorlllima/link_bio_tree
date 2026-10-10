"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Eye, EyeOff } from "lucide-react";
import "./painel.css";
import type { Dados, Resumo } from "./tipos";
import { REGUAS, REGRAS_OURO, avaliar } from "./metas";
import { Kpi, LinhaRegua, Bloco, Alerta, Funil, Area, Barras, Calor, Ponto, ReguaDica, fN, fR, fP, fX, metaTexto } from "./ui";

type Aba = "geral" | "trafego" | "criativos" | "vendas" | "grupo" | "aulas" | "formacao" | "financeiro" | "comparativo" | "lancar" | "reguas";

const NAV: { id: Aba; rot: string; sepDepois?: boolean }[] = [
  { id: "geral", rot: "Visão geral", sepDepois: true },
  { id: "trafego", rot: "Tráfego" },
  { id: "criativos", rot: "Criativos" },
  { id: "vendas", rot: "Ingressos", sepDepois: true },
  { id: "grupo", rot: "Grupo e fichas" },
  { id: "aulas", rot: "Aulas" },
  { id: "formacao", rot: "Carrinho", sepDepois: true },
  { id: "financeiro", rot: "Financeiro" },
  { id: "comparativo", rot: "Comparativo", sepDepois: true },
  { id: "lancar", rot: "Lançar números" },
  { id: "reguas", rot: "Réguas" },
];

// ---------- datas (Brasília) ----------
const brDiaDe = (iso: string | number) => new Date(new Date(iso).getTime() - 3 * 3600e3).toISOString().slice(0, 10);
const somaDia = (d: string, n: number) => {
  const x = new Date(`${d}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
const DOW3 = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const dowDe = (d: string) => new Date(`${d}T12:00:00Z`).getUTCDay();
const ddmm = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
const dm = (iso: string) => ddmm(brDiaDe(iso));
const dmh = (iso: string) => {
  const d = new Date(new Date(iso).getTime() - 3 * 3600e3);
  return `${dm(iso)} ${String(d.getUTCHours()).padStart(2, "0")}h${String(d.getUTCMinutes()).padStart(2, "0")}`;
};
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const porExtenso = (d: string) => `${Number(d.slice(8, 10))} de ${MESES[Number(d.slice(5, 7)) - 1]}`;

function saudacao() {
  const h = new Date(Date.now() - 3 * 3600e3).getUTCHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}
function falta(iso: string, agora: string) {
  const ms = new Date(iso).getTime() - new Date(agora).getTime();
  if (ms <= 0) return "agora";
  const h = Math.floor(ms / 3600e3);
  if (h >= 48) return `em ${Math.round(ms / 86400e3)} dias`;
  if (h >= 1) return `em ${h}h${String(Math.floor((ms % 3600e3) / 60e3)).padStart(2, "0")}`;
  return `em ${Math.floor(ms / 60e3)} min`;
}

// ============================================================
// Quais dados cada aba usa quando está em "Ao vivo": as de dinheiro e captação usam a turma
// em captação; as de evento (aulas, grupo, carrinho) usam a turma em aula.
const ABAS_CAPTACAO = new Set<Aba>(["trafego", "criativos", "vendas"]);
const tag = (d: Dados) => `${d.ciclo.nome} · ${d.ciclo.fase.rotulo}`;
type Turma = { d0: string; nome: string; indice: number };

export default function Painel() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);
  const [sel, setSel] = useState<string>(""); // "" = ao vivo
  const [vivos, setVivos] = useState<Dados[]>([]);
  const [fixo, setFixo] = useState<Dados | null>(null);
  const [lista, setLista] = useState<Turma[]>([]);
  const [geradoEm, setGeradoEm] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [aba, setAba] = useState<Aba>("geral");
  const [privado, setPrivado] = useState(false);

  const carregar = useCallback(async (escolha: string) => {
    setCarregando(true);
    setErro(null);
    try {
      const r = await fetch(escolha ? `/api/dashboard?ciclo=${escolha}` : "/api/dashboard?vivos=1", { cache: "no-store" });
      if (r.status === 401) {
        setAuth(false);
        return;
      }
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      if (escolha) {
        setFixo(j);
        setLista(j.ciclos);
        setGeradoEm(j.geradoEm);
      } else {
        setVivos(j.vivos);
        setLista(j.ciclos);
        setGeradoEm(j.vivos[0]?.geradoEm ?? new Date().toISOString());
      }
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
    carregar("");
  }, [carregar]);

  // atualiza sozinho a cada 2 min (30 s com o carrinho aberto) e pausa com a aba escondida
  const carrinhoAberto = (sel ? [fixo] : vivos).some((d) => d?.ciclo.fase.id === "carrinho");
  useEffect(() => {
    if (!geradoEm) return;
    const ms = carrinhoAberto ? 30e3 : 120e3;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") carregar(sel);
    }, ms);
    const vis = () => document.visibilityState === "visible" && Date.now() - new Date(geradoEm).getTime() > ms && carregar(sel);
    document.addEventListener("visibilitychange", vis);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [geradoEm, sel, carrinhoAberto, carregar]);

  function irPara(a: Aba) {
    setAba(a);
    try {
      localStorage.setItem("hwd_aba", a);
    } catch {}
    window.scrollTo({ top: 0 });
  }
  function escolher(v: string) {
    setSel(v);
    carregar(v);
  }

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha(false);
    const r = await fetch("/api/lpsg/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: senha }) });
    if (r.ok) carregar(sel);
    else setErroSenha(true);
  }

  if (auth === false) {
    return (
      <div className="hw-login">
        <form onSubmit={entrar}>
          <h1>Hermes Week</h1>
          <p>Painel do lançamento. Acesso restrito.</p>
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} autoFocus aria-label="Senha" />
          {erroSenha && <div className="erro">Senha incorreta. Tente de novo.</div>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  // turma em captação e turma em aula ou carrinho (podem ser a mesma, ou haver só uma)
  const cap = vivos.find((v) => v.ciclo.emCaptacao) ?? null;
  const aula = [...vivos].reverse().find((v) => v.ciclo.emAula) ?? null;
  const dupla = !sel && vivos.length === 2 && cap && aula && cap.ciclo.d0 !== aula.ciclo.d0 ? { cap, aula } : null;
  const dados: Dados | null = sel ? fixo : (ABAS_CAPTACAO.has(aba) ? (cap ?? aula) : (aula ?? cap)) ?? vivos[0] ?? null;
  const alertasRuins = (dupla ? [dupla.cap, dupla.aula] : dados ? [dados] : []).reduce((n, d) => n + d.leitura.filter((l) => l.nivel === "ruim").length, 0);
  const faseTexto = dupla && aba === "geral" ? "Duas turmas ao vivo" : dados?.ciclo.fase.rotulo;
  const padraoLancar = (aula ?? cap)?.ciclo.d0 ?? lista[lista.length - 1]?.d0 ?? "";

  return (
    <div className={`hw ${privado ? "privado" : ""}`}>
      <header>
        <div className="mast">
          <div className="marca">
            <b>Hermes Week</b>
            <small>Painel do lançamento</small>
          </div>
          <div className="esp" />
          <div className="ciclo">
            <label htmlFor="hw-ciclo">Turma</label>
            <select id="hw-ciclo" value={sel} onChange={(e) => escolher(e.target.value)}>
              <option value="">Ao vivo</option>
              {[...lista].reverse().map((c) => (
                <option key={c.d0} value={c.d0}>{c.nome}</option>
              ))}
            </select>
          </div>
          {faseTexto && (
            <div className="fase">
              <Ponto cor="verde" />
              {faseTexto}
            </div>
          )}
          {geradoEm && (
            <div className="atualizado">
              <Ponto cor={erro ? "amarelo" : "verde"} />
              <span>{carregando ? "Atualizando" : `Atualizado às ${dmh(geradoEm).split(" ")[1]}`}</span>
            </div>
          )}
          <button className="iconb" onClick={() => carregar(sel)} aria-label="Atualizar os números" disabled={carregando}>
            <RefreshCw size={16} className={carregando ? "girando" : ""} />
          </button>
          <button className="iconb" onClick={() => setPrivado(!privado)} aria-label={privado ? "Mostrar valores" : "Ocultar valores"}>
            {privado ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="nav-faixa">
          <nav className="nav" aria-label="Seções do painel">
            {NAV.map((n) => (
              <span key={n.id} style={{ display: "contents" }}>
                <button className={aba === n.id ? "on" : ""} onClick={() => irPara(n.id)} aria-current={aba === n.id ? "page" : undefined}>
                  {n.rot}
                  {n.id === "geral" && alertasRuins > 0 && <span className="alerta-pt" aria-label={`${alertasRuins} problema`} />}
                </button>
                {n.sepDepois && <span className="sep" />}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="wrap">
        {erro && <div className="aviso ruim">Não consegui montar o painel: {erro}</div>}
        {!dados ? (
          <div className="vazio">Montando os números do ciclo.</div>
        ) : (
          <>
            {aba === "geral" && (dupla ? <GeralDupla cap={dupla.cap} aula={dupla.aula} /> : <Geral d={dados} />)}
            {aba === "trafego" && <Trafego d={dados} />}
            {aba === "criativos" && <Criativos d={dados} />}
            {aba === "vendas" && <Vendas d={dados} />}
            {aba === "grupo" && <Grupo d={dados} />}
            {aba === "aulas" && <Aulas d={dados} ir={irPara} />}
            {aba === "formacao" && <Formacao d={dados} ir={irPara} />}
            {aba === "financeiro" && <Financeiro d={dados} />}
            {aba === "comparativo" && <Comparativo atual={dados.ciclo.d0} />}
            {aba === "lancar" && <Lancar lista={lista} padrao={padraoLancar || dados.ciclo.d0} salvo={() => carregar(sel)} />}
            {aba === "reguas" && <Reguas />}
          </>
        )}
      </main>
      <style>{`.girando{animation:hwgira 1s linear infinite}@keyframes hwgira{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Cab({ rot, titulo, sub, turma }: { rot: string; titulo: React.ReactNode; sub: string; turma?: string }) {
  return (
    <div className="cab">
      <div>
        <div className="eyebrow">{rot}{turma && <span className="turma-chip">{turma}</span>}</div>
        <h1>{titulo}</h1>
        <p>{sub}</p>
      </div>
    </div>
  );
}

const janela = (d: Dados) => `Captação de ${dm(d.ciclo.captIni)} a ${dm(d.ciclo.captFim)}. Aula 1 em ${dm(d.ciclo.captFim)}, carrinho em ${dm(d.ciclo.carrinhoAbre)}.`;

// ============================================================
// A semana, desenhada como um teclado
// ============================================================
function Teclado({ d }: { d: Dados }) {
  const hoje = brDiaDe(d.geradoEm);
  const itens = [
    { ev: "Aula 1", c: "A1", hora: "20h" },
    { ev: "Aula 2", c: "A2", hora: "20h" },
    { ev: "Aula 3", c: "A3", hora: "20h" },
    { ev: "Aula 4", c: "A4", hora: "20h" },
    { ev: "Aula 5", c: "A5", hora: "20h" },
    { ev: "Dúvidas", c: "Dúv", hora: "10h" },
    { ev: "Formação", c: "Form", hora: "20h" },
    { ev: "Carrinho", c: "Cart", hora: "6h50" },
  ];
  const ao = (i: number) => (i < 5 ? d.aulas[i].presenca : i === 6 ? d.aulas[5].presenca : null);
  return (
    <div className="teclado">
      <div className="teclado-cab">
        <span className="rot">A semana desta turma</span>
        {d.ciclo.proximo && (
          <span className="rot">
            Próximo: <b style={{ color: "var(--ivory)", fontWeight: 600 }}>{d.ciclo.proximo.rotulo}</b> {falta(d.ciclo.proximo.quando, d.geradoEm)}
          </span>
        )}
      </div>
      <div className="teclas">
        {itens.map((it, i) => {
          const data = somaDia(d.ciclo.d0, i);
          const estado = data < hoje ? "passou" : data === hoje ? "agora" : "";
          const p = ao(i);
          return (
            <div key={it.ev} className={`tecla ${estado}`}>
              <div className="dia">
                <span>{DOW3[dowDe(data)]}</span>
                <span>{ddmm(data)}</span>
              </div>
              <div className="ev">
                <span className="longo">{it.ev}</span>
                <span className="curto">{it.c}</span>
                <small>{p !== null ? `${fN(p)} ao vivo` : it.hora}</small>
              </div>
            </div>
          );
        })}
      </div>
      <div className="tecla-base" />
    </div>
  );
}

function etapasFunil(d: Dados) {
  const v = d.vendas;
  const t = d.trafego;
  return [
    { nome: "Impressões", valor: t.impressoes, sub: `CPM ${fR(t.cpm)} · frequência ${fN(t.frequencia, 1)}` },
    { nome: "Cliques no link", valor: t.cliquesLink, taxa: t.impressoes ? (t.cliquesLink / t.impressoes) * 100 : null, sub: `CTR ${fP(t.ctr, 2)} · CPC ${fR(t.cpcLink)}` },
    { nome: "Viram a página", valor: t.lpv, taxa: t.connect, regua: "connect_rate", sub: "connect rate" },
    { nome: "Foram ao checkout", valor: t.ic, taxa: t.pagCheckout, regua: "pagina_checkout", sub: `custo por finalização ${fR(t.custoIc)}` },
    { nome: "Compraram pelo anúncio", valor: t.vendasPagas, taxa: t.checkoutCompra, regua: "checkout_compra", sub: `conversão da página ${fP(t.convPagina)}` },
    { nome: "Ingressos no total", valor: v.ingressos, sub: `mais ${v.origem.bio} pela bio e ${v.origem.outro} de outras origens` },
    { nome: "Fizeram a matrícula", valor: d.fichas.matriculas, taxa: d.fichas.matriculaPct, sub: "passo 1 do onboarding" },
    { nome: "Ao vivo na Aula 1", valor: d.aulas[0].presenca, taxa: d.aulas[0].presencaPct, regua: "presenca_a1", sub: d.aulas[0].presenca === null ? "ainda não lançado" : "pico ao vivo" },
    { nome: "Ficha de interesse", valor: d.fichas.interesse.total, taxa: d.fichas.interessePct, regua: "ficha_interesse", sub: `HOT ${d.fichas.interesse.hot} · WARM ${d.fichas.interesse.warm} · COLD ${d.fichas.interesse.cold}` },
    { nome: "Compraram a Formação", valor: d.backend.vendas, taxa: d.backend.conv, regua: "conv_backend", sub: "sobre o total de ingressos" },
  ];
}

function RStat({ rot, chave, num, valor, sub }: { rot: string; chave: string; num: number | null; valor: string; sub: string }) {
  const cor = avaliar(REGUAS[chave], num);
  return (
    <div className="r-stat">
      <div className="rot">
        <Ponto cor={cor} />
        {rot}
      </div>
      <div className={`v num ${cor === "verde" ? "" : `c-${cor}`}`}>{valor}</div>
      <div className="s">{sub}</div>
    </div>
  );
}

// ============================================================
// VISÃO GERAL
// ============================================================
function Geral({ d }: { d: Dados }) {
  const v = d.vendas;
  const t = d.trafego;
  const rg = REGUAS.ingressos;
  const corIng = avaliar(rg, v.ingressos);
  const pctMeta = Math.min(100, v.meta ? (v.ingressos / v.meta) * 100 : 0);
  const notaCor = d.saude.total >= 80 ? "verde" : d.saude.total >= 60 ? "amarelo" : "vermelho";
  return (
    <>
      <Cab rot={`${d.ciclo.nome}  ·  ${d.ciclo.fase.detalhe}`} titulo={<>{saudacao()}, <em>Red.</em></>} sub={janela(d)} />

      <section className="laca hero" aria-label="Ingressos vendidos">
        <div className="hero-l">
          <div className="rot">
            <Ponto cor={corIng} />
            Ingressos vendidos
          </div>
          <div className="gigante num">
            {fN(v.ingressos)}
            <small>de {fN(v.meta)}</small>
          </div>
          <div className="meter">
            <i style={{ width: `${pctMeta}%` }} />
            {rg.min !== undefined && <b style={{ left: `${(rg.min / v.meta) * 100}%` }} />}
          </div>
          <div className="meter-pe">
            <span>{fN(t.vendasPagas)} pelo anúncio e {fN(v.origem.bio)} pela bio</span>
            <span>mínimo {fN(rg.min)} · meta {fN(v.meta)}</span>
          </div>
          <Teclado d={d} />
        </div>
        <div className="hero-r">
          <RStat rot="Investido em tráfego" chave="verba_dia" num={t.verbaDia} valor={fR(t.gasto)} sub={`${fR(t.verbaDia)} por dia, em ${t.dias} dias`} />
          <RStat rot="ROAS do anúncio" chave="roas_captacao" num={v.roasPago} valor={fX(v.roasPago)} sub={`com a bio ${fX(v.roas)} · líquido ${fX(v.roasLiquido)}`} />
          <RStat rot="Custo por ingresso" chave="cpa_ingresso" num={v.cpa} valor={fR(v.cpa)} sub={`só pelo anúncio ${fR(t.cpaPago)}`} />
        </div>
      </section>

      <div className="g3">
        <Kpi rotulo="Faturamento do front" valor={fR(v.receitaFront)} sub={`${fR(v.liquidoFront)} líquido · ticket médio ${fR(v.ticketMedio)}`} />
        <div className="card">
          <div className="stat">
            <div className="topo">
              <span className="rot">Saúde do lançamento</span>
              <Ponto cor={notaCor} />
            </div>
            <div className={`v num ${notaCor === "verde" ? "" : `c-${notaCor}`}`}>
              {d.saude.total}
              <span className="dim3" style={{ fontSize: 20, fontStyle: "italic" }}> de 100</span>
            </div>
            <div>
              {d.saude.areas.map((a) => (
                <div className="saude-linha" key={a.area}>
                  <span>{a.area}</span>
                  <span className="t"><i style={{ width: `${a.nota}%` }} /></span>
                  <span className="num" style={{ textAlign: "right" }}>{a.nota}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Kpi rotulo="Origem dos ingressos" valor={`${fN(v.origem.anuncio)} anúncio`} sub={`${fN(v.origem.bio)} pela bio · ${fN(v.origem.outro)} outros. O pixel conta cada bump como uma compra, por isso a atribuição vem da Hotmart.`} />
      </div>

      <div className="g-8-4">
        <Bloco titulo="O funil inteiro" sub="Do anúncio à Formação, com a régua do método em cada passagem. A barra usa escala logarítmica para as etapas finais continuarem visíveis.">
          <Funil etapas={etapasFunil(d)} />
        </Bloco>
        <Bloco titulo="Leitura do ORION" sub="O que está pegando e o que fazer agora.">
          {d.leitura.length === 0 ? <div className="vazio">Nada fora da régua.</div> : d.leitura.map((a, i) => <Alerta key={i} a={a} />)}
          <div className="dica">
            <b>Regras que impedem besteira</b>
            <ul style={{ margin: "8px 0 0", paddingLeft: 16 }}>
              {REGRAS_OURO.map((r) => <li key={r} style={{ marginBottom: 4 }}>{r}</li>)}
            </ul>
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Verba e vendas, dia a dia" sub="A linha é o gasto em tráfego. As barras são os ingressos vendidos no dia.">
        <Area pontos={t.serie.map((s) => ({ x: ddmm(s.dia), y: s.gasto }))} barras={t.serie.map((s) => ({ x: s.dia, y: s.ingressos }))} fmt={(n) => `R$${fN(n)}`} />
        <div className="legenda"><span><i style={{ background: "#cdb68a" }} />gasto por dia</span><span><i style={{ background: "#ece6d8", opacity: 0.5, height: 8 }} />ingressos</span></div>
      </Bloco>
    </>
  );
}

// ============================================================
// VISÃO GERAL COM DUAS TURMAS AO VIVO
// De terça a segunda uma turma está em aula e a seguinte em captação, ao mesmo tempo.
// ============================================================
function GeralDupla({ cap, aula }: { cap: Dados; aula: Dados }) {
  const rg = REGUAS.ingressos;
  const vc = cap.vendas;
  const tc = cap.trafego;
  const pctMeta = Math.min(100, vc.meta ? (vc.ingressos / vc.meta) * 100 : 0);
  const ultimaAula = [...aula.aulas].reverse().find((a) => a.presenca !== null) ?? null;
  const presMin = REGUAS.presenca_a1.min ?? 30;
  const projecao = cap.leitura.find((l) => l.titulo.startsWith("Projeção"));
  const AREAS_CAP = ["Tráfego", "Página", "Criativos", "Vendas", "Fontes"];
  const AREAS_AULA = ["Aulas", "Fichas", "Grupo", "Formação", "Financeiro"];
  const leit = (d: Dados, areas: string[]) => d.leitura.filter((l) => areas.includes(l.area));
  const notaCor = (n: number) => (n >= 80 ? "verde" : n >= 60 ? "amarelo" : "vermelho");
  const lc = leit(cap, AREAS_CAP);
  const la = leit(aula, AREAS_AULA);
  return (
    <>
      <Cab
        rot="Duas turmas ao vivo"
        titulo={<>{saudacao()}, <em>Red.</em></>}
        sub={`A ${aula.ciclo.nome} está em ${aula.ciclo.fase.rotulo.toLowerCase()}. A ${cap.ciclo.nome} está em captação até ${dm(cap.ciclo.captFim)}, às 23h59.`}
      />

      <div className="par heroes">
        <section className="laca hero-mini" aria-label={`Captação da ${cap.ciclo.nome}`}>
          <div className="hm-cab">
            <span className="rot"><Ponto cor={avaliar(rg, vc.ingressos)} />{cap.ciclo.nome} · em captação</span>
            <span className="rot">Saúde <b className={`c-${notaCor(cap.saude.total)}`} style={{ fontWeight: 600 }}>{cap.saude.total}</b></span>
          </div>
          <div className="gigante med num">{fN(vc.ingressos)}<small>de {fN(vc.meta)}</small></div>
          <div className="meter">
            <i style={{ width: `${pctMeta}%` }} />
            {rg.min !== undefined && <b style={{ left: `${(rg.min / vc.meta) * 100}%` }} />}
          </div>
          <div className="meter-pe">
            <span>{fN(tc.vendasPagas)} pelo anúncio e {fN(vc.origem.bio)} pela bio</span>
            <span>mínimo {fN(rg.min)} · meta {fN(vc.meta)}</span>
          </div>
          {projecao && <p className="hero-sub">{projecao.titulo}. {projecao.texto}</p>}
          <div className="mini3">
            <RStat rot="Investido" chave="verba_dia" num={tc.verbaDia} valor={fR(tc.gasto, 0)} sub={`${fR(tc.verbaDia, 0)} por dia`} />
            <RStat rot="ROAS do anúncio" chave="roas_captacao" num={vc.roasPago} valor={fX(vc.roasPago)} sub={`com a bio ${fX(vc.roas)}`} />
            <RStat rot="Custo por ingresso" chave="cpa_ingresso" num={vc.cpa} valor={fR(vc.cpa)} sub={`só anúncio ${fR(tc.cpaPago)}`} />
          </div>
        </section>

        <section className="laca hero-mini" aria-label={`Evento da ${aula.ciclo.nome}`}>
          <div className="hm-cab">
            <span className="rot"><Ponto cor={ultimaAula ? avaliar(REGUAS.presenca_a1, ultimaAula.presencaPct) : "neutro"} />{aula.ciclo.nome} · {aula.ciclo.fase.rotulo.toLowerCase()}</span>
            <span className="rot">Saúde <b className={`c-${notaCor(aula.saude.total)}`} style={{ fontWeight: 600 }}>{aula.saude.total}</b></span>
          </div>
          <div className="gigante med num">{ultimaAula ? fN(ultimaAula.presenca) : "—"}<small>{ultimaAula ? `ao vivo na ${ultimaAula.rotulo}` : "presença não lançada"}</small></div>
          <div className="meter">
            <i style={{ width: `${Math.min(100, ultimaAula?.presencaPct ?? 0)}%` }} />
            <b style={{ left: `${presMin}%` }} />
          </div>
          <div className="meter-pe">
            <span>{ultimaAula ? `${fP(ultimaAula.presencaPct)} dos ${fN(aula.vendas.ingressos)} compradores` : `${fN(aula.vendas.ingressos)} compradores na turma`}</span>
            <span>mínimo {fN(presMin)}% ao vivo</span>
          </div>
          <Teclado d={aula} />
          <div className="mini3">
            <RStat rot="Matrícula" chave="matricula" num={aula.fichas.matriculaPct} valor={fP(aula.fichas.matriculaPct, 0)} sub={`${aula.fichas.matriculas} de ${aula.vendas.ingressos}`} />
            <RStat rot="Ficha de interesse" chave="ficha_interesse" num={aula.fichas.interesse.total ? aula.fichas.interessePct : null} valor={fP(aula.fichas.interessePct, 0)} sub={`HOT ${aula.fichas.interesse.hot} · WARM ${aula.fichas.interesse.warm} · COLD ${aula.fichas.interesse.cold}`} />
            <RStat rot="Formação" chave="conv_backend" num={aula.backend.conv} valor={fN(aula.backend.vendas)} sub={aula.backend.conv === null ? "sem vendas lançadas" : `${fP(aula.backend.conv)} dos ingressos`} />
          </div>
        </section>
      </div>

      <div className="par">
        <Bloco titulo={`Captação da ${cap.ciclo.nome}`} sub="Do anúncio ao ingresso, com a régua do método em cada passagem.">
          <Funil etapas={etapasFunil(cap).slice(0, 6)} />
        </Bloco>
        <Bloco titulo={`Evento da ${aula.ciclo.nome}`} sub="Do ingresso à Formação.">
          <Funil etapas={etapasFunil(aula).slice(5)} />
        </Bloco>
      </div>

      <div className="par">
        <Bloco titulo="Leitura da captação" sub="O que está pegando e o que fazer agora.">
          {lc.length === 0 ? <div className="vazio">Nada fora da régua.</div> : lc.map((a, i) => <Alerta key={i} a={a} />)}
        </Bloco>
        <Bloco titulo="Leitura do evento" sub="Aulas, fichas, grupo e carrinho.">
          {la.length === 0 ? <div className="vazio">Nada fora da régua.</div> : la.map((a, i) => <Alerta key={i} a={a} />)}
        </Bloco>
      </div>

      <div className="par">
        <Bloco titulo="Verba e vendas da captação" sub="A linha é o gasto por dia. As barras são os ingressos vendidos no dia.">
          <Area pontos={tc.serie.map((s) => ({ x: ddmm(s.dia), y: s.gasto }))} barras={tc.serie.map((s) => ({ x: s.dia, y: s.ingressos }))} fmt={(n) => `R$${fN(n)}`} />
        </Bloco>
        <Bloco titulo="Presença nas aulas" sub="Barra: ao vivo. Tracejado: esperado pela régua.">
          <Barras itens={aula.aulas.map((a) => ({ x: a.rotulo.replace("Apresentação (dom)", "Domingo"), y: a.presenca || 0, meta: a.esperado }))} />
        </Bloco>
      </div>

      <div className="dica">
        <b>Regras que impedem besteira</b>
        <ul style={{ margin: "8px 0 0", paddingLeft: 16 }}>
          {REGRAS_OURO.map((r) => <li key={r} style={{ marginBottom: 4 }}>{r}</li>)}
        </ul>
      </div>
    </>
  );
}

// ============================================================
// TRÁFEGO
// ============================================================
function Trafego({ d }: { d: Dados }) {
  const t = d.trafego;
  const v = d.vendas;
  const [met, setMet] = useState<"gasto" | "ingressos" | "cpa" | "lpv">("gasto");
  const pontos = t.serie.map((s) => ({
    x: ddmm(s.dia),
    y: met === "gasto" ? s.gasto : met === "ingressos" ? s.ingressos : met === "lpv" ? s.lpv : s.ingressos ? s.gasto / s.ingressos : 0,
  }));
  const fmt = met === "ingressos" || met === "lpv" ? (n: number) => fN(n) : (n: number) => `R$${fN(n)}`;
  const cacMax = d.financeiro.cacMax;
  return (
    <>
      <Cab turma={tag(d)} rot="Tráfego" titulo="Captação na Meta" sub={`Campanhas HWK. ${janela(d)}`} />
      {!d.fontes.meta.ok && <div className="aviso ruim">Meta: {d.fontes.meta.erro}</div>}
      <div className="g4">
        <Kpi rotulo="Investido" valor={fR(t.gasto)} sub={`${t.dias} dias com gasto`} />
        <Kpi rotulo="Verba média por dia" valor={fR(t.verbaDia)} regua="verba_dia" valorNum={t.verbaDia} />
        <Kpi rotulo="ROAS do anúncio" valor={fX(v.roasPago)} regua="roas_captacao" valorNum={v.roasPago} sub={`${fR(v.receitaPaga, 0)} vindos do anúncio · com a bio ${fX(v.roas)}`} />
        <Kpi rotulo="Custo por ingresso" valor={fR(v.cpa)} regua="cpa_ingresso" valorNum={v.cpa} sub={cacMax !== null ? `CAC máximo pela fórmula: ${fR(cacMax)}` : undefined} />
      </div>
      <div className="g-8-4">
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <Bloco
            titulo="Desempenho no período"
            sub="A métrica que importa, dia a dia."
            acao={
              <div className="seg">
                {(["gasto", "ingressos", "cpa", "lpv"] as const).map((m) => (
                  <button key={m} className={met === m ? "on" : ""} onClick={() => setMet(m)}>{{ gasto: "Investido", ingressos: "Ingressos", cpa: "CPA", lpv: "Visitas" }[m]}</button>
                ))}
              </div>
            }
          >
            <Area pontos={pontos} fmt={fmt} />
          </Bloco>
          <Bloco titulo="Vendas por página" sub="A letra do sck da Hotmart indica a variação (a, b, c) de /hermes-week.">
            <Barras itens={v.porPagina.map((p) => ({ x: p.variante === "?" ? "sem sck" : `/${p.variante.toLowerCase()}`, y: p.vendas }))} />
            <div className="dica">Para julgar uma página o método espera <b>5.000 visitas</b> nela. Duas páginas novas por semana já é nível bom.</div>
          </Bloco>
          <Bloco titulo="Distribuição de conteúdo" sub="Verba fora da captação, para aquecer o público (C1, C2 e C3).">
            <LinhaRegua chave="distribuicao" valor={t.distribuicaoPct} sub={t.distribuicaoPct === null ? "lance o gasto do impulsionamento em Lançar números" : `${fR(d.financeiro.distribuicao)} na distribuição`} />
          </Bloco>
        </div>
        <Bloco titulo="Anúncio, página e checkout" sub="Se este bloco está ruim, o problema não é o criativo.">
          <LinhaRegua chave="ctr" valor={t.ctr} sub={`${fN(t.impressoes)} impressões`} />
          <LinhaRegua chave="cpm" valor={t.cpm} sub={`alcance ${fN(t.alcance)}`} />
          <LinhaRegua chave="frequencia" valor={t.frequencia} sub="cerca de 11 contatos antes da compra" />
          <LinhaRegua chave="connect_rate" valor={t.connect} sub={`${fN(t.lpv)} de ${fN(t.cliquesLink)} cliques`} />
          <LinhaRegua chave="pagina_checkout" valor={t.pagCheckout} sub={`${fN(t.ic)} finalizações`} />
          <LinhaRegua chave="custo_ic" valor={t.custoIc} />
          <LinhaRegua chave="checkout_compra" valor={t.checkoutCompra} sub={`${fN(t.vendasPagas)} compras pelo anúncio`} />
          <LinhaRegua chave="conv_pagina" valor={t.convPagina} sub={t.lpv < 5000 ? `${fN(t.lpv)} de 5.000 visitas para julgar` : "amostra suficiente"} />
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
  return (
    <>
      <Cab turma={tag(d)} rot="Criativos" titulo="O que repetir e o que trocar" sub="As vendas vêm da Hotmart, atribuídas pelo ID do anúncio no sck. O pixel não serve aqui: ele conta cada bump como uma compra." />
      <div className="g4">
        <Kpi rotulo="Criativos ativos" valor={fN(d.batelada.ativos)} regua="batelada" valorNum={d.batelada.ativos} sub={`${d.batelada.estatico} estáticos · ${d.batelada.video} vídeos · ${d.batelada.carrossel} carrosséis`} />
        <Kpi rotulo="Novos em 7 dias" valor={fN(d.batelada.novos7d)} regua="hooks_novos" valorNum={d.batelada.novos7d} />
        <Kpi rotulo="Hook rate médio" valor={fP(media("hook"))} regua="hook_rate" valorNum={media("hook")} sub="vídeos" />
        <Kpi rotulo="Hold rate médio" valor={fP(media("hold"))} regua="hold_rate" valorNum={media("hold")} sub="vídeos" />
      </div>
      <div className="g-8-4">
        <div>
          <div className="filtros">
            {(["todos", "video", "estatico", "carrossel", "vendendo", "parados"] as const).map((f) => (
              <button key={f} className={`filtro ${filtro === f ? "on" : ""}`} onClick={() => setFiltro(f)}>
                {{ todos: "Todos", video: "Vídeos", estatico: "Estáticos", carrossel: "Carrosséis", vendendo: "Vendendo", parados: "Sem venda com volume" }[f]} <b>{cont(f)}</b>
              </button>
            ))}
          </div>
          {lista.length === 0 ? <div className="card vazio">Nenhum criativo neste filtro.</div> : (
            <div className="grade-crt">
              {lista.map((c) => (
                <div className="card crt" key={c.adId}>
                  <div className="crt-capa">
                    {c.thumb && /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.thumb} alt="" referrerPolicy="no-referrer" loading="lazy" />}
                    <span className={`crt-tag c-${c.veredito.cor}`}>{c.veredito.rotulo}</span>
                    <span className="crt-fmt">{{ video: "Vídeo", estatico: "Estático", carrossel: "Carrossel", outro: "Outro" }[c.formato]}{c.status !== "ACTIVE" ? " · pausado" : ""}</span>
                  </div>
                  <div className="crt-corpo">
                    <div className="crt-nome" title={c.nome}>{c.nome}</div>
                    <div className="crt-meta">
                      <div><small>Gasto</small><b className="num">{fR(c.gasto, 0)}</b></div>
                      <div><small>Vendas</small><b className="num brass">{c.vendas}</b></div>
                      <div><small>CPA</small><b className="num">{fR(c.cpa, 0)}</b></div>
                      <div><small>CTR</small><b className={`num c-${avaliar(REGUAS[c.formato === "video" ? "ctr" : "ctr_estatico"], c.ctr)}`}>{fP(c.ctr, 2)}</b></div>
                      {c.formato === "video" ? (
                        <>
                          <div><small>Hook</small><b className={`num c-${avaliar(REGUAS.hook_rate, c.hook)}`}>{fP(c.hook)}</b></div>
                          <div><small>Hold</small><b className={`num c-${avaliar(REGUAS.hold_rate, c.hold)}`}>{fP(c.hold)}</b></div>
                        </>
                      ) : (
                        <>
                          <div><small>Impressões</small><b className="num">{fN(c.impressoes)}</b></div>
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
          <Bloco titulo="Os mais baratos" sub="Quem entrega ingresso por menos.">
            {ranking.length === 0 ? <div className="vazio">Nenhum criativo com venda atribuída ainda.</div> : ranking.map((c, i) => (
              <div key={c.adId} className="rank">
                <span className="n">{i + 1}</span>
                <div className="th">{c.thumb && /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.thumb} alt="" referrerPolicy="no-referrer" />}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="crt-nome">{c.nome}</div>
                  <div className="dim3 num" style={{ fontSize: 12 }}>{c.vendas} ingressos a {fR(c.cpa)} cada</div>
                </div>
              </div>
            ))}
          </Bloco>
          <div style={{ height: 22 }} />
          <Bloco titulo="As três taxas do vídeo" sub="Fórmulas da aula 4.">
            <LinhaRegua chave="hook_rate" valor={media("hook")} sub="views de 3s ÷ impressões" />
            <LinhaRegua chave="hold_rate" valor={media("hold")} sub="views de 75% ÷ views de 3s" />
            <LinhaRegua chave="body_rate" valor={media("body")} sub="vendas ÷ views de 75%" />
            <div className="dica">Hook baixo: troque o gancho e mantenha o corpo. Hold baixo: mexa no meio. Body baixo: mexa no CTA e no final. Vídeo de <b>1 a 3 minutos</b>.</div>
          </Bloco>
        </div>
      </div>
    </>
  );
}

// ============================================================
// INGRESSOS
// ============================================================
function Vendas({ d }: { d: Dados }) {
  const v = d.vendas;
  const pior = Math.min(...v.porDia.filter((x) => x.ingressos > 0).map((x) => x.ingressos), Infinity);
  const domingos = v.porDia.filter((x) => x.dow === 0 && x.ingressos > 0);
  const pagamentos = Object.entries(v.pagamento).sort((a, b) => b[1] - a[1]);
  return (
    <>
      <Cab turma={tag(d)} rot="Vendas" titulo="Ingressos e order bumps" sub={`Hotmart. ${janela(d)}`} />
      <div className="g4">
        <Kpi rotulo="Ingressos" valor={`${fN(v.ingressos)} de ${fN(v.meta)}`} regua="ingressos" valorNum={v.ingressos} sub={`${fP(v.meta ? (v.ingressos / v.meta) * 100 : null, 0)} da meta`} />
        <Kpi rotulo="Ticket médio" valor={fR(v.ticketMedio)} sub={`líquido ${fR(v.ticketMedioLiquido)} · taxa da Hotmart ${fP(v.taxaPlataforma !== null ? v.taxaPlataforma * 100 : null)}`} />
        <Kpi rotulo="Pix ou boleto em aberto" valor={fN(v.pendentes)} sub={`${v.expirados} expiraram. O Pix não dispara bump sozinho.`} />
        <Kpi rotulo="Abandonos recuperados" valor={`${v.recuperados} de ${v.abandonos}`} regua="recuperacao" valorNum={v.abandonos ? (v.recuperados / v.abandonos) * 100 : null} />
      </div>
      <div className="g2">
        <Bloco titulo="Order bumps" sub="Take rate: quantos compradores do ingresso levaram o bump.">
          {v.bumps.map((b) => (
            <LinhaRegua key={b.id} chave="take_bump" nome={`${b.nome} (R$${b.preco})`} valor={b.take} sub={`${b.vendas} vendas · ${fR(b.receita)}`} />
          ))}
          <div className="dica">O método não dá meta de take rate. A régua de 30% é uma referência complementar e só vale depois de 20 vendas.</div>
        </Bloco>
        <Bloco titulo="Saúde da venda" sub="O que aconteceu depois de vendido.">
          <LinhaRegua chave="reembolso" valor={v.ingressos ? (v.reembolsos / v.ingressos) * 100 : null} sub={`${v.reembolsos} reembolsos · ${v.pedidosReembolso} pedidos em aberto · ${v.chargebacks} chargebacks · ${v.cancelados} cancelados`} />
          <div className="regua">
            <div className="regua-top"><div className="regua-nome">Origem do comprador</div></div>
            <div className="num dim" style={{ marginTop: 8 }}>Anúncio <b className="brass">{v.origem.anuncio}</b> · link da bio <b className="brass">{v.origem.bio}</b> · outra origem <b className="brass">{v.origem.outro}</b></div>
          </div>
          <div className="regua">
            <div className="regua-top"><div className="regua-nome">Forma de pagamento</div></div>
            <div className="num dim" style={{ marginTop: 8 }}>{pagamentos.map(([k, n]) => `${k.replace("_", " ").toLowerCase()} ${n}`).join(" · ") || "—"}</div>
          </div>
          <div className="regua">
            <div className="regua-top"><div className="regua-nome">Entraram na área de membros</div><div className="regua-val num">{v.primeiroAcesso}</div></div>
          </div>
        </Bloco>
      </div>
      <div className="g2">
        <Bloco titulo="Ingressos por dia" sub="Com o evento na segunda, o domingo vende quase o dobro do pior dia.">
          <Barras itens={v.porDia.map((x) => ({ x: `${DOW3[x.dow]} ${x.dia.slice(8)}`, y: x.ingressos }))} destaque={(i) => v.porDia[i].dow === 0} />
          {domingos.length > 0 && pior < Infinity && (
            <div className="dica">Domingo: <b>{domingos.map((x) => x.ingressos).join(", ")}</b>. Pior dia com venda: <b>{pior}</b>. A régua do método é domingo igual a 2x o pior dia.</div>
          )}
        </Bloco>
        <Bloco titulo="Quando as pessoas compram" sub="Dia da semana por hora, no horário de Brasília.">
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
      <Cab turma={tag(d)} rot="Onboarding" titulo="Grupo, mensageria e fichas" sub="Os passos do método depois da compra: primeiro a ficha, depois o grupo, depois responder OK." />
      {!d.fontes.evolution.ok && <div className="aviso">WhatsApp: {d.fontes.evolution.erro}. Lance o número de membros em Lançar números.</div>}
      <div className="g4">
        <Kpi rotulo="Ficha de matrícula" valor={`${f.matriculas} de ${d.vendas.ingressos}`} sub={`${fP(f.matriculaPct)} dos compradores. O método não dá taxa-alvo.`} />
        <Kpi rotulo="No grupo da turma" valor={g.membros === null ? "—" : fN(g.membros)} sub={g.membros === null ? "sem leitura do WhatsApp" : `${fP(g.entradaPct)} dos compradores · ${g.fonte === "manual" ? "lançado à mão" : "ao vivo"}`} />
        <Kpi rotulo="Ficha de interesse" valor={fN(f.interesse.total)} regua="ficha_interesse" valorNum={f.interesse.total ? f.interessePct : null} sub={`${fP(f.interessePct)} ${f.interesseBase}`} />
        <Kpi rotulo="Fichas HOT" valor={fN(f.interesse.hot)} sub={`WARM ${f.interesse.warm} · COLD ${f.interesse.cold}`} />
      </div>
      <div className="g2">
        <Bloco titulo="Mensageria do grupo" sub={g.nome ? g.nome : "O grupo do ciclo não está cadastrado em grupos_ciclo."}>
          <LinhaRegua chave="entrega_msg" valor={entregues} sub={`${g.disparos.enviados} enviadas · ${g.disparos.atrasados} atrasadas · ${g.disparos.expirados} expiradas`} />
          <div className="regua num dim">
            Programadas <b className="brass">{g.disparos.total}</b> · aguardando <b className="brass">{g.disparos.pendentes}</b> · vetadas pelo Red <b className="brass">{g.disparos.vetados}</b>
          </div>
          <div className="dica">Cadência do método: 24 horas antes, 1 hora antes, link 15 minutos antes, recap, replay e gancho da próxima aula. No máximo 4 mensagens por dia no grupo. Mais mensagem na semana significa menos abertura na segunda.</div>
        </Bloco>
        <Bloco titulo="Ficha de interesse" sub="Abre no pré-pitch da Aula 4, repete na Aula 5 e fecha no domingo.">
          <LinhaRegua chave="ficha_interesse" valor={f.interesse.total ? f.interessePct : null} sub={f.interesseBase} />
          <Barras itens={[{ x: "HOT", y: f.interesse.hot }, { x: "WARM", y: f.interesse.warm }, { x: "COLD", y: f.interesse.cold }]} />
          <div className="dica">Quem preenche recebe o carrinho às <b>6h50</b>, 10 minutos antes do geral. A planilha do método mostra 40% (bom) e 23% (abaixo da régua).</div>
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
      <Cab turma={tag(d)} rot="Comparecimento" titulo="As cinco aulas e a apresentação" sub="Presença ao vivo durante a semana. Os views únicos só valem na semana seguinte." />
      {!lancado && (
        <div className="aviso info">As aulas ficam no YouTube não listado e a presença não tem leitura automática. Lance o pico ao vivo de cada aula em <button className="btn-s" onClick={() => ir("lancar")}>Lançar números</button></div>
      )}
      <div className="g-8-4">
        <Bloco titulo="Curva de presença" sub="A barra é a presença ao vivo. O tracejado é o esperado pela régua: Aula 1 em 30% dos compradores, depois menos 30%, 15%, 15%, 15% e mais 30% no domingo.">
          <Barras itens={d.aulas.map((a) => ({ x: a.rotulo.replace("Apresentação (dom)", "Domingo"), y: a.presenca || 0, meta: a.esperado }))} />
          <div className="legenda"><span><i style={{ background: "#ece6d8", opacity: 0.6, height: 8 }} />ao vivo</span><span><i style={{ background: "#e4cd97" }} />esperado</span></div>
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
            <tr><th>Aula</th><th>Data</th><th className="dir">Ao vivo</th><th className="dir">Dos compradores</th><th className="dir">Esperado</th><th className="dir">Retenção</th><th className="dir">Meta de retenção</th><th className="dir">Únicos</th><th className="dir">Duração</th></tr>
          </thead>
          <tbody>
            {d.aulas.map((a) => {
              const corRet = a.retencao === null || a.retencaoMeta === null ? "neutro" : a.retencao >= a.retencaoMeta - 5 ? "verde" : "vermelho";
              const corDur = a.duracao === null ? "neutro" : a.duracao <= (a.n === 4 ? 75 : 50) ? "verde" : "amarelo";
              return (
                <tr key={a.n}>
                  <td><b>{a.rotulo}</b></td>
                  <td className="dim">{ddmm(a.data)}</td>
                  <td className="dir num">{fN(a.presenca)}</td>
                  <td className="dir num">{fP(a.presencaPct)}</td>
                  <td className="dir num dim3">{fN(a.esperado)}</td>
                  <td className={`dir num c-${corRet}`}>{fP(a.retencao)}</td>
                  <td className="dir num dim3">{a.retencaoMeta ? fP(a.retencaoMeta, 0) : "—"}</td>
                  <td className="dir num">{fN(a.unicos)} {a.unicosPct !== null && <span className="dim3">({fP(a.unicosPct, 0)})</span>}</td>
                  <td className={`dir num c-${corDur}`}>{a.duracao !== null ? `${a.duracao} min` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="dica">Marcos de vitória: <b>Aula 3</b> (marco 1) e <b>Aula 5</b> (marco 2). A Aula 4 é o pré-pitch, sem preço, e abre a ficha. Aula de 40 a 50 minutos (a 4 vai a 60, mais 15 de pré-pitch). À noite o método mede cerca de 50% de presença na Aula 1; de manhã, 35%, mas converte mais.</div>
    </>
  );
}

// ============================================================
// CARRINHO (Formação)
// ============================================================
function Formacao({ d, ir }: { d: Dados; ir: (a: Aba) => void }) {
  const b = d.backend;
  const c = b.curva;
  return (
    <>
      <Cab turma={tag(d)} rot="Backend" titulo="Formação Arquiteto de Agentes" sub={`Apresentação em ${dmh(d.ciclo.pitch)}. Carrinho de ${dmh(d.ciclo.carrinhoAbre)} às ${dmh(d.ciclo.carrinhoFecha).split(" ")[1]}. R$${fN(b.preco)}.`} />
      {b.fonte === null && (
        <div className="aviso info">A Formação ainda não tem produto ligado ao painel. Quando existir na Hotmart, informe o ID em <button className="btn-s" onClick={() => ir("lancar")}>Lançar números</button> e as vendas passam a entrar sozinhas, com a curva do carrinho.</div>
      )}
      <div className="g4">
        <Kpi rotulo="Vendas da Formação" valor={fN(b.vendas)} sub={b.fonte === "manual" ? "lançado à mão" : b.fonte === "hotmart" ? "Hotmart, ao vivo" : "sem fonte"} />
        <Kpi rotulo="Conversão sobre ingressos" valor={fP(b.conv)} regua="conv_backend" valorNum={b.conv} sub="abaixo de 5% o método manda regravar o evento" />
        <Kpi rotulo="Presentes no domingo" valor={fN(d.aulas[5].presenca)} sub={`esperado ${fN(d.aulas[5].esperado)} (Aula 5 mais 30%) · conversão sobre presentes ${fP(b.convPresentes)}`} />
        <Kpi rotulo="HOT que compraram" valor={fP(b.hotCompraram)} regua="hot_compra" valorNum={b.hotCompraram} sub={`conversão sobre as fichas ${fP(b.convFichas)}`} />
      </div>
      <div className="g2">
        <Bloco titulo="Curva do carrinho" sub="70% nos 10 primeiros minutos, 90% na 1ª hora e 90% a 95% no dia 1.">
          {c ? (
            <>
              <LinhaRegua chave="vendas_d1" nome="Vendas na 1ª hora" valor={(c.ate1h / c.total) * 100} sub={`${c.ate1h} de ${c.total}`} />
              <div className="regua num dim">Janela da ficha (6h50 às 7h): <b className="brass">{c.ate10min}</b> · dia 1: <b className="brass">{c.d1}</b> ({fP((c.d1 / c.total) * 100, 0)}) · depois do dia 1: <b className="brass">{c.total - c.d1}</b></div>
              <Barras itens={b.porHora.map((h) => ({ x: h.hora, y: h.vendas }))} />
            </>
          ) : (
            <div className="vazio">A curva aparece quando as vendas vierem da Hotmart.</div>
          )}
        </Bloco>
        <Bloco titulo="Escada de bônus da segunda" sub="Como o método monta a urgência real.">
          <div className="tab-wrap">
            <table className="tab">
              <tbody>
                <tr><td><b>6h50 às 7h</b></td><td className="dim">Só quem preencheu a ficha, com o melhor bônus.</td></tr>
                <tr><td><b>7h às 8h</b></td><td className="dim">Abre para todos com o pacote mais forte.</td></tr>
                <tr><td><b>8h às 10h</b></td><td className="dim">Cai um bônus.</td></tr>
                <tr><td><b>10h até fechar</b></td><td className="dim">Preço do carrinho, sem bônus de janela.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="dica">Desconto de 10% a 50% sobre a âncora em ticket baixo. O link vai só pela Hotmart, enviado pelo mesmo número do grupo. Prova social a cada 2 ou 3 horas.</div>
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
      <Cab turma={tag(d)} rot="Financeiro" titulo="O lançamento fecha a conta?" sub="Front (ingresso e bumps) mais a Formação, contra tráfego, distribuição e custos." />
      <div className="g4">
        <Kpi rotulo="Investimento total" valor={fR(f.investimento)} sub={`tráfego ${fR(f.trafego, 0)} · distribuição ${fR(f.distribuicao, 0)} · outros ${fR(f.outros, 0)}`} />
        <Kpi rotulo="Receita líquida" valor={fR(f.receitaLiquida)} sub={`bruta ${fR(f.receitaBruta)}`} />
        <Kpi rotulo="Lucro" valor={fR(f.lucro)} regua="lucro" valorNum={f.lucro} sub={`margem ${fP(f.margem)}`} />
        <Kpi rotulo="ROAS do lançamento" valor={fX(f.roasTotal)} regua="roas_total" valorNum={f.roasTotal} />
      </div>
      <div className="g2">
        <Bloco titulo="De onde vem o dinheiro">
          <div className="tab-wrap">
            <table className="tab">
              <thead><tr><th>Linha</th><th className="dir">Vendas</th><th className="dir">Bruto</th><th className="dir">Líquido</th></tr></thead>
              <tbody>
                <tr><td>Ingresso R$62</td><td className="dir num">{v.ingressos}</td><td className="dir num">{fR(v.receitaIngresso)}</td><td className="dir num">{fR(v.liquidoIngresso)}</td></tr>
                {v.bumps.map((b) => <tr key={b.id}><td>{b.nome}</td><td className="dir num">{b.vendas}</td><td className="dir num">{fR(b.receita)}</td><td className="dir num">{fR(b.liquido)}</td></tr>)}
                <tr><td>Formação R${fN(d.backend.preco)}</td><td className="dir num">{fN(d.backend.vendas)}</td><td className="dir num">{fR(d.backend.receita)}</td><td className="dir num">{fR(d.backend.liquido)}</td></tr>
                <tr><td><b>Total</b></td><td /><td className="dir num"><b className="brass">{fR(f.receitaBruta)}</b></td><td className="dir num"><b className="brass">{fR(f.receitaLiquida)}</b></td></tr>
              </tbody>
            </table>
          </div>
          <div className="dica">O líquido é a comissão do produtor que a Hotmart informa no webhook. Taxa média observada: {fP(v.taxaPlataforma !== null ? v.taxaPlataforma * 100 : null)}.</div>
        </Bloco>
        <Bloco titulo="Até quanto dá para pagar por ingresso" sub="Fórmula do CAC máximo da aula 4.">
          <div className="serif num brass" style={{ fontSize: 56, lineHeight: 1 }}>{fR(f.cacMax)}</div>
          <div className="dim3" style={{ fontSize: 12.5, margin: "10px 0 22px" }}>{f.cacMaxBase}</div>
          <LinhaRegua chave="cpa_ingresso" valor={v.cpa} nome="CPA atual" sub={f.cacMax !== null && v.cpa !== null ? (v.cpa <= f.cacMax ? "abaixo do CAC máximo: pode escalar" : "acima do CAC máximo: não escale") : undefined} />
          <div className="dica">O método aceita ROAS de captação perto de 1 porque quem paga o lançamento é a Formação. Mas a meta do aluno é <b>pelo menos R$20 mil líquidos por lançamento</b>, e o ROAS do lançamento inteiro não pode ficar negativo.</div>
        </Bloco>
      </div>
    </>
  );
}

// ============================================================
// COMPARATIVO
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
  const colunas: { k: keyof Resumo; rot: string; fmt: (n: number | null) => string; regua?: string }[] = useMemo(
    () => [
      { k: "ingressos", rot: "Ingressos", fmt: (n) => fN(n), regua: "ingressos" },
      { k: "gasto", rot: "Investido", fmt: (n) => fR(n, 0) },
      { k: "roasPago", rot: "ROAS anúncio", fmt: fX, regua: "roas_captacao" },
      { k: "cpa", rot: "CPA", fmt: (n) => fR(n), regua: "cpa_ingresso" },
      { k: "cpm", rot: "CPM", fmt: (n) => fR(n), regua: "cpm" },
      { k: "ctr", rot: "CTR", fmt: (n) => fP(n, 2), regua: "ctr" },
      { k: "connect", rot: "Carregamento", fmt: (n) => fP(n), regua: "connect_rate" },
      { k: "pagCheckout", rot: "Taxa de checkout", fmt: (n) => fP(n), regua: "pagina_checkout" },
      { k: "checkoutCompra", rot: "Conversão do checkout", fmt: (n) => fP(n), regua: "checkout_compra" },
      { k: "convPagina", rot: "Conversão da página", fmt: (n) => fP(n), regua: "conv_pagina" },
      { k: "presencaA1", rot: "Aula 1", fmt: (n) => fP(n), regua: "presenca_a1" },
      { k: "ficha", rot: "Ficha", fmt: (n) => fP(n), regua: "ficha_interesse" },
      { k: "convBackend", rot: "Conversão final", fmt: (n) => fP(n), regua: "conv_backend" },
      { k: "lucro", rot: "Lucro", fmt: (n) => fR(n, 0), regua: "lucro" },
    ],
    [],
  );
  return (
    <>
      <Cab rot="Comparativo" titulo="Turma contra turma" sub="As colunas da planilha do método. Uma máquina madura varia cerca de 5% entre semanas." />
      {erro && <div className="aviso ruim">{erro}</div>}
      {!res ? <div className="vazio">Montando o histórico das turmas.</div> : (
        <div className="card tab-wrap">
          <table className="tab">
            <thead><tr><th>Turma</th>{colunas.map((c) => <th key={c.k} className="dir">{c.rot}</th>)}</tr></thead>
            <tbody>
              {res.map((r, i) => (
                <tr key={r.d0} className={r.d0 === atual ? "atual" : ""}>
                  <td><b>{r.nome}</b></td>
                  {colunas.map((c) => {
                    const val = r[c.k] as number | null;
                    const ant = i > 0 ? (res[i - 1][c.k] as number | null) : null;
                    const delta = val !== null && ant ? ((val - ant) / Math.abs(ant)) * 100 : null;
                    const cor = c.regua ? avaliar(REGUAS[c.regua], val) : "neutro";
                    return (
                      <td key={c.k} className={`dir num ${cor === "verde" ? "" : `c-${cor}`}`}>
                        {c.fmt(val)}
                        {delta !== null && Math.abs(delta) >= 0.5 && <div className="dim3" style={{ fontSize: 10.5 }}>{delta > 0 ? "+" : "−"}{fN(Math.abs(delta), 0)}%</div>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="dica">Confirmar uma tendência pede duas turmas com a mesma variável. Uma otimização por semana: 1% a 2% de ganho semanal mais que dobra em um ano.</div>
    </>
  );
}

// ============================================================
// LANÇAR NÚMEROS
// ============================================================
function Lancar({ lista, padrao, salvo }: { lista: Turma[]; padrao: string; salvo: () => void }) {
  const [alvo, setAlvo] = useState(padrao);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [lendo, setLendo] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const turma = lista.find((c) => c.d0 === alvo);

  useEffect(() => {
    let vivo = true;
    fetch(`/api/dashboard/manual?ciclo=${alvo}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (vivo && j.valores) setVals(Object.fromEntries(Object.entries(j.valores as Record<string, number>).map(([k, v]) => [k, String(v)])));
      })
      .finally(() => vivo && setLendo(false));
    return () => {
      vivo = false;
    };
  }, [alvo]);

  const grupos: { titulo: string; sub: string; campos: { k: string; rot: string; ph?: string }[] }[] = useMemo(
    () => [
      { titulo: "Presença ao vivo", sub: "Pico simultâneo no YouTube durante a aula.", campos: [1, 2, 3, 4, 5].map((n) => ({ k: `presenca_a${n}`, rot: `Aula ${n}` })).concat([{ k: "presenca_a6", rot: "Apresentação de domingo" }]) },
      { titulo: "Views únicos", sub: "Espectadores únicos do vídeo, medidos na semana seguinte.", campos: [1, 2, 3, 4, 5].map((n) => ({ k: `unicos_a${n}`, rot: `Aula ${n}` })).concat([{ k: "unicos_a6", rot: "Apresentação" }]) },
      { titulo: "Duração das aulas, em minutos", sub: "A meta é de 40 a 50 minutos.", campos: [1, 2, 3, 4, 5, 6].map((n) => ({ k: `duracao_a${n}`, rot: n === 6 ? "Apresentação" : `Aula ${n}` })) },
      { titulo: "Dinheiro e metas", sub: "O que a Meta e a Hotmart não informam sozinhas.", campos: [
        { k: "verba_distribuicao", rot: "Verba de distribuição (R$)", ph: "impulsionamentos C1, C2 e C3" },
        { k: "custos_extras", rot: "Outros custos (R$)", ph: "ferramentas e equipe" },
        { k: "meta_ingressos", rot: "Meta de ingressos", ph: "100" },
        { k: "roas_alvo", rot: "ROAS-alvo do CAC máximo", ph: "3" },
        { k: "membros_grupo", rot: "Membros no grupo", ph: "se o WhatsApp não ler" },
      ] },
      { titulo: "Formação Arquiteto de Agentes", sub: "Com o ID da Hotmart, as vendas entram sozinhas.", campos: [
        { k: "produto_formacao_id", rot: "ID do produto na Hotmart" },
        { k: "preco_formacao", rot: "Preço (R$)", ph: "997" },
        { k: "vendas_formacao", rot: "Vendas, se ainda não houver ID" },
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
    const r = await fetch("/api/dashboard/manual", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ciclo: alvo, valores }) });
    const j = await r.json();
    setSalvando(false);
    setToast(j.ok ? "Números salvos" : `Não salvou: ${j.error}`);
    setTimeout(() => setToast(null), 2500);
    if (j.ok) salvo();
  }
  return (
    <>
      <Cab rot="Lançamento manual" titulo="Lançar números" sub="Só o que não tem leitura automática. Escolha a turma e lance os números dela." />
      <div className="filtros" style={{ alignItems: "center" }}>
        <span className="rot" style={{ marginRight: 8 }}>Turma</span>
        {[...lista].reverse().map((c) => (
          <button key={c.d0} className={`filtro ${alvo === c.d0 ? "on" : ""}`} onClick={() => { if (c.d0 !== alvo) { setLendo(true); setAlvo(c.d0); } }}>{c.nome}</button>
        ))}
      </div>
      <div className="dica" style={{ marginTop: 0, marginBottom: 22 }}>
        Presença, views únicos, duração e membros do grupo valem para a turma que está em aula. Verba de distribuição, outros custos e meta de ingressos valem para a turma em captação.
        {turma && <> Você está lançando para a <b>{turma.nome}</b>.</>}
      </div>
      {grupos.map((g) => (
        <div key={g.titulo} style={{ marginBottom: 22, opacity: lendo ? 0.5 : 1 }}>
          <Bloco titulo={g.titulo} sub={g.sub}>
            <div className="form-grade">
              {g.campos.map((c) => (
                <div className="campo" key={c.k}>
                  <label htmlFor={`hw-${c.k}`}>{c.rot}</label>
                  <input id={`hw-${c.k}`} inputMode="decimal" value={vals[c.k] ?? ""} placeholder={c.ph || ""} onChange={(e) => setVals({ ...vals, [c.k]: e.target.value })} />
                </div>
              ))}
            </div>
          </Bloco>
        </div>
      ))}
      <button className="btn" onClick={salvar} disabled={salvando || lendo}>{salvando ? "Salvando" : "Salvar números da turma"}</button>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

// ============================================================
// RÉGUAS DO MÉTODO
// ============================================================
function Reguas() {
  const lista = Object.values(REGUAS);
  const [origem, setOrigem] = useState<"todas" | "metodo" | "squad" | "red">("todas");
  return (
    <>
      <Cab rot="Método" titulo="Réguas do método" sub="Cada meta do painel, de onde ela veio e o que ela quer dizer." />
      <div className="filtros">
        {(["todas", "metodo", "squad", "red"] as const).map((o) => (
          <button key={o} className={`filtro ${origem === o ? "on" : ""}`} onClick={() => setOrigem(o)}>
            {{ todas: "Todas", metodo: "Do método", squad: "Complementares", red: "Decisão do Red" }[o]} <b>{lista.filter((r) => o === "todas" || r.origem === o).length}</b>
          </button>
        ))}
      </div>
      <div className="g3" style={{ alignItems: "start" }}>
        {lista.filter((r) => origem === "todas" || r.origem === origem).map((r) => (
          <div className="card" key={r.chave} style={{ padding: "24px 26px" }}>
            <div className="rot" style={{ marginBottom: 12 }}>{r.origem === "metodo" ? "Do método" : r.origem === "red" ? "Decisão do Red" : "Referência complementar"}</div>
            <div className="serif" style={{ fontSize: 22, lineHeight: 1.2 }}>{r.nome}</div>
            <div className="brass num" style={{ fontWeight: 600, margin: "10px 0 2px" }}>{metaTexto(r) || "sem número"}</div>
            <ReguaDica r={r} />
          </div>
        ))}
      </div>
      <div className="dica"><b>Sem número em nenhuma fonte</b>, então o painel mostra o dado sem semáforo: CPC, take rate de cada bump pelo método, entrada no grupo, preenchimento da ficha de matrícula, vendas por hora, chargeback e LTV.</div>
    </>
  );
}
