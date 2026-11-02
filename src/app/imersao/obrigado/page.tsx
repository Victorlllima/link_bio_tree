import type { Metadata } from "next";
import { lerImersaoConfig } from "@/lib/imersao-config";
import { EVENTO } from "@/components/imersao/lote";

/* /imersao/obrigado  ·  pós-compra da Imersão. Três passos: entrar no grupo da turma,
   fazer a pré-instalação e salvar as duas noites na agenda. Os links do grupo e da
   pré-instalação vêm da tabela imersao_config; sem eles, a página avisa que o link chega
   por e-mail em vez de mandar a pessoa para um destino errado. */

const SUPORTE = "suporte@redpro.com.br";

export const metadata: Metadata = {
  title: "Tá dentro | Imersão Arquiteto de Agentes",
  robots: { index: false, follow: false },
  description: "Seu ingresso da Imersão está garantido. Veja o que fazer antes da primeira noite.",
};

const html = (grupo: string, pre: string) => `
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
  /* Logo da marca acima do selo de confirmação (Red, 08/09/2026). A página é a
     primeira coisa que o comprador vê depois de pagar, e até agora não dizia de
     quem ela é. Tamanho subiu de 44px pra 220px a pedido do Red (08/09, 5x).
     O clamp existe porque o card tem 620px: em tela estreita uma altura fixa de
     220px comeria metade da primeira dobra e empurraria o botão do grupo, que é
     a única ação da página, pra fora do campo de visão. */
  .ob-root .marca {
    height: clamp(180px, 38vw, 220px); width: auto; display: block;
    margin: 0 auto 28px; opacity: .95;
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
  /* O bloco é alinhado à esquerda pra leitura, mas o botão é o único ponto de
     ação da página e fica centralizado, destacado do texto (Red, 08/09/2026). */
  .ob-root .acao-cta { text-align: center; }

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
    <img src="/logo-academy.png" alt="RedPro AI Academy" class="marca" width="220" height="220" />
    <div class="check">✓</div>
    <h1>Você está <em>dentro.</em></h1>
    <p class="lead">Seu ingresso da Imersão está garantido. Ao vivo, ${EVENTO.extenso}, ${EVENTO.horario} (horário de Brasília). Antes da primeira noite, três coisas.</p>

    <div class="bloco acao">
      <div class="tit"><span class="num">1</span> Entre no grupo da turma</div>
      <p>É pelo grupo que o link de cada noite e os avisos chegam até você. <strong>Quem não entra no grupo não recebe os links.</strong></p>
      ${
        grupo
          ? `<div class="acao-cta"><a href="${grupo}" class="btn">Entrar no grupo do WhatsApp</a></div>`
          : `<div class="aviso">O link do grupo chega no seu e-mail. Se não tiver chegado até o dia anterior à primeira noite, escreva para <a class="txt" href="mailto:${SUPORTE}">${SUPORTE}</a>.</div>`
      }
    </div>

    <div class="bloco acao">
      <div class="tit"><span class="num">2</span> Faça a pré-instalação</div>
      <p>Quem chega com o agente instalado aproveita a noite 1 por inteiro. <strong>Deixe o computador por perto</strong>, porque você constrói junto, ao vivo.</p>
      ${
        pre
          ? `<div class="acao-cta"><a href="${pre}" class="btn">Abrir o guia de pré-instalação</a></div>`
          : `<div class="aviso">O guia de pré-instalação chega no seu e-mail antes da primeira noite.</div>`
      }
    </div>

    <div class="bloco">
      <div class="tit"><span class="num">3</span> Salve as duas noites na agenda</div>
      <p>Baixe o arquivo e abra no seu calendário. Ele cria os dois encontros, com um lembrete uma hora antes.</p>
      <div class="acao-cta"><a href="/imersao/agenda.ics" class="btn">Salvar na agenda</a></div>
    </div>

    <p class="rodape">
      Dúvida sobre a compra ou o acesso? Escreva para <a class="txt" href="mailto:${SUPORTE}">${SUPORTE}</a>.
    </p>
  </div>
</div>
`;

export const revalidate = 60;

export default async function ImersaoObrigadoPage() {
  const cfg = await lerImersaoConfig(60);
  return <div dangerouslySetInnerHTML={{ __html: html(cfg.linkGrupo, cfg.linkPreinstalacao) }} />;
}
