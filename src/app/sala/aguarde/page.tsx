import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sala da Imersão | RedPro",
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SalaAguarde({ searchParams }: { searchParams: Promise<{ n?: string }> }) {
    const { n } = await searchParams;
    const volta = n && /^(noite1|noite2|live)$/.test(n) ? `/sala/${n}` : null;
    return (
        <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {volta ? <meta httpEquiv="refresh" content={`60;url=${volta}`} /> : null}
            <div style={{ maxWidth: 440, textAlign: "center" }}>
                <p style={{ color: "#ff4d4d", fontWeight: 700, letterSpacing: 1, fontSize: 13, textTransform: "uppercase", margin: 0 }}>Imersão Arquiteto de Agentes</p>
                <h1 style={{ fontSize: 26, lineHeight: 1.25, margin: "14px 0 12px" }}>A sala ainda não abriu</h1>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "#c9c9c9", margin: 0 }}>
                    O link da sala sai no grupo de avisos da Imersão no WhatsApp, a partir das 18h30. A aula começa às 19h.
                </p>
                {volta ? (
                    <p style={{ fontSize: 14, color: "#8a8a8a", marginTop: 20 }}>
                        Esta página tenta de novo sozinha a cada minuto. Ou <a href={volta} style={{ color: "#ff4d4d" }}>toque aqui para tentar agora</a>.
                    </p>
                ) : null}
            </div>
        </main>
    );
}
