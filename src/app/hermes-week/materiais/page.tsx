import type { Metadata } from "next";

/* ============================================================================
 *  /hermes-week/materiais  ·  entrega dos materiais da ficha de interesse
 * ----------------------------------------------------------------------------
 *  O Red prometeu na câmera, na Aula 4 (24/09/2026), DOIS materiais para quem
 *  preenchesse a ficha de interesse, "comprando ou não comprando nada depois".
 *  Esta é a página onde eles moram. Ele mostra os dois no domingo (Bloco 12 da
 *  Aula 6) e manda este link no grupo.
 *
 *  POR QUE UMA PÁGINA E NÃO E-MAIL:
 *  o e-mail do Resend ainda depende de segmentar quem preencheu a ficha dentro
 *  da audiência, e a promessa é de domingo. Um link único, mandado no grupo e
 *  falado na câmera, entrega hoje e não depende de nenhuma automação nova.
 *
 *  POR QUE NÃO TEM LOGIN:
 *  a ficha é o filtro social, não técnico. Quem não preencheu e chegar aqui por
 *  fora recebe os dois materiais do mesmo jeito, e isso é de propósito: montar
 *  autenticação para dois arquivos custaria mais do que o que ela protegeria, e
 *  o material é de topo de funil, feito para circular.
 *
 *  ⚠️ O SERVIDOR PRONTO NÃO ESTÁ AQUI. Ele é da janela da primeira hora de
 *  compra (6h50 às 8h de segunda) e é entregue junto do acesso ao curso. Ele é
 *  o gatilho do módulo 1 do DUAAUS: publicar aqui derrubaria a oferta.
 *
 *  ⚠️ SEM DATA NA PÁGINA. A Hermes Week roda toda semana. Data cravada
 *  envelheceria em sete dias (foi o bug de 27/07).
 * ==========================================================================*/

const SUPORTE = "suporte@redpro.com.br";
const PDF = "/hermes-week/materiais/hermes-week-o-curso-inteiro.pdf";
const ZIP = "/hermes-week/materiais/squad-pronto-para-importar.zip";
// O PDF dos 100 plugins era o bump de R$27. Saiu da lista de bumps em 25/09/2026, porque o
// Red prometeu o link dele de graça na câmera, na Aula 4. Entregar menos do que foi falado
// custaria mais do que o produto valia.
const PLUGINS = "/hermes-week/materiais/100-plugins-do-hermes.pdf";

export const metadata: Metadata = {
  title: "Os seus materiais — Hermes Week",
  robots: { index: false, follow: false },
  description: "O curso inteiro em PDF e o squad pronto para importar, para quem preencheu a ficha.",
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .mt-root, .mt-root *, .mt-root *::before, .mt-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .mt-root {
    --ambar: #E8A33D;
    --ambar-glow: rgba(232,163,61,.16);
    --preto: #0A0A0C;
    --card: #141414;
    --linha: #1F1F1F;
    --texto-mid: #8A8A8A;
    --texto-soft: #B8B8B8;
    --branco: #F5F5F5;
    min-height: 100vh;
    background: var(--preto);
    color: var(--branco);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    line-height: 1.6;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 16px;
    -webkit-font-smoothing: antialiased;
  }
  .mt-root .card {
    max-width: 660px; width: 100%;
    background: radial-gradient(ellipse at top, var(--ambar-glow), transparent 65%);
  }
  .mt-root .topo { text-align: center; margin-bottom: 38px; }
  .mt-root .marca { height: clamp(120px, 26vw, 150px); width: auto; display: block; margin: 0 auto 24px; opacity: .95; }
  .mt-root h1 {
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 900;
    font-size: clamp(28px, 5vw, 44px); line-height: 1.05; letter-spacing: -.03em; margin-bottom: 14px;
  }
  .mt-root h1 em { font-style: normal; color: var(--ambar); }
  .mt-root .lead { color: var(--texto-soft); font-size: 16.5px; max-width: 520px; margin: 0 auto; }

  /* Cada material é um cartão com o download como única ação. O que ele é vem
     antes do botão: o aluno precisa saber o que está baixando. */
  .mt-root .item {
    background: var(--card); border: 1px solid var(--linha); border-radius: 14px;
    padding: 28px; margin-bottom: 18px;
  }
  .mt-root .item .num {
    width: 30px; height: 30px; min-width: 30px; border-radius: 8px; background: var(--ambar);
    color: var(--preto); font-size: 15px; display: inline-flex; align-items: center; justify-content: center;
    font-weight: 900; font-family: 'Bricolage Grotesque', sans-serif;
  }
  .mt-root .item .tit {
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 21px;
    color: var(--branco); margin-bottom: 12px; display: flex; align-items: center; gap: 12px;
  }
  .mt-root .item p { color: var(--texto-soft); font-size: 14.5px; }
  .mt-root .item p + p { margin-top: 10px; }
  .mt-root .item strong { color: var(--branco); }
  .mt-root .meta {
    color: var(--texto-mid); font-size: 12.5px; letter-spacing: .04em; text-transform: uppercase;
    margin-top: 16px;
  }
  .mt-root .btn {
    display: inline-block; background: var(--ambar); color: var(--preto);
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 15.5px;
    padding: 14px 30px; border-radius: 10px; text-decoration: none; margin-top: 16px;
    transition: transform .15s;
  }
  .mt-root .btn:hover { transform: translateY(-2px); }
  .mt-root .btn.fantasma {
    background: transparent; color: var(--ambar); border: 1px solid rgba(232,163,61,.45);
  }

  .mt-root .nota {
    border: 1px dashed rgba(232,163,61,.5); border-radius: 10px; padding: 18px;
    color: var(--texto-soft); font-size: 14px; margin-top: 26px;
  }
  .mt-root .nota .t {
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; color: var(--branco);
    font-size: 15px; margin-bottom: 6px;
  }
  .mt-root .rodape {
    color: var(--texto-mid); font-size: 12.5px; margin-top: 30px; line-height: 1.8; text-align: center;
  }
  .mt-root .rodape a { color: var(--ambar); }
</style>

<div class="mt-root">
  <div class="card">

    <div class="topo">
      <img src="/logo-academy.png" alt="RedPro AI Academy" class="marca">
      <h1>Os seus <em>materiais</em></h1>
      <p class="lead">
        O que eu prometi para quem preencheu a ficha, mais a análise dos plugins que eu falei
        na quinta. São seus, comprando ou não comprando nada depois.
      </p>
    </div>

    <div class="item">
      <div class="tit"><span class="num">1</span> O curso inteiro em PDF</div>
      <p>
        As cinco aulas da semana escritas. Não é a transcrição do vídeo, que ninguém lê. É o
        conteúdo organizado em capítulo, com <strong>os caminhos de tela</strong> que a gente
        percorreu, <strong>os pedidos que eu mandei para o Hermes na íntegra</strong>, para você
        copiar, e o que fazer quando cada coisa dá errado.
      </p>
      <p>
        No fim tem um apêndice com todos os pedidos da semana num lugar só.
      </p>
      <p>
        Serve para quando você for refazer daqui a três semanas e não quiser caçar o minuto do
        vídeo. E serve para passar para alguém da sua equipe sem essa pessoa ter que assistir
        cinco aulas.
      </p>
      <div class="meta">PDF · 38 páginas</div>
      <a class="btn" href="${PDF}" download>Baixar o PDF</a>
    </div>

    <div class="item">
      <div class="tit"><span class="num">2</span> O squad pronto para importar</div>
      <p>
        Cinco agentes montados: um <strong>coordenador</strong>, que recebe a demanda e distribui
        sem nunca executar, um <strong>pesquisador</strong>, um <strong>redator</strong>, um
        <strong>revisor</strong> e um <strong>operador</strong>.
      </p>
      <p>
        Cada um vem com a função escrita, a descrição que aparece na tela e o modelo certo
        apontado. <strong>O operador já vem com o modelo mais barato</strong>, porque é ele que
        mais roda, e é onde a conta cresce sem você perceber.
      </p>
      <p>
        Dentro do arquivo tem o pedido pronto para você colar no Hermes e ele instalar tudo
        sozinho, o pedido que configura o quadro de tarefas, e os três erros que costumam
        aparecer na primeira vez.
      </p>
      <div class="meta">ZIP · 5 perfis + guia de instalação</div>
      <a class="btn" href="${ZIP}" download>Baixar o squad</a>
    </div>

    <div class="item">
      <div class="tit"><span class="num">3</span> Os 100 melhores plugins, analisados</div>
      <p>
        Eu falei disso na quinta e prometi o link. Está aqui.
      </p>
      <p>
        Os 100 plugins do catálogo oficial, um por um: <strong>o que cada um faz</strong>, para
        quem vale a pena, e o que ele exige para funcionar. A maioria com a imagem da tela.
      </p>
      <p>
        Serve para você não ter que abrir o catálogo e testar no escuro. Você procura o que
        precisa, lê a análise, e instala sabendo o que está instalando. Lembrando do que eu falei
        na aula: estar no catálogo não quer dizer que o código foi auditado, então manda o
        repositório para o seu agente olhar antes.
      </p>
      <div class="meta">PDF · 60 páginas · 100 plugins</div>
      <a class="btn" href="${PLUGINS}" download>Baixar a análise</a>
    </div>

    <div class="nota">
      <div class="t">Uma coisa antes de você mexer no squad</div>
      Ele é um ponto de partida, e é genérico de propósito: ele não conhece a sua empresa. Depois
      que estiver rodando, abre o arquivo de alma de cada um e escreve duas linhas sobre o seu
      contexto. Um squad genérico funcionando hoje vale mais do que um squad perfeito que você
      nunca montou.
    </div>

    <p class="rodape">
      Travou em alguma coisa? Leva para o grupo, ou escreve para
      <a href="mailto:${SUPORTE}">${SUPORTE}</a>.<br>
      RedPro AI Academy · Hermes Week
    </p>

  </div>
</div>
`;

export default function HermesWeekMateriaisPage() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
