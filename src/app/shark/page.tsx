import type { Metadata } from "next";
import SharkForm from "./SharkForm";

export const metadata: Metadata = {
  title: "Formação S.H.A.R.K. — RedPro AI Academy",
  description:
    "Aprenda a usar 5 agentes de IA especializados para automatizar operações de qualquer empresa — sem saber programar. Lista de espera aberta.",
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/shark",
    title: "Formação S.H.A.R.K. — RedPro AI Academy",
    description:
      "Aprenda a usar 5 agentes de IA especializados para automatizar operações de qualquer empresa — sem saber programar. Lista de espera aberta.",
    locale: "pt_BR",
  },
};

const staticStyles = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .sk-root, .sk-root *, .sk-root *::before, .sk-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .sk-root {
    --bg: #080808;
    --surface: #111111;
    --elevated: #1a1a1a;
    --border: rgba(255,255,255,0.06);
    --border-active: rgba(232,213,183,0.3);
    --text-primary: #f5f5f5;
    --text-secondary: #a3a3a3;
    --accent: #e8d5b7;
    --accent-dim: rgba(232,213,183,0.08);
    --accent-glow: rgba(232,213,183,0.12);
    --danger: #ef4444;
    --success: #4ade80;
    --linha: rgba(255,255,255,0.06);

    background: var(--bg);
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .sk-root .display, .sk-root h2, .sk-root h3 {
    font-family: 'Cormorant Garant', serif;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.05;
  }

  .sk-root h2 {
    font-size: clamp(32px, 5vw, 56px);
    margin-bottom: 16px;
  }

  .sk-root h3 {
    font-size: clamp(20px, 2.4vw, 26px);
    font-weight: 600;
  }

  .sk-root .accent { color: var(--accent); }

  .sk-root .container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .sk-root .narrow {
    max-width: 680px;
    margin: 0 auto;
  }

  .sk-root section { padding: 88px 0; position: relative; }

  .sk-root .section-label {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
    opacity: 0.7;
  }

  /* ─── HERO ─── */
  .sk-root .hero {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 24px 72px;
    position: relative;
    overflow: hidden;
  }

  .sk-root .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% -5%, var(--accent-glow) 0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(232,213,183,0.04) 0%, transparent 65%);
    pointer-events: none;
  }

  .sk-root .hero-inner {
    max-width: 640px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    text-align: center;
  }

  .sk-root .urgency-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--accent-dim);
    border: 1px solid var(--border-active);
    color: var(--accent);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 8px 20px;
    border-radius: 100px;
    margin-bottom: 40px;
  }

  .sk-root .urgency-badge .pulse {
    width: 6px; height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: sk-pulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes sk-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .sk-root h1 {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(40px, 6.5vw, 72px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.0;
    margin-bottom: 28px;
  }

  .sk-root .hero-sub {
    font-size: clamp(16px, 1.9vw, 19px);
    font-weight: 300;
    color: var(--text-secondary);
    max-width: 540px;
    margin: 0 auto 48px;
    line-height: 1.6;
  }

  /* ─── FORM BOX ─── */
  .sk-root .form-box {
    background: var(--surface);
    border: 1px solid var(--border-active);
    border-radius: 16px;
    padding: 36px 32px;
    position: relative;
    overflow: hidden;
    text-align: left;
  }

  .sk-root .form-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.5;
  }

  /* ─── SEÇÃO 2 — O QUE É ─── */
  .sk-root .o-que-e {
    background: #050505;
    border-top: 1px solid var(--linha);
  }

  .sk-root .agentes-lista {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--linha);
    border: 1px solid var(--linha);
    border-radius: 12px;
    overflow: hidden;
  }

  .sk-root .agente-item {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 24px;
    align-items: start;
    padding: 28px 28px;
    background: var(--bg);
    transition: background 0.2s ease;
  }

  .sk-root .agente-item:hover {
    background: #0d0d0d;
  }

  .sk-root .agente-letra {
    font-family: 'Cormorant Garant', serif;
    font-size: 40px;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
    letter-spacing: -0.03em;
    opacity: 0.9;
  }

  .sk-root .agente-nome {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 6px;
    opacity: 0.7;
  }

  .sk-root .agente-desc {
    color: var(--text-secondary);
    font-size: 15px;
    line-height: 1.55;
    font-weight: 300;
  }

  .sk-root .agente-desc strong {
    color: var(--text-primary);
    font-weight: 500;
  }

  /* ─── SEÇÃO 3 — PARA QUEM ─── */
  .sk-root .para-quem {
    background: var(--bg);
    border-top: 1px solid var(--linha);
  }

  .sk-root .icp-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 48px;
  }

  .sk-root .icp-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px 24px;
    transition: border-color 0.25s ease, background 0.25s ease;
  }

  .sk-root .icp-card:hover {
    border-color: rgba(232,213,183,0.2);
    background: var(--elevated);
  }

  .sk-root .icp-marker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 14px;
    opacity: 0.6;
  }

  .sk-root .icp-texto {
    color: var(--text-secondary);
    font-size: 15px;
    line-height: 1.6;
    font-weight: 300;
  }

  .sk-root .icp-texto em {
    font-style: normal;
    color: var(--text-primary);
    font-weight: 500;
  }

  /* ─── SEÇÃO 4 — URGÊNCIA ─── */
  .sk-root .urgencia {
    background: #050505;
    border-top: 1px solid var(--linha);
    text-align: center;
  }

  .sk-root .urgencia-card {
    max-width: 620px;
    margin: 0 auto;
    padding: 56px 0 0;
  }

  .sk-root .data-destaque {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 20px;
    opacity: 0.8;
  }

  .sk-root .urgencia-texto {
    color: var(--text-secondary);
    font-size: clamp(16px, 1.8vw, 18px);
    line-height: 1.7;
    font-weight: 300;
    margin-bottom: 40px;
    max-width: 540px;
    margin-left: auto;
    margin-right: auto;
  }

  .sk-root .urgencia-texto strong {
    color: var(--text-primary);
    font-weight: 500;
  }

  .sk-root .btn-anchor {
    display: inline-block;
    background: var(--accent);
    color: #080808;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: -0.01em;
    padding: 18px 48px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
  }

  .sk-root .btn-anchor:hover {
    background: #f0e0c4;
    transform: translateY(-2px);
  }

  .sk-root .cta-nota {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 16px;
    opacity: 0.6;
    letter-spacing: 0.04em;
  }

  /* ─── FOOTER ─── */
  .sk-root .footer {
    padding: 32px 24px;
    text-align: center;
    border-top: 1px solid var(--linha);
  }

  .sk-root .footer-logo {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.02em;
    margin-bottom: 8px;
  }

  .sk-root .footer-logo span {
    color: var(--accent);
  }

  .sk-root .footer-links {
    display: flex;
    justify-content: center;
    gap: 24px;
  }

  .sk-root .footer-links a {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    text-decoration: none;
    opacity: 0.5;
    letter-spacing: 0.08em;
    transition: opacity 0.2s;
  }

  .sk-root .footer-links a:hover { opacity: 1; }

  /* ─── RESPONSIVO ─── */
  @media (max-width: 768px) {
    .sk-root section { padding: 64px 0; }
    .sk-root .icp-grid { grid-template-columns: 1fr; }
    .sk-root .form-box { padding: 28px 20px; }
    .sk-root .agente-item { grid-template-columns: 40px 1fr; gap: 16px; padding: 22px 20px; }
    .sk-root .agente-letra { font-size: 30px; }
  }
</style>
`;

export default function SharkPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: staticStyles }} />

      <div className="sk-root">

        {/* HERO */}
        <section className="hero" id="topo">
          <div className="hero-inner">

            <div className="urgency-badge">
              <span className="pulse" />
              Vagas limitadas · Carrinho abre 23/jul
            </div>

            <h1>
              Formação<br />
              <span className="accent">S.H.A.R.K.</span>
            </h1>

            <p className="hero-sub">
              Torne-se o especialista em IA que as empresas procuram. Aprenda a usar 5 agentes especializados para automatizar operações de qualquer empresa — sem saber programar.
            </p>

            <div className="form-box">
              <SharkForm />
            </div>

          </div>
        </section>


        {/* SEÇÃO 2 — O QUE É */}
        <section className="o-que-e">
          <div className="container narrow">
            <span className="section-label">O método</span>
            <h2>5 agentes.<br />Uma metodologia.<br /><span className="accent">Uma carreira nova.</span></h2>
          </div>

          <div className="container" style={{ marginTop: "0" }}>
            <div className="agentes-lista" style={{ maxWidth: "760px", margin: "0 auto" }}>

              <div className="agente-item">
                <div className="agente-letra">S</div>
                <div>
                  <div className="agente-nome">Shiva — Descoberta</div>
                  <p className="agente-desc">
                    <strong>Mapeie o problema do cliente antes de propor qualquer solução.</strong>
                    {" "}A maioria entrega solução sem entender o problema. Shiva te ensina a fazer as perguntas certas primeiro.
                  </p>
                </div>
              </div>

              <div className="agente-item">
                <div className="agente-letra">H</div>
                <div>
                  <div className="agente-nome">Hades — Estratégia</div>
                  <p className="agente-desc">
                    <strong>Crie roadmaps de automação que o cliente entende e aprova.</strong>
                    {" "}Não basta ter a solução técnica. O cliente precisa ver o caminho — e querer pagar por ele.
                  </p>
                </div>
              </div>

              <div className="agente-item">
                <div className="agente-letra">A</div>
                <div>
                  <div className="agente-nome">Atlas — Execução</div>
                  <p className="agente-desc">
                    <strong>Implemente soluções de IA sem escrever uma linha de código.</strong>
                    {" "}O agente executor. Ele não pergunta — ele faz. Você vai aprender a comandar esse nível de execução.
                  </p>
                </div>
              </div>

              <div className="agente-item">
                <div className="agente-letra">R</div>
                <div>
                  <div className="agente-nome">Ravena — Qualidade</div>
                  <p className="agente-desc">
                    <strong>Entregue com padrão de qualidade que justifica o seu preço.</strong>
                    {" "}O que separa o freelancer do especialista é o que ele valida antes de entregar.
                  </p>
                </div>
              </div>

              <div className="agente-item">
                <div className="agente-letra">K</div>
                <div>
                  <div className="agente-nome">Kerberos — Segurança</div>
                  <p className="agente-desc">
                    <strong>Proteja o cliente e a entrega antes de ir a ar.</strong>
                    {" "}Quem entrega com segurança cobra mais. Kerberos é o que clientes de alto padrão exigem — mesmo sem saber o nome.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* SEÇÃO 3 — PARA QUEM */}
        <section className="para-quem">
          <div className="container narrow">
            <span className="section-label">Para quem é</span>
            <h2>Para quem quer ser<br />prestador de IA —<br /><span className="accent">não só usuário.</span></h2>
          </div>

          <div className="container">
            <div className="icp-grid">

              <div className="icp-card">
                <div className="icp-marker">01</div>
                <p className="icp-texto">
                  Você sente que <em>IA está mudando tudo</em>, mas ainda não sabe como monetizar isso — e fica assistindo os outros chegarem primeiro.
                </p>
              </div>

              <div className="icp-card">
                <div className="icp-marker">02</div>
                <p className="icp-texto">
                  Você não quer depender de salário. Quer <em>atender empresas e cobrar como especialista</em> — por projeto, por resultado, no seu tempo.
                </p>
              </div>

              <div className="icp-card">
                <div className="icp-marker">03</div>
                <p className="icp-texto">
                  Você não sabe programar, mas sabe que <em>isso não pode ser o seu limitador</em>. O método S.H.A.R.K. foi construído exatamente para isso.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* SEÇÃO 4 — URGÊNCIA */}
        <section className="urgencia">
          <div className="container">
            <div className="urgencia-card">
              <span className="section-label">Lista de espera aberta agora</span>
              <h2>Carrinho abre<br /><span className="accent">23 de julho.</span></h2>

              <div style={{ marginTop: "28px" }}>
                <p className="urgencia-texto">
                  Quem entra na lista agora recebe <strong>acesso prioritário ao carrinho</strong> e{" "}
                  <strong>condição especial de lançamento</strong> — antes de qualquer anúncio público.
                </p>
              </div>

              <a href="#topo" className="btn-anchor">
                Entrar na lista de espera
              </a>
              <p className="cta-nota">Gratuito · Sem spam · Sai quando quiser</p>
            </div>
          </div>
        </section>


        {/* FOOTER */}
        <footer className="footer">
          <p className="footer-logo">
            <span>RedPro</span> AI Academy
          </p>
          <div className="footer-links">
            <a href="https://redpro.com.br" target="_blank" rel="noopener noreferrer">redpro.com.br</a>
            <a href="https://redpro.com.br/privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>
          </div>
        </footer>

      </div>
    </>
  );
}
