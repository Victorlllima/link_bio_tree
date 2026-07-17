"use client";

import { useEffect, useMemo, useState } from "react";
import {
  METAS,
  REGRAS_OURO,
  TICKET_IAA,
  avaliarCriativo,
  IMPRESSOES_MIN_JULGAR,
  type Semaforo,
} from "./metas-tabari";
import { gerarAcoes, URGENCIA_META, QUEM_LABEL, type EstadoCampanha } from "./proximas-acoes";

// ============================================================
// Painel de Métricas do Tráfego (aba dentro do /lpsg).
// Auto-explicativo: cada métrica é um card-semáforo com nome leigo + sigla
// técnica, o número de hoje, a régua do Tabari e o que fazer.
// ============================================================

interface Snapshot {
  id: number;
  dia: string;
  campanha_id: string;
  gasto: number;
  impressoes: number;
  alcance: number;
  cliques: number;
  link_clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequencia: number;
  page_views: number;
  view_content: number;
  initiate_checkout: number;
  purchases: number;
  receita: number;
  fonte: string;
}

interface Criativo {
  id: number;
  dia: string;
  ad_id: string;
  nome: string;
  formato: string;
  impressoes: number;
  cliques: number;
  link_clicks: number;
  ctr: number;
  cpc: number;
  gasto: number;
  purchases: number;
  thumb_url?: string | null;
}

// Data em que a campanha começou a rodar (GMT-3) — base pra contar a fase de aprendizado.
const INICIO_CAMPANHA = "2026-07-15";

function diasDesde(iso: string): number {
  const inicio = new Date(`${iso}T05:00:00-03:00`).getTime();
  const agora = Date.now();
  return Math.max(0, Math.floor((agora - inicio) / 86400000));
}

// deixa o nome do criativo legível: IAA_EST_08_jornal-homem-misterioso → "Jornal homem misterioso"
function nomeAmigavel(n: string): string {
  const semPrefixo = n.replace(/^IAA_(EST|VID)_\d+_/, "").replace(/_/g, " ");
  const limpo = semPrefixo.replace(/-/g, " ").trim();
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

const CORES: Record<Semaforo, { bg: string; borda: string; texto: string; dot: string; label: string }> = {
  verde: { bg: "rgba(74,222,128,0.06)", borda: "rgba(74,222,128,0.35)", texto: "#4ade80", dot: "#4ade80", label: "Saudável" },
  amarelo: { bg: "rgba(245,158,11,0.06)", borda: "rgba(245,158,11,0.4)", texto: "#f59e0b", dot: "#f59e0b", label: "Atenção" },
  vermelho: { bg: "rgba(248,113,113,0.06)", borda: "rgba(248,113,113,0.4)", texto: "#f87171", dot: "#f87171", label: "Agir" },
  neutro: { bg: "rgba(255,255,255,0.03)", borda: "rgba(255,255,255,0.1)", texto: "#a3a3a3", dot: "#6b6b6b", label: "Informativo" },
};

function fmtNum(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(Math.round(n));
}
function fmtValor(v: number, unidade: string): string {
  if (unidade === "R$") return `R$${v.toFixed(2).replace(".", ",")}`;
  if (unidade === "%") return `${v.toFixed(2).replace(".", ",")}%`;
  if (unidade === "x") return `${v.toFixed(2).replace(".", ",")}x`;
  return fmtNum(v);
}
function fmtDia(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

// deriva as 6 métricas do dashboard a partir do snapshot cru
function derivar(s: Snapshot) {
  const ic = s.initiate_checkout || 0;
  const custoIC = ic > 0 ? s.gasto / ic : 0;
  const roas = s.gasto > 0 ? s.receita / s.gasto : 0;
  const cvrCheckout = ic > 0 ? (s.purchases / ic) * 100 : 0;
  return {
    ctr: s.ctr,
    cpc: s.cpc,
    custo_finalizacao: custoIC,
    roas,
    conversao_checkout: cvrCheckout,
    frequencia: s.frequencia,
  };
}

export default function MetricasPainel() {
  const [snaps, setSnaps] = useState<Snapshot[]>([]);
  const [criativos, setCriativos] = useState<Criativo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function carregar() {
    try {
      const res = await fetch("/api/lpsg/metricas", { cache: "no-store" });
      const data = await res.json();
      setSnaps(data.items || []);
      setCriativos(data.criativos || []);
    } catch {
      setSnaps([]);
      setCriativos([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function atualizarAgora() {
    setAtualizando(true);
    setMsg(null);
    try {
      const res = await fetch("/api/lpsg/metricas/atualizar", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await carregar();
        setMsg({ tipo: "ok", texto: `Números atualizados direto da Meta · ${data.criativos} criativos` });
      } else {
        setMsg({ tipo: "erro", texto: data.error || "Não consegui atualizar." });
      }
    } catch {
      setMsg({ tipo: "erro", texto: "Erro de conexão ao atualizar." });
    } finally {
      setAtualizando(false);
      setTimeout(() => setMsg(null), 6000);
    }
  }

  const hoje = snaps[0]; // ordenado dia.desc
  const derivadas = useMemo(() => (hoje ? derivar(hoje) : null), [hoje]);

  // estado consolidado pro motor de próximas ações
  const acoes = useMemo(() => {
    const diasRodando = diasDesde(INICIO_CAMPANHA);
    const gastoTotal = snaps.reduce((s, x) => s + Number(x.gasto), 0);
    const impressoesTotal = criativos.reduce((s, c) => s + c.impressoes, 0) ||
      snaps.reduce((s, x) => s + x.impressoes, 0);
    const purchasesTotal = snaps.reduce((s, x) => s + x.purchases, 0);
    const receitaTotal = snaps.reduce((s, x) => s + Number(x.receita), 0);
    const estado: EstadoCampanha = {
      diasRodando,
      gastoTotal,
      impressoesTotal,
      ctrMedio: hoje?.ctr || 0,
      roas: gastoTotal > 0 ? receitaTotal / gastoTotal : 0,
      purchases: purchasesTotal,
      inicioISO: INICIO_CAMPANHA,
      criativos: criativos.map((c) => ({
        nome: nomeAmigavel(c.nome),
        ctr: Number(c.ctr),
        impressoes: c.impressoes,
        purchases: c.purchases,
      })),
    };
    return gerarAcoes(estado);
  }, [snaps, criativos, hoje]);

  if (carregando) {
    return <div style={st.vazio}>Carregando métricas…</div>;
  }

  if (!hoje) {
    return (
      <div style={st.vazio}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
        <p style={{ fontWeight: 700, color: "#f5f5f5", marginBottom: 6 }}>Ainda não há dados de tráfego.</p>
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>
          Assim que a campanha rodar e o primeiro snapshot for salvo, os números aparecem aqui —
          com semáforo comparando cada métrica com a meta do método Tabari.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ---------- PRÓXIMAS AÇÕES (o que fazer agora) ---------- */}
      <section style={st.acoesWrap}>
        <div style={st.acoesHead}>
          <div>
            <h3 style={st.acoesTitulo}>🎯 Próximas ações</h3>
            <p style={st.acoesSub}>
              O que fazer agora, segundo o método. Se a ação certa é esperar, está escrito aqui também.
            </p>
          </div>
          <span style={st.acoesDias}>Dia {diasDesde(INICIO_CAMPANHA) + 1} de campanha</span>
        </div>

        <div style={st.acoesLista}>
          {acoes.map((a, i) => {
            const u = URGENCIA_META[a.urgencia];
            return (
              <div key={i} style={{ ...st.acaoCard, borderLeftColor: u.cor }}>
                <div style={st.acaoTopo}>
                  <span style={{ ...st.acaoBadge, background: `${u.cor}22`, color: u.cor, borderColor: `${u.cor}66` }}>
                    {u.emoji} {u.texto}
                  </span>
                  <span style={st.acaoQuem}>{QUEM_LABEL[a.quem]}</span>
                </div>
                <div style={st.acaoTitulo}>{a.titulo}</div>
                <div style={st.acaoPorque}>{a.porque}</div>
                {a.comoFazer && (
                  <div style={st.acaoComo}>
                    <strong style={{ color: "#f97316" }}>Como fazer:</strong> {a.comoFazer}
                  </div>
                )}
                {a.fonte && a.fonte !== "—" && <div style={st.acaoFonte}>Regra do Tabari · {a.fonte}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* resumo do dia */}
      <div style={st.resumoBar}>
        <div style={st.resumoItem}>
          <span style={st.resumoLabel}>Dia</span>
          <span style={st.resumoVal}>{fmtDia(hoje.dia)}</span>
        </div>
        <div style={st.resumoItem}>
          <span style={st.resumoLabel}>Gasto</span>
          <span style={st.resumoVal}>R${hoje.gasto.toFixed(2).replace(".", ",")}</span>
        </div>
        <div style={st.resumoItem}>
          <span style={st.resumoLabel}>Impressões</span>
          <span style={st.resumoVal}>{fmtNum(hoje.impressoes)}</span>
        </div>
        <div style={st.resumoItem}>
          <span style={st.resumoLabel}>Alcance</span>
          <span style={st.resumoVal}>{fmtNum(hoje.alcance)}</span>
        </div>
        <div style={st.resumoItem}>
          <span style={st.resumoLabel}>Cliques</span>
          <span style={st.resumoVal}>{fmtNum(hoje.link_clicks || hoje.cliques)}</span>
        </div>
        <div style={st.resumoItem}>
          <span style={st.resumoLabel}>Vendas</span>
          <span style={{ ...st.resumoVal, color: hoje.purchases > 0 ? "#4ade80" : "#f5f5f5" }}>{hoje.purchases}</span>
        </div>
        <div style={st.resumoAcoes}>
          {hoje.fonte === "manual" && <span style={st.tagManual}>snapshot manual</span>}
          <button onClick={atualizarAgora} disabled={atualizando} style={{ ...st.btnAtualizar, opacity: atualizando ? 0.6 : 1 }}>
            {atualizando ? "⏳ Buscando na Meta…" : "🔄 Atualizar agora"}
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ ...st.msg, color: msg.tipo === "ok" ? "#4ade80" : "#f87171", borderColor: msg.tipo === "ok" ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)" }}>
          {msg.tipo === "ok" ? "✅" : "⚠️"} {msg.texto}
        </div>
      )}

      <p style={st.intro}>
        Cada cartão abaixo compara um número seu com a <strong>meta do método Tabari</strong>.
        O <span style={{ color: "#4ade80" }}>verde</span> é bom, o{" "}
        <span style={{ color: "#f59e0b" }}>amarelo</span> pede atenção, o{" "}
        <span style={{ color: "#f87171" }}>vermelho</span> pede ação. A sigla técnica está ao lado do nome.
      </p>

      {/* GRID DE CARDS-SEMÁFORO */}
      <div style={st.grid}>
        {Object.values(METAS).map((meta) => {
          const valor = derivadas ? (derivadas as Record<string, number>)[meta.chave] : 0;
          const sem = meta.avaliar(valor);
          const c = CORES[sem];
          return (
            <div key={meta.chave} style={{ ...st.card, background: c.bg, borderColor: c.borda }}>
              <div style={st.cardTopo}>
                <div>
                  <div style={st.cardNome}>{meta.nome}</div>
                  <div style={st.cardSigla}>{meta.sigla}</div>
                </div>
                <span style={{ ...st.semDot, background: c.dot }} title={c.label} />
              </div>

              <div style={{ ...st.cardValor, color: valor > 0 ? "#f5f5f5" : "#6b6b6b" }}>
                {valor > 0 ? fmtValor(valor, meta.unidade) : "—"}
              </div>

              <div style={st.cardExplica}>{meta.explica}</div>

              <div style={{ ...st.cardFrase, color: c.texto }}>{meta.frase(valor, sem)}</div>

              <div style={st.cardRegua}>
                <span style={st.cardReguaLabel}>Meta Tabari:</span> {meta.regra}
              </div>
            </div>
          );
        })}
      </div>

      {/* RANKING DE CRIATIVOS — a decisão que o método manda tomar */}
      {criativos.length > 0 && (
        <>
          <h3 style={st.secTitulo}>🎨 Ranking dos criativos</h3>
          <p style={st.secSub}>
            É aqui que se decide. O Tabari é literal: <em>&ldquo;o que você vai otimizar primeiro é sempre o
            criativo&rdquo;</em> — e a régua (CTR abaixo de 1% = pausa) vale <strong>por anúncio</strong>, não pela média da
            campanha. Números acumulados desde o início.
          </p>
          <div style={st.tabelaWrap}>
            <table style={st.tabela}>
              <thead>
                <tr>
                  {["Criativo", "Tipo", "Impressões", "CTR", "CPC", "Gasto", "Vendas", "Veredicto"].map((h) => (
                    <th key={h} style={st.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...criativos]
                  .sort((a, b) => Number(b.ctr) - Number(a.ctr))
                  .map((c) => {
                    const v = avaliarCriativo(Number(c.ctr), c.impressoes, c.purchases);
                    const cor = CORES[v.cor];
                    return (
                      <tr key={c.ad_id}>
                        <td style={{ ...st.td, minWidth: 200 }}>
                          <div style={st.crtCell}>
                            {c.thumb_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={c.thumb_url}
                                alt={nomeAmigavel(c.nome)}
                                style={st.crtThumb}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div style={{ ...st.crtThumb, ...st.crtThumbVazio }}>
                                {c.formato === "video" ? "🎬" : "🖼️"}
                              </div>
                            )}
                            <span style={st.crtNome}>{nomeAmigavel(c.nome)}</span>
                          </div>
                        </td>
                        <td style={st.td}>{c.formato === "video" ? "🎬 Vídeo" : "🖼️ Imagem"}</td>
                        <td style={st.td}>
                          {fmtNum(c.impressoes)}
                          {c.impressoes < IMPRESSOES_MIN_JULGAR && (
                            <span style={st.tdAviso} title={`O método pede ${IMPRESSOES_MIN_JULGAR.toLocaleString("pt-BR")} impressões antes de julgar`}>
                              ⏳
                            </span>
                          )}
                        </td>
                        <td style={{ ...st.td, fontWeight: 800, color: cor.texto }}>
                          {Number(c.ctr).toFixed(2).replace(".", ",")}%
                        </td>
                        <td style={st.td}>R${Number(c.cpc).toFixed(2).replace(".", ",")}</td>
                        <td style={st.td}>R${Number(c.gasto).toFixed(2).replace(".", ",")}</td>
                        <td style={{ ...st.td, color: c.purchases > 0 ? "#4ade80" : "#6b6b6b", fontWeight: c.purchases > 0 ? 800 : 400 }}>
                          {c.purchases || "—"}
                        </td>
                        <td style={{ ...st.td, whiteSpace: "normal", minWidth: 210 }}>
                          <span style={{ ...st.veredicto, background: `${cor.dot}22`, color: cor.texto, borderColor: `${cor.dot}55` }}>
                            {v.label}
                          </span>
                          <div style={st.veredictoAcao}>{v.acao}</div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <p style={st.legendaCrt}>
            ⏳ = ainda sem as {IMPRESSOES_MIN_JULGAR.toLocaleString("pt-BR")} impressões que o método pede pra decidir. Não mate esses ainda.
          </p>
        </>
      )}

      {/* FUNIL DO DIA (o caminho do lead) */}
      <h3 style={st.secTitulo}>🔻 O caminho do lead hoje (funil)</h3>
      <p style={st.secSub}>De cima pra baixo: quanto mais estreito, mais gente desiste em cada etapa. É normal afunilar.</p>
      <div style={st.funil}>
        {[
          { nome: "Viu a página", sigla: "PageView", v: hoje.page_views },
          { nome: "Viu a oferta", sigla: "ViewContent", v: hoje.view_content },
          { nome: "Clicou em comprar", sigla: "InitiateCheckout", v: hoje.initiate_checkout },
          { nome: "Comprou", sigla: "Purchase", v: hoje.purchases },
        ].map((etapa, i, arr) => {
          const max = arr[0].v || 1;
          const larg = Math.max(8, (etapa.v / max) * 100);
          const anterior = i > 0 ? arr[i - 1].v : etapa.v;
          const taxa = anterior > 0 ? (etapa.v / anterior) * 100 : 0;
          return (
            <div key={etapa.sigla} style={st.funilLinha}>
              <div style={st.funilLabel}>
                <span style={st.funilNome}>{etapa.nome}</span>
                <span style={st.funilSigla}>{etapa.sigla}</span>
              </div>
              <div style={st.funilBarraWrap}>
                <div style={{ ...st.funilBarra, width: `${larg}%` }}>
                  <span style={st.funilNum}>{fmtNum(etapa.v)}</span>
                </div>
              </div>
              {i > 0 && (
                <span style={st.funilTaxa}>{taxa.toFixed(0)}% seguiu</span>
              )}
            </div>
          );
        })}
      </div>

      {/* REGRAS DE OURO */}
      <h3 style={st.secTitulo}>📏 As regras de ouro do Tabari</h3>
      <p style={st.secSub}>Leia antes de mexer em qualquer coisa. Foram o que evitou (e evita) queimar dinheiro.</p>
      <div style={st.regras}>
        {REGRAS_OURO.map((r, i) => (
          <div key={i} style={st.regra}>
            <span style={st.regraIcone}>{r.icone}</span>
            <span style={st.regraTexto}>{r.texto}</span>
          </div>
        ))}
      </div>

      {/* HISTÓRICO DIA-A-DIA */}
      {snaps.length > 1 && (
        <>
          <h3 style={st.secTitulo}>📅 Histórico dia a dia</h3>
          <p style={st.secSub}>Compare a evolução. A régua é o piso do Tabari: CTR ≥ 1% e ROAS ≥ 1,25.</p>
          <div style={st.tabelaWrap}>
            <table style={st.tabela}>
              <thead>
                <tr>
                  {["Dia", "Gasto", "Impressões", "CTR", "Cliques", "Checkout", "Vendas", "ROAS"].map((h) => (
                    <th key={h} style={st.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {snaps.map((s) => {
                  const d = derivar(s);
                  const ctrOk = s.ctr >= 1;
                  const roasOk = d.roas >= 1.25;
                  return (
                    <tr key={s.id}>
                      <td style={st.td}>{fmtDia(s.dia)}</td>
                      <td style={st.td}>R${s.gasto.toFixed(0)}</td>
                      <td style={st.td}>{fmtNum(s.impressoes)}</td>
                      <td style={{ ...st.td, color: ctrOk ? "#4ade80" : "#f87171", fontWeight: 700 }}>
                        {s.ctr.toFixed(2).replace(".", ",")}%
                      </td>
                      <td style={st.td}>{fmtNum(s.link_clicks || s.cliques)}</td>
                      <td style={st.td}>{s.initiate_checkout}</td>
                      <td style={{ ...st.td, color: s.purchases > 0 ? "#4ade80" : "#a3a3a3" }}>{s.purchases}</td>
                      <td style={{ ...st.td, color: s.gasto > 0 ? (roasOk ? "#4ade80" : "#f59e0b") : "#6b6b6b", fontWeight: 700 }}>
                        {s.gasto > 0 ? `${d.roas.toFixed(2).replace(".", ",")}x` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const st: Record<string, React.CSSProperties> = {
  vazio: { textAlign: "center", padding: "60px 24px", color: "#a3a3a3", fontFamily: "'DM Sans', system-ui", maxWidth: 480, margin: "0 auto" },

  // próximas ações
  acoesWrap: { background: "linear-gradient(180deg, rgba(249,115,22,0.07), rgba(249,115,22,0.02))", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 14, padding: 20, marginBottom: 22 },
  acoesHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 14 },
  acoesTitulo: { fontSize: 19, fontWeight: 800, color: "#f5f5f5", margin: 0, fontFamily: "'DM Sans', system-ui" },
  acoesSub: { fontSize: 13, color: "#a3a3a3", margin: "4px 0 0", lineHeight: 1.5, fontFamily: "'DM Sans', system-ui" },
  acoesDias: { fontSize: 12, color: "#f97316", border: "1px solid rgba(249,115,22,0.4)", borderRadius: 20, padding: "4px 12px", whiteSpace: "nowrap", fontFamily: "'DM Sans', system-ui", fontWeight: 700 },
  acoesLista: { display: "flex", flexDirection: "column", gap: 10 },
  acaoCard: { background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid", borderRadius: 10, padding: "14px 16px", fontFamily: "'DM Sans', system-ui" },
  acaoTopo: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" },
  acaoBadge: { fontSize: 11.5, fontWeight: 800, padding: "3px 10px", borderRadius: 20, border: "1px solid", whiteSpace: "nowrap" },
  acaoQuem: { fontSize: 11.5, color: "#8a8a8a", fontWeight: 600 },
  acaoTitulo: { fontSize: 15.5, fontWeight: 700, color: "#f5f5f5", lineHeight: 1.3, marginBottom: 5 },
  acaoPorque: { fontSize: 13.5, color: "#b8b8b8", lineHeight: 1.5 },
  acaoComo: { fontSize: 13, color: "#d4d4d4", lineHeight: 1.5, marginTop: 8, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.18)", borderRadius: 8, padding: "8px 10px" },
  acaoFonte: { fontSize: 10.5, color: "#5a5a5a", marginTop: 8, fontFamily: "'JetBrains Mono', monospace" },

  // botão atualizar
  resumoAcoes: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 },
  btnAtualizar: { background: "#f97316", color: "#0a0a0a", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', system-ui", whiteSpace: "nowrap" },
  msg: { fontSize: 13, padding: "10px 14px", border: "1px solid", borderRadius: 8, marginBottom: 18, fontFamily: "'DM Sans', system-ui", fontWeight: 600 },

  // ranking de criativos
  crtCell: { display: "flex", alignItems: "center", gap: 10 },
  crtThumb: { width: 40, height: 52, borderRadius: 6, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0, background: "#0a0a0a" },
  crtThumbVazio: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  crtNome: { fontWeight: 600, color: "#f5f5f5", lineHeight: 1.25 },
  veredicto: { fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 20, border: "1px solid", display: "inline-block", marginBottom: 4 },
  veredictoAcao: { fontSize: 11.5, color: "#8a8a8a", lineHeight: 1.4 },
  tdAviso: { marginLeft: 5, fontSize: 11, cursor: "help" },
  legendaCrt: { fontSize: 12, color: "#6b6b6b", marginTop: -12, marginBottom: 30, fontFamily: "'DM Sans', system-ui" },

  resumoBar: { display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", padding: "16px 20px", background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, marginBottom: 18 },
  resumoItem: { display: "flex", flexDirection: "column", gap: 2 },
  resumoLabel: { fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'DM Sans', system-ui" },
  resumoVal: { fontSize: 20, fontWeight: 800, color: "#f5f5f5", fontFamily: "'DM Sans', system-ui" },
  tagManual: { marginLeft: "auto", fontSize: 11, color: "#f59e0b", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 20, padding: "3px 10px", fontFamily: "'DM Sans', system-ui" },
  intro: { fontSize: 14, color: "#a3a3a3", lineHeight: 1.6, marginBottom: 20, fontFamily: "'DM Sans', system-ui" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 36 },
  card: { border: "1px solid", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 8, fontFamily: "'DM Sans', system-ui" },
  cardTopo: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  cardNome: { fontSize: 15, fontWeight: 700, color: "#f5f5f5", lineHeight: 1.2 },
  cardSigla: { fontSize: 12, color: "#6b6b6b", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 },
  semDot: { width: 12, height: 12, borderRadius: "50%", flexShrink: 0, marginTop: 3 },
  cardValor: { fontSize: 34, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, margin: "2px 0" },
  cardExplica: { fontSize: 12.5, color: "#a3a3a3", lineHeight: 1.45 },
  cardFrase: { fontSize: 13, fontWeight: 600, lineHeight: 1.4 },
  cardRegua: { fontSize: 11.5, color: "#8a8a8a", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8, marginTop: 2, lineHeight: 1.4 },
  cardReguaLabel: { color: "#f97316", fontWeight: 700 },
  secTitulo: { fontSize: 18, fontWeight: 800, color: "#f5f5f5", margin: "8px 0 4px", fontFamily: "'DM Sans', system-ui" },
  secSub: { fontSize: 13, color: "#8a8a8a", marginBottom: 16, lineHeight: 1.5, fontFamily: "'DM Sans', system-ui" },
  funil: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 36, background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18 },
  funilLinha: { display: "grid", gridTemplateColumns: "160px 1fr auto", alignItems: "center", gap: 12 },
  funilLabel: { display: "flex", flexDirection: "column" },
  funilNome: { fontSize: 13.5, fontWeight: 600, color: "#f5f5f5", fontFamily: "'DM Sans', system-ui" },
  funilSigla: { fontSize: 10.5, color: "#6b6b6b", fontFamily: "'JetBrains Mono', monospace" },
  funilBarraWrap: { background: "rgba(255,255,255,0.03)", borderRadius: 8, overflow: "hidden" },
  funilBarra: { background: "linear-gradient(90deg, #f97316, #fb923c)", height: 34, borderRadius: 8, display: "flex", alignItems: "center", paddingLeft: 12, minWidth: 40, transition: "width .4s" },
  funilNum: { fontSize: 14, fontWeight: 800, color: "#0a0a0a", fontFamily: "'DM Sans', system-ui" },
  funilTaxa: { fontSize: 12, color: "#a3a3a3", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" },
  regras: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10, marginBottom: 36 },
  regra: { display: "flex", gap: 12, alignItems: "flex-start", background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px" },
  regraIcone: { fontSize: 18, flexShrink: 0 },
  regraTexto: { fontSize: 13, color: "#d4d4d4", lineHeight: 1.45, fontFamily: "'DM Sans', system-ui" },
  tabelaWrap: { overflowX: "auto", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, marginBottom: 24 },
  tabela: { width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', system-ui", minWidth: 560 },
  th: { textAlign: "left", fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 14px", background: "#161616", borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" },
  td: { fontSize: 13.5, color: "#d4d4d4", padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" },
};
