"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RESOURCES, CATEGORIAS } from "@/data/vault-resources";

export default function Vault() {
  const [cat, setCat] = useState<string>("Tudo");
  const [q, setQ] = useState("");
  const [liberado, setLiberado] = useState<boolean | null>(null);

  useEffect(() => {
    try { setLiberado(localStorage.getItem("redvault_access") === "1"); }
    catch { setLiberado(false); }
  }, []);

  const lista = RESOURCES.filter((r) => {
    const okCat = cat === "Tudo" || r.categoria === cat;
    const okQ = !q || (r.titulo + r.resumo).toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  });

  return (
    <main style={s.page}>
      <div style={s.strip}><span style={{ color: "#f97316" }}>●</span> REDPRO · <span style={{ color: "#f97316", fontWeight: 700 }}>SISTEMAS AGÊNTICOS →</span></div>
      <nav style={s.nav}>
        <div style={s.brand}><span style={s.av}>R</span> RedPro <span style={{ color: "#f97316", fontSize: ".85rem" }}>✔</span></div>
        <a href="https://redpro.com.br" style={s.navbtn}>Site →</a>
      </nav>

      <section style={s.hero}>
        <div style={s.grid} />
        <div style={s.heroInner}>
          <h1 style={s.h1}>O RedVault</h1>
          <p style={s.lead}>Todo sistema que eu uso pra operar com IA. Cada card abre o passo a passo completo. Nada pra baixar, tudo copy-paste.</p>

          <div style={s.search}>
            <span style={{ color: "#726f69" }}>⌕</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar no vault..." style={s.searchInput} />
          </div>
          <div style={s.filters}>
            {CATEGORIAS.map((c) => (
              <button key={c} onClick={() => setCat(c)} style={{ ...s.chip, ...(cat === c ? s.chipOn : {}) }}>{c}</button>
            ))}
          </div>
          <div style={s.count}>{lista.length} resource{lista.length !== 1 ? "s" : ""}</div>
        </div>
      </section>

      {liberado === false && (
        <div style={s.gateBanner}>
          Coloca seu e-mail pra desbloquear o acesso completo e receber o que entra de novo.{" "}
          <Link href="/vault/acesso" style={s.gateLink}>Liberar →</Link>
        </div>
      )}

      <section style={s.cards}>
        {lista.map((r) => {
          const href = liberado ? `/vault/${r.slug}` : `/vault/acesso?r=${r.slug}`;
          return (
            <Link key={r.slug} href={href} style={s.card}>
              <div style={s.tags}>
                <span style={s.tagCat}>{r.categoria}</span>
                {r.destaque && <span style={s.tagFeat}>Destaque</span>}
                {r.novo && <span style={s.tagNovo}>Novo</span>}
              </div>
              <h3 style={s.cardH}>{r.titulo}</h3>
              <p style={s.cardP}>{r.resumo}</p>
              <span style={s.open}>Abrir →</span>
            </Link>
          );
        })}
      </section>

      <footer style={s.footer}>RedVault · o vault cresce toda semana · @redpro.ia</footer>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080808", color: "#f4f2ef", fontFamily: "'DM Sans',system-ui,sans-serif" },
  strip: { background: "#0c0c0d", borderBottom: "1px solid rgba(255,255,255,.08)", padding: "9px 0", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".12em", color: "#b6b3ad" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", maxWidth: 760, margin: "0 auto", position: "sticky", top: 0, background: "rgba(8,8,8,.9)", backdropFilter: "blur(12px)", zIndex: 30, borderBottom: "1px solid rgba(255,255,255,.08)" },
  brand: { display: "flex", alignItems: "center", gap: 10, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.15rem" },
  av: { width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#c2540d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0a", fontWeight: 700 },
  navbtn: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: ".9rem", background: "#f97316", color: "#0a0a0a", padding: "9px 16px", borderRadius: 100, textDecoration: "none" },
  hero: { padding: "44px 20px 22px", position: "relative", overflow: "hidden", background: "radial-gradient(120% 90% at 90% 0%, rgba(249,115,22,.1), transparent 55%)" },
  grid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)", backgroundSize: "44px 44px", opacity: 0.6, pointerEvents: "none" },
  heroInner: { position: "relative", maxWidth: 720, margin: "0 auto" },
  h1: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(2.2rem,7vw,3rem)", lineHeight: 1.02, letterSpacing: "-.025em", margin: "0 0 12px" },
  lead: { fontSize: "1.05rem", color: "#b6b3ad", maxWidth: "52ch", margin: 0 },
  search: { margin: "24px 0 16px", background: "#161617", border: "1px solid rgba(255,255,255,.14)", borderRadius: 14, padding: "15px 18px", display: "flex", alignItems: "center", gap: 12, color: "#726f69" },
  searchInput: { flex: 1, background: "none", border: "none", color: "#f4f2ef", fontFamily: "inherit", fontSize: "1rem", outline: "none" },
  filters: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: { fontFamily: "inherit", fontSize: ".85rem", padding: "7px 15px", borderRadius: 100, border: "1px solid rgba(255,255,255,.14)", background: "none", color: "#b6b3ad", cursor: "pointer" },
  chipOn: { background: "rgba(249,115,22,.13)", borderColor: "rgba(249,115,22,.4)", color: "#f97316", fontWeight: 600 },
  count: { fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#726f69", margin: "14px 0 0" },
  gateBanner: { maxWidth: 720, margin: "18px auto 0", padding: "13px 18px", background: "rgba(249,115,22,.08)", border: "1px dashed rgba(249,115,22,.4)", borderRadius: 12, fontSize: ".92rem", color: "#b6b3ad" },
  gateLink: { color: "#f97316", fontWeight: 600, textDecoration: "none" },
  cards: { maxWidth: 720, margin: "0 auto", padding: "20px 20px 60px", display: "grid", gap: 13 },
  card: { display: "block", background: "#161617", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "22px 24px", textDecoration: "none", color: "inherit", transition: "border-color .15s" },
  tags: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  tagCat: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 6, color: "#f97316", border: "1px solid rgba(249,115,22,.4)", background: "rgba(249,115,22,.13)" },
  tagFeat: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 6, color: "#b6b3ad", border: "1px solid rgba(255,255,255,.14)", background: "#1c1c1e" },
  tagNovo: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 6, color: "#7fb08a", border: "1px solid rgba(127,176,138,.4)", background: "rgba(127,176,138,.12)" },
  cardH: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: "1.2rem", margin: "0 0 8px", letterSpacing: "-.01em" },
  cardP: { color: "#b6b3ad", fontSize: ".93rem", margin: "0 0 14px", lineHeight: 1.5 },
  open: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: ".92rem", color: "#f97316" },
  footer: { borderTop: "1px solid rgba(255,255,255,.08)", padding: "24px 20px 50px", color: "#726f69", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textAlign: "center" },
};
