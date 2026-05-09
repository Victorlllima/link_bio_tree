import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compra confirmada — Claude for Business",
  description: "Sua compra foi confirmada. Veja o que fazer agora.",
};

export default function ObrigadoPage() {
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

      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>

        {/* Ícone de confirmação */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(249,115,22,0.12)",
          border: "1.5px solid rgba(249,115,22,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 32px",
          fontSize: 28,
        }}>✓</div>

        {/* Badge */}
        <div style={{
          display: "inline-block",
          background: "rgba(249,115,22,0.10)",
          border: "1px solid rgba(249,115,22,0.3)",
          color: "#f97316",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "5px 16px",
          borderRadius: 100,
          marginBottom: 24,
        }}>Compra confirmada</div>

        {/* Título */}
        <h1 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "clamp(28px, 6vw, 48px)",
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}>
          Bem-vindo ao<br />
          <span style={{ color: "#f97316" }}>Claude for Business.</span>
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: 17,
          fontWeight: 300,
          color: "#999",
          lineHeight: 1.6,
          marginBottom: 48,
        }}>
          Você vai receber o acesso no e-mail em instantes.<br />
          Enquanto isso, leia o que vem a seguir.
        </p>

        {/* Separador */}
        <div style={{ width: 40, height: 2, background: "#f97316", margin: "0 auto 48px", borderRadius: 2 }} />

        {/* Os Combinados */}
        <div style={{
          background: "#111",
          border: "1px solid #1f1f1f",
          borderLeft: "3px solid #f97316",
          borderRadius: "0 8px 8px 0",
          padding: "28px 32px",
          textAlign: "left",
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f97316", marginBottom: 10 }}>
            Os Combinados — leia agora
          </div>
          <p style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, marginBottom: 0 }}>
            Quem fizer os três combinados abaixo tem <strong style={{ color: "#f5f5f5" }}>acesso vitalício</strong> ao curso e todas as atualizações futuras. Quem não fizer tem 3 meses.
          </p>
        </div>

        {/* Lista de combinados */}
        {[
          { num: "01", texto: "Seguir @redpro.ia no Instagram" },
          { num: "02", texto: "Preencher a ficha de matrícula da Academy" },
          { num: "03", texto: "Postar seu resultado quando tiver — pode ser pequeno" },
        ].map((item) => (
          <div key={item.num} style={{
            background: "#111",
            border: "1px solid #1f1f1f",
            borderRadius: 8,
            padding: "18px 24px",
            textAlign: "left",
            marginBottom: 8,
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}>
            <span style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 13,
              fontWeight: 900,
              color: "#f97316",
              flexShrink: 0,
            }}>{item.num}</span>
            <span style={{ fontSize: 15, color: "#ccc" }}>{item.texto}</span>
          </div>
        ))}

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* CTA Ficha */}
          <a href="/onboarding" style={{
            display: "block",
            background: "#f97316",
            color: "#000",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            padding: "16px 32px",
            borderRadius: 8,
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}>
            Preencher ficha de matrícula agora
          </a>

          {/* CTA Instagram */}
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
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 8,
              textDecoration: "none",
            }}>
            Seguir @redpro.ia no Instagram
          </a>
        </div>

        <p style={{ fontSize: 13, color: "#444", marginTop: 32, lineHeight: 1.6 }}>
          Dúvidas? Me manda um direct no Instagram.
        </p>
      </div>
    </div>
  );
}
