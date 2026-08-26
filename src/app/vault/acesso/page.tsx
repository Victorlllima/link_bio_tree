"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AcessoInner() {
  const params = useSearchParams();
  const router = useRouter();
  const resource = params.get("r") || "";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!/.+@.+\..+/.test(email)) { setErro("Coloca um e-mail válido."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resource }),
      });
      if (!res.ok) throw new Error();
      try { localStorage.setItem("redvault_access", "1"); } catch {}
      router.push(resource ? `/vault/${resource}` : "/vault");
    } catch {
      setErro("Deu ruim aqui. Tenta de novo em instantes.");
      setLoading(false);
    }
  }

  return (
    <main style={s.page}>
      <div style={s.grid} />
      <div style={s.box}>
        <div style={s.strip}><span style={{ color: "#f97316" }}>●</span> REDPRO · SISTEMAS AGÊNTICOS</div>
        <h1 style={s.h1}>Seu acesso ao Vault<br />tá a um e-mail de distância.</h1>
        <p style={s.p}>Coloca seu melhor e-mail que eu te libero o vault inteiro. É de graça, e é onde eu solto tudo que vai saindo.</p>
        <form onSubmit={submit} style={s.field}>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="seu melhor e-mail" style={s.input} autoFocus
          />
          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Liberando..." : "Liberar o Vault →"}
          </button>
        </form>
        {erro && <p style={s.erro}>{erro}</p>}
        <p style={s.fine}>sem spam. você sai quando quiser.</p>
      </div>
    </main>
  );
}

export default function Acesso() {
  return (
    <Suspense fallback={<main style={s.page} />}>
      <AcessoInner />
    </Suspense>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080808", color: "#f4f2ef", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden", fontFamily: "'DM Sans',system-ui,sans-serif" },
  grid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)", backgroundSize: "44px 44px", opacity: 0.6, pointerEvents: "none" },
  box: { position: "relative", maxWidth: 480, width: "100%", textAlign: "center" },
  strip: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".12em", color: "#b6b3ad", marginBottom: 22 },
  h1: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.9rem", lineHeight: 1.08, letterSpacing: "-.02em", margin: "0 0 12px" },
  p: { color: "#b6b3ad", fontSize: "1rem", margin: "0 auto 22px", maxWidth: "40ch" },
  field: { display: "flex", gap: 8, flexWrap: "wrap" },
  input: { flex: 1, minWidth: 200, background: "#161617", border: "1px solid rgba(255,255,255,.14)", borderRadius: 10, padding: "13px 16px", color: "#f4f2ef", fontFamily: "inherit", fontSize: ".95rem", outline: "none" },
  btn: { background: "#f97316", color: "#0a0a0a", border: "none", padding: "13px 22px", borderRadius: 100, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: ".92rem", cursor: "pointer" },
  erro: { color: "#f9491e", fontSize: ".88rem", marginTop: 12 },
  fine: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#726f69", marginTop: 14 },
};
