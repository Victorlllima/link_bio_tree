"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TASKS,
  FRENTES,
  FASES_TABARI,
  DRIVE,
  type Responsavel,
  type TutorialPasso,
  type DriveTipo,
} from "./tasks";
import MetricasPainel from "./MetricasPainel";
import LeadsPainel from "./LeadsPainel";

type EstadoItem = { task_id: string; responsavel: Responsavel; done: boolean };
type EstadoMap = Record<string, { responsavel: Responsavel; done: boolean }>;

type Nivel = "operacional" | "drive" | "metricas" | "leads";

const DRIVE_ICON: Record<DriveTipo, string> = {
  doc: "📄", pdf: "📕", html: "🌐", img: "🖼️", planilha: "📊", video: "🎬", pasta: "📁", link: "🔗",
};
type Pessoa = "todos" | "victor" | "gleyce";

const NOME = { victor: "Victor", gleyce: "Gleyce", ambos: "Ambos" } as const;

export default function LpsgPainel() {
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);
  const [estado, setEstado] = useState<EstadoMap>({});
  const [nivel, setNivel] = useState<Nivel>("operacional");
  const [pessoa, setPessoa] = useState<Pessoa>("todos");
  const [carregando, setCarregando] = useState(true);
  const [tutorial, setTutorial] = useState<TutorialPasso | null>(null);

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
    if (res.ok) await carregarEstado();
    else setErroSenha(true);
  }

  function responsavelDe(taskId: string): Responsavel {
    const salvo = estado[taskId]?.responsavel;
    if (salvo !== undefined) return salvo;
    return TASKS.find((t) => t.id === taskId)?.sugestao ?? null;
  }
  function doneDe(taskId: string): boolean {
    return estado[taskId]?.done ?? false;
  }

  async function salvar(taskId: string, patch: Partial<{ responsavel: Responsavel; done: boolean }>) {
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

  // uma tarefa "pertence" à pessoa se for dela OU "ambos"
  function pertence(taskId: string, p: Pessoa): boolean {
    if (p === "todos") return true;
    const r = responsavelDe(taskId);
    return r === p || r === "ambos";
  }

  const progresso = useMemo(() => {
    const total = TASKS.length;
    const feitas = TASKS.filter((t) => doneDe(t.id)).length;
    const contaPessoa = (p: "victor" | "gleyce") => {
      const list = TASKS.filter((t) => pertence(t.id, p));
      return { total: list.length, done: list.filter((t) => doneDe(t.id)).length };
    };
    return { total, feitas, victor: contaPessoa("victor"), gleyce: contaPessoa("gleyce") };
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
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" style={s.gateInput} autoFocus />
          {erroSenha && <p style={s.gateErro}>Senha incorreta.</p>}
          <button type="submit" style={s.gateBtn}>Entrar</button>
        </form>
      </div>
    );
  }
  if (autorizado === null || carregando) {
    return <div style={s.gate}><div style={{ color: "#a3a3a3", fontFamily: "system-ui" }}>Carregando…</div></div>;
  }

  const frentesComTarefas = FRENTES.filter((f) =>
    TASKS.some((t) => t.frente === f.id && pertence(t.id, pessoa))
  );

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <header style={s.header}>
          <div>
            <h1 style={s.h1}>Lançamento LPSG · 1º Ciclo</h1>
            <p style={s.subtitle}>&ldquo;Como Construir um CRM Customizado em 5 Dias&rdquo; · evento 27/jul-3/ago · aulas 7h</p>
          </div>
          <div style={s.progressBadge}>
            <span style={s.progressNum}>{progresso.feitas}/{progresso.total}</span>
            <span style={s.progressLabel}>tarefas concluídas</span>
          </div>
        </header>

        {/* ---------- FLUXO TABARI HORIZONTAL ---------- */}
        <section style={s.fluxoSection}>
          <h2 style={s.h2}>O Método Tabari — as 5 fases</h2>
          <p style={s.fluxoIntro}>A máquina roda toda semana. Cada fase alimenta a próxima: capta a lista, aquece, entrega valor no evento, faz a oferta e abre o carrinho.</p>
          <div className="lpsg-fluxo">
            {FASES_TABARI.map((f) => (
              <div key={f.num} style={{ ...s.fluxoCard, borderTopColor: f.cor }}>
                <div style={{ ...s.fluxoNum, background: f.cor }}>{f.num}</div>
                <div style={s.fluxoData}>{f.data}</div>
                <div style={s.fluxoTitulo}>{f.titulo}</div>
                <div style={s.fluxoDesc}>{f.descricao}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- ABAS DE NÍVEL (topo) ---------- */}
        <nav style={s.abas}>
          {([
            ["operacional", "✅ Checklist Operacional"],
            ["metricas", "📊 Métricas de Tráfego"],
            ["leads", "🎓 Leads & Fichas"],
            ["drive", "📁 Drive de Conteúdo"],
          ] as [Nivel, string][]).map(([n, label]) => (
            <button key={n} onClick={() => setNivel(n)} style={{ ...s.aba, ...(nivel === n ? s.abaAtiva : {}) }}>
              {label}
            </button>
          ))}
        </nav>

        {/* ---------- MÉTRICAS DE TRÁFEGO ---------- */}
        {nivel === "metricas" && <MetricasPainel />}

        {/* ---------- LEADS & FICHAS ---------- */}
        {nivel === "leads" && <LeadsPainel />}

        {/* ---------- SUB-FILTRO DE PESSOA (só no Checklist) ---------- */}
        {nivel === "operacional" && (
          <div style={s.subfiltro}>
            {([
              ["todos", "Todos"],
              ["victor", `Victor · ${progresso.victor.done}/${progresso.victor.total}`],
              ["gleyce", `Gleyce · ${progresso.gleyce.done}/${progresso.gleyce.total}`],
            ] as [Pessoa, string][]).map(([p, label]) => (
              <button key={p} onClick={() => setPessoa(p)} style={{ ...s.subBtn, ...(pessoa === p ? s.subAtivo : {}) }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ---------- DRIVE DE CONTEÚDO ---------- */}
        {nivel === "drive" && (
          <div style={s.driveWrap}>
            <p style={s.driveIntro}>
              Repositório do material do lançamento. Cada item leva ao arquivo no Drive. Itens sem link ainda estão pendentes de upload.{" "}
              <a href="https://drive.google.com/drive/folders/1or08rla9IGvOgzMrbCNCK8T3f3z63t7E" target="_blank" rel="noopener noreferrer" style={s.driveFolderLink}>
                📁 Abrir a pasta no Drive ↗
              </a>
            </p>
            {DRIVE.map((cat) => (
              <section key={cat.id} style={s.driveCat}>
                <h3 style={s.driveCatTitulo}>
                  <span style={s.driveCatEmoji}>{cat.emoji}</span> {cat.titulo}
                  <span style={s.driveCatCount}>
                    {cat.itens.filter((i) => i.url).length}/{cat.itens.length}
                  </span>
                </h3>
                <div style={s.driveGrid}>
                  {cat.itens.map((item) => {
                    const pronto = !!item.url;
                    const Card = (
                      <>
                        <div style={s.driveIconWrap}>
                          <span style={s.driveIcon}>{DRIVE_ICON[item.tipo]}</span>
                        </div>
                        <div style={s.driveBody}>
                          <div style={s.driveNome}>{item.nome}</div>
                          <div style={s.driveDesc}>{item.descricao}</div>
                        </div>
                        <span style={{ ...s.driveStatus, ...(pronto ? s.driveStatusOk : s.driveStatusPend) }}>
                          {pronto ? "abrir ↗" : "adicionar link"}
                        </span>
                      </>
                    );
                    return pronto ? (
                      <a key={item.nome} href={item.url} target="_blank" rel="noopener noreferrer" style={{ ...s.driveItem, ...s.driveItemOk }}>
                        {Card}
                      </a>
                    ) : (
                      <div key={item.nome} style={{ ...s.driveItem, ...s.driveItemPend }}>
                        {Card}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ---------- CONTEÚDO POR FRENTE (só no Checklist) ---------- */}
        {nivel === "operacional" && (
        <div style={s.checklist}>
          <div style={s.legenda}>
            <span style={s.legendaItem}><span style={s.recUnica}>1× só</span> feito uma vez, serve pra todos os ciclos</span>
            <span style={s.legendaItem}><span style={s.recSemanal}>♻️ toda semana</span> repete a cada novo ciclo do LPSG</span>
          </div>
          {frentesComTarefas.map((frente) => {
            const items = TASKS
              .filter((t) => t.frente === frente.id && pertence(t.id, pessoa))
              .sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99));
            return (
              <section key={frente.id} style={s.frenteBloco}>
                <h3 style={s.frenteTitulo}>{frente.titulo}</h3>

                {/* CHECKLIST OPERACIONAL */}
                {nivel === "operacional" && (
                  <div style={s.tasks}>
                    {items.map((t) => {
                      const done = doneDe(t.id);
                      const resp = responsavelDe(t.id);
                      return (
                        <div key={t.id} style={{ ...s.task, ...(done ? s.taskDone : {}), ...(t.pendencia && !done ? s.taskPendencia : {}) }}>
                          <button onClick={() => salvar(t.id, { done: !done })} style={{ ...s.check, ...(done ? s.checkDone : {}) }} aria-label="concluir">
                            {done ? "✓" : ""}
                          </button>
                          <div style={s.taskBody}>
                            <div style={{ ...s.taskLabel, ...(done ? s.taskLabelDone : {}) }}>
                              {t.ordem ? <span style={s.ordem}>{t.ordem}</span> : null}
                              {t.label}
                              {t.recorrencia === "semanal" && (
                                <span style={s.recSemanal} title="Repete a cada ciclo semanal do LPSG">♻️ toda semana</span>
                              )}
                              {t.recorrencia === "unica" && (
                                <span style={s.recUnica} title="Feito uma vez — serve para todos os ciclos">1× só</span>
                              )}
                              {t.pendencia && <span style={s.pendBadge}>pendência</span>}
                              {t.tutorial && (
                                <button onClick={() => setTutorial(t.tutorial!)} style={s.tutBtn} title="ver passo a passo">📖 passo a passo</button>
                              )}
                            </div>
                            {t.detalhe && <div style={s.taskDetalhe}>{t.detalhe}</div>}
                          </div>
                          <div style={s.segmented}>
                            {(["victor", "gleyce", "ambos"] as const).map((p) => (
                              <button
                                key={p}
                                onClick={() => salvar(t.id, { responsavel: resp === p ? null : p })}
                                style={{
                                  ...s.segBtn,
                                  ...(resp === p
                                    ? p === "victor" ? s.segVictor : p === "gleyce" ? s.segGleyce : s.segAmbos
                                    : {}),
                                }}
                              >
                                {NOME[p]}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
          {frentesComTarefas.length === 0 && (
            <p style={s.vazio}>Nenhuma tarefa para esse filtro.</p>
          )}
        </div>
        )}

        <footer style={s.footer}>RedPro AI Academy · Painel interno · alterações salvas automaticamente</footer>
      </div>

      {/* ---------- MODAL DE TUTORIAL ---------- */}
      {tutorial && (
        <div style={s.modalOverlay} onClick={() => setTutorial(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHead}>
              <span style={s.modalTag}>📖 Passo a passo</span>
              <button onClick={() => setTutorial(null)} style={s.modalClose} aria-label="fechar">✕</button>
            </div>
            <h3 style={s.modalTitulo}>{tutorial.titulo}</h3>
            <ol style={s.modalLista}>
              {tutorial.passos.map((p, i) => (
                <li key={i} style={s.modalPasso}>{p}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
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
const AMBOS = "#a855f7";
const PEND = "#f59e0b";

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: BG, color: TXT, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "clamp(16px,4vw,48px) 0" },
  wrap: { maxWidth: 1080, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" },

  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 40 },
  h1: { fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 },
  subtitle: { color: TXT2, fontSize: 15, marginTop: 6 },
  progressBadge: { display: "flex", flexDirection: "column", alignItems: "flex-end", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "12px 18px" },
  progressNum: { fontSize: 26, fontWeight: 800, color: ACCENT, lineHeight: 1 },
  progressLabel: { fontSize: 12, color: TXT3, marginTop: 2 },

  fluxoSection: { marginBottom: 36 },
  h2: { fontSize: 20, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" },
  fluxoIntro: { color: TXT2, fontSize: 14, margin: "0 0 20px", maxWidth: 640, lineHeight: 1.5 },
  fluxoCard: { background: CARD, border: `1px solid ${BORDER}`, borderTop: "3px solid", borderRadius: 12, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
  fluxoNum: { width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff" },
  fluxoData: { fontSize: 10.5, fontWeight: 700, color: ACCENT, letterSpacing: "0.02em", textTransform: "uppercase" },
  fluxoTitulo: { fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 },
  fluxoDesc: { fontSize: 11.5, color: TXT2, lineHeight: 1.4 },

  abas: { display: "flex", gap: 8, marginBottom: 14, borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" },
  aba: { background: "transparent", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: "transparent", color: TXT2, fontSize: 15, fontWeight: 600, padding: "10px 14px", cursor: "pointer", marginBottom: -1, fontFamily: "inherit" },
  abaAtiva: { color: TXT, borderBottomColor: ACCENT },

  subfiltro: { display: "flex", gap: 6, marginBottom: 24, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, width: "fit-content", flexWrap: "wrap" },
  subBtn: { background: "transparent", border: "none", color: TXT2, fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontFamily: "inherit" },
  subAtivo: { background: BG, color: TXT },

  checklist: { display: "flex", flexDirection: "column", gap: 24 },
  legenda: { display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px" },
  legendaItem: { display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: TXT2 },
  frenteBloco: {},
  frenteTitulo: { fontSize: 16, fontWeight: 700, margin: "0 0 10px" },

  nivelBox: { background: SURFACE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}`, borderRadius: 10, padding: "14px 16px" },
  nivelTag: { fontSize: 11.5, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.03em" },
  nivelTexto: { fontSize: 14, color: TXT2, lineHeight: 1.6, margin: "6px 0 0" },

  tasks: { display: "flex", flexDirection: "column", gap: 8 },
  task: { display: "flex", alignItems: "center", gap: 12, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px" },
  taskDone: { opacity: 0.55 },
  taskPendencia: { borderColor: "rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.05)" },
  check: { width: 24, height: 24, minWidth: 24, borderRadius: 7, border: `1.5px solid ${TXT3}`, background: "transparent", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 },
  checkDone: { background: ACCENT, borderColor: ACCENT },
  taskBody: { flex: 1, minWidth: 0 },
  taskLabel: { fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  taskLabelDone: { textDecoration: "line-through" },
  taskDetalhe: { fontSize: 12.5, color: TXT3, marginTop: 3, lineHeight: 1.4 },
  ordem: { width: 20, height: 20, minWidth: 20, borderRadius: 6, background: ACCENT, color: "#fff", fontSize: 11.5, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" },
  pendBadge: { fontSize: 10.5, fontWeight: 700, color: PEND, background: "rgba(245,158,11,0.15)", padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.02em" },
  recSemanal: { fontSize: 10.5, fontWeight: 700, color: "#38bdf8", background: "rgba(56,189,248,0.14)", padding: "2px 8px", borderRadius: 20, letterSpacing: "0.01em", whiteSpace: "nowrap" },
  recUnica: { fontSize: 10.5, fontWeight: 700, color: TXT2, background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 20, letterSpacing: "0.01em", whiteSpace: "nowrap" },
  tutBtn: { fontSize: 11.5, fontWeight: 600, color: ACCENT, background: "rgba(249,115,22,0.12)", border: "none", padding: "3px 9px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" },

  segmented: { display: "flex", gap: 4, background: BG, borderRadius: 9, padding: 3, border: `1px solid ${BORDER}`, flexShrink: 0 },
  segBtn: { border: "none", background: "transparent", color: TXT2, fontSize: 12, fontWeight: 600, padding: "5px 9px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" },
  segVictor: { background: VICTOR, color: "#fff" },
  segGleyce: { background: GLEYCE, color: "#fff" },
  segAmbos: { background: AMBOS, color: "#fff" },

  vazio: { color: TXT3, textAlign: "center", padding: 40, fontSize: 14 },
  footer: { marginTop: 48, paddingTop: 20, borderTop: `1px solid ${BORDER}`, color: TXT3, fontSize: 12.5, textAlign: "center" },

  // drive de conteúdo
  driveWrap: { display: "flex", flexDirection: "column", gap: 28 },
  driveIntro: { color: TXT2, fontSize: 13.5, lineHeight: 1.5, margin: "0 0 4px", maxWidth: 680 },
  driveFolderLink: { color: ACCENT, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" },
  driveCat: {},
  driveCatTitulo: { fontSize: 15, fontWeight: 700, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 },
  driveCatEmoji: { fontSize: 17 },
  driveCatCount: { fontSize: 11.5, fontWeight: 700, color: TXT3, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "2px 9px", marginLeft: 2 },
  driveGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 },
  driveItem: { display: "flex", alignItems: "center", gap: 12, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", textDecoration: "none", color: "inherit" },
  driveItemOk: { cursor: "pointer" },
  driveItemPend: { opacity: 0.62, borderStyle: "dashed" },
  driveIconWrap: { width: 38, height: 38, minWidth: 38, borderRadius: 9, background: BG, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" },
  driveIcon: { fontSize: 18 },
  driveBody: { flex: 1, minWidth: 0 },
  driveNome: { fontSize: 14, fontWeight: 700, lineHeight: 1.3 },
  driveDesc: { fontSize: 12, color: TXT3, marginTop: 2, lineHeight: 1.4 },
  driveStatus: { fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 },
  driveStatusOk: { color: ACCENT, background: "rgba(249,115,22,0.12)" },
  driveStatusPend: { color: TXT3, background: "rgba(255,255,255,0.04)", border: `1px dashed ${BORDER}` },

  // modal
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 },
  modal: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTag: { fontSize: 11.5, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.03em" },
  modalClose: { background: "transparent", border: "none", color: TXT2, fontSize: 18, cursor: "pointer", lineHeight: 1 },
  modalTitulo: { fontSize: 19, fontWeight: 700, margin: "0 0 16px" },
  modalLista: { margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 10 },
  modalPasso: { fontSize: 14, color: TXT2, lineHeight: 1.5 },

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
