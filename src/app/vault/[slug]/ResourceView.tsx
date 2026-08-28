import Link from "next/link";
import Image from "next/image";
import type { Resource, Secao } from "@/data/vault-resources";

function SecaoView({ secao }: { secao: Secao }) {
  return (
    <section style={s.secao}>
      <h2 style={s.secaoTitulo}>{secao.titulo}</h2>
      <div style={s.secaoTexto}>{secao.texto}</div>
    </section>
  );
}

export default function ResourceView({ resource }: { resource: Resource }) {
  const nomeArquivo = resource.arquivo.split("/").pop() ?? "skill.md";

  return (
    <main style={s.page}>
      <div style={s.topbar}>
        <Link href="/vault" style={s.brand}>
          <Image src="/logo-academy.png" alt="RedPro IA Academy" width={180} height={48} style={s.logo} priority />
        </Link>
        <Link href="/vault" style={s.back}>← Voltar ao RedVault</Link>
      </div>

      <article style={s.article}>
        <div style={s.tags}>
          <span style={s.tagCat}>{resource.categoria}</span>
          {resource.comando && <span style={s.tagCmd}>{resource.comando}</span>}
        </div>

        <h1 style={s.h1}>{resource.titulo}</h1>
        <p style={s.intro}>{resource.intro}</p>

        <div style={s.downloadBox}>
          <div style={s.downloadInfo}>
            <div style={s.downloadLabel}>{resource.categoria === "Skills" ? "Arquivo da skill" : "Arquivo do guia"}</div>
            <div style={s.downloadFile}>{nomeArquivo}</div>
          </div>
          <a href={resource.arquivo} download style={s.downloadBtn}>
            Baixar .md ↓
          </a>
        </div>

        {resource.secoes.map((sec, i) => <SecaoView key={i} secao={sec} />)}

        <div style={s.footer}>
          <p style={s.footerP}>Isso é 1 dos resources do RedVault. Tem mais lá dentro, e entra coisa nova toda semana.</p>
          <Link href="/vault" style={s.footerBtn}>Ver o RedVault inteiro →</Link>
        </div>
      </article>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080808", color: "#f4f2ef", fontFamily: "'DM Sans',system-ui,sans-serif" },
  topbar: { borderBottom: "1px solid rgba(255,255,255,.08)", padding: "12px 20px", position: "sticky", top: 0, background: "rgba(8,8,8,.92)", backdropFilter: "blur(12px)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
  brand: { display: "flex", alignItems: "center", textDecoration: "none" },
  logo: { height: 48, width: "auto", objectFit: "contain" },
  back: { color: "#b6b3ad", textDecoration: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 },
  article: { maxWidth: 680, margin: "0 auto", padding: "36px 20px 70px" },
  tags: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  tagCat: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 6, color: "#f97316", border: "1px solid rgba(249,115,22,.4)", background: "rgba(249,115,22,.13)" },
  tagCmd: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: ".04em", padding: "5px 10px", borderRadius: 6, color: "#b6b3ad", border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.04)" },
  h1: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem,5vw,2.5rem)", lineHeight: 1.05, letterSpacing: "-.02em", margin: "0 0 16px" },
  intro: { fontSize: "1.05rem", color: "#b6b3ad", lineHeight: 1.6, margin: "0 0 26px" },

  downloadBox: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", background: "linear-gradient(120deg,rgba(249,115,22,.12),rgba(249,115,22,.03))", border: "1px solid rgba(249,115,22,.38)", borderRadius: 14, padding: "18px 22px", marginBottom: 34 },
  downloadInfo: { display: "flex", flexDirection: "column", gap: 3 },
  downloadLabel: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#b6b3ad" },
  downloadFile: { fontFamily: "'JetBrains Mono',monospace", fontSize: ".95rem", color: "#f4f2ef", fontWeight: 600 },
  downloadBtn: { display: "inline-block", background: "#f97316", color: "#0a0a0a", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: ".95rem", padding: "12px 24px", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" },

  secao: { marginBottom: 26 },
  secaoTitulo: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: "1.15rem", margin: "0 0 10px", color: "#f4f2ef" },
  secaoTexto: { whiteSpace: "pre-wrap", color: "#c9c5bf", fontSize: ".98rem", lineHeight: 1.65 },

  footer: { marginTop: 40, padding: "22px 24px", background: "linear-gradient(120deg,rgba(249,115,22,.1),transparent)", border: "1px solid rgba(249,115,22,.3)", borderRadius: 14, textAlign: "center" },
  footerP: { color: "#f4f2ef", fontSize: "1rem", margin: "0 0 14px" },
  footerBtn: { display: "inline-block", background: "#f97316", color: "#0a0a0a", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: ".92rem", padding: "12px 22px", borderRadius: 100, textDecoration: "none" },
};
