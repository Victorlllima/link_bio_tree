import type { Metadata } from "next";

// TODO: substituir [CHECKOUT_CODE] pelo código real após Red confirmar
const CHECKOUT_URL = "https://pay.hotmart.com/[CHECKOUT_CODE]?checkoutMode=10";

export const metadata: Metadata = {
  title: "Introdução à Automação — RedPro AI Academy",
  description:
    "12 aulas. Você vai construir uma automação real do zero, sem saber programar. Webhook, JSON, API, HTTP Request — os tijolos de qualquer automação que existe.",
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/introducao-a-automacao",
    title: "Introdução à Automação — RedPro AI Academy",
    description:
      "12 aulas. Você vai construir uma automação real do zero, sem saber programar. Webhook, JSON, API, HTTP Request — os tijolos de qualquer automação que existe.",
    images: [
      {
        url: "/introducao-a-automacao/og.png",
        width: 1200,
        height: 630,
        alt: "Introdução à Automação — RedPro AI Academy",
      },
    ],
    locale: "pt_BR",
  },
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .ia-root, .ia-root *, .ia-root *::before, .ia-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ia-root {
    --laranja: #f97316;
    --laranja-dim: #c2500e;
    --laranja-glow: rgba(249,115,22,.18);
    --preto: #080808;
    --grafite: #111111;
    --aco: #1c2530;
    --linha: #1f1f1f;
    --texto-mid: #8a8a8a;
    --texto-soft: #b8b8b8;
    --branco: #f5f5f5;

    background: var(--preto);
    color: var(--branco);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .ia-root h1, .ia-root h2, .ia-root h3, .ia-root .display {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 900;
    letter-spacing: -.02em;
    line-height: 1.0;
  }

  .ia-root h2 { font-size: clamp(30px, 5vw, 52px); margin-bottom: 12px; }
  .ia-root h3 { font-size: clamp(20px, 2.4vw, 26px); font-weight: 800; line-height: 1.15; }

  .ia-root em.lj {
    font-style: normal;
    color: var(--laranja);
  }

  .ia-root .section-label {
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

  .ia-root .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .ia-root .narrow { max-width: 760px; margin: 0 auto; }

  .ia-root section { padding: 80px 0; position: relative; }

  /* ─── HERO ─── */
  .ia-root .hero {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 24px 60px;
    position: relative;
    overflow: hidden;
  }

  .ia-root .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% -10%, var(--laranja-glow) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 20% 90%, rgba(249,115,22,.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .ia-root .hero-inner {
    max-width: 1180px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .ia-root .hero-text { text-align: left; }

  .ia-root .hero-foto {
    max-width: 480px;
    width: 100%;
    justify-self: end;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    object-position: center top;
    display: block;
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 85%);
            mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 85%);
  }

  @media (max-width: 760px) {
    .ia-root .hero-inner {
      grid-template-columns: 1fr;
      gap: 48px;
      max-width: 820px;
    }
    .ia-root .hero-foto {
      max-width: 320px;
      justify-self: start;
      order: 2;
    }
    .ia-root .hero-text { order: 1; }
  }

  .ia-root .badge {
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

  .ia-root .badge .dot-pulse {
    width: 6px; height: 6px;
    background: var(--laranja);
    border-radius: 50%;
    animation: ia-pulse 2s ease-in-out infinite;
  }

  @keyframes ia-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .3; }
  }

  .ia-root h1 {
    font-size: clamp(38px, 5.5vw, 68px);
    font-weight: 900;
    margin-bottom: 28px;
  }

  .ia-root h1 .thin {
    display: block;
    font-weight: 200;
    font-size: .55em;
    color: var(--texto-soft);
    margin-top: 10px;
    letter-spacing: -.01em;
  }

  .ia-root .subheadline {
    font-size: clamp(16px, 1.8vw, 19px);
    font-weight: 400;
    color: var(--texto-soft);
    max-width: 580px;
    margin: 0 0 42px;
    line-height: 1.55;
  }

  .ia-root .proof-strip {
    display: flex;
    justify-content: flex-start;
    gap: 28px;
    flex-wrap: wrap;
    margin-bottom: 42px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--texto-mid);
  }

  .ia-root .proof-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ia-root .proof-item .ic {
    width: 5px; height: 5px;
    background: var(--laranja);
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ─── BOTÕES ─── */
  .ia-root .btn {
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

  .ia-root .btn:hover {
    background: transparent;
    color: var(--laranja);
    transform: translateY(-2px);
  }

  .ia-root .btn-large { font-size: 20px; padding: 22px 56px; }

  .ia-root .cta-note {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--texto-mid);
    margin-top: 18px;
    letter-spacing: .02em;
  }

  /* ─── PROBLEMA ─── */
  .ia-root .problema {
    background: linear-gradient(180deg, var(--preto) 0%, #060606 100%);
    border-top: 1px solid var(--linha);
  }

  .ia-root .problema-texto {
    margin-top: 40px;
    color: var(--texto-soft);
    font-size: clamp(17px, 2vw, 22px);
    line-height: 1.8;
    max-width: 700px;
  }

  .ia-root .problema-texto p + p { margin-top: 24px; }

  .ia-root .problema-texto .destaque {
    color: var(--branco);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    letter-spacing: -.01em;
  }

  /* ─── MECANISMO ─── */
  .ia-root .mecanismo {
    background: #050505;
    border-top: 1px solid var(--linha);
  }

  .ia-root .conceitos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--linha);
    border: 1px solid var(--linha);
    margin-top: 56px;
  }

  .ia-root .conceito {
    background: var(--preto);
    padding: 32px 28px;
    transition: background .25s ease;
  }

  .ia-root .conceito:hover { background: #0e0e0e; }

  .ia-root .conceito-nome {
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    color: var(--laranja);
    margin-bottom: 10px;
    letter-spacing: .05em;
  }

  .ia-root .conceito-desc {
    color: var(--texto-soft);
    font-size: 14px;
    line-height: 1.6;
  }

  .ia-root .mecanismo-nota {
    margin-top: 48px;
    padding: 28px 32px;
    background: rgba(249,115,22,.04);
    border: 1px solid rgba(249,115,22,.15);
    border-radius: 8px;
    color: var(--texto-soft);
    font-size: 15px;
    line-height: 1.7;
    max-width: 760px;
  }

  .ia-root .mecanismo-nota strong { color: var(--branco); }

  /* ─── O QUE VAI CONSTRUIR ─── */
  .ia-root .construir {
    background: var(--preto);
    border-top: 1px solid var(--linha);
  }

  .ia-root .fluxo-lista {
    margin-top: 48px;
    border-top: 1px solid var(--linha);
    max-width: 680px;
  }

  .ia-root .fluxo-item {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 20px;
    padding: 22px 0;
    border-bottom: 1px solid var(--linha);
    align-items: start;
    transition: padding-left .2s ease;
  }

  .ia-root .fluxo-item:hover { padding-left: 10px; }

  .ia-root .fluxo-seta {
    color: var(--laranja);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 900;
    line-height: 1.4;
  }

  .ia-root .fluxo-texto {
    font-size: 17px;
    color: var(--branco);
    line-height: 1.5;
  }

  .ia-root .construir-conclusao {
    margin-top: 36px;
    padding: 28px 32px;
    background: rgba(249,115,22,.06);
    border-left: 3px solid var(--laranja);
    color: var(--branco);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 700;
    font-size: 20px;
    letter-spacing: -.01em;
    line-height: 1.4;
    max-width: 680px;
  }

  /* ─── INCLUSO ─── */
  .ia-root .incluso {
    background: #050505;
    border-top: 1px solid var(--linha);
  }

  .ia-root .incluso-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 48px;
  }

  .ia-root .incluso-item {
    background: #0a0a0a;
    border: 1px solid var(--linha);
    border-radius: 10px;
    padding: 28px 26px;
    display: flex;
    gap: 18px;
    align-items: flex-start;
    transition: border-color .25s ease;
  }

  .ia-root .incluso-item:hover { border-color: rgba(249,115,22,.35); }

  .ia-root .incluso-check {
    color: var(--laranja);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 18px;
    line-height: 1.4;
    flex-shrink: 0;
  }

  .ia-root .incluso-nome {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: 17px;
    margin-bottom: 6px;
  }

  .ia-root .incluso-desc {
    color: var(--texto-mid);
    font-size: 13px;
    line-height: 1.5;
  }

  /* ─── SOBRE ─── */
  .ia-root .sobre {
    background: linear-gradient(180deg, var(--preto) 0%, rgba(28,37,48,0.08) 100%);
    border-top: 1px solid var(--linha);
  }

  .ia-root .sobre-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 96px;
    align-items: center;
  }

  .ia-root .sobre-foto {
    max-width: 440px;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center top;
    display: block;
    border-radius: 12px;
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 85%);
            mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 85%);
  }

  .ia-root .sobre-bio p {
    color: var(--texto-soft);
    margin-top: 18px;
    line-height: 1.7;
  }

  .ia-root .sobre-bullets {
    list-style: none;
    margin-top: 28px;
    padding: 0;
    display: grid;
    gap: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--texto-soft);
  }

  .ia-root .sobre-bullets li {
    display: grid;
    grid-template-columns: 14px 1fr;
    gap: 12px;
    align-items: start;
    padding-top: 12px;
    border-top: 1px solid var(--linha);
  }

  .ia-root .sobre-bullets li::before {
    content: "//";
    color: var(--laranja);
    font-weight: 700;
  }

  @media (max-width: 820px) {
    .ia-root .sobre-grid {
      grid-template-columns: 1fr;
      gap: 56px;
    }
    .ia-root .sobre-foto { max-width: 280px; }
  }

  /* ─── PREÇO ─── */
  .ia-root .preco {
    background: linear-gradient(180deg, #050505 0%, var(--preto) 100%);
    border-top: 1px solid var(--linha);
    text-align: center;
  }

  .ia-root .preco-card {
    max-width: 580px;
    margin: 56px auto 0;
    background: var(--preto);
    border: 1px solid rgba(249,115,22,.3);
    border-radius: 16px;
    padding: 48px 36px;
    position: relative;
  }

  .ia-root .preco-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: radial-gradient(ellipse at 50% 0%, var(--laranja-glow) 0%, transparent 60%);
    pointer-events: none;
  }

  .ia-root .preco-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--laranja);
    letter-spacing: .15em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .ia-root .preco-valor {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 88px;
    font-weight: 900;
    color: var(--branco);
    line-height: 1;
    margin: 14px 0 6px;
    letter-spacing: -.04em;
  }

  .ia-root .preco-valor .moeda {
    font-size: 36px;
    font-weight: 200;
    color: var(--laranja);
    vertical-align: 30px;
    margin-right: 4px;
  }

  .ia-root .preco-descricao {
    font-size: 14px;
    color: var(--texto-mid);
    margin-bottom: 32px;
  }

  .ia-root .garantia {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--texto-mid);
    margin-top: 22px;
    letter-spacing: .02em;
  }

  .ia-root .garantia strong { color: var(--branco); font-weight: 500; }

  /* ─── FAQ ─── */
  .ia-root .faq { background: #050505; border-top: 1px solid var(--linha); }

  .ia-root .faq-list { margin-top: 48px; }

  .ia-root details {
    border-bottom: 1px solid var(--linha);
    padding: 22px 0;
  }

  .ia-root details:first-child { border-top: 1px solid var(--linha); }

  .ia-root summary {
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

  .ia-root summary::-webkit-details-marker { display: none; }

  .ia-root summary::after {
    content: '+';
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 28px;
    font-weight: 200;
    color: var(--laranja);
    flex-shrink: 0;
    transition: transform .2s ease;
  }

  .ia-root details[open] summary::after { content: '−'; }

  .ia-root .faq-body {
    margin-top: 14px;
    color: var(--texto-soft);
    font-size: 15px;
    line-height: 1.7;
  }

  /* ─── CTA FINAL ─── */
  .ia-root .cta-final {
    background: linear-gradient(180deg, var(--preto) 0%, #050505 100%);
    border-top: 1px solid var(--linha);
    text-align: center;
  }

  .ia-root .cta-final h2 { max-width: 720px; margin: 0 auto 18px; }

  /* ─── ASSINATURA ─── */
  .ia-root .assinatura {
    padding: 32px 24px;
    text-align: center;
    border-top: 1px solid var(--linha);
    color: var(--texto-mid);
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }

  .ia-root .assinatura strong { color: var(--branco); }

  /* ─── RESPONSIVO ─── */
  @media (max-width: 820px) {
    .ia-root section { padding: 64px 0; }
    .ia-root .conceitos-grid { grid-template-columns: 1fr; }
    .ia-root .incluso-grid { grid-template-columns: 1fr; }
    .ia-root .preco-valor { font-size: 64px; }
    .ia-root .preco-valor .moeda { font-size: 28px; vertical-align: 22px; }
    .ia-root .btn-large { font-size: 17px; padding: 18px 36px; }
  }
</style>

<div class="ia-root">

  <!-- HERO -->
  <section class="hero">
    <div class="hero-inner">

      <div class="hero-text">
        <div class="badge">
          <span class="dot-pulse"></span>
          Introdução à Automação · RedPro AI Academy
        </div>

        <h1>
          Você vai construir<br><em class="lj">uma automação real.</em>
          <span class="thin">Do zero. Sem saber programar.</span>
        </h1>

        <p class="subheadline">
          12 aulas. Uma ideia vira um sistema funcionando. Você vê o dado entrar, ser transformado e sair pelo outro lado — pela primeira vez na vida.
        </p>

        <div class="proof-strip">
          <div class="proof-item"><span class="ic"></span>12 aulas diretas ao ponto</div>
          <div class="proof-item"><span class="ic"></span>n8n Cloud gratuito — sem instalar nada</div>
          <div class="proof-item"><span class="ic"></span>Acesso imediato e permanente</div>
        </div>

        <a href="${CHECKOUT_URL}" class="btn btn-large ia-cta" data-cta="hero">Quero construir agora — R$97</a>
        <p class="cta-note">Acesso imediato após o pagamento · 7 dias de garantia</p>
      </div>

      <img
        class="hero-foto"
        src="/introducao-a-automacao/hero.png"
        alt="Red, fundador da RedPro AI Academy, apresentando o curso Introdução à Automação"
      />

    </div>
  </section>


  <!-- PROBLEMA -->
  <section class="problema">
    <div class="container narrow">

      <span class="section-label">O problema</span>
      <h2>Você nunca viu o dado<br><em class="lj">atravessar um sistema.</em></h2>

      <div class="problema-texto">
        <p>Você já tentou entender como uma automação funciona de verdade.</p>
        <p>Não a teoria. Não o tutorial que para na metade. <span class="destaque">A coisa funcionando</span> — dado entrado, processado, respondido.</p>
        <p>O problema não é que você não é técnico. É que você nunca viu o dado atravessar um sistema. Do gatilho até a saída. Passo a passo, em tempo real, na sua frente.</p>
        <p><span class="destaque">Depois que você vê uma vez, você nunca mais vai precisar de explicação.</span></p>
      </div>

    </div>
  </section>


  <!-- MECANISMO -->
  <section class="mecanismo">
    <div class="container">

      <div class="narrow">
        <span class="section-label">O mecanismo</span>
        <h2>Esse curso não te ensina<br>uma ferramenta. <em class="lj">Te ensina a enxergar.</em></h2>
      </div>

      <div class="conceitos-grid">

        <div class="conceito">
          <div class="conceito-nome">Webhook</div>
          <p class="conceito-desc">O gatilho. É por onde o dado entra no sistema. Você vai ver o exato momento em que uma mensagem aciona uma automação.</p>
        </div>

        <div class="conceito">
          <div class="conceito-nome">JSON</div>
          <p class="conceito-desc">A língua das APIs. Depois que você entende o formato, qualquer sistema faz sentido — não importa a ferramenta.</p>
        </div>

        <div class="conceito">
          <div class="conceito-nome">API</div>
          <p class="conceito-desc">O canal de comunicação entre sistemas. Você vai usar APIs reais, de dados reais, no curso. Sem simulações.</p>
        </div>

        <div class="conceito">
          <div class="conceito-nome">HTTP Request</div>
          <p class="conceito-desc">O nó que chama o mundo externo. GET, POST, headers, body — você vai entender cada parte antes de usar.</p>
        </div>

        <div class="conceito">
          <div class="conceito-nome">Switch</div>
          <p class="conceito-desc">A lógica de decisão. O sistema age diferente dependendo do que chega. É aqui que a automação fica inteligente.</p>
        </div>

        <div class="conceito">
          <div class="conceito-nome">Expressão dinâmica</div>
          <p class="conceito-desc">Montar respostas com os dados recebidos — não texto fixo. É o que transforma automação genérica em resposta personalizada.</p>
        </div>

      </div>

      <div class="mecanismo-nota">
        São os tijolos de <strong>qualquer automação que existe</strong> — no n8n, no Claude Code, no Make, em qualquer coisa que você tocar depois. Cada conceito aparece porque o projeto precisa dele. Sem teoria solta.<br><br>
        A ferramenta é no-code, visual, gratuita. <strong>O raciocínio que você vai adquirir aqui não tem ferramenta.</strong>
      </div>

    </div>
  </section>


  <!-- O QUE VAI CONSTRUIR -->
  <section class="construir">
    <div class="container narrow">

      <span class="section-label">O projeto</span>
      <h2>No final, você terá construído<br><em class="lj">um sistema completo.</em></h2>

      <div class="fluxo-lista">

        <div class="fluxo-item">
          <div class="fluxo-seta">→</div>
          <div class="fluxo-texto">Recebe uma mensagem de qualquer canal</div>
        </div>

        <div class="fluxo-item">
          <div class="fluxo-seta">→</div>
          <div class="fluxo-texto">Entende o que está sendo pedido</div>
        </div>

        <div class="fluxo-item">
          <div class="fluxo-seta">→</div>
          <div class="fluxo-texto">Consulta uma fonte externa de dados em tempo real</div>
        </div>

        <div class="fluxo-item">
          <div class="fluxo-seta">→</div>
          <div class="fluxo-texto">Monta uma resposta personalizada</div>
        </div>

        <div class="fluxo-item">
          <div class="fluxo-seta">→</div>
          <div class="fluxo-texto">Entrega essa resposta de volta para quem perguntou</div>
        </div>

      </div>

      <div class="construir-conclusao">
        Automático. Sem você tocar em nada depois que estiver pronto.
      </div>

    </div>
  </section>


  <!-- O QUE ESTÁ INCLUSO -->
  <section class="incluso">
    <div class="container narrow">

      <span class="section-label">O que está incluso</span>
      <h2>Tudo que você precisa para<br><em class="lj">sair com algo funcionando.</em></h2>

      <div class="incluso-grid">

        <div class="incluso-item">
          <div class="incluso-check">01</div>
          <div>
            <div class="incluso-nome">12 aulas diretas ao ponto</div>
            <p class="incluso-desc">Sem enrolação. Cada aula avança o projeto um passo. Você vê o sistema ganhar vida aula por aula.</p>
          </div>
        </div>

        <div class="incluso-item">
          <div class="incluso-check">02</div>
          <div>
            <div class="incluso-nome">Projeto completo do zero ao funcionando</div>
            <p class="incluso-desc">Você não assiste alguém construir. Você constrói ao lado, no seu n8n, com seus dados.</p>
          </div>
        </div>

        <div class="incluso-item">
          <div class="incluso-check">03</div>
          <div>
            <div class="incluso-nome">n8n Cloud gratuito</div>
            <p class="incluso-desc">Sem instalar nada no computador. Abre o navegador e começa. O n8n tem plano gratuito suficiente para o curso.</p>
          </div>
        </div>

        <div class="incluso-item">
          <div class="incluso-check">04</div>
          <div>
            <div class="incluso-nome">Material de apoio em PDF</div>
            <p class="incluso-desc">Todos os conceitos consolidados + referência de métodos HTTP. Consulta rápida quando precisar.</p>
          </div>
        </div>

        <div class="incluso-item">
          <div class="incluso-check">05</div>
          <div>
            <div class="incluso-nome">Acesso imediato e permanente</div>
            <p class="incluso-desc">Paga uma vez, assiste quando quiser, quantas vezes quiser. Sem data de expiração.</p>
          </div>
        </div>

      </div>

    </div>
  </section>


  <!-- SOBRE -->
  <section class="sobre">
    <div class="container">

      <div class="sobre-grid">

        <img
          class="sobre-foto"
          src="/introducao-a-automacao/sobre-red.png"
          alt="Red, fundador da RedPro AI Academy e criador do Método S.H.A.R.K."
        />

        <div class="sobre-bio">
          <span class="section-label">Quem construiu</span>
          <p style="font-size:18px; color:#fff; font-weight:600; margin:8px 0 16px; letter-spacing:-0.01em;">Red · Criador da RedPro AI Academy</p>
          <h2>Criador do Método S.H.A.R.K.<br><em class="lj">Fundador da RedPro AI Academy.</em></h2>
          <p>
            Ensina empresários e profissionais a usar IA de forma prática — sem precisar programar. Mais de 27 alunos já aplicaram o método nos próprios negócios.
          </p>
          <p>
            Acredita que você não precisa de código para fazer a máquina trabalhar. Precisa entender o processo. O resto é ferramenta.
          </p>
          <ul class="sobre-bullets">
            <li>Criador do Método S.H.A.R.K. — pipeline de 5 agentes em produção</li>
            <li>Fundador da RedPro AI Academy e da RedPro AI Solutions</li>
            <li>27+ alunos aplicando IA nos próprios negócios</li>
            <li>Usa o que ensina — sistema inteiro rodando na própria operação</li>
          </ul>
        </div>

      </div>

    </div>
  </section>


  <!-- PREÇO -->
  <section class="preco" id="preco">
    <div class="container">

      <div class="narrow">
        <span class="section-label">A oferta</span>
        <h2>R$97 uma vez.<br><em class="lj">Você nunca mais vai olhar para<br>uma automação sem entender.</em></h2>
      </div>

      <div class="preco-card">
        <div class="preco-tag">Acesso imediato após pagamento</div>

        <div class="preco-valor"><span class="moeda">R$</span>97</div>
        <p class="preco-descricao">pagamento único · não é assinatura</p>

        <a href="${CHECKOUT_URL}" class="btn btn-large ia-cta" id="btn-checkout" data-cta="preco">Entrar no curso agora — R$97</a>

        <p class="garantia">
          <strong>7 dias de garantia.</strong><br>
          Se você assistir e achar que não valeu, devolvemos tudo. Sem perguntas.
        </p>
      </div>

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
          <div class="faq-body">Não. O curso foi construído especificamente pra quem não sabe. A ferramenta é no-code e visual. O que você vai aprender é o raciocínio — e esse não precisa de programação.</div>
        </details>

        <details>
          <summary>Preciso ter conta paga em alguma ferramenta?</summary>
          <div class="faq-body">Não. O n8n tem plano gratuito que é suficiente para o curso inteiro. Você abre o navegador e começa — sem instalar nada, sem pagar nada além do curso.</div>
        </details>

        <details>
          <summary>Quanto tempo por aula?</summary>
          <div class="faq-body">As aulas são curtas e diretas. O tempo de construção na ferramenta acompanha cada etapa. Quem segue o ritmo de uma ou duas aulas por dia termina o projeto completo em menos de uma semana.</div>
        </details>

        <details>
          <summary>O que eu faço depois que terminar o curso?</summary>
          <div class="faq-body">Você vai saber ler qualquer automação que existir. O n8n, o Make, o Zapier — a lógica é a mesma. Você pode aplicar imediatamente no seu negócio ou usar como base para aprender ferramentas mais avançadas.</div>
        </details>

        <details>
          <summary>E se eu não gostar?</summary>
          <div class="faq-body">7 dias de garantia. Se você assistir e achar que não valeu, é só pedir. Devolvemos tudo, sem perguntas.</div>
        </details>

        <details>
          <summary>O acesso expira?</summary>
          <div class="faq-body">Não. Você paga uma vez e o acesso é permanente. Assiste no seu ritmo, volta quando precisar revisar, sem prazo.</div>
        </details>

      </div>

    </div>
  </section>


  <!-- CTA FINAL -->
  <section class="cta-final">
    <div class="container narrow">

      <h2>R$97 uma vez.<br>Você nunca mais vai olhar para uma automação<br><em class="lj">sem entender o que está acontecendo.</em></h2>
      <p style="color:var(--texto-soft); max-width:540px; margin:18px auto 36px; font-size:16px; line-height:1.6;">
        Acesso imediato · Sem prazo pra assistir · Pagamento único
      </p>

      <a href="${CHECKOUT_URL}" class="btn btn-large ia-cta" data-cta="cta-final">Entrar no curso agora — R$97</a>
      <p class="cta-note">7 dias de garantia · Sem precisar programar · n8n Cloud gratuito</p>

    </div>
  </section>


  <!-- ASSINATURA -->
  <footer class="assinatura">
    <strong>RedPro AI Academy</strong> · @redpro.ia
  </footer>

</div>
`;

export default function IntroducaoAAutomacaoPage() {
  // Pixel: ViewContent no load + InitiateCheckout no clique do CTA
  const pixelViewContent = `
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', {
        content_name: 'Introdução à Automação',
        content_ids: ['8039631'],
        content_type: 'product',
        value: 97.00,
        currency: 'BRL'
      });
    }
  `;

  const pixelInitiateCheckout = `
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.ia-cta').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
              content_name: 'Introdução à Automação',
              content_ids: ['8039631'],
              content_type: 'product',
              value: 97.00,
              currency: 'BRL'
            });
          }
        });
      });
    });
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: pixelViewContent }} />
      <script dangerouslySetInnerHTML={{ __html: pixelInitiateCheckout }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
