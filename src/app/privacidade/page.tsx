import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — RedPro AI Academy",
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#e5e5e5",
        display: "flex",
        justifyContent: "center",
        padding: "60px 24px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        a { color: #ff4d4d; }
      `}</style>
      <div style={{ maxWidth: 720, width: "100%" }}>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 900,
            fontSize: 32,
            marginBottom: 8,
          }}
        >
          Política de Privacidade
        </h1>
        <p style={{ opacity: 0.6, marginBottom: 32, fontSize: 14 }}>
          RedPro AI Academy — última atualização em outubro de 2026
        </p>

        <Section title="Quem somos">
          A RedPro AI Academy opera ferramentas internas de apoio à operação do
          canal @redpro.ia no YouTube, incluindo painéis de acompanhamento de
          aulas ao vivo. Contato: redpro.ia@gmail.com.
        </Section>

        <Section title="Quais dados coletamos">
          Quando uma ferramenta nossa se conecta a uma Conta do Google, ela lê
          apenas o que foi explicitamente autorizado na tela de permissão:
          metadados públicos do canal do YouTube e métricas de audiência (como
          pico de espectadores simultâneos e visualizações) das transmissões
          da RedPro AI Academy. Não lemos e-mail, contatos, arquivos nem
          qualquer outro dado da Conta do Google.
        </Section>

        <Section title="Como usamos esses dados">
          As métricas são usadas internamente para acompanhar o andamento das
          aulas ao vivo da Hermes Week e registrar presença da turma. Não
          vendemos, alugamos nem compartilhamos esses dados com terceiros.
        </Section>

        <Section title="Por quanto tempo guardamos">
          As métricas agregadas ficam armazenadas enquanto o ciclo de aulas
          correspondente estiver ativo nos nossos sistemas internos.
        </Section>

        <Section title="Como revogar o acesso">
          Qualquer autorização concedida pode ser revogada a qualquer momento
          em{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noreferrer"
          >
            myaccount.google.com/permissions
          </a>
          .
        </Section>

        <Section title="Contato">
          Dúvidas sobre esta política: redpro.ia@gmail.com.
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        {title}
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.85 }}>
        {children}
      </p>
    </section>
  );
}
