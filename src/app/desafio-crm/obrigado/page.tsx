import type { Metadata } from "next";

// ⚠️ SEMANAL: trocar este link do grupo a cada novo ciclo do Desafio (tarefa pag-obrigado-desafio).
// Página de obrigado EXCLUSIVA da LP do Desafio (/desafio-crm) — separada da /lpsg-obrigado.
const GRUPO_URL = "https://chat.whatsapp.com/IsvZFOVIYKmDss3tSRwrKx";

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
  .ob-root .btn { display: inline-block; background: var(--laranja); color: var(--preto); font-weight: 800; font-size: 16px; padding: 15px 34px; border-radius: 10px; text-decoration: none; margin-top: 14px; transition: transform .15s; }
  .ob-root .btn:hover { transform: translateY(-2px); }
</style>

<div class="ob-root">
  <div class="card">
    <div class="check">✓</div>
    <h1>Pronto, sua vaga <em>tá garantida.</em></h1>
    <p class="lead">Você está dentro do Desafio "Construindo um CRM em 5 Dias". Agora, o passo mais importante:</p>

    <div class="bloco">
      <div class="tit"><span class="num">1</span> Entre no grupo agora</div>
      <p>É pelo grupo do WhatsApp que você recebe <strong>todos os links das aulas, os avisos e o material</strong>. Sem entrar no grupo, você fica de fora. Entra agora, antes de fechar essa página:</p>
      <a href="${GRUPO_URL}" class="btn">Entrar no grupo do desafio</a>
    </div>

    <div class="bloco">
      <div class="tit"><span class="num">2</span> As aulas são de manhã, 7h</div>
      <p>De <strong>27 a 31 de julho</strong>, segunda a sexta, sempre às 7h. Deixe o computador do lado, porque <strong>desde o primeiro dia é mão na massa</strong>. Você constrói junto.</p>
    </div>

    <div class="bloco">
      <div class="tit"><span class="num">3</span> Responda as mensagens</div>
      <p>Quando eu te mandar algo no WhatsApp, responde (nem que seja "ok"). É o que mantém a entrega dos links funcionando pra você. Detalhe pequeno, faz diferença.</p>
    </div>
  </div>
</div>
`;

export default function DesafioObrigadoPage() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
