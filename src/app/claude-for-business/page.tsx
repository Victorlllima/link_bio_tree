import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude for Business — RedPro AI Academy",
  description:
    "8 aulas práticas para configurar o Claude como um sócio que conhece seu negócio, executa seus processos e trabalha enquanto você dorme — sem escrever uma linha de código.",
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/claude-for-business",
    title: "Claude for Business — RedPro AI Academy",
    description:
      "8 aulas práticas para configurar o Claude como um sócio que conhece seu negócio, executa seus processos e trabalha enquanto você dorme.",
    locale: "pt_BR",
  },
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">

<style>
  .cfb-root *, .cfb-root *::before, .cfb-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cfb-root {
    --laranja: #f97316;
    --laranja-dim: #c2500e;
    --preto: #080808;
    --cinza-escuro: #111111;
    --cinza-medio: #1c1c1c;
    --cinza-texto: #8a8a8a;
    --branco: #f5f5f5;
    background: var(--preto);
    color: var(--branco);
    font-family: 'DM Sans', sans-serif;
    font-size: 17px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

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
    background: radial-gradient(ellipse 70% 50% at 50% -10%, rgba(249,115,22,.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .cfb-root .hero-inner {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .cfb-root .badge {
    display: inline-block;
    background: rgba(249,115,22,.12);
    border: 1px solid rgba(249,115,22,.3);
    color: var(--laranja);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 100px;
    margin-bottom: 32px;
  }

  .cfb-root h1 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(36px, 7vw, 72px);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -.02em;
    margin-bottom: 24px;
  }

  .cfb-root h1 em {
    font-style: normal;
    color: var(--laranja);
  }

  .cfb-root .subheadline {
    font-size: clamp(17px, 2.2vw, 21px);
    font-weight: 300;
    color: #c0c0c0;
    max-width: 540px;
    margin: 0 auto 40px;
    line-height: 1.5;
  }

  .cfb-root .proof-strip {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  .cfb-root .proof-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #999;
  }

  .cfb-root .proof-item span.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--laranja);
    flex-shrink: 0;
  }

  .cfb-root .cta-btn {
    display: inline-block;
    background: var(--laranja);
    color: #000;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: 18px;
    padding: 18px 48px;
    border-radius: 8px;
    text-decoration: none;
    transition: background .2s, transform .15s;
    letter-spacing: -.01em;
  }

  .cfb-root .cta-btn:hover {
    background: #ff8533;
    transform: translateY(-2px);
  }

  .cfb-root .cta-note {
    font-size: 13px;
    color: #666;
    margin-top: 14px;
  }

  .cfb-root .section {
    padding: 80px 24px;
  }

  .cfb-root .section-inner {
    max-width: 720px;
    margin: 0 auto;
  }

  .cfb-root .section-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--laranja);
    margin-bottom: 20px;
  }

  .cfb-root h2 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(28px, 4vw, 46px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -.02em;
    margin-bottom: 24px;
  }

  .cfb-root .problema-lista {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 32px;
  }

  .cfb-root .problema-lista li {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    font-size: 16px;
    color: #c0c0c0;
    line-height: 1.5;
  }

  .cfb-root .problema-lista li::before {
    content: '→';
    color: var(--laranja);
    flex-shrink: 0;
    margin-top: 2px;
    font-weight: 700;
  }

  .cfb-root .divider {
    width: 48px;
    height: 3px;
    background: var(--laranja);
    margin: 0 auto 48px;
    border-radius: 2px;
  }

  .cfb-root .blocos {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 48px;
  }

  .cfb-root .bloco {
    background: var(--cinza-escuro);
    border-left: 3px solid var(--laranja);
    padding: 28px 32px;
    border-radius: 0 8px 8px 0;
  }

  .cfb-root .bloco-num {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--laranja);
    margin-bottom: 8px;
  }

  .cfb-root .bloco h3 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 10px;
    letter-spacing: -.01em;
  }

  .cfb-root .bloco p {
    font-size: 15px;
    color: #999;
    line-height: 1.6;
  }

  .cfb-root .aulas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
    margin-top: 40px;
  }

  .cfb-root .aula-card {
    background: var(--cinza-escuro);
    border: 1px solid #1f1f1f;
    border-radius: 8px;
    padding: 20px 24px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .cfb-root .aula-num {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 13px;
    font-weight: 900;
    color: var(--laranja);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .cfb-root .aula-info strong {
    display: block;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--branco);
  }

  .cfb-root .aula-info span {
    font-size: 13px;
    color: #777;
    line-height: 1.4;
  }

  .cfb-root .testimonials {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 40px;
  }

  .cfb-root .testimonial {
    background: var(--cinza-escuro);
    border: 1px solid #1f1f1f;
    border-radius: 10px;
    padding: 24px 28px;
  }

  .cfb-root .testimonial p {
    font-size: 16px;
    color: #d0d0d0;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .cfb-root .testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cfb-root .testimonial-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--cinza-medio);
    border: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: 15px;
    color: var(--laranja);
  }

  .cfb-root .testimonial-name strong {
    display: block;
    font-size: 14px;
    font-weight: 600;
  }

  .cfb-root .testimonial-name span {
    font-size: 12px;
    color: #666;
  }

  .cfb-root .preco-box {
    background: var(--cinza-escuro);
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 40px 40px;
    max-width: 480px;
    margin: 40px auto 0;
    text-align: center;
  }

  .cfb-root .preco-anchor {
    font-size: 14px;
    color: #666;
    text-decoration: line-through;
    margin-bottom: 8px;
  }

  .cfb-root .preco-atual {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 64px;
    font-weight: 900;
    line-height: 1;
    color: var(--branco);
    margin-bottom: 8px;
  }

  .cfb-root .preco-atual sup {
    font-size: 28px;
    vertical-align: super;
    color: var(--laranja);
  }

  .cfb-root .preco-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 32px;
  }

  .cfb-root .garantia {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    color: #888;
    margin-top: 20px;
  }

  .cfb-root .garantia::before {
    content: '🔒';
    font-size: 16px;
  }

  .cfb-root .faq-lista {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 40px;
  }

  .cfb-root .faq-item {
    background: var(--cinza-escuro);
    border-radius: 8px;
    overflow: hidden;
  }

  .cfb-root .faq-item details summary {
    padding: 20px 24px;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .cfb-root .faq-item details summary::after {
    content: '+';
    font-size: 22px;
    color: var(--laranja);
    flex-shrink: 0;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 300;
  }

  .cfb-root .faq-item details[open] summary::after {
    content: '−';
  }

  .cfb-root .faq-item details .faq-body {
    padding: 0 24px 20px;
    font-size: 15px;
    color: #999;
    line-height: 1.6;
  }

  .cfb-root .final-cta {
    padding: 80px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cfb-root .final-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 80% at 50% 100%, rgba(249,115,22,.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .cfb-root .final-cta .section-inner { position: relative; z-index: 1; }

  .cfb-root .sep {
    height: 1px;
    background: linear-gradient(90deg, transparent, #2a2a2a, transparent);
    max-width: 720px;
    margin: 0 auto;
  }

  @media (max-width: 600px) {
    .cfb-root .hero { padding: 60px 20px 48px; min-height: auto; padding-top: 80px; }
    .cfb-root h1 { font-size: clamp(30px, 10vw, 48px); }
    .cfb-root .proof-strip { flex-direction: column; align-items: center; gap: 10px; }
    .cfb-root .aulas-grid { grid-template-columns: 1fr; }
    .cfb-root .preco-box { padding: 28px 20px; }
    .cfb-root .preco-atual { font-size: 52px; }
    .cfb-root .bloco { padding: 20px; }
    .cfb-root .section { padding: 56px 20px; }
  }
</style>

<div class="cfb-root">

  <section class="hero">
    <div class="hero-inner">
      <div class="badge">RedPro AI Academy</div>

      <h1>Pare de usar IA.<br>Comece a ter <em>IA trabalhando</em><br>pelo seu negócio.</h1>

      <p class="subheadline">
        8 aulas práticas para configurar o Claude como um sócio que conhece seu negócio, executa seus processos e trabalha enquanto você dorme — sem escrever uma linha de código.
      </p>

      <div class="proof-strip">
        <div class="proof-item"><span class="dot"></span>8 aulas + tarefas práticas</div>
        <div class="proof-item"><span class="dot"></span>Resultado na primeira semana</div>
        <div class="proof-item"><span class="dot"></span>Acesso vitalício com os combinados</div>
      </div>

      <a href="https://pay.hotmart.com/V105607171C?checkoutMode=10" class="cta-btn">
        Quero começar agora — R$17
      </a>
      <p class="cta-note">Acesso imediato após o pagamento · 7 dias de garantia</p>
    </div>
  </section>

  <div class="sep"></div>

  <section class="section">
    <div class="section-inner">
      <div class="section-label">O problema real</div>
      <h2>Você usa IA.<br>Mas o negócio ainda depende de você.</h2>

      <p style="color:#999; margin-top:8px;">Se você se reconhece em alguma dessas situações, essa aula foi feita para você:</p>

      <ul class="problema-lista">
        <li>Você explica quem você é toda vez que abre o Claude — do zero, como se ele nunca tivesse te visto.</li>
        <li>Usa IA para tarefas soltas, mas o processo continua manual. Semana que vem você pede a mesma coisa de novo.</li>
        <li>Quando você para, o negócio para. Não tem atendimento, não tem proposta, não tem relatório sem você estar lá.</li>
        <li>Já tentou automatizar algo e travou antes de sair do papel — porque parecia coisa de programador.</li>
      </ul>
    </div>
  </section>

  <div class="sep"></div>

  <section class="section">
    <div class="section-inner">
      <div class="section-label">A solução</div>
      <h2>Um sócio que não esquece, não falta e executa exatamente o que você ensinou.</h2>

      <p style="color:#999; margin-top:8px;">O curso está dividido em 3 blocos que constroem um sistema real, aula por aula:</p>

      <div class="blocos">
        <div class="bloco">
          <div class="bloco-num">Bloco 1 — Chat</div>
          <h3>O Claude aprende o seu negócio</h3>
          <p>Você configura memória permanente, instala Skills que rodam sem precisar pedir, e cria Artifacts — entregáveis reais que usa no dia seguinte. Uma vez. Para sempre.</p>
        </div>
        <div class="bloco">
          <div class="bloco-num">Bloco 2 — Cowork</div>
          <h3>O Claude sai da janela de conversa</h3>
          <p>Ele acessa seus arquivos, lê seus documentos, roda tarefas em horários que você define — mesmo quando você está dormindo ou no celular, longe do computador.</p>
        </div>
        <div class="bloco">
          <div class="bloco-num">Bloco 3 — Code</div>
          <h3>O Claude constrói o que você descreve</h3>
          <p>Você descreve em português o que quer automatizar. Ele gera o código. Você vê o resultado funcionando — sem escrever uma linha.</p>
        </div>
      </div>
    </div>
  </section>

  <div class="sep"></div>

  <section class="section">
    <div class="section-inner">
      <div class="section-label">O que você vai aprender</div>
      <h2>8 aulas. Cada uma com uma tarefa real.</h2>

      <div class="aulas-grid">
        <div class="aula-card">
          <span class="aula-num">00</span>
          <div class="aula-info">
            <strong>Os Combinados</strong>
            <span>O contrato que garante acesso vitalício — e por que ele existe.</span>
          </div>
        </div>
        <div class="aula-card">
          <span class="aula-num">01</span>
          <div class="aula-info">
            <strong>Mentalidade AI Business</strong>
            <span>Por que você ainda faz tudo na mão — e como mudar isso hoje.</span>
          </div>
        </div>
        <div class="aula-card">
          <span class="aula-num">02</span>
          <div class="aula-info">
            <strong>Seu Novo Sócio</strong>
            <span>Instalar o Claude Desktop, configurar Project e criar a primeira Skill.</span>
          </div>
        </div>
        <div class="aula-card">
          <span class="aula-num">03</span>
          <div class="aula-info">
            <strong>A Memória do Negócio</strong>
            <span>Ensinar o negócio para o Claude de uma vez, para sempre.</span>
          </div>
        </div>
        <div class="aula-card">
          <span class="aula-num">04</span>
          <div class="aula-info">
            <strong>Seu Primeiro Ativo</strong>
            <span>Criar algo concreto que você usa no dia seguinte — não teoria.</span>
          </div>
        </div>
        <div class="aula-card">
          <span class="aula-num">05</span>
          <div class="aula-info">
            <strong>Claude Fora do Computador</strong>
            <span>Cowork, Scheduled e Dispatch — o Claude rodando sem você.</span>
          </div>
        </div>
        <div class="aula-card">
          <span class="aula-num">06</span>
          <div class="aula-info">
            <strong>Piloto Automático</strong>
            <span>O Claude Code construindo um app de delivery do zero, ao vivo.</span>
          </div>
        </div>
        <div class="aula-card">
          <span class="aula-num">07</span>
          <div class="aula-info">
            <strong>Onde Você Vai a Partir Daqui</strong>
            <span>O que esse curso entrega — e o teto honesto do que vem depois.</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="sep"></div>

  <section class="section">
    <div class="section-inner">
      <div class="section-label">Quem já aplicou</div>
      <h2>Resultados reais de quem saiu da teoria.</h2>

      <div class="testimonials">
        <div class="testimonial">
          <p>"Primeiro dia configurando o Project — o Claude respondeu um cliente no meu tom, com as informações certas, sem eu precisar revisar. Nunca tinha acontecido antes."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">M</div>
            <div class="testimonial-name">
              <strong>Marcela Rodrigues</strong>
              <span>Consultora de marketing digital</span>
            </div>
          </div>
        </div>
        <div class="testimonial">
          <p>"Criei uma Skill de análise de proposta. Agora jogo qualquer briefing e ele me devolve a estrutura do projeto em 30 segundos. Economizo 2 horas por semana só nisso."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">T</div>
            <div class="testimonial-name">
              <strong>Thiago Almeida</strong>
              <span>Agência de design</span>
            </div>
          </div>
        </div>
        <div class="testimonial">
          <p>"Achei que era coisa de programador. Não é. Na Aula 2 já tinha o Project configurado com as regras do meu escritório. Na Aula 3 ele já sabia responder perguntas dos meus clientes."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">C</div>
            <div class="testimonial-name">
              <strong>Cristiane Barros</strong>
              <span>Advogada previdenciária</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="sep"></div>

  <section class="section">
    <div class="section-inner" style="text-align:center;">
      <div class="section-label">Investimento</div>
      <h2>Menos que um almoço.<br>Resultado que dura.</h2>

      <div class="preco-box">
        <p class="preco-anchor">De R$47</p>
        <div class="preco-atual"><sup>R$</sup>17</div>
        <p class="preco-label">Preço de lançamento · Acesso imediato</p>

        <a href="https://pay.hotmart.com/V105607171C?checkoutMode=10" class="cta-btn" style="display:block; width:100%; text-align:center;">
          Começar agora por R$17
        </a>

        <p class="garantia">7 dias de garantia — sem perguntas</p>
      </div>

      <p style="font-size:14px; color:#555; margin-top:24px; max-width:420px; margin-left:auto; margin-right:auto; line-height:1.6;">
        Quem fizer os combinados — seguir o @redpro.ia, preencher a ficha de matrícula e postar resultado — tem acesso vitalício com todas as atualizações futuras.
      </p>
    </div>
  </section>

  <div class="sep"></div>

  <section class="section">
    <div class="section-inner">
      <div class="section-label">Perguntas frequentes</div>
      <h2>Antes de decidir.</h2>

      <div class="faq-lista">
        <div class="faq-item">
          <details>
            <summary>Preciso saber programar?</summary>
            <div class="faq-body">Não. O curso foi feito exatamente para quem não sabe. O Victor — que criou o método — é ex-servidor público sem formação técnica. Tudo que você vai fazer é configurar, escrever em português e testar.</div>
          </details>
        </div>
        <div class="faq-item">
          <details>
            <summary>Precisa ter o Claude pago?</summary>
            <div class="faq-body">O plano gratuito do Claude funciona para começar as primeiras aulas. Para as aulas de Cowork e Code, o plano Pro (R$100/mês) é necessário. O curso vai te mostrar exatamente quando isso importa.</div>
          </details>
        </div>
        <div class="faq-item">
          <details>
            <summary>Quanto tempo por dia preciso dedicar?</summary>
            <div class="faq-body">Cada aula tem entre 12 e 20 minutos. A tarefa leva mais 20 a 40 minutos. Você pode fazer no seu ritmo — mas quem faz uma aula por dia termina em uma semana com o sistema funcionando.</div>
          </details>
        </div>
        <div class="faq-item">
          <details>
            <summary>O acesso vitalício é garantido automaticamente?</summary>
            <div class="faq-body">Não. Tem uma condição: seguir o @redpro.ia, preencher a ficha de matrícula e postar resultado quando tiver. Quem faz isso fica com acesso vitalício e todas as atualizações. Quem não faz tem 3 meses.</div>
          </details>
        </div>
        <div class="faq-item">
          <details>
            <summary>E se eu não gostar?</summary>
            <div class="faq-body">7 dias de garantia total. Pede reembolso, devolvemos 100% sem perguntas. Mas vai ser difícil — a maioria das pessoas tem resultado na segunda aula.</div>
          </details>
        </div>
      </div>
    </div>
  </section>

  <section class="final-cta">
    <div class="section-inner">
      <h2 style="margin-bottom:16px;">Seu negócio não precisa de mais uma ferramenta.<br>Precisa de um sistema.</h2>
      <p class="subheadline" style="margin-bottom:36px;">Comece hoje. O sistema estará rodando antes do final da semana.</p>
      <a href="https://pay.hotmart.com/V105607171C?checkoutMode=10" class="cta-btn">
        Quero meu sistema — R$17
      </a>
      <p class="cta-note">Acesso imediato · 7 dias de garantia · Sem precisar programar</p>
    </div>
  </section>

</div>
`;

export default function ClaudeForBusinessPage() {
  const pixelViewContent = `
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', {
        content_name: 'Claude for Business',
        content_ids: ['V105607171C'],
        content_type: 'product',
        value: 17.00,
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
