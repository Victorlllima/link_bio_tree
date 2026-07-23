import type { Metadata } from "next";

// Página de obrigado EXCLUSIVA da LP do Desafio (/desafio-crm) — separada da /lpsg-obrigado.
// FUNÇÃO ÚNICA: pedir a FICHA. O grupo do WhatsApp é entregue pelo WhatsApp (msg 2), não aqui —
// a pessoa vem do anúncio, já está no celular, e entrar no grupo é 1 clique lá.
const FICHA_URL = "https://www.redpro.com.br/crm-week-matricula";

export const metadata: Metadata = {
  title: "Vaga garantida — Desafio CRM em 5 Dias",
  robots: { index: false, follow: false },
  description: "Sua vaga no desafio está garantida. Entre no grupo pra receber tudo.",
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .ob-root, .ob-root *, .ob-root *::before, .ob-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ob-root {
    --laranja: #F97316; --glow: rgba(249,115,22,.18); --preto: #080808;
    --card: #141414; --linha: #1F1F1F; --mid: #8A8A8A; --soft: #B8B8B8;
    --branco: #F5F5F5; --verde: #4ADE80;
    min-height: 100vh; background: var(--preto); color: var(--branco);
    font-family: 'Bricolage Grotesque', system-ui, sans-serif; line-height: 1.6;
    display: flex; align-items: center; justify-content: center; padding: 48px 22px;
    -webkit-font-smoothing: antialiased;
  }
  .ob-root .card { max-width: 600px; width: 100%; text-align: center; background: radial-gradient(ellipse at top, var(--glow), transparent 65%); }
  .ob-root .check { width: 72px; height: 72px; margin: 0 auto 24px; border-radius: 50%; background: rgba(74,222,128,.12); border: 2px solid var(--verde); display: flex; align-items: center; justify-content: center; font-size: 36px; color: var(--verde); }
  .ob-root h1 { font-weight: 900; font-size: clamp(30px, 5vw, 44px); line-height: 1.05; letter-spacing: -.03em; margin-bottom: 14px; }
  .ob-root h1 em { font-style: normal; color: var(--laranja); }
  .ob-root .lead { color: var(--soft); font-size: 17px; margin-bottom: 34px; }
  .ob-root .bloco { background: var(--card); border: 1px solid var(--linha); border-radius: 14px; padding: 26px; margin-bottom: 16px; text-align: left; }
  .ob-root .bloco .tit { font-weight: 800; font-size: 18px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
  .ob-root .bloco .tit .num { width: 26px; height: 26px; min-width: 26px; border-radius: 7px; background: var(--laranja); color: var(--preto); font-size: 14px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; }
  .ob-root .bloco p { color: var(--soft); font-size: 14.5px; }
  .ob-root .bloco strong { color: var(--branco); }
  .ob-root .btn { display: inline-block; background: var(--laranja); color: var(--preto); font-weight: 800; font-size: 16px; padding: 15px 34px; border-radius: 10px; text-decoration: none; margin-top: 20px; transition: transform .15s; }
  .ob-root .btn:hover { transform: translateY(-2px); }
  .ob-root .nota { color: var(--mid); font-size: 13.5px; margin-top: 22px; font-family: 'JetBrains Mono', monospace; line-height: 1.5; }
</style>

<div class="ob-root">
  <div class="card">
    <div class="check">✓</div>
    <h1>Sua vaga <em>tá garantida.</em></h1>
    <p class="lead">Falta um passo antes do nosso Desafio.</p>

    <div class="bloco">
      <p>Preenche a <strong>ficha de matrícula</strong> — leva só 1 minutinho, e é com as suas respostas que eu preparo as aulas pensando na sua realidade.</p>
      <p style="margin-top:12px">Quanto mais honesto você for aí, mais as aulas vão parecer feitas pra você.</p>
      <a href="${FICHA_URL}" class="btn">Preencher minha ficha (1 min)</a>
    </div>

    <p class="nota">O link do grupo do WhatsApp eu já te mandei no seu WhatsApp. É por lá que as aulas acontecem.</p>
  </div>
</div>
`;

export default function DesafioObrigadoPage() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
