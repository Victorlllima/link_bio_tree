import type { Metadata } from "next";

/* /grupo/nao-encontrado  ·  destino do redirecionador do grupo quando o token não existe
   ou não é de um ingresso válido. Nunca mostra o link do grupo. O WhatsApp da Amanda vem
   da env AMANDA_WHATSAPP (só dígitos com DDI, ex.: 55619XXXXXXXX); sem ela, só o e-mail. */

const SUPORTE = "suporte@redpro.com.br";

export const metadata: Metadata = {
  title: "Ingresso não encontrado | RedPro AI Academy",
  robots: { index: false, follow: false },
};

export default function GrupoNaoEncontrado() {
  const zap = (process.env.AMANDA_WHATSAPP ?? "").replace(/\D/g, "");
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#f4f4f4", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, lineHeight: 1.2, margin: "0 0 12px" }}>Não achamos o seu ingresso</h1>
        <p style={{ fontSize: 16, lineHeight: 1.5, color: "#c8c8c8", margin: "0 0 20px" }}>
          Se você comprou a Imersão, fale com o suporte e a gente resolve.
        </p>
        <p style={{ fontSize: 16, margin: "0 0 10px" }}>
          E-mail: <a href={`mailto:${SUPORTE}`} style={{ color: "#ff4d4d" }}>{SUPORTE}</a>
        </p>
        {zap && (
          <p style={{ fontSize: 16, margin: 0 }}>
            <a href={`https://wa.me/${zap}`} style={{ color: "#ff4d4d" }}>WhatsApp da Amanda</a>
          </p>
        )}
      </div>
    </main>
  );
}
