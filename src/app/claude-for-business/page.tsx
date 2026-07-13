import type { Metadata } from "next";

const CHECKOUT_URL = "https://pay.hotmart.com/V105607171C?checkoutMode=10";

export const metadata: Metadata = {
  title: "Claude for Business — RedPro AI Academy",
  description:
    "8 aulas para sair com um sistema de IA configurado nos seus processos. Não teoria, não lista de prompts. Sistema rodando.",
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/claude-for-business",
    title: "Claude for Business — RedPro AI Academy",
    description:
      "8 aulas para sair com um sistema de IA configurado nos seus processos. Não teoria, não lista de prompts. Sistema rodando.",
    locale: "pt_BR",
  },
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .cfb-root, .cfb-root *, .cfb-root *::before, .cfb-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cfb-root {
    --laranja: #F97316;
    --laranja-dim: #C2500E;
    --laranja-glow: rgba(249,115,22,.18);
    --acid: #D6FF3A;
    --preto: #080808;
    --grafite: #111111;
    --aco: #1C2530;
    --linha: #1F1F1F;
    --texto-mid: #8A8A8A;
    --texto-soft: #B8B8B8;
    --branco: #F5F5F5;

    background: var(--preto);
    color: var(--branco);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  /* Tipografia base */
  .cfb-root h1, .cfb-root h2, .cfb-root h3, .cfb-root .display {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 900;
    letter-spacing: -.02em;
    line-height: 1.0;
  }

  .cfb-root h2 { font-size: clamp(30px, 5vw, 52px); margin-bottom: 12px; }
  .cfb-root h3 { font-size: clamp(20px, 2.4vw, 26px); font-weight: 800; line-height: 1.15; }

  .cfb-root em.lj {
    font-style: normal;
    color: var(--laranja);
  }

  .cfb-root .section-label {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: var(--laranja);
    margin-bottom: 18px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(249,115,22,.3);
  }

  .cfb-root .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .cfb-root .narrow { max-width: 760px; margin: 0 auto; }

  .cfb-root section { padding: 80px 0; position: relative; }

  /* HERO */
  .cfb-root .hero {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 24px 60px;
    position: relative;
    overflow: hidden;
  }

  .cfb-root .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% -10%, var(--laranja-glow) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 20% 90%, rgba(249,115,22,.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .cfb-root .hero-inner {
    max-width: 1180px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .cfb-root .hero-text { text-align: left; }

  .cfb-root .hero-foto-wrap {
    position: relative;
    max-width: 480px;
    width: 100%;
    justify-self: end;
  }

  .cfb-root .hero-foto {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    object-position: center top;
    display: block;
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 85%);
            mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 85%);
  }

  @media (max-width: 760px) {
    .cfb-root .hero-inner {
      grid-template-columns: 1fr;
      gap: 48px;
      max-width: 820px;
    }
    .cfb-root .hero-foto-wrap {
      max-width: 320px;
      justify-self: start;
      order: 2;
    }
    .cfb-root .hero-text { order: 1; }
  }

  .cfb-root .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(249,115,22,.08);
    border: 1px solid rgba(249,115,22,.3);
    color: var(--laranja);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: 8px 18px;
    border-radius: 100px;
    margin-bottom: 36px;
  }

  .cfb-root .badge .dot-pulse {
    width: 6px; height: 6px;
    background: var(--laranja);
    border-radius: 50%;
    animation: cfb-pulse 2s ease-in-out infinite;
  }

  @keyframes cfb-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .3; }
  }

  .cfb-root h1 {
    font-size: clamp(38px, 5.5vw, 68px);
    font-weight: 900;
    margin-bottom: 28px;
  }

  .cfb-root h1 .thin {
    display: block;
    font-weight: 200;
    font-size: .55em;
    color: var(--texto-soft);
    margin-top: 10px;
    letter-spacing: -.01em;
  }

  .cfb-root .subheadline {
    font-size: clamp(16px, 1.8vw, 19px);
    font-weight: 400;
    color: var(--texto-soft);
    max-width: 580px;
    margin: 0 0 42px;
    line-height: 1.55;
  }

  .cfb-root .proof-strip {
    display: flex;
    justify-content: flex-start;
    gap: 28px;
    flex-wrap: wrap;
    margin-bottom: 42px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--texto-mid);
  }

  .cfb-root .proof-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cfb-root .proof-item .ic {
    width: 5px; height: 5px;
    background: var(--laranja);
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Botões */
  .cfb-root .btn {
    display: inline-block;
    background: var(--laranja);
    color: var(--preto);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: -.01em;
    padding: 18px 40px;
    border-radius: 8px;
    text-decoration: none;
    transition: all .2s ease;
    border: 2px solid var(--laranja);
    cursor: pointer;
  }

  .cfb-root .btn:hover {
    background: transparent;
    color: var(--laranja);
    transform: translateY(-2px);
  }

  .cfb-root .btn-large {
    font-size: 20px;
    padding: 22px 56px;
  }

  .cfb-root .cta-note {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--texto-mid);
    margin-top: 18px;
    letter-spacing: .02em;
  }

  /* Sinais */
  .cfb-root .sinais {
    background: linear-gradient(180deg, var(--preto) 0%, #060606 100%);
    border-top: 1px solid var(--linha);
  }

  .cfb-root .sinal-list { display: grid; gap: 24px; margin-top: 48px; }

  .cfb-root .sinal-item {
    display: grid;
    grid-template-columns: 60px 1fr;
    gap: 24px;
    align-items: start;
    padding: 28px 0;
    border-top: 1px solid var(--linha);
  }

  .cfb-root .sinal-item:last-child { border-bottom: 1px solid var(--linha); }

  .cfb-root .sinal-num {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 48px;
    font-weight: 200;
    color: var(--laranja);
    line-height: 1;
  }

  .cfb-root .sinal-titulo {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: 22px;
    margin-bottom: 8px;
  }

  .cfb-root .sinal-texto { color: var(--texto-soft); }

  /* Pilares */
  .cfb-root .pilares {
    background: #050505;
    border-top: 1px solid var(--linha);
  }

  .cfb-root .pilar-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--linha);
    border: 1px solid var(--linha);
    margin-top: 56px;
  }

  .cfb-root .pilar {
    background: var(--preto);
    padding: 40px 32px;
    transition: background .25s ease;
  }

  .cfb-root .pilar:hover { background: #0E0E0E; }

  .cfb-root .pilar-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--laranja);
    letter-spacing: .15em;
    margin-bottom: 16px;
  }

  .cfb-root .pilar-nome {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 900;
    font-size: 32px;
    margin-bottom: 16px;
    letter-spacing: -.02em;
  }

  .cfb-root .pilar-desc { color: var(--texto-soft); font-size: 15px; line-height: 1.6; }

  /* Blocos */
  .cfb-root .blocos { background: var(--preto); border-top: 1px solid var(--linha); }

  .cfb-root .bloco-list { display: grid; gap: 32px; margin-top: 56px; }

  .cfb-root .bloco-card {
    background: #0A0A0A;
    border: 1px solid var(--linha);
    border-radius: 12px;
    padding: 40px 36px;
    transition: border-color .25s ease, transform .2s ease;
    position: relative;
  }

  .cfb-root .bloco-card:hover {
    border-color: rgba(249,115,22,.4);
    transform: translateY(-2px);
  }

  .cfb-root .bloco-header {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--linha);
  }

  .cfb-root .bloco-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--laranja);
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .cfb-root .bloco-nome {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 32px;
    font-weight: 900;
    color: var(--branco);
    letter-spacing: -.02em;
    line-height: 1;
  }

  .cfb-root .bloco-card h3 { color: var(--laranja); font-size: 22px; margin-bottom: 14px; }
  .cfb-root .bloco-card p { color: var(--texto-soft); font-size: 15px; line-height: 1.65; }

  /* Jornada */
  .cfb-root .jornada { background: #050505; border-top: 1px solid var(--linha); }

  .cfb-root .aula-list { margin-top: 56px; border-top: 1px solid var(--linha); }

  .cfb-root .aula-row {
    display: grid;
    grid-template-columns: 80px 1fr 1fr;
    gap: 24px;
    padding: 24px 0;
    border-bottom: 1px solid var(--linha);
    align-items: baseline;
    transition: padding-left .2s ease;
  }

  .cfb-root .aula-row:hover { padding-left: 12px; }

  .cfb-root .aula-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: var(--laranja);
    letter-spacing: .1em;
  }

  .cfb-root .aula-titulo {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: 19px;
  }

  .cfb-root .aula-desc { color: var(--texto-mid); font-size: 14px; line-height: 1.5; }

  /* Sobre */
  .cfb-root .sobre {
    background: linear-gradient(180deg, var(--preto) 0%, rgba(28,37,48,0.08) 100%);
    border-top: 1px solid var(--linha);
  }

  .cfb-root .sobre-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 96px;
    align-items: center;
  }

  .cfb-root .sobre-foto-wrap {
    position: relative;
    max-width: 440px;
    width: 100%;
  }

  .cfb-root .sobre-foto {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    display: block;
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 85%);
            mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 85%);
  }

  .cfb-root .sobre-bio p {
    color: var(--texto-soft);
    margin-top: 18px;
    line-height: 1.7;
  }

  .cfb-root .sobre-bullets {
    list-style: none;
    margin-top: 28px;
    padding: 0;
    display: grid;
    gap: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--texto-soft);
  }

  .cfb-root .sobre-bullets li {
    display: grid;
    grid-template-columns: 14px 1fr;
    gap: 12px;
    align-items: start;
    padding-top: 12px;
    border-top: 1px solid var(--linha);
  }

  .cfb-root .sobre-bullets li::before {
    content: "//";
    color: var(--laranja);
    font-weight: 700;
  }

  @media (max-width: 820px) {
    .cfb-root .sobre-grid {
      grid-template-columns: 1fr;
      gap: 56px;
    }
    .cfb-root .sobre-foto-wrap { max-width: 280px; }
  }

  /* Depoimentos */
  .cfb-root .depoimentos { background: var(--preto); border-top: 1px solid var(--linha); }

  .cfb-root .depo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 56px;
  }

  .cfb-root .depo-card {
    background: #0C0C0C;
    border: 1px solid var(--linha);
    border-radius: 12px;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    transition: border-color .25s ease, transform .2s ease;
  }

  .cfb-root .depo-card:hover {
    border-color: rgba(249,115,22,.4);
    transform: translateY(-3px);
  }

  .cfb-root .depo-quote {
    color: var(--branco);
    font-size: 15px;
    line-height: 1.65;
    margin-bottom: 24px;
    flex-grow: 1;
  }

  .cfb-root .depo-quote::before {
    content: '"';
    font-family: 'Bricolage Grotesque', serif;
    font-size: 56px;
    font-weight: 900;
    color: var(--laranja);
    line-height: 0;
    vertical-align: -10px;
    margin-right: 4px;
  }

  .cfb-root .depo-autor {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-top: 20px;
    border-top: 1px solid var(--linha);
  }

  .cfb-root .depo-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--aco);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: 18px;
    color: var(--laranja);
    border: 1px solid rgba(249,115,22,.3);
    flex-shrink: 0;
  }

  .cfb-root .depo-info strong {
    display: block;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 16px;
    font-weight: 800;
  }

  .cfb-root .depo-info span { color: var(--texto-mid); font-size: 13px; }

  /* Preço */
  .cfb-root .preco {
    background: linear-gradient(180deg, #050505 0%, var(--preto) 100%);
    border-top: 1px solid var(--linha);
    text-align: center;
  }

  .cfb-root .preco-card {
    max-width: 580px;
    margin: 56px auto 0;
    background: var(--preto);
    border: 1px solid rgba(249,115,22,.3);
    border-radius: 16px;
    padding: 48px 36px;
    position: relative;
  }

  .cfb-root .preco-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: radial-gradient(ellipse at 50% 0%, var(--laranja-glow) 0%, transparent 60%);
    pointer-events: none;
  }

  .cfb-root .preco-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--laranja);
    letter-spacing: .15em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .cfb-root .preco-comparacao {
    font-size: 14px;
    color: var(--texto-mid);
    margin-bottom: 8px;
  }

  .cfb-root .preco-comparacao s { opacity: .6; }

  .cfb-root .preco-valor {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 88px;
    font-weight: 900;
    color: var(--branco);
    line-height: 1;
    margin: 14px 0 6px;
    letter-spacing: -.04em;
  }

  .cfb-root .preco-valor .moeda {
    font-size: 36px;
    font-weight: 200;
    color: var(--laranja);
    vertical-align: 30px;
    margin-right: 4px;
  }

  .cfb-root .preco-de {
    font-size: 34px;
    font-weight: 400;
    color: var(--texto-mid);
    text-decoration: line-through;
    text-decoration-color: var(--laranja);
    letter-spacing: -.02em;
    margin-right: 16px;
    vertical-align: 18px;
  }
  .cfb-root .preco-de .moeda-de {
    font-size: 18px;
    font-weight: 300;
    vertical-align: 6px;
    margin-right: 2px;
  }
  @media (max-width: 640px) {
    .cfb-root .preco-de { font-size: 26px; vertical-align: 14px; margin-right: 10px; }
    .cfb-root .preco-de .moeda-de { font-size: 14px; }
  }

  .cfb-root .preco-vs {
    font-size: 14px;
    color: var(--texto-soft);
    margin: 18px 0 32px;
    line-height: 1.6;
  }

  .cfb-root .preco-vs strong { color: var(--laranja); }

  .cfb-root .garantia {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--texto-mid);
    margin-top: 22px;
    letter-spacing: .02em;
  }

  .cfb-root .garantia strong { color: var(--branco); font-weight: 500; }

  /* Combinados */
  .cfb-root .combinados { background: var(--preto); border-top: 1px solid var(--linha); }

  .cfb-root .combinados-intro {
    color: var(--texto-soft);
    max-width: 620px;
    font-size: 15px;
    line-height: 1.7;
  }

  /* FAQ */
  .cfb-root .faq { background: #050505; border-top: 1px solid var(--linha); }

  .cfb-root .faq-list { margin-top: 48px; }

  .cfb-root details {
    border-bottom: 1px solid var(--linha);
    padding: 22px 0;
  }

  .cfb-root details:first-child { border-top: 1px solid var(--linha); }

  .cfb-root summary {
    list-style: none;
    cursor: pointer;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  .cfb-root summary::-webkit-details-marker { display: none; }

  .cfb-root summary::after {
    content: '+';
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 28px;
    font-weight: 200;
    color: var(--laranja);
    flex-shrink: 0;
    transition: transform .2s ease;
  }

  .cfb-root details[open] summary::after {
    content: '−';
    transform: rotate(0deg);
  }

  .cfb-root .faq-body {
    margin-top: 14px;
    color: var(--texto-soft);
    font-size: 15px;
    line-height: 1.7;
  }

  /* CTA final */
  .cfb-root .cta-final {
    background: linear-gradient(180deg, var(--preto) 0%, #050505 100%);
    border-top: 1px solid var(--linha);
    text-align: center;
  }

  .cfb-root .cta-final h2 { max-width: 720px; margin: 0 auto 18px; }

  /* Assinatura */
  .cfb-root .assinatura {
    padding: 32px 24px;
    text-align: center;
    border-top: 1px solid var(--linha);
    color: var(--texto-mid);
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }

  .cfb-root .assinatura strong { color: var(--branco); }

  /* Responsivo */
  @media (max-width: 820px) {
    .cfb-root section { padding: 64px 0; }
    .cfb-root .pilar-grid { grid-template-columns: 1fr; }
    .cfb-root .depo-grid { grid-template-columns: 1fr; }
    .cfb-root .bloco-card { padding: 28px 24px; }
    .cfb-root .bloco-nome { font-size: 26px; }

    .cfb-root .aula-row {
      grid-template-columns: 56px 1fr;
      row-gap: 6px;
    }

    .cfb-root .aula-desc {
      grid-column: 2;
      margin-top: 4px;
    }

    .cfb-root .sinal-item {
      grid-template-columns: 44px 1fr;
      gap: 16px;
    }

    .cfb-root .sinal-num { font-size: 36px; }
    .cfb-root .preco-valor { font-size: 64px; }
    .cfb-root .preco-valor .moeda { font-size: 28px; vertical-align: 22px; }
    .cfb-root .btn-large { font-size: 17px; padding: 18px 36px; }
  }
</style>

<div class="cfb-root">

  <!-- HERO -->
  <section class="hero">
    <div class="hero-inner">

      <div class="hero-text">
        <div class="badge">
          <span class="dot-pulse"></span>
          Claude for Business · RedPro AI Academy
        </div>

        <h1>
          Pare de usar IA <em class="lj">como assistente.</em>
          <span class="thin">Comece a configurar IA que trabalha pelo seu negócio.</span>
        </h1>

        <p class="subheadline">
          8 aulas. Cada uma com uma tarefa. Você sai com um sistema configurado nos seus processos — não com uma lista de prompts pra copiar e colar.
        </p>

        <div class="proof-strip">
          <div class="proof-item"><span class="ic"></span>3 blocos: Chat · Cowork · Code</div>
          <div class="proof-item"><span class="ic"></span>Sistema rodando na primeira semana</div>
          <div class="proof-item"><span class="ic"></span>Acesso vitalício com os combinados</div>
        </div>

        <a href="${CHECKOUT_URL}" class="btn btn-large">Quero o sistema rodando — R$62</a>
        <p class="cta-note">Acesso imediato após o pagamento · Garantia incondicional</p>
      </div>

      <div class="hero-foto-wrap">
        <img class="hero-foto" src="/cfb/lp_hero_v2.png" alt="Red, fundador da RedPro AI Academy, sorrindo de blazer e camisa social num escritório de loft com janelas amplas e parede de tijolinho">
      </div>

    </div>
  </section>


  <!-- OS 3 SINAIS -->
  <section class="sinais">
    <div class="container narrow">

      <span class="section-label">Diagnóstico</span>
      <h2>Você usa IA há meses<br>e o negócio ainda depende de você.</h2>
      <p style="color:var(--texto-soft); margin-top:14px;">
        Tem três sinais de que você está no modelo antigo. Se você se reconhecer em pelo menos um, esse curso foi feito pra você:
      </p>

      <div class="sinal-list">

        <div class="sinal-item">
          <div class="sinal-num">01</div>
          <div>
            <div class="sinal-titulo">Você explica quem você é toda vez que abre o Claude.</div>
            <p class="sinal-texto">Abre uma conversa nova: "eu tenho uma empresa de…, meu cliente é…, meu tom é…". Toda vez. Do zero. Como se ele nunca tivesse te visto. Porque realmente nunca viu — você nunca deu memória pra ele.</p>
          </div>
        </div>

        <div class="sinal-item">
          <div class="sinal-num">02</div>
          <div>
            <div class="sinal-titulo">Você usa IA para tarefas, não para processos.</div>
            <p class="sinal-texto">Pede uma coisa, ele entrega, acabou. Na semana que vem você pede de novo. E explica tudo de novo. Você não ensinou o processo — só pediu o resultado.</p>
          </div>
        </div>

        <div class="sinal-item">
          <div class="sinal-num">03</div>
          <div>
            <div class="sinal-titulo">Quando você para, o negócio para.</div>
            <p class="sinal-texto">Se você não está lá respondendo, não tem atendimento. Se você não está lá escrevendo, não tem proposta. Se você não está lá analisando, não tem relatório. O negócio é você. E você está esgotado.</p>
          </div>
        </div>

      </div>

    </div>
  </section>


  <!-- OS 3 PILARES -->
  <section class="pilares">
    <div class="container">

      <div class="narrow" style="text-align:center;">
        <span class="section-label">O mecanismo</span>
        <h2>Quem tem resultado<br>parou de pedir <em class="lj">e começou a configurar.</em></h2>
        <p style="color:var(--texto-soft); margin-top:14px;">Tudo que você vai construir no curso roda em cima de três pilares. Eles aparecem em todas as aulas:</p>
      </div>

      <div class="pilar-grid">

        <div class="pilar">
          <div class="pilar-num">PILAR 01</div>
          <div class="pilar-nome">Contexto</div>
          <p class="pilar-desc">O Claude precisa conhecer o seu negócio — não negócio em geral. Quem é você, o que vende, pra quem, em que tom, com quais regras. Você configura uma vez. Nunca mais explica.</p>
        </div>

        <div class="pilar">
          <div class="pilar-num">PILAR 02</div>
          <div class="pilar-nome">Comando</div>
          <p class="pilar-desc">A qualidade da instrução determina a qualidade do resultado. Comando vago, resultado vago. Comando específico, com exemplo e formato definido, gera algo que você usa na hora.</p>
        </div>

        <div class="pilar">
          <div class="pilar-num">PILAR 03</div>
          <div class="pilar-nome">Processos</div>
          <p class="pilar-desc">Antes de pedir pro Claude executar, você precisa saber o que sua empresa faz. Como atende. Como cobra. Como entrega. Quem automatiza caos, só torna o caos mais rápido. Quem tem processo claro ensina uma vez — e o Claude executa pra sempre.</p>
        </div>

      </div>

    </div>
  </section>


  <!-- OS 3 BLOCOS -->
  <section class="blocos">
    <div class="container">

      <div class="narrow">
        <span class="section-label">A jornada</span>
        <h2>Um sistema que aprende, executa e constrói<br>— em três blocos.</h2>
      </div>

      <div class="bloco-list">

        <div class="bloco-card">
          <div class="bloco-header">
            <span class="bloco-tag">Bloco 01</span>
            <span class="bloco-nome">Chat</span>
          </div>
          <h3>O Claude aprende o seu negócio.</h3>
          <p>Você dá memória permanente pro Claude. Ele passa a conhecer o seu tom, suas regras, seus processos. Cria Skills que ativam sozinhas quando a situação pede. Gera Artifacts — entregáveis reais que você usa no dia seguinte.</p>
        </div>

        <div class="bloco-card">
          <div class="bloco-header">
            <span class="bloco-tag">Bloco 02</span>
            <span class="bloco-nome">Cowork</span>
          </div>
          <h3>O Claude sai da janela de conversa.</h3>
          <p>Acessa seus arquivos locais. Lê suas planilhas. Roda tarefas em horários que você define — Schedule rodando às 6h da manhã, briefing pronto antes de você abrir o computador. Dispatch executando ordens que você manda do celular enquanto está longe.</p>
        </div>

        <div class="bloco-card">
          <div class="bloco-header">
            <span class="bloco-tag">Bloco 03</span>
            <span class="bloco-nome">Code</span>
          </div>
          <h3>O Claude constrói o que você descreve.</h3>
          <p>Você descreve em português o que quer automatizar. Ele gera o código. Você vê funcionando. Sem desenvolvedor. Sem agência. Sem 4 meses de prazo. Na Aula 6 você vai ver um app de delivery completo nascer ao vivo.</p>
        </div>

      </div>

    </div>
  </section>


  <!-- AS 8 AULAS -->
  <section class="jornada">
    <div class="container narrow">

      <span class="section-label">As 8 aulas</span>
      <h2>Cada aula tem uma tarefa.<br>Não é opcional.</h2>

      <div class="aula-list">

        <div class="aula-row">
          <div class="aula-num">AULA 0</div>
          <div class="aula-titulo">Os Combinados</div>
          <div class="aula-desc">O contrato que garante acesso vitalício — e por que ele existe.</div>
        </div>

        <div class="aula-row">
          <div class="aula-num">AULA 1</div>
          <div class="aula-titulo">Mentalidade AI Business</div>
          <div class="aula-desc">Por que você ainda faz tudo na mão — e a pergunta que muda o jogo.</div>
        </div>

        <div class="aula-row">
          <div class="aula-num">AULA 2</div>
          <div class="aula-titulo">Seu Novo Sócio</div>
          <div class="aula-desc">Instalar o Claude Desktop. Criar o Project. Configurar a primeira Skill.</div>
        </div>

        <div class="aula-row">
          <div class="aula-num">AULA 3</div>
          <div class="aula-titulo">A Memória do Negócio</div>
          <div class="aula-desc">Ensinar o negócio para o Claude. Conectar Drive. Caso real do escritório jurídico Silva &amp; Advogados.</div>
        </div>

        <div class="aula-row">
          <div class="aula-num">AULA 4</div>
          <div class="aula-titulo">Seu Primeiro Ativo</div>
          <div class="aula-desc">Resposta vs. ativo. Criar Artifact que vira template. Caso real do Studio Força &amp; Saúde.</div>
        </div>

        <div class="aula-row">
          <div class="aula-num">AULA 5</div>
          <div class="aula-titulo">Claude Fora do Computador</div>
          <div class="aula-desc">Cowork, Schedule e Dispatch. Caso real da Imobiliária Horizonte rodando sem o corretor.</div>
        </div>

        <div class="aula-row">
          <div class="aula-num">AULA 6</div>
          <div class="aula-titulo">Piloto Automático</div>
          <div class="aula-desc">Claude Code construindo um app de delivery completo a partir de uma instrução em português.</div>
        </div>

        <div class="aula-row">
          <div class="aula-num">AULA 7</div>
          <div class="aula-titulo">Onde Você Vai a Partir Daqui</div>
          <div class="aula-desc">O que esse curso entrega — e o teto honesto do que vem depois.</div>
        </div>

      </div>

    </div>
  </section>


  <!-- SOBRE -->
  <section class="sobre">
    <div class="container">

      <div class="sobre-grid">

        <div class="sobre-foto-wrap">
          <img class="sobre-foto" src="/cfb/lp_sobre_v2.png" alt="Red, criador do método e fundador da RedPro AI Academy, apontando diretamente para a câmera num ambiente claro com janelas amplas">
        </div>

        <div class="sobre-bio">
          <span class="section-label">Quem construiu</span>
          <p style="font-size:18px; color:#fff; font-weight:600; margin:8px 0 16px; letter-spacing:-0.01em;">Victor Lima · Criador da RedPro AI Academy</p>
          <h2>Engenharia, segurança e 10 anos de TI federal<br><em class="lj">— transformados em método.</em></h2>
          <p>
            Engenheiro de telecomunicações, pós-graduado em segurança da informação, MBA em IA para negócios. 10 anos gerindo TI no setor público federal — vi de dentro o que trava operação grande. Larguei a estabilidade pra construir o que ensino aqui.
          </p>
          <p>
            O curso é o método que uso pra rodar a RedPro AI Academy todo dia. Cada bloco — Chat, Cowork, Code — está em produção na operação. Você não vai aprender a usar IA. Vai aprender a configurar IA pro seu negócio com a cabeça de quem entende infraestrutura, segurança e processo.
          </p>
          <ul class="sobre-bullets">
            <li>Engenheiro de telecomunicações · pós em segurança da informação · MBA em IA para negócios</li>
            <li>10 anos de gestão de TI no setor público federal</li>
            <li>Criador da RedPro AI Academy e do Método S.H.A.R.K. — pipeline de 5 agentes em produção</li>
            <li>Empresário, marido e pai — construindo um negócio de IA que não depende de mim</li>
          </ul>
        </div>

      </div>

    </div>
  </section>


  <!-- DEPOIMENTOS -->
  <section class="depoimentos">
    <div class="container">

      <div class="narrow">
        <span class="section-label">Quem já fez</span>
        <h2>Mensagens que chegaram no meu direct<br>depois das aulas.</h2>
      </div>

      <div class="depo-grid">

        <div class="depo-card">
          <p class="depo-quote">cara, eu tava até 1h da manhã respondendo orçamento no zap toda noite. fiz o Project ontem com tudo que você mandou na aula 2 — joguei lá o tom da clínica, os procedimentos, os valores. hoje testei. mandei ele escrever um orçamento de harmonização e cara, saiu IGUAL eu escrevo. até o "amorzinho" no final ele pôs. eu chorei.</p>
          <div class="depo-autor">
            <div class="depo-avatar">M</div>
            <div class="depo-info">
              <strong>Marianna</strong>
              <span>Dona de clínica de estética</span>
            </div>
          </div>
        </div>

        <div class="depo-card">
          <p class="depo-quote">Victor, bom dia. cara, eu configurei o Schedule segunda. todo dia 6h ele puxa as movimentações do Drive e me manda um resumo do que cada cliente movimentou no dia anterior. faz 4 dias rodando.</p>
          <div class="depo-autor">
            <div class="depo-avatar">B</div>
            <div class="depo-info">
              <strong>Bruno</strong>
              <span>Contador · escritório com 60 clientes</span>
            </div>
          </div>
        </div>

        <div class="depo-card">
          <p class="depo-quote">Red, eu segui a aula 6 ontem à noite. copiei o prompt que você passou e mandei no Claude Code pra fazer um sisteminha de ordem de serviço pra oficina. cara. em 40 minutos tava rodando. 40 MINUTOS. o cara me cobrou 1800 e sumiu 3 meses atrás. eu fiz sozinho num sábado à noite. sei nem o que falar.</p>
          <div class="depo-autor">
            <div class="depo-avatar">D</div>
            <div class="depo-info">
              <strong>Délcio</strong>
              <span>Dono de oficina mecânica</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>


  <!-- PREÇO -->
  <section class="preco" id="preco">
    <div class="container">

      <div class="narrow">
        <span class="section-label">A oferta</span>
        <h2>R$62 uma vez.<br>Menos do que um freela cobra só pra te ouvir — e esse não some depois.</h2>
      </div>

      <div class="preco-card">
        <div class="preco-tag">Acesso imediato após pagamento</div>

        <p class="preco-comparacao">Você paga <s>R$100/mês</s> de Claude Pro e ainda usa errado.</p>

        <div class="preco-valor"><span class="preco-de"><span class="moeda-de">R$</span>179</span><span class="moeda">R$</span>62</div>
        <p class="preco-comparacao">uma vez · não é assinatura</p>

        <p class="preco-vs">
          <strong>R$62 uma vez</strong> pra aprender a configurar — vs. R$100/mês pra continuar usando como Google melhorado.
        </p>

        <a href="${CHECKOUT_URL}" class="btn btn-large" id="btn-checkout">Quero entrar agora</a>

        <p class="garantia">
          <strong>Garantia incondicional.</strong><br>
          Não gostou? Manda direct. Devolvo 100% — mesmo fora do prazo da Hotmart. Sem perguntas.
        </p>
      </div>

    </div>
  </section>


  <!-- COMBINADOS -->
  <section class="combinados">
    <div class="container narrow" style="text-align:center;">

      <span class="section-label">Acesso vitalício</span>
      <h2>Esse curso cresce<br>com quem age.</h2>

      <p class="combinados-intro" style="margin: 22px auto 0;">
        Toda vez que a Anthropic lança uma feature nova pra negócios, eu atualizo o curso. Nova ferramenta, nova aula. Você não tá comprando um curso estático — tá comprando acesso a um produto que cresce junto com o Claude.
      </p>

      <p class="combinados-intro" style="margin: 22px auto 0;">
        Mas o acesso vitalício tem condição. Tem alguns combinados — explicados na Aula 0 — e quem cumpre fica aqui pra sempre, com todas as atualizações. Quem não cumpre tem 3 meses. É filtro, não punição. Esse curso é pra quem age, não pra quem assiste.
      </p>

    </div>
  </section>


  <!-- FAQ -->
  <section class="faq">
    <div class="container narrow">

      <span class="section-label">Antes de decidir</span>
      <h2>O que costuma travar a decisão.</h2>

      <div class="faq-list">

        <details>
          <summary>Preciso saber programar?</summary>
          <div class="faq-body">Não. O curso foi feito exatamente pra quem não tem formação técnica. Você vai configurar, escrever em português e testar — sem código. É o mesmo método que eu uso nos meus próprios projetos.</div>
        </details>

        <details>
          <summary>Preciso ter o Claude pago?</summary>
          <div class="faq-body">O plano gratuito do Claude funciona pras primeiras aulas. Pras aulas de Cowork e Code, o plano Pro (R$100/mês) é necessário. O curso te avisa exatamente quando isso importa — você não vai gastar antes da hora.</div>
        </details>

        <details>
          <summary>Quanto tempo por dia preciso dedicar?</summary>
          <div class="faq-body">Cada aula tem entre 12 e 20 minutos. A tarefa leva mais 20 a 40 minutos. Quem faz uma aula por dia termina em uma semana com o sistema funcionando. Quem prefere maratonar no fim de semana, faz tudo num sábado.</div>
        </details>

        <details>
          <summary>O acesso vitalício é garantido automaticamente?</summary>
          <div class="faq-body">Não. Tem condição: seguir o @redpro.ia, preencher a ficha de matrícula e postar resultado quando tiver. Quem faz isso fica vitalício e recebe todas as atualizações. Quem não faz tem 3 meses. É filtro de quem age — não punição.</div>
        </details>

        <details>
          <summary>E se eu não gostar?</summary>
          <div class="faq-body">Manda direct e devolvo 100%. Sem perguntas. Sem prazo. Mesmo fora dos 7 dias da Hotmart. A garantia é incondicional porque eu confio no que eu construí — e você não deveria pagar por algo que não te serviu.</div>
        </details>

        <details>
          <summary>Esse curso é só o Claude ou serve pra qualquer IA?</summary>
          <div class="faq-body">É focado no Claude porque é a ferramenta que entrega o que esse curso promete: Project, Skill, Cowork, Schedule, Dispatch, Code. Outras IAs não têm essas peças hoje. Os três pilares (Contexto · Comando · Processos) servem pra qualquer IA — mas a execução prática é no Claude.</div>
        </details>

        <details>
          <summary>Quanto tempo até eu ter resultado?</summary>
          <div class="faq-body">Na Aula 2 você já configura o primeiro Project e a primeira Skill. Na Aula 4 você cria um Artifact que vai usar no dia seguinte. Quem segue o ritmo de uma aula por dia tem resultado prático na primeira semana.</div>
        </details>

      </div>

    </div>
  </section>


  <!-- CTA FINAL -->
  <section class="cta-final">
    <div class="container narrow">

      <h2>Seu negócio não precisa<br>de mais uma ferramenta.<br><em class="lj">Precisa de um sistema.</em></h2>
      <p style="color:var(--texto-soft); max-width:540px; margin:18px auto 36px;">
        Comece hoje. O sistema vai estar rodando antes do final da semana.
      </p>

      <a href="${CHECKOUT_URL}" class="btn btn-large">Entrar no Claude for Business — R$62</a>
      <p class="cta-note">Acesso imediato · Garantia incondicional · Sem precisar programar</p>

    </div>
  </section>


  <!-- ASSINATURA -->
  <footer class="assinatura">
    <strong>RedPro AI Academy</strong> · @redpro.ia
  </footer>

</div>
`;

export default function ClaudeForBusinessPage() {
  const pixelViewContent = `
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', {
        content_name: 'Claude for Business',
        content_ids: ['V105607171C'],
        content_type: 'product',
        value: 47.00,
        currency: 'BRL'
      });
    }
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: pixelViewContent }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
