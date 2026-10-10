import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Serviço — RedPro AI Academy",
  robots: { index: true, follow: true },
};

export default function TermosPage() {
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
          Termos de Serviço
        </h1>
        <p style={{ opacity: 0.6, marginBottom: 32, fontSize: 14 }}>
          RedPro AI Academy — última atualização em outubro de 2026
        </p>

        <Section title="Sobre estes termos">
          Estes termos cobrem as ferramentas internas de apoio à operação do
          canal @redpro.ia no YouTube, incluindo painéis de acompanhamento de
          aulas ao vivo da Hermes Week. Contato: redpro.ia@gmail.com.
        </Section>

        <Section title="O que essas ferramentas fazem">
          Quando uma delas se conecta a uma Conta do Google, ela lê, dentro
          do que foi explicitamente autorizado na tela de permissão,
          metadados públicos do canal e métricas de audiência das
          transmissões da RedPro AI Academy no YouTube, como pico de
          espectadores simultâneos e visualizações.
        </Section>

        <Section title="Uso permitido">
          O acesso concedido é usado só para a finalidade descrita na tela de
          permissão. Não usamos esses dados para nenhum outro fim, nem os
          repassamos a terceiros.
        </Section>

        <Section title="Disponibilidade">
          São ferramentas internas, mantidas sem garantia de disponibilidade
          contínua. Podemos alterar ou descontinuar qualquer uma delas a
          qualquer momento.
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
          Dúvidas sobre estes termos: redpro.ia@gmail.com.
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
