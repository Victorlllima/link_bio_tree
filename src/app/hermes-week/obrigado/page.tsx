import type { Metadata } from "next";

/* ============================================================================
 *  /hermes-week/obrigado  ·  página pós-compra da Hermes Week
 * ----------------------------------------------------------------------------
 *  Adaptada da /lpsg-obrigado (CRM Week, ago/2026). O que mudou e por quê:
 *
 *  1. O grupo aqui é ENTRADA, não confirmação. Na CRM Week o comprador já
 *     estava no grupo desde o IAA, então a página só lembrava. Na Hermes Week
 *     ele compra direto pelo tráfego e nunca esteve em grupo nenhum — se ele
 *     não clicar aqui, não entra, e o grupo é a entrega principal. Por isso o
 *     bloco 1 é o único com botão e vem antes de qualquer outra coisa.
 *
 *  2. Sem data fixa. A Hermes Week é LPSG semanal: uma data cravada
 *     envelheceria a página em sete dias e ela é usada em todo ciclo.
 *
 *  3. Bloco 3 pede o pré-requisito real (conta de IA já ativa), em vez de
 *     apontar para um checklist que ainda não existe.
 * ==========================================================================*/

// Link do grupo do ciclo atual — recriado a cada semana.
// ⚠️ TROCAR A CADA CICLO. Enquanto o grupo da Hermes Week não existir, aponta
// para o do ciclo anterior seria pior que não apontar: o comprador cairia num
// grupo de outro produto. Por isso o fallback é o suporte.
const GRUPO_URL = "https://chat.whatsapp.com/F3fKDtOH98MBbgkSroDt2G";
const SUPORTE = "suporte@redpro.com.br";

export const metadata: Metadata = {
  title: "Tá dentro — Hermes Week",
  robots: { index: false, follow: false },
  description: "Sua vaga na Hermes Week está garantida. Veja o que fazer antes da primeira aula.",
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .ob-root, .ob-root *, .ob-root *::before, .ob-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ob-root {
    --ambar: #E8A33D;
    --ambar-glow: rgba(232,163,61,.16);
    --preto: #0A0A0C;
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
    background: radial-gradient(ellipse at top, var(--ambar-glow), transparent 65%);
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
  .ob-root h1 em { font-style: normal; color: var(--ambar); }
  .ob-root .lead { color: var(--texto-soft); font-size: 17px; margin-bottom: 36px; }

  .ob-root .bloco {
    background: var(--card); border: 1px solid var(--linha); border-radius: 14px;
    padding: 26px; margin-bottom: 16px; text-align: left;
  }
  /* O bloco 1 é o único que exige AÇÃO — sem entrar no grupo o comprador
     não recebe os links das aulas. A borda âmbar existe pra ele não passar
     batido no meio dos outros dois. */
  .ob-root .bloco.acao { border-color: rgba(232,163,61,.42); }
  .ob-root .bloco .tit {
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 18px;
    color: var(--branco); margin-bottom: 8px; display: flex; align-items: center; gap: 10px;
  }
  .ob-root .bloco .tit .num {
    width: 26px; height: 26px; min-width: 26px; border-radius: 7px; background: var(--ambar);
    color: var(--preto); font-size: 14px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900;
  }
  .ob-root .bloco p { color: var(--texto-soft); font-size: 14.5px; }
  .ob-root .bloco p + p { margin-top: 10px; }
  .ob-root .bloco strong { color: var(--branco); }
  .ob-root .bloco a.txt { color: var(--ambar); }

  .ob-root .btn {
    display: inline-block; background: var(--ambar); color: var(--preto);
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 16px;
    padding: 15px 34px; border-radius: 10px; text-decoration: none; margin-top: 14px;
    transition: transform .15s;
  }
  .ob-root .btn:hover { transform: translateY(-2px); }

  .ob-root .aviso {
    border: 1px dashed rgba(232,163,61,.5); border-radius: 8px; padding: 14px;
    color: var(--texto-soft); font-size: 13.5px; margin-top: 12px;
  }
  .ob-root .rodape {
    color: var(--texto-mid); font-size: 12.5px; margin-top: 28px; line-height: 1.7;
  }
</style>

<div class="ob-root">
  <div class="card">
    <div class="check">✓</div>
    <h1>Tá dentro. Agora <em>o primeiro passo.</em></h1>
    <p class="lead">Sua vaga na Hermes Week está garantida. Antes da primeira aula, três coisas.</p>

    <div class="bloco acao">
      <div class="tit"><span class="num">1</span> Entra no grupo agora</div>
      <p>É pelo grupo que eu mando o link de cada aula, respondo dúvida durante a semana e aviso quando a sessão de sábado começa. <strong>Quem não entra no grupo não recebe os links.</strong></p>
      ${
        GRUPO_URL
          ? `<a href="${GRUPO_URL}" class="btn">Entrar no grupo do WhatsApp</a>`
          : `<div class="aviso">O grupo deste ciclo abre pouco antes da primeira aula, e o link chega no seu e-mail. Se não tiver chegado até domingo, me escreve em <a class="txt" href="mailto:${SUPORTE}">${SUPORTE}</a> que eu te coloco na mão.</div>`
      }
    </div>

    <div class="bloco">
      <div class="tit"><span class="num">2</span> Segunda, 20h. Todo dia até sexta</div>
      <p>Cinco encontros, um por dia, das 20h às 20h50. No sábado às 10h tem uma sessão ao vivo só de dúvidas, pra destravar quem travou.</p>
      <p><strong>Deixa o computador do lado.</strong> Desde a primeira aula você constrói junto comigo, então acompanhar pelo celular não funciona.</p>
    </div>

    <div class="bloco">
      <div class="tit"><span class="num">3</span> Prepara uma conta de IA antes</div>
      <p>Seu agente precisa de um modelo por trás pra pensar. Se você já paga ChatGPT, Claude ou Gemini, está resolvido e a gente usa a sua assinatura, sem custo novo.</p>
      <p>Se não paga nenhum, também dá: na primeira aula eu mostro o caminho gratuito e como sair do zero de API por mês.</p>
    </div>

    <p class="rodape">
      Comprou por engano ou mudou de ideia? Você tem <strong>7 dias</strong> pra pedir de volta,
      sem precisar explicar nada. É só escrever pra <a class="txt" href="mailto:${SUPORTE}">${SUPORTE}</a>.
    </p>
  </div>
</div>
`;

export default function HermesWeekObrigadoPage() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
