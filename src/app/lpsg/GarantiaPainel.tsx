"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Aba "Garantia 90 dias" do painel /lpsg.
 *
 * Mostra o progresso dos 6 marcos do Protocolo de Garantia por aluno da Formação.
 * Elegível a reembolso = 6 marcos concluídos (com prova) E ainda sem cliente —
 * o "sem cliente" é aferição manual do Red; aqui a aba só mostra os marcos.
 *
 * Fonte: /api/lpsg/garantia (view garantia_resumo + tabela garantia_marcos).
 * marco_id é estável (1..6) — ver garantia_marcos.sql.
 */

const MARCOS: { id: number; nome: string; janela: string }[] = [
  { id: 1, nome: "Nicho + oferta", janela: "dia 15" },
  { id: 2, nome: "Material de prospecção", janela: "dia 25" },
  { id: 3, nome: "Abordou 30 empresas", janela: "dia 55" },
  { id: 4, nome: "Follow-ups", janela: "dia 70" },
  { id: 5, nome: "≥3 propostas enviadas", janela: "dia 85" },
  { id: 6, nome: "Encontros ao vivo", janela: "contínuo" },
];

type Resumo = {
  email: string; nome: string | null;
  marcos_concluidos: number; marcos_total: number;
  todos_concluidos: boolean; ultima_atividade: string | null;
};

type Marco = {
  email: string; nome: string | null; marco_id: number;
  done: boolean; prova_url: string | null; observacao: string | null; updated_at: string;
};

export default function GarantiaPainel() {
  const [resumo, setResumo] = useState<Resumo[]>([]);
  const [marcos, setMarcos] = useState<Marco[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/lpsg/garantia", { cache: "no-store" });
        const j = await res.json();
        if (!j.ok) { setErro(j.erro || "falha ao carregar"); return; }
        setResumo(j.resumo || []);
        setMarcos(j.marcos || []);
      } catch (e) {
        setErro(String(e));
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  // Mapa: email → { marco_id → Marco } para o grid.
  const porAluno = useMemo(() => {
    const m: Record<string, Record<number, Marco>> = {};
    for (const x of marcos) {
      (m[x.email] ||= {})[x.marco_id] = x;
    }
    return m;
  }, [marcos]);

  if (carregando) return <p style={s.info}>Carregando garantia…</p>;
  if (erro) return <p style={{ ...s.info, color: "#ef4444" }}>Erro: {erro}</p>;
  if (!resumo.length) return <p style={s.info}>Nenhum aluno registrado na garantia ainda.</p>;

  const elegiveis = resumo.filter((r) => r.todos_concluidos).length;

  return (
    <div>
      <div style={s.stats}>
        <div style={s.stat}><b>{resumo.length}</b><span>alunos</span></div>
        <div style={s.stat}><b style={{ color: "#4ADE80" }}>{elegiveis}</b><span>6/6 marcos</span></div>
      </div>

      <div style={s.tabelaWrap}>
        <table style={s.tabela}>
          <thead>
            <tr>
              <th style={{ ...s.th, textAlign: "left" }}>Aluno</th>
              {MARCOS.map((m) => (
                <th key={m.id} style={s.th} title={`${m.nome} · ${m.janela}`}>{m.id}</th>
              ))}
              <th style={s.th}>Progresso</th>
            </tr>
          </thead>
          <tbody>
            {resumo.map((r) => (
              <tr key={r.email}>
                <td style={{ ...s.td, textAlign: "left" }}>
                  <b>{r.nome || "—"}</b>
                  <div style={s.email}>{r.email}</div>
                </td>
                {MARCOS.map((m) => {
                  const x = porAluno[r.email]?.[m.id];
                  const done = x?.done;
                  return (
                    <td key={m.id} style={s.td} title={x?.observacao || m.nome}>
                      <span style={{ ...s.dot, background: done ? "#4ADE80" : "#2a2a2a" }}>
                        {done ? "✓" : ""}
                      </span>
                    </td>
                  );
                })}
                <td style={s.td}>
                  <b style={{ color: r.todos_concluidos ? "#4ADE80" : "#f5f5f5" }}>
                    {r.marcos_concluidos}/{r.marcos_total}
                  </b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.legenda}>
        {MARCOS.map((m) => (
          <span key={m.id} style={s.legItem}><b>{m.id}</b> {m.nome} <i style={s.janela}>({m.janela})</i></span>
        ))}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  info: { color: "#a3a3a3", padding: "40px 0", textAlign: "center", fontSize: 15 },
  stats: { display: "flex", gap: 14, marginBottom: 20 },
  stat: { background: "#141414", border: "1px solid #1f1f1f", borderRadius: 12, padding: "14px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  tabelaWrap: { overflowX: "auto", border: "1px solid #1f1f1f", borderRadius: 12 },
  tabela: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "12px 10px", textAlign: "center", color: "#a3a3a3", fontWeight: 700, fontSize: 12, borderBottom: "1px solid #1f1f1f", whiteSpace: "nowrap" },
  td: { padding: "12px 10px", textAlign: "center", borderBottom: "1px solid #161616", color: "#f5f5f5" },
  email: { color: "#737373", fontSize: 12, marginTop: 2 },
  dot: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", color: "#080808", fontSize: 13, fontWeight: 900 },
  legenda: { display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 16, color: "#a3a3a3", fontSize: 12.5 },
  legItem: { whiteSpace: "nowrap" },
  janela: { color: "#525252", fontStyle: "normal" },
};
