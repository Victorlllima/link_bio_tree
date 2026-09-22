"use client";
import { useState } from "react";

type Estado = "form" | "carregando" | "resultado" | "erro";

export default function MeuSoul() {
  const [estado, setEstado] = useState<Estado>("form");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [contexto, setContexto] = useState("");
  const [soul, setSoul] = useState("");
  const [erroMsg, setErroMsg] = useState("");
  const [copiado, setCopiado] = useState(false);

  async function gerar(e: React.FormEvent) {
    e.preventDefault();
    setErroMsg("");

    if (!/.+@.+\..+/.test(email)) {
      setErroMsg("Coloca um e-mail válido.");
      return;
    }
    if (!nome.trim()) {
      setErroMsg("Coloca seu nome.");
      return;
    }
    if (contexto.trim().length < 20) {
      setErroMsg("Conta um pouco mais sobre você e o que você quer automatizar (mínimo 20 caracteres).");
      return;
    }

    setEstado("carregando");

    try {
      const res = await fetch("/api/soul/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nome, contexto }),
      });

      const data = await res.json() as { soul?: string; erro?: string };

      if (!res.ok || !data.soul) {
        setErroMsg(data.erro || "Algo deu errado. Tenta de novo.");
        setEstado("erro");
        return;
      }

      setSoul(data.soul);
      setEstado("resultado");
    } catch {
      setErroMsg("Sem conexão. Verifica a internet e tenta de novo.");
      setEstado("erro");
    }
  }

  function copiar() {
    navigator.clipboard.writeText(soul).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  }

  function reiniciar() {
    setSoul("");
    setErroMsg("");
    setEstado("form");
  }

  return (
    <main style={s.page}>
      <div style={s.grid} />

      {/* nav */}
      <nav style={s.nav}>
        <a href="/" style={s.brand}>
          <span style={s.av}>R</span>
          <span>RedPro</span>
        </a>
        <span style={s.badge}>● SOUL GENERATOR</span>
      </nav>

      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.pill}>Produto exclusivo — 50 casos de uso do Hermes</div>
          <h1 style={s.h1}>Seu SOUL do Hermes,<br />gerado agora.</h1>
          <p style={s.lead}>
            O SOUL é o coração do seu agente. Define quem ele é, como fala e o que prioriza.
            Preenche os campos abaixo e em 30 segundos você tem o seu, pronto pra usar.
          </p>
        </div>
      </section>

      <div style={s.wrap}>
        {/* ── FORMULÁRIO ── */}
        {(estado === "form" || estado === "carregando") && (
          <form onSubmit={gerar} style={s.card}>
            <div style={s.field}>
              <label style={s.label}>E-mail da compra</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o mesmo e-mail que você usou na compra"
                style={s.input}
                disabled={estado === "carregando"}
                autoFocus
              />
              <span style={s.hint}>Esse é o gate de acesso — tem que ser o e-mail da Hotmart.</span>
            </div>

            <div style={s.field}>
              <label style={s.label}>Seu nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="como você quer que o SOUL te chame"
                style={s.input}
                disabled={estado === "carregando"}
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Quem você é e o que quer automatizar</label>
              <textarea
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder={`Ex: "Sou designer freelancer e quero automatizar propostas de projeto, acompanhamento de clientes e controle de tarefas. Uso muito Notion e quero integrar com email."`}
                style={s.textarea}
                rows={5}
                disabled={estado === "carregando"}
              />
              <span style={s.hint}>
                Quanto mais você contar, melhor o SOUL. Área de atuação, ferramentas que usa,
                o que trava no dia a dia — tudo ajuda.
              </span>
            </div>

            {erroMsg && estado === "form" && (
              <div style={s.erroBox}>{erroMsg}</div>
            )}

            <button
              type="submit"
              disabled={estado === "carregando"}
              style={{ ...s.btn, opacity: estado === "carregando" ? 0.7 : 1, cursor: estado === "carregando" ? "not-allowed" : "pointer" }}
            >
              {estado === "carregando" ? (
                <span style={s.loadingRow}>
                  <span style={s.spinner} />
                  Gerando seu SOUL com Claude Opus...
                </span>
              ) : (
                "Gerar meu SOUL →"
              )}
            </button>

            {estado === "carregando" && (
              <p style={s.loadingNote}>
                Isso leva uns 20-30 segundos. O Claude tá criando algo personalizado pra você.
              </p>
            )}
          </form>
        )}

        {/* ── RESULTADO ── */}
        {estado === "resultado" && (
          <div style={s.card}>
            <div style={s.resultHeader}>
              <span style={s.checkIcon}>✓</span>
              <div>
                <div style={s.resultTitle}>Seu SOUL foi gerado</div>
                <div style={s.resultSub}>Copia o bloco abaixo e joga no Hermes como seu system prompt de identidade.</div>
              </div>
            </div>

            <div style={s.soulBox}>
              <pre style={s.soulText}>{soul}</pre>
            </div>

            <div style={s.resultActions}>
              <button onClick={copiar} style={s.btnCopiar}>
                {copiado ? "✓ Copiado!" : "Copiar SOUL"}
              </button>
              <button onClick={reiniciar} style={s.btnReiniciar}>
                Gerar outro
              </button>
            </div>

            <div style={s.instrucoes}>
              <div style={s.instrTitulo}>Como usar no Hermes</div>
              <div style={s.instrItem}>
                <span style={s.instrNum}>1</span>
                Abre o Hermes e vai em <strong>Settings → System Prompt</strong> (ou no perfil do seu agente)
              </div>
              <div style={s.instrItem}>
                <span style={s.instrNum}>2</span>
                Cola o texto acima no campo de identidade do agente
              </div>
              <div style={s.instrItem}>
                <span style={s.instrNum}>3</span>
                Salva e começa a conversa — o agente já vai operar com a identidade do seu SOUL
              </div>
            </div>
          </div>
        )}

        {/* ── ERRO ── */}
        {estado === "erro" && (
          <div style={s.card}>
            <div style={s.erroGrande}>
              <div style={s.erroIcone}>⚠</div>
              <div style={s.erroTitulo}>Não consegui gerar agora</div>
              <div style={s.erroDetalhe}>{erroMsg}</div>
              <button onClick={reiniciar} style={s.btn}>
                Tentar de novo
              </button>
            </div>
          </div>
        )}
      </div>

      <footer style={s.footer}>
        RedPro AI Academy · SOUL Generator · powered by Claude Opus
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Estilos (mesmo sistema do vault e das outras páginas: inline, sem cn())
// ─────────────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#f4f2ef",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(139,92,246,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.04) 1px,transparent 1px)",
    backgroundSize: "44px 44px",
    opacity: 0.7,
    pointerEvents: "none",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    maxWidth: 720,
    margin: "0 auto",
    position: "sticky",
    top: 0,
    background: "rgba(8,8,8,.9)",
    backdropFilter: "blur(12px)",
    zIndex: 30,
    borderBottom: "1px solid rgba(255,255,255,.07)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 700,
    fontSize: "1.1rem",
    textDecoration: "none",
    color: "#f4f2ef",
  },
  av: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#8B5CF6,#6d28d9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.9rem",
  },
  badge: {
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: 10,
    letterSpacing: ".12em",
    color: "#8B5CF6",
    border: "1px solid rgba(139,92,246,.3)",
    padding: "5px 10px",
    borderRadius: 6,
  },
  hero: {
    padding: "44px 20px 24px",
    background: "radial-gradient(110% 80% at 60% 0%, rgba(139,92,246,.12), transparent 55%)",
    position: "relative",
    zIndex: 1,
  },
  heroInner: {
    maxWidth: 680,
    margin: "0 auto",
  },
  pill: {
    display: "inline-block",
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: 11,
    letterSpacing: ".08em",
    color: "#8B5CF6",
    border: "1px solid rgba(139,92,246,.3)",
    background: "rgba(139,92,246,.08)",
    padding: "5px 12px",
    borderRadius: 100,
    marginBottom: 16,
  },
  h1: {
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 700,
    fontSize: "clamp(2rem,6vw,2.8rem)",
    lineHeight: 1.05,
    letterSpacing: "-.025em",
    margin: "0 0 14px",
  },
  lead: {
    fontSize: "1.05rem",
    color: "#b6b3ad",
    maxWidth: "56ch",
    lineHeight: 1.55,
    margin: 0,
  },
  wrap: {
    maxWidth: 680,
    margin: "32px auto 0",
    padding: "0 20px 80px",
    position: "relative",
    zIndex: 1,
  },
  card: {
    background: "#0f0f10",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 20,
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 22,
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  label: {
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 600,
    fontSize: ".92rem",
    color: "#e0ddd8",
  },
  hint: {
    fontSize: ".82rem",
    color: "#726f69",
    lineHeight: 1.45,
  },
  input: {
    background: "#161617",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 12,
    padding: "13px 16px",
    color: "#f4f2ef",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: ".95rem",
    outline: "none",
    transition: "border-color .15s",
  },
  textarea: {
    background: "#161617",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 12,
    padding: "13px 16px",
    color: "#f4f2ef",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: ".95rem",
    outline: "none",
    resize: "vertical" as const,
    lineHeight: 1.55,
  },
  erroBox: {
    background: "rgba(239,68,68,.08)",
    border: "1px solid rgba(239,68,68,.3)",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: ".88rem",
    color: "#f87171",
  },
  btn: {
    background: "linear-gradient(135deg,#8B5CF6,#7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "16px 28px",
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  },
  loadingNote: {
    textAlign: "center" as const,
    color: "#726f69",
    fontSize: ".85rem",
    margin: "-8px 0 0",
    lineHeight: 1.5,
  },
  // resultado
  resultHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
  },
  checkIcon: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(139,92,246,.15)",
    border: "1px solid rgba(139,92,246,.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8B5CF6",
    fontSize: "1.2rem",
    fontWeight: 700,
    flexShrink: 0,
  },
  resultTitle: {
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 700,
    fontSize: "1.15rem",
    marginBottom: 4,
  },
  resultSub: {
    fontSize: ".88rem",
    color: "#b6b3ad",
    lineHeight: 1.45,
  },
  soulBox: {
    background: "#161617",
    border: "1px solid rgba(139,92,246,.2)",
    borderRadius: 14,
    padding: "20px",
    maxHeight: 420,
    overflowY: "auto" as const,
  },
  soulText: {
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: ".82rem",
    lineHeight: 1.7,
    color: "#d1cec9",
    whiteSpace: "pre-wrap" as const,
    margin: 0,
  },
  resultActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap" as const,
  },
  btnCopiar: {
    flex: 1,
    minWidth: 140,
    background: "linear-gradient(135deg,#8B5CF6,#7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "14px 22px",
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 600,
    fontSize: ".95rem",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  btnReiniciar: {
    flex: 1,
    minWidth: 140,
    background: "none",
    color: "#b6b3ad",
    border: "1px solid rgba(255,255,255,.14)",
    borderRadius: 100,
    padding: "14px 22px",
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 600,
    fontSize: ".95rem",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  instrucoes: {
    background: "rgba(139,92,246,.05)",
    border: "1px solid rgba(139,92,246,.15)",
    borderRadius: 14,
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  instrTitulo: {
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 700,
    fontSize: ".95rem",
    color: "#8B5CF6",
    marginBottom: 4,
  },
  instrItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    fontSize: ".88rem",
    color: "#b6b3ad",
    lineHeight: 1.5,
  },
  instrNum: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "rgba(139,92,246,.2)",
    border: "1px solid rgba(139,92,246,.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8B5CF6",
    fontSize: ".75rem",
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
  },
  // erro grande
  erroGrande: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 16,
    padding: "12px 0",
    textAlign: "center" as const,
  },
  erroIcone: {
    fontSize: "2rem",
    color: "#f59e0b",
  },
  erroTitulo: {
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 700,
    fontSize: "1.1rem",
  },
  erroDetalhe: {
    fontSize: ".9rem",
    color: "#b6b3ad",
    maxWidth: "40ch",
    lineHeight: 1.5,
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,.07)",
    padding: "20px 20px 40px",
    textAlign: "center" as const,
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: 11,
    color: "#726f69",
    position: "relative",
    zIndex: 1,
  },
};
