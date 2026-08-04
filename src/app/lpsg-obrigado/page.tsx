import type { Metadata } from "next";

// Link do grupo de WhatsApp do ciclo atual (recriado a cada ciclo — ver tarefa grp-op-link).
const GRUPO_URL = "https://chat.whatsapp.com/F6Ft8TgXwSuK1WU00DSV3H";

export const metadata: Metadata = {
  title: "Vaga garantida — LPSG RedPro AI Academy",
  robots: { index: false, follow: false }, // página pós-compra, não indexar
  description: "Sua vaga no evento está garantida. Veja o que fazer antes da Aula 1.",
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .ob-root, .ob-root *, .ob-root *::before, .ob-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ob-root {
    --laranja: #F97316;
    --laranja-glow: rgba(249,115,22,.18);
    --preto: #080808;
    --card: #141414;
    --linha: #1F1F1F;
    --texto-mid: #8A8A8A;
    --texto-soft: #B8B8B8;
    --branco: #F5F5F5;
    --verde: #4ADE80;
    min-height: 100vh;
    background: var(--preto);
    color: var(--branco);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    line-height: 1.6;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 24px;
    -webkit-font-smoothing: antialiased;
  }
  .ob-root .card {
    max-width: 620px; width: 100%; text-align: center;
    background: radial-gradient(ellipse at top, var(--laranja-glow), transparent 65%);
  }
  .ob-root .check {
    width: 72px; height: 72px; margin: 0 auto 24px; border-radius: 50%;
    background: rgba(74,222,128,.12); border: 2px solid var(--verde);
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; color: var(--verde);
  }
  .ob-root h1 {
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 900;
    font-size: clamp(30px, 5vw, 46px); line-height: 1.05; letter-spacing: -.03em; margin-bottom: 14px;
  }
  .ob-root h1 em { font-style: normal; color: var(--laranja); }
  .ob-root .lead { color: var(--texto-soft); font-size: 17px; margin-bottom: 36px; }

  .ob-root .bloco {
    background: var(--card); border: 1px solid var(--linha); border-radius: 14px;
    padding: 26px; margin-bottom: 16px; text-align: left;
  }
  .ob-root .bloco .tit {
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 18px;
    color: var(--branco); margin-bottom: 8px; display: flex; align-items: center; gap: 10px;
  }
  .ob-root .bloco .tit .num {
    width: 26px; height: 26px; min-width: 26px; border-radius: 7px; background: var(--laranja);
    color: var(--preto); font-size: 14px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900;
  }
  .ob-root .bloco p { color: var(--texto-soft); font-size: 14.5px; }
  .ob-root .bloco strong { color: var(--branco); }

  .ob-root .btn {
    display: inline-block; background: var(--laranja); color: var(--preto);
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 16px;
    padding: 15px 34px; border-radius: 10px; text-decoration: none; margin-top: 14px;
    transition: transform .15s;
  }
  .ob-root .btn:hover { transform: translateY(-2px); }

  .ob-root .ph {
    border: 1px dashed var(--laranja); border-radius: 8px; padding: 12px;
    color: var(--texto-mid); font-size: 12px; margin-top: 10px;
  }
</style>

<div class="ob-root">
  <div class="card">
    <div class="check">✓</div>
    <h1>Pronto, sua vaga <em>tá garantida.</em></h1>
    <p class="lead">Você está dentro do evento "Como Construir um CRM Customizado em 5 Dias". Agora, três coisas antes de segunda.</p>

    <div class="bloco">
      <div class="tit"><span class="num">1</span> Você já está no grupo</div>
      <p>Você entrou no grupo do WhatsApp desde que terminou o IAA — é lá que tudo acontece (avisos das aulas, tira-dúvidas, links). Se por acaso ainda não entrou, entra agora:</p>
      <a href="${GRUPO_URL}" class="btn">Entrar no grupo do evento</a>
    </div>

    <div class="bloco">
      <div class="tit"><span class="num">2</span> A Aula 1 é segunda, 3/ago, 7h</div>
      <p>Tema: <strong>O sistema que empresa paga caro, construído em 5 minutos na sua frente.</strong> Deixa o computador do lado — desde o primeiro dia é mão na massa, você constrói junto.</p>
    </div>

    <div class="bloco">
      <div class="tit"><span class="num">3</span> Deixe o ambiente pronto antes</div>
      <p>São 15 minutos de preparação pra você não perder tempo na Aula 1.</p>
      <div class="ph">[MICRO-INSTRUÇÃO: entra aqui o checklist PDF "ambiente pronto em 15min" quando estiver pronto — pendência de produção da v3 das aulas]</div>
    </div>

  </div>
</div>
`;

export default function LpsgObrigadoPage() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
