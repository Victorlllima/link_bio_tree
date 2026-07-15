"use client";

import { useEffect, useMemo, useState } from "react";
import { METAS, REGRAS_OURO, TICKET_IAA, type Semaforo } from "./metas-tabari";

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
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/lpsg/metricas", { cache: "no-store" });
        const data = await res.json();
        setSnaps(data.items || []);
      } catch {
        setSnaps([]);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const hoje = snaps[0]; // ordenado dia.desc
  const derivadas = useMemo(() => (hoje ? derivar(hoje) : null), [hoje]);

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
        {hoje.fonte === "manual" && <span style={st.tagManual}>snapshot manual</span>}
      </div>

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
