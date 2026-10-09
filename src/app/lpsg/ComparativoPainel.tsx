"use client";

import { useEffect, useMemo, useState } from "react";
import { gerarAcoes, URGENCIA_META, QUEM_LABEL, type EstadoCampanha } from "./proximas-acoes";

// ============================================================
// VISÃO GERAL — comparativo semana a semana.
// Pega o histórico de snapshots (traf_snapshots, gravado pela Meta) e o
// acumulado de criativos (traf_criativos) e agrupa por semana (segunda a
// domingo, GMT-3) pra comparar um ciclo do Hermes Week com o anterior.
// Compras/gasto vêm do snapshot diário (traf_snapshots). Como esse dado
// tem um buraco de histórico (parou de gravar entre 29/07 e 27/09 — bug
// corrigido em 28/09/2026), semanas sem snapshot aparecem como "sem dado".
// ============================================================

interface Snapshot {
  dia: string;
  campanha_id: string;
  campanha_nome?: string | null;
  gasto: number;
  impressoes: number;
  cliques: number;
  link_clicks: number;
  ctr: number;
  purchases: number;
  receita: number;
  initiate_checkout: number;
}

interface Criativo {
  dia: string;
  ad_id: string;
  nome: string;
  ctr: number;
  impressoes: number;
  purchases: number;
}

interface Semana {
  chave: string; // ISO da segunda-feira
  inicio: Date;
  fim: Date;
  label: string;
  dias: Snapshot[];
  gasto: number;
  purchases: number;
  receita: number;
  impressoes: number;
  linkClicks: number;
  ctr: number;
  roas: number;
  custoPorVenda: number;
  temDado: boolean;
}

function segundaFeiraDaSemana(iso: string): Date {
  // dia (YYYY-MM-DD) é sempre GMT-3; tratamos como data local pura, sem hora
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const diaSemana = dt.getUTCDay(); // 0=dom .. 6=sáb
  const offset = diaSemana === 0 ? -6 : 1 - diaSemana;
  dt.setUTCDate(dt.getUTCDate() + offset);
  return dt;
}

function chaveISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmtDiaMes(d: Date): string {
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function fmtValor(v: number, unidade: "R$" | "%" | "x" | ""): string {
  if (!isFinite(v)) return "—";
  if (unidade === "R$") return `R$${v.toFixed(2).replace(".", ",")}`;
  if (unidade === "%") return `${v.toFixed(2).replace(".", ",")}%`;
  if (unidade === "x") return `${v.toFixed(2).replace(".", ",")}x`;
  return new Intl.NumberFormat("pt-BR").format(Math.round(v));
}

function Delta({ atual, anterior, unidade, maiorMelhor = true }: { atual: number; anterior: number | null; unidade: "R$" | "%" | "x" | ""; maiorMelhor?: boolean }) {
  if (anterior === null || anterior === 0) return null;
  const diffPct = ((atual - anterior) / Math.abs(anterior)) * 100;
  if (!isFinite(diffPct) || Math.abs(diffPct) < 0.5) return <span style={{ color: "#6b6b6b", fontSize: 12 }}>· estável</span>;
  const bom = maiorMelhor ? diffPct > 0 : diffPct < 0;
  const cor = bom ? "#4ade80" : "#f87171";
  const seta = diffPct > 0 ? "▲" : "▼";
  return (
    <span style={{ color: cor, fontSize: 12, fontWeight: 700 }}>
      {seta} {Math.abs(diffPct).toFixed(0)}%
    </span>
  );
}

export default function ComparativoPainel() {
  const [snaps, setSnaps] = useState<Snapshot[]>([]);
  const [criativos, setCriativos] = useState<Criativo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const semanas = useMemo<Semana[]>(() => {
    const mapa = new Map<string, Semana>();
    for (const s of snaps) {
      const seg = segundaFeiraDaSemana(s.dia);
      const chave = chaveISO(seg);
      if (!mapa.has(chave)) {
        const fim = new Date(seg);
        fim.setUTCDate(fim.getUTCDate() + 6);
        mapa.set(chave, {
          chave,
          inicio: seg,
          fim,
          label: `${fmtDiaMes(seg)} – ${fmtDiaMes(fim)}`,
          dias: [],
          gasto: 0,
          purchases: 0,
          receita: 0,
          impressoes: 0,
          linkClicks: 0,
          ctr: 0,
          roas: 0,
          custoPorVenda: 0,
          temDado: true,
        });
      }
      const sem = mapa.get(chave)!;
      sem.dias.push(s);
      sem.gasto += Number(s.gasto);
      sem.purchases += s.purchases;
      sem.receita += Number(s.receita);
      sem.impressoes += s.impressoes;
      sem.linkClicks += s.link_clicks;
    }
    for (const sem of mapa.values()) {
      sem.ctr = sem.impressoes > 0 ? (sem.linkClicks / sem.impressoes) * 100 : 0;
      sem.roas = sem.gasto > 0 ? sem.receita / sem.gasto : 0;
      sem.custoPorVenda = sem.purchases > 0 ? sem.gasto / sem.purchases : 0;
    }
    return [...mapa.values()].sort((a, b) => b.chave.localeCompare(a.chave));
  }, [snaps]);

  // estado consolidado (últimos 30 dias) pro motor de próximas ações
  const acoes = useMemo(() => {
    if (!snaps.length) return [];
    const inicioISO = snaps[snaps.length - 1].dia;
    const diasRodando = Math.max(
      1,
      Math.round((Date.now() - new Date(`${inicioISO}T05:00:00-03:00`).getTime()) / 86400000)
    );
    const gastoTotal = snaps.reduce((s, x) => s + Number(x.gasto), 0);
    const receitaTotal = snaps.reduce((s, x) => s + Number(x.receita), 0);
    const purchasesTotal = snaps.reduce((s, x) => s + x.purchases, 0);
    const ultimoDia = snaps[0];
    const estado: EstadoCampanha = {
      diasRodando,
      gastoTotal,
      impressoesTotal: snaps.reduce((s, x) => s + x.impressoes, 0),
      ctrMedio: ultimoDia?.ctr || 0,
      roas: gastoTotal > 0 ? receitaTotal / gastoTotal : 0,
      purchases: purchasesTotal,
      inicioISO,
      criativos: criativos.map((c) => ({ nome: c.nome, ctr: Number(c.ctr), impressoes: c.impressoes, purchases: c.purchases })),
    };
    return gerarAcoes(estado);
  }, [snaps, criativos]);

  // Hook declarado antes dos retornos antecipados: com ele depois, a tela
  // quebrava (React #310) assim que os snapshots carregavam.
  const temGapDeDados = useMemo(() => {
    const dias = [...new Set(snaps.map((s) => s.dia))].sort();
    for (let i = 1; i < dias.length; i++) {
      const diff = (new Date(dias[i]).getTime() - new Date(dias[i - 1]).getTime()) / 86400000;
      if (diff > 10) return true;
    }
    return false;
  }, [snaps]);

  if (carregando) return <div style={st.vazio}>Carregando comparativo…</div>;

  if (!semanas.length) {
    return (
      <div style={st.vazio}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
        <p style={{ fontWeight: 700, color: "#f5f5f5", marginBottom: 6 }}>Ainda não há semanas fechadas pra comparar.</p>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>
          Assim que o snapshot diário da Meta rodar (cron 2x/dia ou botão &ldquo;Atualizar agora&rdquo; na aba Detalhe diário),
          cada semana vira um card aqui — comparado com a semana anterior.
        </p>
      </div>
    );
  }

  const semanaMaisRecente = semanas[0];
  return (
    <div>
      {acoes.length > 0 && (
        <section style={st.acoesWrap}>
          <h3 style={st.acoesTitulo}>🎯 Próximas ações</h3>
          <p style={st.acoesSub}>O que fazer agora — se a ação certa é esperar, está escrito aqui também.</p>
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
                  {a.comoFazer && <div style={st.acaoComo}><strong style={{ color: "#f97316" }}>Como fazer:</strong> {a.comoFazer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <h3 style={st.secTitulo}>📅 Comparativo semana a semana</h3>
      <p style={st.secSub}>
        Cada card é uma semana (segunda a domingo). A seta compara com a semana imediatamente anterior.
        Semana de {semanaMaisRecente.label} é a mais recente.
      </p>

      <div style={st.grid}>
        {semanas.map((sem, i) => {
          const anterior = semanas[i + 1] || null;
          const ehAtual = i === 0;
          return (
            <div key={sem.chave} style={{ ...st.card, ...(ehAtual ? st.cardAtual : {}) }}>
              <div style={st.cardHead}>
                <span style={st.cardSemana}>{ehAtual ? "Semana atual" : `Semana`}</span>
                <span style={st.cardData}>{sem.label}</span>
              </div>
              <div style={st.linha}>
                <span style={st.linhaLabel}>Gasto</span>
                <span style={st.linhaVal}>{fmtValor(sem.gasto, "R$")}</span>
                <Delta atual={sem.gasto} anterior={anterior?.gasto ?? null} unidade="R$" maiorMelhor={false} />
              </div>
              <div style={st.linha}>
                <span style={st.linhaLabel}>Vendas</span>
                <span style={{ ...st.linhaVal, color: sem.purchases > 0 ? "#4ade80" : "#f5f5f5" }}>{sem.purchases}</span>
                <Delta atual={sem.purchases} anterior={anterior?.purchases ?? null} unidade="" />
              </div>
              <div style={st.linha}>
                <span style={st.linhaLabel}>ROAS</span>
                <span style={st.linhaVal}>{sem.gasto > 0 ? fmtValor(sem.roas, "x") : "—"}</span>
                {sem.gasto > 0 && <Delta atual={sem.roas} anterior={anterior && anterior.gasto > 0 ? anterior.roas : null} unidade="x" />}
              </div>
              <div style={st.linha}>
                <span style={st.linhaLabel}>Custo/venda</span>
                <span style={st.linhaVal}>{sem.purchases > 0 ? fmtValor(sem.custoPorVenda, "R$") : "—"}</span>
                <Delta atual={sem.custoPorVenda} anterior={anterior?.purchases ? anterior.custoPorVenda : null} unidade="R$" maiorMelhor={false} />
              </div>
              <div style={st.linha}>
                <span style={st.linhaLabel}>CTR</span>
                <span style={st.linhaVal}>{fmtValor(sem.ctr, "%")}</span>
                <Delta atual={sem.ctr} anterior={anterior?.ctr ?? null} unidade="%" />
              </div>
              <div style={st.cardRodape}>{sem.dias.length} {sem.dias.length === 1 ? "dia" : "dias"} com dado</div>
            </div>
          );
        })}
      </div>

      {temGapDeDados && (
        <p style={st.avisoGap}>
          ⚠️ Há um buraco no histórico entre semanas — o snapshot diário da Meta ficou parado até 27/09/2026
          (bug corrigido). Semanas anteriores àquela data não têm gasto/ROAS reais, só o que os criativos guardaram.
        </p>
      )}
    </div>
  );
}

const st: Record<string, React.CSSProperties> = {
  vazio: { textAlign: "center", padding: "60px 24px", color: "#a3a3a3", fontFamily: "'DM Sans', system-ui", maxWidth: 480, margin: "0 auto" },

  acoesWrap: { background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px", marginBottom: 28 },
  acoesTitulo: { fontSize: 17, fontWeight: 800, color: "#f5f5f5", margin: 0, fontFamily: "'DM Sans', system-ui" },
  acoesSub: { fontSize: 13, color: "#a3a3a3", margin: "4px 0 14px", fontFamily: "'DM Sans', system-ui" },
  acoesLista: { display: "flex", flexDirection: "column", gap: 10 },
  acaoCard: { background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderLeftWidth: 3, borderLeftStyle: "solid", borderRadius: 10, padding: "12px 14px" },
  acaoTopo: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  acaoBadge: { fontSize: 11, fontWeight: 800, padding: "2px 9px", borderRadius: 20, border: "1px solid" },
  acaoQuem: { fontSize: 11.5, color: "#6b6b6b", fontFamily: "'DM Sans', system-ui" },
  acaoTitulo: { fontSize: 14.5, fontWeight: 700, color: "#f5f5f5", marginBottom: 3, fontFamily: "'DM Sans', system-ui" },
  acaoPorque: { fontSize: 13, color: "#a3a3a3", lineHeight: 1.5, fontFamily: "'DM Sans', system-ui" },
  acaoComo: { fontSize: 12.5, color: "#d4d4d4", marginTop: 6, lineHeight: 1.5, fontFamily: "'DM Sans', system-ui" },

  secTitulo: { fontSize: 16, fontWeight: 800, color: "#f5f5f5", margin: "0 0 4px", fontFamily: "'DM Sans', system-ui" },
  secSub: { fontSize: 13, color: "#a3a3a3", margin: "0 0 16px", lineHeight: 1.5, fontFamily: "'DM Sans', system-ui" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginBottom: 20 },
  card: { background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px" },
  cardAtual: { borderColor: "rgba(249,115,22,0.5)", boxShadow: "0 0 0 1px rgba(249,115,22,0.15)" },
  cardHead: { display: "flex", flexDirection: "column", marginBottom: 12 },
  cardSemana: { fontSize: 11, color: "#f97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", fontFamily: "'DM Sans', system-ui" },
  cardData: { fontSize: 15, fontWeight: 700, color: "#f5f5f5", fontFamily: "'DM Sans', system-ui" },
  linha: { display: "flex", alignItems: "baseline", gap: 8, padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  linhaLabel: { fontSize: 12.5, color: "#a3a3a3", flex: 1, fontFamily: "'DM Sans', system-ui" },
  linhaVal: { fontSize: 14, fontWeight: 700, color: "#f5f5f5", fontFamily: "'DM Sans', system-ui" },
  cardRodape: { fontSize: 11, color: "#6b6b6b", marginTop: 10, fontFamily: "'DM Sans', system-ui" },

  avisoGap: { fontSize: 12.5, color: "#f59e0b", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "10px 14px", lineHeight: 1.6, fontFamily: "'DM Sans', system-ui" },
};
