import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Você está na lista — Formação S.H.A.R.K.",
  description: "Lista de espera confirmada. Carrinho abre em 23 de julho.",
  robots: { index: false, follow: false },
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .sk-ok-root, .sk-ok-root *, .sk-ok-root *::before, .sk-ok-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .sk-ok-root {
    --bg: #080808;
    --surface: #111111;
    --border: rgba(255,255,255,0.06);
    --border-active: rgba(232,213,183,0.3);
    --text-primary: #f5f5f5;
    --text-secondary: #a3a3a3;
    --accent: #e8d5b7;
    --accent-dim: rgba(232,213,183,0.08);
    --accent-glow: rgba(232,213,183,0.10);
    --success: #4ade80;
    --linha: rgba(255,255,255,0.06);

    background: var(--bg);
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    position: relative;
    overflow: hidden;
  }

  .sk-ok-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, var(--accent-glow) 0%, transparent 60%);
    pointer-events: none;
  }

  .sk-ok-card {
    position: relative;
    z-index: 1;
    max-width: 520px;
    width: 100%;
    text-align: center;
  }

  .sk-ok-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.25);
    border-radius: 50%;
    margin-bottom: 32px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    color: #4ade80;
  }

  .sk-ok-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    opacity: 0.7;
    margin-bottom: 20px;
    display: block;
  }

  .sk-ok-h1 {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(42px, 7vw, 68px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.0;
    margin-bottom: 20px;
    color: var(--text-primary);
  }

  .sk-ok-h1 .accent { color: var(--accent); }

  .sk-ok-texto {
    color: var(--text-secondary);
    font-size: 17px;
    font-weight: 300;
    line-height: 1.65;
    margin-bottom: 40px;
    max-width: 440px;
    margin-left: auto;
    margin-right: auto;
  }

  .sk-ok-separator {
    height: 1px;
    background: var(--linha);
    margin: 40px 0;
  }

  .sk-ok-wpp-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--text-secondary);
    letter-spacing: 0.08em;
    opacity: 0.6;
    margin-bottom: 16px;
  }

  .sk-ok-wpp-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(37,211,102,0.08);
    border: 1px solid rgba(37,211,102,0.25);
    color: #4ade80;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    padding: 14px 28px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .sk-ok-wpp-btn:hover {
    background: rgba(37,211,102,0.14);
    border-color: rgba(37,211,102,0.45);
    transform: translateY(-1px);
  }

  .sk-ok-wpp-icon {
    font-size: 18px;
    line-height: 1;
  }

  .sk-ok-voltar {
    display: inline-block;
    margin-top: 36px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--text-secondary);
    text-decoration: none;
    opacity: 0.5;
    letter-spacing: 0.06em;
    transition: opacity 0.2s;
  }

  .sk-ok-voltar:hover { opacity: 1; }
</style>

<div class="sk-ok-root">
  <div class="sk-ok-card">

    <div class="sk-ok-check">✓</div>

    <span class="sk-ok-label">Lista de espera · Confirmado</span>

    <h1 class="sk-ok-h1">
      Você está<br /><span class="accent">na lista.</span>
    </h1>

    <p class="sk-ok-texto">
      Carrinho abre em 23 de julho. Você vai receber um e-mail com as instruções de acesso — e condição especial para quem está na lista agora.
    </p>

    <div class="sk-ok-separator"></div>

    <p class="sk-ok-wpp-label">Quer receber no WhatsApp também?</p>
    <a
      href="https://wa.me/556191089602?text=Quero+entrar+na+lista+da+Formacao+SHARK"
      target="_blank"
      rel="noopener noreferrer"
      class="sk-ok-wpp-btn"
    >
      <span class="sk-ok-wpp-icon">💬</span>
      Entrar pelo WhatsApp
    </a>

    <br />
    <a href="https://redpro.com.br" class="sk-ok-voltar">← voltar para redpro.com.br</a>

  </div>
</div>
`;

export default function SharkObrigadoPage() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
