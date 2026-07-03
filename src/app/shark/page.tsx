import type { Metadata } from "next";
import SharkForm, { SharkCountdown } from "./SharkForm";

export const metadata: Metadata = {
  title: "Formação S.H.A.R.K. — RedPro AI Academy",
  description:
    "Torne-se o especialista em IA que as empresas procuram. A Formação S.H.A.R.K. te ensina a usar 5 agentes especializados para automatizar qualquer operação — sem saber programar. Carrinho abre 23 de julho.",
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/shark",
    title: "Formação S.H.A.R.K. — RedPro AI Academy",
    description:
      "Torne-se o especialista em IA que as empresas procuram. Carrinho abre 23 de julho.",
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
    --bg:            #080808;
    --surface:       #111111;
    --elevated:      #1a1a1a;
    --border:        rgba(255,255,255,0.06);
    --border-active: rgba(232,213,183,0.3);
    --text-primary:  #f5f5f5;
    --text-secondary:#a3a3a3;
    --accent:        #e8d5b7;
    --accent-dim:    rgba(232,213,183,0.08);
    --accent-glow:   rgba(232,213,183,0.12);
    --danger:        #ef4444;
    --success:       #4ade80;
    --linha:         rgba(255,255,255,0.06);

    background: var(--bg);
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .sk-root h2 {
    font-family: 'Cormorant Garant', serif;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.05;
    font-size: clamp(32px, 5vw, 56px);
    margin-bottom: 16px;
    text-wrap: balance;
  }

  .sk-root h3 {
    font-family: 'Cormorant Garant', serif;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.05;
    font-size: clamp(20px, 2.4vw, 26px);
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

  /* HERO */
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
    50%       { opacity: 0.3; }
  }

  .sk-root h1 {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(44px, 7vw, 80px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.0;
    margin-bottom: 28px;
    text-wrap: balance;
    text-shadow: 0 0 80px rgba(232,213,183,0.15), 0 4px 24px rgba(0,0,0,0.8);
  }

  .sk-root h1 .accent {
    text-shadow:
      0 0 30px rgba(232,213,183,0.6),
      0 0 60px rgba(232,213,183,0.3),
      0 4px 16px rgba(0,0,0,1);
  }

  .sk-root .hero-sub {
    font-size: clamp(16px, 1.9vw, 19px);
    font-weight: 300;
    color: var(--text-secondary);
    max-width: 540px;
    margin: 0 auto 48px;
    line-height: 1.6;
  }

  /* FORM BOX */
  .sk-root .form-box {
    background: var(--surface);
    border: 1px solid var(--border-active);
    border-radius: 16px;
    padding: 36px 32px 28px;
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

  .sk-root .form-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .sk-root .form-meta span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.5;
  }

  .sk-root .form-meta .sep {
    width: 3px; height: 3px;
    background: var(--text-secondary);
    border-radius: 50%;
    opacity: 0.25;
    flex-shrink: 0;
  }

  /* SEÇÃO 2 */
  .sk-root .o-que-e {
    background: #050505;
    border-top: 1px solid var(--linha);
  }

  .sk-root .agentes-lista {
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
    padding: 28px;
    background: var(--bg);
    transition: background 0.2s ease;
  }

  .sk-root .agente-item:hover { background: #0d0d0d; }

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

  .sk-root .agentes-coda {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(18px, 2.5vw, 22px);
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: -0.01em;
    margin-top: 32px;
    line-height: 1.4;
  }

  .sk-root .agentes-coda em {
    font-style: normal;
    color: var(--accent);
  }

  /* SEÇÃO 3 — PARA QUEM */
  .sk-root .para-quem {
    background: var(--bg);
    border-top: 1px solid var(--linha);
  }

  .sk-root .bullets-lista {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
  }

  .sk-root .bullet-item {
    display: grid;
    grid-template-columns: 24px 1fr;
    gap: 20px;
    align-items: baseline;
    padding: 22px 0;
    border-bottom: 1px solid var(--linha);
  }

  .sk-root .bullet-item:first-child {
    border-top: 1px solid var(--linha);
  }

  .sk-root .bullet-check {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--accent);
    line-height: 1.6;
    user-select: none;
  }

  .sk-root .bullet-texto {
    font-size: clamp(15px, 1.8vw, 17px);
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  .sk-root .bullet-texto em {
    font-style: normal;
    color: var(--text-primary);
    font-weight: 500;
  }

  /* SEÇÃO 4 — URGÊNCIA */
  .sk-root .urgencia {
    background: #050505;
    border-top: 1px solid var(--linha);
    text-align: center;
  }

  .sk-root .urgencia-inner {
    max-width: 680px;
    margin: 0 auto;
  }

  .sk-root .cd-wrapper {
    margin: 40px auto 48px;
    padding: 36px 24px 28px;
    border: 1px solid var(--border-active);
    border-radius: 16px;
    background: var(--surface);
    position: relative;
    overflow: hidden;
  }

  .sk-root .cd-wrapper::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.4;
  }

  .sk-root .cd-caption {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.45;
    margin-top: 20px;
  }

  .sk-root .urgencia-texto {
    color: var(--text-secondary);
    font-size: clamp(15px, 1.8vw, 17px);
    line-height: 1.7;
    font-weight: 300;
    margin: 0 auto 36px;
    max-width: 520px;
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
    transition: background 0.2s ease, transform 0.2s ease;
    border: none;
    cursor: pointer;
  }

  .sk-root .btn-anchor:hover {
    background: #f0e0c4;
    transform: translateY(-2px);
  }

  .sk-root .cta-nota {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-secondary);
    margin-top: 16px;
    opacity: 0.4;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* AUTORIDADE */
  .sk-root .autoridade {
    background: #050505;
    border-top: 1px solid var(--linha);
    border-bottom: 1px solid var(--linha);
  }

  .sk-root .autoridade-texto {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sk-root .autoridade-texto p {
    font-size: clamp(15px, 1.9vw, 18px);
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  .sk-root .autoridade-texto em {
    font-style: normal;
    color: var(--text-primary);
    font-weight: 500;
  }

  .sk-root .autoridade-provas {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 48px;
    padding-top: 40px;
    border-top: 1px solid var(--linha);
    flex-wrap: wrap;
    gap: 8px;
  }

  .sk-root .prova-item {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 120px;
  }

  .sk-root .prova-num {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(40px, 6vw, 64px);
    font-weight: 700;
    color: var(--accent);
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .sk-root .prova-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.55;
    margin-top: 8px;
  }

  .sk-root .prova-sep {
    width: 1px;
    height: 60px;
    background: var(--linha);
    flex-shrink: 0;
    margin: 0 24px;
  }

  @media (max-width: 640px) {
    .sk-root .autoridade-provas {
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
    }
    .sk-root .prova-sep { display: none; }
  }

  /* FOOTER */
  .sk-root .footer {
    padding: 36px 24px;
    text-align: center;
    border-top: 1px solid var(--linha);
  }

  .sk-root .footer-logo {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.02em;
    margin-bottom: 12px;
  }

  .sk-root .footer-logo span { color: var(--accent); }

  .sk-root .footer-links {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .sk-root .footer-links a {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    text-decoration: none;
    opacity: 0.4;
    letter-spacing: 0.08em;
    transition: opacity 0.2s;
  }

  .sk-root .footer-links a:hover { opacity: 0.85; }

  .sk-root .footer-copy {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-secondary);
    opacity: 0.28;
    letter-spacing: 0.06em;
  }

  /* RESPONSIVO */
  @media (max-width: 768px) {
    .sk-root section       { padding: 64px 0; }
    .sk-root .form-box     { padding: 28px 20px 20px; }
    .sk-root .agente-item  {
      grid-template-columns: 40px 1fr;
      gap: 16px;
      padding: 22px 20px;
    }
    .sk-root .agente-letra { font-size: 30px; }
    .sk-root .cd-wrapper   { padding: 28px 16px 20px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sk-root .pulse { animation: none; }
    .sk-root .btn-anchor:hover { transform: none; }
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
              Carrinho abre 23 de julho
            </div>

            <h1>
              Torne-se o especialista<br />
              em IA que as empresas<br />
              <span className="accent">procuram.</span>
            </h1>

            <p className="hero-sub">
              A Formação S.H.A.R.K. é o método que transforma qualquer profissional
              em prestador de serviço de IA — sem precisar saber programar.
            </p>

            <div className="form-box">
              <SharkForm />
            </div>

            <div className="form-meta">
              <span>Vagas limitadas</span>
              <span className="sep" />
              <span>Acesso antecipado</span>
              <span className="sep" />
              <span>R$497</span>
            </div>

          </div>
        </section>


        {/* O QUE É A FORMAÇÃO */}
        <section className="o-que-e">
          <div className="container narrow">
            <span className="section-label">O método</span>
            <h2>
              Um método. Cinco agentes.{" "}
              <span className="accent">A equipe de IA</span>{" "}
              que você opera para atender qualquer empresa.
            </h2>
          </div>

          <div className="container">
            <div
              className="agentes-lista"
              style={{ maxWidth: "760px", margin: "48px auto 0" }}
            >
              <div className="agente-item">
                <div className="agente-letra">S</div>
                <div>
                  <div className="agente-nome">Shiva — Arquiteta de produto</div>
                  <p className="agente-desc">
                    <strong>Descobre o que o cliente realmente precisa.</strong>{" "}
                    Mapeie o problema antes de propor qualquer solução. A maioria
                    entrega sem entender — Shiva te ensina a perguntar certo primeiro.
                  </p>
                </div>
              </div>

              <div className="agente-item">
                <div className="agente-letra">H</div>
                <div>
                  <div className="agente-nome">Hades — Estrategista técnico</div>
                  <p className="agente-desc">
                    <strong>Planeja a solução.</strong>{" "}
                    Cria roadmaps de automação que o cliente entende e aprova.
                    Não basta ter a resposta técnica — o cliente precisa ver o caminho
                    e querer pagar por ele.
                  </p>
                </div>
              </div>

              <div className="agente-item">
                <div className="agente-letra">A</div>
                <div>
                  <div className="agente-nome">Atlas — Executor</div>
                  <p className="agente-desc">
                    <strong>Implementa e entrega.</strong>{" "}
                    O agente que não pergunta — faz. Você vai aprender a comandar esse
                    nível de execução sem escrever uma linha de código.
                  </p>
                </div>
              </div>

              <div className="agente-item">
                <div className="agente-letra">R</div>
                <div>
                  <div className="agente-nome">Ravena — QA</div>
                  <p className="agente-desc">
                    <strong>Garante que funciona.</strong>{" "}
                    O que separa o freelancer do especialista é o que ele valida antes
                    de entregar. Ravena te dá o padrão de qualidade que justifica seu preço.
                  </p>
                </div>
              </div>

              <div className="agente-item">
                <div className="agente-letra">K</div>
                <div>
                  <div className="agente-nome">Kerberos — Segurança</div>
                  <p className="agente-desc">
                    <strong>Protege tudo antes de ir ao ar.</strong>{" "}
                    Quem entrega com segurança cobra mais. Kerberos é o que clientes
                    de alto padrão exigem — mesmo sem saber o nome.
                  </p>
                </div>
              </div>
            </div>

            <div className="container narrow" style={{ marginTop: "32px" }}>
              <p className="agentes-coda">
                Você aprende a operar os cinco.{" "}
                <em>O cliente vê resultado.</em>
              </p>
            </div>
          </div>
        </section>


        {/* AUTORIDADE */}
        <section className="autoridade">
          <div className="container narrow">
            <span className="section-label">Quem ensina</span>
            <h2>Eu uso o que<br /><span className="accent">eu ensino.</span></h2>

            <div className="autoridade-texto">
              <p>
                A HubTech atende empresas com o mesmo método S.H.A.R.K. que você vai aprender.
                Cada projeto entregue valida ainda mais o método.
              </p>
              <p>
                Cada turma da Formação recebe o que está funcionando <em>agora</em>{" "}
                — não o que funcionou no ano passado.
              </p>
            </div>

            <div className="autoridade-provas">
              <div className="prova-item">
                <span className="prova-num">5</span>
                <span className="prova-label">agentes em operação real</span>
              </div>
              <div className="prova-sep" />
              <div className="prova-item">
                <span className="prova-num">27</span>
                <span className="prova-label">alunos formados</span>
              </div>
              <div className="prova-sep" />
              <div className="prova-item">
                <span className="prova-num">B2B</span>
                <span className="prova-label">clientes ativos via Solutions</span>
              </div>
            </div>
          </div>
        </section>


        {/* PARA QUEM É */}
        <section className="para-quem">
          <div className="container narrow">
            <span className="section-label">Para quem é</span>
            <h2>Isso é pra você se...</h2>

            <div className="bullets-lista">
              <div className="bullet-item">
                <span className="bullet-check">✓</span>
                <p className="bullet-texto">
                  Você quer uma{" "}
                  <em>nova fonte de renda prestando serviço de IA para empresas</em>
                  {" "}— e quer chegar lá com um método, não tentativa e erro.
                </p>
              </div>

              <div className="bullet-item">
                <span className="bullet-check">✓</span>
                <p className="bullet-texto">
                  Você não quer depender de{" "}
                  <em>saber programar para entregar resultado</em>
                  {" "}— e não deveria precisar.
                </p>
              </div>

              <div className="bullet-item">
                <span className="bullet-check">✓</span>
                <p className="bullet-texto">
                  Você quer <em>um método</em>, não mais um curso genérico de
                  ferramentas que fica obsoleto em seis meses.
                </p>
              </div>

              <div className="bullet-item">
                <span className="bullet-check">✓</span>
                <p className="bullet-texto">
                  Você quer ser o profissional que as empresas procuram{" "}
                  <em>quando precisam de IA</em>
                  {" "}— não o que elas ignoram.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* URGÊNCIA + CONTADOR */}
        <section className="urgencia">
          <div className="container">
            <div className="urgencia-inner">
              <span className="section-label">Lista de espera aberta agora</span>
              <h2>Por que lista de espera?</h2>

              <div className="cd-wrapper">
                <SharkCountdown />
                <p className="cd-caption">até o carrinho abrir · 23/jul às 15h</p>
              </div>

              <p className="urgencia-texto">
                O carrinho abre em <strong>23 de julho</strong> com vagas limitadas.
                Quem está na lista recebe{" "}
                <strong>acesso prioritário ao carrinho</strong> e{" "}
                <strong>condição especial de lançamento</strong> — antes de qualquer
                anúncio público.
              </p>

              <a href="#topo" className="btn-anchor">
                Quero garantir minha vaga
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
            <a
              href="https://redpro.com.br/privacidade"
              target="_blank"
              rel="noopener noreferrer"
            >
              Política de Privacidade
            </a>
            <a
              href="https://redpro.com.br/termos"
              target="_blank"
              rel="noopener noreferrer"
            >
              Termos de Uso
            </a>
          </div>
          <p className="footer-copy">© 2026 RedPro AI Academy</p>
        </footer>

      </div>
    </>
  );
}
