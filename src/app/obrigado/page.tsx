import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compra confirmada — RedPro AI Academy",
  robots: { index: false, follow: false },
};

export default function ObrigadoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Check icon */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "rgba(74,222,128,0.12)",
        border: "2px solid rgba(74,222,128,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Badge */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#f97316",
        border: "1px solid rgba(249,115,22,0.35)",
        background: "rgba(249,115,22,0.08)",
        padding: "5px 16px",
        borderRadius: 100,
        marginBottom: 24,
      }}>
        RedPro AI Academy
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 900,
        fontSize: "clamp(32px, 6vw, 56px)",
        lineHeight: 1.0,
        letterSpacing: "-0.03em",
        color: "#f5f5f5",
        textAlign: "center",
        marginBottom: 16,
        maxWidth: 600,
      }}>
        Compra confirmada.
      </h1>

      <p style={{
        fontWeight: 300,
        fontSize: 18,
        color: "#a3a3a3",
        textAlign: "center",
        lineHeight: 1.6,
        maxWidth: 480,
        marginBottom: 40,
      }}>
        Você vai receber um e-mail com o acesso em alguns minutos.
        Verifique também a pasta de spam.
      </p>

      {/* Divider */}
      <div style={{ width: 50, height: 3, background: "#f97316", borderRadius: 2, marginBottom: 40 }} />

      {/* Next step box */}
      <div style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "28px 32px",
        maxWidth: 480,
        width: "100%",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, color: "#525252", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          Próximo passo
        </p>
        <p style={{ fontSize: 17, color: "#f5f5f5", fontWeight: 400, lineHeight: 1.6 }}>
          Acesse a área de membros pelo e-mail que você vai receber
          e comece a <strong style={{ color: "#f97316" }}>Aula 1</strong> agora.
        </p>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 48, fontSize: 13, color: "#333", textAlign: "center" }}>
        Dúvidas? Fale com a gente: <a href="mailto:contato@redpro.com.br" style={{ color: "#f97316", textDecoration: "none" }}>contato@redpro.com.br</a>
      </p>
    </main>
  );
}
