import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagamento em processamento — Claude for Business",
  description: "Seu pagamento está sendo processado.",
};

export default function AguardandoPage() {
  return (
    <div style={{
      background: "#080808",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      color: "#f5f5f5",
      padding: "40px 24px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>

        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(249,115,22,0.08)",
          border: "1.5px solid rgba(249,115,22,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px", fontSize: 28,
        }}>⏳</div>

        <div style={{
          display: "inline-block",
          background: "rgba(249,115,22,0.08)",
          border: "1px solid rgba(249,115,22,0.25)",
          color: "#f97316", fontSize: 11, fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "5px 16px", borderRadius: 100, marginBottom: 24,
        }}>Pagamento em processamento</div>

        <h1 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "clamp(28px, 6vw, 44px)", fontWeight: 900,
          lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 20,
        }}>
          Seu pagamento está<br />
          <span style={{ color: "#f97316" }}>sendo processado.</span>
        </h1>

        <p style={{ fontSize: 17, fontWeight: 300, color: "#999", lineHeight: 1.6, marginBottom: 40 }}>
          Se você pagou com <strong style={{ color: "#ccc" }}>boleto</strong>, o prazo de compensação é de até 3 dias úteis.<br />
          Se pagou com <strong style={{ color: "#ccc" }}>Pix</strong>, costuma cair em minutos.
        </p>

        <div style={{ width: 40, height: 2, background: "#f97316", margin: "0 auto 40px", borderRadius: 2 }} />

        <div style={{
          background: "#111", border: "1px solid #1f1f1f",
          borderLeft: "3px solid #f97316",
          borderRadius: "0 8px 8px 0",
          padding: "24px 28px", textAlign: "left", marginBottom: 32,
        }}>
          <p style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, margin: 0 }}>
            Assim que o pagamento confirmar, você recebe o link de acesso no <strong style={{ color: "#f5f5f5" }}>e-mail cadastrado</strong>.<br /><br />
            Enquanto isso, já vai adiantando: siga o <strong style={{ color: "#f97316" }}>@redpro.ia</strong> no Instagram. Quando o acesso chegar, a primeira coisa é assistir a Aula 0.
          </p>
        </div>

        <a
          href="https://instagram.com/redpro.ia"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            background: "transparent",
            color: "#f97316",
            border: "1px solid rgba(249,115,22,0.35)",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700, fontSize: 15,
            padding: "14px 32px", borderRadius: 8, textDecoration: "none",
          }}>
          Seguir @redpro.ia no Instagram
        </a>

        <p style={{ fontSize: 13, color: "#444", marginTop: 28, lineHeight: 1.6 }}>
          Dúvidas? Me manda um direct no Instagram.
        </p>
      </div>
    </div>
  );
}
