"use client";
import { useState } from "react";
import Link from "next/link";
import type { Resource, Bloco } from "@/data/vault-resources";

function BlocoView({ bloco }: { bloco: Bloco }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(bloco.conteudo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {}
  }
  return (
    <div style={s.bloco}>
      {bloco.titulo && <div style={s.blocoTitulo}>{bloco.titulo}</div>}
      <div style={{ ...s.blocoBody, ...(bloco.tipo === "codigo" ? s.codigo : {}) }}>{bloco.conteudo}</div>
      <button onClick={copiar} style={{ ...s.copyBtn, ...(copiado ? s.copyOn : {}) }}>
        {copiado ? "Copiado ✓" : "Copiar"}
      </button>
    </div>
  );
}

export default function ResourceView({ resource }: { resource: Resource }) {
  return (
    <main style={s.page}>
      <div style={s.topbar}>
        <Link href="/vault" style={s.back}>← Voltar ao vault</Link>
      </div>
      <article style={s.article}>
        <div style={s.tags}>
          <span style={s.tagCat}>{resource.categoria}</span>
        </div>
        <h1 style={s.h1}>{resource.titulo}</h1>
        <p style={s.intro}>{resource.intro}</p>

        <div style={s.readfirst}>
          <strong style={{ color: "#f4f2ef" }}>Leia primeiro:</strong> não tem nada pra baixar. Tá tudo aqui em blocos.
          Clica em Copiar num bloco, abre um doc ou arquivo de texto, cola, salva. Esse é o arquivo. Simples assim.
        </div>

        {resource.blocos.map((b, i) => <BlocoView key={i} bloco={b} />)}

        <div style={s.footer}>
          <p style={s.footerP}>Isso é 1 dos resources do RedVault. Tem mais lá dentro, e entra coisa nova toda semana.</p>
          <Link href="/vault" style={s.footerBtn}>Ver o vault inteiro →</Link>
        </div>
      </article>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080808", color: "#f4f2ef", fontFamily: "'DM Sans',system-ui,sans-serif" },
  topbar: { borderBottom: "1px solid rgba(255,255,255,.08)", padding: "14px 20px", position: "sticky", top: 0, background: "rgba(8,8,8,.9)", backdropFilter: "blur(12px)", zIndex: 30 },
  back: { color: "#b6b3ad", textDecoration: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 },
  article: { maxWidth: 680, margin: "0 auto", padding: "36px 20px 70px" },
  tags: { display: "flex", gap: 8, marginBottom: 16 },
  tagCat: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 6, color: "#f97316", border: "1px solid rgba(249,115,22,.4)", background: "rgba(249,115,22,.13)" },
  h1: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem,5vw,2.5rem)", lineHeight: 1.05, letterSpacing: "-.02em", margin: "0 0 16px" },
  intro: { fontSize: "1.05rem", color: "#b6b3ad", lineHeight: 1.6, margin: "0 0 22px" },
  readfirst: { background: "#111112", border: "1px solid rgba(255,255,255,.08)", borderLeft: "3px solid #f97316", borderRadius: "0 10px 10px 0", padding: "14px 18px", fontSize: ".92rem", color: "#b6b3ad", marginBottom: 26 },
  bloco: { background: "#161617", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "20px 22px", marginBottom: 16, position: "relative" },
  blocoTitulo: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: "1.08rem", marginBottom: 12, color: "#f4f2ef" },
  blocoBody: { whiteSpace: "pre-wrap", color: "#d6d3ce", fontSize: ".95rem", lineHeight: 1.6, marginBottom: 14 },
  codigo: { fontFamily: "'JetBrains Mono',monospace", fontSize: ".85rem", background: "#0c0c0d", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "14px 16px", overflowX: "auto" },
  copyBtn: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: ".85rem", background: "#f97316", color: "#0a0a0a", border: "none", padding: "9px 18px", borderRadius: 8, cursor: "pointer" },
  copyOn: { background: "#7fb08a" },
  footer: { marginTop: 34, padding: "22px 24px", background: "linear-gradient(120deg,rgba(249,115,22,.1),transparent)", border: "1px solid rgba(249,115,22,.3)", borderRadius: 14, textAlign: "center" },
  footerP: { color: "#f4f2ef", fontSize: "1rem", margin: "0 0 14px" },
  footerBtn: { display: "inline-block", background: "#f97316", color: "#0a0a0a", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: ".92rem", padding: "12px 22px", borderRadius: 100, textDecoration: "none" },
};
