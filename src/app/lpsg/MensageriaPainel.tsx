"use client";

import { useEffect, useState } from "react";

/**
 * Aba "Mensageria" do painel /lpsg — FONTE ÚNICA (disparos_grupo).
 *
 * Agora o painel é a janela da automação, não um sistema paralelo. Cada card é
 * um disparo real que o cron /api/cron/disparos-grupo vai postar no grupo no
 * horário certo — SE aprovado. O que você edita aqui é exatamente o que sai.
 *
 * Você pode: editar o texto e o nome do grupo, aprovar/desaprovar pelo painel
 * (equivale ao link do Telegram) e ver o status real (aguardando/aprovado/
 * enviado/falhou). NÃO há botão de "disparar agora" — quem posta é o cron, com
 * os guardrails de horário e verificação de falha.
 */

type Disparo = {
  id: number;
  ciclo: string;
  tipo_grupo: string;
  agendar_em: string;
  novo_nome: string | null;
  texto: string | null;
  ordem: number;
  aprovado: boolean;
  status: string;
  entrega: string | null;
  erro: string | null;
};

const STATUS_INFO: Record<string, { label: string; cor: string }> = {
  aguardando: { label: "⏳ aguardando aprovação", cor: "#a3a3a3" },
  aprovado: { label: "✅ aprovado (vai disparar)", cor: "#4ADE80" },
  enviado: { label: "📤 enviado", cor: "#38bdf8" },
  falhou: { label: "🔴 falhou", cor: "#ef4444" },
  expirado: { label: "⏱️ expirou sem aprovação", cor: "#f59e0b" },
};

function horaBRT(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short", day: "2-digit", month: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function MensageriaPainel() {
  const [disparos, setDisparos] = useState<Disparo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [rascunho, setRascunho] = useState("");
  const [copiado, setCopiado] = useState<number | null>(null);

  async function carregar() {
    try {
      const res = await fetch("/api/lpsg/disparos", { cache: "no-store" });
      const j = await res.json();
      if (!j.ok) { setErro(j.erro || "falha"); return; }
      setDisparos(j.disparos || []);
    } catch (e) { setErro(String(e)); }
    finally { setCarregando(false); }
  }
  useEffect(() => { carregar(); }, []);

  async function salvar(id: number) {
    await fetch("/api/lpsg/disparos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, texto: rascunho }),
    });
    setEditId(null);
    carregar();
  }

  async function aprovar(id: number, aprovado: boolean) {
    await fetch("/api/lpsg/disparos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, aprovado }),
    });
    carregar();
  }

  function copiar(d: Disparo) {
    navigator.clipboard.writeText(d.texto || "");
    setCopiado(d.id);
    setTimeout(() => setCopiado(null), 1500);
  }

  if (carregando) return <p style={s.info}>Carregando disparos…</p>;
  if (erro) return <p style={{ ...s.info, color: "#ef4444" }}>Erro: {erro}</p>;

  // Agrupa por tipo (carrinho / semana) pra leitura.
  const grupos = Array.from(new Set(disparos.map((d) => d.tipo_grupo)));

  return (
    <div>
      <p style={s.aviso}>
        Cada card é um disparo real. O cron posta no grupo no horário, <b>só se aprovado</b>.
        O que você edita aqui é exatamente o que sai. Aprove pelo botão ou pelo link do Telegram.
        Os <code>[LINK-CHECKOUT]</code> / <code>[LINK-AULA-N]</code> troque pelo link real antes de aprovar.
      </p>

      {grupos.map((tipo) => (
        <div key={tipo} style={{ marginBottom: 26 }}>
          <h3 style={s.grupoTitulo}>
            {tipo === "carrinho" ? "🛒 Grupo Carrinho" : tipo === "semana" ? "📚 Grupo Semana" : tipo}
          </h3>

          {disparos.filter((d) => d.tipo_grupo === tipo).map((d) => {
            const editando = editId === d.id;
            const st = STATUS_INFO[d.status] || { label: d.status, cor: "#a3a3a3" };
            const enviado = d.status === "enviado";
            const travado = ["enviado", "falhou", "expirado"].includes(d.status);
            return (
              <div key={d.id} style={{ ...s.card, ...(enviado ? s.cardEnviada : {}) }}>
                <div style={s.head}>
                  <div>
                    <span style={s.quando}>{horaBRT(d.agendar_em)}</span>
                    <span style={s.fase}>#{d.ordem}</span>
                  </div>
                  <span style={{ ...s.badge, color: st.cor }}>{st.label}</span>
                </div>

                {d.novo_nome && (
                  <div style={s.nomeGrupo}>📛 Nome do grupo vira: <b>{d.novo_nome}</b></div>
                )}

                {editando ? (
                  <>
                    <textarea
                      style={s.textarea}
                      value={rascunho}
                      onChange={(e) => setRascunho(e.target.value)}
                      rows={Math.max(4, rascunho.split("\n").length + 1)}
                    />
                    <div style={s.acoes}>
                      <button style={s.btnSalvar} onClick={() => salvar(d.id)}>Salvar</button>
                      <button style={s.btnGhost} onClick={() => setEditId(null)}>Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <pre style={s.texto}>{d.texto || "(só troca o nome do grupo)"}</pre>
                    {d.erro && <div style={s.erroBox}>⚠️ {d.erro}</div>}
                    <div style={s.acoes}>
                      <button style={s.btnCopiar} onClick={() => copiar(d)}>
                        {copiado === d.id ? "✓ copiado" : "📋 copiar"}
                      </button>
                      {!travado && (
                        <button style={s.btnGhost} onClick={() => { setEditId(d.id); setRascunho(d.texto || ""); }}>
                          ✏️ editar
                        </button>
                      )}
                      {!travado && (
                        d.aprovado ? (
                          <button style={s.btnDesaprovar} onClick={() => aprovar(d.id, false)}>
                            ↩️ desaprovar
                          </button>
                        ) : (
                          <button style={s.btnAprovar} onClick={() => aprovar(d.id, true)}>
                            ✅ aprovar disparo
                          </button>
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {!disparos.length && <p style={s.info}>Nenhum disparo agendado ainda.</p>}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  info: { color: "#a3a3a3", padding: "40px 0", textAlign: "center", fontSize: 15 },
  aviso: { color: "#a3a3a3", fontSize: 13.5, marginBottom: 18, lineHeight: 1.6 },
  grupoTitulo: { color: "#f5f5f5", fontSize: 15, fontWeight: 800, marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid #1f1f1f" },
  card: { background: "#141414", border: "1px solid #1f1f1f", borderRadius: 14, padding: 18, marginBottom: 14 },
  cardEnviada: { opacity: 0.6 },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8, flexWrap: "wrap" },
  quando: { color: "#F97316", fontWeight: 800, fontSize: 14, marginRight: 10 },
  fase: { color: "#737373", fontSize: 13 },
  badge: { fontSize: 12, fontWeight: 700 },
  nomeGrupo: { background: "#0f0f0f", border: "1px dashed #333", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#d4d4d4", marginBottom: 10 },
  texto: { whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 14, color: "#f5f5f5", lineHeight: 1.55, margin: 0, background: "#0d0d0d", borderRadius: 8, padding: 14 },
  erroBox: { marginTop: 10, background: "#2a0f0f", border: "1px solid #5b1a1a", borderRadius: 8, padding: "8px 12px", fontSize: 12.5, color: "#fca5a5" },
  textarea: { width: "100%", background: "#0d0d0d", border: "1px solid #333", borderRadius: 8, padding: 14, color: "#f5f5f5", fontSize: 14, fontFamily: "inherit", lineHeight: 1.55, resize: "vertical" },
  acoes: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  btnCopiar: { background: "#F97316", color: "#080808", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnSalvar: { background: "#4ADE80", color: "#080808", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnAprovar: { background: "#4ADE80", color: "#080808", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnDesaprovar: { background: "transparent", color: "#f59e0b", fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "1px solid #5b3a1a", cursor: "pointer" },
  btnGhost: { background: "transparent", color: "#a3a3a3", fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "1px solid #333", cursor: "pointer" },
};
