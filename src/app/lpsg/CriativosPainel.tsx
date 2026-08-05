"use client";

import { useEffect, useMemo, useState } from "react";

// ============================================================
// Painel de Criativos por Temperatura de Público (aba dentro do /lpsg).
// Inspirado no dashboard que a Tatá (@tata) mostrou em reel do IG (05/08/2026):
// classificação automática (escalar / substituir / sub-investido / aguardando)
// cruzada com a temperatura do público (frio / morno / quente / quentíssimo).
// A classificação em si roda no servidor (ver /api/lpsg/criativos) — este
// componente só filtra, ordena e exibe.
// ============================================================

type Classificacao = { label: string; cor: string };

interface Criativo {
  ad_id: string;
  nome: string;
  gasto: number;
  purchases: number;
  receita: number;
  roas: number;
  ctr: number;
  cpc: number;
  status: string;
  classificacao: Classificacao;
}

type Temperatura = "frio" | "morno" | "quente" | "quentissimo";
type PublicoInfo = { gasto: number; purchases: number; roas: number };
type PublicoPorAd = Record<string, Partial<Record<Temperatura, PublicoInfo>>>;

const TEMP_LABEL: Record<Temperatura, string> = {
  frio: "❄️ Frio",
  morno: "🌤️ Morno",
  quente: "🔥 Quente",
  quentissimo: "🔥🔥 Quentíssimo",
};

const CORES: Record<string, { bg: string; borda: string; texto: string; dot: string }> = {
  verde: { bg: "rgba(74,222,128,0.06)", borda: "rgba(74,222,128,0.35)", texto: "#4ade80", dot: "#4ade80" },
  azul: { bg: "rgba(96,165,250,0.06)", borda: "rgba(96,165,250,0.35)", texto: "#60a5fa", dot: "#60a5fa" },
  amarelo: { bg: "rgba(245,158,11,0.06)", borda: "rgba(245,158,11,0.4)", texto: "#f59e0b", dot: "#f59e0b" },
  vermelho: { bg: "rgba(248,113,113,0.06)", borda: "rgba(248,113,113,0.4)", texto: "#f87171", dot: "#f87171" },
  cinza: { bg: "rgba(255,255,255,0.03)", borda: "rgba(255,255,255,0.1)", texto: "#a3a3a3", dot: "#6b6b6b" },
};

function nomeAmigavel(n: string): string {
  const semPrefixo = n.replace(/^(CRM|IAA)_(EST|VID|CARR)_[A-Z0-9]*_?/, "").replace(/_/g, " ");
  const limpo = semPrefixo.replace(/-/g, " ").trim();
  return limpo.charAt(0).toUpperCase() + limpo.slice(1) || n;
}

function fmtValor(v: number, unidade: "R$" | "%" | "x" | ""): string {
  if (unidade === "R$") return `R$${v.toFixed(2).replace(".", ",")}`;
  if (unidade === "%") return `${v.toFixed(2).replace(".", ",")}%`;
  if (unidade === "x") return `${v.toFixed(2).replace(".", ",")}x`;
  return new Intl.NumberFormat("pt-BR").format(Math.round(v));
}

const FILTROS_CLASSIFICACAO = [
  "todos", "Pronto pra escalar", "Sub-investido", "Estável", "Queimando dinheiro", "Aguardando dados",
] as const;
type FiltroClassificacao = (typeof FILTROS_CLASSIFICACAO)[number];

export default function CriativosPainel() {
  const [criativos, setCriativos] = useState<Criativo[]>([]);
  const [publicoPorAd, setPublicoPorAd] = useState<PublicoPorAd>({});
  const [carregando, setCarregando] = useState(true);
  const [filtroClass, setFiltroClass] = useState<FiltroClassificacao>("todos");
  const [filtroTemp, setFiltroTemp] = useState<Temperatura | "todos">("todos");
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch("/api/lpsg/criativos", { cache: "no-store" });
      const data = await res.json();
      setCriativos(data.criativos || []);
      setPublicoPorAd(data.publicoPorAd || {});
    } catch {
      setCriativos([]);
      setPublicoPorAd({});
    } finally {
      setCarregando(false);
    }
  }

  const filtrados = useMemo(() => {
    return criativos
      .filter((c) => filtroClass === "todos" || c.classificacao.label === filtroClass)
      .filter((c) => filtroTemp === "todos" || !!publicoPorAd[c.ad_id]?.[filtroTemp])
      .sort((a, b) => Number(b.roas) - Number(a.roas));
  }, [criativos, filtroClass, filtroTemp, publicoPorAd]);

  const resumo = useMemo(() => {
    const porClass: Record<string, number> = {};
    for (const c of criativos) {
      porClass[c.classificacao.label] = (porClass[c.classificacao.label] || 0) + 1;
    }
    return porClass;
  }, [criativos]);

  if (carregando) {
    return <div style={st.vazio}>Carregando criativos…</div>;
  }

  if (criativos.length === 0) {
    return (
      <div style={st.vazio}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎨</div>
        <p style={{ fontWeight: 700, color: "#f5f5f5", marginBottom: 6 }}>Ainda não há snapshots de criativos.</p>
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>
          A routine zenith-criativos-diario grava um snapshot por dia de cada anúncio ativo.
          Assim que o primeiro rodar, o painel aparece aqui.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={st.intro}>
        Classificação automática por criativo, cruzada com a <strong>temperatura do público</strong> —
        frio (nunca viu a marca), morno (engajou/assistiu vídeo), quente (visitou a página) e
        quentíssimo (entrou no checkout). Volume mínimo de 10 compras pra confiar no ROAS.
      </p>

      {/* resumo por classificação */}
      <div style={st.resumoBar}>
        {FILTROS_CLASSIFICACAO.filter((f) => f !== "todos").map((label) => {
          const cor = criativos.find((c) => c.classificacao.label === label)?.classificacao.cor || "cinza";
          const c = CORES[cor];
          return (
            <button
              key={label}
              onClick={() => setFiltroClass(filtroClass === label ? "todos" : label)}
              style={{
                ...st.resumoChip,
                borderColor: filtroClass === label ? c.texto : c.borda,
                background: filtroClass === label ? c.bg : "transparent",
              }}
            >
              <span style={{ ...st.semDot, background: c.dot }} />
              <span style={{ color: c.texto, fontWeight: 700 }}>{resumo[label] || 0}</span>
              <span style={st.resumoLabel}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* filtro de temperatura */}
      <div style={st.tempBar}>
        <span style={st.tempBarLabel}>Público:</span>
        {(["todos", "frio", "morno", "quente", "quentissimo"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFiltroTemp(t)}
            style={{
              ...st.tempChip,
              ...(filtroTemp === t ? st.tempChipAtivo : {}),
            }}
          >
            {t === "todos" ? "Todos" : TEMP_LABEL[t]}
          </button>
        ))}
      </div>

      <div style={st.tabelaWrap}>
        <table style={st.tabela}>
          <thead>
            <tr>
              {["Criativo", "ROAS", "Gasto", "Vendas", "Receita", "Classificação", ""].map((h) => (
                <th key={h} style={st.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => {
              const cor = CORES[c.classificacao.cor];
              const publico = publicoPorAd[c.ad_id] || {};
              const temTemps = Object.keys(publico).length > 0;
              return (
                <>
                  <tr key={c.ad_id}>
                    <td style={{ ...st.td, minWidth: 200, fontWeight: 600, color: "#f5f5f5" }}>
                      {nomeAmigavel(c.nome)}
                    </td>
                    <td style={{ ...st.td, fontWeight: 800, color: cor.texto }}>
                      {c.gasto > 0 ? fmtValor(Number(c.roas), "x") : "—"}
                    </td>
                    <td style={st.td}>{fmtValor(Number(c.gasto), "R$")}</td>
                    <td style={{ ...st.td, color: c.purchases > 0 ? "#4ade80" : "#6b6b6b", fontWeight: c.purchases > 0 ? 800 : 400 }}>
                      {c.purchases || "—"}
                    </td>
                    <td style={st.td}>{fmtValor(Number(c.receita), "R$")}</td>
                    <td style={st.td}>
                      <span style={{ ...st.veredicto, background: `${cor.dot}22`, color: cor.texto, borderColor: `${cor.dot}55` }}>
                        {c.classificacao.label}
                      </span>
                    </td>
                    <td style={st.td}>
                      {temTemps && (
                        <button
                          onClick={() => setExpandido(expandido === c.ad_id ? null : c.ad_id)}
                          style={st.btnExpandir}
                        >
                          {expandido === c.ad_id ? "▲ ocultar" : "▼ por público"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandido === c.ad_id && temTemps && (
                    <tr key={`${c.ad_id}-exp`}>
                      <td colSpan={7} style={st.tdExpandido}>
                        <div style={st.tempGrid}>
                          {(Object.keys(publico) as Temperatura[]).map((t) => {
                            const info = publico[t]!;
                            return (
                              <div key={t} style={st.tempCard}>
                                <div style={st.tempCardTitulo}>{TEMP_LABEL[t]}</div>
                                <div style={st.tempCardRoas}>{info.gasto > 0 ? fmtValor(Number(info.roas), "x") : "—"}</div>
                                <div style={st.tempCardLinha}>
                                  Gasto: {fmtValor(Number(info.gasto), "R$")} · Vendas: {info.purchases}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const st: Record<string, React.CSSProperties> = {
  vazio: { textAlign: "center", padding: "60px 24px", color: "#a3a3a3", fontFamily: "'DM Sans', system-ui", maxWidth: 480, margin: "0 auto" },
  intro: { fontSize: 14, color: "#a3a3a3", lineHeight: 1.6, marginBottom: 20, fontFamily: "'DM Sans', system-ui" },

  resumoBar: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  resumoChip: { display: "flex", alignItems: "center", gap: 7, border: "1px solid", borderRadius: 20, padding: "7px 14px", fontFamily: "'DM Sans', system-ui", fontSize: 13, cursor: "pointer", background: "transparent" },
  resumoLabel: { color: "#a3a3a3" },
  semDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },

  tempBar: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  tempBarLabel: { fontSize: 12, color: "#6b6b6b", fontFamily: "'DM Sans', system-ui", marginRight: 4 },
  tempChip: { border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 13px", fontSize: 12.5, fontFamily: "'DM Sans', system-ui", color: "#a3a3a3", background: "transparent", cursor: "pointer" },
  tempChipAtivo: { borderColor: "#f97316", color: "#f97316", background: "rgba(249,115,22,0.08)", fontWeight: 700 },

  tabelaWrap: { overflowX: "auto", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, marginBottom: 24 },
  tabela: { width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', system-ui", minWidth: 640 },
  th: { textAlign: "left", fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 14px", background: "#161616", borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" },
  td: { fontSize: 13.5, color: "#d4d4d4", padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" },
  tdExpandido: { padding: "0 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" },

  veredicto: { fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 20, border: "1px solid", display: "inline-block" },
  btnExpandir: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 10px", fontSize: 11.5, color: "#a3a3a3", cursor: "pointer", fontFamily: "'DM Sans', system-ui" },

  tempGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, paddingTop: 6 },
  tempCard: { background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px" },
  tempCardTitulo: { fontSize: 12, color: "#a3a3a3", marginBottom: 4, fontFamily: "'DM Sans', system-ui" },
  tempCardRoas: { fontSize: 20, fontWeight: 800, color: "#f5f5f5", marginBottom: 4, fontFamily: "'DM Sans', system-ui" },
  tempCardLinha: { fontSize: 11.5, color: "#8a8a8a", fontFamily: "'DM Sans', system-ui" },
};
