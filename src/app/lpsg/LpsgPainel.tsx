"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TASKS,
  FRENTES,
  FASES_TABARI,
  type Responsavel,
} from "./tasks";

type EstadoItem = { task_id: string; responsavel: Responsavel; done: boolean };
type EstadoMap = Record<string, { responsavel: Responsavel; done: boolean }>;

type Aba = "geral" | "victor" | "gleyce";

const NOME = { victor: "Victor", gleyce: "Gleyce" } as const;

export default function LpsgPainel() {
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);
  const [estado, setEstado] = useState<EstadoMap>({});
  const [aba, setAba] = useState<Aba>("geral");
  const [carregando, setCarregando] = useState(true);

  // tenta carregar o estado — se 401, pede senha
  useEffect(() => {
    carregarEstado();
  }, []);

  async function carregarEstado() {
    setCarregando(true);
    try {
      const res = await fetch("/api/lpsg", { cache: "no-store" });
      if (res.status === 401) {
        setAutorizado(false);
        setCarregando(false);
        return;
      }
      const data = await res.json();
      const map: EstadoMap = {};
      (data.items as EstadoItem[]).forEach((i) => {
        map[i.task_id] = { responsavel: i.responsavel ?? null, done: !!i.done };
      });
      setEstado(map);
      setAutorizado(true);
    } catch {
      setAutorizado(false);
    }
    setCarregando(false);
  }

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha(false);
    const res = await fetch("/api/lpsg/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: senha }),
    });
    if (res.ok) {
      await carregarEstado();
    } else {
      setErroSenha(true);
    }
  }

  // resolve o responsável efetivo: estado salvo OU sugestão da task
  function responsavelDe(taskId: string): Responsavel {
    const salvo = estado[taskId]?.responsavel;
    if (salvo !== undefined && salvo !== null) return salvo;
    if (salvo === null) return null;
    return TASKS.find((t) => t.id === taskId)?.sugestao ?? null;
  }
  function doneDe(taskId: string): boolean {
    return estado[taskId]?.done ?? false;
  }

  async function salvar(taskId: string, patch: Partial<{ responsavel: Responsavel; done: boolean }>) {
    // otimista
    setEstado((prev) => ({
      ...prev,
      [taskId]: {
        responsavel: patch.responsavel !== undefined ? patch.responsavel : responsavelDe(taskId),
        done: patch.done !== undefined ? patch.done : doneDe(taskId),
      },
    }));
    await fetch("/api/lpsg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: taskId, ...patch }),
    });
  }

  const progresso = useMemo(() => {
    const total = TASKS.length;
    const feitas = TASKS.filter((t) => doneDe(t.id)).length;
    const porPessoa = (p: "victor" | "gleyce") => {
      const list = TASKS.filter((t) => responsavelDe(t.id) === p);
      const done = list.filter((t) => doneDe(t.id)).length;
      return { total: list.length, done };
    };
    return { total, feitas, victor: porPessoa("victor"), gleyce: porPessoa("gleyce") };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  // ---------- TELA DE SENHA ----------
  if (autorizado === false) {
    return (
      <div style={s.gate}>
        <form onSubmit={entrar} style={s.gateCard}>
          <div style={s.gateEmoji}>🚀</div>
          <h1 style={s.gateTitle}>Painel LPSG</h1>
          <p style={s.gateSub}>Acompanhamento do lançamento · acesso restrito</p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            style={s.gateInput}
            autoFocus
          />
          {erroSenha && <p style={s.gateErro}>Senha incorreta.</p>}
          <button type="submit" style={s.gateBtn}>Entrar</button>
        </form>
      </div>
    );
  }

  if (autorizado === null || carregando) {
    return (
      <div style={s.gate}>
        <div style={{ color: "#a3a3a3", fontFamily: "system-ui" }}>Carregando…</div>
      </div>
    );
  }

  // ---------- PAINEL ----------
  const tasksFiltradas =
    aba === "geral"
      ? TASKS
      : TASKS.filter((t) => responsavelDe(t.id) === aba);

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <header style={s.header}>
          <div>
            <h1 style={s.h1}>Lançamento LPSG · 1º Ciclo</h1>
            <p style={s.subtitle}>
              &ldquo;Como Construir um CRM Customizado em 5 Dias&rdquo; · evento 20-27/jul
            </p>
          </div>
          <div style={s.progressBadge}>
            <span style={s.progressNum}>{progresso.feitas}/{progresso.total}</span>
            <span style={s.progressLabel}>tarefas concluídas</span>
          </div>
        </header>

        {/* ---------- FLUXO TABARI HORIZONTAL ---------- */}
        <section style={s.fluxoSection}>
          <h2 style={s.h2}>O Método Tabari — as 5 fases</h2>
          <p style={s.fluxoIntro}>
            A máquina roda toda semana. Cada fase alimenta a próxima: capta a lista, aquece,
            entrega valor no evento, faz a oferta e abre o carrinho.
          </p>
          <div style={s.fluxoScroll}>
            <div style={s.fluxo}>
              {FASES_TABARI.map((f, i) => (
                <div key={f.num} style={s.fluxoItemWrap}>
                  <div style={{ ...s.fluxoCard, borderTopColor: f.cor }}>
                    <div style={{ ...s.fluxoNum, background: f.cor }}>{f.num}</div>
                    <div style={s.fluxoData}>{f.data}</div>
                    <div style={s.fluxoTitulo}>{f.titulo}</div>
                    <div style={s.fluxoDesc}>{f.descricao}</div>
                  </div>
                  {i < FASES_TABARI.length - 1 && <div style={s.fluxoSeta}>→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- ABAS ---------- */}
        <nav style={s.abas}>
          <button
            onClick={() => setAba("geral")}
            style={{ ...s.aba, ...(aba === "geral" ? s.abaAtiva : {}) }}
          >
            Visão Geral
            <span style={s.abaCount}>{progresso.total}</span>
          </button>
          <button
            onClick={() => setAba("victor")}
            style={{ ...s.aba, ...(aba === "victor" ? s.abaAtiva : {}) }}
          >
            Victor
            <span style={s.abaCount}>
              {progresso.victor.done}/{progresso.victor.total}
            </span>
          </button>
          <button
            onClick={() => setAba("gleyce")}
            style={{ ...s.aba, ...(aba === "gleyce" ? s.abaAtiva : {}) }}
          >
            Gleyce
            <span style={s.abaCount}>
              {progresso.gleyce.done}/{progresso.gleyce.total}
            </span>
          </button>
        </nav>

        {/* ---------- CHECKLIST POR FRENTE ---------- */}
        <div style={s.checklist}>
          {FRENTES.map((frente) => {
            const items = tasksFiltradas.filter((t) => t.frente === frente.id);
            if (items.length === 0) return null;
            return (
              <section key={frente.id} style={s.frenteBloco}>
                <div style={s.frenteHead}>
                  <h3 style={s.frenteTitulo}>{frente.titulo}</h3>
                  <p style={s.frenteDesc}>{frente.descricao}</p>
                </div>
                <div style={s.tasks}>
                  {items.map((t) => {
                    const done = doneDe(t.id);
                    const resp = responsavelDe(t.id);
                    return (
                      <div key={t.id} style={{ ...s.task, ...(done ? s.taskDone : {}) }}>
                        <button
                          onClick={() => salvar(t.id, { done: !done })}
                          style={{ ...s.check, ...(done ? s.checkDone : {}) }}
                          aria-label="concluir"
                        >
                          {done ? "✓" : ""}
                        </button>
                        <div style={s.taskBody}>
                          <div style={{ ...s.taskLabel, ...(done ? s.taskLabelDone : {}) }}>
                            {t.label}
                          </div>
                          {t.detalhe && <div style={s.taskDetalhe}>{t.detalhe}</div>}
                        </div>
                        {aba === "geral" && (
                          <div style={s.segmented}>
                            {(["victor", "gleyce"] as const).map((p) => (
                              <button
                                key={p}
                                onClick={() =>
                                  salvar(t.id, { responsavel: resp === p ? null : p })
                                }
                                style={{
                                  ...s.segBtn,
                                  ...(resp === p
                                    ? p === "victor"
                                      ? s.segVictor
                                      : s.segGleyce
                                    : {}),
                                }}
                              >
                                {NOME[p]}
                              </button>
                            ))}
                          </div>
                        )}
                        {aba !== "geral" && (
                          <span
                            style={{
                              ...s.tag,
                              ...(resp === "victor" ? s.tagVictor : s.tagGleyce),
                            }}
                          >
                            {resp ? NOME[resp] : "—"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {tasksFiltradas.length === 0 && (
            <p style={s.vazio}>Nenhuma tarefa atribuída a {NOME[aba as "victor" | "gleyce"]} ainda.</p>
          )}
        </div>

        <footer style={s.footer}>
          RedPro AI Academy · Painel interno · alterações salvas automaticamente
        </footer>
      </div>
    </div>
  );
}

// ===================== ESTILOS =====================
const ACCENT = "#f97316";
const BG = "#080808";
const SURFACE = "#111111";
const CARD = "#161616";
const BORDER = "rgba(255,255,255,0.08)";
const TXT = "#f5f5f5";
const TXT2 = "#a3a3a3";
const TXT3 = "#6b6b6b";
const VICTOR = "#3b82f6";
const GLEYCE = "#10b981";

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: BG, color: TXT, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "clamp(16px,4vw,48px) 0" },
  wrap: { maxWidth: 1080, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" },

  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 40 },
  h1: { fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 },
  subtitle: { color: TXT2, fontSize: 15, marginTop: 6 },
  progressBadge: { display: "flex", flexDirection: "column", alignItems: "flex-end", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "12px 18px" },
  progressNum: { fontSize: 26, fontWeight: 800, color: ACCENT, lineHeight: 1 },
  progressLabel: { fontSize: 12, color: TXT3, marginTop: 2 },

  fluxoSection: { marginBottom: 44 },
  h2: { fontSize: 20, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" },
  fluxoIntro: { color: TXT2, fontSize: 14, margin: "0 0 20px", maxWidth: 640, lineHeight: 1.5 },
  fluxoScroll: { overflowX: "auto", paddingBottom: 8 },
  fluxo: { display: "flex", alignItems: "stretch", gap: 0, minWidth: "min-content" },
  fluxoItemWrap: { display: "flex", alignItems: "center" },
  fluxoCard: { width: 200, minWidth: 200, background: CARD, border: `1px solid ${BORDER}`, borderTop: "3px solid", borderRadius: 14, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 8, minHeight: 190 },
  fluxoNum: { width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff" },
  fluxoData: { fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: "0.02em", textTransform: "uppercase" },
  fluxoTitulo: { fontSize: 15, fontWeight: 700, lineHeight: 1.25 },
  fluxoDesc: { fontSize: 12.5, color: TXT2, lineHeight: 1.45 },
  fluxoSeta: { color: TXT3, fontSize: 22, padding: "0 8px", flexShrink: 0 },

  abas: { display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" },
  aba: { display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", borderBottom: "2px solid transparent", color: TXT2, fontSize: 15, fontWeight: 600, padding: "10px 14px", cursor: "pointer", marginBottom: -1, fontFamily: "inherit" },
  abaAtiva: { color: TXT, borderBottomColor: ACCENT },
  abaCount: { fontSize: 12, fontWeight: 700, color: TXT3, background: SURFACE, borderRadius: 20, padding: "2px 8px" },

  checklist: { display: "flex", flexDirection: "column", gap: 28 },
  frenteBloco: {},
  frenteHead: { marginBottom: 12 },
  frenteTitulo: { fontSize: 16, fontWeight: 700, margin: 0 },
  frenteDesc: { fontSize: 13, color: TXT3, margin: "3px 0 0" },
  tasks: { display: "flex", flexDirection: "column", gap: 8 },
  task: { display: "flex", alignItems: "center", gap: 12, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px" },
  taskDone: { opacity: 0.55 },
  check: { width: 24, height: 24, minWidth: 24, borderRadius: 7, border: `1.5px solid ${TXT3}`, background: "transparent", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 },
  checkDone: { background: ACCENT, borderColor: ACCENT },
  taskBody: { flex: 1, minWidth: 0 },
  taskLabel: { fontSize: 14.5, fontWeight: 600, lineHeight: 1.3 },
  taskLabelDone: { textDecoration: "line-through" },
  taskDetalhe: { fontSize: 12.5, color: TXT3, marginTop: 2, lineHeight: 1.4 },

  segmented: { display: "flex", gap: 4, background: BG, borderRadius: 9, padding: 3, border: `1px solid ${BORDER}`, flexShrink: 0 },
  segBtn: { border: "none", background: "transparent", color: TXT2, fontSize: 12.5, fontWeight: 600, padding: "5px 11px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" },
  segVictor: { background: VICTOR, color: "#fff" },
  segGleyce: { background: GLEYCE, color: "#fff" },

  tag: { fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, flexShrink: 0 },
  tagVictor: { background: "rgba(59,130,246,0.15)", color: "#93c5fd" },
  tagGleyce: { background: "rgba(16,185,129,0.15)", color: "#6ee7b7" },

  vazio: { color: TXT3, textAlign: "center", padding: 40, fontSize: 14 },
  footer: { marginTop: 48, paddingTop: 20, borderTop: `1px solid ${BORDER}`, color: TXT3, fontSize: 12.5, textAlign: "center" },

  // gate
  gate: { minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans', system-ui, sans-serif" },
  gateCard: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "40px 32px", width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  gateEmoji: { fontSize: 40 },
  gateTitle: { color: TXT, fontSize: 24, fontWeight: 800, margin: 0 },
  gateSub: { color: TXT2, fontSize: 13.5, margin: "0 0 12px", textAlign: "center" },
  gateInput: { width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: TXT, fontSize: 15, fontFamily: "inherit", outline: "none" },
  gateErro: { color: "#f87171", fontSize: 13, margin: 0 },
  gateBtn: { width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 4, fontFamily: "inherit" },
};
