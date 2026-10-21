"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Eye, EyeOff } from "lucide-react";
import "./painel.css";
import type { Dados, Resumo, RespInvestidor, LinhaInvestidor, BaseSimulador, Recorte } from "./tipos";
import { REGUAS, REGRAS_OURO, avaliar, PRECO_INGRESSO, PRODUTOS, ROAS_ESCALA, PASSO_MAX_VERBA } from "./metas";
import { Kpi, LinhaRegua, Bloco, Alerta, Funil, Area, Barras, Calor, Ponto, ReguaDica, fN, fR, fP, fX, metaTexto } from "./ui";

type Aba = "geral" | "trafego" | "criativos" | "vendas" | "grupo" | "aulas" | "formacao" | "financeiro" | "investidor" | "comparativo" | "lancar" | "reguas";

const NAV: { id: Aba; rot: string; sepDepois?: boolean }[] = [
  { id: "geral", rot: "Visão geral", sepDepois: true },
  { id: "trafego", rot: "Tráfego" },
  { id: "criativos", rot: "Criativos" },
  { id: "vendas", rot: "Ingressos", sepDepois: true },
  { id: "grupo", rot: "Grupo e fichas" },
  { id: "aulas", rot: "Aulas" },
  { id: "formacao", rot: "Carrinho", sepDepois: true },
  { id: "financeiro", rot: "Financeiro" },
  { id: "investidor", rot: "Investidor" },
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
// Filtro do painel (Red, 21/10/2026): uma turma, o total do investidor (desde 05/10), o total geral
// ou um período escolhido por data. Não existe mais "Ao vivo": abre na turma em captação.
const MODOS_RECORTE = ["total_baby", "total_geral", "periodo"] as const;
type ModoRec = (typeof MODOS_RECORTE)[number];
const ehModoRecorte = (v: string): v is ModoRec => (MODOS_RECORTE as readonly string[]).includes(v);
const tag = (d: Dados) => `${d.ciclo.nome} · ${d.ciclo.fase.rotulo}`;
type Turma = { d0: string; nome: string; indice: number };

export default function Painel() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);
  const [sel, setSel] = useState<string>(""); // "" = ainda não escolhido (abre na turma em captação)
  const [fixo, setFixo] = useState<Dados | null>(null);
  const [rec, setRec] = useState<Recorte | null>(null);
  const [de, setDe] = useState<string>("");
  const [ate, setAte] = useState<string>("");
  const [lista, setLista] = useState<Turma[]>([]);
  const [geradoEm, setGeradoEm] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [aba, setAba] = useState<Aba>("geral");
  const [privado, setPrivado] = useState(false);

  const carregar = useCallback(async (escolha: string, deP = "", ateP = "") => {
    setCarregando(true);
    setErro(null);
    try {
      let url = "/api/dashboard";
      if (ehModoRecorte(escolha)) url = `/api/dashboard?recorte=${escolha}${escolha === "periodo" ? `&de=${deP}&ate=${ateP}` : ""}`;
      else if (escolha) url = `/api/dashboard?ciclo=${escolha}`;
      const r = await fetch(url, { cache: "no-store" });
      if (r.status === 401) {
        setAuth(false);
        return;
      }
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setLista(j.ciclos);
      setGeradoEm(j.geradoEm);
      if (ehModoRecorte(escolha)) {
        setRec(j);
      } else {
        setFixo(j);
        if (!escolha) setSel(j.ciclo.d0); // primeira abertura: fica na turma em captação
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
  const carrinhoAberto = !ehModoRecorte(sel) && fixo?.ciclo.fase.id === "carrinho";
  useEffect(() => {
    if (!geradoEm) return;
    const ms = carrinhoAberto ? 30e3 : 120e3;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") carregar(sel, de, ate);
    }, ms);
    const vis = () => document.visibilityState === "visible" && Date.now() - new Date(geradoEm).getTime() > ms && carregar(sel, de, ate);
    document.addEventListener("visibilitychange", vis);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [geradoEm, sel, de, ate, carrinhoAberto, carregar]);

  function irPara(a: Aba) {
    setAba(a);
    try {
      localStorage.setItem("hwd_aba", a);
    } catch {}
    window.scrollTo({ top: 0 });
  }
  function escolher(v: string) {
    setSel(v);
    if (v === "periodo") {
      // período novo: últimos 7 dias, ajustável nas datas ao lado
      const hoje = brDiaDe(Date.now());
      const d1 = de || somaDia(hoje, -6);
      const d2 = ate || hoje;
      setDe(d1);
      setAte(d2);
      carregar(v, d1, d2);
      return;
    }
    carregar(v);
  }
  function mudarData(novoDe: string, novoAte: string) {
    setDe(novoDe);
    setAte(novoAte);
    if (novoDe && novoAte && novoDe <= novoAte) carregar("periodo", novoDe, novoAte);
  }

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha(false);
    const r = await fetch("/api/lpsg/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: senha }) });
    if (r.ok) carregar(sel, de, ate);
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

  const modoRec = ehModoRecorte(sel);
  const dados: Dados | null = modoRec ? null : fixo;
  const alertasRuins = dados ? dados.leitura.filter((l) => l.nivel === "ruim").length : 0;
  const faseTexto = modoRec ? undefined : dados?.ciclo.fase.rotulo;
  const padraoLancar = fixo?.ciclo.d0 ?? lista[lista.length - 1]?.d0 ?? "";

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
            <label htmlFor="hw-ciclo">Filtro</label>
            <select id="hw-ciclo" value={sel} onChange={(e) => escolher(e.target.value)}>
              <optgroup label="Turma">
                {[...lista].reverse().map((c) => (
                  <option key={c.d0} value={c.d0}>{c.nome}</option>
                ))}
              </optgroup>
              <optgroup label="Somas">
                <option value="total_baby">Total do investidor (desde 05/10)</option>
                <option value="total_geral">Total geral (desde 08/09)</option>
                <option value="periodo">Período por data</option>
              </optgroup>
            </select>
            {sel === "periodo" && (
              <span className="datas">
                <input type="date" value={de} max={ate || undefined} onChange={(e) => mudarData(e.target.value, ate)} aria-label="Data inicial" />
                <span>a</span>
                <input type="date" value={ate} min={de || undefined} max={brDiaDe(Date.now())} onChange={(e) => mudarData(de, e.target.value)} aria-label="Data final" />
              </span>
            )}
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
          <button className="iconb" onClick={() => carregar(sel, de, ate)} aria-label="Atualizar os números" disabled={carregando}>
            <RefreshCw size={16} className={carregando ? "girando" : ""} />
          </button>
          <button className="iconb" onClick={() => setPrivado(!privado)} aria-label={privado ? "Mostrar valores" : "Ocultar valores"}>
            {privado ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {!modoRec && <div className="nav-faixa">
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
        </div>}
      </header>

      <main className="wrap">
        {erro && <div className="aviso ruim">Não consegui montar o painel: {erro}</div>}
        {modoRec ? (
          rec && rec.modo === sel ? <RecorteView r={rec} /> : <div className="vazio">Somando gasto e receita do período.</div>
        ) : !dados ? (
          <div className="vazio">Montando os números do ciclo.</div>
        ) : (
          <>
            {aba === "geral" && <Geral d={dados} />}
            {aba === "trafego" && <Trafego d={dados} />}
            {aba === "criativos" && <Criativos d={dados} />}
            {aba === "vendas" && <Vendas d={dados} />}
            {aba === "grupo" && <Grupo d={dados} />}
            {aba === "aulas" && <Aulas d={dados} ir={irPara} />}
            {aba === "formacao" && <Formacao d={dados} ir={irPara} />}
            {aba === "financeiro" && <Financeiro d={dados} />}
            {aba === "investidor" && <Investidor atual={dados.ciclo.d0} />}
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
// INVESTIDOR
// ============================================================
function corGasto(real: number, ate: number) {
  if (ate <= 0) return "";
  const r = real / ate;
  return r > 1.05 ? "c-vermelho" : r < 0.8 ? "c-amarelo" : "";
}

// ---------- simulador de escala ----------
type Premissas = { cpa: number; ticketBruto: number; ticketLiq: number; conv: number; formLiq: number };

function projetar(verbaDia: number, p: Premissas, parteInv: number) {
  const gasto = verbaDia * 7;
  const ingressos = p.cpa > 0 ? gasto / p.cpa : 0;
  const receita = ingressos * (p.ticketLiq + (p.conv / 100) * p.formLiq);
  const lucro = receita - gasto;
  const exc = Math.max(0, lucro);
  return { gasto, ingressos, receita, lucro, inv: exc * parteInv, red: exc * (1 - parteInv), roas: gasto > 0 ? (ingressos * p.ticketBruto) / gasto : null };
}

const chipEstilo = (on: boolean): React.CSSProperties => ({
  border: `1px solid ${on ? "var(--brass2)" : "var(--line2)"}`,
  background: on ? "var(--brass-tint)" : "transparent",
  color: on ? "var(--ivory)" : "var(--ivory2)",
  padding: "6px 12px",
  fontSize: 12,
  borderRadius: 2,
  cursor: "pointer",
});

function SimuladorEscala({ base, acordo }: { base: BaseSimulador; acordo: RespInvestidor["acordo"] }) {
  const B0 = acordo.captacaoDia + acordo.distribuicaoDia;
  const MAX = 1000;
  const [verba, setVerba] = useState(B0);
  const [piora, setPiora] = useState(0);

  const taxa = base.taxa;
  const mediaBump = PRODUTOS.bumps.reduce((s, b) => s + b.preco, 0) / PRODUTOS.bumps.length;
  const ticketMin = PRECO_INGRESSO + ((REGUAS.take_bump.min ?? 30) / 100) * mediaBump;
  const convMin = REGUAS.conv_backend.min ?? 7;
  const roasPiso = REGUAS.roas_captacao.ideal ?? 1.25;
  const minimos: Premissas = {
    cpa: PRECO_INGRESSO / roasPiso,
    ticketBruto: ticketMin,
    ticketLiq: ticketMin * (1 - taxa),
    conv: convMin,
    formLiq: base.formacaoPreco * (1 - taxa),
  };
  const temAtual = base.cpa !== null && base.ticketBruto !== null && base.ticketLiquido !== null;
  const convAtual = base.convFormacao ?? convMin;
  const dobras = Math.max(0, Math.log2(verba / B0));
  const atuais: Premissas | null = temAtual
    ? { cpa: (base.cpa as number) * Math.pow(1 + piora / 100, dobras), ticketBruto: base.ticketBruto as number, ticketLiq: base.ticketLiquido as number, conv: convAtual, formLiq: base.formacaoLiquida }
    : null;

  const parte = acordo.parteInvestidor;
  const escada = atuais ? Math.round((0.4 * projetar(B0, { ...atuais, cpa: base.cpa as number }, parte).receita) / 7 / 10) * 10 : null;
  const marcas: { rot: string; v: number }[] = [
    { rot: "Acordo", v: B0 },
    { rot: "+20%", v: Math.round(B0 * (1 + PASSO_MAX_VERBA)) },
    { rot: "2x", v: B0 * 2 },
    ...(escada !== null && escada > B0 && escada <= MAX ? [{ rot: "Escada do método (40% da receita)", v: escada }] : []),
  ];
  const aumento = verba / B0 - 1;

  const cenario = (titulo: string, sub: string, p: Premissas | null, comparar: Premissas | null) => {
    if (!p) return <Bloco titulo={titulo} sub={sub}><div className="vazio">Ainda não há ingresso vendido para medir os KPIs atuais.</div></Bloco>;
    const s1 = projetar(verba, p, parte);
    const base1 = comparar ? projetar(B0, comparar, parte) : null;
    const linha = (rot: string, v1: number, casas = 0, money = true, extra?: React.ReactNode) => (
      <tr><td>{rot}</td><td className="dir num">{money ? fR(v1, casas) : fN(v1, 1)}{extra}</td><td className="dir num">{money ? fR(v1 * 4, casas) : fN(v1 * 4, 1)}</td></tr>
    );
    return (
      <Bloco titulo={titulo} sub={sub}>
        <div className="tab-wrap">
          <table className="tab">
            <thead><tr><th>Resultado</th><th className="dir">1 semana</th><th className="dir">4 semanas</th></tr></thead>
            <tbody>
              {linha("Ingressos", s1.ingressos, 0, false)}
              {linha("Receita líquida", s1.receita)}
              {linha("Gasto do investidor", s1.gasto)}
              {linha("Lucro depois de devolver o gasto", s1.lucro, 0, true, base1 && Math.abs(verba - B0) > 0.5 ? <div className="dim3" style={{ fontSize: 10.5 }}>{s1.lucro - base1.lucro >= 0 ? "+" : "−"}{fR(Math.abs(s1.lucro - base1.lucro), 0)} sobre R$ {fN(B0)}/dia</div> : null)}
              {linha(`Investidor ${fN(parte * 100, 0)}%`, s1.inv)}
              {linha(`RedPro ${fN((1 - parte) * 100, 0)}%`, s1.red)}
            </tbody>
          </table>
        </div>
        <LinhaRegua chave="roas_captacao" valor={s1.roas} nome="ROAS da captação" />
      </Bloco>
    );
  };

  const sAtual = atuais ? projetar(verba, atuais, parte) : null;
  const veredito = sAtual?.roas == null ? null : sAtual.roas >= ROAS_ESCALA ? { cor: "info", t: `O método libera escalar com ROAS acima de ${fN(ROAS_ESCALA, 1)}: duplique a campanha e escale na cópia, sem mexer na original.` }
    : sAtual.roas >= roasPiso ? { cor: "", t: `ROAS entre ${fN(roasPiso, 2)} e ${fN(ROAS_ESCALA, 1)}: a captação se paga, mas o método ainda não manda escalar.` }
    : { cor: "ruim", t: `ROAS abaixo do piso de ${fN(roasPiso, 2)} com esta verba e este CPA: o método manda não escalar.` };

  return (
    <Bloco titulo="Simulador de escala" sub="Quanto a semana rende se a verba por dia mudar. Verba dividida 75% captação e 25% distribuição, como no acordo.">
      <div style={{ display: "grid", gap: 18, marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
            <span className="dim">Verba por dia</span>
            <span className="serif num brass" style={{ fontSize: 30 }}>{fR(verba, 0)} <span className="dim3" style={{ fontSize: 13 }}>{fN(verba / B0, 1)}x o acordo · {fR(verba * 7, 0)} por semana</span></span>
          </div>
          <input type="range" min={B0} max={MAX} step={10} value={verba} onChange={(e) => setVerba(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--brass2)" }} aria-label="Verba por dia" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {marcas.map((m) => <button key={m.rot} type="button" style={chipEstilo(verba === m.v)} onClick={() => setVerba(Math.min(MAX, Math.max(B0, m.v)))}>{m.rot} · {fR(m.v, 0)}</button>)}
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
            <span className="dim">Quanto o CPA piora cada vez que a verba dobra</span>
            <span className="num brass">{fN(piora, 0)}%</span>
          </div>
          <input type="range" min={0} max={30} step={1} value={piora} onChange={(e) => setPiora(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--brass2)" }} aria-label="Piora do CPA ao dobrar a verba" />
          <div className="dim3" style={{ fontSize: 12, marginTop: 6 }}>O método não dá esse número. Em 0% o simulador é otimista. Vale só para os KPIs de hoje: nos mínimos, o CPA fica no piso por definição.</div>
        </div>
      </div>

      {aumento > PASSO_MAX_VERBA + 0.001 && <div className="aviso">Esta verba é {fN(aumento * 100, 0)}% acima do acordo. Subir mais de {fN(PASSO_MAX_VERBA * 100, 0)}% de uma vez reinicia o aprendizado da Meta (regra da nossa skill de tráfego, não do método). Suba em degraus ou duplique a campanha.</div>}
      {veredito && <div className={`aviso ${veredito.cor}`}>{veredito.t}</div>}

      <div className="g2">
        {cenario("Se os KPIs mínimos do método se mantiverem", `CPA R$ ${fN(minimos.cpa, 2)} (ROAS ${fN(roasPiso, 2)}) · Formação ${fN(convMin, 0)}% · take de bump ${fN(REGUAS.take_bump.min ?? 30, 0)}%`, minimos, minimos)}
        {cenario("Se os KPIs de hoje se mantiverem", atuais ? `CPA R$ ${fN(atuais.cpa, 2)} · Formação ${fN(atuais.conv, 1)}%${base.convFormacao === null ? " (ainda sem medida, usei o piso)" : ""} · ticket líquido R$ ${fN(atuais.ticketLiq, 2)}` : "média acumulada de todas as turmas", atuais, atuais ? { ...atuais, cpa: base.cpa as number } : null)}
      </div>
      <div className="dica">
        Média acumulada de todas as turmas: {fN(base.ingressos)} ingressos, CPA de {fR(base.cpa)}. Formação medida sobre {fN(base.convBase.ingressos)} ingressos de turmas com carrinho encerrado: {fN(base.convBase.vendas)} venda(s), {base.convFormacao === null ? "sem base ainda" : fP(base.convFormacao)}.
        A semana projetada repete a mesma verba, e a receita da Formação é contada na semana da captação, embora o dinheiro caia depois (carrinho na segunda, liberação em até 30 dias). Quatro semanas é a semana multiplicada por quatro.
      </div>
    </Bloco>
  );
}

function Investidor({ atual }: { atual: string }) {
  const [r, setR] = useState<RespInvestidor | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  useEffect(() => {
    const carregar = () =>
      fetch("/api/dashboard?investidor=1", { cache: "no-store" })
        .then((x) => x.json())
        .then((j) => (j.error ? setErro(j.error) : (setErro(null), setR(j))))
        .catch((e) => setErro(String(e)));
    carregar();
    const t = setInterval(() => !document.hidden && carregar(), 120000);
    return () => clearInterval(t);
  }, []);

  // A aba segue o ciclo escolhido no seletor (Red, 13/10/2026). Se a turma escolhida não existir na lista, cai na que está em captação.
  const foco: LinhaInvestidor | undefined = r ? r.linhas.find((l) => l.d0 === atual) ?? [...r.linhas].reverse().find((l) => l.emCaptacao) ?? r.linhas[r.linhas.length - 1] : undefined;
  const t = r?.total;
  const a = r?.acordo;
  const manuais = r?.linhas.filter((l) => l.distribuicaoManual > 0) ?? [];
  return (
    <>
      <Cab rot="Investidor" titulo="Gasto, devolução e lucro" sub="A receita líquida cobre o gasto primeiro, turma após turma. O que sobra é lucro: 30% do investidor, 70% da RedPro AI Academy." />
      {erro && <div className="aviso ruim">{erro}</div>}
      {!r || !t || !a ? <div className="vazio">Somando gasto e receita de cada turma.</div> : (
        <>
          {foco && (
            <Bloco titulo={foco.nome} sub={`${foco.fase} · captação de ${foco.dias} dias`}>
              <div className="g4">
                <Kpi rotulo="Gasto da turma" valor={fR(foco.gasto)} sub={foco.foraDoAcordo ? "fora do acordo, é da RedPro" : `acordo: ${fR(foco.acordo, 0)}`} />
                <Kpi rotulo="Receita líquida da turma" valor={fR(foco.receitaLiquida)} sub={`${foco.ingressos} ingressos · ${foco.vendasFormacao} Formação`} />
                <Kpi rotulo="Devolvido nesta turma" valor={foco.foraDoAcordo ? "—" : fR(foco.devolvido)} sub={foco.foraDoAcordo ? "fora da conta do investidor" : `saldo depois da turma: ${fR(foco.saldoDepois)}`} />
                <Kpi rotulo="Lucro da turma" valor={foco.foraDoAcordo ? "—" : fR(foco.excedente)} sub={foco.foraDoAcordo ? "100% RedPro" : `investidor ${fR(foco.parteInvestidor)} · RedPro ${fR(foco.parteRedpro)}`} />
              </div>
            </Bloco>
          )}

          <Bloco titulo="Acumulado do acordo" sub="Todas as turmas com o investidor somadas. O saldo passa de uma turma para a seguinte.">
            <div className="g4">
              <Kpi rotulo="Investido" valor={fR(t.gasto)} sub="tudo que a Meta cobrou, pago pelo investidor" />
              <Kpi rotulo="Falta devolver" valor={fR(t.saldoDevedor)} sub={`já voltou ${fR(t.devolvido)}`} />
              <Kpi rotulo="Lucro a dividir" valor={fR(t.excedente)} sub={`investidor ${fR(t.parteInvestidor)} · RedPro ${fR(t.parteRedpro)}`} />
              <Kpi rotulo="Retorno do investidor" valor={fR(t.retornoInvestidor)} sub={`capital devolvido + ${fN(a.parteInvestidor * 100, 0)}% do lucro`} />
            </div>
          </Bloco>

          <Bloco titulo="Taxas na conta" sub="Tudo que tira dinheiro do caminho entra aqui antes da divisão. É por este bloco que se confere a transferência ao investidor.">
            <div className="g2">
              <div className="tab-wrap">
                <table className="tab">
                  <thead><tr><th>Receita</th><th className="dir">Valor</th></tr></thead>
                  <tbody>
                    <tr><td>Receita bruta (ingressos, extras e Formação)</td><td className="dir num">{fR(t.receitaBruta)}</td></tr>
                    <tr><td>Taxa da Hotmart <span className="dim3">(real, venda a venda)</span></td><td className="dir num c-amarelo">− {fR(t.taxaHotmart)}</td></tr>
                    <tr><td>Reembolsos e chargebacks <span className="dim3">(automático)</span></td><td className="dir num c-amarelo">− {fR(t.reembolsos)}</td></tr>
                    <tr><td>Imposto sobre a receita <span className="dim3">({r.taxas.impostoSobreReceitaPct > 0 ? `${fN(r.taxas.impostoSobreReceitaPct, 2)}%` : "a definir"})</span></td><td className="dir num c-amarelo">− {fR(t.impostoReceita)}</td></tr>
                    <tr><td><b>Receita que cobre o investimento</b></td><td className="dir num"><b className="brass">{fR(t.receitaLiquida)}</b></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="tab-wrap">
                <table className="tab">
                  <thead><tr><th>Investimento</th><th className="dir">Valor</th></tr></thead>
                  <tbody>
                    <tr><td>Gasto de mídia mostrado pela Meta</td><td className="dir num">{fR(t.gastoMeta)}</td></tr>
                    <tr><td>Imposto da Meta na fatura <span className="dim3">({r.taxas.metaSobreGastoPct > 0 ? `${fN(r.taxas.metaSobreGastoPct, 2)}%` : "a definir"})</span></td><td className="dir num c-amarelo">+ {fR(t.taxaMeta)}</td></tr>
                    <tr><td><b>Pago pelo investidor</b></td><td className="dir num"><b className="brass">{fR(t.gasto)}</b></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            {(r.taxas.metaSobreGastoPct === 0 || r.taxas.impostoSobreReceitaPct === 0) && <div className="aviso">Há taxa em 0% marcada como "a definir": informe o percentual do imposto que a Meta soma à fatura e o do imposto sobre a receita para a conta refletir o que sai de verdade. A taxa da Hotmart e os reembolsos já entram sozinhos.</div>}
          </Bloco>

          {foco && !foco.foraDoAcordo && (
            <Bloco titulo={`${foco.nome}: acordo contra gasto real`} sub={`${fN(foco.diasDecorridos, 1)} de ${foco.dias} dias de captação · ${foco.fase}`}>
              <div className="tab-wrap">
                <table className="tab">
                  <thead><tr><th>Verba</th><th className="dir">Acordo por dia</th><th className="dir">Acordo na captação</th><th className="dir">Acordo até agora</th><th className="dir">Gasto real</th></tr></thead>
                  <tbody>
                    <tr><td>Captação</td><td className="dir num">{fR(a.captacaoDia, 0)}</td><td className="dir num">{fR(foco.acordoCaptacao, 0)}</td><td className="dir num">{fR(a.captacaoDia * foco.diasDecorridos)}</td><td className={`dir num ${corGasto(foco.gastoCaptacao, a.captacaoDia * foco.diasDecorridos)}`}>{fR(foco.gastoCaptacao)}</td></tr>
                    <tr><td>Distribuição</td><td className="dir num">{fR(a.distribuicaoDia, 0)}</td><td className="dir num">{fR(foco.acordoDistribuicao, 0)}</td><td className="dir num">{fR(a.distribuicaoDia * foco.diasDecorridos)}</td><td className={`dir num ${corGasto(foco.gastoDistribuicao, a.distribuicaoDia * foco.diasDecorridos)}`}>{fR(foco.gastoDistribuicao)}</td></tr>
                    {foco.gastoOutros > 0 && <tr><td>Custos extras</td><td className="dir num">—</td><td className="dir num">—</td><td className="dir num">—</td><td className="dir num">{fR(foco.gastoOutros)}</td></tr>}
                    <tr><td><b>Total</b></td><td className="dir num"><b>{fR(a.captacaoDia + a.distribuicaoDia, 0)}</b></td><td className="dir num"><b>{fR(foco.acordo, 0)}</b></td><td className="dir num"><b>{fR(foco.acordoAteHoje)}</b></td><td className={`dir num ${corGasto(foco.gasto, foco.acordoAteHoje)}`}><b>{fR(foco.gasto)}</b></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="dica">Vermelho: gastando mais de 5% acima do acordo até agora. Amarelo: mais de 20% abaixo, a verba não está saindo.</div>
            </Bloco>
          )}

          <Bloco titulo="Por turma" sub="O saldo passa de uma turma para a seguinte. Só depois de zerá-lo existe lucro.">
            <div className="tab-wrap">
              <table className="tab">
                <thead>
                  <tr>
                    <th>Turma</th><th className="dir">Acordo</th><th className="dir">Gasto real</th><th className="dir">Receita líquida</th>
                    <th className="dir">Devolvido</th><th className="dir">Saldo a devolver</th><th className="dir">Lucro</th>
                    <th className="dir">Investidor {fN(a.parteInvestidor * 100, 0)}%</th><th className="dir">RedPro {fN((1 - a.parteInvestidor) * 100, 0)}%</th>
                  </tr>
                </thead>
                <tbody>
                  {r.linhas.map((l) => l.foraDoAcordo ? (
                    <tr key={l.d0}>
                      <td><b>{l.nome}</b><div className="dim3" style={{ fontSize: 10.5 }}>{l.fase} · fora do acordo, é da RedPro</div></td>
                      <td className="dir num dim3">—</td>
                      <td className="dir num dim">{fR(l.gasto)}</td>
                      <td className="dir num dim">{fR(l.receitaLiquida)}</td>
                      <td className="dir num dim3">—</td><td className="dir num dim3">—</td><td className="dir num dim3">—</td><td className="dir num dim3">—</td><td className="dir num dim3">—</td>
                    </tr>
                  ) : (
                    <tr key={l.d0} className={l.d0 === foco?.d0 ? "atual" : ""}>
                      <td><b>{l.nome}</b><div className="dim3" style={{ fontSize: 10.5 }}>{l.fase}</div></td>
                      <td className="dir num">{fR(l.acordo, 0)}<div className="dim3" style={{ fontSize: 10.5 }}>{l.dias} dias</div></td>
                      <td className={`dir num ${l.emCaptacao ? corGasto(l.gasto, l.acordoAteHoje) : ""}`}>{fR(l.gasto)}</td>
                      <td className="dir num">{fR(l.receitaLiquida)}</td>
                      <td className="dir num">{fR(l.devolvido)}</td>
                      <td className={`dir num ${l.saldoDepois > 0 ? "c-amarelo" : ""}`}>{fR(l.saldoDepois)}</td>
                      <td className="dir num">{fR(l.excedente)}</td>
                      <td className="dir num">{fR(l.parteInvestidor)}</td>
                      <td className="dir num">{fR(l.parteRedpro)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><b>Total</b></td><td className="dir num">{fR(r.linhas.reduce((s, l) => s + l.acordo, 0), 0)}</td>
                    <td className="dir num"><b className="brass">{fR(t.gasto)}</b></td><td className="dir num"><b className="brass">{fR(t.receitaLiquida)}</b></td>
                    <td className="dir num"><b className="brass">{fR(t.devolvido)}</b></td><td className="dir num"><b className="brass">{fR(t.saldoDevedor)}</b></td>
                    <td className="dir num"><b className="brass">{fR(t.excedente)}</b></td><td className="dir num"><b className="brass">{fR(t.parteInvestidor)}</b></td><td className="dir num"><b className="brass">{fR(t.parteRedpro)}</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="dica">O investidor entrou na captação da Turma 2 (05/10). A Turma 1 foi bancada pela RedPro e fica fora do total e da divisão. Receita líquida é a comissão do produtor que a Hotmart informa, na data da venda aprovada, com ingresso, bumps e Formação. Gasto real é o que a Meta cobrou nas campanhas HWK e no boost do Instagram, mais os custos extras lançados em Lançar números.</div>
          </Bloco>

          <SimuladorEscala base={r.base} acordo={r.acordo} />

          {manuais.map((l) => (
            <div key={l.d0} className="aviso">{l.nome} tem {fR(l.distribuicaoManual)} lançados à mão como distribuição. Não entram aqui, porque o boost do Instagram já vem da Meta e somar de novo contaria duas vezes. Se esse valor foi pago fora da Meta, lance em Custos extras.</div>
          ))}
        </>
      )}
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

// ============================================================
// RECORTE: total do investidor, total geral ou período por data
// ============================================================
function RecorteView({ r }: { r: Recorte }) {
  const v = r.vendas;
  const t = r.totais;
  const iv = r.investidor;
  const liquidoSobreGasto = r.gasto.total > 0 ? t.receitaLiquida / r.gasto.total : null;
  const origemItens = [
    { x: "Anúncio de venda", y: r.origem.anuncio },
    { x: "Link da bio", y: r.origem.bio },
    { x: "Boost do app", y: r.origem.boost },
    { x: "Outra", y: r.origem.outro },
    { x: "Sem origem", y: r.origem.semOrigem },
  ];
  const janela = r.de === r.ate ? porExtenso(r.de) : `${porExtenso(r.de)} a ${porExtenso(r.ate)}`;
  return (
    <>
      <Cab rot="Recorte" titulo={r.rotulo} sub={`${janela}. Gasto da Meta (venda mais distribuição) contra o que entrou na Hotmart, dia inteiro, horário de Brasília.`} />

      <div className="g4">
        <Kpi rotulo="Gasto total" valor={fR(r.gasto.total)} sub={`venda ${fR(r.gasto.venda, 0)} · distribuição ${fR(r.gasto.distribuicao, 0)}`} />
        <Kpi rotulo="Ingressos" valor={fN(v.ingressos)} sub={`CPA ${fR(t.cpa)} · ${fN(v.extrasPorIngresso, 2)} extras por ingresso`} />
        <Kpi rotulo="ROAS do ingresso" valor={fX(t.roasIngresso)} sub={`com extras ${fX(t.roasComExtras)}`} regua="roas_captacao" valorNum={t.roasIngresso} />
        <Kpi rotulo="ROAS do funil completo" valor={fX(t.roasFunil)} sub={`bruto · líquido sobre gasto ${fX(liquidoSobreGasto)}`} />
      </div>
      <div className="g4">
        <Kpi rotulo="Receita bruta" valor={fR(t.receitaBruta)} sub={`${fR(t.receitaPorIngresso)} por ingresso`} />
        <Kpi rotulo="Líquido da Hotmart" valor={fR(t.receitaLiquida)} sub={`depois da taxa da Hotmart (${fR(r.taxas.hotmart)}) · reembolsos ${fR(r.taxas.reembolsos)}`} />
        <Kpi rotulo="Lucro" valor={fR(t.lucro)} sub="líquido menos gasto de mídia" />
        <Kpi rotulo="Formação" valor={fN(v.formacao.vendas)} sub={`${fR(v.formacao.receita)} bruto · ${fP(v.convFormacao)} dos ingressos`} />
      </div>

      <Bloco titulo="Investidor: a conta do acordo neste recorte" sub={iv.desde ? `Vale de ${ddmm(iv.desde)} em diante, a partir da entrada do investidor. O gasto é coberto primeiro, o resto divide em 30% investidor e 70% RedPro.` : "Esta janela é anterior à entrada do investidor: o tráfego foi pago pela RedPro."}>
        {iv.desde ? (
          <>
            <div className="g4">
              <Kpi rotulo="Investido" valor={fR(iv.gasto)} sub="tudo que a Meta cobrou, pago pelo investidor" />
              <Kpi rotulo="Devolvido do gasto" valor={fR(iv.devolvido)} sub={iv.saldoDevedor > 0 ? `ainda falta devolver ${fR(iv.saldoDevedor)}` : "gasto totalmente coberto"} />
              <Kpi rotulo="Lucro a dividir" valor={fR(iv.excedente)} sub={`receita líquida ${fR(iv.receitaLiquida)} menos gasto`} />
              <Kpi rotulo="Total para o investidor" valor={fR(iv.totalInvestidor)} sub={`${fX(iv.multiplo)} do que investiu · devolução + 30% do lucro`} />
            </div>
            <div className="g2" style={{ marginTop: 14 }}>
              <Kpi rotulo="30% do investidor" valor={fR(iv.parteInvestidor)} sub="parte do lucro" />
              <Kpi rotulo="70% RedPro" valor={fR(iv.parteRedpro)} sub="o que sobra para a RedPro AI Academy" />
            </div>
            {iv.antes && <div className="dica">Antes da entrada do investidor, nesta janela: gasto {fR(iv.antes.gasto)} pago pela RedPro e receita líquida {fR(iv.antes.receitaLiquida)}. Fica fora da conta dele.</div>}
          </>
        ) : null}
      </Bloco>

      <Bloco titulo="Taxas na conta" sub="Da receita bruta até o que cobre o investimento, e do gasto da Meta até o que o investidor pagou.">
        <div className="g2">
          <div className="tab-wrap">
            <table className="tab">
              <thead><tr><th>Receita</th><th className="dir">Valor</th></tr></thead>
              <tbody>
                <tr><td>Receita bruta</td><td className="dir num">{fR(t.receitaBruta)}</td></tr>
                <tr><td>Taxa da Hotmart <span className="dim3">(real, venda a venda)</span></td><td className="dir num c-amarelo">− {fR(r.taxas.hotmart)}</td></tr>
                <tr><td>Reembolsos e chargebacks</td><td className="dir num c-amarelo">− {fR(r.taxas.reembolsos)}</td></tr>
                <tr><td>Imposto sobre a receita <span className="dim3">({r.taxas.receitaPct > 0 ? `${fN(r.taxas.receitaPct, 2)}%` : "a definir"})</span></td><td className="dir num c-amarelo">− {fR(r.taxas.receitaValor)}</td></tr>
                <tr><td><b>Receita que cobre o investimento</b></td><td className="dir num"><b className="brass">{fR(iv.receitaLiquida)}</b></td></tr>
              </tbody>
            </table>
          </div>
          <div className="tab-wrap">
            <table className="tab">
              <thead><tr><th>Investimento</th><th className="dir">Valor</th></tr></thead>
              <tbody>
                <tr><td>Gasto de mídia mostrado pela Meta</td><td className="dir num">{fR(iv.gastoMeta)}</td></tr>
                <tr><td>Imposto da Meta na fatura <span className="dim3">({r.taxas.metaPct > 0 ? `${fN(r.taxas.metaPct, 2)}%` : "a definir"})</span></td><td className="dir num c-amarelo">+ {fR(r.taxas.metaValor)}</td></tr>
                <tr><td><b>Pago pelo investidor</b></td><td className="dir num"><b className="brass">{fR(iv.gasto)}</b></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        {iv.antes && <div className="dica">A tabela de receita cobre a janela inteira; a conta do investidor só conta de 05/10 em diante.</div>}
      </Bloco>

      <div className="g2">
        <Bloco titulo="De onde vem o dinheiro">
          <div className="tab-wrap">
            <table className="tab">
              <thead><tr><th>Linha</th><th className="dir">Vendas</th><th className="dir">Bruto</th><th className="dir">Líquido</th></tr></thead>
              <tbody>
                <tr><td>Ingresso R${fN(PRECO_INGRESSO)}</td><td className="dir num">{v.ingressos}</td><td className="dir num">{fR(v.receitaIngresso)}</td><td className="dir num">{fR(v.liquidoIngresso)}</td></tr>
                {v.extras.map((b) => <tr key={b.nome}><td>{b.nome}</td><td className="dir num">{b.vendas}</td><td className="dir num">{fR(b.receita)}</td><td className="dir num">{fR(b.liquido)}</td></tr>)}
                <tr><td>{v.formacao.nome}</td><td className="dir num">{v.formacao.vendas}</td><td className="dir num">{fR(v.formacao.receita)}</td><td className="dir num">{fR(v.formacao.liquido)}</td></tr>
                <tr><td><b>Total</b></td><td /><td className="dir num"><b className="brass">{fR(t.receitaBruta)}</b></td><td className="dir num"><b className="brass">{fR(t.receitaLiquida)}</b></td></tr>
              </tbody>
            </table>
          </div>
          <div className="dica">Venda contada na data da aprovação do pagamento. Boleto e Pix entram quando compensam.</div>
        </Bloco>
        <Bloco titulo="De onde vêm os ingressos" sub="Pelo código de origem gravado na Hotmart.">
          <Barras itens={origemItens} />
          <div className="dica">"Boost do app" é o código que o Instagram gera no reel turbinado. "Link da bio" mistura reel, orgânico e qualquer post.</div>
        </Bloco>
      </div>

      <Bloco titulo="Dia a dia" sub="Linha: gasto do dia. Barras: ingressos.">
        <Area pontos={r.serie.map((d) => ({ x: ddmm(d.dia), y: d.gasto }))} barras={r.serie.map((d) => ({ x: ddmm(d.dia), y: d.ingressos }))} fmt={(n) => fR(n, 0)} />
        <div className="tab-wrap" style={{ marginTop: 14 }}>
          <table className="tab">
            <thead><tr><th>Dia</th><th className="dir">Venda</th><th className="dir">Distribuição</th><th className="dir">Gasto</th><th className="dir">Ingressos</th><th className="dir">Receita</th><th className="dir">Líquido</th></tr></thead>
            <tbody>
              {[...r.serie].reverse().map((d) => (
                <tr key={d.dia}>
                  <td>{DOW3[dowDe(d.dia)]} {ddmm(d.dia)}</td>
                  <td className="dir num">{fR(d.gastoVenda)}</td>
                  <td className="dir num">{fR(d.gastoDistribuicao)}</td>
                  <td className="dir num">{fR(d.gasto)}</td>
                  <td className="dir num">{d.ingressos}</td>
                  <td className="dir num">{fR(d.receita)}</td>
                  <td className="dir num">{fR(d.liquido)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloco>

      <Bloco titulo="Tráfego do recorte" sub="Só as campanhas da Hermes Week (venda e distribuição).">
        <div className="g4">
          <Kpi rotulo="Impressões" valor={fN(r.trafego.impressoes)} sub={`alcance ${fN(r.trafego.alcance)}`} />
          <Kpi rotulo="Cliques no link" valor={fN(r.trafego.cliquesLink)} sub={`CTR ${fP(r.trafego.ctr, 2)}`} />
          <Kpi rotulo="CPM" valor={fR(r.trafego.cpm)} sub="custo por mil impressões" />
          <Kpi rotulo="Custo por clique no link" valor={fR(r.trafego.cpcLink)} sub={`gasto médio ${fR(r.gasto.porDia, 0)} por dia (${r.gasto.dias} dias)`} />
        </div>
        {r.outrasCampanhas.length > 0 && (
          <div className="dica">Fora da conta: {r.outrasCampanhas.map((c) => `${c.nome} ${fR(c.gasto)}`).join(" · ")}.</div>
        )}
      </Bloco>

      {r.avisos.map((a) => <div key={a} className="aviso">{a}</div>)}
    </>
  );
}
