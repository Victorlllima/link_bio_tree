"use client";

import { useEffect, useState } from "react";

/**
 * Aba "Mensageria" do painel /lpsg — cronograma do grupo, editável na página.
 *
 * Cada card = um disparo do ciclo (data + fase + nome do grupo + texto).
 * A Gleyce edita o texto direto aqui (salva no banco), copia com 1 clique, e
 * marca como enviada. Botão "disparar no grupo" existe mas exige o segredo —
 * fica atrás de um prompt, pra não disparar sem querer.
 */

type Msg = {
  id: number; ordem: number; quando: string; fase: string;
  nome_grupo: string | null; texto: string;
  enviada: boolean; enviada_em: string | null;
};

export default function MensageriaPainel() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [rascunho, setRascunho] = useState("");
  const [copiado, setCopiado] = useState<number | null>(null);

  async function carregar() {
    try {
      const res = await fetch("/api/lpsg/mensageria", { cache: "no-store" });
      const j = await res.json();
      if (!j.ok) { setErro(j.erro || "falha"); return; }
      setMsgs(j.msgs || []);
    } catch (e) { setErro(String(e)); }
    finally { setCarregando(false); }
  }
  useEffect(() => { carregar(); }, []);

  async function salvar(id: number) {
    await fetch("/api/lpsg/mensageria", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, texto: rascunho }),
    });
    setEditId(null);
    carregar();
  }

  async function marcar(id: number, enviada: boolean) {
    await fetch("/api/lpsg/mensageria", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enviada }),
    });
    carregar();
  }

  function copiar(m: Msg) {
    navigator.clipboard.writeText(m.texto);
    setCopiado(m.id);
    setTimeout(() => setCopiado(null), 1500);
  }

  if (carregando) return <p style={s.info}>Carregando mensageria…</p>;
  if (erro) return <p style={{ ...s.info, color: "#ef4444" }}>Erro: {erro}</p>;

  return (
    <div>
      <p style={s.aviso}>
        Cada card é um disparo do ciclo, na ordem. Edite o texto direto aqui, copie com 1 clique e cole no grupo.
        Os <code>[LINK-AULA-N]</code> você troca pelo link do YouTube na hora.
      </p>

      {msgs.map((m) => {
        const editando = editId === m.id;
        return (
          <div key={m.id} style={{ ...s.card, ...(m.enviada ? s.cardEnviada : {}) }}>
            <div style={s.head}>
              <div>
                <span style={s.quando}>{m.quando}</span>
                <span style={s.fase}>{m.fase}</span>
              </div>
              {m.enviada && <span style={s.badgeEnviada}>✓ enviada</span>}
            </div>

            {m.nome_grupo && (
              <div style={s.nomeGrupo}>📛 Trocar nome do grupo: <b>{m.nome_grupo}</b></div>
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
                  <button style={s.btnSalvar} onClick={() => salvar(m.id)}>Salvar</button>
                  <button style={s.btnGhost} onClick={() => setEditId(null)}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <pre style={s.texto}>{m.texto}</pre>
                <div style={s.acoes}>
                  <button style={s.btnCopiar} onClick={() => copiar(m)}>
                    {copiado === m.id ? "✓ copiado" : "📋 copiar"}
                  </button>
                  <button style={s.btnGhost} onClick={() => { setEditId(m.id); setRascunho(m.texto); }}>
                    ✏️ editar
                  </button>
                  <button style={s.btnGhost} onClick={() => marcar(m.id, !m.enviada)}>
                    {m.enviada ? "↩️ desmarcar" : "✓ marcar enviada"}
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  info: { color: "#a3a3a3", padding: "40px 0", textAlign: "center", fontSize: 15 },
  aviso: { color: "#a3a3a3", fontSize: 13.5, marginBottom: 18, lineHeight: 1.6 },
  card: { background: "#141414", border: "1px solid #1f1f1f", borderRadius: 14, padding: 18, marginBottom: 14 },
  cardEnviada: { opacity: 0.55 },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  quando: { color: "#F97316", fontWeight: 800, fontSize: 14, marginRight: 10 },
  fase: { color: "#737373", fontSize: 13 },
  badgeEnviada: { color: "#4ADE80", fontSize: 12, fontWeight: 700 },
  nomeGrupo: { background: "#0f0f0f", border: "1px dashed #333", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#d4d4d4", marginBottom: 10 },
  texto: { whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 14, color: "#f5f5f5", lineHeight: 1.55, margin: 0, background: "#0d0d0d", borderRadius: 8, padding: 14 },
  textarea: { width: "100%", background: "#0d0d0d", border: "1px solid #333", borderRadius: 8, padding: 14, color: "#f5f5f5", fontSize: 14, fontFamily: "inherit", lineHeight: 1.55, resize: "vertical" },
  acoes: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  btnCopiar: { background: "#F97316", color: "#080808", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnSalvar: { background: "#4ADE80", color: "#080808", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnGhost: { background: "transparent", color: "#a3a3a3", fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "1px solid #333", cursor: "pointer" },
};
