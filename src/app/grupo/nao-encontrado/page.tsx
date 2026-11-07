import type { Metadata } from "next";

/* Destino de qualquer /grupo/<token> que não pôde entregar o convite. Página provisória do ION;
   a IRIS pode trocar o visual. Nunca mostra o link do grupo. */
export const metadata: Metadata = {
    title: "Link do grupo | Imersão Arquiteto de Agentes",
    robots: { index: false, follow: false },
};

const SUPORTE = "suporte@redpro.com.br";

export default function GrupoNaoEncontrado() {
    return (
        <main style={{ minHeight: "100vh", background: "#0A0A0C", color: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "ui-monospace, monospace" }}>
            <div style={{ maxWidth: 480, lineHeight: 1.6 }}>
                <h1 style={{ fontSize: 22, marginBottom: 12 }}>Não consegui liberar o grupo por esse link.</h1>
                <p style={{ color: "#B8B8B8", marginBottom: 12 }}>
                    Use o link do e-mail de confirmação da compra. Se já usou e não funcionou, ou se a compra foi feita com outro e-mail, escreva para{" "}
                    <a href={`mailto:${SUPORTE}`} style={{ color: "#E8A33D" }}>{SUPORTE}</a> com o e-mail da compra. A gente libera na hora.
                </p>
            </div>
        </main>
    );
}
