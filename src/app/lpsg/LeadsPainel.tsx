"use client";

import { useEffect, useMemo, useState } from "react";

// Aba "Leads" do painel /lpsg — mostra as duas fichas do CRM Week.
// Matrículas: quem comprou o ingresso e preencheu o onboarding.
// Interesse (MQL): quem preencheu na aula 4 — ordenado do mais quente pro mais frio.

type Matricula = {
  id: number; ciclo: string; nome: string; email: string; whatsapp: string;
  ocupacao: string | null; nivel_ia: string | null; ja_construiu: string | null;
  nicho: string | null; objetivo: string | null; maior_duvida: string | null;
  criado_em: string;
};

type Status = {
  id: number; ciclo: string; nome: string; email: string; whatsapp: string;
  execucao: string | null; intencao: string | null; quando: string | null;
  trava: string | null; tag: string | null; score: number; criado_em: string;
};

const LABEL: Record<string, string> = {
  // ocupação
  clt: "CLT", autonomo: "Autônomo", empresa: "Tem empresa",
  "entre-empregos": "Entre empregos", estudante: "Estudante",
  // nível IA
  nunca: "Nunca usou", basico: "ChatGPT básico",
  intermediario: "Testou automações", avancado: "Já entregou algo",
  // já construiu
  "tentei-travei": "Tentou e travou", terminei: "Já terminou algo",
  // objetivo
  "nova-renda": "Nova fonte de renda", "atender-empresas": "Atender empresas",
  "minha-empresa": "Próprio negócio", carreira: "Mudar de carreira", aprender: "Aprender",
  // execução (MQL)
  "no-ar": "CRM no ar", construindo: "Construindo", assistindo: "Só assistindo",
  atrasado: "Não começou",
  // intenção (MQL)
  "viver-disso": "Viver disso", "renda-extra": "Renda extra", "nao-sei": "Não sabe",
  // urgência (MQL)
  agora: "AGORA", mes: "30 dias", trimestre: "3 meses", "sem-pressa": "Sem pressa",
};

const lbl = (v: string | null) => (v ? LABEL[v] || v : "—");

// Banco grava em UTC. Forçar GMT-3 (Brasil sem horário de verão desde 2019) — senão
// o painel mostra o horário UTC do servidor da Vercel (ex: 15h54 em vez de 12h54).
const dataBR = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });

function baixarCSV(nome: string, linhas: Record<string, unknown>[]) {
  if (!linhas.length) return;
  const cols = Object.keys(linhas[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...linhas.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nome}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsPainel() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [vista, setVista] = useState<"status" | "matriculas">("status");
  const [filtro, setFiltro] = useState<"todos" | "HOT" | "WARM" | "COLD">("todos");

  useEffect(() => {
    fetch("/api/lpsg/leads")
      .then((r) => r.json())
      .then((d) => { setMatriculas(d.matriculas || []); setStatus(d.status || []); })
      .catch(() => { })
      .finally(() => setCarregando(false));
  }, []);

  const contagem = useMemo(() => ({
    HOT: status.filter((s) => s.tag === "HOT").length,
    WARM: status.filter((s) => s.tag === "WARM").length,
    COLD: status.filter((s) => s.tag === "COLD").length,
  }), [status]);

  const statusFiltrado = useMemo(
    () => (filtro === "todos" ? status : status.filter((s) => s.tag === filtro)),
    [status, filtro],
  );

  // Benchmark Tabari: ~25% da base da aula 4 preenche a ficha de interesse.
  const taxaFicha = matriculas.length ? Math.round((status.length / matriculas.length) * 100) : 0;

  if (carregando) return <div style={s.vazio}>Carregando leads…</div>;

  return (
    <div style={s.root}>
      {/* ---------- RESUMO ---------- */}
      <div style={s.cards}>
        <Card label="Matriculados" valor={matriculas.length} hint="preencheram a ficha pós-compra" />
        <Card label="Ficha de interesse" valor={status.length} hint={`${taxaFicha}% dos matriculados · meta Tabari 25%`} cor={taxaFicha >= 25 ? "#4ADE80" : "#F97316"} />
        <Card label="🔥 Leads HOT" valor={contagem.HOT} hint="prioridade no pitch de domingo" cor="#F97316" />
      </div>

      {/* ---------- ALTERNÂNCIA ---------- */}
      <div style={s.linhaTopo}>
        <div style={s.grupoBtn}>
          {([["status", `Ficha de interesse (${status.length})`], ["matriculas", `Matrículas (${matriculas.length})`]] as const).map(([v, t]) => (
            <button key={v} onClick={() => setVista(v)} style={{ ...s.btnVista, ...(vista === v ? s.btnVistaAtivo : {}) }}>{t}</button>
          ))}
        </div>
        <button
          style={s.btnCSV}
          onClick={() => vista === "status"
            ? baixarCSV(`crm-week-interesse-${new Date().toISOString().slice(0, 10)}`, statusFiltrado as unknown as Record<string, unknown>[])
            : baixarCSV(`crm-week-matriculas-${new Date().toISOString().slice(0, 10)}`, matriculas as unknown as Record<string, unknown>[])}
        >
          ⬇ Exportar CSV
        </button>
      </div>

      {/* ---------- FICHA DE INTERESSE (MQL) ---------- */}
      {vista === "status" && (
        <>
          <div style={s.filtros}>
            {(["todos", "HOT", "WARM", "COLD"] as const).map((f) => (
              <button key={f} onClick={() => setFiltro(f)} style={{ ...s.chip, ...(filtro === f ? s.chipAtivo : {}) }}>
                {f === "todos" ? `Todos (${status.length})` : `${f === "HOT" ? "🔥" : f === "WARM" ? "🟡" : "🔵"} ${f} (${contagem[f]})`}
              </button>
            ))}
          </div>

          {statusFiltrado.length === 0 ? (
            <div style={s.vazio}>Nenhum lead ainda. A ficha de interesse abre na <strong>aula 4 (quinta)</strong>.</div>
          ) : (
            <div style={s.scroll}>
              <table style={s.tabela}>
                <thead>
                  <tr>
                    {["", "Nome", "Contato", "Executou", "Quer", "Quando", "O que trava", "Quando preencheu"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {statusFiltrado.map((l) => (
                    <tr key={l.id} style={s.tr}>
                      <td style={s.td}>
                        <span style={{ ...s.tag, background: l.tag === "HOT" ? "rgba(249,115,22,.16)" : l.tag === "WARM" ? "rgba(234,179,8,.14)" : "rgba(96,165,250,.12)", color: l.tag === "HOT" ? "#F97316" : l.tag === "WARM" ? "#EAB308" : "#60A5FA" }}>
                          {l.tag === "HOT" ? "🔥" : l.tag === "WARM" ? "🟡" : "🔵"} {l.score}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{l.nome}</td>
                      <td style={s.td}>
                        <div style={s.contato}>{l.whatsapp}</div>
                        <div style={s.contatoDim}>{l.email}</div>
                      </td>
                      <td style={s.td}>{lbl(l.execucao)}</td>
                      <td style={s.td}>{lbl(l.intencao)}</td>
                      <td style={{ ...s.td, color: l.quando === "agora" ? "#F97316" : undefined, fontWeight: l.quando === "agora" ? 700 : 400 }}>{lbl(l.quando)}</td>
                      <td style={{ ...s.td, maxWidth: 260, color: "#B8B8B8" }}>{l.trava || "—"}</td>
                      <td style={{ ...s.td, whiteSpace: "nowrap", color: "#8A8A8A" }}>{dataBR(l.criado_em)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ---------- MATRÍCULAS ---------- */}
      {vista === "matriculas" && (
        matriculas.length === 0 ? (
          <div style={s.vazio}>Nenhuma matrícula ainda. A ficha é preenchida depois da compra do ingresso.</div>
        ) : (
          <div style={s.scroll}>
            <table style={s.tabela}>
              <thead>
                <tr>
                  {["Nome", "Contato", "Faz hoje", "Nível IA", "Já construiu", "Objetivo", "Nicho", "Maior dúvida", "Quando"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matriculas.map((m) => (
                  <tr key={m.id} style={s.tr}>
                    <td style={{ ...s.td, fontWeight: 600 }}>{m.nome}</td>
                    <td style={s.td}>
                      <div style={s.contato}>{m.whatsapp}</div>
                      <div style={s.contatoDim}>{m.email}</div>
                    </td>
                    <td style={s.td}>{lbl(m.ocupacao)}</td>
                    <td style={s.td}>{lbl(m.nivel_ia)}</td>
                    <td style={s.td}>{lbl(m.ja_construiu)}</td>
                    <td style={s.td}>{lbl(m.objetivo)}</td>
                    <td style={s.td}>{m.nicho || "—"}</td>
                    <td style={{ ...s.td, maxWidth: 240, color: "#B8B8B8" }}>{m.maior_duvida || "—"}</td>
                    <td style={{ ...s.td, whiteSpace: "nowrap", color: "#8A8A8A" }}>{dataBR(m.criado_em)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

function Card({ label, valor, hint, cor }: { label: string; valor: number; hint: string; cor?: string }) {
  return (
    <div style={s.card}>
      <div style={s.cardLabel}>{label}</div>
      <div style={{ ...s.cardValor, color: cor || "#F5F5F5" }}>{valor}</div>
      <div style={s.cardHint}>{hint}</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: "flex", flexDirection: "column", gap: 18, paddingTop: 8 },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 },
  card: { background: "#141414", border: "1px solid #1F1F1F", borderRadius: 12, padding: "16px 18px" },
  cardLabel: { fontSize: 12, color: "#8A8A8A", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 8 },
  cardValor: { fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 34, fontWeight: 900, lineHeight: 1 },
  cardHint: { fontSize: 12, color: "#8A8A8A", marginTop: 6 },
  linhaTopo: { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", alignItems: "center" },
  grupoBtn: { display: "flex", gap: 8, flexWrap: "wrap" },
  btnVista: { background: "#141414", border: "1px solid #1F1F1F", color: "#B8B8B8", borderRadius: 9, padding: "9px 15px", fontSize: 13, fontFamily: "inherit", cursor: "pointer" },
  btnVistaAtivo: { background: "rgba(249,115,22,.12)", borderColor: "rgba(249,115,22,.4)", color: "#F97316", fontWeight: 700 },
  btnCSV: { background: "transparent", border: "1px solid #1F1F1F", color: "#8A8A8A", borderRadius: 9, padding: "9px 15px", fontSize: 13, fontFamily: "inherit", cursor: "pointer" },
  filtros: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: { background: "#141414", border: "1px solid #1F1F1F", color: "#8A8A8A", borderRadius: 30, padding: "6px 14px", fontSize: 12.5, fontFamily: "inherit", cursor: "pointer" },
  chipAtivo: { background: "rgba(255,255,255,.06)", borderColor: "#333", color: "#F5F5F5", fontWeight: 700 },
  scroll: { overflowX: "auto", border: "1px solid #1F1F1F", borderRadius: 12 },
  tabela: { width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 900 },
  th: { textAlign: "left", padding: "12px 14px", background: "#111", color: "#8A8A8A", fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, whiteSpace: "nowrap", borderBottom: "1px solid #1F1F1F" },
  tr: { borderBottom: "1px solid #161616" },
  td: { padding: "12px 14px", verticalAlign: "top" },
  tag: { display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" },
  contato: { fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5 },
  contatoDim: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: "#8A8A8A", marginTop: 3 },
  vazio: { padding: "40px 20px", textAlign: "center", color: "#8A8A8A", background: "#111", border: "1px solid #1F1F1F", borderRadius: 12, fontSize: 14 },
};
